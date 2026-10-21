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

const boardSchema = z
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

export function parseBoard(json: string) {
  if (json.length > 20 * 1024 * 1024)
    throw new Error("Board files must be smaller than 20 MB.");
  return boardSchema.parse(JSON.parse(json));
}

type FrameElement = {
  id: string;
  type: string;
  name?: string | null;
  frameId?: string | null;
  isDeleted?: boolean;
};
export function getFrames(elements: readonly FrameElement[]) {
  const visible = elements.filter((element) => !element.isDeleted);
  return visible
    .filter((element) => element.type === "frame")
    .map((frame) => ({
      id: frame.id,
      name: frame.name || "Untitled frame",
      count: visible.filter((element) => element.frameId === frame.id).length,
    }));
}

export const versionSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  scene: z.string(),
});
export type BoardVersion = z.infer<typeof versionSchema>;
export const savedBoardSchema = z.object({
  title: z.string().min(1).max(120),
  scene: z.string(),
  versions: z.array(versionSchema).max(20),
});
export function prependVersion(versions: BoardVersion[], next: BoardVersion) {
  return [next, ...versions].slice(0, 20);
}
