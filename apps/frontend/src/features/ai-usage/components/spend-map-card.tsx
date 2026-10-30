"use client";

import { useRef, type CSSProperties } from "react";
import {
  BotIcon,
  CircleDollarSignIcon,
  EllipsisVerticalIcon,
  KeyRoundIcon,
  LayersIcon,
  UsersIcon,
  WaypointsIcon,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import {
  useConnectorLayout,
  type ConnectorLink,
} from "../hooks/use-connector-layout";
import type {
  SpendDimension,
  SpendGroup,
  SpendItem,
  SpendMetric,
  SpendWorkspace,
} from "../types/ai-usage";
import {
  formatCurrency,
  formatMetric,
  formatPercent,
  paceChange,
  projectMonth,
  share,
  sumBy,
} from "../utils/spend";
import { SpendChangeBadge } from "./spend-change-badge";
import { SpendGauge } from "./spend-gauge";
import { SpendIconGlyph, SpendItemIcon } from "./spend-item-icon";

const ALL_MODELS = "all";

const groupIcons: Record<SpendDimension, LucideIcon> = {
  models: LayersIcon,
  teams: UsersIcon,
  agents: BotIcon,
  apiKeys: KeyRoundIcon,
};

const metrics: { id: SpendMetric; label: string; icon: LucideIcon }[] = [
  { id: "cost", label: "Cost", icon: CircleDollarSignIcon },
  { id: "tokens", label: "Tokens", icon: LayersIcon },
];

const GAUGE_ID = "gauge";
const PORT = 7;
/** Height and gap of an item row, in rem so they follow the Scale preference. */
const ITEM_ROW_HEIGHT = "4rem";
const ITEM_ROW_GAP = "0.5rem";

type SpendMapCardProps = {
  workspace: SpendWorkspace;
  /** Models available in the tabs. */
  models: SpendItem[];
  /** Selected model id, or `"all"`. */
  modelId: string;
  onModelChange: (modelId: string) => void;
  /** Teams, agents and API keys, already scoped to the selected model. */
  groups: SpendGroup[];
  selectedGroup: SpendGroup;
  selectedItem: SpendItem;
  onSelectGroup: (group: SpendGroup) => void;
  onSelectItem: (item: SpendItem) => void;
  /** Opens the details modal for `item`. */
  onOpenDetails: (item: SpendItem) => void;
  /**
   * Rows the tallest item list can have. The canvas reserves room for them so
   * the gauge and the cards do not move when the list gets shorter or longer.
   */
  itemSlots: number;
};

export function SpendMapCard({
  workspace,
  models,
  modelId,
  onModelChange,
  groups,
  selectedGroup,
  selectedItem,
  onSelectGroup,
  onSelectItem,
  onOpenDetails,
  itemSlots,
}: SpendMapCardProps) {
  const canvas = useRef<HTMLDivElement>(null);

  const model = models.find((entry) => entry.id === modelId);
  const items = [...selectedGroup.items].sort((a, b) => b.cost - a.cost);

  // Built from the ranked items so a re-rank re-measures the connectors.
  const links: ConnectorLink[] = [
    ...groups.map((group) => ({
      from: GAUGE_ID,
      to: `group:${group.id}`,
      active: group.id === selectedGroup.id,
    })),
    ...items.map((item) => ({
      from: `group:${selectedGroup.id}`,
      to: `item:${item.id}`,
      active: item.id === selectedItem.id,
    })),
  ];
  const { register, paths } = useConnectorLayout(canvas, links);

  const totals: Record<SpendMetric, number> = {
    cost: sumBy(groups[0]?.items ?? [], "cost"),
    tokens: sumBy(groups[0]?.items ?? [], "tokens"),
  };
  const projectedCost = projectMonth(totals.cost, workspace);
  const overBudget = projectedCost - workspace.budget;
  // Last month's totals are only known for the workspace; a model gets its
  // current share of them.
  const previous = {
    cost:
      workspace.previous.cost *
      (model ? model.cost / sumBy(models, "cost") : 1),
    tokens:
      workspace.previous.tokens *
      (model ? model.tokens / sumBy(models, "tokens") : 1),
  };

  return (
    <section
      aria-label="Spend map"
      className="flex min-w-0 flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10"
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-10 items-center justify-center rounded-lg bg-card ring-1 ring-foreground/10"
          >
            <WaypointsIcon className="size-4" />
          </span>
          <div className="flex flex-col">
            <h2 className="text-base font-semibold leading-tight">Spend map</h2>
            <p className="text-sm text-muted-foreground">
              Month to date, {workspace.startLabel} to{" "}
              {workspace.endLabel.replace(/\D+/, "")}
            </p>
          </div>
        </div>
        <div className="flex max-w-full items-center gap-2">
          <div className="min-w-0 overflow-x-auto">
            <ToggleGroup
              aria-label="Model"
              variant="outline"
              spacing={0}
              value={[modelId]}
              onValueChange={(values) => {
                if (values[0]) onModelChange(values[0]);
              }}
              className="bg-card"
            >
              <ToggleGroupItem value={ALL_MODELS} className="gap-1.5 px-3">
                <LayersIcon aria-hidden="true" />
                All models
              </ToggleGroupItem>
              {models.map((entry) => (
                <ToggleGroupItem
                  key={entry.id}
                  value={entry.id}
                  className="gap-1.5 px-3"
                >
                  <SpendIconGlyph icon={entry.icon} />
                  {entry.name}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="More actions"
                  className="shrink-0 bg-card"
                />
              }
            >
              <EllipsisVerticalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export CSV</DropdownMenuItem>
              <DropdownMenuItem>Set workspace budget</DropdownMenuItem>
              <DropdownMenuItem>Manage API keys</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div
        ref={canvas}
        className="relative grid grid-cols-1 gap-6 px-4 py-8 md:grid-cols-[minmax(13rem,1fr)_minmax(0,1.3fr)_minmax(0,1.5fr)] md:gap-x-16 md:px-8 md:py-12 lg:gap-x-24"
      >
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden size-full overflow-visible md:block"
        >
          {[
            ...paths.filter((path) => !path.active),
            ...paths.filter((path) => path.active),
          ].map((path) => (
            <g
              key={`${path.from}->${path.to}`}
              className={cn(
                "transition-colors duration-200 motion-reduce:transition-none",
                path.active ? "stroke-primary" : "stroke-primary/30",
              )}
            >
              <path
                d={path.d}
                fill="none"
                strokeWidth={path.active ? 2 : 1.5}
                strokeDasharray={path.active ? undefined : "3 4"}
                strokeLinecap="round"
              />
              <rect
                x={path.start.x - PORT / 2}
                y={path.start.y - PORT / 2}
                width={PORT}
                height={PORT}
                rx={1.5}
                className={path.active ? "fill-primary" : "fill-card"}
                strokeWidth={1.5}
              />
              <rect
                x={path.end.x - PORT / 2}
                y={path.end.y - PORT / 2}
                width={PORT}
                height={PORT}
                rx={1.5}
                className={path.active ? "fill-primary" : "fill-card"}
                strokeWidth={1.5}
              />
            </g>
          ))}
        </svg>

        {/* Column 1: gauge with cost and tokens side by side */}
        <div className="flex flex-col items-center justify-center gap-4 self-center">
          <div ref={register(GAUGE_ID)}>
            <SpendGauge
              progress={totals.cost / workspace.budget}
              projected={projectedCost / workspace.budget}
              label={`${formatCurrency(totals.cost)} of ${formatCurrency(workspace.budget)} budget used, ${formatCurrency(projectedCost)} projected`}
            >
              <span className="text-xs tracking-wide text-muted-foreground uppercase">
                Day {workspace.day} of {workspace.daysInMonth}
              </span>
              <span className="text-3xl font-semibold tracking-tight tabular-nums">
                {formatCurrency(totals.cost)}
              </span>
              <span className="text-sm text-muted-foreground">
                of {formatCurrency(workspace.budget)} budget
              </span>
            </SpendGauge>
          </div>
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="inline-flex items-center gap-2 text-base font-semibold">
              {model && <SpendIconGlyph icon={model.icon} />}
              {model ? model.name : workspace.name}
            </span>
            <dl className="grid grid-cols-2 gap-x-6">
              {metrics.map((entry) => (
                <div
                  key={entry.id}
                  className="flex flex-col items-center gap-1"
                >
                  <dt className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <entry.icon aria-hidden="true" className="size-3.5" />
                    {entry.label}
                  </dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {formatMetric(totals[entry.id], entry.id)}
                  </dd>
                  <dd>
                    <SpendChangeBadge
                      value={paceChange(
                        totals[entry.id],
                        previous[entry.id],
                        workspace,
                      )}
                    />
                  </dd>
                </div>
              ))}
            </dl>
            <span
              className={cn(
                "text-sm",
                overBudget > 0
                  ? "font-medium text-amber-900 dark:text-amber-200"
                  : "text-muted-foreground",
              )}
            >
              {overBudget > 0
                ? `Projected ${formatCurrency(projectedCost)}, ${formatCurrency(overBudget)} over`
                : `Projected ${formatCurrency(projectedCost)}, ${formatCurrency(-overBudget)} under`}
            </span>
          </div>
        </div>

        {/* Column 2: teams, agents and API keys */}
        <div
          className="flex flex-col justify-center gap-3"
          role="group"
          aria-label="Spend by"
        >
          {groups.map((group) => {
            const Icon = groupIcons[group.id];
            const ranked = [...group.items].sort((a, b) => b.cost - a.cost);
            const selected = group.id === selectedGroup.id;
            // The item the bars highlight: the selected one, else the biggest.
            const featured =
              (selected &&
                group.items.find((item) => item.id === selectedItem.id)) ||
              ranked[0];
            if (!featured) return null;
            return (
              <button
                key={group.id}
                ref={register(`group:${group.id}`)}
                type="button"
                aria-pressed={selected}
                onClick={() => onSelectGroup(group)}
                className={cn(
                  "flex w-full flex-col gap-3 rounded-xl p-3 text-left ring-1 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  selected
                    ? "bg-muted ring-foreground/30"
                    : "bg-card ring-foreground/10 hover:bg-muted/50",
                )}
              >
                <span className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex size-9 items-center justify-center rounded-lg bg-card ring-1 ring-foreground/10"
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="flex-1 text-base font-semibold">
                    {group.label}
                  </span>
                  <span className="text-sm text-muted-foreground tabular-nums">
                    {group.items.length}
                  </span>
                </span>
                <span className="flex flex-col gap-2">
                  {metrics.map((entry) => (
                    <span key={entry.id} className="flex items-center gap-3">
                      <span className="inline-flex w-16 shrink-0 items-center gap-1.5 text-sm font-semibold tabular-nums">
                        <entry.icon
                          aria-hidden="true"
                          className="size-3.5 text-muted-foreground"
                        />
                        <span className="sr-only">{entry.label} </span>
                        {formatPercent(share(featured, group.items, entry.id))}
                      </span>
                      <span
                        aria-hidden="true"
                        className="flex h-1.5 flex-1 gap-1"
                      >
                        {ranked.map((item) => (
                          <span
                            key={item.id}
                            className={cn(
                              "h-full rounded-full",
                              item.id !== featured.id
                                ? "bg-border"
                                : selected
                                  ? "bg-primary"
                                  : "bg-muted-foreground/60",
                            )}
                            style={{ flexGrow: Math.max(item[entry.id], 1) }}
                          />
                        ))}
                      </span>
                    </span>
                  ))}
                </span>
              </button>
            );
          })}
        </div>

        {/* Column 3: items of the selected dimension */}
        <div
          className="flex flex-col justify-center gap-2 md:min-h-(--item-list-height)"
          style={
            {
              "--item-list-height": `calc(${itemSlots} * ${ITEM_ROW_HEIGHT} + ${itemSlots - 1} * ${ITEM_ROW_GAP})`,
            } as CSSProperties
          }
          role="group"
          aria-label={selectedGroup.label}
        >
          {items.map((item) => {
            const selected = item.id === selectedItem.id;
            return (
              <div
                key={item.id}
                ref={register(`item:${item.id}`)}
                className={cn(
                  "flex items-center gap-1 rounded-xl p-1 ring-1 transition-colors",
                  selected
                    ? "bg-muted ring-foreground/30"
                    : "bg-card ring-foreground/10 hover:bg-muted/50",
                )}
              >
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onSelectItem(item)}
                  className="flex min-w-0 flex-1 items-center gap-3 rounded-lg p-1.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <SpendItemIcon icon={item.icon} />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-base font-semibold">
                      {item.name}
                    </span>
                    <span className="flex flex-wrap items-center gap-x-3 text-sm text-muted-foreground tabular-nums">
                      {metrics.map((entry) => (
                        <span
                          key={entry.id}
                          className="inline-flex items-center gap-1"
                        >
                          <entry.icon aria-hidden="true" className="size-3" />
                          <span className="sr-only">{entry.label} </span>
                          {formatMetric(item[entry.id], entry.id)}
                          <span aria-hidden="true">·</span>
                          {formatPercent(
                            share(item, selectedGroup.items, entry.id),
                          )}
                        </span>
                      ))}
                    </span>
                  </span>
                  <SpendChangeBadge value={item.change} />
                </button>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  aria-label={`View details for ${item.name}`}
                  onClick={() => onOpenDetails(item)}
                  className="px-2"
                >
                  View
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      <footer className="flex justify-end border-t px-4 py-3 text-sm text-muted-foreground">
        {workspace.updatedAt}
      </footer>
    </section>
  );
}
