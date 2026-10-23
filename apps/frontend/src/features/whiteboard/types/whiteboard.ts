import type { z } from "zod";
import type { versionSchema } from "../schemas/whiteboard.schema";

export type FrameElement = {
  id: string;
  type: string;
  name?: string | null;
  frameId?: string | null;
  isDeleted?: boolean;
};

export type BoardVersion = z.infer<typeof versionSchema>;
