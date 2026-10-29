"use client";

import { Search, X } from "lucide-react";
import * as React from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

export interface SearchFilterProps {
  /** Initial text. Remount with a `key` to reset it from outside. */
  defaultValue?: string;
  /** Fires after the user stops typing for `debounceMs`, and at once on clear. */
  onValueChange: (value: string) => void;
  placeholder?: string;
  /** Delay before `onValueChange` fires while typing. Default: 300. */
  debounceMs?: number;
  className?: string;
}

/**
 * A text search box with a debounced change callback and a clear button.
 *
 * Uncontrolled on purpose: the draft text lives here so typing stays smooth
 * while the caller only sees settled values (a URL update, a server query, …).
 */
export function SearchFilter({
  defaultValue = "",
  onValueChange,
  placeholder = "Search...",
  debounceMs = 300,
  className,
}: SearchFilterProps) {
  const [value, setValue] = React.useState(defaultValue);
  const timeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const onValueChangeRef = React.useRef(onValueChange);

  React.useEffect(() => {
    onValueChangeRef.current = onValueChange;
  }, [onValueChange]);

  React.useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current);
    },
    [],
  );

  const update = (next: string, immediate = false) => {
    setValue(next);
    if (timeout.current) clearTimeout(timeout.current);
    if (immediate) {
      onValueChangeRef.current(next);
      return;
    }
    timeout.current = setTimeout(
      () => onValueChangeRef.current(next),
      debounceMs,
    );
  };

  return (
    <InputGroup className={cn("w-56", className)}>
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        placeholder={placeholder}
        aria-label={placeholder}
        value={value}
        onChange={(event) => update(event.target.value)}
        className="[&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            variant="ghost"
            aria-label="Clear search"
            onClick={() => update("", true)}
          >
            <X />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
