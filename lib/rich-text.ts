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
