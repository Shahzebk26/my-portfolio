"use client";

import { useEffect, useRef } from "react";
import { sanitizeRichTextHtml } from "../../lib/rich-text";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const buttonClass = "rounded-lg border border-(--border) bg-(--panel-strong) px-3 py-2 text-sm font-semibold text-(--text-strong) transition hover:border-cyan-400 hover:text-cyan-300";

export default function RichTextEditor({ value, onChange }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastEmitted = useRef<string | null>(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || value === lastEmitted.current) return;
    editor.innerHTML = sanitizeRichTextHtml(value);
    lastEmitted.current = value;
  }, [value]);

  const runCommand = (command: string, argument?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, argument);
    const editor = editorRef.current;
    if (!editor) return;
    const html = sanitizeRichTextHtml(editor.innerHTML);
    lastEmitted.current = html;
    onChange(html);
  };

  const addLink = () => {
    const href = window.prompt("Enter a web address or mailto link:")?.trim();
    if (!href || !/^(https?:\/\/|mailto:|tel:|#|\/(?!\/))/i.test(href)) return;
    runCommand("createLink", href);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-(--border) bg-(--panel-strong)">
      <div className="flex flex-wrap gap-2 border-b border-(--border) p-3" role="toolbar" aria-label="Project overview formatting">
        <button type="button" className={buttonClass} onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("formatBlock", "<h2>")} aria-label="Heading 2">H2</button>
        <button type="button" className={buttonClass} onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("formatBlock", "<h3>")} aria-label="Heading 3">H3</button>
        <button type="button" className={buttonClass} onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("formatBlock", "<p>")} aria-label="Paragraph">¶</button>
        <button type="button" className={buttonClass} onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("bold")} aria-label="Bold"><strong>B</strong></button>
        <button type="button" className={buttonClass} onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("italic")} aria-label="Italic"><em>I</em></button>
        <button type="button" className={buttonClass} onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("underline")} aria-label="Underline"><u>U</u></button>
        <button type="button" className={buttonClass} onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("insertUnorderedList")} aria-label="Bulleted list">• List</button>
        <button type="button" className={buttonClass} onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("insertOrderedList")} aria-label="Numbered list">1. List</button>
        <button type="button" className={buttonClass} onMouseDown={(event) => event.preventDefault()} onClick={addLink} aria-label="Add link">Link</button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label="Project overview rich text"
        aria-multiline="true"
        onInput={(event) => {
          const html = sanitizeRichTextHtml(event.currentTarget.innerHTML);
          lastEmitted.current = html;
          onChange(html);
        }}
        onPaste={(event) => {
          event.preventDefault();
          const plainText = event.clipboardData.getData("text/plain");
          document.execCommand("insertText", false, plainText);
        }}
        className="min-h-52 whitespace-pre-wrap p-4 text-base leading-7 text-(--text-strong) outline-none [&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:ml-6 [&_ol]:list-decimal [&_p]:my-3 [&_ul]:list-disc"
      />
      <p className="border-t border-(--border) px-4 py-2 text-xs text-(--muted)">Use headings, lists, bold, italic, underline, and links. Pasted text is kept as plain text.</p>
    </div>
  );
}
