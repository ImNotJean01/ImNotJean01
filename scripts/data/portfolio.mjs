export const PALETTE = Object.freeze({
  abyss: "#090a10",
  surface: "#10121a",
  line: "#1c202e",
  soul: "#ececef",
  mist: "#858b9c",
  silk: "#d4b483",
  spirit: "#7ce8ff",
});

export const ALLOWED_HEXES = new Set(Object.values(PALETTE));

export const TYPOGRAPHY = Object.freeze({
  serif: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
  sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
});

export const LINKS = Object.freeze({
  github: "https://github.com/ImNotJean01",
  linkedin: "https://www.linkedin.com/in/jean-santos-902766295/",
});

// Constructed dynamically so forbidden literal strings never appear in source
export const FORBIDDEN_STRINGS = Object.freeze([
  ["jeanmarinho2005", "gmail.com"].join("@"),
  ["mail", "to:"].join(""),
  ["workers", "dev"].join("."),
]);

export const FORBIDDEN_EXTERNAL_IMAGE_HOSTS = Object.freeze([
  "shields.io",
  "img.shields.io",
  "komarev.com",
  "github-readme-stats",
  "streak-stats",
  "skillicons.dev",
  "badgen.net",
  "capsule-render",
]);

export const PROFILE = Object.freeze({
  name: "Jean Marinho dos Santos",
  handle: "ImNotJean01",
  monogram: "JS",
  copyrightYear: "2026",
  pt: Object.freeze({
    role: "Desenvolvedor Full-Stack & Mobile · Arquitetura Web, APIs REST & IA",
    roleHeroLines: Object.freeze([
      "FULL-STACK & MOBILE · ARQUITETURA WEB",
      "APIS REST & IA GENERATIVA",
    ]),
    location: "Cacoal, RO — Brasil",
    availability: "Disponível para remoto",
    tagline:
      "Desenvolvimento de sistemas web e mobile com foco em arquitetura limpa, APIs REST e IA generativa aplicada.",
    taglineDesktopLines: Object.freeze([
      "Desenvolvimento de sistemas web e mobile com foco em",
      "arquitetura limpa, APIs REST e IA generativa aplicada.",
    ]),
    taglineMobileLines: Object.freeze([
      "Desenvolvimento de sistemas web e",
      "mobile com foco em arquitetura limpa,",
      "APIs REST e IA generativa aplicada.",
    ]),
    heroIslands: Object.freeze([
      { index: "01", label: "FOCO TÉCNICO", value: "Full-Stack & Mobile", sub: "APIs REST · Dados · LLMs" },
      { index: "02", label: "FORMAÇÃO", value: "ADS · UNINASSAU", sub: "Graduação · Reta final" },
      { index: "03", label: "ATUAÇÃO", value: "Skam Tecnologia", sub: "Web · Deploy · APIs" },
    ]),
    bio: "Graduando em Análise e Desenvolvimento de Sistemas pela UNINASSAU. Atuo na construção de aplicações web, mobile e back-end — combinando modelagem de dados, padrões arquiteturais e integrações com LLMs para entregar software estável e de fácil manutenção.",
    heroMeta: "UNINASSAU · ADS · IMNOTJEAN01 · 05 PROJETOS · 04 DOMÍNIOS",
    heroMetaMobile: "UNINASSAU · ADS · IMNOTJEAN01",
    heroAlt:
      "Jean Marinho dos Santos — Desenvolvedor Full-Stack & Mobile · Abyss // Silk & Spirit",
    footerHeadline: "Disponível para projetos e desenvolvimento remoto.",
    footerAlt:
      "Rodapé de contato — Jean Marinho dos Santos · GitHub e LinkedIn",
    backToTop: "VOLTAR AO TOPO ↑",
    contactMessage:
      "Disponível para novos projetos, colaborações técnicas e oportunidades de desenvolvimento remoto.",
    publicActivityTitle: "Atividade pública",
  }),
  en: Object.freeze({
    role: "Full-Stack & Mobile Developer · Web Architecture, REST APIs & AI",
    roleHeroLines: Object.freeze([
      "FULL-STACK & MOBILE · WEB ARCHITECTURE",
      "REST APIS & APPLIED GENERATIVE AI",
    ]),
    location: "Cacoal, RO — Brazil",
    availability: "Available for remote",
    tagline:
      "Building web and mobile systems focused on clean architecture, REST APIs, and applied generative AI.",
    taglineDesktopLines: Object.freeze([
      "Building web and mobile systems focused on",
      "clean architecture, REST APIs, and applied generative AI.",
    ]),
    taglineMobileLines: Object.freeze([
      "Building web and mobile systems",
      "focused on clean architecture, REST",
      "APIs, and applied generative AI.",
    ]),
    heroIslands: Object.freeze([
      { index: "01", label: "CORE FOCUS", value: "Full-Stack & Mobile", sub: "REST APIs · Data · LLMs" },
      { index: "02", label: "EDUCATION", value: "ADS · UNINASSAU", sub: "Degree · Final term" },
      { index: "03", label: "EXPERIENCE", value: "Skam Tecnologia", sub: "Web · Deploy · APIs" },
    ]),
    bio: "B.Sc. candidate in Systems Analysis and Development at UNINASSAU. I build web, mobile, and back-end applications — combining relational data modeling, architectural patterns, and LLM integrations to deliver reliable, maintainable software.",
    heroMeta: "UNINASSAU · ADS · IMNOTJEAN01 · 05 PROJECTS · 04 DOMAINS",
    heroMetaMobile: "UNINASSAU · ADS · IMNOTJEAN01",
    heroAlt:
      "Jean Marinho dos Santos — Full-Stack & Mobile Developer · Abyss // Silk & Spirit",
    footerHeadline: "Available for new projects and remote engineering.",
    footerAlt:
      "Contact footer — Jean Marinho dos Santos · GitHub and LinkedIn",
    backToTop: "BACK TO TOP ↑",
    contactMessage:
      "Available for new projects, technical collaborations, and remote software engineering opportunities.",
    publicActivityTitle: "Public activity",
  }),
});

export const NAV = Object.freeze([
  {
    key: "projects",
    ptNavLabel: "01 · PROJETOS",
    enNavLabel: "01 · PROJECTS",
    ptAlt: "Projetos",
    enAlt: "Projects",
    ptHeading: "Projetos selecionados",
    enHeading: "Selected projects",
    ptAnchor: "#projetos-selecionados",
    enAnchor: "#selected-projects",
    ptSlug: "nav-projects-pt",
    enSlug: "nav-projects-en",
    ptWidth: 138,
    enWidth: 138,
  },
  {
    key: "stack",
    ptNavLabel: "02 · STACK",
    enNavLabel: "02 · STACK",
    ptAlt: "Stack",
    enAlt: "Stack",
    ptHeading: "Stack & domínios técnicos",
    enHeading: "Stack & technical domains",
    ptAnchor: "#stack--domínios-técnicos",
    enAnchor: "#stack--technical-domains",
    ptSlug: "nav-stack-pt",
    enSlug: "nav-stack-en",
    ptWidth: 116,
    enWidth: 116,
  },
  {
    key: "experience",
    ptNavLabel: "03 · TRAJETÓRIA",
    enNavLabel: "03 · BACKGROUND",
    ptAlt: "Trajetória",
    enAlt: "Background",
    ptHeading: "Trajetória & formação",
    enHeading: "Background & education",
    ptAnchor: "#trajetória--formação",
    enAnchor: "#background--education",
    ptSlug: "nav-experience-pt",
    enSlug: "nav-experience-en",
    ptWidth: 158,
    enWidth: 164,
  },
  {
    key: "beyondCode",
    ptNavLabel: "04 · NOTAS",
    enNavLabel: "04 · NOTES",
    ptAlt: "Notas",
    enAlt: "Notes",
    ptHeading: "Além do código",
    enHeading: "Beyond code",
    ptAnchor: "#além-do-código",
    enAnchor: "#beyond-code",
    ptSlug: "nav-beyond-pt",
    enSlug: "nav-beyond-en",
    ptWidth: 116,
    enWidth: 116,
  },
  {
    key: "contact",
    ptNavLabel: "05 · CONTATO",
    enNavLabel: "05 · CONTACT",
    ptAlt: "Contato",
    enAlt: "Contact",
    ptHeading: "Contato",
    enHeading: "Contact",
    ptAnchor: "#contato",
    enAnchor: "#contact",
    ptSlug: "nav-contact-pt",
    enSlug: "nav-contact-en",
    ptWidth: 132,
    enWidth: 132,
  },
]);

export const LINK_BUTTONS = Object.freeze([
  {
    slug: "lang-en",
    label: "ENGLISH",
    width: 102,
    accent: "spirit",
    active: false,
    leftTag: "LANG",
  },
  {
    slug: "lang-pt",
    label: "PORTUGUÊS",
    width: 116,
    accent: "spirit",
    active: false,
    leftTag: "IDIOMA",
  },
  {
    slug: "mode-static-pt",
    label: "SEM MOVIMENTO",
    width: 148,
    accent: "silk",
    active: false,
    leftTag: "MODO",
  },
  {
    slug: "mode-static-en",
    label: "REDUCED MOTION",
    width: 156,
    accent: "silk",
    active: false,
    leftTag: "MODE",
  },
  {
    slug: "mode-animated-pt",
    label: "VERSÃO ANIMADA",
    width: 156,
    accent: "spirit",
    active: true,
    leftTag: "MODO",
  },
  {
    slug: "mode-animated-en",
    label: "ANIMATED",
    width: 114,
    accent: "spirit",
    active: true,
    leftTag: "MODE",
  },
  {
    slug: "contact-github",
    label: "GITHUB · IMNOTJEAN01",
    width: 214,
    accent: "silk",
    active: true,
    icon: "github",
    arrow: "↗",
  },
  {
    slug: "contact-linkedin",
    label: "LINKEDIN · JEAN SANTOS",
    width: 228,
    accent: "spirit",
    active: true,
    icon: "linkedin",
    arrow: "↗",
  },
  {
    slug: "action-live-pt",
    label: "ACESSAR APLICAÇÃO",
    width: 204,
    accent: "spirit",
    active: true,
    arrow: "↗",
  },
  {
    slug: "action-repo-pt",
    label: "REPOSITÓRIO",
    width: 156,
    accent: "silk",
    active: true,
    arrow: "↗",
  },
  {
    slug: "action-live-en",
    label: "LIVE APP",
    width: 132,
    accent: "spirit",
    active: true,
    arrow: "↗",
  },
  {
    slug: "action-repo-en",
    label: "REPOSITORY",
    width: 150,
    accent: "silk",
    active: true,
    arrow: "↗",
  },
  {
    slug: "status-private-pt",
    label: "PROJETO PRIVADO · VITRINE",
    width: 244,
    accent: "mist",
    active: false,
    icon: "lock",
  },
  {
    slug: "status-private-en",
    label: "PRIVATE PROJECT · SHOWCASE",
    width: 252,
    accent: "mist",
    active: false,
    icon: "lock",
  },
]);

export const PROJECTS = Object.freeze([
  {
    index: "01",
    slug: "01-psychat",
    coverBase: "project-01-psychat",
    title: "PsyChat",
    previewType: "psychat",
    coverTags: ["React Native", "Expo", "Node.js", "Supabase"],
    pt: {
      context: "Aplicativo Mobile & IA",
      description:
        "Aplicativo mobile de suporte emocional integrando chat contextualizado com IA e localização de clínicas próximas.",
      coverDescLines: [
        "Aplicativo mobile de suporte emocional com chat",
        "contextualizado por IA e localização de clínicas",
        "próximas via Supabase e back-end Node.js.",
      ],
      specLines: [
        "01 · App React Native + Expo em TypeScript",
        "02 · Chat contextual IA via back-end Node.js",
        "03 · Auth Supabase + geolocalização de clínicas",
      ],
      highlights: [
        "Aplicativo multiplataforma desenvolvido em React Native + Expo com TypeScript",
        "Chat contextualizado conectado a APIs de IA via back-end em Node.js",
        "Persistência e autenticação no Supabase com geolocalização de clínicas próximas",
      ],
      stack: [
        "React Native",
        "Expo",
        "TypeScript",
        "Node.js",
        "Supabase",
        "APIs de IA",
        "Geolocalização",
      ],
      status:
        "Projeto privado · vitrine de arquitetura mobile & IA (sem repositório público)",
      privateAlt: "Projeto privado — vitrine de arquitetura mobile & IA",
      detailsSummary: "Detalhes de arquitetura e fluxo — PsyChat",
      detailsBullets: [
        "`01 / Chat Contextual IA`: Fluxo conversacional em React Native + Expo conectado a APIs de LLMs via back-end Node.js, com histórico e autenticação no Supabase.",
        "`02 / Clínicas Próximas`: Descoberta por geolocalização para localização rápida de atendimento próximo.",
      ],
      coverAlt:
        "Capa SVG do projeto 01 PsyChat — chat contextual com IA e radar de clínicas próximas",
    },
    en: {
      context: "Mobile App & AI",
      description:
        "Mobile emotional support application combining context-aware AI chat with nearby clinic discovery.",
      coverDescLines: [
        "Mobile emotional support app combining",
        "context-aware AI chat with nearby clinic",
        "discovery powered by Node.js and Supabase.",
      ],
      specLines: [
        "01 · React Native + Expo app in TypeScript",
        "02 · Context-aware AI chat via Node.js API",
        "03 · Supabase auth + nearby clinic geolocation",
      ],
      highlights: [
        "Cross-platform mobile app built with React Native + Expo and TypeScript",
        "Context-aware conversational flow connected to LLM APIs through a Node.js back-end",
        "Auth and persistence powered by Supabase with nearby clinic geolocation",
      ],
      stack: [
        "React Native",
        "Expo",
        "TypeScript",
        "Node.js",
        "Supabase",
        "AI APIs",
        "Geolocation",
      ],
      status:
        "Private project · mobile & AI architecture showcase (no public repository)",
      privateAlt: "Private project — mobile & AI architecture showcase",
      detailsSummary: "Architecture & flow details — PsyChat",
      detailsBullets: [
        "`01 / Context-Aware Chat`: React Native + Expo conversational UI wired to LLM APIs via a Node.js back-end, with Supabase auth and persistence.",
        "`02 / Nearby Clinics`: Geolocation-assisted clinic discovery for nearby emotional support.",
      ],
      coverAlt:
        "Project 01 PsyChat SVG cover — context-aware AI chat and nearby clinics radar",
    },
    links: null,
  },
  {
    index: "02",
    slug: "02-minhas-financas",
    coverBase: "project-02-minhas-financas",
    title: "Minhas Finanças",
    previewType: "financas",
    coverTags: ["JavaScript", "Supabase", "Postgres", "GitHub Pages"],
    pt: {
      context: "Aplicação Web · Supabase",
      description:
        "Aplicação web de gestão financeira pessoal hospedada no GitHub Pages, com autenticação de usuários e persistência de dados via Supabase.",
      coverDescLines: [
        "Aplicação web de gestão financeira pessoal no",
        "GitHub Pages, com autenticação e persistência",
        "em Postgres gerenciado pelo Supabase.",
      ],
      specLines: [
        "01 · Login e isolamento por usuário via Supabase",
        "02 · Persistência relacional em banco Postgres",
        "03 · Filtros de entradas, saídas e saldo real",
      ],
      highlights: [
        "Autenticação segura e persistência em banco Postgres gerenciado pelo Supabase",
        "Controle de receitas, despesas e saldo consolidado em interface direta e leve",
      ],
      stack: [
        "JavaScript",
        "Supabase (Auth/Postgres)",
        "HTML5/CSS3",
        "GitHub Pages",
      ],
      status: "Publicado no GitHub Pages · código aberto",
      liveAlt: "Acessar aplicação Minhas Finanças",
      repoAlt: "Repositório Minhas-financas no GitHub",
      detailsSummary: "Detalhes da aplicação e fluxos — Minhas Finanças",
      detailsBullets: [
        "`Autenticação & Banco`: Fluxo de login e isolamento por usuário via Supabase Auth + Postgres.",
        "`Fluxo Financeiro`: Lançamentos e filtros por período/categoria (`Todos`, `Entradas`, `Saídas`), com cálculo direto de saldo consolidado e entrega estática no GitHub Pages.",
        "Links diretos: [Aplicação ao vivo](https://imnotjean01.github.io/Minhas-financas/) · [github.com/ImNotJean01/Minhas-financas](https://github.com/ImNotJean01/Minhas-financas)",
      ],
      coverAlt:
        "Capa SVG do projeto 02 Minhas Finanças — fluxo financeiro com Supabase Auth e Postgres",
    },
    en: {
      context: "Web App · Supabase",
      description:
        "Personal finance web application hosted on GitHub Pages, featuring user authentication and data persistence via Supabase.",
      coverDescLines: [
        "Personal finance web app hosted on GitHub",
        "Pages, featuring user authentication and",
        "Postgres data persistence via Supabase.",
      ],
      specLines: [
        "01 · User-scoped auth via Supabase Auth",
        "02 · Relational Postgres ledger persistence",
        "03 · Direct income, expense & balance filters",
      ],
      highlights: [
        "User authentication and Postgres persistence managed through Supabase",
        "Clean interface for tracking income, expenses, and consolidated balance",
      ],
      stack: [
        "JavaScript",
        "Supabase (Auth/Postgres)",
        "HTML5/CSS3",
        "GitHub Pages",
      ],
      status: "Live on GitHub Pages · open source",
      liveAlt: "Open Minhas Finanças live app",
      repoAlt: "Minhas-financas GitHub repository",
      detailsSummary: "Application & flow details — Minhas Finanças",
      detailsBullets: [
        "`Auth & Persistence`: User-scoped authentication and Postgres storage managed through Supabase.",
        "`Ledger Flow`: Income/expense tracking with `All` / `Income` / `Expenses` filtering, consolidated balance calculation, and static GitHub Pages delivery.",
        "Direct links: [Live app](https://imnotjean01.github.io/Minhas-financas/) · [github.com/ImNotJean01/Minhas-financas](https://github.com/ImNotJean01/Minhas-financas)",
      ],
      coverAlt:
        "Project 02 Minhas Finanças SVG cover — personal finance ledger with Supabase Auth and Postgres",
    },
    links: {
      live: "https://imnotjean01.github.io/Minhas-financas/",
      repo: "https://github.com/ImNotJean01/Minhas-financas",
    },
  },
  {
    index: "03",
    slug: "03-nexo-rh",
    coverBase: "project-03-nexo-rh",
    title: "Nexo RH",
    previewType: "nexo",
    coverTags: ["DDD & CQRS", "SQL", "UML", "DORA Metrics"],
    pt: {
      context: "Arquitetura Limpa & Web",
      description:
        "Sistema web de gestão de Recursos Humanos estruturado com arquitetura limpa, modelagem relacional, padrões DDD/CQRS e acompanhamento de métricas DORA.",
      coverDescLines: [
        "Sistema web de gestão de RH com arquitetura",
        "limpa, modelagem relacional SQL, padrões",
        "DDD/CQRS e métricas de engenharia DORA.",
      ],
      specLines: [
        "01 · Isolamento de domínio com DDD, CQRS e UML",
        "02 · Esquema relacional SQL focado em consistência",
        "03 · Painel de métricas de engenharia DORA",
      ],
      highlights: [
        "Separação de responsabilidades em camadas com DDD, CQRS e diagramação UML",
        "Modelagem relacional SQL focada em consistência e escalabilidade das rotinas de RH",
        "Acompanhamento de indicadores de engenharia DORA integrado à visão do sistema",
      ],
      stack: [
        "Arquitetura Back-end",
        "DDD & CQRS",
        "SQL / Modelagem Relacional",
        "UML",
        "Front-end Web",
      ],
      status: "Projeto privado · vitrine arquitetural (sem repositório público)",
      privateAlt: "Projeto privado — vitrine arquitetural",
      detailsSummary: "Camadas DDD/CQRS e métricas DORA — Nexo RH",
      detailsBullets: [
        "`01 · Interface Web`: Colaboradores · Avaliações · Indicadores.",
        "`02 · Domínio DDD & CQRS`: Commands · Queries · Regras de Domínio com diagramação UML.",
        "`03 · Persistência Relacional SQL`: Modelagem de entidades (`employees`, `departments`, `metrics`) e visão de métricas DORA (`Deploy Frequency`, `Lead Time for Changes`, `Change Failure Rate`, `MTTR`).",
      ],
      coverAlt:
        "Capa SVG do projeto 03 Nexo RH — métricas DORA e arquitetura DDD, CQRS e SQL",
    },
    en: {
      context: "Clean Architecture & Web",
      description:
        "Human Resources management system designed around clean architecture, relational modeling, DDD/CQRS patterns, and DORA engineering metrics.",
      coverDescLines: [
        "Human Resources platform designed with clean",
        "architecture, relational SQL modeling, DDD",
        "and CQRS patterns, plus DORA metrics.",
      ],
      specLines: [
        "01 · Domain isolation with DDD, CQRS & UML",
        "02 · Relational SQL schema built for consistency",
        "03 · Integrated DORA engineering metrics view",
      ],
      highlights: [
        "Layered domain isolation with DDD, CQRS, and UML specification",
        "Relational SQL modeling tailored for data integrity and scalability",
        "DORA metrics tracking integrated into the platform engineering view",
      ],
      stack: [
        "Back-end Architecture",
        "DDD & CQRS",
        "SQL / Relational Modeling",
        "UML",
        "Web Front-end",
      ],
      status: "Private project · architectural showcase (no public repository)",
      privateAlt: "Private project — architectural showcase",
      detailsSummary: "DDD/CQRS layers & DORA metrics — Nexo RH",
      detailsBullets: [
        "`01 · Web Interface`: Employees · Reviews · Indicators.",
        "`02 · DDD & CQRS Domain`: Commands · Queries · Domain rules specified via UML.",
        "`03 · Relational SQL Persistence`: Relational schema (`employees`, `departments`, `metrics`) paired with DORA engineering indicators (`Deploy Frequency`, `Lead Time for Changes`, `Change Failure Rate`, `MTTR`).",
      ],
      coverAlt:
        "Project 03 Nexo RH SVG cover — DORA metrics and DDD, CQRS and SQL architecture",
    },
    links: null,
  },
  {
    index: "04",
    slug: "04-media-hub",
    coverBase: "project-04-media-hub",
    title: "Media Hub",
    previewType: "mediahub",
    coverTags: ["TypeScript", "DDD & CQRS", "Serverless", "Edge REST"],
    pt: {
      context: "DDD, CQRS & Serverless",
      description:
        "Projeto voltado à aplicação prática de arquitetura limpa, separação de comandos e consultas (CQRS), modelagem de domínio (DDD) e deploy serverless.",
      coverDescLines: [
        "Projeto voltado à separação entre escrita",
        "(Commands) e leitura otimizada (Queries),",
        "modelagem DDD e execução stateless na borda.",
      ],
      specLines: [
        "01 · Pipelines separados para Commands e Queries",
        "02 · Regras de negócio encapsuladas em DDD",
        "03 · Deploy stateless em Cloudflare e Vercel",
      ],
      highlights: [
        "Fluxos desacoplados entre escrita (Commands) e leitura otimizada (Queries)",
        "Execução stateless pensada para borda serverless na Cloudflare e Vercel",
      ],
      stack: [
        "TypeScript",
        "DDD & CQRS",
        "Serverless",
        "REST APIs",
        "Cloudflare / Vercel",
      ],
      status:
        "Projeto privado · vitrine de arquitetura serverless (sem repositório público)",
      privateAlt: "Projeto privado — vitrine serverless",
      detailsSummary: "Pipelines Command vs Query — Media Hub",
      detailsBullets: [
        "`01 / Command (Escrita)`: `Handler HTTP / Edge` → `Domínio DDD` → `Write Store`.",
        "`02 / Query (Leitura)`: `Edge Cache` → `Query Handler` → `Resposta JSON`.",
      ],
      coverAlt:
        "Capa SVG do projeto 04 Media Hub — pipelines CQRS Command e Query serverless",
    },
    en: {
      context: "DDD, CQRS & Serverless",
      description:
        "Architecture-driven project applying clean separation of commands and queries (CQRS), Domain-Driven Design (DDD), and serverless deployment.",
      coverDescLines: [
        "Architecture-driven system separating write",
        "commands from read-optimized queries with",
        "DDD modeling and stateless edge deployment.",
      ],
      specLines: [
        "01 · Decoupled Command and Query pipelines",
        "02 · Business invariants encapsulated in DDD",
        "03 · Stateless edge deploy on Cloudflare/Vercel",
      ],
      highlights: [
        "Decoupled write commands and read-optimized query pipelines",
        "Stateless edge execution targeting Cloudflare Workers and Vercel",
      ],
      stack: [
        "TypeScript",
        "DDD & CQRS",
        "Serverless",
        "REST APIs",
        "Cloudflare / Vercel",
      ],
      status: "Private project · serverless architecture showcase (no public repository)",
      privateAlt: "Private project — serverless showcase",
      detailsSummary: "Command vs Query pipelines — Media Hub",
      detailsBullets: [
        "`01 / Command (Write)`: `HTTP / Edge Handler` → `DDD Domain` → `Write Store`.",
        "`02 / Query (Read)`: `Edge Cache` → `Query Handler` → `JSON Response`.",
      ],
      coverAlt:
        "Project 04 Media Hub SVG cover — CQRS Command and Query serverless pipelines",
    },
    links: null,
  },
  {
    index: "05",
    slug: "05-rpg-table",
    coverBase: "project-05-rpg-table",
    title: "RPG Table",
    previewType: "rpgtable",
    coverTags: ["React", "Vite", "Supabase", "Realtime VTT"],
    pt: {
      context: "Mesa Virtual de RPG · Supabase",
      description:
        "Mesa virtual (VTT) em tempo real para campanhas de RPG de mesa com suporte a Ordem Paranormal, D&D 5e, Tormenta 20 e sistema Genérico, alternância visual entre tema neutro e paranormal, tabuleiro tático interativo e sincronização via Supabase.",
      coverDescLines: [
        "Mesa virtual (VTT) em tempo real para D&D 5e,",
        "Ordem Paranormal, Tormenta 20 e Genérico com",
        "tabuleiro tático e sincronização Supabase.",
      ],
      specLines: [
        "01 · Ordem Paranormal, D&D 5e, Tormenta 20 e Genérico",
        "02 · Tabuleiro tático e gerador de masmorras",
        "03 · Dados e fichas em tempo real via Supabase",
      ],
      highlights: [
        "Suporte multi-sistema (Ordem Paranormal, D&D 5e, Tormenta 20 e Genérico) com alternância de tema visual (`neutro` / `paranormal`)",
        "Tabuleiro tático interativo com gerador procedural de masmorras, carimbos, alfinetes, texturas e histórico de ações",
        "Hub de campanhas, rolador de dados, rastreador de iniciativa e fichas dinâmicas com condições sincronizadas em tempo real via Supabase (Auth, Postgres e Realtime)",
        "Testes automatizados e pipeline de CI/deploy com GitHub Actions / GitHub Pages",
      ],
      stack: [
        "React",
        "JavaScript",
        "Vite",
        "Supabase (Auth / Postgres / Realtime)",
        "Testes Automatizados",
        "GitHub Actions / Pages",
      ],
      status:
        "Código aberto no GitHub ([ImNotJean01/Rpg-Table](https://github.com/ImNotJean01/Rpg-Table))",
      repoAlt: "Repositório Rpg-Table no GitHub",
      detailsSummary: "Sistemas, tabuleiro tático e tempo real — Rpg-Table",
      detailsBullets: [
        "`Sistemas & Tema`: Regras e fichas para **Ordem Paranormal**, **D&D 5e**, **Tormenta 20** e modo **Genérico**, com troca visual `neutro` / `paranormal`.",
        "`Tabuleiro Tático`: Gerador procedural de masmorras, carimbos, alfinetes, texturas de mapa e histórico de ações na mesa.",
        "`Sessão em Tempo Real`: Hub de campanhas, rolador de dados, rastreador de iniciativa e fichas dinâmicas com condições sincronizadas por **Supabase Auth**, **Postgres** e **Realtime**.",
        "`Engenharia`: Front-end em **React + JavaScript + Vite**, suíte de **testes automatizados** e workflow de **GitHub Actions / GitHub Pages**.",
        "Repositório: [github.com/ImNotJean01/Rpg-Table](https://github.com/ImNotJean01/Rpg-Table)",
      ],
      coverAlt:
        "Capa SVG do projeto 05 RPG Table — mesa virtual com tabuleiro tático, D&D 5e, Ordem Paranormal, Tormenta 20 e Supabase Realtime",
    },
    en: {
      context: "Real-Time VTT · Supabase",
      description:
        "Real-time virtual tabletop (VTT) for RPG campaigns supporting Ordem Paranormal, D&D 5e, Tormenta 20, and Generic systems, featuring a visual theme toggle (neutral / paranormal), interactive tactical board, and Supabase real-time sync.",
      coverDescLines: [
        "Real-time virtual tabletop for D&D 5e, Ordem",
        "Paranormal, Tormenta 20 & Generic with tactical",
        "dungeon board and Supabase Realtime sync.",
      ],
      specLines: [
        "01 · Ordem Paranormal, D&D 5e, Tormenta 20 & Generic",
        "02 · Tactical board + procedural dungeon generator",
        "03 · Real-time dice & sheets via Supabase Realtime",
      ],
      highlights: [
        "Multi-system support (Ordem Paranormal, D&D 5e, Tormenta 20, and Generic) with visual theme toggle (`neutro` / `paranormal`)",
        "Interactive tactical board with procedural dungeon generator, stamps, pins, textures, and action history",
        "Campaign hub, dice roller, initiative tracker, and dynamic character sheets with conditions synced in real time via Supabase (Auth, Postgres, Realtime)",
        "Automated test suite and GitHub Actions / GitHub Pages workflow",
      ],
      stack: [
        "React",
        "JavaScript",
        "Vite",
        "Supabase (Auth / Postgres / Realtime)",
        "Automated Tests",
        "GitHub Actions / Pages",
      ],
      status:
        "Open source on GitHub ([ImNotJean01/Rpg-Table](https://github.com/ImNotJean01/Rpg-Table))",
      repoAlt: "Rpg-Table GitHub repository",
      detailsSummary: "Systems, tactical board & real-time sync — Rpg-Table",
      detailsBullets: [
        "`Systems & Visual Mode`: Rulesets for **Ordem Paranormal**, **D&D 5e**, **Tormenta 20**, and **Generic** campaigns with `neutro` / `paranormal` theme switching.",
        "`Tactical Board`: Procedural dungeon generator, stamps, pins, map textures, and action history.",
        "`Real-Time Tabletop`: Campaign hub, dice roller, initiative tracker, and dynamic character sheets with status conditions backed by **Supabase Auth**, **Postgres**, and **Realtime**.",
        "`Engineering`: Built with **React + JavaScript + Vite**, backed by **automated tests** and a **GitHub Actions / GitHub Pages** workflow.",
        "Repository: [github.com/ImNotJean01/Rpg-Table](https://github.com/ImNotJean01/Rpg-Table)",
      ],
      coverAlt:
        "Project 05 RPG Table SVG cover — virtual tabletop with tactical grid, D&D 5e, Ordem Paranormal, Tormenta 20 and Supabase Realtime",
    },
    links: {
      repo: "https://github.com/ImNotJean01/Rpg-Table",
    },
  },
]);

export const STACK_DOMAINS = Object.freeze([
  {
    key: "languages",
    ptTitle: "Linguagens",
    enTitle: "Languages",
    accent: "silk",
    items: [
      { slug: "typescript", label: "TypeScript", subtitle: "LANG · TYPED", ptText: "TypeScript", enText: "TypeScript" },
      { slug: "javascript", label: "JavaScript", subtitle: "LANG · ES2024", ptText: "JavaScript", enText: "JavaScript" },
      { slug: "python", label: "Python", subtitle: "LANG · AI / AUTO", ptText: "Python", enText: "Python" },
      { slug: "java", label: "Java", subtitle: "LANG · JVM / OOP", ptText: "Java", enText: "Java" },
      { slug: "php", label: "PHP", subtitle: "LANG · WEB / MVC", ptText: "PHP", enText: "PHP" },
      { slug: "sql", label: "SQL", subtitle: "DATA · SCHEMA", ptText: "SQL", enText: "SQL" },
    ],
  },
  {
    key: "frontend-mobile",
    ptTitle: "Front-end & Mobile",
    enTitle: "Front-end & Mobile",
    accent: "spirit",
    items: [
      { slug: "react", label: "React", subtitle: "UI · STATE", ptText: "React", enText: "React" },
      { slug: "react-native", label: "React Native", subtitle: "MOBILE · NATIVE", ptText: "React Native", enText: "React Native" },
      { slug: "expo", label: "Expo", subtitle: "MOBILE · SDK", ptText: "Expo", enText: "Expo" },
      { slug: "vite", label: "Vite", subtitle: "BUILD · TOOL", ptText: "Vite", enText: "Vite" },
      { slug: "tailwind-css", label: "Tailwind CSS", subtitle: "CSS · UTILITY", ptText: "Tailwind CSS", enText: "Tailwind CSS" },
      { slug: "nativewind", label: "NativeWind", subtitle: "MOBILE · CSS", ptText: "NativeWind", enText: "NativeWind" },
    ],
  },
  {
    key: "backend-data",
    ptTitle: "Back-end & Dados",
    enTitle: "Back-end & Data",
    accent: "silk",
    items: [
      { slug: "nodejs", label: "Node.js", subtitle: "RUNTIME · JS", ptText: "Node.js", enText: "Node.js" },
      { slug: "express", label: "Express", subtitle: "API · REST", ptText: "Express", enText: "Express" },
      { slug: "codeigniter-4", label: "CodeIgniter 4", subtitle: "PHP · MVC", ptText: "CodeIgniter 4", enText: "CodeIgniter 4" },
      { slug: "supabase", label: "Supabase", subtitle: "AUTH · PGSQL", ptText: "Supabase (Auth/Postgres)", enText: "Supabase (Auth/Postgres)" },
      { slug: "mongodb", label: "MongoDB", subtitle: "NOSQL · DOCS", ptText: "MongoDB", enText: "MongoDB" },
      { slug: "mysql", label: "MySQL", subtitle: "RDBMS · SQL", ptText: "MySQL", enText: "MySQL" },
      { slug: "apache-hop", label: "Apache Hop", subtitle: "ETL · PIPELINE", ptText: "Apache Hop (ETL)", enText: "Apache Hop (ETL)" },
    ],
  },
  {
    key: "infra-cloud-ai",
    ptTitle: "Infra, Cloud & IA",
    enTitle: "Infra, Cloud & AI",
    accent: "spirit",
    items: [
      { slug: "docker", label: "Docker", subtitle: "CONTAINERS", ptText: "Docker", enText: "Docker" },
      { slug: "git-github", label: "Git & GitHub", subtitle: "VCS · WORKFLOW", ptText: "Git & GitHub", enText: "Git & GitHub" },
      { slug: "gitlab-cicd", label: "GitLab CI/CD", subtitle: "CI/CD · PIPE", ptText: "GitLab CI/CD", enText: "GitLab CI/CD" },
      { slug: "cloudflare", label: "Cloudflare", subtitle: "EDGE · WORKERS", ptText: "Cloudflare (Pages/Workers)", enText: "Cloudflare (Pages/Workers)" },
      { slug: "vercel", label: "Vercel", subtitle: "CLOUD · DEPLOY", ptText: "Vercel", enText: "Vercel" },
      { slug: "llm-apis", label: "LLMs & Prompt", subtitle: "AI · PROMPTS", ptText: "APIs de LLMs & Engenharia de Prompt", enText: "LLM APIs & Prompt Engineering" },
    ],
  },
]);

export const EXPERIENCE = Object.freeze({
  pt: [
    {
      index: "01",
      company: "Skam Tecnologia",
      role: "Desenvolvedor Web Freelancer",
      badge: "EXPERIÊNCIA",
      accent: "silk",
      lines: [
        "Desenvolvimento web e manutenção",
        "evolutiva em produção, deploy e",
        "integrações de APIs REST e IA.",
      ],
      tags: ["WEB", "REST APIS", "DEPLOY"],
      description:
        "Desenvolvimento web, manutenção evolutiva e corretiva de sistemas em produção, deploy de aplicações e integrações de APIs REST com apoio de IA generativa no fluxo técnico.",
    },
    {
      index: "02",
      company: "Auxiliar de TI",
      role: "Infraestrutura & Sistemas",
      badge: "EXPERIÊNCIA",
      accent: "silk",
      lines: [
        "Diagnóstico e manutenção de",
        "hardware, software, redes locais",
        "e padronização de ambientes.",
      ],
      tags: ["REDES", "HARDWARE", "SISTEMAS"],
      description:
        "Configuração, diagnóstico e manutenção de hardware, software, redes locais e padronização de ambientes.",
    },
    {
      index: "03",
      company: "UNINASSAU",
      role: "Análise e Desenv. de Sistemas",
      badge: "FORMAÇÃO · RETA FINAL",
      accent: "spirit",
      lines: [
        "Graduação em ADS com foco em",
        "engenharia de software, bancos",
        "de dados e arquitetura limpa.",
      ],
      tags: ["ADS", "ARQUITETURA", "SQL"],
      description:
        "Formação em engenharia de software, modelagem de bancos de dados, arquitetura de sistemas, padrões de projeto e desenvolvimento web e mobile.",
    },
  ],
  en: [
    {
      index: "01",
      company: "Skam Tecnologia",
      role: "Freelance Web Developer",
      badge: "EXPERIENCE",
      accent: "silk",
      lines: [
        "Web development, evolutionary",
        "maintenance in production, deploy",
        "pipelines, and REST APIs.",
      ],
      tags: ["WEB", "REST APIS", "DEPLOY"],
      description:
        "Web development, corrective and evolutionary maintenance of production systems, deployment pipelines, and REST API integrations.",
    },
    {
      index: "02",
      company: "IT Assistant",
      role: "Infrastructure & Systems",
      badge: "EXPERIENCE",
      accent: "silk",
      lines: [
        "Hardware and software diagnostics,",
        "local network administration, and",
        "environment standardization.",
      ],
      tags: ["NETWORKS", "HARDWARE", "SYSTEMS"],
      description:
        "Hardware and software diagnostics, local network administration, system setup, and environment standardization.",
    },
    {
      index: "03",
      company: "UNINASSAU",
      role: "Systems Analysis & Dev. (ADS)",
      badge: "DEGREE · FINAL TERM",
      accent: "spirit",
      lines: [
        "Undergraduate degree focused on",
        "software engineering, relational",
        "databases, and clean architecture.",
      ],
      tags: ["ADS", "ARCHITECTURE", "SQL"],
      description:
        "Undergraduate degree focused on software engineering, relational database modeling, system architecture, design patterns, and web/mobile development.",
    },
  ],
});

export const BEYOND_CODE = Object.freeze({
  terminalHeader: "jean@abyss:~ / sistemas",
  pt: {
    summary: "Sistemas & referências — jean@abyss:~ / sistemas",
    islands: [
      {
        index: "01",
        label: "ESTRATÉGIA & SISTEMAS",
        accent: "silk",
        lines: [
          "Sistemas estruturados, telemetria e",
          "criação de campanhas investigativas",
          "com mistério e loops temporais.",
        ],
        tags: ["XADREZ", "FÓRMULA 1", "MESTRE DE RPG", "D&D 5E", "ORDEM PARANORMAL"],
      },
      {
        index: "02",
        label: "REFERÊNCIAS & ATMOSFERA",
        accent: "spirit",
        lines: [
          "Estética noturna e precisa de jogos",
          "indie, ficção científica densa e",
          "universos de fantasia sombria.",
        ],
        tags: ["HOLLOW KNIGHT", "CELESTE", "BLADE RUNNER 2049", "INTERSTELLAR", "WARHAMMER 40K"],
      },
      {
        index: "03",
        label: "TRILHA DE FOCO",
        accent: "silk",
        lines: [
          "Instrumental técnico, texturas",
          "densas de shoegaze japonês, rock",
          "psicodélico e sonoridade noturna.",
        ],
        tags: ["POLYPHIA", "MASS OF THE FERMENTING DREGS", "TAME IMPALA", "CITY POP"],
      },
    ],
    tree: [
      "jean@abyss:~ / sistemas",
      "├── Estrategia & Sistemas",
      "│   ├── Xadrez & Formula 1",
      "│   └── RPG de mesa (D&D 5e & Ordem Paranormal — misterio investigativo, horror e loops temporais)",
      "├── Referencias & Atmosfera",
      "│   ├── Jogos: Celeste · Hollow Knight / Silksong",
      "│   ├── Sci-fi: Interstellar · Tenet · Blade Runner 2049 · Cyberpunk: Edgerunners",
      "│   └── Lore: Warhammer 40k",
      "└── Trilha de Foco",
      "    └── Polyphia · Mass of the Fermenting Dregs · Tame Impala · City Pop",
    ],
    items: [
      {
        label: "Estratégia & Sistemas",
        detail:
          "Xadrez, Fórmula 1 e criação de sistemas e narrativas como mestre de RPG de mesa (D&D 5e e Ordem Paranormal — campanhas autorais de mistério investigativo, horror e loops temporais).",
      },
      {
        label: "Referências & Atmosfera",
        detail:
          "Estética precisa e contemplativa de jogos como Celeste e Hollow Knight / Silksong, ficção científica densa (Interstellar, Tenet, Blade Runner 2049, Cyberpunk: Edgerunners) e lore de Warhammer 40k.",
      },
      {
        label: "Trilha de Foco",
        detail:
          "Rock progressivo (Polyphia), shoegaze japonês (Mass of the Fermenting Dregs), rock psicodélico (Tame Impala) e City Pop.",
      },
    ],
  },
  en: {
    summary: "Systems & influences — jean@abyss:~ / sistemas",
    islands: [
      {
        index: "01",
        label: "STRATEGY & SYSTEMS",
        accent: "silk",
        lines: [
          "Structured systems, telemetry, and",
          "investigative tabletop RPG campaigns",
          "built around mystery and time loops.",
        ],
        tags: ["CHESS", "FORMULA 1", "TABLETOP RPG GM", "D&D 5E", "ORDEM PARANORMAL"],
      },
      {
        index: "02",
        label: "REFERENCES & CRAFT",
        accent: "spirit",
        lines: [
          "Nocturnal precision from indie",
          "platformers, dense sci-fi cinema,",
          "and dark science-fantasy lore.",
        ],
        tags: ["HOLLOW KNIGHT", "CELESTE", "BLADE RUNNER 2049", "INTERSTELLAR", "WARHAMMER 40K"],
      },
      {
        index: "03",
        label: "FOCUS SOUNDTRACK",
        accent: "silk",
        lines: [
          "Technical progressive guitar, dense",
          "Japanese shoegaze textures, psych",
          "rock, and nocturnal City Pop.",
        ],
        tags: ["POLYPHIA", "MASS OF THE FERMENTING DREGS", "TAME IMPALA", "CITY POP"],
      },
    ],
    tree: [
      "jean@abyss:~ / sistemas",
      "├── Strategy & Systems",
      "│   ├── Chess & Formula 1",
      "│   └── Tabletop RPG GMing (D&D 5e & Ordem Paranormal — investigative mystery, horror & time loops)",
      "├── Visual & Narrative Craft",
      "│   ├── Games: Celeste · Hollow Knight / Silksong",
      "│   ├── Sci-fi: Interstellar · Tenet · Blade Runner 2049 · Cyberpunk: Edgerunners",
      "│   └── Lore: Warhammer 40k",
      "└── Focus Soundtrack",
      "    └── Polyphia · Mass of the Fermenting Dregs · Tame Impala · City Pop",
    ],
    items: [
      {
        label: "Strategy & Systems",
        detail:
          "Chess, Formula 1, and tabletop RPG game mastering (D&D 5e and Ordem Paranormal — original campaigns built around investigative mystery, horror, and time loops).",
      },
      {
        label: "Visual & Narrative Craft",
        detail:
          "Atmospheric precision from games like Celeste and Hollow Knight / Silksong, dense sci-fi (Interstellar, Tenet, Blade Runner 2049, Cyberpunk: Edgerunners), and Warhammer 40k lore.",
      },
      {
        label: "Soundtrack",
        detail:
          "Progressive rock (Polyphia), Japanese shoegaze (Mass of the Fermenting Dregs), psychedelic rock (Tame Impala), and City Pop.",
      },
    ],
  },
});

export const README_VARIANTS = Object.freeze([
  { filename: "README.md", lang: "pt", staticMode: false },
  { filename: "README.en.md", lang: "en", staticMode: false },
  { filename: "README.static.md", lang: "pt", staticMode: true },
  { filename: "README.en.static.md", lang: "en", staticMode: true },
]);
