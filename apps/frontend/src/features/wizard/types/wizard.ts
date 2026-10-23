import type { z } from "zod";
import type { billingSchema } from "../schemas/wizard.schema";

export type BillingDraft = z.infer<typeof billingSchema>;

export type BillingErrors = Partial<Record<keyof BillingDraft, string>>;
