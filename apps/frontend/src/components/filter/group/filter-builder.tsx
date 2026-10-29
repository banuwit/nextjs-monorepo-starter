"use client";

import { Filters, type FiltersProps } from "@/components/reui/filters/filters";
import type { FilterOperatorLabels } from "@/components/reui/filters/filters-operators";
import { cn } from "@/lib/utils";

/** Short comparison words that fit a narrow operator cell (c-filters-10). */
export const COMPACT_OPERATOR_LABELS: FilterOperatorLabels = {
  gt: "over",
  gte: "at least",
  lt: "under",
  lte: "at most",
};

export type FilterBuilderProps<V = unknown, O = unknown> = Omit<
  FiltersProps<V, O>,
  "variant" | "advancedMode" | "advancedAlign"
> & {
  /**
   * `"popover"` (c-filters-10): a trigger opens the builder over the page,
   * e.g. in a card header above the table it narrows. `"inline"`
   * (c-filters-11): the builder is laid open on the page.
   */
  mode?: "popover" | "inline";
  /** Popover alignment against its trigger. Default: `"end"`. */
  align?: "start" | "center" | "end";
  /** Use `COMPACT_OPERATOR_LABELS` for number comparisons. Default: true. */
  compactOperators?: boolean;
};

/**
 * The ReUI condition builder with nested AND/OR groups and drag reordering,
 * preset for this app. Rows are field → operator → value; a group can hold
 * rules and further groups.
 */
export function FilterBuilder<V = unknown, O = unknown>({
  mode = "popover",
  align = "end",
  compactOperators = true,
  operatorLabels,
  className,
  ...props
}: FilterBuilderProps<V, O>) {
  const popover = mode === "popover";

  return (
    <Filters<V, O>
      variant="advanced"
      advancedMode={mode}
      advancedAlign={align}
      reorderable
      operatorLabels={
        compactOperators
          ? { ...COMPACT_OPERATOR_LABELS, ...operatorLabels }
          : operatorLabels
      }
      // A narrow popover shows only the leaf of a nested path ("…› City").
      pathCollapse={popover ? "start" : undefined}
      maxPathSegments={popover ? 1 : undefined}
      className={cn(
        popover &&
          "[--filter-field-width:9rem] [--filter-operator-width:6.5rem] [--filter-value-width:10.5rem]",
        className,
      )}
      {...props}
    />
  );
}
