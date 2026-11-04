import { Mark, getSchema, mergeAttributes } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import TextAlign from "@tiptap/extension-text-align";
import { Placeholder } from "@tiptap/extensions";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import type { Doc } from "yjs";
import type { Awareness } from "y-protocols/awareness";
import { normalizeEditorLink } from "@/utils/editor-link";
import type { Person } from "../types/live-document";

export const DOC_FIELD = "default";

/** Inline anchor for a comment thread; the thread itself lives in the room. */
export const CommentMark = Mark.create({
  name: "comment",
  inclusive: false,
  excludes: "",
  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-comment-id"),
        renderHTML: (attributes) =>
          attributes.id ? { "data-comment-id": attributes.id } : {},
      },
    };
  },
  parseHTML() {
    return [{ tag: "span[data-comment-id]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes({ class: "live-comment" }, HTMLAttributes),
      0,
    ];
  },
});

/** Schema shared by the room seed and every editor; keep the list stable. */
export const liveDocumentBaseExtensions = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
    // Collaboration provides Yjs-aware undo/redo.
    undoRedo: false,
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
  Placeholder.configure({ placeholder: "Start writing the spec…" }),
  CommentMark,
];

export const liveDocumentSchema = getSchema(liveDocumentBaseExtensions);

function renderCaret(user: Record<string, unknown>) {
  const caret = document.createElement("span");
  caret.className = "live-caret";
  caret.style.setProperty("--live-user-color", String(user.color));
  caret.dataset.liveCaret = String(user.id);
  const label = document.createElement("span");
  label.className = "live-caret-label";
  label.textContent = String(user.name);
  caret.append(label);
  return caret;
}

function renderSelection(user: Record<string, unknown>) {
  return {
    nodeName: "span",
    class: "live-selection",
    style: `--live-user-color: ${String(user.color)}`,
    "data-user": String(user.name),
  };
}

export function createLiveDocumentExtensions({
  document,
  awareness,
  user,
}: {
  document: Doc;
  awareness: Awareness;
  user: Person;
}) {
  return [
    ...liveDocumentBaseExtensions,
    Collaboration.configure({ document, field: DOC_FIELD }),
    CollaborationCaret.configure({
      provider: { awareness },
      user: { id: user.id, name: user.name, color: user.color },
      render: renderCaret,
      selectionRender: renderSelection,
    }),
  ];
}
