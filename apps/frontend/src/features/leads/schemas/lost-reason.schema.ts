import { z } from "zod";

export const lostReasonSchema = z.object({
  reason: z.string().min(1, "Pilih alasan lead kalah."),
  note: z.string().trim().max(200, "Catatan maksimal 200 karakter."),
});

export type LostReasonValues = z.infer<typeof lostReasonSchema>;
