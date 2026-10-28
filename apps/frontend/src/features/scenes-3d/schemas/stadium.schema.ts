import { z } from "zod";

export const MAX_SEATS_PER_ORDER = 6;

export const seatSelectionSchema = z.object({
  sectorId: z.string().min(1, "Pick a sector first."),
  seats: z
    .number()
    .int()
    .min(1, "Pick at least one seat.")
    .max(MAX_SEATS_PER_ORDER, `Up to ${MAX_SEATS_PER_ORDER} seats per order.`),
});

export type SeatSelection = z.infer<typeof seatSelectionSchema>;
