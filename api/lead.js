/**
 * Recebe o formulário da landing e encaminha por e-mail (Resend) ou webhook.
 *
 * Variáveis na Vercel:
 *   RESEND_API_KEY   chave da Resend
 *   LEAD_TO          destinatário (pode separar por vírgula)
 *   LEAD_FROM        remetente verificado, ex. "NexusTI <contato@seudominio.com>"
 *   LEAD_WEBHOOK_URL opcional: recebe o JSON em vez de e-mail
 *
 * Sem configuração, responde 503; a página oferece o fallback por e-mail.
 */

const MAX = 12_000;
const RATE = new Map(); // instância efêmera; suficiente para conter abuso simples

function clean(value, max = 500) {
  return String(value || "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[char]));
}

function clientIp(req) {
  return String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "").split(",")[0].trim();
}

function limited(ip) {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const entry = RATE.get(ip) || { start: now, count: 0 };
  if (now - entry.start > windowMs) { entry.start = now; entry.count = 0; }
  entry.count += 1;
  RATE.set(ip, entry);
  return entry.count > 8;
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método não permitido." });
    return;
  }
  const ip = clientIp(req);
  if (limited(ip)) {
    res.status(429).json({ error: "Muitas solicitações. Tente novamente mais tarde." });
    return;
  }
  let data = req.body;
  if (typeof data === "string") {
    try { data = JSON.parse(data); } catch (_) { data = null; }
  }
  if (!data || typeof data !== "object") {
    res.status(400).json({ error: "Dados inválidos." });
    return;
  }
  if (JSON.stringify(data).length > MAX) {
    res.status(413).json({ error: "Mensagem muito grande." });
    return;
  }
  if (data.website) { // honeypot
    res.status(200).json({ ok: true });
    return;
  }

  const lead = {
    name: clean(data.name, 120),
    email: clean(data.email, 160),
    company: clean(data.company, 140),
    role: clean(data.role, 100),
    network: clean(data.network, 80),
    message: clean(data.message, 1200),
    consent: data.consent === true || data.consent === "true" || data.consent === "on",
    source: clean(data.source, 40) || "landing",
    at: new Date().toISOString(),
    ip,
    user_agent: clean(req.headers["user-agent"], 300),
  };

  if (!lead.name || !lead.company || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email) || !lead.consent) {
    res.status(400).json({ error: "Preencha nome, e-mail corporativo, empresa e consentimento." });
    return;
  }

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (!response.ok) throw new Error(`webhook ${response.status}`);
      res.status(200).json({ ok: true });
      return;
    } catch (error) {
      console.error("lead webhook failed", error.message);
      res.status(502).json({ error: "Não foi possível encaminhar agora." });
      return;
    }
  }

  const key = process.env.RESEND_API_KEY;
  const to = (process.env.LEAD_TO || "").split(",").map((item) => item.trim()).filter(Boolean);
  const from = process.env.LEAD_FROM || "NexusTI <onboarding@resend.dev>";
  if (!key || !to.length) {
    res.status(503).json({
      error: "Formulário ainda não configurado.",
      mailto: "mtresdsistemas@gmail.com",
    });
    return;
  }

  const lines = [
    `Nome: ${lead.name}`,
    `E-mail: ${lead.email}`,
    `Empresa: ${lead.company}`,
    `Cargo: ${lead.role || "—"}`,
    `Rede: ${lead.network || "—"}`,
    "",
    lead.message || "(sem mensagem)",
    "",
    `Origem: ${lead.source} · ${lead.at}`,
    `IP: ${lead.ip || "—"}`,
  ];
  const html = `
    <div style="font-family:Segoe UI,Arial,sans-serif;background:#0c0b08;color:#f1e6d7;padding:24px">
      <h2 style="margin:0 0 16px;color:#c49a6c">Nova solicitação — NexusTI</h2>
      <table style="border-collapse:collapse;font-size:14px">
        ${[
          ["Nome", lead.name], ["E-mail", lead.email], ["Empresa", lead.company],
          ["Cargo", lead.role || "—"], ["Rede", lead.network || "—"],
        ].map(([label, value]) => `<tr><td style="padding:4px 18px 4px 0;color:#ab9c89">${label}</td><td>${escapeHtml(value)}</td></tr>`).join("")}
      </table>
      <p style="margin:18px 0 6px;color:#ab9c89">Necessidade</p>
      <p style="white-space:pre-wrap;line-height:1.6">${escapeHtml(lead.message || "—")}</p>
      <hr style="border:0;border-top:1px solid #2a231b;margin:20px 0" />
      <p style="font-size:12px;color:#776b5b">${escapeHtml(lead.at)} · ${escapeHtml(lead.source)} · ${escapeHtml(lead.ip || "")}</p>
    </div>`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: lead.email,
        subject: `Demonstração NexusTI — ${lead.company}`,
        text: lines.join("\n"),
        html,
      }),
    });
    if (!response.ok) {
      const detail = await response.text();
      console.error("resend failed", response.status, detail.slice(0, 300));
      res.status(502).json({ error: "Não foi possível enviar o e-mail agora." });
      return;
    }
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("lead send failed", error.message);
    res.status(502).json({ error: "Não foi possível enviar agora." });
  }
};
