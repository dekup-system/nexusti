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
- públicos: TI interna, universidades e consultorias;
- contato e FAQ.

## Ajustes antes de publicar

- Troque o `canonical` e o `og:url` pelo domínio final.
- Confirme o e-mail de contato em `index.html` (`mtresdsistemas@gmail.com`).
- Se quiser um formulário real, conecte o botão de demonstração a um serviço (Formspree, Resend, HubSpot etc.).
- A página não coleta dados nem usa analytics por padrão.

## Licença

Conteúdo e marca NexusTI. Código da landing page disponibilizado para uso do projeto.
