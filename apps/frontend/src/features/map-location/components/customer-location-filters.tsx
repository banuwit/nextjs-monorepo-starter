"use client";

import { XIcon } from "lucide-react";

import { FacetedFilter } from "@/components/filter/faceted-filter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  EMPTY_FILTER_STATE,
  type FilterKey,
  type FilterState,
  type LocationCustomer,
} from "../types/map-location";
import { FILTERS_CONFIG, optionsFor } from "../utils/map-location";

type FiltersProps = {
  /** The unfiltered population, used to build each dropdown's options. */
  customers: LocationCustomer[];
  value: FilterState;
  onChange: (next: FilterState) => void;
};

/** A flex-wrap row of faceted dropdowns; picks are held until Apply. */
export function CustomerLocationFilters({ customers, value, onChange }: FiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {FILTERS_CONFIG.map((config) => (
        <FacetedFilter
          key={config.key}
          title={config.title}
          options={optionsFor(customers, value, config.key)}
          variant={config.variant ?? "multi"}
          value={value[config.key]}
          onValueChange={(next) => onChange(cascade(value, config.key, next))}
          showHeader
        />
      ))}
    </div>
  );
}

/** Changing a parent in the location hierarchy clears the levels under it. */
function cascade(value: FilterState, key: FilterKey, next: string[]): FilterState {
  const hierarchy: FilterKey[] = ["region", "city", "district", "street"];
  const index = hierarchy.indexOf(key);
  const cleared = index >= 0 ? hierarchy.slice(index + 1) : [];
  return {
    ...value,
    [key]: next,
    ...Object.fromEntries(cleared.map((child) => [child, []])),
  };
}

type ActiveFiltersProps = {
  value: FilterState;
  onChange: (next: FilterState) => void;
  labels: Record<string, string>;
};

/** One removable chip per filter listing its selected values. */
export function CustomerLocationActiveFilters({ value, onChange, labels }: ActiveFiltersProps) {
  const groups = FILTERS_CONFIG.filter((config) => value[config.key].length > 0).map((config) => ({
    key: config.key,
    title: config.title,
    text: value[config.key].map((key) => labels[key] ?? key).join(", "),
  }));

  if (groups.length === 0) return null;

  return (
    <div className="flex flex-wrap items-start gap-2 rounded-md border border-border bg-muted/30 px-3 py-2">
      <span className="pt-0.5 text-xs font-medium text-muted-foreground">Active filters</span>
      {groups.map((group) => (
        <Badge
          key={group.key}
          variant="secondary"
          className="h-auto max-w-full gap-1 overflow-visible py-1 pr-1 font-normal whitespace-normal"
        >
          <span className="text-muted-foreground">{group.title}:</span>
          <span title={group.text}>{group.text}</span>
          <button
            type="button"
            aria-label={`Remove ${group.title} filter`}
            className="ml-0.5 rounded-sm p-0.5 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
            onClick={() => onChange({ ...value, [group.key]: [] })}
          >
            <XIcon className="size-3" />
          </button>
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="xs"
        className="ml-auto text-muted-foreground hover:text-destructive"
        onClick={() => onChange(EMPTY_FILTER_STATE)}
      >
        Clear all
      </Button>
    </div>
  );
}
