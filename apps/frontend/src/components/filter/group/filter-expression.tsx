"use client";

import { useMemo } from "react";

import {
  formatFilterDate,
  type FilterDateValue,
} from "@/components/reui/filters/filters-date";
import { isFilterRule } from "@/components/reui/filters/filters-query";
import type {
  FilterField,
  FilterNode,
  FilterQuery,
} from "@/components/reui/filters/filters-types";
import { cn } from "@/lib/utils";

/**
 * Maps each leaf's dotted path to its storage `column` (c-filters-11), e.g.
 * `organization.city` → `city`. Leaves without one keep their path.
 */
export function collectFilterColumns(
  fields: FilterField[],
  prefix: string[] = [],
  out: Record<string, string> = {},
): Record<string, string> {
  for (const field of fields) {
    const path = [...prefix, field.id];
    if (field.column) out[path.join(".")] = field.column;
    if (field.fields) collectFilterColumns(field.fields, path, out);
  }
  return out;
}

const OPERATOR_TEXT: Record<string, string> = {
  contains: "contains",
  not_contains: "does not contain",
  starts_with: "starts with",
  ends_with: "ends with",
  is: "=",
  is_not: "!=",
  empty: "is empty",
  not_empty: "is not empty",
  eq: "=",
  neq: "!=",
  gt: ">",
  gte: ">=",
  lt: "<",
  lte: "<=",
  between: "between",
  not_between: "not between",
  is_any_of: "in",
  is_none_of: "not in",
  has_any_of: "has any of",
  has_all_of: "has all of",
  has_none_of: "has none of",
  is_before: "<",
  is_after: ">",
  is_on_or_before: "<=",
  is_on_or_after: ">=",
};

/** Operators whose value reads as a list, `in ('a', 'b')`. */
const LIST_OPERATORS = new Set([
  "is_any_of",
  "is_none_of",
  "has_any_of",
  "has_all_of",
  "has_none_of",
]);

const isDateValue = (value: unknown): value is FilterDateValue =>
  typeof value === "object" &&
  value !== null &&
  ("date" in value || "relative" in value);

function formatValue(value: unknown): string {
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (isDateValue(value)) return `'${formatFilterDate(value)}'`;
  return `'${String(value)}'`;
}

/**
 * Reads a query tree back as one expression, e.g.
 * `status in ('active') AND (score >= 70 OR department = 'design')`.
 * Display text only: values are not escaped, so never run it as SQL.
 */
export function describeFilterQuery(
  node: FilterNode,
  columns: Record<string, string> = {},
  depth = 0,
): string {
  if (isFilterRule(node)) {
    const key = node.path.join(".");
    const column = columns[key] ?? key;
    if (!node.operator) return `${column} ...`;
    const word = OPERATOR_TEXT[node.operator] ?? node.operator;
    const values = Array.isArray(node.value) ? node.value : [node.value];
    let text: string;
    if (node.value === undefined || node.value === null) {
      text = `${column} ${word}`;
    } else if (node.operator === "between" || node.operator === "not_between") {
      text = `${column} ${word} ${formatValue(values[0])} and ${formatValue(values[1])}`;
    } else if (LIST_OPERATORS.has(node.operator)) {
      text = `${column} ${word} (${values.map(formatValue).join(", ")})`;
    } else {
      text = `${column} ${word} ${formatValue(values[0])}`;
    }
    return node.negated ? `NOT (${text})` : text;
  }
  if (node.rules.length === 0) return "";
  const inner = node.rules
    .map((child) => describeFilterQuery(child, columns, depth + 1))
    .filter(Boolean)
    .join(` ${node.combinator.toUpperCase()} `);
  return depth === 0 || node.rules.length === 1 ? inner : `(${inner})`;
}

/** The query tree printed back as an expression under the builder. */
export function FilterExpression({
  query,
  fields,
  empty = "everything",
  className,
}: {
  query: FilterQuery;
  fields: FilterField[];
  /** Shown when the query has no rules. */
  empty?: string;
  className?: string;
}) {
  const columns = useMemo(() => collectFilterColumns(fields), [fields]);
  const expression = describeFilterQuery(query, columns) || empty;

  return (
    <code
      aria-label="Filter expression"
      className={cn(
        "block w-full overflow-x-auto rounded-lg border bg-muted p-3 text-xs dark:bg-muted/60",
        className,
      )}
    >
      {expression}
    </code>
  );
}
