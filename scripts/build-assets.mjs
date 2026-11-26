import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  PALETTE,
  TYPOGRAPHY,
  PROFILE,
  NAV,
  LINK_BUTTONS,
  PROJECTS,
  STACK_DOMAINS,
} from "./data/portfolio.mjs";
import {
  escapeXml,
  el,
  textEl,
  sha256Full,
  sha256_8,
  svgDocument,
  sortKeysDeep,
} from "./lib/svg-core.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const PROFILE_ASSETS_DIR = path.join(REPO_ROOT, "assets", "profile");

function ambientGlowDefs(prefix) {
  return [
    `    <radialGradient id="${prefix}-spirit-glow" cx="15%" cy="0%" r="65%">`,
    `      <stop offset="0%" stop-color="${PALETTE.spirit}" stop-opacity="0.06"/>`,
    `      <stop offset="45%" stop-color="${PALETTE.spirit}" stop-opacity="0.015"/>`,
    `      <stop offset="100%" stop-color="${PALETTE.abyss}" stop-opacity="0"/>`,
    `    </radialGradient>`,
    `    <radialGradient id="${prefix}-silk-glow" cx="88%" cy="95%" r="55%">`,
    `      <stop offset="0%" stop-color="${PALETTE.silk}" stop-opacity="0.045"/>`,
    `      <stop offset="100%" stop-color="${PALETTE.abyss}" stop-opacity="0"/>`,
    `    </radialGradient>`,
    `    <linearGradient id="${prefix}-thread-fade" x1="0%" y1="0%" x2="100%" y2="0%">`,
    `      <stop offset="0%" stop-color="${PALETTE.line}" stop-opacity="0"/>`,
    `      <stop offset="35%" stop-color="${PALETTE.line}" stop-opacity="1"/>`,
    `      <stop offset="65%" stop-color="${PALETTE.line}" stop-opacity="1"/>`,
    `      <stop offset="100%" stop-color="${PALETTE.line}" stop-opacity="0"/>`,
    `    </linearGradient>`,
  ].join("\n");
}

function silkDiamondMotif(cx, cy) {
  return el("g", {}, [
    el("line", {
      x1: cx - 17,
      y1: cy,
      x2: cx - 8,
      y2: cy,
      stroke: PALETTE.silk,
      "stroke-opacity": "0.35",
      "stroke-width": "1",
    }),
    el("line", {
      x1: cx + 8,
      y1: cy,
      x2: cx + 17,
      y2: cy,
      stroke: PALETTE.silk,
      "stroke-opacity": "0.35",
      "stroke-width": "1",
    }),
    el("path", {
      d: `M${cx} ${cy - 4.5} L${cx + 4.5} ${cy} L${cx} ${cy + 4.5} L${cx - 4.5} ${cy} Z`,
      fill: PALETTE.abyss,
      stroke: PALETTE.silk,
      "stroke-opacity": "0.75",
      "stroke-width": "1",
    }),
    el("circle", {
      cx,
      cy,
      r: "1.1",
      fill: PALETTE.silk,
      "fill-opacity": "0.85",
    }),
  ]);
}

function cornerTicks(x, y, w, h, size = 10) {
  const x2 = x + w;
  const y2 = y + h;
  return el("g", { fill: "none", "stroke-width": "1", "stroke-opacity": "0.65" }, [
    el("path", {
      d: `M${x} ${y + size} L${x} ${y} L${x + size} ${y}`,
      stroke: PALETTE.silk,
    }),
    el("path", {
      d: `M${x2 - size} ${y} L${x2} ${y} L${x2} ${y + size}`,
      stroke: PALETTE.spirit,
    }),
    el("path", {
      d: `M${x} ${y2 - size} L${x} ${y2} L${x + size} ${y2}`,
      stroke: PALETTE.silk,
    }),
    el("path", {
      d: `M${x2 - size} ${y2} L${x2} ${y2} L${x2} ${y2 - size}`,
      stroke: PALETTE.spirit,
    }),
  ]);
}

const DESKTOP_PARTICLES = [
  [78, 56, 0.9, PALETTE.soul, 0.14, true],
  [162, 126, 0.7, PALETTE.silk, 0.15, false],
  [230, 44, 0.8, PALETTE.soul, 0.1, true],
  [310, 260, 0.9, PALETTE.silk, 0.14, false],
  [412, 86, 0.7, PALETTE.soul, 0.12, true],
  [520, 42, 0.8, PALETTE.silk, 0.12, false],
  [588, 252, 0.9, PALETTE.soul, 0.15, true],
  [646, 134, 0.7, PALETTE.silk, 0.16, false],
  [742, 48, 0.8, PALETTE.soul, 0.1, true],
  [884, 92, 0.9, PALETTE.silk, 0.14, false],
  [922, 232, 0.7, PALETTE.soul, 0.13, true],
  [118, 286, 0.8, PALETTE.silk, 0.11, false],
];

const MOBILE_PARTICLES = [
  [44, 72, 0.8, PALETTE.soul, 0.14, true],
  [124, 48, 0.7, PALETTE.silk, 0.13, false],
  [210, 96, 0.8, PALETTE.soul, 0.12, true],
  [356, 68, 0.9, PALETTE.silk, 0.15, false],
  [388, 178, 0.7, PALETTE.soul, 0.12, true],
  [64, 248, 0.8, PALETTE.silk, 0.14, false],
  [318, 294, 0.8, PALETTE.soul, 0.13, true],
  [184, 328, 0.7, PALETTE.silk, 0.11, false],
];

function renderParticles(list, isStatic) {
  return el(
    "g",
    {},
    list.map(([cx, cy, r, fill, opacity, animated], idx) =>
      el("circle", {
        cx,
        cy,
        r,
        fill,
        "fill-opacity": String(opacity),
        class: !isStatic && animated ? `dust-float dust-${(idx % 3) + 1}` : undefined,
      })
    )
  );
}

function buildDesktopHero(lang, isStatic) {
  const copy = PROFILE[lang];
  const eyebrowLoc = lang === "pt" ? "ABYSS // SILK & SPIRIT · CACOAL, RO — BRASIL" : "ABYSS // SILK & SPIRIT · CACOAL, RO — BRAZIL";
  const roleUpper = copy.role.toUpperCase();
  const availUpper = copy.availability.toUpperCase();

  const css = isStatic
    ? ""
    : `
    .spirit-pulse { animation: spiritPulse 4.2s ease-in-out infinite; }
    .orbit-spin { transform-origin: 800px 176px; animation: orbitSpin 28s linear infinite; }
    .dust-float { animation: dustFloat 6s ease-in-out infinite; }
    .dust-2 { animation-delay: 1.8s; }
    .dust-3 { animation-delay: 3.4s; }
    @keyframes spiritPulse {
      0%, 100% { opacity: 0.45; }
      50% { opacity: 1; }
    }
    @keyframes orbitSpin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes dustFloat {
      0%, 100% { opacity: 0.1; }
      50% { opacity: 0.25; }
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
      }
    }`;

  const body = [
    el("rect", { x: 0, y: 0, width: 960, height: 320, fill: PALETTE.abyss }),
    el("rect", { x: 0, y: 0, width: 960, height: 320, fill: `url(#hero-${lang}-spirit-glow)` }),
    el("rect", { x: 0, y: 0, width: 960, height: 320, fill: `url(#hero-${lang}-silk-glow)` }),
    renderParticles(DESKTOP_PARTICLES, isStatic),

    // Main framed plate
    el("rect", {
      x: 16.5,
      y: 16.5,
      width: 927,
      height: 287,
      fill: PALETTE.surface,
      "fill-opacity": "0.88",
      stroke: PALETTE.line,
      "stroke-width": "1",
    }),
    el("rect", {
      x: 16,
      y: 44,
      width: 2,
      height: 232,
      fill: PALETTE.silk,
      "fill-opacity": "0.7",
    }),
    cornerTicks(16.5, 16.5, 927, 287, 10),

    // Top eyebrow
    el("path", {
      d: "M48 41 L52 45 L48 49 L44 45 Z",
      fill: PALETTE.abyss,
      stroke: PALETTE.silk,
      "stroke-width": "1",
    }),
    el("line", {
      x1: 58,
      y1: 45,
      x2: 80,
      y2: 45,
      stroke: PALETTE.silk,
      "stroke-opacity": "0.55",
      "stroke-width": "1",
    }),
    textEl(
      "text",
      {
        x: 90,
        y: 48.5,
        fill: PALETTE.mist,
        "font-family": TYPOGRAPHY.mono,
        "font-size": "10",
        "letter-spacing": "1.6",
      },
      eyebrowLoc
    ),

    // Top-right availability badge
    el("rect", {
      x: 684,
      y: 33.5,
      width: 232,
      height: 24,
      fill: PALETTE.abyss,
      stroke: PALETTE.line,
      "stroke-width": "1",
    }),
    el("circle", {
      cx: 699,
      cy: 45.5,
      r: "5",
      fill: PALETTE.spirit,
      "fill-opacity": "0.18",
      class: isStatic ? undefined : "spirit-pulse",
    }),
    el("path", {
      d: "M699 42.5 L702 45.5 L699 48.5 L696 45.5 Z",
      fill: PALETTE.spirit,
    }),
    textEl(
      "text",
      {
        x: 712,
        y: 49,
        fill: PALETTE.silk,
        "font-family": TYPOGRAPHY.mono,
        "font-size": "9.5",
        "letter-spacing": "1.2",
      },
      availUpper
    ),

    // Identity block
    textEl(
      "text",
      {
        x: 44,
        y: 112,
        fill: PALETTE.soul,
        "font-family": TYPOGRAPHY.serif,
        "font-size": "39",
        "font-weight": "600",
        "letter-spacing": "-0.4",
      },
      PROFILE.name
    ),
    textEl(
      "text",
      {
        x: 44,
        y: 142,
        fill: PALETTE.spirit,
        "fill-opacity": "0.92",
        "font-family": TYPOGRAPHY.mono,
        "font-size": "10",
        "letter-spacing": "1",
      },
      roleUpper
    ),

    // Quote tagline
    el("rect", {
      x: 44,
      y: 168,
      width: 2,
      height: 50,
      fill: PALETTE.silk,
      "fill-opacity": "0.6",
    }),
    textEl(
      "text",
      {
        x: 60,
        y: 187,
        fill: PALETTE.soul,
        "fill-opacity": "0.92",
        "font-family": TYPOGRAPHY.serif,
        "font-size": "18.5",
      },
      copy.taglineDesktopLines[0]
    ),
    textEl(
      "text",
      {
        x: 60,
        y: 211,
        fill: PALETTE.soul,
        "fill-opacity": "0.92",
        "font-family": TYPOGRAPHY.serif,
        "font-size": "18.5",
      },
      copy.taglineDesktopLines[1]
    ),

    // Bottom rail
    el("line", {
      x1: 44,
      y1: 244,
      x2: 650,
      y2: 244,
      stroke: PALETTE.line,
      "stroke-width": "1",
    }),
    silkDiamondMotif(61, 267),
    textEl(
      "text",
      {
        x: 88,
        y: 270.5,
        fill: PALETTE.mist,
        "font-family": TYPOGRAPHY.mono,
        "font-size": "9.5",
        "letter-spacing": "1.2",
      },
      copy.heroMeta
    ),

    // Right Telemetry Sigil Panel
    el("rect", {
      x: 684.5,
      y: 74.5,
      width: 231,
      height: 205,
      fill: PALETTE.abyss,
      stroke: PALETTE.line,
      "stroke-width": "1",
    }),
    el("rect", {
      x: 685,
      y: 75,
      width: 230,
      height: 22,
      fill: PALETTE.surface,
    }),
    el("line", {
      x1: 685,
      y1: 97,
      x2: 915,
      y2: 97,
      stroke: PALETTE.line,
      "stroke-width": "1",
    }),
    textEl(
      "text",
      {
        x: 697,
        y: 89.5,
        fill: PALETTE.mist,
        "font-family": TYPOGRAPHY.mono,
        "font-size": "9",
        "letter-spacing": "1.2",
      },
      "SIGIL // JS-01"
    ),
    el("circle", {
      cx: 902,
      cy: 86,
      r: "2.5",
      fill: PALETTE.spirit,
      class: isStatic ? undefined : "spirit-pulse",
    }),

    // Orbital geometry centered at (800, 176)
    el("line", {
      x1: 732,
      y1: 176,
      x2: 868,
      y2: 176,
      stroke: PALETTE.line,
      "stroke-width": "1",
    }),
    el("line", {
      x1: 800,
      y1: 112,
      x2: 800,
      y2: 240,
      stroke: PALETTE.line,
      "stroke-width": "1",
    }),
    el("circle", {
      cx: 800,
      cy: 176,
      r: "54",
      fill: "none",
      stroke: PALETTE.line,
      "stroke-width": "1",
      "stroke-dasharray": "4 6",
      class: isStatic ? undefined : "orbit-spin",
    }),
    el("circle", {
      cx: 800,
      cy: 176,
      r: "36",
      fill: "none",
      stroke: PALETTE.silk,
      "stroke-opacity": "0.35",
      "stroke-width": "1",
    }),
    el("circle", {
      cx: 800,
      cy: 176,
      r: "18",
      fill: "none",
      stroke: PALETTE.spirit,
      "stroke-opacity": "0.45",
      "stroke-width": "1",
    }),
    el("path", {
      d: "M800 152 L824 176 L800 200 L776 176 Z",
      fill: "none",
      stroke: PALETTE.silk,
      "stroke-opacity": "0.75",
      "stroke-width": "1",
    }),
    el("circle", {
      cx: 800,
      cy: 176,
      r: "3.5",
      fill: PALETTE.spirit,
      class: isStatic ? undefined : "spirit-pulse",
    }),
    el("circle", { cx: 836, cy: 140, r: "2", fill: PALETTE.silk }),
    el("circle", { cx: 764, cy: 212, r: "2", fill: PALETTE.soul, "fill-opacity": "0.65" }),
    textEl(
      "text",
      {
        x: 800,
        y: 263,
        fill: PALETTE.silk,
        "font-family": TYPOGRAPHY.mono,
        "font-size": "9",
        "letter-spacing": "1.6",
        "text-anchor": "middle",
      },
      "ABYSS · SILK · SPIRIT"
    ),
  ];

  return svgDocument({
    idPrefix: `hero-${lang}${isStatic ? "-static" : ""}`,
    width: 960,
    height: 320,
    title: `${PROFILE.name} — Hero (${lang.toUpperCase()}${isStatic ? ", Static" : ""})`,
    desc: copy.heroAlt,
    defs: ambientGlowDefs(`hero-${lang}`),
    css,
    body,
    isStatic,
  });
}

function buildMobileHero(lang, isStatic) {
  const copy = PROFILE[lang];
  const availUpper = copy.availability.toUpperCase();

  const css = isStatic
    ? ""
    : `
    .spirit-pulse { animation: spiritPulse 4.2s ease-in-out infinite; }
    .dust-float { animation: dustFloat 6s ease-in-out infinite; }
    .dust-2 { animation-delay: 1.8s; }
    .dust-3 { animation-delay: 3.4s; }
    @keyframes spiritPulse {
      0%, 100% { opacity: 0.45; }
      50% { opacity: 1; }
    }
    @keyframes dustFloat {
      0%, 100% { opacity: 0.1; }
      50% { opacity: 0.25; }
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
      }
    }`;

  const body = [
    el("rect", { x: 0, y: 0, width: 440, height: 360, fill: PALETTE.abyss }),
    el("rect", { x: 0, y: 0, width: 440, height: 360, fill: `url(#hero-mob-${lang}-spirit-glow)` }),
    el("rect", { x: 0, y: 0, width: 440, height: 360, fill: `url(#hero-mob-${lang}-silk-glow)` }),
    renderParticles(MOBILE_PARTICLES, isStatic),

    el("rect", {
      x: 12.5,
      y: 12.5,
      width: 415,
      height: 335,
      fill: PALETTE.surface,
      "fill-opacity": "0.88",
      stroke: PALETTE.line,
      "stroke-width": "1",
    }),
    el("rect", {
      x: 12,
      y: 36,
      width: 2,
      height: 288,
      fill: PALETTE.silk,
      "fill-opacity": "0.7",
    }),
    cornerTicks(12.5, 12.5, 415, 335, 9),

    // Top eyebrow
    el("path", {
      d: "M32 35 L36 39 L32 43 L28 39 Z",
      fill: PALETTE.abyss,
      stroke: PALETTE.silk,
      "stroke-width": "1",
    }),
    textEl(
      "text",
      {
        x: 44,
        y: 42.5,
        fill: PALETTE.mist,
        "font-family": TYPOGRAPHY.mono,
        "font-size": "9",
        "letter-spacing": "1.3",
      },
      "ABYSS // SILK & SPIRIT"
    ),
    textEl(
      "text",
      {
        x: 410,
        y: 42.5,
        fill: PALETTE.mist,
        "font-family": TYPOGRAPHY.mono,
        "font-size": "9",
        "letter-spacing": "1.1",
        "text-anchor": "end",
      },
      "CACOAL, RO"
    ),

    // Availability strip
    el("rect", {
      x: 28.5,
      y: 56.5,
      width: 383,
      height: 24,
      fill: PALETTE.abyss,
      stroke: PALETTE.line,
      "stroke-width": "1",
    }),
    el("circle", {
      cx: 43,
      cy: 68.5,
      r: "4.5",
      fill: PALETTE.spirit,
      "fill-opacity": "0.2",
      class: isStatic ? undefined : "spirit-pulse",
    }),
    el("path", {
      d: "M43 65.5 L46 68.5 L43 71.5 L40 68.5 Z",
      fill: PALETTE.spirit,
    }),
    textEl(
      "text",
      {
        x: 56,
        y: 72,
        fill: PALETTE.silk,
        "font-family": TYPOGRAPHY.mono,
        "font-size": "9.5",
        "letter-spacing": "1.2",
      },
      availUpper
    ),

    // 2-line Display Name
    textEl(
      "text",
      {
        x: 28,
        y: 120,
        fill: PALETTE.soul,
        "font-family": TYPOGRAPHY.serif,
        "font-size": "32",
        "font-weight": "600",
      },
      "Jean Marinho"
    ),
    textEl(
      "text",
      {
        x: 28,
        y: 152,
        fill: PALETTE.soul,
        "font-family": TYPOGRAPHY.serif,
        "font-size": "32",
        "font-weight": "600",
      },
      "dos Santos"
    ),

    // 2-line Role
    textEl(
      "text",
      {
        x: 28,
        y: 179,
        fill: PALETTE.spirit,
        "fill-opacity": "0.92",
        "font-family": TYPOGRAPHY.mono,
        "font-size": "9.5",
        "letter-spacing": "0.9",
      },
      copy.roleHeroLines[0]
    ),
    textEl(
      "text",
      {
        x: 28,
        y: 195,
        fill: PALETTE.spirit,
        "fill-opacity": "0.92",
        "font-family": TYPOGRAPHY.mono,
        "font-size": "9.5",
        "letter-spacing": "0.9",
      },
      copy.roleHeroLines[1]
    ),

    // Silk quote block (3 lines)
    el("rect", {
      x: 28,
      y: 214,
      width: 2,
      height: 62,
      fill: PALETTE.silk,
      "fill-opacity": "0.6",
    }),
    textEl(
      "text",
      {
        x: 42,
        y: 230,
        fill: PALETTE.soul,
        "fill-opacity": "0.92",
        "font-family": TYPOGRAPHY.serif,
        "font-size": "15.5",
      },
      copy.taglineMobileLines[0]
    ),
    textEl(
      "text",
      {
        x: 42,
        y: 250,
        fill: PALETTE.soul,
        "fill-opacity": "0.92",
        "font-family": TYPOGRAPHY.serif,
        "font-size": "15.5",
      },
      copy.taglineMobileLines[1]
    ),
    textEl(
      "text",
      {
        x: 42,
        y: 270,
        fill: PALETTE.soul,
        "fill-opacity": "0.92",
        "font-family": TYPOGRAPHY.serif,
        "font-size": "15.5",
      },
      copy.taglineMobileLines[2]
    ),

    // Bottom rail
    el("line", {
      x1: 28,
      y1: 294,
      x2: 412,
      y2: 294,
      stroke: PALETTE.line,
      "stroke-width": "1",
    }),
    silkDiamondMotif(45, 318),
    textEl(
      "text",
      {
        x: 72,
        y: 321.5,
        fill: PALETTE.mist,
        "font-family": TYPOGRAPHY.mono,
        "font-size": "9.5",
        "letter-spacing": "1.1",
      },
      copy.heroMetaMobile
    ),
  ];

  return svgDocument({
    idPrefix: `hero-mob-${lang}${isStatic ? "-static" : ""}`,
    width: 440,
    height: 360,
    title: `${PROFILE.name} — Mobile Hero (${lang.toUpperCase()}${isStatic ? ", Static" : ""})`,
    desc: copy.heroAlt,
    defs: ambientGlowDefs(`hero-mob-${lang}`),
    css,
    body,
    isStatic,
  });
}

function buildFooter(lang, isStatic) {
  const copy = PROFILE[lang];
  const sectionTag = lang === "pt" ? "§ 05 · CONTATO" : "§ 05 · CONTACT";
  const availUpper = copy.availability.toUpperCase();
  const locUpper = lang === "pt" ? "CACOAL, RO — BRASIL" : "CACOAL, RO — BRAZIL";

  const css = isStatic
    ? ""
    : `
    .spirit-pulse { animation: spiritPulse 4.2s ease-in-out infinite; }
    @keyframes spiritPulse {
      0%, 100% { opacity: 0.45; }
      50% { opacity: 1; }
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
      }
    }`;

  const body = [
    el("rect", { x: 0, y: 0, width: 960, height: 148, fill: PALETTE.abyss }),
    el("rect", {
      x: 0.5,
      y: 20.5,
      width: 959,
      height: 127,
      fill: PALETTE.surface,
      stroke: PALETTE.line,
      "stroke-width": "1",
    }),
    el("rect", { x: 0, y: 20, width: 960, height: 1, fill: `url(#footer-${lang}-thread-fade)` }),
    silkDiamondMotif(480, 20),
    cornerTicks(0.5, 20.5, 959, 127, 8),

    // Left column
    textEl(
      "text",
      {
        x: 32,
        y: 54,
        fill: PALETTE.silk,
        "font-family": TYPOGRAPHY.mono,
        "font-size": "10",
        "letter-spacing": "1.6",
      },
      sectionTag
    ),
    textEl(
      "text",
      {
        x: 32,
        y: 86,
        fill: PALETTE.soul,
        "font-family": TYPOGRAPHY.serif,
        "font-size": "22",
      },
      copy.footerHeadline
    ),
    textEl(
      "text",
      {
        x: 32,
        y: 118,
        fill: PALETTE.mist,
        "font-family": TYPOGRAPHY.mono,
        "font-size": "9.5",
        "letter-spacing": "1.1",
      },
      `© ${PROFILE.copyrightYear} · ${PROFILE.name.toUpperCase()} · ${locUpper}`
    ),

    // Right column
    el("circle", {
      cx: 924,
      cy: 50,
      r: "4.5",
      fill: PALETTE.spirit,
      "fill-opacity": "0.22",
      class: isStatic ? undefined : "spirit-pulse",
    }),
    el("circle", { cx: 924, cy: 50, r: "2", fill: PALETTE.spirit }),
    textEl(
      "text",
      {
        x: 912,
        y: 53.5,
        fill: PALETTE.spirit,
        "font-family": TYPOGRAPHY.mono,
        "font-size": "9.5",
        "letter-spacing": "1.2",
        "text-anchor": "end",
      },
      availUpper
    ),
    textEl(
      "text",
      {
        x: 928,
        y: 86,
        fill: PALETTE.soul,
        "font-family": TYPOGRAPHY.mono,
        "font-size": "10.5",
        "letter-spacing": "1.3",
        "text-anchor": "end",
      },
      "GITHUB · LINKEDIN"
    ),
    textEl(
      "text",
      {
        x: 928,
        y: 118,
        fill: PALETTE.silk,
        "font-family": TYPOGRAPHY.mono,
        "font-size": "9.5",
        "letter-spacing": "1.2",
        "text-anchor": "end",
      },
      copy.backToTop
    ),
  ];

  return svgDocument({
    idPrefix: `footer-${lang}${isStatic ? "-static" : ""}`,
    width: 960,
    height: 148,
    title: `${PROFILE.name} — Footer (${lang.toUpperCase()}${isStatic ? ", Static" : ""})`,
    desc: copy.footerAlt,
    defs: ambientGlowDefs(`footer-${lang}`),
    css,
    body,
    isStatic,
  });
}

function buildLinkGlyph(icon, x, y, color) {
  if (icon === "github") {
    return el("g", { transform: `translate(${x}, ${y})`, fill: "none", stroke: color, "stroke-width": "1.3" }, [
      el("path", { d: "M6 12.5 C3.2 12.5 2 10.7 2 8.2 C2 6.5 2.9 5.3 3.3 4.8 C3.1 4.1 3.2 2.9 3.6 2.3 C4.6 2.4 5.5 3.1 6 3.5 C6.7 3.3 8.3 3.3 9 3.5 C9.5 3.1 10.4 2.4 11.4 2.3 C11.8 2.9 11.9 4.1 11.7 4.8 C12.1 5.3 13 6.5 13 8.2 C13 10.7 11.8 12.5 9 12.5" }),
      el("circle", { cx: 7.5, cy: 11.8, r: "1.4", fill: color, stroke: "none" }),
    ]);
  }
  if (icon === "linkedin") {
    return el("g", { transform: `translate(${x}, ${y})` }, [
      el("rect", { x: 1, y: 1, width: 13, height: 13, fill: "none", stroke: color, "stroke-width": "1.2" }),
      el("rect", { x: 3.8, y: 6.2, width: 1.6, height: 5.2, fill: color }),
      el("circle", { cx: 4.6, cy: 4.1, r: "0.9", fill: color }),
      el("path", {
        d: "M7.2 11.4 L7.2 6.2 L8.7 6.2 L8.7 7.1 C9.2 6.3 10.8 6.1 11.2 7.5 L11.2 11.4 L9.7 11.4 L9.7 8.1 C9.7 7.4 8.7 7.4 8.7 8.2 L8.7 11.4 Z",
        fill: color,
      }),
    ]);
  }
  if (icon === "lock") {
    return el("g", { transform: `translate(${x}, ${y})`, fill: "none", stroke: color, "stroke-width": "1.2" }, [
      el("rect", { x: 2.5, y: 6.5, width: 10, height: 7 }),
      el("path", { d: "M4.5 6.5 L4.5 4.2 C4.5 2.6 5.8 1.5 7.5 1.5 C9.2 1.5 10.5 2.6 10.5 4.2 L10.5 6.5" }),
      el("circle", { cx: 7.5, cy: 10, r: "1", fill: color, stroke: "none" }),
    ]);
  }
  return "";
}

function buildLinkButton({ slug, width, label, accent = "silk", active = false, icon = null, arrow = null, leftTag = null }) {
  const accentHex = accent === "spirit" ? PALETTE.spirit : accent === "mist" ? PALETTE.mist : PALETTE.silk;
  const borderColor = active ? accentHex : PALETTE.line;
  const borderOpacity = active ? "0.7" : "1";
  const textColor = active || accent === "silk" || accent === "spirit" ? PALETTE.soul : PALETTE.mist;

  let textX = 14;
  const children = [
    // Transparent 44px height click box with centered 32px surface (y=6..38)
    el("rect", {
      x: 0.5,
      y: 6.5,
      width: width - 1,
      height: 31,
      fill: PALETTE.surface,
      stroke: borderColor,
      "stroke-opacity": borderOpacity,
      "stroke-width": "1",
    }),
    el("rect", {
      x: 1,
      y: 7,
      width: 2,
      height: 30,
      fill: accentHex,
      "fill-opacity": active ? "0.9" : "0.45",
    }),
    // 4px corner ticks
    el("path", {
      d: `M${width - 5.5} 6.5 L${width - 0.5} 6.5 L${width - 0.5} 11.5`,
      fill: "none",
      stroke: accentHex,
      "stroke-opacity": "0.65",
      "stroke-width": "1",
    }),
  ];

  if (icon) {
    children.push(buildLinkGlyph(icon, 13, 14.5, accentHex));
    textX = 35;
  } else if (leftTag) {
    children.push(
      el("path", {
        d: "M14 19 L17 22 L14 25 L11 22 Z",
        fill: active ? accentHex : PALETTE.abyss,
        stroke: accentHex,
        "stroke-width": "1",
      })
    );
    textX = 25;
  } else {
    children.push(
      el("circle", {
        cx: 13,
        cy: 22,
        r: "2",
        fill: accentHex,
      })
    );
    textX = 22;
  }

  const displayText = arrow ? `${label} ${arrow}` : label;
  children.push(
    textEl(
      "text",
      {
        x: textX,
        y: 25.5,
        fill: textColor,
        "font-family": TYPOGRAPHY.mono,
        "font-size": "9.5",
        "letter-spacing": "1.1",
      },
      displayText
    )
  );

  return svgDocument({
    idPrefix: `link-${slug}`,
    width,
    height: 44,
    title: displayText,
    desc: `Abyss // Silk & Spirit button: ${displayText}`,
    body: children,
    isStatic: true,
  });
}

function buildNavPill(navItem, lang) {
  const slug = lang === "pt" ? navItem.ptSlug : navItem.enSlug;
  const label = lang === "pt" ? navItem.ptNavLabel : navItem.enNavLabel;
  const width = lang === "pt" ? navItem.ptWidth : navItem.enWidth;
  const [idxPart, namePart] = label.split(" · ");

  const body = [
    el("rect", {
      x: 0.5,
      y: 6.5,
      width: width - 1,
      height: 31,
      fill: PALETTE.surface,
      stroke: PALETTE.line,
      "stroke-width": "1",
    }),
    el("rect", {
      x: 1,
      y: 7,
      width: 2,
      height: 30,
      fill: PALETTE.silk,
      "fill-opacity": "0.65",
    }),
    el("path", {
      d: `M${width - 5.5} 6.5 L${width - 0.5} 6.5 L${width - 0.5} 11.5`,
      fill: "none",
      stroke: PALETTE.spirit,
      "stroke-opacity": "0.5",
      "stroke-width": "1",
    }),
    textEl(
      "text",
      {
        x: 14,
        y: 25.5,
        fill: PALETTE.silk,
        "font-family": TYPOGRAPHY.mono,
        "font-size": "9.5",
        "letter-spacing": "1",
      },
      idxPart
    ),
    textEl(
      "text",
      {
        x: 34,
        y: 25.5,
        fill: PALETTE.mist,
        "font-family": TYPOGRAPHY.mono,
        "font-size": "9.5",
        "letter-spacing": "1",
      },
      `· ${namePart}`
    ),
  ];

  return svgDocument({
    idPrefix: slug,
    width,
    height: 44,
    title: label,
    desc: `Section navigation pill: ${label}`,
    body,
    isStatic: true,
  });
}

function renderProjectTelemetry(project, lang, isStatic) {
  const x0 = 442;
  const y0 = 20;
  const w = 494;
  const h = 230;
  const elems = [
    el("rect", {
      x: x0 + 0.5,
      y: y0 + 0.5,
      width: w - 1,
      height: h - 1,
      fill: PALETTE.abyss,
      stroke: PALETTE.line,
      "stroke-width": "1",
    }),
    el("rect", {
      x: x0 + 1,
      y: y0 + 1,
      width: w - 2,
      height: 28,
      fill: PALETTE.surface,
    }),
    el("line", {
      x1: x0 + 1,
      y1: y0 + 29,
      x2: x0 + w - 1,
      y2: y0 + 29,
      stroke: PALETTE.line,
      "stroke-width": "1",
    }),
  ];

  if (project.previewType === "psychat") {
    const tab1 = lang === "pt" ? "01 / CHAT IA" : "01 / AI CHAT";
    const tab2 = lang === "pt" ? "02 / CLÍNICAS" : "02 / CLINICS";
    const userMsg1 = lang === "pt" ? "Estou sobrecarregado hoje e" : "Feeling overwhelmed today and";
    const userMsg2 = lang === "pt" ? "preciso de apoio próximo." : "looking for nearby support.";
    const botHdr = lang === "pt" ? "PSYCHAT · ASSISTENTE" : "PSYCHAT · ASSISTANT";
    const botTag = lang === "pt" ? "APIS DE IA · SUPABASE" : "AI APIS · SUPABASE";
    const botMsg1 = lang === "pt" ? "Respirar fundo ajuda a ancorar." : "Slow breathing helps anchor.";
    const botMsg2 = lang === "pt" ? "2 clínicas encontradas perto:" : "2 nearby clinics located:";

    elems.push(
      textEl("text", { x: x0 + 14, y: y0 + 18.5, fill: PALETTE.spirit, "font-family": TYPOGRAPHY.mono, "font-size": "9", "letter-spacing": "1" }, tab1),
      textEl("text", { x: x0 + 104, y: y0 + 18.5, fill: PALETTE.mist, "font-family": TYPOGRAPHY.mono, "font-size": "9", "letter-spacing": "1" }, tab2),
      textEl("text", { x: x0 + w - 14, y: y0 + 18.5, fill: PALETTE.silk, "font-family": TYPOGRAPHY.mono, "font-size": "9", "letter-spacing": "1.1", "text-anchor": "end" }, "EXPO · MOBILE"),

      // User prompt bubble
      el("rect", { x: x0 + 16.5, y: y0 + 44.5, width: 256, height: 50, fill: PALETTE.surface, stroke: PALETTE.line, "stroke-width": "1" }),
      textEl("text", { x: x0 + 28, y: y0 + 65, fill: PALETTE.mist, "font-family": TYPOGRAPHY.sans, "font-size": "11" }, userMsg1),
      textEl("text", { x: x0 + 28, y: y0 + 81, fill: PALETTE.mist, "font-family": TYPOGRAPHY.sans, "font-size": "11" }, userMsg2),

      // Assistant bubble
      el("rect", { x: x0 + 16.5, y: y0 + 106.5, width: 256, height: 74, fill: PALETTE.surface, stroke: PALETTE.line, "stroke-width": "1" }),
      el("rect", { x: x0 + 17, y: y0 + 107, width: 2, height: 73, fill: PALETTE.silk }),
      textEl("text", { x: x0 + 28, y: y0 + 124, fill: PALETTE.silk, "font-family": TYPOGRAPHY.mono, "font-size": "8.5", "letter-spacing": "1" }, botHdr),
      textEl("text", { x: x0 + 28, y: y0 + 144, fill: PALETTE.soul, "font-family": TYPOGRAPHY.sans, "font-size": "11" }, botMsg1),
      textEl("text", { x: x0 + 28, y: y0 + 160, fill: PALETTE.soul, "font-family": TYPOGRAPHY.sans, "font-size": "11" }, botMsg2),
      textEl("text", { x: x0 + 28, y: y0 + 204, fill: PALETTE.mist, "font-family": TYPOGRAPHY.mono, "font-size": "8.5", "letter-spacing": "1" }, botTag),

      // Radar (centered at x0+382, y0+128)
      el("line", { x1: x0 + 322, y1: y0 + 128, x2: x0 + 442, y2: y0 + 128, stroke: PALETTE.line, "stroke-opacity": "0.8" }),
      el("line", { x1: x0 + 382, y1: y0 + 68, x2: x0 + 382, y2: y0 + 188, stroke: PALETTE.line, "stroke-opacity": "0.8" }),
      el("circle", { cx: x0 + 382, cy: y0 + 128, r: "54", fill: "none", stroke: PALETTE.line }),
      el("circle", { cx: x0 + 382, cy: y0 + 128, r: "36", fill: "none", stroke: PALETTE.line }),
      el("circle", { cx: x0 + 382, cy: y0 + 128, r: "18", fill: "none", stroke: PALETTE.spirit, "stroke-opacity": "0.45" }),
      el("circle", {
        cx: x0 + 382,
        cy: y0 + 128,
        r: "10",
        fill: PALETTE.spirit,
        "fill-opacity": "0.2",
        class: isStatic ? undefined : "pulse-soft",
      }),
      el("circle", { cx: x0 + 382, cy: y0 + 128, r: "3.5", fill: PALETTE.spirit }),
      el("circle", { cx: x0 + 408, cy: y0 + 104, r: "3.5", fill: PALETTE.silk, class: isStatic ? undefined : "pulse-soft" }),
      textEl("text", { x: x0 + 415, y: y0 + 107, fill: PALETTE.silk, "font-family": TYPOGRAPHY.mono, "font-size": "8.5" }, "1.1 km"),
      el("circle", { cx: x0 + 348, cy: y0 + 156, r: "3", fill: PALETTE.soul, "fill-opacity": "0.75" }),
      textEl("text", { x: x0 + 355, y: y0 + 159, fill: PALETTE.mist, "font-family": TYPOGRAPHY.mono, "font-size": "8.5" }, "2.3 km")
    );
  } else if (project.previewType === "financas") {
    const kpi1 = lang === "pt" ? "ENTRADAS" : "INCOME";
    const kpi2 = lang === "pt" ? "SAÍDAS" : "EXPENSES";
    const kpi3 = lang === "pt" ? "SALDO" : "BALANCE";
    const rows = [
      [lang === "pt" ? "Projeto Freelance Web" : "Freelance Web Project", "+ R$ 4.200", PALETTE.spirit],
      [lang === "pt" ? "Consultoria API REST" : "REST API Consulting", "+ R$ 2.200", PALETTE.spirit],
      [lang === "pt" ? "Infraestrutura & Domínio" : "Infra & Domain", "- R$ 340", PALETTE.silk],
      [lang === "pt" ? "Despesas Fixas Mensais" : "Monthly Fixed Costs", "- R$ 3.510", PALETTE.mist],
    ];

    elems.push(
      textEl("text", { x: x0 + 14, y: y0 + 18.5, fill: PALETTE.spirit, "font-family": TYPOGRAPHY.mono, "font-size": "9", "letter-spacing": "1" }, lang === "pt" ? "TODOS · ENTRADAS · SAÍDAS" : "ALL · INCOME · EXPENSES"),
      textEl("text", { x: x0 + w - 14, y: y0 + 18.5, fill: PALETTE.silk, "font-family": TYPOGRAPHY.mono, "font-size": "9", "letter-spacing": "1.1", "text-anchor": "end" }, "SUPABASE AUTH · POSTGRES"),

      // 3 KPI boxes
      el("rect", { x: x0 + 16.5, y: y0 + 40.5, width: 146, height: 48, fill: PALETTE.surface, stroke: PALETTE.line }),
      textEl("text", { x: x0 + 26, y: y0 + 57, fill: PALETTE.mist, "font-family": TYPOGRAPHY.mono, "font-size": "8.5", "letter-spacing": "1" }, kpi1),
      textEl("text", { x: x0 + 26, y: y0 + 77, fill: PALETTE.spirit, "font-family": TYPOGRAPHY.mono, "font-size": "13" }, "R$ 6.400"),

      el("rect", { x: x0 + 174.5, y: y0 + 40.5, width: 146, height: 48, fill: PALETTE.surface, stroke: PALETTE.line }),
      textEl("text", { x: x0 + 184, y: y0 + 57, fill: PALETTE.mist, "font-family": TYPOGRAPHY.mono, "font-size": "8.5", "letter-spacing": "1" }, kpi2),
      textEl("text", { x: x0 + 184, y: y0 + 77, fill: PALETTE.mist, "font-family": TYPOGRAPHY.mono, "font-size": "13" }, "R$ 3.850"),

      el("rect", { x: x0 + 332.5, y: y0 + 40.5, width: 145, height: 48, fill: PALETTE.surface, stroke: PALETTE.silk, "stroke-opacity": "0.55" }),
      textEl("text", { x: x0 + 342, y: y0 + 57, fill: PALETTE.silk, "font-family": TYPOGRAPHY.mono, "font-size": "8.5", "letter-spacing": "1" }, kpi3),
      textEl("text", { x: x0 + 342, y: y0 + 77, fill: PALETTE.soul, "font-family": TYPOGRAPHY.mono, "font-size": "13" }, "+ R$ 2.550"),

      // 62% / 38% stacked ratio bar
      el("rect", { x: x0 + 16, y: y0 + 98, width: 286, height: 4, fill: PALETTE.spirit, class: isStatic ? undefined : "pulse-soft" }),
      el("rect", { x: x0 + 306, y: y0 + 98, width: 172, height: 4, fill: PALETTE.silk }),
      textEl("text", { x: x0 + 16, y: y0 + 114, fill: PALETTE.mist, "font-family": TYPOGRAPHY.mono, "font-size": "8", "letter-spacing": "0.8" }, "62% INFLOW // 38% OUTFLOW")
    );

    rows.forEach(([label, amount, col], idx) => {
      const ry = y0 + 124 + idx * 24;
      elems.push(
        el("rect", { x: x0 + 16.5, y: ry + 0.5, width: 461, height: 20, fill: PALETTE.surface, stroke: PALETTE.line }),
        textEl("text", { x: x0 + 26, y: ry + 13.5, fill: PALETTE.soul, "font-family": TYPOGRAPHY.sans, "font-size": "10" }, label),
        textEl("text", { x: x0 + 468, y: ry + 13.5, fill: col, "font-family": TYPOGRAPHY.mono, "font-size": "9.5", "text-anchor": "end" }, amount)
      );
    });
  } else if (project.previewType === "nexo") {
    const metrics = [
      ["DEPLOY FREQ", lang === "pt" ? "Sob demanda" : "On demand", 84, PALETTE.spirit],
      ["LEAD TIME", lang === "pt" ? "< 4 horas" : "< 4 hours", 78, PALETTE.spirit],
      ["FAILURE RATE", "1.8%", 18, PALETTE.silk],
      ["MTTR", "< 30 min", 90, PALETTE.spirit],
    ];
    const layers = [
      ["01 · INTERFACE WEB", lang === "pt" ? "Colaboradores · Indicadores" : "Employees · Indicators", false],
      ["02 · DOMÍNIO DDD & CQRS", lang === "pt" ? "Commands · Queries · UML" : "Commands · Queries · UML", true],
      ["03 · PERSISTÊNCIA SQL", "employees · departments · metrics", false],
    ];

    elems.push(
      textEl("text", { x: x0 + 14, y: y0 + 18.5, fill: PALETTE.spirit, "font-family": TYPOGRAPHY.mono, "font-size": "9", "letter-spacing": "1" }, lang === "pt" ? "01 / MÉTRICAS DORA" : "01 / DORA METRICS"),
      textEl("text", { x: x0 + 150, y: y0 + 18.5, fill: PALETTE.mist, "font-family": TYPOGRAPHY.mono, "font-size": "9", "letter-spacing": "1" }, "02 / DDD, CQRS & SQL"),
      textEl("text", { x: x0 + w - 14, y: y0 + 18.5, fill: PALETTE.silk, "font-family": TYPOGRAPHY.mono, "font-size": "9", "letter-spacing": "1.1", "text-anchor": "end" }, "DDD · CQRS · DORA")
    );

    metrics.forEach(([title, val, pct, col], idx) => {
      const colIdx = idx % 2;
      const rowIdx = Math.floor(idx / 2);
      const bx = x0 + 16 + colIdx * 116;
      const by = y0 + 42 + rowIdx * 84;
      elems.push(
        el("rect", { x: bx + 0.5, y: by + 0.5, width: 108, height: 74, fill: PALETTE.surface, stroke: PALETTE.line }),
        textEl("text", { x: bx + 10, y: by + 20, fill: PALETTE.mist, "font-family": TYPOGRAPHY.mono, "font-size": "8", "letter-spacing": "0.8" }, title),
        textEl("text", { x: bx + 10, y: by + 43, fill: PALETTE.soul, "font-family": TYPOGRAPHY.mono, "font-size": "11" }, val),
        el("rect", { x: bx + 10, y: by + 56, width: 88, height: 3, fill: PALETTE.line }),
        el("rect", { x: bx + 10, y: by + 56, width: Math.round((88 * pct) / 100), height: 3, fill: col })
      );
    });

    layers.forEach(([title, sub, active], idx) => {
      const ly = y0 + 42 + idx * 58;
      elems.push(
        el("rect", {
          x: x0 + 252.5,
          y: ly + 0.5,
          width: 225,
          height: 48,
          fill: PALETTE.surface,
          stroke: active ? PALETTE.silk : PALETTE.line,
          "stroke-opacity": active ? "0.75" : "1",
          class: active && !isStatic ? "pulse-soft" : undefined,
        }),
        el("rect", { x: x0 + 253, y: ly + 1, width: 2, height: 47, fill: active ? PALETTE.silk : PALETTE.spirit }),
        textEl("text", { x: x0 + 264, y: ly + 20, fill: active ? PALETTE.silk : PALETTE.soul, "font-family": TYPOGRAPHY.mono, "font-size": "9", "letter-spacing": "0.9" }, title),
        textEl("text", { x: x0 + 264, y: ly + 37, fill: PALETTE.mist, "font-family": TYPOGRAPHY.sans, "font-size": "10" }, sub)
      );
    });
  } else if (project.previewType === "mediahub") {
    const cmdSteps = lang === "pt" ? ["01 · HTTP EDGE", "02 · DOMÍNIO DDD", "03 · WRITE STORE"] : ["01 · HTTP EDGE", "02 · DDD DOMAIN", "03 · WRITE STORE"];
    const qrySteps = lang === "pt" ? ["01 · EDGE CACHE", "02 · QUERY HANDLER", "03 · RESPOSTA JSON"] : ["01 · EDGE CACHE", "02 · QUERY HANDLER", "03 · JSON RESPONSE"];

    elems.push(
      textEl("text", { x: x0 + 14, y: y0 + 18.5, fill: PALETTE.silk, "font-family": TYPOGRAPHY.mono, "font-size": "9", "letter-spacing": "1" }, lang === "pt" ? "01 / COMMAND (ESCRITA)" : "01 / COMMAND (WRITE)"),
      textEl("text", { x: x0 + 168, y: y0 + 18.5, fill: PALETTE.spirit, "font-family": TYPOGRAPHY.mono, "font-size": "9", "letter-spacing": "1" }, lang === "pt" ? "02 / QUERY (LEITURA)" : "02 / QUERY (READ)"),
      textEl("text", { x: x0 + w - 14, y: y0 + 18.5, fill: PALETTE.silk, "font-family": TYPOGRAPHY.mono, "font-size": "9", "letter-spacing": "1.1", "text-anchor": "end" }, "CQRS · SERVERLESS"),

      // Command lane
      textEl("text", { x: x0 + 16, y: y0 + 50, fill: PALETTE.silk, "font-family": TYPOGRAPHY.mono, "font-size": "8.5", "letter-spacing": "1.2" }, "COMMAND PIPELINE // WRITE"),
      el("line", {
        x1: x0 + 146,
        y1: y0 + 78,
        x2: x0 + 346,
        y2: y0 + 78,
        stroke: PALETTE.silk,
        "stroke-dasharray": "4 4",
        class: isStatic ? undefined : "flow-line",
      }),
      // Query lane
      textEl("text", { x: x0 + 16, y: y0 + 126, fill: PALETTE.spirit, "font-family": TYPOGRAPHY.mono, "font-size": "8.5", "letter-spacing": "1.2" }, "QUERY PIPELINE // READ"),
      el("line", {
        x1: x0 + 146,
        y1: y0 + 154,
        x2: x0 + 346,
        y2: y0 + 154,
        stroke: PALETTE.spirit,
        "stroke-dasharray": "4 4",
        class: isStatic ? undefined : "flow-line",
      })
    );

    cmdSteps.forEach((step, idx) => {
      const sx = x0 + 16 + idx * 160;
      elems.push(
        el("rect", { x: sx + 0.5, y: y0 + 58.5, width: 140, height: 40, fill: PALETTE.surface, stroke: PALETTE.silk, "stroke-opacity": "0.65" }),
        textEl("text", { x: sx + 70, y: y0 + 82, fill: PALETTE.soul, "font-family": TYPOGRAPHY.mono, "font-size": "9", "text-anchor": "middle" }, step)
      );
    });

    qrySteps.forEach((step, idx) => {
      const sx = x0 + 16 + idx * 160;
      elems.push(
        el("rect", { x: sx + 0.5, y: y0 + 134.5, width: 140, height: 40, fill: PALETTE.surface, stroke: PALETTE.spirit, "stroke-opacity": "0.65" }),
        textEl("text", { x: sx + 70, y: y0 + 158, fill: PALETTE.soul, "font-family": TYPOGRAPHY.mono, "font-size": "9", "text-anchor": "middle" }, step)
      );
    });

    elems.push(
      el("rect", { x: x0 + 16.5, y: y0 + 190.5, width: 461, height: 24, fill: PALETTE.surface, stroke: PALETTE.line }),
      textEl("text", { x: x0 + 247, y: y0 + 206, fill: PALETTE.mist, "font-family": TYPOGRAPHY.mono, "font-size": "8.5", "letter-spacing": "1.2", "text-anchor": "middle" }, "CLOUDFLARE WORKERS · VERCEL EDGE · STATELESS REST")
    );
  } else if (project.previewType === "rpgtable") {
    const badge = lang === "pt" ? "3+ SISTEMAS · SUPABASE" : "3+ SYSTEMS · SUPABASE";
    const tabLeft = lang === "pt" ? "01 / TABULEIRO TÁTICO" : "01 / TACTICAL BOARD";
    const tabRight = lang === "pt" ? "02 / TEMPO REAL" : "02 / REALTIME";
    const themeLabel = lang === "pt" ? "TEMA: NEUTRO / PARANORMAL" : "THEME: NEUTRAL / PARANORMAL";

    elems.push(
      textEl("text", { x: x0 + 14, y: y0 + 18.5, fill: PALETTE.spirit, "font-family": TYPOGRAPHY.mono, "font-size": "9", "letter-spacing": "1" }, tabLeft),
      textEl("text", { x: x0 + 178, y: y0 + 18.5, fill: PALETTE.mist, "font-family": TYPOGRAPHY.mono, "font-size": "9", "letter-spacing": "1" }, tabRight),
      textEl("text", { x: x0 + w - 14, y: y0 + 18.5, fill: PALETTE.silk, "font-family": TYPOGRAPHY.mono, "font-size": "9", "letter-spacing": "1.1", "text-anchor": "end" }, badge)
    );

    // 5x4 tactical grid (x0+18..x0+218, y0+44..y0+204)
    const gx = x0 + 18;
    const gy = y0 + 44;
    const cell = 36;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 5; c++) {
        elems.push(
          el("rect", {
            x: gx + c * cell + 0.5,
            y: gy + r * cell + 0.5,
            width: cell - 1,
            height: cell - 1,
            fill: (r + c) % 2 === 0 ? PALETTE.surface : PALETTE.abyss,
            stroke: PALETTE.line,
            "stroke-width": "1",
          })
        );
      }
    }
    // Tactical tokens + d20 wireframe
    elems.push(
      el("path", { d: `M${gx + 54} ${gy + 46} L${gx + 62} ${gy + 54} L${gx + 54} ${gy + 62} L${gx + 46} ${gy + 54} Z`, fill: PALETTE.silk }),
      el("path", { d: `M${gx + 126} ${gy + 82} L${gx + 134} ${gy + 90} L${gx + 126} ${gy + 98} L${gx + 118} ${gy + 90} Z`, fill: PALETTE.spirit }),
      el("polygon", {
        points: `${gx + 144},${gy + 16} ${gx + 166},${gy + 28} ${gx + 166},${gy + 52} ${gx + 144},${gy + 64} ${gx + 122},${gy + 52} ${gx + 122},${gy + 28}`,
        fill: PALETTE.abyss,
        "fill-opacity": "0.85",
        stroke: PALETTE.silk,
        "stroke-width": "1.2",
        class: isStatic ? undefined : "pulse-soft",
      }),
      textEl("text", { x: gx + 144, y: gy + 44, fill: PALETTE.silk, "font-family": TYPOGRAPHY.mono, "font-size": "9", "text-anchor": "middle" }, "D20"),
      textEl("text", { x: gx, y: gy + 162, fill: PALETTE.mist, "font-family": TYPOGRAPHY.mono, "font-size": "8", "letter-spacing": "0.9" }, themeLabel)
    );

    // Right system pills + Realtime banner
    const systems = [
      ["01 · ORDEM PARANORMAL", PALETTE.spirit],
      ["02 · D&D 5E", PALETTE.silk],
      ["03 · TORMENTA 20 · GENÉRICO", PALETTE.soul],
    ];
    systems.forEach(([label, col], idx) => {
      const py = y0 + 44 + idx * 34;
      elems.push(
        el("rect", { x: x0 + 216.5, y: py + 0.5, width: 261, height: 26, fill: PALETTE.surface, stroke: PALETTE.line }),
        el("rect", { x: x0 + 217, y: py + 1, width: 2, height: 25, fill: col }),
        textEl("text", { x: x0 + 228, y: py + 17, fill: PALETTE.soul, "font-family": TYPOGRAPHY.mono, "font-size": "9", "letter-spacing": "0.9" }, label)
      );
    });

    elems.push(
      el("rect", { x: x0 + 216.5, y: y0 + 150.5, width: 261, height: 64, fill: PALETTE.surface, stroke: PALETTE.spirit, "stroke-opacity": "0.55" }),
      el("circle", { cx: x0 + 231, cy: y0 + 170, r: "4.5", fill: PALETTE.spirit, "fill-opacity": "0.22", class: isStatic ? undefined : "pulse-soft" }),
      el("circle", { cx: x0 + 231, cy: y0 + 170, r: "2", fill: PALETTE.spirit }),
      textEl("text", { x: x0 + 242, y: y0 + 173.5, fill: PALETTE.spirit, "font-family": TYPOGRAPHY.mono, "font-size": "9", "letter-spacing": "1" }, "SUPABASE REALTIME // SYNC"),
      textEl("text", { x: x0 + 228, y: y0 + 196, fill: PALETTE.mist, "font-family": TYPOGRAPHY.mono, "font-size": "8.5", "letter-spacing": "0.7" }, lang === "pt" ? "DADOS · INICIATIVA · FICHAS · MASMORRA" : "DICE · INITIATIVE · SHEETS · DUNGEON")
    );
  }

  return elems;
}

function buildProjectCover(project, lang, isStatic) {
  const copy = project[lang];
  const css = isStatic
    ? ""
    : `
    .pulse-soft { animation: pulseSoft 4.2s ease-in-out infinite; }
    .flow-line { animation: flowDash 5s linear infinite; }
    @keyframes pulseSoft {
      0%, 100% { opacity: 0.45; }
      50% { opacity: 1; }
    }
    @keyframes flowDash {
      from { stroke-dashoffset: 32; }
      to { stroke-dashoffset: 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
      }
    }`;

  // Stack tags in 2x2 grid or horizontal flow inside x=28..400
  const tagElems = [];
  let tx = 28;
  let ty = 178;
  for (const tag of project.coverTags) {
    const pillW = Math.max(66, tag.length * 6.8 + 20);
    if (tx + pillW > 402) {
      tx = 28;
      ty += 30;
    }
    tagElems.push(
      el("rect", {
        x: tx + 0.5,
        y: ty + 0.5,
        width: pillW - 1,
        height: 22,
        fill: PALETTE.abyss,
        stroke: PALETTE.line,
        "stroke-width": "1",
      }),
      textEl(
        "text",
        {
          x: tx + 10,
          y: ty + 15,
          fill: PALETTE.mist,
          "font-family": TYPOGRAPHY.mono,
          "font-size": "9",
          "letter-spacing": "0.8",
        },
        tag.toUpperCase()
      )
    );
    tx += pillW + 8;
  }

  const body = [
    el("rect", { x: 0, y: 0, width: 960, height: 270, fill: PALETTE.abyss }),
    el("rect", {
      x: 0.5,
      y: 0.5,
      width: 959,
      height: 269,
      fill: PALETTE.surface,
      stroke: PALETTE.line,
      "stroke-width": "1",
    }),
    el("rect", { x: 1, y: 20, width: 2, height: 230, fill: PALETTE.silk, "fill-opacity": "0.65" }),
    cornerTicks(0.5, 0.5, 959, 269, 8),

    // Left editorial zone
    textEl(
      "text",
      {
        x: 28,
        y: 38,
        fill: PALETTE.silk,
        "font-family": TYPOGRAPHY.mono,
        "font-size": "11",
        "letter-spacing": "1.6",
      },
      project.index
    ),
    textEl(
      "text",
      {
        x: 52,
        y: 38,
        fill: PALETTE.mist,
        "font-family": TYPOGRAPHY.mono,
        "font-size": "11",
      },
      "/"
    ),
    textEl(
      "text",
      {
        x: 68,
        y: 38,
        fill: PALETTE.spirit,
        "font-family": TYPOGRAPHY.mono,
        "font-size": "10",
        "letter-spacing": "1.2",
      },
      copy.context.toUpperCase()
    ),
    textEl(
      "text",
      {
        x: 28,
        y: 78,
        fill: PALETTE.soul,
        "font-family": TYPOGRAPHY.serif,
        "font-size": "32",
        "font-weight": "600",
      },
      project.title
    ),
    ...copy.coverDescLines.map((line, i) =>
      textEl(
        "text",
        {
          x: 28,
          y: 108 + i * 19,
          fill: PALETTE.mist,
          "font-family": TYPOGRAPHY.sans,
          "font-size": "12",
        },
        line
      )
    ),
    ...tagElems,

    // Center spine
    el("line", { x1: 420, y1: 20, x2: 420, y2: 250, stroke: PALETTE.line, "stroke-width": "1" }),
    el("path", {
      d: "M420 130 L425 135 L420 140 L415 135 Z",
      fill: PALETTE.abyss,
      stroke: PALETTE.silk,
      "stroke-width": "1",
    }),

    // Right schematic/telemetry zone
    ...renderProjectTelemetry(project, lang, isStatic),
  ];

  return svgDocument({
    idPrefix: `${project.coverBase}-${lang}${isStatic ? "-static" : ""}`,
    width: 960,
    height: 270,
    title: `${project.index} / ${project.title} (${lang.toUpperCase()})`,
    desc: copy.coverAlt,
    css,
    body,
    isStatic,
  });
}

function stackGlyph(slug, accentHex) {
  const s = PALETTE.soul;
  const a = accentHex;
  switch (slug) {
    case "typescript":
      return [
        el("rect", { x: 2, y: 2, width: 18, height: 18, fill: PALETTE.abyss, stroke: a, "stroke-width": "1.2" }),
        textEl("text", { x: 11, y: 14.5, fill: s, "font-family": TYPOGRAPHY.mono, "font-size": "8.5", "font-weight": "600", "text-anchor": "middle" }, "TS"),
      ];
    case "javascript":
      return [
        el("rect", { x: 2, y: 2, width: 18, height: 18, fill: PALETTE.abyss, stroke: a, "stroke-width": "1.2" }),
        textEl("text", { x: 11, y: 14.5, fill: a, "font-family": TYPOGRAPHY.mono, "font-size": "8.5", "font-weight": "600", "text-anchor": "middle" }, "JS"),
      ];
    case "python":
      return [
        el("rect", { x: 3, y: 3, width: 10, height: 8, fill: "none", stroke: a, "stroke-width": "1.3" }),
        el("rect", { x: 9, y: 11, width: 10, height: 8, fill: "none", stroke: s, "stroke-width": "1.3" }),
        el("circle", { cx: 6, cy: 6, r: "1", fill: a }),
        el("circle", { cx: 16, cy: 16, r: "1", fill: s }),
      ];
    case "java":
      return [
        el("rect", { x: 5, y: 9, width: 11, height: 9, fill: "none", stroke: s, "stroke-width": "1.2" }),
        el("path", { d: "M16 11 L19 11 L19 15 L16 15", fill: "none", stroke: s, "stroke-width": "1.2" }),
        el("path", { d: "M8 6 L9.5 3 M12.5 6 L14 3", fill: "none", stroke: a, "stroke-width": "1.2" }),
      ];
    case "php":
      return [
        el("polygon", { points: "11,2 20,11 11,20 2,11", fill: PALETTE.abyss, stroke: a, "stroke-width": "1.2" }),
        textEl("text", { x: 11, y: 13.5, fill: s, "font-family": TYPOGRAPHY.mono, "font-size": "6.5", "text-anchor": "middle" }, "PHP"),
      ];
    case "sql":
      return [
        el("rect", { x: 4, y: 3, width: 14, height: 4, fill: "none", stroke: a, "stroke-width": "1.2" }),
        el("rect", { x: 4, y: 9, width: 14, height: 4, fill: "none", stroke: s, "stroke-width": "1.2" }),
        el("rect", { x: 4, y: 15, width: 14, height: 4, fill: "none", stroke: a, "stroke-width": "1.2" }),
      ];
    case "react":
      return [
        el("ellipse", { cx: 11, cy: 11, rx: "8", ry: "3.2", fill: "none", stroke: a, "stroke-width": "1.1" }),
        el("ellipse", { cx: 11, cy: 11, rx: "8", ry: "3.2", transform: "rotate(60 11 11)", fill: "none", stroke: a, "stroke-width": "1.1" }),
        el("ellipse", { cx: 11, cy: 11, rx: "8", ry: "3.2", transform: "rotate(120 11 11)", fill: "none", stroke: a, "stroke-width": "1.1" }),
        el("circle", { cx: 11, cy: 11, r: "1.8", fill: s }),
      ];
    case "react-native":
      return [
        el("rect", { x: 5, y: 2, width: 12, height: 18, fill: "none", stroke: s, "stroke-width": "1.2" }),
        el("ellipse", { cx: 11, cy: 10.5, rx: "4.2", ry: "1.8", fill: "none", stroke: a, "stroke-width": "1" }),
        el("circle", { cx: 11, cy: 10.5, r: "1.2", fill: a }),
      ];
    case "expo":
      return [
        el("path", { d: "M4 17 L11 4 L18 17", fill: "none", stroke: a, "stroke-width": "1.6" }),
        el("path", { d: "M7.5 14 L11 8.5 L14.5 14", fill: "none", stroke: s, "stroke-width": "1.2" }),
      ];
    case "vite":
      return [
        el("polygon", { points: "3,4 19,4 11,19", fill: "none", stroke: a, "stroke-width": "1.2" }),
        el("path", { d: "M12 6 L9 12 L12.5 12 L10 17", fill: "none", stroke: s, "stroke-width": "1.3" }),
      ];
    case "tailwind-css":
      return [
        el("path", { d: "M3 9 C5 6 8 6 11 9 C14 12 17 12 19 9", fill: "none", stroke: a, "stroke-width": "1.5" }),
        el("path", { d: "M3 14 C5 11 8 11 11 14 C14 17 17 17 19 14", fill: "none", stroke: s, "stroke-width": "1.5" }),
      ];
    case "nativewind":
      return [
        el("rect", { x: 4, y: 2.5, width: 14, height: 17, fill: "none", stroke: s, "stroke-width": "1.1" }),
        el("path", { d: "M6.5 11 C8 9 10 9 11 11 C12 13 14 13 15.5 11", fill: "none", stroke: a, "stroke-width": "1.4" }),
      ];
    case "nodejs":
      return [
        el("polygon", { points: "11,2 19,6.5 19,15.5 11,20 3,15.5 3,6.5", fill: "none", stroke: a, "stroke-width": "1.3" }),
        el("circle", { cx: 11, cy: 11, r: "2.4", fill: s }),
      ];
    case "express":
      return [
        el("rect", { x: 2, y: 3, width: 18, height: 16, fill: PALETTE.abyss, stroke: PALETTE.line, "stroke-width": "1" }),
        textEl("text", { x: 11, y: 14, fill: a, "font-family": TYPOGRAPHY.mono, "font-size": "8.5", "text-anchor": "middle" }, "EX"),
      ];
    case "codeigniter-4":
      return [
        el("polygon", { points: "11,2 18,12 14,19 8,19 4,12", fill: "none", stroke: a, "stroke-width": "1.3" }),
        el("polygon", { points: "11,8 14,13 11,17 8,13", fill: s }),
      ];
    case "supabase":
      return [
        el("polygon", { points: "12,2 5,12 11,12 10,20 17,10 11,10", fill: "none", stroke: a, "stroke-width": "1.3" }),
      ];
    case "mongodb":
      return [
        el("polygon", { points: "11,2 16,10 11,18 6,10", fill: "none", stroke: a, "stroke-width": "1.3" }),
        el("line", { x1: 11, y1: 5, x2: 11, y2: 20, stroke: s, "stroke-width": "1.2" }),
      ];
    case "mysql":
      return [
        el("rect", { x: 2.5, y: 4, width: 7, height: 14, fill: "none", stroke: a, "stroke-width": "1.2" }),
        el("rect", { x: 12.5, y: 4, width: 7, height: 14, fill: "none", stroke: s, "stroke-width": "1.2" }),
        el("line", { x1: 9.5, y1: 11, x2: 12.5, y2: 11, stroke: a, "stroke-width": "1.3" }),
      ];
    case "apache-hop":
      return [
        el("circle", { cx: 4.5, cy: 11, r: "2", fill: s }),
        el("path", { d: "M11 7 L15 11 L11 15 L7 11 Z", fill: "none", stroke: a, "stroke-width": "1.3" }),
        el("circle", { cx: 17.5, cy: 11, r: "2", fill: a }),
      ];
    case "docker":
      return [
        el("rect", { x: 3, y: 12, width: 16, height: 5, fill: "none", stroke: a, "stroke-width": "1.2" }),
        el("rect", { x: 5, y: 7, width: 4, height: 4, fill: "none", stroke: s, "stroke-width": "1" }),
        el("rect", { x: 10, y: 7, width: 4, height: 4, fill: "none", stroke: s, "stroke-width": "1" }),
        el("rect", { x: 10, y: 2, width: 4, height: 4, fill: "none", stroke: a, "stroke-width": "1" }),
      ];
    case "git-github":
      return [
        el("line", { x1: 6, y1: 4, x2: 6, y2: 18, stroke: s, "stroke-width": "1.3" }),
        el("path", { d: "M6 12 C11 12 16 11 16 6", fill: "none", stroke: a, "stroke-width": "1.3" }),
        el("circle", { cx: 6, cy: 4, r: "2", fill: s }),
        el("circle", { cx: 6, cy: 18, r: "2", fill: s }),
        el("circle", { cx: 16, cy: 6, r: "2", fill: a }),
      ];
    case "gitlab-cicd":
      return [
        el("polygon", { points: "3,11 6,3 11,9 16,3 19,11 11,19", fill: "none", stroke: a, "stroke-width": "1.2" }),
        el("circle", { cx: 11, cy: 13, r: "1.5", fill: s }),
      ];
    case "cloudflare":
      return [
        el("polygon", { points: "3,15 7,8 12,10 15,6 19,15", fill: "none", stroke: a, "stroke-width": "1.3" }),
        el("line", { x1: 4, y1: 18, x2: 18, y2: 18, stroke: s, "stroke-width": "1.2" }),
      ];
    case "vercel":
      return [
        el("polygon", { points: "11,4 19,18 3,18", fill: a }),
      ];
    default:
      return [
        el("path", { d: "M11 2 L13 9 L20 11 L13 13 L11 20 L9 13 L2 11 L9 9 Z", fill: "none", stroke: a, "stroke-width": "1.2" }),
        el("circle", { cx: 11, cy: 11, r: "2", fill: s }),
      ];
  }
}

function buildStackCard(item, accent) {
  const accentHex = accent === "spirit" ? PALETTE.spirit : PALETTE.silk;
  const labelSize = item.label.length >= 12 ? "10" : "11";

  const body = [
    el("rect", {
      x: 0.5,
      y: 0.5,
      width: 141,
      height: 59,
      fill: PALETTE.surface,
      stroke: PALETTE.line,
      "stroke-width": "1",
    }),
    el("rect", {
      x: 1,
      y: 1,
      width: 2,
      height: 58,
      fill: accentHex,
      "fill-opacity": "0.8",
    }),
    el("g", { transform: "translate(11, 19)" }, stackGlyph(item.slug, accentHex)),
    textEl(
      "text",
      {
        x: 41,
        y: 28,
        fill: PALETTE.soul,
        "font-family": TYPOGRAPHY.sans,
        "font-size": labelSize,
        "font-weight": "600",
      },
      item.label
    ),
    textEl(
      "text",
      {
        x: 41,
        y: 44,
        fill: PALETTE.mist,
        "font-family": TYPOGRAPHY.mono,
        "font-size": "8",
        "letter-spacing": "0.6",
      },
      item.subtitle
    ),
  ];

  return svgDocument({
    idPrefix: `stack-${item.slug}`,
    width: 142,
    height: 60,
    title: item.label,
    desc: `${item.label} — ${item.subtitle}`,
    body,
    isStatic: true,
  });
}

function listSvgFilesRecursive(dir, baseDir = REPO_ROOT) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...listSvgFilesRecursive(full, baseDir));
    } else if (entry.isFile() && entry.name.endsWith(".svg")) {
      results.push(path.relative(baseDir, full).replaceAll("\\", "/"));
    }
  }
  return results;
}

function main() {
  const generated = new Map();
  const manifest = {
    palette: PALETTE,
    heroes: { pt: {}, en: {} },
    footers: { pt: {}, en: {} },
    links: {},
    projects: {},
    stack: {},
    files: {},
  };

  function register(relPath, content, kind, isStatic) {
    const normalized = relPath.replaceAll("\\", "/");
    generated.set(normalized, content);
    const sha256 = sha256Full(content);
    manifest.files[normalized] = {
      sha256,
      hash8: sha256.slice(0, 8),
      bytes: Buffer.byteLength(content, "utf8"),
      kind,
      static: isStatic,
    };
  }

  // 1. Heroes (8)
  for (const lang of ["pt", "en"]) {
    const desktopAnim = `assets/profile/hero-${lang}.svg`;
    const desktopStatic = `assets/profile/hero-${lang}-static.svg`;
    const mobileAnim = `assets/profile/hero-${lang}-mobile.svg`;
    const mobileStatic = `assets/profile/hero-${lang}-mobile-static.svg`;

    register(desktopAnim, buildDesktopHero(lang, false), "hero", false);
    register(desktopStatic, buildDesktopHero(lang, true), "hero", true);
    register(mobileAnim, buildMobileHero(lang, false), "hero", false);
    register(mobileStatic, buildMobileHero(lang, true), "hero", true);

    manifest.heroes[lang] = {
      desktop: desktopAnim,
      desktopStatic,
      mobile: mobileAnim,
      mobileStatic,
    };
  }

  // 2. Footers (4)
  for (const lang of ["pt", "en"]) {
    const footerAnim = `assets/profile/footer-${lang}.svg`;
    const footerStatic = `assets/profile/footer-${lang}-static.svg`;

    register(footerAnim, buildFooter(lang, false), "footer", false);
    register(footerStatic, buildFooter(lang, true), "footer", true);

    manifest.footers[lang] = {
      animated: footerAnim,
      static: footerStatic,
    };
  }

  // 3. Links / Switchers / Nav Pills (all static)
  for (const btn of LINK_BUTTONS) {
    const svg = buildLinkButton(btn);
    const relPath = `assets/profile/links/${btn.slug}.svg`;
    register(relPath, svg, "link", true);
    manifest.links[btn.slug] = relPath;
  }

  for (const navItem of NAV) {
    for (const lang of ["pt", "en"]) {
      const slug = lang === "pt" ? navItem.ptSlug : navItem.enSlug;
      const svg = buildNavPill(navItem, lang);
      const relPath = `assets/profile/links/${slug}.svg`;
      register(relPath, svg, "link", true);
      manifest.links[slug] = relPath;
    }
  }

  // 4. Project Covers (01-05 x pt/en x anim/static = 20 SVGs)
  for (const project of PROJECTS) {
    manifest.projects[project.slug] = { pt: {}, en: {} };
    for (const lang of ["pt", "en"]) {
      const animSvg = buildProjectCover(project, lang, false);
      const animPath = `assets/profile/projects/${project.coverBase}-${lang}.svg`;

      const staticSvg = buildProjectCover(project, lang, true);
      const staticPath = `assets/profile/projects/${project.coverBase}-${lang}-static.svg`;

      register(animPath, animSvg, "project", false);
      register(staticPath, staticSvg, "project", true);

      manifest.projects[project.slug][lang] = {
        animated: animPath,
        static: staticPath,
      };
    }
  }

  // 5. Stack Cards (25 static cards)
  for (const domain of STACK_DOMAINS) {
    for (const item of domain.items) {
      const svg = buildStackCard(item, domain.accent);
      const relPath = `assets/profile/stack/${item.slug}.svg`;
      register(relPath, svg, "stack", true);
      manifest.stack[item.slug] = relPath;
    }
  }

  // Prune stale SVG files before writing
  const existingSvgs = listSvgFilesRecursive(PROFILE_ASSETS_DIR);
  let pruned = 0;
  for (const rel of existingSvgs) {
    if (!generated.has(rel)) {
      fs.unlinkSync(path.join(REPO_ROOT, rel));
      pruned++;
    }
  }

  // Write all generated SVGs deterministically
  for (const [relPath, content] of generated.entries()) {
    const absPath = path.join(REPO_ROOT, relPath);
    fs.mkdirSync(path.dirname(absPath), { recursive: true });
    fs.writeFileSync(absPath, content, "utf8");
  }

  // Write sorted deterministic manifest.json
  const manifestPath = path.join(PROFILE_ASSETS_DIR, "manifest.json");
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  const manifestJson = JSON.stringify(sortKeysDeep(manifest), null, 2) + "\n";
  fs.writeFileSync(manifestPath, manifestJson, "utf8");

  console.log(
    `[build-assets] Generated ${generated.size} SVGs (pruned ${pruned} stale) and updated assets/profile/manifest.json`
  );
}

main();
