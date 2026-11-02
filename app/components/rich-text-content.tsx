import { hasRichTextMarkup, sanitizeRichTextHtml } from "../../lib/rich-text";

export default function RichTextContent({ content }: { content: string }) {
  if (!hasRichTextMarkup(content)) {
    return <p className="mt-4 whitespace-pre-line text-base leading-8 text-(--muted)">{content}</p>;
  }

  return (
    <div
      className="rich-content mt-4 text-base leading-8 text-(--muted) [&_a]:text-cyan-300 [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-cyan-400 [&_blockquote]:pl-4 [&_code]:rounded [&_code]:bg-(--panel-strong) [&_code]:px-1 [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-(--text-strong) [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-(--text-strong) [&_li]:ml-6 [&_ol]:list-decimal [&_p]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-(--panel-strong) [&_pre]:p-4 [&_ul]:list-disc [&_hr]:my-5 [&_hr]:border-(--border) [&_s]:line-through"
      dangerouslySetInnerHTML={{ __html: sanitizeRichTextHtml(content) }}
    />
  );
}
