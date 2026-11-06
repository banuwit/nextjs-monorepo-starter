import type { z } from "zod";

/** First message per top-level field, in issue order. */
export function fieldErrors<K extends string>(error: z.ZodError) {
  const errors: Partial<Record<K, string>> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "") as K;
    errors[key] ??= issue.message;
  }
  return errors;
}

/** Focus the first invalid field following the visual order of `order`. */
export function focusFirstInvalid<K extends string>(
  form: HTMLFormElement | null,
  order: readonly K[],
  errors: Partial<Record<K, string>>,
) {
  const first = order.find((key) => errors[key]);
  if (first) form?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
}
