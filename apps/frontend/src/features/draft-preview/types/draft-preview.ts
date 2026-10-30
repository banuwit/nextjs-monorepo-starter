import type { z } from "zod";
import type { draftPreviewSchema } from "../schemas/draft-preview.schema";

export type DraftPreview = z.infer<typeof draftPreviewSchema>;
export type DraftPreviewErrors = Record<string, string>;
