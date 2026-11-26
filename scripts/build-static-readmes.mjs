import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  PROFILE,
  LINKS,
  NAV,
  PROJECTS,
  STACK_DOMAINS,
  EXPERIENCE,
  BEYOND_CODE,
  README_VARIANTS,
} from "./data/portfolio.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const MANIFEST_PATH = path.join(REPO_ROOT, "assets", "profile", "manifest.json");

function loadManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error(`Missing manifest at ${MANIFEST_PATH}. Run "node scripts/build-assets.mjs" first.`);
  }
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
}

function inlineMdToHtml(text) {
  return String(text)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function renderTopSwitcher(variant, manifest) {
  const { lang, staticMode } = variant;
  if (lang === "pt" && !staticMode) {
    return [
      `<p align="right">`,
      `  <a href="./README.en.md"><img src="${manifest.links["lang-en"]}" height="44" alt="English" /></a>`,
      `  <a href="./README.static.md"><img src="${manifest.links["mode-static-pt"]}" height="44" alt="Sem movimento" /></a>`,
      `</p>`,
    ].join("\n");
  }
  if (lang === "en" && !staticMode) {
    return [
      `<p align="right">`,
      `  <a href="./README.md"><img src="${manifest.links["lang-pt"]}" height="44" alt="Português" /></a>`,
      `  <a href="./README.en.static.md"><img src="${manifest.links["mode-static-en"]}" height="44" alt="Reduced motion" /></a>`,
      `</p>`,
    ].join("\n");
  }
  if (lang === "pt" && staticMode) {
    return [
      `<p align="right">`,
      `  <a href="./README.en.static.md"><img src="${manifest.links["lang-en"]}" height="44" alt="English (sem movimento)" /></a>`,
      `  <a href="./README.md"><img src="${manifest.links["mode-animated-pt"]}" height="44" alt="Versão animada" /></a>`,
      `</p>`,
    ].join("\n");
  }
  return [
    `<p align="right">`,
    `  <a href="./README.static.md"><img src="${manifest.links["lang-pt"]}" height="44" alt="Português (reduced motion)" /></a>`,
    `  <a href="./README.en.md"><img src="${manifest.links["mode-animated-en"]}" height="44" alt="Animated version" /></a>`,
    `</p>`,
  ].join("\n");
}

function renderHero(variant, manifest) {
  const { lang, staticMode } = variant;
  const heroes = manifest.heroes[lang];
  const alt = PROFILE[lang].heroAlt;

  if (staticMode) {
    return [
      `<p align="center">`,
      `  <picture>`,
      `    <source media="(max-width: 600px)" srcset="${heroes.mobileStatic}" />`,
      `    <img src="${heroes.desktopStatic}" width="960" alt="${alt}" />`,
      `  </picture>`,
      `</p>`,
    ].join("\n");
  }

  return [
    `<p align="center">`,
    `  <picture>`,
    `    <source media="(prefers-reduced-motion: reduce) and (max-width: 600px)" srcset="${heroes.mobileStatic}" />`,
    `    <source media="(prefers-reduced-motion: reduce)" srcset="${heroes.desktopStatic}" />`,
    `    <source media="(max-width: 600px)" srcset="${heroes.mobile}" />`,
    `    <img src="${heroes.desktop}" width="960" alt="${alt}" />`,
    `  </picture>`,
    `</p>`,
  ].join("\n");
}

function renderIdentityAndNav(variant, manifest) {
  const { lang } = variant;
  const copy = PROFILE[lang];
  const navLinks = NAV.map((item) => {
    const anchor = lang === "pt" ? item.ptAnchor : item.enAnchor;
    const slug = lang === "pt" ? item.ptSlug : item.enSlug;
    const alt = lang === "pt" ? item.ptAlt : item.enAlt;
    return `  <a href="${anchor}"><img src="${manifest.links[slug]}" height="44" alt="${alt}" /></a>`;
  }).join("\n");

  const t =
    lang === "pt"
      ? {
          col1: "01 · Perfil & Engenharia",
          col2: "02 · Formação & Atuação",
          col3: "03 · Disponibilidade & Canais",
          edu: "<strong>UNINASSAU</strong> — <em>Análise e Desenvolvimento de Sistemas (ADS · Reta final)</em>",
          work1: "<strong>Skam Tecnologia</strong> — <em>Desenvolvedor Web Freelancer</em> (Web, APIs REST & Deploy)",
          work2: "<strong>Auxiliar de TI</strong> — <em>Infraestrutura, Redes & Sistemas</em>",
          locLabel: "Base",
          modeLabel: "Modelo",
          appsLabel: "Em produção",
          liveWord: "app ao vivo",
        }
      : {
          col1: "01 · Profile & Engineering",
          col2: "02 · Education & Experience",
          col3: "03 · Availability & Channels",
          edu: "<strong>UNINASSAU</strong> — <em>Systems Analysis and Development (ADS · Final term)</em>",
          work1: "<strong>Skam Tecnologia</strong> — <em>Freelance Web Developer</em> (Web, REST APIs & Deploy)",
          work2: "<strong>IT Assistant</strong> — <em>Infrastructure, Networks & Systems</em>",
          locLabel: "Location",
          modeLabel: "Work mode",
          appsLabel: "Featured code",
          liveWord: "live app",
        };

  return [
    `<p align="center">`,
    navLinks,
    `</p>`,
    ``,
    `# ${PROFILE.name}`,
    ``,
    `<table>`,
    `  <tr>`,
    `    <td width="36%" valign="top">`,
    `      <p><strong>${t.col1}</strong></p>`,
    `      <p><strong>${copy.role}</strong></p>`,
    `      <p>${copy.bio}</p>`,
    `    </td>`,
    `    <td width="34%" valign="top">`,
    `      <p><strong>${t.col2}</strong></p>`,
    `      <ul>`,
    `        <li>${t.edu}</li>`,
    `        <li>${t.work1}</li>`,
    `        <li>${t.work2}</li>`,
    `      </ul>`,
    `    </td>`,
    `    <td width="30%" valign="top">`,
    `      <p><strong>${t.col3}</strong></p>`,
    `      <ul>`,
    `        <li><strong>${t.locLabel}:</strong> ${copy.location}</li>`,
    `        <li><strong>${t.modeLabel}:</strong> ${copy.availability}</li>`,
    `        <li><strong>GitHub:</strong> <a href="${LINKS.github}">github.com/ImNotJean01</a></li>`,
    `        <li><strong>LinkedIn:</strong> <a href="${LINKS.linkedin}">linkedin.com/in/jean-santos-902766295</a></li>`,
    `        <li><strong>${t.appsLabel}:</strong> <a href="https://imnotjean01.github.io/Minhas-financas/">Minhas-financas (${t.liveWord})</a> · <a href="https://github.com/ImNotJean01/Rpg-Table">Rpg-Table</a></li>`,
    `      </ul>`,
    `    </td>`,
    `  </tr>`,
    `</table>`,
  ].join("\n");
}

function renderProjects(variant, manifest) {
  const { lang, staticMode } = variant;
  const heading = lang === "pt" ? NAV[0].ptHeading : NAV[0].enHeading;
  const labels =
    lang === "pt"
      ? { highlights: "Destaques Técnicos", stack: "Stack & Tecnologias", status: "Estado & Acesso" }
      : { highlights: "Technical Highlights", stack: "Stack & Technologies", status: "Status & Access" };

  const blocks = [`## ${heading}`];

  for (const project of PROJECTS) {
    const pCopy = project[lang];
    const coverEntry = manifest.projects[project.slug][lang];

    const coverHtml = staticMode
      ? `<img src="${coverEntry.static}" width="960" alt="${pCopy.coverAlt}" />`
      : [
          `<picture>`,
          `  <source media="(prefers-reduced-motion: reduce)" srcset="${coverEntry.static}" />`,
          `  <img src="${coverEntry.animated}" width="960" alt="${pCopy.coverAlt}" />`,
          `</picture>`,
        ].join("\n        ");

    let actionsHtml;
    if (project.links) {
      const actionItems = [];
      if (project.links.live) {
        const liveBtn = manifest.links[`action-live-${lang}`];
        actionItems.push(
          `<a href="${project.links.live}"><img src="${liveBtn}" height="44" alt="${pCopy.liveAlt}" /></a>`
        );
      }
      if (project.links.repo) {
        const repoBtn = manifest.links[`action-repo-${lang}`];
        actionItems.push(
          `<a href="${project.links.repo}"><img src="${repoBtn}" height="44" alt="${pCopy.repoAlt}" /></a>`
        );
      }
      actionsHtml = actionItems.join(" ");
    } else {
      const privateBtn = manifest.links[`status-private-${lang}`];
      actionsHtml = `<img src="${privateBtn}" height="44" alt="${pCopy.privateAlt}" />`;
    }

    const highlightLis = pCopy.highlights
      .map((h) => `        <li>${inlineMdToHtml(h)}</li>`)
      .join("\n");
    const detailsLis = pCopy.detailsBullets
      .map((b) => `          <li>${inlineMdToHtml(b)}</li>`)
      .join("\n");
    const stackCodes = pCopy.stack.map((s) => `<code>${s}</code>`).join(" · ");

    blocks.push(
      [
        `<table>`,
        `  <tr>`,
        `    <td colspan="2" align="center">`,
        `      ${coverHtml}`,
        `    </td>`,
        `  </tr>`,
        `  <tr>`,
        `    <td width="62%" valign="top">`,
        `      <p><strong>${project.index} / ${project.title}</strong> — <em>${pCopy.context}</em></p>`,
        `      <p>${pCopy.description}</p>`,
        `      <p><strong>${labels.highlights}:</strong></p>`,
        `      <ul>`,
        highlightLis,
        `      </ul>`,
        `      <details>`,
        `        <summary>${pCopy.detailsSummary}</summary>`,
        `        <ul>`,
        detailsLis,
        `        </ul>`,
        `      </details>`,
        `    </td>`,
        `    <td width="38%" valign="top">`,
        `      <p><strong>${labels.stack}</strong></p>`,
        `      <p>${stackCodes}</p>`,
        `      <p><strong>${labels.status}</strong></p>`,
        `      <p>${inlineMdToHtml(pCopy.status)}</p>`,
        `      <p>${actionsHtml}</p>`,
        `    </td>`,
        `  </tr>`,
        `</table>`,
      ].join("\n")
    );
  }

  return blocks.join("\n\n");
}

function renderStack(variant, manifest) {
  const { lang } = variant;
  const heading = lang === "pt" ? NAV[1].ptHeading : NAV[1].enHeading;
  const summaryLabel = lang === "pt" ? "Tecnologias" : "Technologies";

  function renderDomainCell(domain, indexStr) {
    const title = lang === "pt" ? domain.ptTitle : domain.enTitle;
    const cards = domain.items
      .map((item) => {
        const fullName = lang === "pt" ? item.ptText : item.enText;
        return `        <img src="${manifest.stack[item.slug]}" width="132" alt="${fullName}" />`;
      })
      .join("\n");
    const summaryText = domain.items
      .map((item) => `<code>${lang === "pt" ? item.ptText : item.enText}</code>`)
      .join(" · ");

    return [
      `    <td width="50%" valign="top">`,
      `      <p><strong>${indexStr} / ${title}</strong></p>`,
      `      <p>`,
      cards,
      `      </p>`,
      `      <p><strong>${summaryLabel}:</strong> ${summaryText}</p>`,
      `    </td>`,
    ].join("\n");
  }

  return [
    `## ${heading}`,
    ``,
    `<table>`,
    `  <tr>`,
    renderDomainCell(STACK_DOMAINS[0], "01"),
    renderDomainCell(STACK_DOMAINS[1], "02"),
    `  </tr>`,
    `  <tr>`,
    renderDomainCell(STACK_DOMAINS[2], "03"),
    renderDomainCell(STACK_DOMAINS[3], "04"),
    `  </tr>`,
    `</table>`,
  ].join("\n");
}

function renderExperience(variant) {
  const { lang } = variant;
  const heading = lang === "pt" ? NAV[2].ptHeading : NAV[2].enHeading;
  const cells = EXPERIENCE[lang]
    .map((entry, idx) => {
      const num = String(idx + 1).padStart(2, "0");
      return [
        `    <td width="33%" valign="top">`,
        `      <p><code>${num} · ${entry.badge}</code></p>`,
        `      <p><strong>${entry.company}</strong><br /><em>${entry.role}</em></p>`,
        `      <p>${entry.description}</p>`,
        `    </td>`,
      ].join("\n");
    })
    .join("\n");

  return [
    `## ${heading}`,
    ``,
    `<table>`,
    `  <tr>`,
    cells,
    `  </tr>`,
    `</table>`,
  ].join("\n");
}

function renderBeyondCode(variant) {
  const { lang } = variant;
  const heading = lang === "pt" ? NAV[3].ptHeading : NAV[3].enHeading;
  const data = BEYOND_CODE[lang];

  const cells = data.items
    .map((item, idx) => {
      const num = String(idx + 1).padStart(2, "0");
      return [
        `    <td width="33%" valign="top">`,
        `      <p><strong>${num} · ${item.label}</strong></p>`,
        `      <p>${item.detail}</p>`,
        `    </td>`,
      ].join("\n");
    })
    .join("\n");

  return [
    `## ${heading}`,
    ``,
    `<table>`,
    `  <tr>`,
    cells,
    `  </tr>`,
    `  <tr>`,
    `    <td colspan="3">`,
    `      <details>`,
    `        <summary>${data.summary}</summary>`,
    `        <pre><code>${data.tree.join("\n")}</code></pre>`,
    `      </details>`,
    `    </td>`,
    `  </tr>`,
    `</table>`,
  ].join("\n");
}

function renderContactAndFooter(variant, manifest) {
  const { lang, staticMode } = variant;
  const copy = PROFILE[lang];
  const contactHeading = lang === "pt" ? NAV[4].ptHeading : NAV[4].enHeading;
  const footers = manifest.footers[lang];

  const t =
    lang === "pt"
      ? {
          col1: "Canais Diretos & Disponibilidade",
          col2: "Repositórios Públicos & Documentação",
          liveWord: "app ao vivo",
          designDoc: "Documentação do design",
        }
      : {
          col1: "Direct Channels & Availability",
          col2: "Public Repositories & Documentation",
          liveWord: "live app",
          designDoc: "Profile design docs",
        };

  const footerBlock = staticMode
    ? [
        `<p align="center">`,
        `  <img src="${footers.static}" width="960" alt="${copy.footerAlt}" />`,
        `</p>`,
      ].join("\n")
    : [
        `<p align="center">`,
        `  <picture>`,
        `    <source media="(prefers-reduced-motion: reduce)" srcset="${footers.static}" />`,
        `    <img src="${footers.animated}" width="960" alt="${copy.footerAlt}" />`,
        `  </picture>`,
        `</p>`,
      ].join("\n");

  const bottomLinks =
    lang === "pt"
      ? [
          `<p align="center">`,
          `  <a href="./README.md">Português</a> ·`,
          `  <a href="./README.en.md">English</a> ·`,
          `  <a href="./README.static.md">Sem movimento</a> ·`,
          `  <a href="./README.en.static.md">Reduced motion</a> ·`,
          `  <a href="./docs/PROFILE_DESIGN.md">Design do perfil</a> ·`,
          `  <a href="#top">Voltar ao topo ↑</a>`,
          `</p>`,
        ].join("\n")
      : [
          `<p align="center">`,
          `  <a href="./README.md">Português</a> ·`,
          `  <a href="./README.en.md">English</a> ·`,
          `  <a href="./README.static.md">Reduced motion (PT)</a> ·`,
          `  <a href="./README.en.static.md">Reduced motion (EN)</a> ·`,
          `  <a href="./docs/PROFILE_DESIGN.md">Profile design</a> ·`,
          `  <a href="#top">Back to top ↑</a>`,
          `</p>`,
        ].join("\n");

  return [
    `## ${contactHeading}`,
    ``,
    `<table>`,
    `  <tr>`,
    `    <td width="55%" valign="top">`,
    `      <p><strong>${t.col1}</strong></p>`,
    `      <p>${copy.contactMessage}</p>`,
    `      <p>`,
    `        <a href="${LINKS.github}"><img src="${manifest.links["contact-github"]}" height="44" alt="GitHub — ImNotJean01" /></a>`,
    `        <a href="${LINKS.linkedin}"><img src="${manifest.links["contact-linkedin"]}" height="44" alt="LinkedIn — Jean Santos" /></a>`,
    `      </p>`,
    `    </td>`,
    `    <td width="45%" valign="top">`,
    `      <p><strong>${t.col2}</strong></p>`,
    `      <ul>`,
    `        <li><strong>GitHub:</strong> <a href="${LINKS.github}">github.com/ImNotJean01</a></li>`,
    `        <li><strong>LinkedIn:</strong> <a href="${LINKS.linkedin}">linkedin.com/in/jean-santos-902766295</a></li>`,
    `        <li><strong>Minhas Finanças:</strong> <a href="https://imnotjean01.github.io/Minhas-financas/">${t.liveWord}</a> · <a href="https://github.com/ImNotJean01/Minhas-financas">repositório</a></li>`,
    `        <li><strong>RPG Table (VTT):</strong> <a href="https://github.com/ImNotJean01/Rpg-Table">github.com/ImNotJean01/Rpg-Table</a></li>`,
    `        <li><strong>Design System:</strong> <a href="./docs/PROFILE_DESIGN.md">${t.designDoc}</a></li>`,
    `      </ul>`,
    `    </td>`,
    `  </tr>`,
    `</table>`,
    ``,
    footerBlock,
    ``,
    bottomLinks,
  ].join("\n");
}

function buildReadme(variant, manifest) {
  const sections = [
    renderTopSwitcher(variant, manifest),
    renderHero(variant, manifest),
    renderIdentityAndNav(variant, manifest),
    renderProjects(variant, manifest),
    renderStack(variant, manifest),
    renderExperience(variant),
    renderBeyondCode(variant),
    renderContactAndFooter(variant, manifest),
  ];

  return sections.join("\n\n").replaceAll("\r\n", "\n") + "\n";
}

function main() {
  const manifest = loadManifest();
  for (const variant of README_VARIANTS) {
    const content = buildReadme(variant, manifest);
    const outPath = path.join(REPO_ROOT, variant.filename);
    fs.writeFileSync(outPath, content, "utf8");
  }
  console.log(
    `[build-static-readmes] Generated ${README_VARIANTS.map((v) => v.filename).join(", ")}`
  );
}

main();
