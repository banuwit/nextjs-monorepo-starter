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
