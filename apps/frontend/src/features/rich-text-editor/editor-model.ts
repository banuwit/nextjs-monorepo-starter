import { getSchema, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import TextAlign from "@tiptap/extension-text-align";
import { Placeholder } from "@tiptap/extensions";

export function normalizeEditorLink(value: string): string | null {
  const input = value.trim();
  if (!input || /\s/.test(input) || input.startsWith("//")) return null;
  try {
    const url = new URL(
      /^[a-z][a-z\d+.-]*:/i.test(input) ? input : `https://${input}`,
    );
    return ["https:", "http:", "mailto:"].includes(url.protocol)
      ? url.href
      : null;
  } catch {
    return null;
  }
}

export const editorExtensions = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
    link: {
      openOnClick: false,
      defaultProtocol: "https",
      isAllowedUri: (url) => normalizeEditorLink(url) !== null,
      HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
    },
  }),
  Highlight.configure({ multicolor: true }),
  TaskList,
  TaskItem.configure({ nested: true }),
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Placeholder.configure({ placeholder: "Start writing your document…" }),
];

const schema = getSchema(editorExtensions);
export const DRAFT_KEY = "playground.rich-text-editor.v1";

export function readDraft(raw: string): JSONContent {
  const content = JSON.parse(raw);
  const document = schema.nodeFromJSON(content);
  if (document.type.name !== "doc") throw new Error("Invalid document");
  document.check();
  return content;
}

export function getDocumentStats(text: string) {
  const words = text.trim() ? text.trim().split(/\s+/u).length : 0;
  return { words, characters: text.length, minutes: Math.ceil(words / 200) };
}
