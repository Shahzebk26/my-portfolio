"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { normalizePastedRichTextHtml, sanitizeRichTextHtml } from "../../lib/rich-text";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const buttonClass = "rounded-lg border border-(--border) bg-(--panel-strong) px-3 py-2 text-sm font-semibold text-(--text-strong) transition hover:border-cyan-400 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-40";

export default function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: { openOnClick: false },
      }),
    ],
    content: sanitizeRichTextHtml(value),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "tiptap min-h-64 p-4 text-base leading-7 text-(--text-strong) outline-none [&_a]:text-cyan-300 [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-cyan-400 [&_blockquote]:pl-4 [&_code]:rounded [&_code]:bg-(--panel) [&_code]:px-1 [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-xl [&_h3]:font-semibold [&_h4]:mt-4 [&_h4]:text-lg [&_h4]:font-semibold [&_li]:ml-6 [&_ol]:list-decimal [&_p]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-(--panel) [&_pre]:p-4 [&_ul]:list-disc [&_hr]:my-5 [&_hr]:border-(--border)",
        "aria-label": "Project overview rich text editor",
      },
      transformPastedHTML: normalizePastedRichTextHtml,
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(sanitizeRichTextHtml(currentEditor.getHTML()));
    },
  });

  useEffect(() => {
    if (!editor) return;
    const safeValue = sanitizeRichTextHtml(value);
    if (editor.getHTML() !== safeValue) {
      editor.commands.setContent(safeValue, { emitUpdate: false });
    }
  }, [editor, value]);

  const action = (run: () => void) => (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    run();
  };

  const addLink = () => {
    const href = window.prompt("Enter a web address, email, or phone link:")?.trim();
    if (!href || !/^(https?:\/\/|mailto:|tel:|#|\/(?!\/))/i.test(href)) return;
    editor?.chain().focus().setLink({ href }).run();
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-(--border) bg-(--panel-strong)">
      <div className="flex flex-wrap gap-2 border-b border-(--border) p-3" role="toolbar" aria-label="Project overview formatting">
        <button type="button" className={buttonClass} disabled={!editor} onMouseDown={(event) => event.preventDefault()} onClick={action(() => editor?.chain().focus().toggleHeading({ level: 2 }).run())} aria-label="Heading 2" aria-pressed={editor?.isActive("heading", { level: 2 })}>H2</button>
        <button type="button" className={buttonClass} disabled={!editor} onMouseDown={(event) => event.preventDefault()} onClick={action(() => editor?.chain().focus().toggleHeading({ level: 3 }).run())} aria-label="Heading 3" aria-pressed={editor?.isActive("heading", { level: 3 })}>H3</button>
        <button type="button" className={buttonClass} disabled={!editor} onMouseDown={(event) => event.preventDefault()} onClick={action(() => editor?.chain().focus().setParagraph().run())} aria-label="Paragraph">¶</button>
        <button type="button" className={buttonClass} disabled={!editor} onMouseDown={(event) => event.preventDefault()} onClick={action(() => editor?.chain().focus().toggleBold().run())} aria-label="Bold" aria-pressed={editor?.isActive("bold")}><strong>B</strong></button>
        <button type="button" className={buttonClass} disabled={!editor} onMouseDown={(event) => event.preventDefault()} onClick={action(() => editor?.chain().focus().toggleItalic().run())} aria-label="Italic" aria-pressed={editor?.isActive("italic")}><em>I</em></button>
        <button type="button" className={buttonClass} disabled={!editor} onMouseDown={(event) => event.preventDefault()} onClick={action(() => editor?.chain().focus().toggleUnderline().run())} aria-label="Underline" aria-pressed={editor?.isActive("underline")}><u>U</u></button>
        <button type="button" className={buttonClass} disabled={!editor} onMouseDown={(event) => event.preventDefault()} onClick={action(() => editor?.chain().focus().toggleStrike().run())} aria-label="Strikethrough" aria-pressed={editor?.isActive("strike")}><s>S</s></button>
        <button type="button" className={buttonClass} disabled={!editor} onMouseDown={(event) => event.preventDefault()} onClick={action(() => editor?.chain().focus().toggleBulletList().run())} aria-label="Bulleted list" aria-pressed={editor?.isActive("bulletList")}>• List</button>
        <button type="button" className={buttonClass} disabled={!editor} onMouseDown={(event) => event.preventDefault()} onClick={action(() => editor?.chain().focus().toggleOrderedList().run())} aria-label="Numbered list" aria-pressed={editor?.isActive("orderedList")}>1. List</button>
        <button type="button" className={buttonClass} disabled={!editor} onMouseDown={(event) => event.preventDefault()} onClick={action(() => editor?.chain().focus().toggleBlockquote().run())} aria-label="Block quote" aria-pressed={editor?.isActive("blockquote")}>Quote</button>
        <button type="button" className={buttonClass} disabled={!editor} onMouseDown={(event) => event.preventDefault()} onClick={action(addLink)} aria-label="Add link">Link</button>
        <button type="button" className={buttonClass} disabled={!editor || !editor.can().undo()} onMouseDown={(event) => event.preventDefault()} onClick={action(() => editor?.chain().focus().undo().run())} aria-label="Undo">Undo</button>
        <button type="button" className={buttonClass} disabled={!editor || !editor.can().redo()} onMouseDown={(event) => event.preventDefault()} onClick={action(() => editor?.chain().focus().redo().run())} aria-label="Redo">Redo</button>
      </div>
      <EditorContent editor={editor} />
      <p className="border-t border-(--border) px-4 py-2 text-xs text-(--muted)">Paste formatted text directly. Headings, paragraphs, lists, emphasis, and safe links are preserved.</p>
    </div>
  );
}
