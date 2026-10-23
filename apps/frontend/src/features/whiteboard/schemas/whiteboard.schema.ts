import { z } from "zod";

const elementSchema = z
  .object({
    id: z.string().min(1),
    type: z.enum([
      "rectangle",
      "diamond",
      "ellipse",
      "arrow",
      "line",
      "freedraw",
      "text",
      "image",
      "frame",
      "magicframe",
      "embeddable",
      "iframe",
    ]),
    x: z.number().finite(),
    y: z.number().finite(),
    width: z.number().finite().nonnegative(),
    height: z.number().finite().nonnegative(),
  })
  .passthrough();

export const boardSchema = z
  .object({
    type: z.literal("excalidraw"),
    version: z.number().optional(),
    elements: z.array(elementSchema).max(10000),
    appState: z.record(z.string(), z.unknown()).default({}),
    files: z
      .record(
        z.string(),
        z
          .object({
            id: z.string(),
            mimeType: z.enum([
              "image/png",
              "image/jpeg",
              "image/webp",
              "image/gif",
              "image/svg+xml",
            ]),
            dataURL: z
              .string()
              .regex(/^data:image\/(png|jpeg|webp|gif|svg\+xml);base64,/),
            created: z.number(),
          })
          .passthrough(),
      )
      .default({}),
  })
  .passthrough();

export const versionSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  scene: z.string(),
});

export const savedBoardSchema = z.object({
  title: z.string().min(1).max(120),
  scene: z.string(),
  versions: z.array(versionSchema).max(20),
});
