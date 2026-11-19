import { createHash } from "node:crypto";

const HEX_LIKE_ID_RE = /^(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

export function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function formatAttrs(attrs = {}) {
  const keys = Object.keys(attrs).filter(
    (k) => attrs[k] !== null && attrs[k] !== undefined && attrs[k] !== false
  );
  if (keys.length === 0) return "";
  return (
    " " +
    keys
      .map((k) => {
        if (k === "id" && HEX_LIKE_ID_RE.test(String(attrs[k]))) {
          throw new Error(`Unsafe hex-like SVG id "${attrs[k]}"`);
        }
        return `${k}="${escapeXml(attrs[k])}"`;
      })
      .join(" ")
  );
}

export function el(tag, attrs = {}, children = []) {
  const attrStr = formatAttrs(attrs);
  if (children === null || children === undefined) {
    return `<${tag}${attrStr}/>`;
  }
  const list = Array.isArray(children) ? children : [children];
  const filtered = list.filter((c) => c !== null && c !== undefined && c !== "");
  if (filtered.length === 0) {
    return `<${tag}${attrStr}/>`;
  }
  return `<${tag}${attrStr}>${filtered.join("")}</${tag}>`;
}

export function textEl(tag, attrs = {}, text = "") {
  return `<${tag}${formatAttrs(attrs)}>${escapeXml(text)}</${tag}>`;
}

export function sha256Full(content) {
  return createHash("sha256").update(content.replaceAll("\r\n", "\n"), "utf8").digest("hex");
}

export function sha256_8(content) {
  return sha256Full(content).slice(0, 8);
}

export function svgDocument({
  idPrefix,
  width,
  height,
  viewBox,
  title,
  desc,
  defs = "",
  css = "",
  body,
  isStatic = false,
}) {
  if (!title || !desc) {
    throw new Error("Every SVG must include non-empty title and desc.");
  }
  if (!Number.isFinite(width) || width <= 0 || !Number.isFinite(height) || height <= 0) {
    throw new Error(`Invalid SVG dimensions: ${width}x${height}`);
  }
  const resolvedViewBox = viewBox ?? `0 0 ${width} ${height}`;
  const cleanCss = (css ?? "").trim();
  const bodyStr = Array.isArray(body) ? body.join("\n") : String(body ?? "");

  if (isStatic) {
    if (cleanCss.length > 0) {
      throw new Error(`Static SVG "${idPrefix}" cannot contain CSS <style>.`);
    }
    if (/<animate|@keyframes|animation:|transition:/i.test(bodyStr)) {
      throw new Error(`Static SVG "${idPrefix}" cannot contain animation primitives.`);
    }
  } else if (cleanCss.length > 0) {
    if (!/@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/i.test(cleanCss)) {
      throw new Error(
        `Animated SVG "${idPrefix}" with CSS must include @media (prefers-reduced-motion: reduce).`
      );
    }
  }

  const titleId = `title-${idPrefix}`;
  const descId = `desc-${idPrefix}`;
  if (HEX_LIKE_ID_RE.test(titleId) || HEX_LIKE_ID_RE.test(descId)) {
    throw new Error(`Invalid idPrefix "${idPrefix}"`);
  }

  const lines = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${escapeXml(resolvedViewBox)}" role="img" aria-labelledby="${escapeXml(titleId)} ${escapeXml(descId)}">`,
    `  <title id="${escapeXml(titleId)}">${escapeXml(title)}</title>`,
    `  <desc id="${escapeXml(descId)}">${escapeXml(desc)}</desc>`,
  ];

  if (defs && defs.trim().length > 0) {
    lines.push("  <defs>");
    lines.push(defs.trimEnd());
    lines.push("  </defs>");
  }

  if (!isStatic && cleanCss.length > 0) {
    lines.push("  <style><![CDATA[");
    lines.push(cleanCss);
    lines.push("  ]]></style>");
  }

  lines.push(bodyStr);
  lines.push("</svg>");

  return lines.join("\n").replaceAll("\r\n", "\n") + "\n";
}

export function sortKeysDeep(value) {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep);
  }
  if (value && typeof value === "object") {
    const sorted = {};
    for (const key of Object.keys(value).sort()) {
      sorted[key] = sortKeysDeep(value[key]);
    }
    return sorted;
  }
  return value;
}
