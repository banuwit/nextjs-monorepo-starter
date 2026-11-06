import { z } from "zod";

export function createPipelineFormSchema(existingNames: readonly string[]) {
  const taken = new Set(existingNames.map((name) => name.toLowerCase()));
  return z.object({
    name: z
      .string()
      .trim()
      .min(2, "Nama pipeline minimal 2 karakter.")
      .max(40, "Nama pipeline maksimal 40 karakter.")
      .refine((name) => !taken.has(name.toLowerCase()), "Nama pipeline sudah dipakai."),
    description: z.string().trim().max(160, "Deskripsi maksimal 160 karakter."),
    movement: z.enum(["flexible", "sequential"], "Pilih aturan pergerakan."),
    stages: z
      .string()
      .transform((text) =>
        text
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
      )
      .pipe(
        z
          .array(z.string().max(24, "Nama tahap maksimal 24 karakter."))
          .min(2, "Isi minimal 2 tahap open, satu per baris.")
          .max(8, "Maksimal 8 tahap open.")
          .refine(
            (stages) => new Set(stages.map((stage) => stage.toLowerCase())).size === stages.length,
            "Nama tahap tidak boleh sama.",
          ),
      ),
    wonLabel: z.string().trim().min(2, "Label tahap menang minimal 2 karakter.").max(24),
    lostLabel: z.string().trim().min(2, "Label tahap kalah minimal 2 karakter.").max(24),
  });
}

export type PipelineFormValues = z.infer<ReturnType<typeof createPipelineFormSchema>>;
