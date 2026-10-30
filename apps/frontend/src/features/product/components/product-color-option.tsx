import { cn } from "@/lib/utils";
import type { ProductColor } from "../types/product";

// Native inputs give radio groups their arrow-key behavior for free.
export function ProductColorOption({
  color,
  type,
  name,
  checked,
  onChange,
  accessibleLabel = color.name,
  className,
}: {
  color: ProductColor;
  type: "radio" | "checkbox";
  name: string;
  checked: boolean;
  onChange: () => void;
  accessibleLabel?: string;
  className?: string;
}) {
  return (
    <label
      title={color.name}
      className={cn(
        "relative flex size-6 cursor-pointer rounded-full border-2 border-transparent p-0.5 has-checked:border-foreground has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
        className,
      )}
    >
      <input
        type={type}
        name={name}
        checked={checked}
        aria-label={accessibleLabel}
        className="sr-only"
        onChange={onChange}
      />
      <span
        aria-hidden="true"
        className="size-full rounded-full border border-foreground/25"
        style={{ backgroundColor: color.hex }}
      />
    </label>
  );
}
