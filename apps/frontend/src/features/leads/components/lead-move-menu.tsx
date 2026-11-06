"use client";

import type { ReactElement } from "react";
import { CheckIcon, LockIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Lead, Pipeline } from "../types/leads";
import { canMoveLead, movementRuleLabels } from "../utils/lead-movement";
import { StageDot } from "./stage-badge";

/** Keyboard/pointer alternative to drag & drop; locked stages follow the movement rule. */
export function LeadMoveMenu({
  pipeline,
  lead,
  trigger,
  onMove,
  align = "end",
}: {
  pipeline: Pipeline;
  lead: Lead;
  trigger: ReactElement;
  onMove: (lead: Lead, stageId: string) => void;
  align?: "start" | "end";
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={trigger} />
      <DropdownMenuContent align={align} className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            Pindahkan ke · {movementRuleLabels[pipeline.movement]}
          </DropdownMenuLabel>
          {pipeline.stages.map((stage, index) => {
            const current = stage.id === lead.stageId;
            const check = canMoveLead(pipeline, lead, stage.id);
            const separator =
              stage.kind !== "open" && pipeline.stages[index - 1]?.kind === "open";
            return (
              <div key={stage.id}>
                {separator && <DropdownMenuSeparator />}
                <DropdownMenuItem
                  disabled={!check.ok}
                  onClick={() => onMove(lead, stage.id)}
                >
                  <StageDot stage={stage} />
                  <span className="flex-1 truncate">{stage.name}</span>
                  {current ? (
                    <CheckIcon aria-label="Tahap saat ini" />
                  ) : !check.ok ? (
                    <LockIcon aria-label="Terkunci aturan pipeline" />
                  ) : null}
                </DropdownMenuItem>
              </div>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
