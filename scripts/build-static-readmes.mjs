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

function renderHeroAndNav(variant, manifest) {
  const { lang, staticMode } = variant;
  const heroes = manifest.heroes[lang];
  const alt = PROFILE[lang].heroAlt;

  const heroPicture = staticMode
    ? [
        `<p align="center">`,
        `  <picture>`,
        `    <source media="(max-width: 600px)" srcset="${heroes.mobileStatic}" />`,
        `    <img src="${heroes.desktopStatic}" width="960" alt="${alt}" />`,
        `  </picture>`,
        `</p>`,
      ].join("\n")
    : [
        `<p align="center">`,
        `  <picture>`,
        `    <source media="(prefers-reduced-motion: reduce) and (max-width: 600px)" srcset="${heroes.mobileStatic}" />`,
        `    <source media="(prefers-reduced-motion: reduce)" srcset="${heroes.desktopStatic}" />`,
        `    <source media="(max-width: 600px)" srcset="${heroes.mobile}" />`,
        `    <img src="${heroes.desktop}" width="960" alt="${alt}" />`,
        `  </picture>`,
        `</p>`,
      ].join("\n");

  const navLinks = NAV.map((item) => {
    const anchor = lang === "pt" ? item.ptAnchor : item.enAnchor;
    const slug = lang === "pt" ? item.ptSlug : item.enSlug;
    const altText = lang === "pt" ? item.ptAlt : item.enAlt;
    return `  <a href="${anchor}"><img src="${manifest.links[slug]}" height="44" alt="${altText}" /></a>`;
  }).join("\n");

  return [
    heroPicture,
    ``,
    `<p align="center">`,
    navLinks,
    `</p>`,
  ].join("\n");
}

function renderProjects(variant, manifest) {
  const { lang, staticMode } = variant;
  const heading = lang === "pt" ? NAV[0].ptHeading : NAV[0].enHeading;

  const blocks = [`## ${heading}`];

  for (const project of PROJECTS) {
    const pCopy = project[lang];
    const coverEntry = manifest.projects[project.slug][lang];

    const coverBlock = staticMode
      ? [
          `<p align="center">`,
          `  <img src="${coverEntry.static}" width="960" alt="${pCopy.coverAlt}" />`,
          `</p>`,
        ].join("\n")
      : [
          `<p align="center">`,
          `  <picture>`,
          `    <source media="(prefers-reduced-motion: reduce)" srcset="${coverEntry.static}" />`,
          `    <img src="${coverEntry.animated}" width="960" alt="${pCopy.coverAlt}" />`,
          `  </picture>`,
          `</p>`,
        ].join("\n");

    let actionsBlock;
    if (project.links) {
      const actionItems = [];
      if (project.links.live) {
        const liveBtn = manifest.links[`action-live-${lang}`];
        actionItems.push(
          `  <a href="${project.links.live}"><img src="${liveBtn}" height="44" alt="${pCopy.liveAlt}" /></a>`
        );
      }
      if (project.links.repo) {
        const repoBtn = manifest.links[`action-repo-${lang}`];
        actionItems.push(
          `  <a href="${project.links.repo}"><img src="${repoBtn}" height="44" alt="${pCopy.repoAlt}" /></a>`
        );
      }
      actionsBlock = `<p align="center">\n${actionItems.join("\n")}\n</p>`;
    } else {
      const privateBtn = manifest.links[`status-private-${lang}`];
      actionsBlock = `<p align="center">\n  <img src="${privateBtn}" height="44" alt="${pCopy.privateAlt}" />\n</p>`;
    }

    blocks.push([coverBlock, actionsBlock].join("\n"));
  }

  return blocks.join("\n\n");
}

function renderStack(variant, manifest) {
  const { lang } = variant;
  const heading = lang === "pt" ? NAV[1].ptHeading : NAV[1].enHeading;

  const blocks = [`## ${heading}`];

  for (const domain of STACK_DOMAINS) {
    const title = lang === "pt" ? domain.ptTitle : domain.enTitle;
    const cards = domain.items
      .map((item) => {
        const fullName = lang === "pt" ? item.ptText : item.enText;
        return `  <img src="${manifest.stack[item.slug]}" width="142" alt="${fullName}" />`;
      })
      .join("\n");

    blocks.push([`### ${title}`, ``, `<p align="center">`, cards, `</p>`].join("\n"));
  }

  return blocks.join("\n\n");
}

function renderExperience(variant, manifest) {
  const { lang, staticMode } = variant;
  const heading = lang === "pt" ? NAV[2].ptHeading : NAV[2].enHeading;
  const expEntry = manifest.experience[lang];
  const alt = EXPERIENCE[lang]
    .map((e) => `${e.company} — ${e.role} (${e.badge})`)
    .join(" · ");

  const islandBlock = staticMode
    ? [
        `<p align="center">`,
        `  <img src="${expEntry.static}" width="960" alt="${alt}" />`,
        `</p>`,
      ].join("\n")
    : [
        `<p align="center">`,
        `  <picture>`,
        `    <source media="(prefers-reduced-motion: reduce)" srcset="${expEntry.static}" />`,
        `    <img src="${expEntry.animated}" width="960" alt="${alt}" />`,
        `  </picture>`,
        `</p>`,
      ].join("\n");

  return [`## ${heading}`, ``, islandBlock].join("\n");
}

function renderBeyondCode(variant, manifest) {
  const { lang, staticMode } = variant;
  const heading = lang === "pt" ? NAV[3].ptHeading : NAV[3].enHeading;
  const beyondEntry = manifest.beyond[lang];
  const data = BEYOND_CODE[lang];
  const alt = `${data.summary} · ${data.islands.map((i) => i.label).join(" · ")}`;

  const islandBlock = staticMode
    ? [
        `<p align="center">`,
        `  <img src="${beyondEntry.static}" width="960" alt="${alt}" />`,
        `</p>`,
      ].join("\n")
    : [
        `<p align="center">`,
        `  <picture>`,
        `    <source media="(prefers-reduced-motion: reduce)" srcset="${beyondEntry.static}" />`,
        `    <img src="${beyondEntry.animated}" width="960" alt="${alt}" />`,
        `  </picture>`,
        `</p>`,
      ].join("\n");

  return [`## ${heading}`, ``, islandBlock].join("\n");
}

function renderContactAndFooter(variant, manifest) {
  const { lang, staticMode } = variant;
  const copy = PROFILE[lang];
  const contactHeading = lang === "pt" ? NAV[4].ptHeading : NAV[4].enHeading;
  const footers = manifest.footers[lang];

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
    footerBlock,
    ``,
    `<p align="center">`,
    `  <a href="${LINKS.github}"><img src="${manifest.links["contact-github"]}" height="44" alt="GitHub — ImNotJean01" /></a>`,
    `  <a href="${LINKS.linkedin}"><img src="${manifest.links["contact-linkedin"]}" height="44" alt="LinkedIn — Jean Santos" /></a>`,
    `</p>`,
    ``,
    bottomLinks,
  ].join("\n");
}

function buildReadme(variant, manifest) {
  const sections = [
    renderTopSwitcher(variant, manifest),
    renderHeroAndNav(variant, manifest),
    renderProjects(variant, manifest),
    renderStack(variant, manifest),
    renderExperience(variant, manifest),
    renderBeyondCode(variant, manifest),
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
