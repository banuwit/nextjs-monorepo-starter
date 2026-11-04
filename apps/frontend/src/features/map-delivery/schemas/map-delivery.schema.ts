import { z } from "zod";

const clock = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use HH:MM (24-hour).");

export const vanDraftSchema = z.object({
  name: z
    .string()
    .trim()
    .regex(/^HR-\d{2}$/, "Call sign looks like HR-07."),
  plate: z.string().trim().min(5, "Plate is required.").max(10),
  driverId: z.string().min(1, "Pick a driver."),
  body: z.enum(["cargo-van", "box-truck", "reefer", "cargo-bike"]),
  powertrain: z.enum(["ev", "diesel", "gas"]),
  areaId: z.string().min(1, "Pick an area."),
  capacity: z.number().int().min(1).max(400),
});

export const deliveryDraftSchema = z.object({
  recipient: z.string().trim().min(2, "Recipient is required."),
  merchant: z.string().trim().min(2, "Merchant is required."),
  address: z.string().trim().min(5, "Address is required."),
  note: z.string().trim().max(140, "Keep the note under 140 characters."),
  windowStart: clock,
  parcels: z.number().int().min(1, "At least one parcel.").max(40),
  coldChain: z.boolean(),
  vanId: z.string().min(1, "Pick a van."),
  position: z.tuple([z.number(), z.number()]),
});

export const failStopSchema = z.object({
  reason: z.enum(["no-answer", "wrong-address", "refused", "damaged", "no-access"]),
  note: z.string().trim().max(140),
});

export const rescheduleSchema = z
  .object({
    windowStart: clock,
    windowEnd: clock,
  })
  .refine((value) => value.windowEnd > value.windowStart, {
    message: "The window must end after it starts.",
    path: ["windowEnd"],
  });

export const reassignSchema = z.object({
  vanId: z.string().min(1, "Pick a van."),
});

export const controlsSchema = z.object({
  driveMode: z.enum(["eco", "normal", "sport"]),
  speedLimit: z.number().min(45).max(75),
  chargeLimit: z.number().min(50).max(100).optional(),
  refuelAlert: z.number().min(5).max(50).optional(),
  coldSetpoint: z.number().min(-20).max(8).optional(),
  laneAssist: z.boolean(),
  autoBrake: z.boolean(),
  geofence: z.boolean(),
});

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

/** Flatten Zod issues into one message per top-level field. */
export function fieldErrors<T>(error: z.ZodError): FieldErrors<T> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    errors[key] ??= issue.message;
  }
  return errors as FieldErrors<T>;
}
