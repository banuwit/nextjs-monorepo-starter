import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function InvoiceEyebrow({ className, ...props }: ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "text-xs tracking-[0.18em] text-muted-foreground uppercase",
        className,
      )}
      {...props}
    />
  );
}
