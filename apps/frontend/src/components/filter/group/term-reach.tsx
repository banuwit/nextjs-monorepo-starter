"use client";

import type { ReactNode } from "react";

import {
  isFilterRuleIncomplete,
  matchesFilterNode,
  type FilterFieldReader,
} from "@/components/filter/advanced/filter-query";
import { createFilterRule } from "@/components/reui/filters/filters-query";
import type {
  FilterField,
  FilterValueDisplayContext,
} from "@/components/reui/filters/filters-types";
import { cn } from "@/lib/utils";

/** How many rows one term matches on its own, or `null` while unfinished. */
export type FilterReachCounter = (
  path: string[],
  context: FilterValueDisplayContext,
) => number | null;

/**
 * Counts rows per term (c-filters-10), ignoring `negated` and the rest of the
 * query, so each chip says how much it narrows alone. Client-side only; drop
 * it once rows come from a server.
 */
export function createReachCounter<T>(
  rows: T[],
  read: FilterFieldReader<T>,
): FilterReachCounter {
  return (path, { operator, value }) => {
    const rule = createFilterRule<unknown>({
      id: "reach",
      path,
      operator: operator.value,
      value,
    });
    if (isFilterRuleIncomplete(rule)) return null;
    return rows.filter((row) => matchesFilterNode(row, rule, read)).length;
  };
}

/** `hits/total` beside a value; red when the term matches nothing. */
export function TermReach({
  hits,
  total,
}: {
  hits: number | null;
  total: number;
}) {
  if (hits === null) return null;
  return (
    <span
      className={cn(
        "shrink-0 text-xs tabular-nums",
        hits === 0 ? "text-destructive" : "text-muted-foreground",
      )}
    >
      {hits}/{total}
    </span>
  );
}

/** A text term with `…` where `contains`/`starts with`/`ends with` leave it open. */
export function PatternValue({
  value,
  operator,
}: {
  value: unknown;
  operator: string;
}) {
  const term = typeof value === "string" ? value.trim() : "";
  if (!term) return <>any text</>;
  const loose = operator === "contains" || operator === "not_contains";
  const lead = loose || operator === "ends_with";
  const trail = loose || operator === "starts_with";
  return (
    <span className="flex min-w-0 items-center">
      {lead && <span className="shrink-0 text-muted-foreground">…</span>}
      <span className="truncate">{term}</span>
      {trail && <span className="shrink-0 text-muted-foreground">…</span>}
    </span>
  );
}

/** What a leaf without its own `renderValue` shows before the reach count. */
function defaultValue(context: FilterValueDisplayContext): ReactNode {
  const { field, operator, value, options, labels } = context;
  if (field.type === "text") {
    return <PatternValue value={value} operator={operator.value} />;
  }
  if (options.length > 0) {
    const shown = options.slice(0, 2);
    const overflow = options.length - shown.length;
    return (
      <span className="flex min-w-0 items-center gap-1.5">
        <span className="truncate">
          {shown.map((option) => option.label).join(", ")}
        </span>
        {overflow > 0 && (
          <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
            +{overflow}
          </span>
        )}
      </span>
    );
  }
  if (Array.isArray(value)) {
    return labels.valueRange(String(value[0]), String(value[1]));
  }
  return value === undefined ? "" : String(value);
}

/**
 * Returns `fields` with every leaf's value followed by its reach count.
 * Keeps each field's own `renderValue`; nested groups are walked so the
 * counter gets the full path.
 */
export function withTermReach(
  fields: FilterField[],
  count: FilterReachCounter,
  total: number,
  prefix: string[] = [],
): FilterField[] {
  return fields.map((field) => {
    const path = [...prefix, field.id];
    if (field.fields) {
      return {
        ...field,
        fields: withTermReach(field.fields, count, total, path),
      };
    }
    const own = field.renderValue;
    return {
      ...field,
      renderValue: (context) => (
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="flex min-w-0 items-center">
            {own ? own(context) : defaultValue(context)}
          </span>
          <TermReach hits={count(path, context)} total={total} />
        </span>
      ),
    };
  });
}
