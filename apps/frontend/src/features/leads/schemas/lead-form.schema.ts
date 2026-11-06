import { z } from "zod";

export const leadFormSchema = z.object({
  name: z.string().trim().min(2, "Nama kontak minimal 2 karakter.").max(60, "Nama kontak maksimal 60 karakter."),
  company: z.string().trim().min(2, "Perusahaan minimal 2 karakter.").max(80, "Perusahaan maksimal 80 karakter."),
  email: z.email("Format email tidak valid.").trim(),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{8,20}$/, "Nomor telepon 8–20 digit, boleh diawali +."),
  value: z.coerce
    .number({ error: "Nilai deal wajib berupa angka." })
    .int("Nilai deal harus bilangan bulat.")
    .min(0, "Nilai deal tidak boleh negatif.")
    .max(100_000_000_000, "Nilai deal terlalu besar."),
  source: z.enum(["website", "referral", "event", "outbound", "partner"], "Pilih sumber lead."),
  owner: z.string().min(1, "Pilih penanggung jawab."),
  priority: z.enum(["high", "medium", "low"], "Pilih prioritas."),
  expectedClose: z.iso.date("Pilih perkiraan tanggal closing."),
  stageId: z.string().min(1, "Pilih tahap awal."),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;

export const leadFormFields = [
  "name",
  "company",
  "email",
  "phone",
  "value",
  "source",
  "owner",
  "priority",
  "expectedClose",
  "stageId",
] as const satisfies readonly (keyof LeadFormValues)[];
