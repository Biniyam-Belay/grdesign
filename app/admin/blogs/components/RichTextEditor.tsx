"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { useState, useCallback, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Code,
  Maximize,
  Minimize,
  Undo,
  Redo,
  // Youtube icon removed because it's not used in the toolbar currently
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  features?: {
    toolbar?: {
      headings?: boolean;
      bold?: boolean;
      italic?: boolean;
      underline?: boolean;
      strikethrough?: boolean;
      code?: boolean;
      blockquote?: boolean;
      codeBlock?: boolean;
      alignLeft?: boolean;
      alignCenter?: boolean;
      alignRight?: boolean;
      bulletList?: boolean;
      orderedList?: boolean;
      link?: boolean;
      image?: boolean;
      youtube?: boolean;
      table?: boolean;
      horizontalRule?: boolean;
      undo?: boolean;
      redo?: boolean;
    };
    advanced?: {
      wordCount?: boolean;
      readTime?: boolean;
      autoSave?: boolean;
      focusMode?: boolean;
      spellCheck?: boolean;
      emojiPicker?: boolean;
      markdownShortcuts?: boolean;
      tableOfContents?: boolean;
    };
    layout?: {
      fullscreen?: boolean;
      dualPane?: boolean;
      distractionFree?: boolean;
    };
  };
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing...",
  features = {},
}: RichTextEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDistractionFree, setIsDistractionFree] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: {
          HTMLAttributes: {
            class: "bg-neutral-100 rounded-lg p-4 font-mono text-sm",
          },
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube.configure({
        HTMLAttributes: {
          class: "rounded-lg",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-lg max-w-none focus:outline-none min-h-[400px] p-4 ${
          isDistractionFree ? "max-w-4xl mx-auto" : ""
        }`,
      },
    },
    immediatelyRender: false,
  });

  // Auto-save functionality
  useEffect(() => {
    if (!editor || !features.advanced?.autoSave) return;

    const timeout = setTimeout(() => {
      // Auto-save logic here
      console.log("Auto-saving...");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [editor, content, features.advanced?.autoSave]);

  const setLink = useCallback(() => {
    if (!editor) return;

    if (linkUrl) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
      setLinkUrl("");
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
  }, [editor, linkUrl]);

  const addImage = useCallback(() => {
    if (!editor) return;

    const url = window.prompt("Paste image URL");
    if (!url) return;

    editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  const addYoutubeVideo = useCallback(() => {
    if (!editor) return;

    const url = window.prompt("Paste YouTube URL");
    if (!url) return;

    editor.chain().focus().setYoutubeVideo({ src: url }).run();
  }, [editor]);

  const addTable = useCallback(() => {
    if (!editor) return;

    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className={`border border-neutral-300 rounded-lg bg-white transition-all duration-300 ${
        isFullscreen ? "fixed inset-0 z-50 m-4" : ""
      } ${isDistractionFree ? "bg-neutral-50" : ""}`}
    >
      {/* Enhanced Toolbar */}
      <div className="border-b border-neutral-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-1">
          {/* Text Formatting */}
          <div className="flex items-center gap-1 border-r border-neutral-200 pr-3 mr-3">
            {features.toolbar?.headings && (
              <>
                <select
                  value={editor.getAttributes("heading").level || "paragraph"}
                  onChange={(e) => {
                    const level = e.target.value;
                    if (level === "paragraph") {
                      editor.chain().focus().setParagraph().run();
                    } else {
                      const n = Number(level);
                      if (n === 1 || n === 2 || n === 3) {
                        editor
                          .chain()
                          .focus()
                          .toggleHeading({ level: n as 1 | 2 | 3 })
                          .run();
                      }
                    }
                  }}
                  className="text-sm border border-neutral-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="paragraph">Paragraph</option>
                  <option value="1">Heading 1</option>
                  <option value="2">Heading 2</option>
                  <option value="3">Heading 3</option>
                </select>
              </>
            )}

            {features.toolbar?.bold && (
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-neutral-100 ${
                  editor.isActive("bold") ? "bg-neutral-200 text-neutral-900" : "text-neutral-600"
                }`}
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </button>
            )}

            {features.toolbar?.italic && (
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-neutral-100 ${
                  editor.isActive("italic") ? "bg-neutral-200 text-neutral-900" : "text-neutral-600"
                }`}
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </button>
            )}

            {features.toolbar?.underline && (
              <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded hover:bg-neutral-100 ${
                  editor.isActive("underline")
                    ? "bg-neutral-200 text-neutral-900"
                    : "text-neutral-600"
                }`}
                title="Underline"
              >
                <UnderlineIcon className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Alignment & Lists */}
          <div className="flex items-center gap-1 border-r border-neutral-200 pr-3 mr-3">
            {features.toolbar?.alignLeft && (
              <button
                onClick={() => editor.chain().focus().setTextAlign("left").run()}
                className={`p-2 rounded hover:bg-neutral-100 ${
                  editor.isActive({ textAlign: "left" })
                    ? "bg-neutral-200 text-neutral-900"
                    : "text-neutral-600"
                }`}
                title="Align Left"
              >
                <AlignLeft className="h-4 w-4" />
              </button>
            )}

            {features.toolbar?.bulletList && (
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-neutral-100 ${
                  editor.isActive("bulletList")
                    ? "bg-neutral-200 text-neutral-900"
                    : "text-neutral-600"
                }`}
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </button>
            )}

            {features.toolbar?.orderedList && (
              <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-neutral-100 ${
                  editor.isActive("orderedList")
                    ? "bg-neutral-200 text-neutral-900"
                    : "text-neutral-600"
                }`}
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Media & Blocks */}
          <div className="flex items-center gap-1">
            {features.toolbar?.link && (
              <button
                onClick={() => setLink()}
                className="p-2 rounded hover:bg-neutral-100 text-neutral-600"
                title="Add Link"
              >
                <LinkIcon className="h-4 w-4" />
              </button>
            )}

            {features.toolbar?.image && (
              <button
                onClick={addImage}
                className="p-2 rounded hover:bg-neutral-100 text-neutral-600"
                title="Add Image from URL"
              >
                <ImageIcon className="h-4 w-4" />
              </button>
            )}

            {features.toolbar?.youtube && (
              <button
                onClick={addYoutubeVideo}
                className="p-2 rounded hover:bg-neutral-100 text-neutral-600"
                title="Add YouTube Video"
              >
                {/* Reuse an existing icon; swap to a YouTube-specific icon later if you like */}
                <Code className="h-4 w-4" />
              </button>
            )}

            {features.toolbar?.table && (
              <button
                onClick={addTable}
                className="p-2 rounded hover:bg-neutral-100 text-neutral-600"
                title="Add Table"
              >
                <TableIcon className="h-4 w-4" />
              </button>
            )}

            {features.toolbar?.codeBlock && (
              <button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`p-2 rounded hover:bg-neutral-100 ${
                  editor.isActive("codeBlock")
                    ? "bg-neutral-200 text-neutral-900"
                    : "text-neutral-600"
                }`}
                title="Code Block"
              >
                <Code className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Layout Controls */}
          <div className="flex items-center gap-1 ml-auto">
            {features.layout?.fullscreen && (
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded hover:bg-neutral-100 text-neutral-600"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                <Maximize className="h-4 w-4" />
              </button>
            )}

            {features.layout?.distractionFree && (
              <button
                onClick={() => setIsDistractionFree(!isDistractionFree)}
                className={`p-2 rounded hover:bg-neutral-100 ${
                  isDistractionFree ? "bg-neutral-200 text-neutral-900" : "text-neutral-600"
                }`}
                title="Distraction Free Mode"
              >
                <Minimize className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Link Input */}
        {editor.isActive("link") && (
          <div className="mt-3 p-2 bg-neutral-50 rounded border">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter URL..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="flex-1 px-2 py-1 text-sm border rounded"
              />
              <button
                onClick={setLink}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bubble Menu for selected text */}

      {/* Editor Content */}
      <div className={`${isDistractionFree ? "max-w-4xl mx-auto" : ""}`}>
        <EditorContent editor={editor} />
      </div>

      {/* Enhanced Status Bar */}
      <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-2">
        <div className="flex items-center justify-between text-sm text-neutral-600">
          <div className="flex items-center gap-4">
            {features.advanced?.wordCount && (
              <span>{editor.storage.characterCount.words()} words</span>
            )}
            {features.advanced?.readTime && (
              <span>{Math.ceil(editor.storage.characterCount.words() / 200)} min read</span>
            )}
            <span>{editor.storage.characterCount.characters()} characters</span>
          </div>

          <div className="flex items-center gap-2">
            {features.toolbar?.undo && (
              <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="p-1 rounded hover:bg-neutral-200 disabled:opacity-50"
                title="Undo"
              >
                <Undo className="h-4 w-4" />
              </button>
            )}
            {features.toolbar?.redo && (
              <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="p-1 rounded hover:bg-neutral-200 disabled:opacity-50"
                title="Redo"
              >
                <Redo className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hidden Inputs for Media (not currently shown in UI, but kept for future enhancements) */}
    </div>
  );
}
