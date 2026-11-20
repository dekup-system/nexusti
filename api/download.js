const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

/**
 * Redireciona o botão "Baixar Trial" para uma URL assinada do R2.
 * O bucket pode permanecer privado; a assinatura expira em 1 hora.
 *
 * Variáveis na Vercel:
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY
 *   R2_BUCKET (padrão: nexiacore)
 *   R2_KEY (padrão: NexIA-Core-Setup-1.0.4.exe)
 */
module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.status(405).json({ error: "Método não permitido." });
    return;
  }
  const account = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET || "nexiacore";
  const key = process.env.R2_KEY || "NexIA-Core-Setup-1.0.4.exe";
  const filename = key.split("/").pop() || "NexIA-Core-Setup.exe";
  if (!account || !accessKeyId || !secretAccessKey) {
    res.status(503).json({ error: "Download do trial ainda não configurado." });
    return;
  }
  try {
    const client = new S3Client({
      region: process.env.R2_REGION || "auto",
      endpoint: `https://${account}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle: true,
    });
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      ResponseContentType: "application/x-msdownload",
      ResponseContentDisposition: `attachment; filename="${filename}"`,
    });
    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    res.statusCode = 302;
    res.setHeader("Location", url);
    res.end();
  } catch (error) {
    console.error("download sign failed", error.message);
    res.status(502).json({ error: "Não foi possível preparar o download." });
  }
};
