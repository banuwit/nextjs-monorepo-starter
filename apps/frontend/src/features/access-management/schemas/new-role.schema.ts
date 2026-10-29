import { z } from "zod";

export function createNewRoleSchema(existingNames: readonly string[]) {
  const taken = new Set(existingNames.map((name) => name.toLowerCase()));

  return z.object({
    name: z
      .string()
      .trim()
      .min(2, "Role name must be at least 2 characters.")
      .max(32, "Role name must be 32 characters or fewer.")
      .refine(
        (name) => !taken.has(name.toLowerCase()),
        "A role with this name already exists.",
      ),
    description: z
      .string()
      .trim()
      .max(120, "Description must be 120 characters or fewer."),
    baseRoleId: z.string().min(1, "Choose a role to copy permissions from."),
  });
}

export type NewRoleValues = z.infer<ReturnType<typeof createNewRoleSchema>>;
