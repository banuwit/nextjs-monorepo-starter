import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function InvoicePartyBlock({
  icon,
  title,
  className,
  children,
}: {
  icon: ReactNode;
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("flex min-w-0 flex-col gap-3", className)}>
      <h3 className="flex items-center gap-2 text-sm font-semibold [&_svg]:size-4 [&_svg]:text-muted-foreground">
        {icon}
        {title}
      </h3>
      {children}
    </section>
  );
}

export function InvoicePartyLines({
  name,
  lines,
  as: Tag = "div",
  compact = false,
}: {
  name: string;
  lines: string[];
  as?: "div" | "address";
  /** Joins the lines into one wrapping paragraph. */
  compact?: boolean;
}) {
  return (
    <Tag
      className={cn(
        "text-sm text-muted-foreground not-italic",
        compact ? "leading-snug" : "leading-relaxed text-balance",
      )}
    >
      <p className="font-medium text-foreground">{name}</p>
      {compact ? (
        <p>{lines.join(", ")}</p>
      ) : (
        lines.map((line) => <p key={line}>{line}</p>)
      )}
    </Tag>
  );
}
