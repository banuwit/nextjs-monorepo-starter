import { useId } from "react";
import { cn } from "@/lib/utils";
import type { ProductSize } from "../types/product";

export function ProductSizePicker({
  sizes,
  value,
  onValueChange,
}: {
  sizes: ProductSize[];
  value: string | undefined;
  onValueChange: (size: string) => void;
}) {
  const groupName = useId();

  return (
    <div role="radiogroup" aria-label="Size" className="flex flex-wrap gap-2">
      {sizes.map((size) => (
        <label
          key={size.label}
          className={cn(
            "flex h-9 min-w-11 cursor-pointer items-center justify-center rounded-lg border border-border px-3 text-sm tabular-nums has-checked:border-foreground has-checked:bg-foreground has-checked:text-background has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
            !size.available &&
              "cursor-not-allowed text-muted-foreground line-through opacity-60",
          )}
        >
          <input
            type="radio"
            name={groupName}
            checked={size.label === value}
            disabled={!size.available}
            className="sr-only"
            onChange={() => onValueChange(size.label)}
          />
          {size.label}
          {!size.available && <span className="sr-only"> (sold out)</span>}
        </label>
      ))}
    </div>
  );
}
