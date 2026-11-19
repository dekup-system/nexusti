/* NexIA Core — interações leves, sem dependências */
(function () {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------ âncoras */
  const jumpToHash = () => {
    const id = decodeURIComponent(location.hash.replace(/^#/, ""));
    if (!id) return;
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: "instant", block: "start" });
  };
  jumpToHash();
  window.addEventListener("hashchange", jumpToHash);

  /* ------------------------------------------------------------ header */
  const header = $(".site-header");
  const onScroll = () => header?.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ------------------------------------------------------------ menu mobile */
  const nav = $("#nav");
  const toggle = $("#navToggle");
  const closeNav = () => {
    nav?.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  };
  toggle?.addEventListener("click", () => {
    const open = !nav?.classList.contains("is-open");
    nav?.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("nav-open", open);
  });
  $$("#nav a").forEach((link) => link.addEventListener("click", closeNav));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });

  /* ------------------------------------------------------------ reveal */
  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px" });
    $$(".reveal").forEach((el) => observer.observe(el));
  } else {
    $$(".reveal").forEach((el) => el.classList.add("is-visible"));
  }

  /* ------------------------------------------------------------ contadores */
  const counters = $$("[data-count]");
  if (counters.length) {
    const animate = (el) => {
      const target = Number(el.dataset.count || 0);
      if (!target || reduceMotion) return;
      const start = performance.now();
      const duration = 1100;
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toLocaleString("pt-BR");
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ("IntersectionObserver" in window) {
      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      counters.forEach((el) => counterObserver.observe(el));
    } else {
      counters.forEach(animate);
    }
  }

  /* ------------------------------------------------------------ tabs do produto */
  const panels = $$("[data-panel]");
  const tabs = $$("[data-tab]");
  const content = {
    dashboard: {
      title: "NexIA Core · dashboard",
      heading: "A rede em uma tela.",
      text: "Ativos, achados, postura e identidade. O resumo que a equipe abre primeiro — e entende sem treinamento.",
      list: ["Postura por severidade e camada OSI", "Identidade, DNS, DHCP e Active Directory", "Prioridades do dia e atalhos de ação"],
    },
    security: {
      title: "NexIA Core · segurança",
      heading: "Verificação que não invade.",
      text: "Checagem passiva de exposição sobre os ativos já descobertos, com evidência e recomendação para a equipe aplicar.",
      list: ["SMBv1, Telnet, RDP, SNMP e HTTP admin", "Sem exploit, força bruta ou alteração", "Relatório PDF, CSV e JSON"],
    },
    route: {
      title: "NexIA Core · rota",
      heading: "O caminho até o problema.",
      text: "Gateway, DNS, TCP e HTTPS em sequência. O traceroute mostra o salto onde a conexão para de responder.",
      list: ["Diagnóstico de internet em segundos", "Rota salto a salto com latência", "Evidência pronta para o chamado"],
    },
  };
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const key = tab.dataset.tab;
      tabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", String(active));
      });
      panels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.panel === key));
      const copy = content[key];
      if (copy) {
        const title = $("#stageTitle");
        const heading = $("#stageHeading");
        const text = $("#stageText");
        const list = $("#stageList");
        if (title) title.textContent = copy.title;
        if (heading) heading.textContent = copy.heading;
        if (text) text.textContent = copy.text;
        if (list) list.innerHTML = copy.list.map((item) => `<li>${item}</li>`).join("");
      }
    });
  });

  /* ------------------------------------------------------------ tilt sutil */
  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    const card = $("[data-tilt]");
    if (card) {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `rotateY(${-4 + x * 2.4}deg) rotateX(${1.5 - y * 2}deg)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    }
  }

  /* ------------------------------------------------------------ agradecimento */
  const thanks = $("#obrigado");
  const showThanks = () => {
    if (!thanks) return;
    thanks.hidden = false;
    document.body.classList.add("thanks-mode");
    window.scrollTo(0, 0);
    document.title = "Obrigado — NexIA Core";
  };
  const hideThanks = () => {
    if (!thanks) return;
    thanks.hidden = true;
    document.body.classList.remove("thanks-mode");
  };
  $("#thanksBack")?.addEventListener("click", (event) => {
    event.preventDefault();
    history.replaceState(null, "", location.pathname + location.search);
    hideThanks();
    window.scrollTo(0, 0);
  });
  if (location.hash === "#obrigado") showThanks();
  window.addEventListener("hashchange", () => {
    if (location.hash === "#obrigado") showThanks();
  });

  /* Formulário: envio nativo para o Web3Forms, com redirect para /#obrigado. */

  /* ------------------------------------------------------------ ano */
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ------------------------------------------------------------ diálogos legais */
  const dialog = $("#legalDialog");
  const legal = {
    privacidade: {
      title: "Privacidade",
      body: "<p>O produto NexIA Core opera localmente. Não enviamos inventário, topologia, credenciais ou achados para servidores externos.</p><p>Os dados do produto ficam no banco SQLite da própria máquina, em <code>data/</code>, e os relatórios são gerados localmente. O assistente de IA usa um modelo local via Ollama; nenhuma pergunta é enviada para a nuvem.</p><p>Este site não usa analytics. Quando você envia o formulário de contato, nome, e-mail, empresa e mensagem são usados apenas para responder à solicitação e podem transitar pela Vercel e pelo provedor de e-mail configurado.</p>",
    },
    termos: {
      title: "Termos de uso",
      body: "<p>O NexIA Core é uma ferramenta de observação e auditoria. O uso deve ser autorizado pelo responsável pela rede e limitado ao escopo declarado.</p><p>O produto não executa exploração de falhas, força bruta, negação de serviço ou alteração automática de configuração. As recomendações devem ser aplicadas pela equipe responsável, com janela e rollback.</p><p>A licença é vinculada à máquina e válida pelo prazo emitido.</p>",
    },
    licenca: {
      title: "Licença",
      body: "<p>O NexIA Core oferece um período de avaliação de 7 dias. Após esse prazo, a ativação é feita por licença local assinada (Ed25519), vinculada à máquina.</p><p>A ativação é offline: você importa o arquivo <code>.lic</code> na tela de ativação. Não há servidor de licença nem validação online.</p>",
    },
  };
  const openLegal = (key) => {
    const item = legal[key];
    if (!item || !dialog) return;
    $("#legalTitle").textContent = item.title;
    $("#legalBody").innerHTML = item.body;
    if (typeof dialog.showModal === "function") dialog.showModal();
  };
  $$("[data-legal]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openLegal(link.dataset.legal);
    });
  });
  $(".legal__close")?.addEventListener("click", () => dialog?.close());
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
})();
