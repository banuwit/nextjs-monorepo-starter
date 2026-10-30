import {
  CircleDollarSignIcon,
  LayersIcon,
  type LucideIcon,
} from "lucide-react";
import { DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type {
  SpendGroup,
  SpendItem,
  SpendMetric,
  SpendWorkspace,
} from "../types/ai-usage";
import {
  formatCompact,
  formatCurrency,
  formatInteger,
  formatMetric,
  formatPercent,
  projectMonth,
  share,
} from "../utils/spend";
import { SpendChangeBadge } from "./spend-change-badge";
import { SpendItemIcon } from "./spend-item-icon";

const METER_SEGMENTS = 20;

const metrics: { id: SpendMetric; label: string; icon: LucideIcon }[] = [
  { id: "cost", label: "Cost", icon: CircleDollarSignIcon },
  { id: "tokens", label: "Tokens", icon: LayersIcon },
];

type SpendDetailCardProps = {
  workspace: SpendWorkspace;
  group: SpendGroup;
  item: SpendItem;
  /** Set when the figures are limited to one model. */
  model?: SpendItem;
};

export function SpendDetailCard({
  workspace,
  group,
  item,
  model,
}: SpendDetailCardProps) {
  const ranked = [...group.items].sort((a, b) => b.cost - a.cost);
  const rank = ranked.findIndex((entry) => entry.id === item.id) + 1;

  const month = workspace.startLabel.replace(/\s*\d+$/, "");
  const peak = Math.max(...item.series, 0);
  const peakIndex = item.series.indexOf(peak);
  const average =
    item.series.reduce((total, value) => total + value, 0) /
    Math.max(item.series.length, 1);

  // Caps apply to spend across all models, even when the figures are scoped.
  const capCost = item.allModelsCost ?? item.cost;
  const capUsed = item.monthlyCap ? capCost / item.monthlyCap : null;
  const capProjected = item.monthlyCap
    ? projectMonth(capCost, workspace) / item.monthlyCap
    : null;
  const filled = Math.round(Math.min(capUsed ?? 0, 1) * METER_SEGMENTS);
  const projectedFilled = Math.round(
    Math.min(capProjected ?? 0, 1) * METER_SEGMENTS,
  );

  const facts = [
    { label: "Runs", value: formatInteger(item.runs) },
    { label: "Cost per run", value: formatCurrency(item.cost / item.runs, 3) },
    {
      label: "Tokens per run",
      value: formatCompact(item.tokens / item.runs),
    },
    { label: "Cache hit rate", value: formatPercent(item.cacheHitRate) },
  ];

  return (
    <section
      aria-label={`${item.name} details`}
      className="flex min-w-0 flex-col @container"
    >
      <header className="flex items-center gap-3 border-b bg-muted/40 py-4 pr-12 pl-5">
        <SpendItemIcon icon={item.icon} className="size-11" />
        <div className="flex min-w-0 flex-col gap-0.5">
          <DialogTitle className="truncate text-lg leading-tight font-semibold">
            {item.name}
          </DialogTitle>
          <p className="truncate text-sm text-muted-foreground">
            #{rank} of {ranked.length} {group.label.toLowerCase()} by cost
            <span aria-hidden="true" className="mx-1.5">
              ·
            </span>
            {item.meta}
            {model && (
              <>
                <span aria-hidden="true" className="mx-1.5">
                  ·
                </span>
                {model.name} only
              </>
            )}
          </p>
        </div>
      </header>

      <div className="flex flex-col gap-5 p-5">
        <div className="grid grid-cols-1 gap-3 @sm:grid-cols-2">
          {metrics.map((entry) => {
            const itemShare = share(item, group.items, entry.id);
            return (
              <div
                key={entry.id}
                className="flex flex-col gap-3 rounded-lg p-3 ring-1 ring-foreground/10"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                    <entry.icon aria-hidden="true" className="size-3.5" />
                    {entry.label}
                  </span>
                  {entry.id === "cost" && (
                    <SpendChangeBadge
                      value={item.change}
                      suffix={`vs ${workspace.previousMonthLabel}`}
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl leading-tight font-semibold tracking-tight tabular-nums">
                    {formatMetric(item[entry.id], entry.id)}
                  </span>
                  <span className="text-sm text-muted-foreground tabular-nums">
                    {formatMetric(
                      projectMonth(item[entry.id], workspace),
                      entry.id,
                    )}{" "}
                    projected
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-10 shrink-0 text-sm font-semibold tabular-nums">
                    {formatPercent(itemShare)}
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-1.5 flex-1 overflow-hidden rounded-full bg-border"
                  >
                    <span
                      className="block h-full rounded-full bg-primary"
                      style={{ width: `${itemShare * 100}%` }}
                    />
                  </span>
                  <span className="sr-only">
                    of {group.singular} {entry.label.toLowerCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <figure className="flex flex-col gap-2">
          <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 text-sm">
            <span className="font-medium">Daily cost</span>
            <span className="text-muted-foreground tabular-nums">
              Avg {formatCurrency(average, 2)}
              <span aria-hidden="true" className="mx-1.5">
                ·
              </span>
              Peak {formatCurrency(peak, 2)} on {month} {peakIndex + 1}
            </span>
          </figcaption>
          <div
            role="img"
            aria-label={`Daily cost from ${workspace.startLabel} to ${workspace.endLabel}`}
            className="relative flex h-24 items-end gap-[3px]"
          >
            {item.series.map((value, index) => (
              <span
                key={index}
                title={`${month} ${index + 1}: ${formatCurrency(value, 2)}`}
                className={cn(
                  "min-w-0 flex-1 rounded-t-[2px]",
                  index === peakIndex ? "bg-primary" : "bg-primary/30",
                )}
                style={{
                  height: `${Math.max((value / (peak || 1)) * 100, 3)}%`,
                }}
              />
            ))}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 border-t border-dashed border-foreground/40"
              style={{ bottom: `${(average / (peak || 1)) * 100}%` }}
            />
          </div>
          <div
            aria-hidden="true"
            className="flex justify-between text-xs text-muted-foreground"
          >
            <span>{workspace.startLabel}</span>
            <span>{workspace.endLabel}</span>
          </div>
        </figure>

        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="font-medium">Monthly cap</span>
            <span className="text-muted-foreground tabular-nums">
              {item.monthlyCap
                ? `${formatCurrency(capCost)} of ${formatCurrency(item.monthlyCap)}`
                : "Not set"}
            </span>
          </div>
          {item.monthlyCap && capUsed !== null && capProjected !== null ? (
            <>
              <div
                role="img"
                aria-label={`${formatPercent(capUsed)} of the cap used`}
                className="flex h-3 gap-[3px]"
              >
                {Array.from({ length: METER_SEGMENTS }, (_, index) => (
                  <span
                    key={index}
                    className={cn(
                      "min-w-0 flex-1 rounded-[3px]",
                      index < filled
                        ? capProjected > 1
                          ? "bg-destructive"
                          : "bg-primary"
                        : index < projectedFilled
                          ? "border border-dashed border-amber-500 dark:border-amber-300"
                          : "bg-border",
                    )}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {capProjected > 1
                  ? `${formatPercent(capUsed)} used. On pace to pass the cap around day ${Math.ceil(item.monthlyCap / (capCost / workspace.day))}.`
                  : `${formatPercent(capUsed)} used. On pace for ${formatPercent(capProjected)} by month end.`}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No limit on this {group.singular}, so spend is not capped.
            </p>
          )}
        </div>

        <dl className="divide-y rounded-lg ring-1 ring-foreground/10">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="flex items-center justify-between gap-3 px-3 py-2 text-sm"
            >
              <dt className="text-muted-foreground">{fact.label}</dt>
              <dd className="font-semibold tabular-nums">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
