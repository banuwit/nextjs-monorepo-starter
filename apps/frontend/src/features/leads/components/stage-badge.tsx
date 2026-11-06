import { cn } from "@/lib/utils";
import type { PipelineStage } from "../types/leads";
import { stageTones } from "../utils/stage-tones";

export function StageDot({ stage, className }: { stage: PipelineStage; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("size-2 shrink-0 rounded-full", stageTones[stage.tone].dot, className)}
    />
  );
}

export function StageBadge({ stage }: { stage: PipelineStage }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center gap-1.5 rounded-full px-2 text-xs font-medium whitespace-nowrap",
        stageTones[stage.tone].soft,
      )}
    >
      <StageDot stage={stage} className="size-1.5" />
      {stage.name}
    </span>
  );
}
