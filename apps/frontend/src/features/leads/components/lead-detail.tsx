"use client";

import { CheckIcon, LockIcon, PencilIcon, Trash2Icon, TrophyIcon, XCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Lead, Pipeline } from "../types/leads";
import { canMoveLead, findStage, movementRuleLabels, openStages } from "../utils/lead-movement";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  leadPriorities,
  leadSources,
} from "../utils/leads";
import { StageBadge, StageDot } from "./stage-badge";

const DAY = 86_400_000;

function durationLabel(from: string, to: string | undefined) {
  if (!to) return null;
  const days = Math.round((Date.parse(to) - Date.parse(from)) / DAY);
  return days < 1 ? "< 1 hari" : `${days} hari`;
}

export function LeadDetail({
  lead,
  pipeline,
  onMove,
  onEdit,
  onDelete,
}: {
  lead: Lead;
  pipeline: Pipeline;
  onMove: (lead: Lead, stageId: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const current = findStage(pipeline, lead.stageId);
  const open = openStages(pipeline);
  const visited = new Set(lead.history.map((move) => move.stageId));
  const currentIndex = open.findIndex((stage) => stage.id === lead.stageId);
  const won = pipeline.stages.find((stage) => stage.kind === "won");
  const lost = pipeline.stages.find((stage) => stage.kind === "lost");
  const history = lead.history
    .map((move, index) => ({ move, next: lead.history[index + 1] }))
    .reverse();

  const info = [
    ["Kontak", lead.name],
    ["Email", lead.email],
    ["Telepon", lead.phone],
    ["Penanggung jawab", lead.owner],
    ["Sumber", leadSources[lead.source]],
    ["Prioritas", leadPriorities[lead.priority]],
    ["Perkiraan closing", formatDate(lead.expectedClose)],
    ["Pipeline", `${pipeline.name} · ${movementRuleLabels[pipeline.movement]}`],
  ] as const;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-2xl font-semibold tracking-tight tabular-nums">
              {formatCurrency(lead.value)}
            </p>
            {current && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <StageBadge stage={current} />
                {current.kind === "open" && <span>Peluang {current.probability}%</span>}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {won && (
              <Button
                size="sm"
                variant="outline"
                disabled={!canMoveLead(pipeline, lead, won.id).ok}
                onClick={() => onMove(lead, won.id)}
              >
                <TrophyIcon data-icon="inline-start" />
                {won.name}
              </Button>
            )}
            {lost && (
              <Button
                size="sm"
                variant="outline"
                disabled={!canMoveLead(pipeline, lead, lost.id).ok}
                onClick={() => onMove(lead, lost.id)}
              >
                <XCircleIcon data-icon="inline-start" />
                {lost.name}
              </Button>
            )}
          </div>
        </div>

        {current?.kind === "lost" && lead.lostReason && (
          <p className="rounded-lg border bg-muted/50 px-3 py-2 text-sm">
            <span className="font-medium">Alasan kalah:</span> {lead.lostReason}
          </p>
        )}

        <section aria-labelledby="lead-stages" className="flex flex-col gap-3">
          <h3 id="lead-stages" className="text-sm font-medium">
            Tahap pipeline
          </h3>
          <ol className="flex flex-col gap-1.5">
            {open.map((stage, index) => {
              const isCurrent = stage.id === lead.stageId;
              const done =
                !isCurrent &&
                (currentIndex === -1 ? visited.has(stage.id) : index < currentIndex);
              const check = canMoveLead(pipeline, lead, stage.id);
              return (
                <li key={stage.id}>
                  <button
                    type="button"
                    disabled={!check.ok}
                    onClick={() => onMove(lead, stage.id)}
                    title={check.ok ? `Pindahkan ke ${stage.name}` : check.reason}
                    aria-current={isCurrent ? "step" : undefined}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                      "enabled:hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-not-allowed",
                      isCurrent && "border-ring bg-primary/5 font-medium",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full border text-[0.625rem] tabular-nums",
                        done && "border-transparent bg-primary text-primary-foreground",
                        isCurrent && "border-ring text-primary-text",
                      )}
                    >
                      {done ? <CheckIcon className="size-3" /> : index + 1}
                    </span>
                    <span className="flex-1 truncate">{stage.name}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {stage.probability}%
                    </span>
                    {!check.ok && !isCurrent && (
                      <LockIcon aria-label="Terkunci" className="size-3.5 text-muted-foreground" />
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
          <p className="text-xs text-muted-foreground">
            {pipeline.movement === "sequential"
              ? "Pipeline berurutan: tahap yang terkunci tidak dapat dituju dari posisi saat ini."
              : "Pipeline bebas: lead dapat dipindah ke tahap mana pun."}
          </p>
        </section>

        <section aria-labelledby="lead-info" className="flex flex-col gap-3">
          <h3 id="lead-info" className="text-sm font-medium">
            Informasi
          </h3>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            {info.map(([label, value]) => (
              <div key={label} className="flex min-w-0 flex-col gap-0.5">
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="truncate">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="lead-history" className="flex flex-col gap-3">
          <h3 id="lead-history" className="text-sm font-medium">
            Riwayat pergerakan
          </h3>
          <ol className="relative flex flex-col gap-4 border-l pl-5">
            {history.map(({ move, next }, index) => {
              const stage = findStage(pipeline, move.stageId);
              const duration = durationLabel(move.at, next?.at);
              return (
                <li key={`${move.stageId}-${move.at}-${index}`} className="relative">
                  {stage && (
                    <StageDot
                      stage={stage}
                      className="absolute top-1.5 -left-[1.5625rem] size-2.5 ring-4 ring-background"
                    />
                  )}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                    <span className="font-medium">{stage?.name ?? move.stageId}</span>
                    {index === 0 && (
                      <span className="text-xs text-muted-foreground">· saat ini</span>
                    )}
                    {duration && (
                      <span className="text-xs text-muted-foreground">· {duration} di tahap ini</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <time dateTime={move.at}>{formatDateTime(move.at)}</time> oleh {move.by}
                  </p>
                  {move.note && <p className="mt-1 text-sm">{move.note}</p>}
                </li>
              );
            })}
          </ol>
        </section>
      </div>
      <div className="flex justify-between gap-2 border-t p-4">
        <Button variant="outline" onClick={onDelete}>
          <Trash2Icon data-icon="inline-start" />
          Hapus
        </Button>
        <Button onClick={onEdit}>
          <PencilIcon data-icon="inline-start" />
          Edit lead
        </Button>
      </div>
    </div>
  );
}
