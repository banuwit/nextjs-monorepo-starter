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
import type { Graph, StepData, StepNode } from "../types/process";
import { StepStatus, stepIcons } from "./process-step";

type Props = {
  node: StepNode;
  graph: Graph;
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
            View and edit the selected workflow step.
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
  editing,
  locked,
  onEdit,
  onClose,
  onSave,
}: Props) {
  const [draft, setDraft] = useState(node.data);
  const Icon = stepIcons[node.data.icon];
  const incoming = graph.edges.filter((edge) => edge.target === node.id).length;
  const outgoing = graph.edges.filter((edge) => edge.source === node.id).length;
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <Icon className="size-4" />
        <h2 className="flex-1 text-sm font-semibold capitalize">
          {node.data.category}
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
              <dt className="text-muted-foreground">Category</dt>
              <dd className="text-right capitalize">{node.data.category}</dd>
              <dt className="text-muted-foreground">Owner</dt>
              <dd className="text-right">{node.data.owner}</dd>
              <dt className="text-muted-foreground">Incoming</dt>
              <dd className="text-right">{incoming}</dd>
              <dt className="text-muted-foreground">Outgoing</dt>
              <dd className="text-right">{outgoing}</dd>
            </dl>
          </section>
          <Separator />
          <section className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold">Last Run</h3>
            <dl className="grid grid-cols-2 items-center gap-3 text-xs">
              <dt className="text-muted-foreground">Status</dt>
              <dd className="justify-self-end">
                <StepStatus status={node.data.status} />
              </dd>
              <dt className="text-muted-foreground">Duration</dt>
              <dd className="text-right">{node.data.duration}</dd>
              <dt className="text-muted-foreground">Run</dt>
              <dd className="text-right font-mono">run_3f9a1c</dd>
            </dl>
          </section>
          <Button variant="outline" disabled={locked} onClick={onEdit}>
            <PencilIcon data-icon="inline-start" />
            Edit step
          </Button>
        </>
      )}
      {node.data.category !== "trigger" && incoming === 0 && (
        <Alert>
          <AlertTriangleIcon />
          <AlertDescription>
            This step has no incoming connection and will not run.
          </AlertDescription>
        </Alert>
      )}
      <p className="text-xs text-muted-foreground">
        Demo workflow · Last run values are sample data.
      </p>
    </div>
  );
}
