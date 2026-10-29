import type { JSONContent } from "@tiptap/react";
import type { Person } from "../types/note";

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
