import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  ALLOWED_HEXES,
  FORBIDDEN_STRINGS,
  FORBIDDEN_EXTERNAL_IMAGE_HOSTS,
  LINKS,
  PROFILE,
  PROJECTS,
  STACK_DOMAINS,
  EXPERIENCE,
  BEYOND_CODE,
  README_VARIANTS,
} from "./data/portfolio.mjs";
import { sha256Full } from "./lib/svg-core.mjs";
import {
  parseAndValidateXml,
  validateSvgAccessibility,
  validateSvgMotion,
  validateSvgPalette,
} from "./lib/xml-validate.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const ASSETS_DIR = path.join(REPO_ROOT, "assets");
const MANIFEST_PATH = path.join(ASSETS_DIR, "profile", "manifest.json");

const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

function listFilesRecursive(dir, extFilter = null) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...listFilesRecursive(full, extFilter));
    } else if (entry.isFile()) {
      if (!extFilter || extFilter.some((ext) => entry.name.endsWith(ext))) {
        results.push(full);
      }
    }
  }
  return results;
}

function slugifyGfm(headingText) {
  return headingText
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s/g, "-");
}

function extractHeadings(markdown) {
  const slugs = new Set();
  const counts = new Map();
  let inFence = false;
  for (const line of markdown.split("\n")) {
    if (/^```/.test(line.trim())) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^#{1,6}\s+(.+?)\s*#*$/.exec(line);
    if (!m) continue;
    const base = slugifyGfm(m[1]);
    const prev = counts.get(base) ?? 0;
    counts.set(base, prev + 1);
    slugs.add(prev === 0 ? base : `${base}-${prev}`);
  }
  return slugs;
}

function checkForbiddenText(content, relPath, errors) {
  for (const token of FORBIDDEN_STRINGS) {
    if (content.toLowerCase().includes(token.toLowerCase())) {
      errors.push(`${relPath}: Contains forbidden string "${token}"`);
    }
  }
  const emailMatch = EMAIL_PATTERN.exec(content);
  if (emailMatch) {
    errors.push(`${relPath}: Contains disallowed email address "${emailMatch[0]}"`);
  }
}

function main() {
  const errors = [];

  // 1. Manifest & Hash Integrity
  if (!fs.existsSync(MANIFEST_PATH)) {
    errors.push("Missing assets/profile/manifest.json");
    reportAndExit(errors);
  }
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  const manifestEntries = manifest.files ?? {};
  const manifestPaths = new Set(Object.keys(manifestEntries));

  const diskSvgs = listFilesRecursive(ASSETS_DIR, [".svg"]).map((abs) =>
    path.relative(REPO_ROOT, abs).replaceAll("\\", "/")
  );

  for (const diskRel of diskSvgs) {
    if (!manifestPaths.has(diskRel)) {
      errors.push(`Orphan SVG not in manifest.json: ${diskRel}`);
    }
  }

  for (const [relPath, entry] of Object.entries(manifestEntries)) {
    const absPath = path.join(REPO_ROOT, relPath);
    if (!fs.existsSync(absPath)) {
      errors.push(`Manifest entry missing on disk: ${relPath}`);
      continue;
    }
    const content = fs.readFileSync(absPath, "utf8");
    const actualSha = sha256Full(content);
    const actualBytes = Buffer.byteLength(content, "utf8");
    if (actualSha !== entry.sha256) {
      errors.push(`${relPath}: SHA-256 mismatch (manifest=${entry.sha256}, disk=${actualSha})`);
    }
    if (actualBytes !== entry.bytes) {
      errors.push(`${relPath}: Byte size mismatch (manifest=${entry.bytes}, disk=${actualBytes})`);
    }
    if (relPath.startsWith("assets/profile/links/") || relPath.startsWith("assets/profile/stack/")) {
      if (entry.static !== true) {
        errors.push(`${relPath}: Must be marked static: true in manifest`);
      }
    }
  }

  // 2, 3, 4. XML, Accessibility, Motion & Strict Palette on EVERY SVG
  for (const relPath of manifestPaths) {
    const absPath = path.join(REPO_ROOT, relPath);
    if (!fs.existsSync(absPath)) continue;
    const svgText = fs.readFileSync(absPath, "utf8");
    const entry = manifestEntries[relPath];
    try {
      const meta = parseAndValidateXml(svgText, relPath);
      validateSvgAccessibility(meta, relPath);
      validateSvgMotion(meta, Boolean(entry.static), relPath);
      validateSvgPalette(svgText, ALLOWED_HEXES, relPath);
    } catch (err) {
      errors.push(err.message);
    }
    checkForbiddenText(svgText, relPath, errors);
  }

  // 5 & 6. README Verification + Content Parity + Forbidden Strings
  for (const variant of README_VARIANTS) {
    const absReadme = path.join(REPO_ROOT, variant.filename);
    if (!fs.existsSync(absReadme)) {
      errors.push(`Missing root README variant: ${variant.filename}`);
      continue;
    }
    const md = fs.readFileSync(absReadme, "utf8");
    checkForbiddenText(md, variant.filename, errors);

    // Forbid inline style="..." on Markdown HTML tags
    if (/<(?:picture|source|img|p|div|details|summary|a|table|tr|td|th)\b[^>]*\sstyle\s*=/i.test(md)) {
      errors.push(`${variant.filename}: Forbidden inline style="..." attribute in Markdown HTML`);
    }

    // Check animated vs static hero/cover wiring
    if (!variant.staticMode) {
      if (!/<picture>[\s\S]*prefers-reduced-motion:\s*reduce[\s\S]*max-width:\s*600px/i.test(md)) {
        errors.push(`${variant.filename}: Missing <picture> with prefers-reduced-motion & max-width: 600px`);
      }
    }

    // Validate HTML src / srcset / href attributes
    const attrRefs = md.matchAll(/\b(?:src|srcset|href)\s*=\s*"([^"]+)"/gi);
    for (const m of attrRefs) {
      const attrVal = m[1].trim();
      const attrName = m[0].split("=")[0].trim().toLowerCase();
      if (attrName === "src" || attrName === "srcset") {
        if (/^https?:\/\//i.test(attrVal)) {
          errors.push(`${variant.filename}: External image URL forbidden in ${attrName}: "${attrVal}"`);
          continue;
        }
      }
      validateTarget(attrVal, variant, manifestEntries, md, errors);
    }

    // Validate Markdown image & link syntax ![alt](url) / [text](url)
    const mdRefs = md.matchAll(/(!?)\[[^\]]*\]\(([^)]+)\)/g);
    for (const m of mdRefs) {
      const isImage = m[1] === "!";
      const target = m[2].trim();
      if (isImage && /^https?:\/\//i.test(target)) {
        errors.push(`${variant.filename}: External Markdown image URL forbidden: "${target}"`);
        continue;
      }
      validateTarget(target, variant, manifestEntries, md, errors);
    }

    // Check external badge domains anywhere
    for (const host of FORBIDDEN_EXTERNAL_IMAGE_HOSTS) {
      if (md.toLowerCase().includes(host)) {
        errors.push(`${variant.filename}: Forbidden external badge host "${host}"`);
      }
    }

    // Verify heading anchors
    const headingSlugs = extractHeadings(md);
    for (const m of md.matchAll(/href="#([^"]+)"/gi)) {
      const anchor = m[1];
      if (anchor !== "top" && !headingSlugs.has(anchor)) {
        errors.push(`${variant.filename}: Broken local anchor "#${anchor}" (valid: ${[...headingSlugs].join(", ")})`);
      }
    }

    // Content parity checks
    const requiredSubstrings = [
      PROFILE.name,
      PROFILE.handle,
      LINKS.github,
      LINKS.linkedin,
      "https://imnotjean01.github.io/Minhas-financas/",
      "https://github.com/ImNotJean01/Minhas-financas",
      "https://github.com/ImNotJean01/Rpg-Table",
      "UNINASSAU",
      "Skam Tecnologia",
      BEYOND_CODE.terminalHeader,
      "./README.md",
      "./README.en.md",
      "./README.static.md",
      "./README.en.static.md",
      "./docs/PROFILE_DESIGN.md",
      ...PROJECTS.map((p) => p.title),
      "Rpg-Table",
      ...EXPERIENCE[variant.lang].map((e) => e.company),
      ...STACK_DOMAINS.flatMap((d) => [
        variant.lang === "pt" ? d.ptTitle : d.enTitle,
        ...d.items.map((i) => (variant.lang === "pt" ? i.ptText : i.enText)),
      ]),
    ];

    for (const req of requiredSubstrings) {
      if (!md.includes(req)) {
        errors.push(`${variant.filename}: Missing required content "${req}"`);
      }
    }
  }

  // Also scan docs/ and manifest.json for forbidden strings
  const docsAndJson = [
    MANIFEST_PATH,
    ...listFilesRecursive(path.join(REPO_ROOT, "docs"), [".md"]),
  ];
  for (const abs of docsAndJson) {
    if (!fs.existsSync(abs)) {
      errors.push(`Missing expected file: ${path.relative(REPO_ROOT, abs)}`);
      continue;
    }
    const rel = path.relative(REPO_ROOT, abs).replaceAll("\\", "/");
    checkForbiddenText(fs.readFileSync(abs, "utf8"), rel, errors);
  }

  reportAndExit(errors, manifestPaths.size);
}

function validateTarget(target, variant, manifestEntries, _md, errors) {
  if (target.startsWith("#") || /^https?:\/\//i.test(target)) {
    return;
  }
  const cleanTarget = target.split("#")[0].split("?")[0];
  if (!cleanTarget) return;
  const resolved = path.resolve(REPO_ROOT, cleanTarget);
  if (!resolved.startsWith(REPO_ROOT + path.sep) && resolved !== REPO_ROOT) {
    errors.push(`${variant.filename}: Path traversal outside repo: "${target}"`);
    return;
  }
  if (!fs.existsSync(resolved)) {
    errors.push(`${variant.filename}: Broken relative path "${target}"`);
    return;
  }
  if (cleanTarget.endsWith(".svg")) {
    const relSvg = path.relative(REPO_ROOT, resolved).replaceAll("\\", "/");
    const entry = manifestEntries[relSvg];
    if (!entry) {
      errors.push(`${variant.filename}: Referenced SVG missing from manifest.json: "${relSvg}"`);
    } else if (variant.staticMode && entry.static !== true) {
      errors.push(`${variant.filename}: Static README must not reference animated SVG "${relSvg}"`);
    }
  }
}

function reportAndExit(errors, svgCount = 0) {
  if (errors.length > 0) {
    console.error(`[validate] FAILED with ${errors.length} error(s):`);
    for (const e of errors) {
      console.error(`  - ${e}`);
    }
    process.exit(1);
  }
  console.log(
    `[validate] PASS: ${svgCount} SVGs, 4 READMEs, manifest hashes, strict 7-color palette, motion safety, and content gates verified.`
  );
}

main();
