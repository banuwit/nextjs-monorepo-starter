import type { z } from "zod";
import type { changePasswordSchema } from "../schemas/change-password.schema";

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
export type ChangePasswordField = keyof ChangePasswordValues;
export type ChangePasswordErrors = Partial<Record<ChangePasswordField, string>>;
