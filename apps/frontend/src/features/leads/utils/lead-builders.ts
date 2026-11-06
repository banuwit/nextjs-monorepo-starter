import type { LeadFormValues } from "../schemas/lead-form.schema";
import type { PipelineFormValues } from "../schemas/pipeline-form.schema";
import type { Lead, Pipeline } from "../types/leads";
import { openStageTones } from "./stage-tones";

function slug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "stage";
}

/** Open stages get evenly spaced probabilities from 10% to 85%, then won/lost. */
export function buildPipeline(values: PipelineFormValues, id: string): Pipeline {
  const count = values.stages.length;
  return {
    id,
    name: values.name,
    description: values.description,
    movement: values.movement,
    stages: [
      ...values.stages.map((name, index) => ({
        id: `${slug(name)}-${index + 1}`,
        name,
        kind: "open" as const,
        probability: Math.round(10 + (75 * index) / Math.max(1, count - 1)),
        tone: openStageTones[index % openStageTones.length] ?? "slate",
      })),
      { id: "won", name: values.wonLabel, kind: "won", probability: 100, tone: "emerald" },
      { id: "lost", name: values.lostLabel, kind: "lost", probability: 0, tone: "rose" },
    ],
  };
}

export function buildLead(
  values: LeadFormValues,
  { id, pipelineId, at, by }: { id: string; pipelineId: string; at: string; by: string },
): Lead {
  const { stageId, ...fields } = values;
  return {
    ...fields,
    id,
    pipelineId,
    stageId,
    history: [{ stageId, at, by, note: "Lead dibuat" }],
  };
}

/** Applies edited fields while keeping the stage and its movement history. */
export function updateLeadFields(lead: Lead, values: LeadFormValues): Lead {
  const { stageId: _stageId, ...fields } = values;
  return { ...lead, ...fields };
}
