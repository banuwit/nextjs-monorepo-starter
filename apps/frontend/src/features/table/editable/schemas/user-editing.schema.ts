import { z } from "zod";

export const userEditSchema = z.object({
  id: z.string().min(1),
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(100, "Use at most 100 characters."),
  email: z
    .string()
    .trim()
    .max(254)
    .pipe(z.email("Enter a valid email address.")),
  gender: z.enum(["male", "female"]),
  role: z.enum(["admin", "editor", "viewer"]),
  joinDate: z.iso.date("Enter a valid date."),
  status: z.enum(["active", "inactive", "pending"]),
  managerId: z.string().min(1).optional(),
});

export const userEditsSchema = z
  .array(userEditSchema)
  .superRefine((rows, context) => {
    const emails = new Map<string, number>();
    rows.forEach((row, index) => {
      const email = row.email.toLowerCase();
      const previous = emails.get(email);
      if (previous !== undefined) {
        for (const rowIndex of [previous, index]) {
          context.addIssue({
            code: "custom",
            path: [rowIndex, "email"],
            message: "Email is already used by another user.",
          });
        }
      }
      emails.set(email, index);
    });
  });
