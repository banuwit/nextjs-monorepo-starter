"use client";

import { CalendarIcon, MoreHorizontalIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Lead, Pipeline } from "../types/leads";
import {
  daysInStage,
  formatCurrency,
  formatDate,
  initials,
  leadPriorities,
  leadSources,
} from "../utils/leads";
import { LeadMoveMenu } from "./lead-move-menu";

export function LeadCard({
  lead,
  pipeline,
  today,
  onOpen,
  onMove,
  isOverlay = false,
}: {
  lead: Lead;
  pipeline: Pipeline;
  today: string;
  onOpen?: (lead: Lead) => void;
  onMove?: (lead: Lead, stageId: string) => void;
  isOverlay?: boolean;
}) {
  const days = daysInStage(lead, today);
  const stage = pipeline.stages.find((item) => item.id === lead.stageId);
  const overdue =
    stage?.kind === "open" && today !== "" && lead.expectedClose < today;

  return (
    <article
      className={cn(
        "flex flex-col gap-3 rounded-lg border bg-card p-3 text-card-foreground shadow-xs",
        isOverlay && "w-72 rotate-1 shadow-lg",
      )}
    >
      <div className="flex items-start gap-1">
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => onOpen?.(lead)}
            className="block max-w-full truncate rounded-sm text-left text-sm font-medium underline-offset-4 hover:text-primary-text hover:underline focus-visible:outline-2 focus-visible:outline-ring"
          >
            {lead.company}
          </button>
          <p className="truncate text-xs text-muted-foreground">{lead.name}</p>
        </div>
        {onMove && (
          <LeadMoveMenu
            pipeline={pipeline}
            lead={lead}
            onMove={onMove}
            trigger={
              <Button
                variant="ghost"
                size="icon-xs"
                className="-mr-1 text-muted-foreground"
                aria-label={`Pindahkan tahap ${lead.company}`}
              >
                <MoreHorizontalIcon />
              </Button>
            }
          />
        )}
      </div>
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-sm font-semibold tabular-nums">{formatCurrency(lead.value)}</p>
        <Badge variant={lead.priority === "high" ? "outline" : "secondary"}>
          {leadPriorities[lead.priority]}
        </Badge>
      </div>
      {stage?.kind === "lost" && lead.lostReason && (
        <p className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
          {lead.lostReason}
        </p>
      )}
      <div className="flex items-center justify-between gap-2 border-t pt-2.5 text-xs text-muted-foreground">
        <div className="flex min-w-0 items-center gap-1.5">
          <Avatar className="size-5">
            <AvatarFallback className="text-[0.625rem]">{initials(lead.owner)}</AvatarFallback>
          </Avatar>
          <span className="truncate">{leadSources[lead.source]}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2 tabular-nums">
          {days !== null && stage?.kind === "open" && (
            <span title="Lama di tahap ini">{days} hr</span>
          )}
          <span className={cn("flex items-center gap-1", overdue && "font-medium text-destructive")}>
            <CalendarIcon className="size-3" />
            {formatDate(lead.expectedClose)}
          </span>
        </div>
      </div>
    </article>
  );
}
