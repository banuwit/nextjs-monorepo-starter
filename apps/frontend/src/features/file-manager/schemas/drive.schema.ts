import { z } from "zod";

export const entryNameSchema = z
  .string()
  .trim()
  .min(1, "Enter a name.")
  .max(120, "Use 120 characters or fewer.")
  .refine(
    (name) =>
      !/[\\/]/.test(name) &&
      !Array.from(name).some((character) => character.charCodeAt(0) < 32) &&
      name !== "." &&
      name !== "..",
    "Use a name without slashes or control characters.",
  );
