import { z } from "zod";

export const folderNameSchema = z
  .string()
  .trim()
  .min(1, "Enter a folder name.")
  .max(100, "Use no more than 100 characters.")
  .regex(/^[^/\\]+$/, "Folder names cannot contain slashes.");
