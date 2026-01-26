"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Heading1, Heading2 } from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false
      })
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor?.getHTML?.() ?? "");
    },
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none"
      }
    }
  });

  if (!editor) return null;

  const addLink = () => {
    const url = window?.prompt?.("URL girin:");
    if (url) {
      editor?.chain?.()?.focus?.()?.extendMarkRange?.("link")?.setLink?.({ href: url })?.run?.();
    }
  };

  const MenuButton = ({ onClick, isActive, children }: { onClick: () => void; isActive?: boolean; children: React.ReactNode }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded transition-colors ${
        isActive ? "bg-blue-500/20 text-blue-400" : "text-gray-400 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="bg-[#2a2a2a] rounded-lg border border-white/10">
      <div className="flex items-center gap-1 p-2 border-b border-white/10">
        <MenuButton
          onClick={() => editor?.chain?.()?.focus?.()?.toggleBold?.()?.run?.()}
          isActive={editor?.isActive?.("bold")}
        >
          <Bold className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor?.chain?.()?.focus?.()?.toggleItalic?.()?.run?.()}
          isActive={editor?.isActive?.("italic")}
        >
          <Italic className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor?.chain?.()?.focus?.()?.toggleHeading?.({ level: 1 })?.run?.()}
          isActive={editor?.isActive?.("heading", { level: 1 })}
        >
          <Heading1 className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor?.chain?.()?.focus?.()?.toggleHeading?.({ level: 2 })?.run?.()}
          isActive={editor?.isActive?.("heading", { level: 2 })}
        >
          <Heading2 className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor?.chain?.()?.focus?.()?.toggleBulletList?.()?.run?.()}
          isActive={editor?.isActive?.("bulletList")}
        >
          <List className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor?.chain?.()?.focus?.()?.toggleOrderedList?.()?.run?.()}
          isActive={editor?.isActive?.("orderedList")}
        >
          <ListOrdered className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={addLink}
          isActive={editor?.isActive?.("link")}
        >
          <LinkIcon className="w-4 h-4" />
        </MenuButton>
      </div>
      <EditorContent editor={editor} className="min-h-[200px]" />
    </div>
  );
}
