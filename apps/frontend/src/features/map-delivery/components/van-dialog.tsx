"use client";

import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fieldErrors, vanDraftSchema, type FieldErrors } from "../schemas/map-delivery.schema";
import type { FleetState, Powertrain, Van, VanBody, VanDraft } from "../types/map-delivery";
import { bodyLabels, powertrainLabels } from "../utils/map-delivery";

export type VanDialogState =
  | { type: "add" }
  | { type: "edit"; van: Van }
  | { type: "retire"; van: Van }
  | null;

type VanDialogProps = {
  state: FleetState;
  dialog: VanDialogState;
  canRetire: boolean;
  onClose: () => void;
  onSave: (draft: VanDraft, vanId?: string) => void;
  onRetire: (vanId: string) => void;
};

export function VanDialog({ state, dialog, canRetire, onClose, onSave, onRetire }: VanDialogProps) {
  if (dialog?.type === "retire") {
    return (
      <AlertDialog open onOpenChange={(open) => !open && onClose()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Retire {dialog.van.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              {canRetire
                ? "The van leaves the dispatch map and the list. Its history stays in Activity."
                : "This van still has open stops. Reassign or finish them before retiring it."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={!canRetire}
              onClick={() => onRetire(dialog.van.id)}
              render={<Button variant="destructive" />}
            >
              Retire van
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  if (!dialog) return null;
  return <VanForm key={dialog.type === "edit" ? dialog.van.id : "add"} state={state} van={dialog.type === "edit" ? dialog.van : undefined} onClose={onClose} onSave={onSave} />;
}

function VanForm({
  state,
  van,
  onClose,
  onSave,
}: {
  state: FleetState;
  van?: Van;
  onClose: () => void;
  onSave: (draft: VanDraft, vanId?: string) => void;
}) {
  const [draft, setDraft] = useState<VanDraft>({
    name: van?.name ?? `HR-${String(state.vans.length + 1).padStart(2, "0")}`,
    plate: van?.plate ?? "",
    driverId: van?.driverId ?? "",
    body: van?.body ?? "cargo-van",
    powertrain: van?.powertrain ?? "ev",
    areaId: van?.areaId ?? "",
    capacity: van?.capacity ?? 120,
  });
  const [errors, setErrors] = useState<FieldErrors<VanDraft>>({});
  const patch = (value: Partial<VanDraft>) => setDraft((current) => ({ ...current, ...value }));

  function submit() {
    const parsed = vanDraftSchema.safeParse(draft);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    onSave(parsed.data, van?.id);
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{van ? `Edit ${van.name}` : "Add a van"}</DialogTitle>
          <DialogDescription>
            {van ? "Changes apply to the live plan right away." : "New vans start at the depot, fully charged."}
          </DialogDescription>
        </DialogHeader>
        <FieldGroup className="gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="van-name">Call sign</FieldLabel>
              <Input id="van-name" value={draft.name} onChange={(event) => patch({ name: event.target.value })} aria-invalid={!!errors.name} />
              <FieldError>{errors.name}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="van-plate">Plate</FieldLabel>
              <Input id="van-plate" value={draft.plate} onChange={(event) => patch({ plate: event.target.value.toUpperCase() })} aria-invalid={!!errors.plate} />
              <FieldError>{errors.plate}</FieldError>
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="van-driver">Driver</FieldLabel>
            <Select value={draft.driverId || null} onValueChange={(value) => patch({ driverId: value ?? "" })}>
              <SelectTrigger id="van-driver" className="w-full" aria-invalid={!!errors.driverId}>
                <SelectValue placeholder="Pick a driver" />
              </SelectTrigger>
              <SelectContent>
                {state.drivers.map((driver) => (
                  <SelectItem key={driver.id} value={driver.id}>{driver.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError>{errors.driverId}</FieldError>
          </Field>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field>
              <FieldLabel htmlFor="van-body">Body</FieldLabel>
              <Select value={draft.body} onValueChange={(value) => patch({ body: value as VanBody })}>
                <SelectTrigger id="van-body" className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(bodyLabels) as VanBody[]).map((key) => (
                    <SelectItem key={key} value={key}>{bodyLabels[key]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="van-powertrain">Powertrain</FieldLabel>
              <Select value={draft.powertrain} onValueChange={(value) => patch({ powertrain: value as Powertrain })}>
                <SelectTrigger id="van-powertrain" className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(powertrainLabels) as Powertrain[]).map((key) => (
                    <SelectItem key={key} value={key}>{powertrainLabels[key]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="van-capacity">Capacity</FieldLabel>
              <Input id="van-capacity" type="number" min={1} max={400} value={draft.capacity} onChange={(event) => patch({ capacity: Number(event.target.value) })} aria-invalid={!!errors.capacity} />
              <FieldError>{errors.capacity}</FieldError>
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="van-area">Area</FieldLabel>
            <Select value={draft.areaId || null} onValueChange={(value) => patch({ areaId: value ?? "" })}>
              <SelectTrigger id="van-area" className="w-full" aria-invalid={!!errors.areaId}>
                <SelectValue placeholder="Pick an area" />
              </SelectTrigger>
              <SelectContent>
                {state.areas.map((area) => (
                  <SelectItem key={area.id} value={area.id}>{area.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError>{errors.areaId}</FieldError>
          </Field>
        </FieldGroup>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>{van ? "Save changes" : "Add van"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
