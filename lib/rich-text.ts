const allowedTags = new Set([
  "p", "h2", "h3", "h4", "ul", "ol", "li", "strong", "b", "em", "i", "u", "s", "del", "blockquote", "a", "br", "pre", "code", "hr",
]);

function isSafeHref(value: string) {
  const href = value.trim().replace(/[\u0000-\u0020]+/g, "");
  return /^(https?:\/\/|mailto:|tel:|#|\/(?!\/))/i.test(href);
}

/** Restrict editor output to simple formatting tags and safe links. */
export function sanitizeRichTextHtml(input: string) {
  const withoutActiveContent = input
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|iframe|object|embed|svg|math)[^>]*>[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<\/?h1\b[^>]*>/gi, (tag) => tag.startsWith("</") ? "</h2>" : "<h2>")
    .replace(/<\/?(h5|h6)\b[^>]*>/gi, (tag) => tag.startsWith("</") ? "</h3>" : "<h3>")
    .replace(/<div\b[^>]*>/gi, "<p>")
    .replace(/<\/div\s*>/gi, "</p>");

  return withoutActiveContent.replace(/<\/?([a-z][a-z0-9]*)\b([^>]*)>/gi, (match, rawTag: string, attributes: string) => {
    const tag = rawTag.toLowerCase();
    if (!allowedTags.has(tag)) return "";
    if (match.startsWith("</")) return tag === "br" ? "" : `</${tag}>`;
    if (tag === "br") return "<br>";
    if (tag !== "a") return `<${tag}>`;

    const hrefMatch = attributes.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const href = hrefMatch?.[1] ?? hrefMatch?.[2] ?? hrefMatch?.[3] ?? "";
    if (!href || !isSafeHref(href)) return "<a>";
    const safeHref = href.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
    return `<a href="${safeHref}">`;
  });
}

export function hasRichTextMarkup(input: string) {
  return /<\/?(?:p|h[2-4]|ul|ol|li|strong|b|em|i|u|s|del|blockquote|a|br|pre|code|hr)\b/i.test(input);
}

function escapeText(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttribute(value: string) {
  return escapeText(value).replace(/"/g, "&quot;");
}

function wrapMarks(html: string, marks: string[]) {
  return marks.reduceRight((content, mark) => `<${mark}>${content}</${mark}>`, html);
}

/** Convert clipboard HTML, including common inline styles, into supported semantic markup. */
export function normalizePastedRichTextHtml(input: string) {
  const parsed = new DOMParser().parseFromString(input, "text/html");

  const serialize = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) return escapeText(node.textContent ?? "");
    if (!(node instanceof Element)) return "";

    const tag = node.tagName.toLowerCase();
    if (["script", "style", "iframe", "object", "embed", "svg", "math"].includes(tag)) return "";

    const style = node.getAttribute("style") ?? "";
    const fontWeight = style.match(/font-weight\s*:\s*([^;]+)/i)?.[1]?.trim() ?? "";
    const fontSize = style.match(/font-size\s*:\s*([^;]+)/i)?.[1]?.trim() ?? "";
    const marks: string[] = [];
    if (fontWeight === "bold" || fontWeight === "bolder" || (Number.parseInt(fontWeight, 10) >= 600)) marks.push("strong");
    if (/font-style\s*:\s*italic/i.test(style)) marks.push("em");
    if (/text-decoration(?:-line)?\s*:[^;]*underline/i.test(style)) marks.push("u");
    if (/text-decoration(?:-line)?\s*:[^;]*(?:line-through|strike)/i.test(style)) marks.push("s");

    let children = Array.from(node.childNodes).map(serialize).join("");
    const headingClass = `${node.className ?? ""} ${node.getAttribute("data-contrast") ?? ""}`;
    const largeBoldText = marks.includes("strong") && /(?:24px|1\.[4-9]\w*|[2-9]\dpt)/i.test(fontSize);
    let outputTag = tag;

    if (/title|heading|subtitle/i.test(headingClass) || largeBoldText) {
      outputTag = /subtitle|heading[3-6]/i.test(headingClass) || /(?:18|20|1\.[2-3]\w*|1\dpt)/i.test(fontSize) ? "h3" : "h2";
    } else if (tag === "div") {
      outputTag = "p";
    } else if (tag === "h1") {
      outputTag = "h2";
    } else if (tag === "h5" || tag === "h6") {
      outputTag = "h3";
    }

    if (tag === "a") {
      const href = node.getAttribute("href") ?? "";
      const safeOpen = isSafeHref(href);
      children = safeOpen ? `<a href="${escapeAttribute(href)}">${children}</a>` : children;
    } else if (["span", "font"].includes(tag)) {
      // These wrappers commonly carry Word/website inline styles instead of semantic tags.
      children = wrapMarks(children, marks);
    } else if (allowedTags.has(outputTag)) {
      if (outputTag === "br" || outputTag === "hr") {
        children = `<${outputTag}>`;
      } else {
        children = `<${outputTag}>${children}</${outputTag}>`;
      }
    }

    if (tag !== "a" && !["span", "font"].includes(tag) && !allowedTags.has(outputTag)) {
      children = wrapMarks(children, marks);
    }

    // Marks attached to block elements apply to their contents, not to the block tag.
    if (["p", "div", "h1", "h2", "h3", "h4", "h5", "h6"].includes(tag)) {
      children = wrapMarks(children, marks);
    }
    return children;
  };

  return Array.from(parsed.body.childNodes).map(serialize).join("");
}
