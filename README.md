# NexusTI — landing page

Site institucional estático do **NexusTI / NetGuard AI**, feito para importar direto na Vercel.

## Stack

- HTML, CSS e JavaScript puros — sem build, sem framework, sem dependências de runtime.
- Tipografia: Sora, Manrope e Instrument Serif (Google Fonts).
- Tema derivado da logomarca: preto profundo, bronze, areia e creme.
- Responsivo (desktop, tablet e mobile), com menu acessível, abas do produto, FAQ e diálogos legais.

## Rodar localmente

```powershell
python -m http.server 8088
```

Abra `http://127.0.0.1:8088`.

## Publicar na Vercel

1. Importe o repositório `dekup-system/nexusti` na Vercel.
2. Framework preset: **Other**.
3. Build command: vazio.
4. Output directory: `.` (raiz).
5. Deploy.

O `vercel.json` já define `cleanUrls` e cache longo para `/assets`.

## Estrutura

```text
.
├── index.html
├── styles.css
├── script.js
├── vercel.json
├── .env.example
├── api/
│   └── lead.js
├── robots.txt
├── site.webmanifest
├── assets/
│   ├── brand-mark.png
│   ├── favicon.png
│   ├── apple-touch.png
│   ├── og.jpg
│   ├── img/
│   │   ├── hero.jpg       # ilustração gerada por IA
│   │   └── topology.jpg   # ilustração gerada por IA
│   └── shots/             # capturas reais do produto
└── docs/
    ├── preview-desktop.jpg
    ├── preview-form.jpg
    └── preview-mobile.jpg
```

## Imagens

- `assets/img/hero.jpg` e `assets/img/topology.jpg`: geradas com **FLUX.1-schnell** (Hugging Face) para esta página, com prompts de rede, bronze e fundo escuro.
- `assets/shots/*`: capturas reais do produto NexusTI.
- Logomarca e favicon: ativos oficiais da marca.

## Conteúdo

A página apresenta:

- descoberta, topologia, auditoria de postura e diagnóstico;
- IA local via Ollama;
- verificação passiva de segurança;
- relatórios PDF/CSV/JSON;
- limites de escopo e princípios de operação;
- trial de 7 dias e licença local assinada;
- públicos: TI interna, empresas e consultorias;
- contato e FAQ.

## Ajustes antes de publicar

- Troque o `canonical` e o `og:url` pelo domínio final.
- Confirme o e-mail de contato em `index.html` (`mtresdsistemas@gmail.com`).
- O formulário envia para `/api/lead`; configure `RESEND_API_KEY` e `LEAD_TO` na Vercel (veja abaixo). Sem configuração, ele oferece fallback por e-mail.
- A página não usa analytics por padrão.

## Formulário de contato

A seção **Contato** tem um formulário que envia para `POST /api/lead`
(`api/lead.js`), com validação no cliente e no servidor, honeypot e limite
simples de requisições.

Na Vercel, configure em **Settings → Environment Variables**:

| Variável | Obrigatória | Função |
|---|---|---|
| `RESEND_API_KEY` | sim (para e-mail) | chave da [Resend](https://resend.com) |
| `LEAD_TO` | sim | destinatário; aceita vírgula |
| `LEAD_FROM` | recomendada | remetente verificado, ex. `NexusTI <contato@seudominio.com>` |
| `LEAD_WEBHOOK_URL` | opcional | se definido, envia o JSON para um webhook em vez de e-mail |

Sem `RESEND_API_KEY`/`LEAD_TO`, a API responde **503** e a página oferece o
fallback por e-mail com os dados preenchidos — o formulário nunca “engole” a
mensagem.

Para testar localmente, rode apenas o estático: o envio cai no fallback de
e-mail. Para testar o endpoint, use `vercel dev` com as variáveis acima.

## Licença

Conteúdo e marca NexusTI. Código da landing page disponibilizado para uso do projeto.
