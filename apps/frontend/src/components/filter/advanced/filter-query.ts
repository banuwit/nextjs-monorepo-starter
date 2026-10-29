import { format } from "date-fns";

import {
  resolveFilterDate,
  type FilterDateValue,
} from "@/components/reui/filters/filters-date";
import { isFilterRule } from "@/components/reui/filters/filters-query";
import type {
  FilterNode,
  FilterRule,
} from "@/components/reui/filters/filters-types";

/**
 * Reads the value a rule targets from a row. `path` is the rule's full path,
 * e.g. `["organization", "city"]` for a field nested in a group.
 */
export type FilterFieldReader<T> = (row: T, path: string[]) => unknown;

const isBlank = (value: unknown) =>
  value === undefined ||
  value === null ||
  value === "" ||
  (Array.isArray(value) && value.length === 0);

const isDateValue = (value: unknown): value is FilterDateValue =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  ("date" in value || "relative" in value);

/** A date token or a `yyyy-MM-dd…` string as a comparable day key. */
function toDayKey(value: unknown): string | null {
  if (isDateValue(value)) {
    const date = resolveFilterDate(value);
    return date ? format(date, "yyyy-MM-dd") : null;
  }
  return typeof value === "string" && value.length >= 10
    ? value.slice(0, 10)
    : null;
}

/** Picks arrive as a list (`is any of`) or a single value (`is`, booleans). */
const toList = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.map((item) => String(item).toLowerCase())
    : isBlank(value)
      ? []
      : [String(value).toLowerCase()];

function compareDates(operator: string, actual: unknown, value: unknown) {
  const day = toDayKey(actual);
  if (!day) return false;
  if (Array.isArray(value)) {
    const from = toDayKey(value[0]);
    const to = toDayKey(value[1]);
    const inside = !!from && !!to && day >= from && day <= to;
    return operator === "not_between" ? !inside : inside;
  }
  const target = toDayKey(value);
  if (!target) return true;
  switch (operator) {
    case "is":
      return day === target;
    case "is_not":
      return day !== target;
    case "is_before":
      return day < target;
    case "is_after":
      return day > target;
    case "is_on_or_before":
      return day <= target;
    case "is_on_or_after":
      return day >= target;
    default:
      return true;
  }
}

function matchesRule<T>(
  row: T,
  rule: FilterRule,
  read: FilterFieldReader<T>,
): boolean {
  const actual = read(row, rule.path);
  const value = rule.value;
  const dated =
    isDateValue(value) || (Array.isArray(value) && isDateValue(value[0]));

  const result = (() => {
    if (rule.operator === "empty") return isBlank(actual);
    if (rule.operator === "not_empty") return !isBlank(actual);
    if (dated) return compareDates(rule.operator, actual, value);

    const text = String(actual ?? "").toLowerCase();
    const needle = String(value ?? "").toLowerCase();
    const picks = toList(value);
    // Multiselect attributes hold a list; everything else one value.
    const held = Array.isArray(actual)
      ? actual.map((item) => String(item).toLowerCase())
      : [text];
    const [from, to] = Array.isArray(value) ? value.map(Number) : [];

    switch (rule.operator) {
      case "contains":
        return text.includes(needle);
      case "not_contains":
        return !text.includes(needle);
      case "starts_with":
        return text.startsWith(needle);
      case "ends_with":
        return text.endsWith(needle);
      case "is":
      case "is_any_of":
        return picks.includes(text);
      case "is_not":
      case "is_none_of":
        return !picks.includes(text);
      case "has_any_of":
        return picks.some((pick) => held.includes(pick));
      case "has_all_of":
        return picks.every((pick) => held.includes(pick));
      case "has_none_of":
        return !picks.some((pick) => held.includes(pick));
      case "eq":
        return Number(actual) === Number(value);
      case "neq":
        return Number(actual) !== Number(value);
      case "gt":
        return Number(actual) > Number(value);
      case "gte":
        return Number(actual) >= Number(value);
      case "lt":
        return Number(actual) < Number(value);
      case "lte":
        return Number(actual) <= Number(value);
      case "between":
        return Number(actual) >= Number(from) && Number(actual) <= Number(to);
      case "not_between":
        return !(
          Number(actual) >= Number(from) && Number(actual) <= Number(to)
        );
      default:
        return true;
    }
  })();

  // Negate falls back to this flag for operators without an inverse.
  return rule.negated ? !result : result;
}

/**
 * A rule still being edited matches everything: no operator yet, no value
 * yet, or an empty pick list (unchecking the last option commits `[]`).
 * `false` is a real value for a boolean rule.
 */
export function isFilterRuleIncomplete(rule: FilterRule): boolean {
  if (!rule.operator) return true;
  if (rule.operator === "empty" || rule.operator === "not_empty") return false;
  return isBlank(rule.value);
}

/**
 * Compiles a ReUI filter query tree into a row predicate (pola `c-filters-7`).
 * Covers the whole operator catalog plus the date operators of `c-filters-5`,
 * and walks nested groups, so it keeps working with the advanced builder.
 */
export function matchesFilterNode<T>(
  row: T,
  node: FilterNode,
  read: FilterFieldReader<T>,
): boolean {
  if (isFilterRule(node)) {
    return isFilterRuleIncomplete(node) || matchesRule(row, node, read);
  }
  if (node.rules.length === 0) return true;
  return node.combinator === "and"
    ? node.rules.every((child) => matchesFilterNode(row, child, read))
    : node.rules.some((child) => matchesFilterNode(row, child, read));
}
