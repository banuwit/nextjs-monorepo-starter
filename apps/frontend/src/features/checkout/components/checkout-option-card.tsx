import type { ReactNode } from "react";
import { RadioGroupItem } from "@/components/ui/radio-group";

export function CheckoutOptionCard({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-3.5 text-sm transition-colors hover:border-foreground/30 has-data-checked:border-primary has-data-checked:bg-primary/5 has-data-checked:ring-1 has-data-checked:ring-primary">
      <RadioGroupItem value={value} className="mt-0.5" />
      <span className="flex min-w-0 flex-1 flex-col">{children}</span>
    </label>
  );
}
