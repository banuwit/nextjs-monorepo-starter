import type { Lead, Pipeline, PipelineStage } from "../types/leads";

export type MoveCheck = { ok: true } | { ok: false; reason: string };

export const movementRuleLabels = {
  flexible: "Bebas",
  sequential: "Berurutan",
} as const;

export const movementRuleDescriptions = {
  flexible: "Lead boleh dipindah ke tahap mana pun, termasuk melompati tahap.",
  sequential:
    "Maju atau mundur satu tahap. Won hanya dari tahap terakhir, Lost dari tahap mana pun, dan lead tertutup dibuka kembali ke tahap terakhirnya.",
} as const;

export function openStages(pipeline: Pipeline): PipelineStage[] {
  return pipeline.stages.filter((stage) => stage.kind === "open");
}

export function findStage(pipeline: Pipeline, stageId: string) {
  return pipeline.stages.find((stage) => stage.id === stageId);
}

/** The open stage a closed lead was in right before it was won or lost. */
export function lastOpenStageId(pipeline: Pipeline, lead: Lead) {
  const open = new Set(openStages(pipeline).map((stage) => stage.id));
  return [...lead.history].reverse().find((move) => open.has(move.stageId))
    ?.stageId;
}

/** Whether the pipeline's movement rule lets `lead` move to `targetId`. */
export function canMoveLead(
  pipeline: Pipeline,
  lead: Lead,
  targetId: string,
): MoveCheck {
  const current = findStage(pipeline, lead.stageId);
  const target = findStage(pipeline, targetId);
  if (!current || !target) return { ok: false, reason: "Tahap tidak dikenal." };
  if (current.id === target.id)
    return { ok: false, reason: `Lead sudah berada di ${target.name}.` };
  if (pipeline.movement === "flexible") return { ok: true };

  const open = openStages(pipeline);
  if (current.kind !== "open") {
    const reopenId = lastOpenStageId(pipeline, lead) ?? open[0]?.id;
    if (target.id === reopenId) return { ok: true };
    const reopen = reopenId ? findStage(pipeline, reopenId) : undefined;
    return {
      ok: false,
      reason: `Lead ${current.name} hanya dapat dibuka kembali ke ${reopen?.name ?? "tahap awal"}.`,
    };
  }

  if (target.kind === "lost") return { ok: true };
  const from = open.findIndex((stage) => stage.id === current.id);
  if (target.kind === "won") {
    const last = open.at(-1);
    return from === open.length - 1
      ? { ok: true }
      : {
          ok: false,
          reason: `${target.name} hanya dapat dicapai dari tahap ${last?.name ?? "terakhir"}.`,
        };
  }
  const to = open.findIndex((stage) => stage.id === target.id);
  return Math.abs(to - from) === 1
    ? { ok: true }
    : {
        ok: false,
        reason: `Pipeline berurutan: dari ${current.name} hanya bisa ke tahap sebelah, bukan ${target.name}.`,
      };
}

/** Returns a moved copy with the transition appended to its history. */
export function moveLead(
  lead: Lead,
  targetId: string,
  { at, by, note, lostReason }: { at: string; by: string; note?: string; lostReason?: string },
): Lead {
  return {
    ...lead,
    stageId: targetId,
    lostReason,
    history: [...lead.history, { stageId: targetId, at, by, note }],
  };
}
