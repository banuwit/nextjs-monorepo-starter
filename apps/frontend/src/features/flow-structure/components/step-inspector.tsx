"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FlowApp, FlowStep, RunResult } from "../types/flow";
import { AppIcon } from "./flow-elements";

const apps: FlowApp[] = [
  "Stripe",
  "Neon",
  "Claude",
  "ClickUp",
  "Resend",
  "Custom Code",
  "Slack",
];

export function StepInspector({
  step,
  result,
  nextCount,
  running,
  startEditing = false,
  onSave,
  onDelete,
  onClose,
}: {
  step: FlowStep;
  result: RunResult;
  nextCount: number;
  running: boolean;
  startEditing?: boolean;
  onSave: (step: FlowStep) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const [editing, setEditing] = useState(
    startEditing || step.title === "New step",
  );
  const [title, setTitle] = useState(step.title);
  const [detail, setDetail] = useState(step.detail);
  const [app, setApp] = useState(step.app);
  return (
    <div className="flex flex-col gap-5 p-4">
      <div className="flex items-center gap-3">
        <AppIcon app={step.app} />
        <div>
          <h2 className="font-semibold">{step.title}</h2>
          <p className="text-xs text-muted-foreground">
            {step.app} · {step.id}
          </p>
        </div>
      </div>
      {editing ? (
        <form
          className="flex flex-col gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            if (!title.trim()) return;
            onSave({
              ...step,
              title: title.trim(),
              detail: detail.trim(),
              app,
              fixture: app === step.app ? step.fixture : undefined,
            });
            setEditing(false);
          }}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="step-title">Title</FieldLabel>
              <Input
                id="step-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={80}
                disabled={running}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="step-detail">Detail</FieldLabel>
              <Input
                id="step-detail"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                maxLength={160}
                disabled={running}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="step-app">App</FieldLabel>
              <Select
                value={app}
                onValueChange={(value) => {
                  if (value) setApp(value as FlowApp);
                }}
                disabled={running}
              >
                <SelectTrigger id="step-app" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {apps.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setTitle(step.title);
                setDetail(step.detail);
                setApp(step.app);
                setEditing(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={running || !title.trim()}>
              Save step
            </Button>
          </div>
        </form>
      ) : (
        <>
          <h3 className="text-sm font-medium">Step</h3>
          <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-4 text-sm">
            <dt className="text-muted-foreground">Detail</dt>
            <dd>{step.detail}</dd>
            <dt className="text-muted-foreground">App</dt>
            <dd>{step.app}</dd>
            <dt className="text-muted-foreground">Next steps</dt>
            <dd>{nextCount}</dd>
            <dt className="text-muted-foreground">Last run</dt>
            <dd>{result.status}</dd>
            <dt className="text-muted-foreground">Result</dt>
            <dd>
              {result.detail}
              {result.metric && ` · ${result.metric}`}
            </dd>
          </dl>
          <Button
            variant="outline"
            onClick={() => {
              setTitle(step.title);
              setDetail(step.detail);
              setApp(step.app);
              setEditing(true);
            }}
            disabled={running}
          >
            Edit step
          </Button>
          {step.parent && (
            <Button variant="destructive" onClick={onDelete} disabled={running}>
              Delete step
            </Button>
          )}
        </>
      )}
      <Button variant="ghost" onClick={onClose}>
        Close details
      </Button>
    </div>
  );
}
