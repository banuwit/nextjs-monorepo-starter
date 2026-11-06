"use client";

import { useRef, useState, type FormEvent } from "react";
import { ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import {
  createPipelineFormSchema,
  type PipelineFormValues,
} from "../schemas/pipeline-form.schema";
import type { MovementRule } from "../types/leads";
import { fieldErrors, focusFirstInvalid } from "../utils/form-errors";
import { movementRuleDescriptions, movementRuleLabels } from "../utils/lead-movement";

type FieldName = keyof PipelineFormValues;
const fieldOrder = ["name", "description", "movement", "stages", "wonLabel", "lostLabel"] as const;

type PipelineFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingNames: readonly string[];
  onCreate: (values: PipelineFormValues) => void;
};

export function PipelineFormDialog({ open, onOpenChange, ...props }: PipelineFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Pipeline baru</DialogTitle>
          <DialogDescription>
            Susun tahap dan aturan pergerakan sendiri. Tahap menang dan kalah ditambahkan di akhir.
          </DialogDescription>
        </DialogHeader>
        {open && <PipelineForm {...props} onCancel={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

function PipelineForm({
  existingNames,
  onCreate,
  onCancel,
}: Omit<PipelineFormDialogProps, "open" | "onOpenChange"> & { onCancel: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [movement, setMovement] = useState<MovementRule>("sequential");
  const [stagesText, setStagesText] = useState("Initial\nQualified\nProposal\nNegotiation");
  const [wonLabel, setWonLabel] = useState("Won");
  const [lostLabel, setLostLabel] = useState("Lost");
  const preview = stagesText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const result = createPipelineFormSchema(existingNames).safeParse(
      Object.fromEntries(fieldOrder.map((key) => [key, data.get(key) ?? ""])),
    );
    if (!result.success) {
      const next = fieldErrors<FieldName>(result.error);
      setErrors(next);
      focusFirstInvalid(formRef.current, fieldOrder, next);
      return;
    }
    onCreate(result.data);
  }

  const invalid = (name: FieldName) => ({
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `pipeline-${name}-error` : undefined,
  });
  const error = (name: FieldName) =>
    errors[name] && <FieldError id={`pipeline-${name}-error`}>{errors[name]}</FieldError>;

  return (
    <form ref={formRef} noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FieldGroup className="max-h-[60dvh] gap-4 overflow-y-auto p-0.5">
        <Field data-invalid={Boolean(errors.name)}>
          <FieldLabel htmlFor="pipeline-name">Nama pipeline</FieldLabel>
          <Input id="pipeline-name" name="name" placeholder="mis. Renewal" autoComplete="off" {...invalid("name")} />
          {error("name")}
        </Field>
        <Field data-invalid={Boolean(errors.description)}>
          <FieldLabel htmlFor="pipeline-description">Deskripsi</FieldLabel>
          <Input id="pipeline-description" name="description" {...invalid("description")} />
          {error("description")}
        </Field>
        <Field data-invalid={Boolean(errors.movement)}>
          <FieldLabel htmlFor="pipeline-movement">Aturan pergerakan</FieldLabel>
          <NativeSelect
            id="pipeline-movement"
            name="movement"
            className="w-full"
            value={movement}
            onChange={(event) => setMovement(event.target.value as MovementRule)}
            {...invalid("movement")}
          >
            {(Object.keys(movementRuleLabels) as MovementRule[]).map((rule) => (
              <NativeSelectOption key={rule} value={rule}>
                {movementRuleLabels[rule]}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <FieldDescription>{movementRuleDescriptions[movement]}</FieldDescription>
          {error("movement")}
        </Field>
        <Field data-invalid={Boolean(errors.stages)}>
          <FieldLabel htmlFor="pipeline-stages">Tahap open (satu per baris, berurutan)</FieldLabel>
          <Textarea
            id="pipeline-stages"
            name="stages"
            rows={5}
            value={stagesText}
            onChange={(event) => setStagesText(event.target.value)}
            {...invalid("stages")}
          />
          <FieldDescription>2–8 tahap. Peluang closing dibagi rata dari 10% hingga 85%.</FieldDescription>
          {error("stages")}
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field data-invalid={Boolean(errors.wonLabel)}>
            <FieldLabel htmlFor="pipeline-won">Label menang</FieldLabel>
            <Input id="pipeline-won" name="wonLabel" value={wonLabel} onChange={(event) => setWonLabel(event.target.value)} {...invalid("wonLabel")} />
            {error("wonLabel")}
          </Field>
          <Field data-invalid={Boolean(errors.lostLabel)}>
            <FieldLabel htmlFor="pipeline-lost">Label kalah</FieldLabel>
            <Input id="pipeline-lost" name="lostLabel" value={lostLabel} onChange={(event) => setLostLabel(event.target.value)} {...invalid("lostLabel")} />
            {error("lostLabel")}
          </Field>
        </div>
        <div className="flex flex-col gap-2 rounded-lg border bg-muted/40 p-3">
          <p className="text-xs font-medium text-muted-foreground">Pratinjau alur</p>
          <ol className="flex flex-wrap items-center gap-1 text-xs">
            {preview.map((stage, index) => (
              <li key={`${stage}-${index}`} className="flex items-center gap-1">
                <span className="rounded-md border bg-background px-2 py-0.5">{stage}</span>
                <ChevronRightIcon aria-hidden className="size-3 text-muted-foreground" />
              </li>
            ))}
            <li className="rounded-md bg-emerald-100 px-2 py-0.5 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300">
              {wonLabel.trim() || "Won"}
            </li>
            <li className="text-muted-foreground">/</li>
            <li className="rounded-md bg-rose-100 px-2 py-0.5 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300">
              {lostLabel.trim() || "Lost"}
            </li>
          </ol>
        </div>
      </FieldGroup>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit">Buat pipeline</Button>
      </DialogFooter>
    </form>
  );
}
