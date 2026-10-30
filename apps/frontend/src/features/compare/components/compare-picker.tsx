"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { CompareProduct } from "../types/compare";
import { formatCurrency } from "../utils/compare";

type ComparePickerProps = {
  products: CompareProduct[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  trigger: ReactElement;
  align?: "start" | "center" | "end";
  /** Close after one pick, for triggers that move when the table changes. */
  closeOnSelect?: boolean;
};

export function ComparePicker({
  products,
  selectedIds,
  onToggle,
  trigger,
  align = "end",
  closeOnSelect = false,
}: ComparePickerProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (id: string) => {
    onToggle(id);
    if (closeOnSelect) setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={trigger} />
      <PopoverContent align={align} className="w-72 p-0">
        <Command>
          <CommandInput placeholder="Search products..." />
          <CommandList>
            <CommandEmpty>No products found.</CommandEmpty>
            <CommandGroup>
              {products.map((product) => {
                const selected = selectedIds.includes(product.id);
                return (
                  <CommandItem
                    key={product.id}
                    value={product.name}
                    keywords={product.tags}
                    data-checked={selected}
                    onSelect={() => handleSelect(product.id)}
                  >
                    <span className="min-w-0 flex-1 truncate">
                      {product.name}
                      {selected && <span className="sr-only"> (selected)</span>}
                    </span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {formatCurrency(product.price)}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
