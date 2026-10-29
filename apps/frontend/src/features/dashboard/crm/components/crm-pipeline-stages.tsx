"use client";

import { CircleAlertIcon } from "lucide-react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usdCompact, usdWhole } from "../utils/format";
import { cn } from "@/lib/utils";
import type { CrmOpportunity } from "@/mocks/dashboard-crm.mock";

import type { CrmStageSummary } from "../utils/crm-data";

export function CrmPipelineStages({
  stages,
  selected,
  onSelect,
}: {
  stages: CrmStageSummary[];
  selected: CrmOpportunity["stage"] | null;
  onSelect: (stage: CrmOpportunity["stage"] | null) => void;
}) {
  const max = Math.max(...stages.map((stage) => stage.value), 1);
  const total = stages.reduce((sum, stage) => sum + stage.value, 0);

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Pipeline by stage</CardTitle>
        <CardDescription>
          {usdWhole.format(total)} in tracked deals. Select a stage to filter the list.
        </CardDescription>
        {selected && (
          <CardAction>
            <Button variant="ghost" size="sm" onClick={() => onSelect(null)}>
              Show all stages
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        <ol className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {stages.map((stage, index) => {
            const active = selected === stage.stage;
            const dimmed = selected !== null && !active;
            return (
              <li key={stage.stage} className="min-w-0">
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => onSelect(active ? null : stage.stage)}
                  className={cn(
                    "flex h-full w-full flex-col gap-3 rounded-lg border p-3 text-left transition-colors outline-none hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50",
                    active && "border-primary bg-primary/5 hover:bg-primary/10",
                    dimmed && "opacity-60",
                  )}
                >
                  <span className="flex items-center justify-between gap-2 text-sm">
                    <span className="font-medium">
                      <span className="mr-1.5 text-muted-foreground tabular-nums">{index + 1}</span>
                      {stage.stage}
                    </span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {stage.count} {stage.count === 1 ? "deal" : "deals"}
                    </span>
                  </span>
                  <span className="text-xl font-semibold">{usdCompact.format(stage.value)}</span>
                  <span className="h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                    <span
                      className="block h-full rounded-full bg-primary"
                      style={{ width: `${(stage.value / max) * 100}%` }}
                    />
                  </span>
                  <span
                    className={cn(
                      "flex items-center gap-1 text-xs",
                      stage.atRisk ? "text-destructive" : "text-muted-foreground",
                    )}
                  >
                    {stage.atRisk > 0 && <CircleAlertIcon className="size-3.5" aria-hidden="true" />}
                    {stage.atRisk ? `${stage.atRisk} at risk` : "None at risk"}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
