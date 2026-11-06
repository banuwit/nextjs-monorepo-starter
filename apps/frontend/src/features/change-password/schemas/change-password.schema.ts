import { z } from "zod";
import { passwordRequirements } from "../utils/password-requirements";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: z
      .string()
      .min(1, "Enter a new password.")
      .refine(
        (password) =>
          passwordRequirements.every((requirement) => requirement.test(password)),
        "Your new password does not meet all the requirements.",
      ),
    confirmPassword: z.string().min(1, "Confirm your new password."),
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    path: ["newPassword"],
    error: "Your new password must be different from the current one.",
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ["confirmPassword"],
    error: "The passwords do not match.",
  });
