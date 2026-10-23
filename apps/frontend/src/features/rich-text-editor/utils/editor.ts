import type { JSONContent } from "@tiptap/react";
import { schema } from "../schemas/editor.schema";

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
