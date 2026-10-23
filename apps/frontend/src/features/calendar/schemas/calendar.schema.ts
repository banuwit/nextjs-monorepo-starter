import { isValid, parseISO } from "date-fns";
import { z } from "zod";

export const eventFormSchema = z
  .object({
    title: z.string().trim().min(1, "Enter an event title.").max(120),
    calendar: z.enum(["work", "personal", "team", "focus"]),
    owner: z.enum(["me", "alex", "sarah"]).default("me"),
    start: z
      .string()
      .refine((value) => isValid(parseISO(value)), "Enter a valid start date."),
    end: z
      .string()
      .refine((value) => isValid(parseISO(value)), "Enter a valid end date."),
    allDay: z.boolean(),
  })
  .superRefine((value, ctx) => {
    const pattern = value.allDay
      ? /^\d{4}-\d{2}-\d{2}$/
      : /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
    for (const field of ["start", "end"] as const) {
      if (!pattern.test(value[field]))
        ctx.addIssue({
          code: "custom",
          path: [field],
          message: "Enter a valid date and time.",
        });
    }
    const start = parseISO(value.start).getTime();
    const end = parseISO(value.end).getTime();
    if (value.allDay ? end < start : end <= start) {
      ctx.addIssue({
        code: "custom",
        path: ["end"],
        message: value.allDay
          ? "End date must be on or after the start date."
          : "End time must be after the start time.",
      });
    }
  });
