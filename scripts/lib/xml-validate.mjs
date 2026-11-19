const VOID_OR_PI_END = /\?>/g;
const NAMED_ENTITY_SET = new Set(["amp", "lt", "gt", "quot", "apos"]);
const SMIL_TAGS = new Set(["animate", "animateTransform", "animateMotion", "set"]);
const COLOR_ATTR_NAMES = new Set([
  "fill",
  "stroke",
  "stop-color",
  "color",
  "flood-color",
  "lighting-color",
]);
const ALLOWED_NAMED_COLOR_KEYWORDS = new Set(["none", "currentcolor"]);

function decodeBasicEntities(str) {
  return str
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

function validateEntities(text, filePath, context) {
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "&") {
      const semi = text.indexOf(";", i + 1);
      if (semi === -1) {
        throw new Error(`${filePath}: Unterminated '&' entity in ${context}`);
      }
      const entity = text.slice(i + 1, semi);
      if (NAMED_ENTITY_SET.has(entity)) {
        i = semi;
        continue;
      }
      if (/^#\d+$/.test(entity) || /^#x[0-9a-fA-F]+$/.test(entity)) {
        i = semi;
        continue;
      }
      throw new Error(`${filePath}: Invalid XML entity "&${entity};" in ${context}`);
    }
  }
}

function parseAttributes(attrSlice, filePath, tagName) {
  const attrs = {};
  let i = 0;
  const len = attrSlice.length;

  while (i < len) {
    while (i < len && /\s/.test(attrSlice[i])) i++;
    if (i >= len) break;

    const nameStart = i;
    while (i < len && /[A-Za-z0-9_:\-.]/.test(attrSlice[i])) i++;
    const name = attrSlice.slice(nameStart, i);
    if (!name || !/^[A-Za-z_:][A-Za-z0-9_:\-.]*$/.test(name)) {
      throw new Error(`${filePath}: Malformed attribute name in <${tagName}> near "${attrSlice.slice(nameStart, nameStart + 20)}"`);
    }
    if (Object.prototype.hasOwnProperty.call(attrs, name)) {
      throw new Error(`${filePath}: Duplicate attribute "${name}" on <${tagName}>`);
    }

    while (i < len && /\s/.test(attrSlice[i])) i++;
    if (attrSlice[i] !== "=") {
      throw new Error(`${filePath}: Attribute "${name}" on <${tagName}> missing "="`);
    }
    i++;
    while (i < len && /\s/.test(attrSlice[i])) i++;

    const quote = attrSlice[i];
    if (quote !== '"' && quote !== "'") {
      throw new Error(`${filePath}: Attribute "${name}" on <${tagName}> must be quoted`);
    }
    i++;
    const valStart = i;
    while (i < len && attrSlice[i] !== quote) {
      if (attrSlice[i] === "<") {
        throw new Error(`${filePath}: Unescaped "<" in attribute "${name}" on <${tagName}>`);
      }
      i++;
    }
    if (i >= len) {
      throw new Error(`${filePath}: Unterminated attribute "${name}" on <${tagName}>`);
    }
    const rawValue = attrSlice.slice(valStart, i);
    validateEntities(rawValue, filePath, `attribute "${name}" on <${tagName}>`);
    attrs[name] = decodeBasicEntities(rawValue);
    i++;

    if (i < len && !/\s/.test(attrSlice[i])) {
      throw new Error(`${filePath}: Missing whitespace after attribute "${name}" on <${tagName}>`);
    }
  }

  return attrs;
}

export function parseAndValidateXml(xmlText, filePath) {
  if (typeof xmlText !== "string" || xmlText.trim().length === 0) {
    throw new Error(`${filePath}: Empty SVG/XML document`);
  }
  if (/<!DOCTYPE|<!ENTITY/i.test(xmlText)) {
    throw new Error(`${filePath}: Forbidden DOCTYPE/ENTITY declaration`);
  }
  if (/<script\b/i.test(xmlText) || /<foreignObject\b/i.test(xmlText)) {
    throw new Error(`${filePath}: Forbidden <script> or <foreignObject> element`);
  }
  if (/javascript:/i.test(xmlText)) {
    throw new Error(`${filePath}: Forbidden javascript: URI`);
  }

  const stack = [];
  let rootTag = null;
  let rootAttrs = null;
  let rootClosed = false;
  let seenRoot = false;

  let titleText = "";
  let descText = "";
  let hasTitle = false;
  let hasDesc = false;
  const styleBlocks = [];
  const inlineStyleAttrs = [];
  const smilTags = [];
  const allIds = [];

  let i = 0;
  const len = xmlText.length;

  while (i < len) {
    if (xmlText[i] !== "<") {
      const nextTag = xmlText.indexOf("<", i);
      const end = nextTag === -1 ? len : nextTag;
      const textSegment = xmlText.slice(i, end);
      if (stack.length === 0) {
        if (textSegment.trim().length > 0) {
          throw new Error(`${filePath}: Non-whitespace text outside root element: "${textSegment.trim().slice(0, 40)}"`);
        }
      } else {
        validateEntities(textSegment, filePath, `text inside <${stack[stack.length - 1].tag}>`);
        const top = stack[stack.length - 1];
        top.text += decodeBasicEntities(textSegment);
      }
      i = end;
      continue;
    }

    if (xmlText.startsWith("<!--", i)) {
      const closeIdx = xmlText.indexOf("-->", i + 4);
      if (closeIdx === -1) {
        throw new Error(`${filePath}: Unterminated XML comment`);
      }
      const commentBody = xmlText.slice(i + 4, closeIdx);
      if (commentBody.includes("--")) {
        throw new Error(`${filePath}: Invalid "--" inside XML comment`);
      }
      i = closeIdx + 3;
      continue;
    }

    if (xmlText.startsWith("<![CDATA[", i)) {
      if (stack.length === 0) {
        throw new Error(`${filePath}: CDATA section outside root element`);
      }
      const closeIdx = xmlText.indexOf("]]>", i + 9);
      if (closeIdx === -1) {
        throw new Error(`${filePath}: Unterminated CDATA section`);
      }
      stack[stack.length - 1].text += xmlText.slice(i + 9, closeIdx);
      i = closeIdx + 3;
      continue;
    }

    if (xmlText.startsWith("<?", i)) {
      if (seenRoot) {
        throw new Error(`${filePath}: Processing instruction after root element`);
      }
      VOID_OR_PI_END.lastIndex = i + 2;
      const m = VOID_OR_PI_END.exec(xmlText);
      if (!m) {
        throw new Error(`${filePath}: Unterminated XML processing instruction`);
      }
      i = m.index + 2;
      continue;
    }

    if (xmlText.startsWith("</", i)) {
      const closeBracket = xmlText.indexOf(">", i + 2);
      if (closeBracket === -1) {
        throw new Error(`${filePath}: Unterminated closing tag`);
      }
      const closeName = xmlText.slice(i + 2, closeBracket).trim();
      if (stack.length === 0) {
        throw new Error(`${filePath}: Unexpected closing tag </${closeName}>`);
      }
      const top = stack.pop();
      if (top.tag !== closeName) {
        throw new Error(`${filePath}: Mismatched closing tag </${closeName}>, expected </${top.tag}>`);
      }
      if (top.tag === "title" && stack.length === 1 && stack[0].tag === "svg") {
        hasTitle = true;
        titleText = top.text.trim();
      } else if (top.tag === "desc" && stack.length === 1 && stack[0].tag === "svg") {
        hasDesc = true;
        descText = top.text.trim();
      } else if (top.tag === "style") {
        styleBlocks.push(top.text);
      }
      if (stack.length === 0) {
        rootClosed = true;
      }
      i = closeBracket + 1;
      continue;
    }

    // Start or self-closing tag
    let j = i + 1;
    let quote = null;
    while (j < len) {
      const ch = xmlText[j];
      if (quote) {
        if (ch === quote) quote = null;
      } else {
        if (ch === '"' || ch === "'") quote = ch;
        else if (ch === "<") {
          throw new Error(`${filePath}: Unexpected "<" inside tag starting at offset ${i}`);
        } else if (ch === ">") {
          break;
        }
      }
      j++;
    }
    if (j >= len) {
      throw new Error(`${filePath}: Unterminated start tag at offset ${i}`);
    }

    const inner = xmlText.slice(i + 1, j);
    const selfClosing = inner.endsWith("/");
    const content = (selfClosing ? inner.slice(0, -1) : inner).trim();
    const spaceIdx = content.search(/\s/);
    const tagName = spaceIdx === -1 ? content : content.slice(0, spaceIdx);
    const attrSlice = spaceIdx === -1 ? "" : content.slice(spaceIdx + 1);

    if (!/^[A-Za-z_:][A-Za-z0-9_:\-.]*$/.test(tagName)) {
      throw new Error(`${filePath}: Invalid XML tag name "${tagName}"`);
    }

    if (rootClosed) {
      throw new Error(`${filePath}: Multiple root elements (<${tagName}> after </${rootTag}>)`);
    }

    const attrs = parseAttributes(attrSlice, filePath, tagName);
    for (const attrName of Object.keys(attrs)) {
      if (/^on[a-z]+$/i.test(attrName)) {
        throw new Error(`${filePath}: Forbidden event handler attribute "${attrName}" on <${tagName}>`);
      }
      if (
        (attrName === "href" || attrName === "xlink:href" || attrName === "src") &&
        /^https?:\/\//i.test(attrs[attrName].trim())
      ) {
        throw new Error(`${filePath}: Forbidden external URL in ${attrName}="${attrs[attrName]}"`);
      }
    }

    if (attrs.id !== undefined) {
      allIds.push(attrs.id);
    }
    if (attrs.style !== undefined) {
      inlineStyleAttrs.push({ tag: tagName, style: attrs.style });
    }
    if (SMIL_TAGS.has(tagName)) {
      smilTags.push(tagName);
    }

    if (!seenRoot) {
      seenRoot = true;
      rootTag = tagName;
      rootAttrs = attrs;
    }

    if (!selfClosing) {
      stack.push({ tag: tagName, attrs, text: "" });
    } else if (stack.length === 0) {
      rootClosed = true;
    }

    i = j + 1;
  }

  if (stack.length > 0) {
    throw new Error(`${filePath}: Unclosed tag <${stack[stack.length - 1].tag}> at EOF`);
  }
  if (!seenRoot || !rootClosed) {
    throw new Error(`${filePath}: Missing or unclosed root element`);
  }

  return {
    rootTag,
    rootAttrs,
    hasTitle,
    titleText,
    hasDesc,
    descText,
    styleBlocks,
    inlineStyleAttrs,
    smilTags,
    allIds,
  };
}

export function validateSvgAccessibility(meta, filePath) {
  if (meta.rootTag !== "svg") {
    throw new Error(`${filePath}: Root tag must be <svg>, got <${meta.rootTag}>`);
  }
  if (meta.rootAttrs.xmlns !== "http://www.w3.org/2000/svg") {
    throw new Error(`${filePath}: Missing xmlns="http://www.w3.org/2000/svg"`);
  }
  if (!meta.hasTitle || !meta.titleText) {
    throw new Error(`${filePath}: Missing or empty <title>`);
  }
  if (!meta.hasDesc || !meta.descText) {
    throw new Error(`${filePath}: Missing or empty <desc>`);
  }
  const vb = (meta.rootAttrs.viewBox ?? "").trim().split(/\s+/).map(Number);
  if (vb.length !== 4 || vb.some((n) => !Number.isFinite(n)) || vb[2] <= 0 || vb[3] <= 0) {
    throw new Error(`${filePath}: Invalid viewBox="${meta.rootAttrs.viewBox ?? ""}"`);
  }
  const w = Number(meta.rootAttrs.width);
  const h = Number(meta.rootAttrs.height);
  if (!Number.isFinite(w) || w <= 0 || !Number.isFinite(h) || h <= 0) {
    throw new Error(`${filePath}: Invalid numeric width/height`);
  }
}

export function validateSvgMotion(meta, isStatic, filePath) {
  if (isStatic) {
    if (meta.styleBlocks.length > 0) {
      throw new Error(`${filePath}: Static SVG must not contain <style> blocks`);
    }
    if (meta.smilTags.length > 0) {
      throw new Error(`${filePath}: Static SVG must not contain SMIL tags (${meta.smilTags.join(", ")})`);
    }
    for (const inline of meta.inlineStyleAttrs) {
      if (/animation|transition|@keyframes/i.test(inline.style)) {
        throw new Error(`${filePath}: Static SVG must not contain animation/transition inline styles`);
      }
    }
  } else if (meta.styleBlocks.length > 0 || meta.smilTags.length > 0) {
    const css = meta.styleBlocks.join("\n");
    if (!/@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/i.test(css)) {
      throw new Error(`${filePath}: Animated SVG missing @media (prefers-reduced-motion: reduce)`);
    }
    if (!/animation\s*:\s*none/i.test(css)) {
      throw new Error(`${filePath}: Animated SVG reduced-motion block must disable animation (animation: none)`);
    }
  }
}

export function validateSvgPalette(svgText, allowedHexSet, filePath) {
  if (/https?:\/\//i.test(svgText) && !/xmlns="http:\/\/www\.w3\.org\/2000\/svg"/.test(svgText)) {
    throw new Error(`${filePath}: External HTTP(S) URL found in SVG`);
  }
  // Check external URLs after removing the standard SVG/XLink namespace declarations
  const withoutNamespaces = svgText
    .replaceAll('xmlns="http://www.w3.org/2000/svg"', "")
    .replaceAll('xmlns:xlink="http://www.w3.org/1999/xlink"', "");
  if (/https?:\/\//i.test(withoutNamespaces) || /@import\b/i.test(withoutNamespaces)) {
    throw new Error(`${filePath}: External URL or @import found inside SVG`);
  }

  // Reject functional colors
  if (/\b(?:rgb|rgba|hsl|hsla|oklab|oklch|lab|lch|color-mix)\s*\(/i.test(svgText)) {
    throw new Error(`${filePath}: Forbidden CSS color function (rgb/hsl/oklab/color-mix)`);
  }

  // Validate named colors on presentation attributes
  const attrColorRe = /\b(fill|stroke|stop-color|color|flood-color|lighting-color)\s*=\s*(["'])([^"']+)\2/gi;
  let attrMatch;
  while ((attrMatch = attrColorRe.exec(svgText)) !== null) {
    const attrName = attrMatch[1];
    const val = attrMatch[3].trim();
    if (ALLOWED_NAMED_COLOR_KEYWORDS.has(val.toLowerCase())) continue;
    if (/^url\(#[^)]+\)$/i.test(val)) continue;
    if (/^#[0-9a-fA-F]{6}$/.test(val) && allowedHexSet.has(val.toLowerCase())) continue;
    throw new Error(`${filePath}: Disallowed color value ${attrName}="${val}"`);
  }

  // Strip safe non-color '#' contexts (url(#...), href="#...", id="...", XML numeric entities &#...;)
  const sanitizedForHexScan = svgText
    .replace(/url\(#[^)]+\)/g, "")
    .replace(/(?:xlink:)?href\s*=\s*(["'])#[^"']+\1/g, "")
    .replace(/\bid\s*=\s*(["'])[^"']+\1/g, "")
    .replace(/\baria-labelledby\s*=\s*(["'])[^"']+\1/g, "")
    .replace(/&#x?[0-9a-fA-F]+;/g, "");

  const hexMatches = sanitizedForHexScan.matchAll(/#([0-9a-fA-F]{1,12})\b/g);
  for (const m of hexMatches) {
    const fullHex = `#${m[1].toLowerCase()}`;
    if (m[1].length !== 6 || !allowedHexSet.has(fullHex)) {
      throw new Error(`${filePath}: Disallowed hex color "${fullHex}" (must be strict 7-color palette)`);
    }
  }
}
