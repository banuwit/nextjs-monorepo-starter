import { z } from "zod";
import type { JSONContent } from "@tiptap/react";

const contentSchema: z.ZodType<JSONContent> = z.lazy(() =>
  z.object({
    type: z.string(),
    text: z.string().optional(),
    attrs: z.record(z.string(), z.unknown()).optional(),
    marks: z
      .array(
        z.object({
          type: z.string(),
          attrs: z.record(z.string(), z.unknown()).optional(),
        }),
      )
      .optional(),
    content: z.array(contentSchema).optional(),
  }),
);
export const noteSchema = z.object({
  title: z.string().trim().min(1).max(200),
  content: contentSchema.refine(
    (value) => value.type === "doc",
    "Expected a document",
  ),
});
export type Note = z.infer<typeof noteSchema>;
export type Person = { id: string; label: string };
export function filterPeople(people: Person[], query: string) {
  return people
    .filter((person) =>
      person.label.toLowerCase().includes(query.toLowerCase()),
    )
    .slice(0, 6);
}
export function getOutline(document: JSONContent) {
  const headings: { title: string; level: number }[] = [];
  function text(node: JSONContent): string {
    return node.text ?? node.content?.map(text).join("") ?? "";
  }
  function visit(node: JSONContent) {
    if (node.type === "heading")
      headings.push({
        title: text(node) || "Untitled heading",
        level: Number(node.attrs?.level ?? 1),
      });
    node.content?.forEach(visit);
  }
  visit(document);
  return headings;
}
