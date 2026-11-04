"use client";

import { useState } from "react";
import { AlertTriangleIcon, PencilIcon, XIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { stepOwners } from "@/mocks/process.mock";
import type { Graph, StepData, StepIcon, StepNode } from "../types/process";
import { categoryLabels, StepStatus, stepIconLabels, stepIcons } from "./process-step";

type Props = {
  node: StepNode;
  graph: Graph;
  /** Position of this step in the replay order, 1-based; undefined when unreachable. */
  order?: number;
  editing: boolean;
  locked: boolean;
  onEdit: () => void;
  onClose: () => void;
  onSave: (data: StepData) => void;
};

export function StepInspector(props: Props) {
  const mobile = useIsMobile();
  if (mobile)
    return (
      <Sheet
        open
        onOpenChange={(open) => {
          if (!open) props.onClose();
        }}
      >
        <SheetContent
          className="w-full! max-w-sm! overflow-y-auto"
          showCloseButton={false}
        >
          <SheetTitle className="sr-only">Step inspector</SheetTitle>
          <SheetDescription className="sr-only">
            View and edit the selected process step.
          </SheetDescription>
          <InspectorContent {...props} />
        </SheetContent>
      </Sheet>
    );
  return (
    <aside
      aria-label="Step inspector"
      className="absolute right-3 top-3 bottom-20 z-10 w-72 overflow-y-auto rounded-xl border bg-background shadow-sm"
    >
      <InspectorContent {...props} />
    </aside>
  );
}

function InspectorContent({
  node,
  graph,
  order,
  editing,
  locked,
  onEdit,
  onClose,
  onSave,
}: Props) {
  const [draft, setDraft] = useState(node.data);
  const Icon = stepIcons[node.data.icon];
  const incoming = graph.edges.filter((edge) => edge.target === node.id);
  const outgoing = graph.edges.filter((edge) => edge.source === node.id);
  const nameOf = (id: string) =>
    graph.nodes.find((item) => item.id === id)?.data.title ?? id;
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <Icon className="size-4" />
        <h2 className="flex-1 text-sm font-semibold">
          {categoryLabels[node.data.category]}
        </h2>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Close inspector"
          onClick={onClose}
        >
          <XIcon />
        </Button>
      </div>
      <Separator />
      {editing ? (
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (draft.title.trim())
              onSave({
                ...draft,
                title: draft.title.trim(),
                detail: draft.detail.trim(),
                stage: draft.stage.trim() || node.data.stage,
                duration: draft.duration.trim() || "—",
              });
          }}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="step-title">Step name</FieldLabel>
              <Input
                id="step-title"
                required
                maxLength={100}
                value={draft.title}
                disabled={locked}
                onChange={(event) =>
                  setDraft({ ...draft, title: event.target.value })
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="step-detail">Detail</FieldLabel>
              <Input
                id="step-detail"
                maxLength={200}
                value={draft.detail}
                disabled={locked}
                onChange={(event) =>
                  setDraft({ ...draft, detail: event.target.value })
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="step-stage">Stage</FieldLabel>
              <Input
                id="step-stage"
                maxLength={40}
                value={draft.stage}
                disabled={locked}
                onChange={(event) =>
                  setDraft({ ...draft, stage: event.target.value })
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="step-owner">Owner</FieldLabel>
              <NativeSelect
                id="step-owner"
                className="w-full"
                value={draft.owner}
                disabled={locked}
                onChange={(event) =>
                  setDraft({ ...draft, owner: event.target.value })
                }
              >
                {stepOwners.map((owner) => (
                  <NativeSelectOption key={owner} value={owner}>
                    {owner}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
            <Field>
              <FieldLabel htmlFor="step-icon">Icon</FieldLabel>
              <NativeSelect
                id="step-icon"
                className="w-full"
                value={draft.icon}
                disabled={locked}
                onChange={(event) =>
                  setDraft({ ...draft, icon: event.target.value as StepIcon })
                }
              >
                {(Object.keys(stepIconLabels) as StepIcon[]).map((icon) => (
                  <NativeSelectOption key={icon} value={icon}>
                    {stepIconLabels[icon]}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
            <Field>
              <FieldLabel htmlFor="step-duration">Recorded duration</FieldLabel>
              <Input
                id="step-duration"
                maxLength={20}
                placeholder="e.g. 4m 20s"
                value={draft.duration}
                disabled={locked}
                onChange={(event) =>
                  setDraft({ ...draft, duration: event.target.value })
                }
              />
            </Field>
            {node.data.category !== "start" && (
              <Field>
                <FieldLabel htmlFor="step-outcome">Outcome on replay</FieldLabel>
                <NativeSelect
                  id="step-outcome"
                  className="w-full"
                  value={draft.outcome ?? "Done"}
                  disabled={locked}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      outcome: event.target.value === "Failed" ? "Failed" : undefined,
                    })
                  }
                >
                  <NativeSelectOption value="Done">Completes</NativeSelectOption>
                  <NativeSelectOption value="Failed">Fails here</NativeSelectOption>
                </NativeSelect>
              </Field>
            )}
          </FieldGroup>
          <Button type="submit" disabled={locked || !draft.title.trim()}>
            Save changes
          </Button>
        </form>
      ) : (
        <>
          <section className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold">Step</h3>
            <h4 className="text-sm font-medium">{node.data.title}</h4>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-xs">
              <dt className="text-muted-foreground">Detail</dt>
              <dd className="break-words text-right">
                {node.data.detail || "—"}
              </dd>
              <dt className="text-muted-foreground">Stage</dt>
              <dd className="text-right">{node.data.stage}</dd>
              <dt className="text-muted-foreground">Owner</dt>
              <dd className="text-right">{node.data.owner}</dd>
              <dt className="text-muted-foreground">Order</dt>
              <dd className="text-right">{order ? `#${order} of ${graph.nodes.length}` : "Not reached"}</dd>
              <dt className="text-muted-foreground">Comes from</dt>
              <dd className="text-right">
                {incoming.length
                  ? incoming.map((edge) => nameOf(edge.source)).join(", ")
                  : "—"}
              </dd>
              <dt className="text-muted-foreground">Goes to</dt>
              <dd className="text-right">
                {outgoing.length
                  ? outgoing
                      .map((edge) =>
                        edge.label ? `${nameOf(edge.target)} (${String(edge.label)})` : nameOf(edge.target),
                      )
                      .join(", ")
                  : "—"}
              </dd>
            </dl>
          </section>
          <Separator />
          <section className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold">This run</h3>
            <dl className="grid grid-cols-2 items-center gap-3 text-xs">
              <dt className="text-muted-foreground">Status</dt>
              <dd className="justify-self-end">
                <StepStatus status={node.data.status} />
              </dd>
              <dt className="text-muted-foreground">Duration</dt>
              <dd className="text-right tabular-nums">{node.data.duration}</dd>
              <dt className="text-muted-foreground">Order</dt>
              <dd className="text-right font-mono">#HR-20481</dd>
            </dl>
          </section>
          <Button variant="outline" disabled={locked} onClick={onEdit}>
            <PencilIcon data-icon="inline-start" />
            Edit step
          </Button>
        </>
      )}
      {node.data.category !== "start" && incoming.length === 0 && (
        <Alert>
          <AlertTriangleIcon />
          <AlertDescription>
            Nothing leads to this step, so the process never reaches it.
          </AlertDescription>
        </Alert>
      )}
      <p className="text-xs text-muted-foreground">
        Demo process · Durations are recorded sample values.
      </p>
    </div>
  );
}
