import type {
  SpendGroup,
  SpendItem,
  SpendMetric,
  SpendModelMix,
  SpendWorkspace,
} from "../types/ai-usage";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const integer = new Intl.NumberFormat("en-US");

export function formatCurrency(value: number, fractionDigits = 0) {
  return fractionDigits === 0
    ? currency.format(value)
    : value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      });
}

export function formatCompact(value: number) {
  return compact.format(value);
}

export function formatInteger(value: number) {
  return integer.format(value);
}

export function formatMetric(value: number, metric: SpendMetric) {
  return metric === "cost" ? formatCurrency(value) : formatCompact(value);
}

export function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function formatChange(value: number) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${Math.round(Math.abs(value) * 100)}%`;
}

export function sumBy(items: SpendItem[], metric: SpendMetric) {
  return items.reduce((total, item) => total + item[metric], 0);
}

export function share(
  item: SpendItem,
  items: SpendItem[],
  metric: SpendMetric,
) {
  const total = sumBy(items, metric);
  return total > 0 ? item[metric] / total : 0;
}

/** Share of the metric held by the top `count` items. */
export function topShare(
  items: SpendItem[],
  metric: SpendMetric,
  count: number,
) {
  const sorted = [...items].sort((a, b) => b[metric] - a[metric]);
  return (
    sumBy(sorted.slice(0, count), metric) / Math.max(sumBy(items, metric), 1)
  );
}

/** Straight-line projection of a month-to-date value to the full month. */
export function projectMonth(value: number, workspace: SpendWorkspace) {
  return Math.round((value / workspace.day) * workspace.daysInMonth);
}

/** Change of a month-to-date value against the same pace last month. */
export function paceChange(
  value: number,
  previousMonthTotal: number,
  workspace: SpendWorkspace,
) {
  const previousAtPace =
    (previousMonthTotal / workspace.daysInMonth) * workspace.day;
  return previousAtPace > 0 ? value / previousAtPace - 1 : 0;
}

/**
 * Restricts a group to the usage of one model. Item shares come from `mix`;
 * the scoped items are then scaled so they add up to the model's own cost and
 * tokens, which keeps every group consistent with the model total.
 */
export function scopeGroupToModel(
  group: SpendGroup,
  model: SpendItem,
  mix: SpendModelMix,
): SpendGroup {
  const weighted = group.items
    .map((item) => ({ item, weight: mix[item.id]?.[model.id] ?? 0 }))
    .filter(({ weight }) => weight > 0);
  const costBase = weighted.reduce(
    (t, { item, weight }) => t + item.cost * weight,
    0,
  );
  const tokensBase = weighted.reduce(
    (t, { item, weight }) => t + item.tokens * weight,
    0,
  );

  const items = weighted.map(({ item, weight }): SpendItem => {
    const cost =
      costBase > 0 ? (model.cost * item.cost * weight) / costBase : 0;
    const tokens =
      tokensBase > 0 ? (model.tokens * item.tokens * weight) / tokensBase : 0;
    const ratio = item.cost > 0 ? cost / item.cost : 0;
    return {
      ...item,
      cost,
      tokens,
      runs: Math.round(item.runs * weight),
      series: item.series.map((value) => value * ratio),
      allModelsCost: item.cost,
    };
  });
  return { ...group, items };
}
