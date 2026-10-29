"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { cn } from "@/lib/utils";

import type { SelectOption } from "./types";

interface ComboboxFilterBaseProps {
  options: SelectOption[];
  /**
   * Where the search box sits. `"input"` (default): the trigger is the search
   * box itself. `"popup"`: the trigger is a button and the search box opens
   * inside the popup, so the toolbar stays compact.
   */
  trigger?: "input" | "popup";
  /** Input text (input trigger) or button text (popup trigger) when empty. */
  placeholder?: string;
  /** Search box text inside the popup trigger. Default: "Search...". */
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
}

interface ComboboxFilterSingleProps extends ComboboxFilterBaseProps {
  multiple?: false;
  value: string | null;
  /** Fires immediately with the picked value, or `null` once cleared. */
  onValueChange: (value: string | null) => void;
}

interface ComboboxFilterMultipleProps extends ComboboxFilterBaseProps {
  multiple: true;
  value: string[];
  /** Fires on every pick or chip removal. */
  onValueChange: (value: string[]) => void;
}

export type ComboboxFilterProps =
  ComboboxFilterSingleProps | ComboboxFilterMultipleProps;

const itemToStringLabel = (option: SelectOption) => option.label;

const isItemEqualToValue = (option: SelectOption, current: SelectOption) =>
  option.value === current.value;

/** Matches label, value, description, and `keywords`. */
function filterOption(option: SelectOption, query: string) {
  const text = query.trim().toLowerCase();
  return [
    option.label,
    option.value,
    option.description ?? "",
    ...(option.keywords ?? []),
  ].some((term) => term.toLowerCase().includes(text));
}

function OptionList({ emptyMessage }: { emptyMessage: string }) {
  return (
    <>
      <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
      <ComboboxList>
        {(option: SelectOption) => (
          <ComboboxItem
            key={option.value}
            value={option}
            disabled={option.disabled}
          >
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate">{option.label}</span>
              {option.description && (
                <span className="truncate text-xs text-muted-foreground">
                  {option.description}
                </span>
              )}
            </span>
          </ComboboxItem>
        )}
      </ComboboxList>
    </>
  );
}

function PopupTrigger({
  label,
  count,
  disabled,
  className,
}: {
  label: string;
  count?: number;
  disabled: boolean;
  className?: string;
}) {
  return (
    <ComboboxTrigger
      disabled={disabled}
      render={
        <Button
          variant="outline"
          className={cn("min-w-32 justify-between font-normal", className)}
        />
      }
    >
      <span className="truncate">{label}</span>
      {!!count && (
        <Badge variant="secondary" className="tabular-nums">
          {count}
        </Badge>
      )}
    </ComboboxTrigger>
  );
}

function PopupContent({
  searchPlaceholder,
  emptyMessage,
  canClear,
  onClear,
}: {
  searchPlaceholder: string;
  emptyMessage: string;
  canClear: boolean;
  onClear: () => void;
}) {
  return (
    <ComboboxContent className="min-w-56">
      <ComboboxInput
        showTrigger={false}
        placeholder={searchPlaceholder}
        aria-label={searchPlaceholder}
      />
      <OptionList emptyMessage={emptyMessage} />
      {canClear && (
        <div className="border-t p-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={onClear}
          >
            Clear
          </Button>
        </div>
      )}
    </ComboboxContent>
  );
}

/**
 * A searchable filter on shadcn `Combobox`, suited to long option lists such
 * as people or locations. Picks apply immediately (no Apply step).
 *
 * - `multiple` switches to multi-pick: with the input trigger the picks show
 *   as removable chips in the box; with the popup trigger as a count badge.
 * - `trigger="popup"` opens the search box from a button instead.
 */
export function ComboboxFilter(props: ComboboxFilterProps) {
  const {
    options,
    trigger = "input",
    placeholder = "Search...",
    searchPlaceholder = "Search...",
    emptyMessage = "No results found.",
    className,
    disabled = false,
  } = props;
  const anchor = useComboboxAnchor();

  if (props.multiple) {
    const { value, onValueChange } = props;
    const selected = options.filter((option) => value.includes(option.value));

    return (
      <Combobox
        multiple
        autoHighlight
        items={options}
        value={selected}
        disabled={disabled}
        onValueChange={(next) => onValueChange(next.map((item) => item.value))}
        itemToStringLabel={itemToStringLabel}
        isItemEqualToValue={isItemEqualToValue}
        filter={filterOption}
      >
        {trigger === "popup" ? (
          <>
            <PopupTrigger
              label={placeholder}
              count={selected.length}
              disabled={disabled}
              className={className}
            />
            <PopupContent
              searchPlaceholder={searchPlaceholder}
              emptyMessage={emptyMessage}
              canClear={selected.length > 0}
              onClear={() => onValueChange([])}
            />
          </>
        ) : (
          <>
            <ComboboxChips
              ref={anchor}
              className={cn("w-auto max-w-80 min-w-56", className)}
            >
              <ComboboxValue>
                {selected.map((option) => (
                  <ComboboxChip key={option.value}>{option.label}</ComboboxChip>
                ))}
                <ComboboxChipsInput
                  placeholder={selected.length ? undefined : placeholder}
                  aria-label={placeholder}
                  disabled={disabled}
                />
              </ComboboxValue>
            </ComboboxChips>
            <ComboboxContent anchor={anchor}>
              <OptionList emptyMessage={emptyMessage} />
            </ComboboxContent>
          </>
        )}
      </Combobox>
    );
  }

  const { value, onValueChange } = props;
  const selected = options.find((option) => option.value === value) ?? null;

  return (
    <Combobox
      items={options}
      value={selected}
      disabled={disabled}
      onValueChange={(next) => onValueChange(next?.value ?? null)}
      itemToStringLabel={itemToStringLabel}
      isItemEqualToValue={isItemEqualToValue}
      filter={filterOption}
    >
      {trigger === "popup" ? (
        <>
          <PopupTrigger
            label={selected?.label ?? placeholder}
            disabled={disabled}
            className={className}
          />
          <PopupContent
            searchPlaceholder={searchPlaceholder}
            emptyMessage={emptyMessage}
            canClear={!!selected}
            onClear={() => onValueChange(null)}
          />
        </>
      ) : (
        <>
          <ComboboxInput
            placeholder={placeholder}
            aria-label={placeholder}
            showClear={!!selected}
            disabled={disabled}
            className={cn("w-56", className)}
          />
          <ComboboxContent>
            <OptionList emptyMessage={emptyMessage} />
          </ComboboxContent>
        </>
      )}
    </Combobox>
  );
}
