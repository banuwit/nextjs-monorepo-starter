import { getSchema } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import TextAlign from "@tiptap/extension-text-align";
import { Placeholder } from "@tiptap/extensions";
import { normalizeEditorLink } from "../utils/editor-link";

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

export const schema = getSchema(editorExtensions);
