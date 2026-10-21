"use client";

import { useState } from "react";
import {
  ArrowUpRightIcon,
  CheckIcon,
  CircleIcon,
  DownloadIcon,
  PaperclipIcon,
  PlayIcon,
  StarIcon,
} from "lucide-react";
import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  workflowSteps,
  type WorkflowStep,
} from "@/mocks/timeline-workflow.mock";

const statusLabels = {
  completed: "Completed",
  running: "In progress",
  pending: "Pending",
};

function sampleNote(step: WorkflowStep) {
  return [
    "Demo workflow — sample attachment note",
    `Attachment: ${step.attachment}`,
    `Stage: ${step.title}`,
    `Phase: ${step.phase}`,
    `Status: ${statusLabels[step.status]}`,
    `Owner: ${step.owner}`,
    "",
    step.description,
    "",
    "This is sample data, not the original attachment or a real approval record.",
  ].join("\n");
}

function downloadNote(step: WorkflowStep) {
  const url = URL.createObjectURL(
    new Blob([sampleNote(step)], { type: "text/plain;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `${step.id}-sample.txt`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Rating({ value }: { value: number }) {
  return (
    <span
      className="inline-flex items-center gap-2"
      role="img"
      aria-label={`${value} out of 5 stars`}
    >
      <span className="flex" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((star) => (
          <span key={star} className="relative size-4">
            <StarIcon className="absolute size-4 fill-muted text-muted" />
            <span
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{
                width: `${Math.max(0, Math.min(1, value - star)) * 100}%`,
              }}
            >
              <StarIcon className="size-4 fill-amber-400 text-amber-400" />
            </span>
          </span>
        ))}
      </span>
      <span
        className="text-xs tabular-nums text-muted-foreground"
        aria-hidden="true"
      >
        {value.toFixed(1)}
      </span>
    </span>
  );
}

export function TimelineWorkflowPage() {
  const [selection, setSelection] = useState<{
    step: WorkflowStep;
    attachment: boolean;
  } | null>(null);

  return (
    <AppBody>
      <PageHeading
        title="Timeline Workflow"
        currentPage="Timeline Workflow"
        parents={[{ label: "Dashboard", href: "/dashboard" }]}
      />
      <section
        aria-labelledby="workflow-heading"
        className="min-w-0 rounded-xl border bg-card p-5 text-card-foreground sm:p-8"
      >
        <div className="mb-10 flex flex-col gap-1.5">
          <h2
            id="workflow-heading"
            className="text-lg font-semibold tracking-tight"
          >
            Approval Workflow Timeline
          </h2>
          <p className="text-sm text-muted-foreground">
            Process state from intake to customer notice.
          </p>
        </div>
        <div
          role="region"
          aria-label="Approval workflow stages"
          tabIndex={0}
          className="relative overflow-x-auto overscroll-x-contain rounded-sm pb-3 outline-none snap-x snap-proximity focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ol className="flex w-max min-w-full pb-1">
            {workflowSteps.map((step) => {
              const StatusIcon =
                step.status === "completed"
                  ? CheckIcon
                  : step.status === "running"
                    ? PlayIcon
                    : CircleIcon;
              return (
                <li
                  key={step.id}
                  data-workflow-step={step.id}
                  aria-current={step.status === "running" ? "step" : undefined}
                  className="group w-64 shrink-0 snap-start pr-6 sm:w-72 sm:pr-8"
                >
                  <div
                    className="mb-3 flex items-center gap-2"
                    aria-label={statusLabels[step.status]}
                  >
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-full",
                        step.status === "completed"
                          ? "bg-emerald-500 text-white"
                          : step.status === "running"
                            ? "bg-foreground text-background"
                            : "border bg-muted text-muted-foreground",
                      )}
                    >
                      <StatusIcon className="size-3.5" aria-hidden="true" />
                    </span>
                    <span
                      className="h-px flex-1 bg-border group-last:invisible"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex flex-col items-start gap-2">
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {step.time}
                    </span>
                    <Badge variant="outline">
                      <span
                        aria-hidden="true"
                        className={cn(
                          "size-1.5 rounded-full",
                          step.status === "completed"
                            ? "bg-emerald-500"
                            : step.status === "running"
                              ? "bg-foreground"
                              : "bg-muted-foreground",
                        )}
                      />
                      {step.phase}
                      <span className="sr-only">
                        {" "}
                        · {statusLabels[step.status]}
                      </span>
                    </Badge>
                    <h3 className="text-sm font-medium">{step.title}</h3>
                    <ButtonGroup aria-label={`${step.phase} attachment`}>
                      <Button
                        size="xs"
                        variant="outline"
                        aria-label={`Preview ${step.attachment}`}
                        onClick={() => setSelection({ step, attachment: true })}
                      >
                        <PaperclipIcon
                          data-icon="inline-start"
                          aria-hidden="true"
                        />
                        {step.attachment}
                      </Button>
                      <Button
                        size="icon-xs"
                        variant="outline"
                        aria-label={`Download sample note for ${step.attachment}`}
                        title="Download sample note (.txt)"
                        onClick={() => downloadNote(step)}
                      >
                        <DownloadIcon aria-hidden="true" />
                      </Button>
                    </ButtonGroup>
                    <div className="flex flex-wrap items-center gap-2">
                      <Rating value={step.rating} />
                      <Button
                        size="xs"
                        variant="outline"
                        aria-label={`${step.actionLabel}: ${step.title}`}
                        onClick={() =>
                          setSelection({ step, attachment: false })
                        }
                      >
                        <ArrowUpRightIcon
                          data-icon="inline-start"
                          aria-hidden="true"
                        />
                        {step.actionLabel}
                      </Button>
                    </div>
                    <p className="min-h-10 text-sm leading-5 text-muted-foreground">
                      {step.description}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <Avatar size="sm">
                        <AvatarFallback>
                          {step.owner
                            .split(" ")
                            .map((part) => part[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium">{step.owner}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Demo workflow · Scroll horizontally to explore all 8 stages. Actions
          preview sample details.
        </p>
      </section>
      <Dialog
        open={selection !== null}
        onOpenChange={(open) => {
          if (!open) setSelection(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selection?.attachment
                ? selection.step.attachment
                : selection?.step.title}
            </DialogTitle>
            <DialogDescription>
              Demo workflow · Preview only. No approval or customer notification
              is sent.
            </DialogDescription>
          </DialogHeader>
          {selection && (
            <div className="flex flex-col gap-4">
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
                <dt className="text-muted-foreground">Phase</dt>
                <dd>{selection.step.phase}</dd>
                <dt className="text-muted-foreground">Status</dt>
                <dd>{statusLabels[selection.step.status]}</dd>
                <dt className="text-muted-foreground">Owner</dt>
                <dd>{selection.step.owner}</dd>
                <dt className="text-muted-foreground">Time</dt>
                <dd>{selection.step.time}</dd>
              </dl>
              {selection.attachment ? (
                <pre className="whitespace-pre-wrap break-words rounded-lg bg-muted p-4 text-xs leading-relaxed">
                  {sampleNote(selection.step)}
                </pre>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {selection.step.description}
                </p>
              )}
              <Button
                variant="outline"
                className="self-start"
                onClick={() => downloadNote(selection.step)}
              >
                <DownloadIcon data-icon="inline-start" />
                Download sample note (.txt)
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppBody>
  );
}
