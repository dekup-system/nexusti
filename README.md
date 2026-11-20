# NexIA Core — landing page

Site institucional estático do **NexIA Core / Inteligência de rede**, feito para importar direto na Vercel.

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

1. Importe o repositório `repositório do projeto` na Vercel.
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
├── package.json
├── api/
│   └── download.js
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
- `assets/shots/*`: capturas reais do produto NexIA Core.
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
- O formulário envia direto para o **Web3Forms** usando a access key configurada em `index.html`; a chave é pública por natureza.
- A página não usa analytics por padrão.

## Formulário de contato

A seção **Contato** tem o título **Solicitar Orçamento** e envia direto para o
Web3Forms, sem função na Vercel:

- endpoint: `https://api.web3forms.com/submit`;
- access key pública configurada no formulário;
- destinatário: e-mail cadastrado na conta Web3Forms;
- sucesso: redireciona para `/#obrigado`;
- o Web3Forms exibe a página de erro/validação quando o envio falha.

Para trocar o destinatário, altere o e-mail na conta Web3Forms — não é necessário
mexer no código.

## Página de agradecimento

`/#obrigado` exibe a confirmação em tela cheia, com retorno ao site. O formulário
faz `history.pushState` para essa URL após o envio bem-sucedido.

## Download do trial

O botão **Baixar Trial** aponta para `/api/download`, que gera uma URL assinada
do R2 por 1 hora. O bucket pode permanecer privado.

Configure na Vercel:

| Variável | Valor |
|---|---|
| `R2_ACCOUNT_ID` | `0a94cfefc7f57c57da1d8d1ab1b35b59` |
| `R2_ACCESS_KEY_ID` | access key do R2 |
| `R2_SECRET_ACCESS_KEY` | secret do R2 |
| `R2_BUCKET` | `nexiacore` |
| `R2_KEY` | `NexIA-Core-Setup-1.0.3.exe` |

O instalador está no bucket `nexiacore`, objeto
`NexIA-Core-Setup-1.0.3.exe` (28,9 MB).

## Licença

Conteúdo e marca NexIA Core. Código da landing page disponibilizado para uso do projeto.
