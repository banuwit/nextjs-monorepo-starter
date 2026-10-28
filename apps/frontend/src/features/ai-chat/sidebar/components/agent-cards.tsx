"use client";

import { useState } from "react";
import {
  CheckIcon,
  CircleIcon,
  DownloadIcon,
  FileIcon,
  RotateCcwIcon,
  SkipForwardIcon,
  TicketIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  Trace,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace";
import {
  agentArtifacts,
  agentForkChoices,
  agentOwners,
  agentSources,
} from "@/mocks/ai-chat.mock";
import type { AgentTask } from "../hooks/use-agent-task";
import type { PlanStepState } from "../types/agent-task";
import { formatCost, formatTokens, summarizeRun } from "../utils/agent-task";

const accessLabels = { read: "Baca", edit: "Ubah", run: "Jalankan" } as const;

export function BriefCard({ agent }: { agent: AgentTask }) {
  const editable = agent.phase === "brief";
  return (
    <Card size="sm" className="w-full">
      <CardContent className="flex flex-col gap-3">
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-xs font-medium text-muted-foreground">
            Sumber workspace
          </legend>
          {agentSources.map((source) => (
            <div key={source.id} className="flex items-center gap-2">
              <Label className="min-w-0 flex-1 font-normal">
                <Checkbox
                  disabled={!editable}
                  checked={agent.sources.includes(source.id)}
                  onCheckedChange={() => agent.toggleSource(source.id)}
                />
                <span className="truncate">{source.name}</span>
                <span className="text-xs text-muted-foreground">
                  {source.kind}
                </span>
              </Label>
              <Badge variant="outline">{accessLabels[source.access]}</Badge>
            </div>
          ))}
        </fieldset>
        {agent.files.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              File terlampir
            </span>
            {agent.files.map((file) => (
              <Attachment key={file.id} size="sm" className="w-full">
                <AttachmentMedia>
                  <FileIcon />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>{file.name}</AttachmentTitle>
                  <AttachmentDescription>{file.size}</AttachmentDescription>
                </AttachmentContent>
                <AttachmentActions>
                  <AttachmentAction
                    aria-label={`Hapus ${file.name}`}
                    onClick={() => agent.toggleFile(file)}
                  >
                    <XIcon />
                  </AttachmentAction>
                </AttachmentActions>
              </Attachment>
            ))}
          </div>
        )}
      </CardContent>
      {editable && (
        <CardFooter>
          <Button
            size="sm"
            disabled={agent.sources.length === 0}
            onClick={agent.confirmBrief}
          >
            <CheckIcon data-icon="inline-start" />
            Konfirmasi brief
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

function StepIcon({ step }: { step: PlanStepState }) {
  switch (step.status) {
    case "done":
      return <CheckIcon className="text-primary-text" />;
    case "running":
      return <Spinner />;
    case "error":
      return <TriangleAlertIcon />;
    case "skipped":
      return <SkipForwardIcon />;
    default:
      return <CircleIcon />;
  }
}

export function PlanCard({ agent }: { agent: AgentTask }) {
  const planning = agent.phase === "plan";
  const run = summarizeRun(agent.steps);
  const active = agent.steps.filter((step) => step.status !== "skipped");

  return (
    <Card size="sm" className="w-full">
      <CardContent>
        {planning ? (
          <ul className="flex flex-col gap-2.5" aria-label="Langkah rencana">
            {agent.steps.map((step) => (
              <li key={step.id}>
                <Label className="items-start font-normal">
                  <Checkbox
                    className="mt-0.5"
                    checked={step.status !== "skipped"}
                    onCheckedChange={() => agent.toggleSkip(step.id)}
                  />
                  <span className="flex flex-col gap-0.5">
                    <span>{step.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {step.detail}
                      {step.branch && " · cabang"}
                    </span>
                  </span>
                </Label>
              </li>
            ))}
          </ul>
        ) : (
          <Trace aria-label="Progres rencana">
            {agent.steps.map((step) => (
              <div key={step.id} className="flex flex-col gap-1">
                <TraceLine
                  status={
                    step.status === "done"
                      ? undefined
                      : step.status === "skipped"
                        ? "pending"
                        : step.status
                  }
                >
                  <TraceIcon>
                    <StepIcon step={step} />
                  </TraceIcon>
                  <TraceTitle
                    className={
                      step.status === "skipped" ? "line-through" : undefined
                    }
                  >
                    {step.title}
                  </TraceTitle>
                  {step.status === "done" && (
                    <TraceDescription>
                      {(step.runMs / 1000).toLocaleString("id-ID")} dtk ·{" "}
                      {formatTokens(step.tokens)}
                    </TraceDescription>
                  )}
                </TraceLine>
              </div>
            ))}
          </Trace>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="tabular-nums">
          {planning
            ? `${active.length} dari ${agent.steps.length} langkah`
            : `${formatTokens(run.tokens)} · ${formatCost(run.cost)}`}
        </span>
        {planning && (
          <Button
            size="sm"
            disabled={active.length === 0}
            onClick={agent.runPlan}
          >
            Jalankan rencana
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

/** Aksi retry ditempel pada pesan kegagalan karena kartu rencana sudah tergulir ke atas. */
export function RetryAction({ agent }: { agent: AgentTask }) {
  const failed = agent.steps.find((step) => step.status === "error");
  if (!failed) return null;
  return (
    <Button
      size="sm"
      variant="outline"
      className="w-fit"
      onClick={() => agent.retryStep(failed.id)}
    >
      <RotateCcwIcon data-icon="inline-start" />
      Coba lagi
    </Button>
  );
}

export function ForkCard({ agent }: { agent: AgentTask }) {
  const open = agent.phase === "fork";
  return (
    <div
      className="flex flex-col gap-2"
      role="group"
      aria-label="Pilih skenario"
    >
      {agentForkChoices.map((choice) => {
        const chosen = agent.forkChoice === choice.id;
        return (
          <button
            key={choice.id}
            type="button"
            disabled={!open}
            aria-pressed={chosen}
            onClick={() => agent.chooseFork(choice.id)}
            className="flex w-full flex-col items-start gap-0.5 rounded-lg border border-border bg-card p-2.5 text-left text-sm text-card-foreground transition-colors outline-none enabled:hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-60 aria-pressed:border-primary aria-pressed:opacity-100"
          >
            <span className="font-medium">{choice.label}</span>
            <span className="text-xs text-muted-foreground">
              {choice.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function HandoffCard({ agent }: { agent: AgentTask }) {
  const [downloaded, setDownloaded] = useState<string | null>(null);
  const created = agent.phase === "created";

  return (
    <Card size="sm" className="w-full">
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          {agentArtifacts.map((artifact) => (
            <Attachment key={artifact.id} size="sm" className="w-full">
              <AttachmentMedia>
                <FileIcon />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>{artifact.name}</AttachmentTitle>
                <AttachmentDescription>{artifact.size}</AttachmentDescription>
              </AttachmentContent>
              <AttachmentActions>
                <AttachmentAction
                  aria-label={`Unduh ${artifact.name}`}
                  onClick={() => setDownloaded(artifact.name)}
                >
                  <DownloadIcon />
                </AttachmentAction>
              </AttachmentActions>
            </Attachment>
          ))}
          <p
            role="status"
            className="text-xs text-muted-foreground empty:hidden"
          >
            {downloaded &&
              `${downloaded} siap diunduh (simulasi, tidak ada file nyata).`}
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="agent-owner"
            className="text-xs text-muted-foreground"
          >
            Penanggung jawab
          </Label>
          <div className="flex gap-2">
            <Select
              items={agentOwners}
              value={agent.owner}
              onValueChange={(value) => {
                if (value) agent.setOwner(value);
              }}
              disabled={created}
            >
              <SelectTrigger
                id="agent-owner"
                size="sm"
                className="min-w-0 flex-1"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {agentOwners.map((owner) => (
                  <SelectItem key={owner.value} value={owner.value}>
                    {owner.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" disabled={created} onClick={agent.createTask}>
              <TicketIcon data-icon="inline-start" />
              {created ? "Tiket dibuat" : "Buat tiket"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
