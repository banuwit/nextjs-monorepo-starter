import { boardSchema } from "../schemas/whiteboard.schema";
import type { FrameElement, BoardVersion } from "../types/whiteboard";

export function parseBoard(json: string) {
  if (json.length > 20 * 1024 * 1024)
    throw new Error("Board files must be smaller than 20 MB.");
  return boardSchema.parse(JSON.parse(json));
}

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

export function prependVersion(versions: BoardVersion[], next: BoardVersion) {
  return [next, ...versions].slice(0, 20);
}
