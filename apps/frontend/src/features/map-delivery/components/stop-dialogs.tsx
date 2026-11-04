"use client";

import { useState } from "react";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  failStopSchema,
  fieldErrors,
  reassignSchema,
  rescheduleSchema,
  type FieldErrors,
} from "../schemas/map-delivery.schema";
import type { FailReason, FleetState, Stop, TimeWindow } from "../types/map-delivery";
import {
  addMinutes,
  failReasonLabels,
  formatWindow,
  parcelsOnBoard,
  statusLabels,
} from "../utils/map-delivery";

type FailStopSheetProps = {
  stop: Stop | null;
  onClose: () => void;
  onSubmit: (reason: FailReason, note: string) => void;
};

export function FailStopSheet({ stop, onClose, onSubmit }: FailStopSheetProps) {
  const [reason, setReason] = useState<FailReason>("no-answer");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<FieldErrors<{ reason: string; note: string }>>({});

  function submit() {
    const parsed = failStopSchema.safeParse({ reason, note });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    onSubmit(parsed.data.reason, parsed.data.note);
    setNote("");
    setErrors({});
  }

  return (
    <Sheet open={!!stop} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Mark stop as failed</SheetTitle>
          <SheetDescription>
            {stop ? `${stop.recipient} · ${stop.address}` : ""}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-5 px-4">
          <Field>
            <FieldLabel>Reason</FieldLabel>
            <RadioGroup value={reason} onValueChange={(value) => setReason(value as FailReason)}>
              {(Object.keys(failReasonLabels) as FailReason[]).map((key) => (
                <FieldLabel key={key} className="items-center font-normal">
                  <RadioGroupItem value={key} /> {failReasonLabels[key]}
                </FieldLabel>
              ))}
            </RadioGroup>
            <FieldError>{errors.reason}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="fail-note">Note for the retry</FieldLabel>
            <Textarea
              id="fail-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Gate code, neighbour, best time to retry…"
              rows={3}
            />
            <FieldError>{errors.note}</FieldError>
          </Field>
        </div>
        <SheetFooter className="flex-row justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={submit}>Mark failed</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

type RescheduleDialogProps = {
  stop: Stop | null;
  onClose: () => void;
  onSubmit: (window: TimeWindow) => void;
};

export function RescheduleDialog({ stop, onClose, onSubmit }: RescheduleDialogProps) {
  const [start, setStart] = useState(() => (stop ? addMinutes(stop.window.end, 0) : "15:00"));
  const [end, setEnd] = useState(() => (stop ? addMinutes(stop.window.end, 120) : "17:00"));
  const [errors, setErrors] = useState<FieldErrors<{ windowStart: string; windowEnd: string }>>({});

  function submit() {
    const parsed = rescheduleSchema.safeParse({ windowStart: start, windowEnd: end });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    onSubmit({ start: parsed.data.windowStart, end: parsed.data.windowEnd });
    setErrors({});
  }

  return (
    <Dialog open={!!stop} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move to a later window</DialogTitle>
          <DialogDescription>
            {stop ? `${stop.recipient} is currently planned for ${formatWindow(stop.window)}.` : ""}
          </DialogDescription>
        </DialogHeader>
        <FieldGroup className="grid grid-cols-2 gap-3">
          <Field>
            <FieldLabel htmlFor="window-start">New start</FieldLabel>
            <Input id="window-start" type="time" value={start} onChange={(event) => setStart(event.target.value)} />
            <FieldError>{errors.windowStart}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="window-end">New end</FieldLabel>
            <Input id="window-end" type="time" value={end} onChange={(event) => setEnd(event.target.value)} />
            <FieldError>{errors.windowEnd}</FieldError>
          </Field>
        </FieldGroup>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>Reschedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type ReassignDialogProps = {
  state: FleetState;
  stop: Stop | null;
  onClose: () => void;
  onSubmit: (vanId: string) => void;
};

export function ReassignDialog({ state, stop, onClose, onSubmit }: ReassignDialogProps) {
  const [vanId, setVanId] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors<{ vanId: string }>>({});
  const candidates = state.vans.filter(
    (van) =>
      van.id !== stop?.vanId &&
      ["en-route", "loading", "at-depot"].includes(van.status) &&
      (!stop?.coldChain || van.body === "reefer"),
  );

  function submit() {
    const parsed = reassignSchema.safeParse({ vanId: vanId ?? "" });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    onSubmit(parsed.data.vanId);
    setVanId(null);
    setErrors({});
  }

  return (
    <Dialog open={!!stop} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hand to another van</DialogTitle>
          <DialogDescription>
            {stop?.coldChain
              ? "This is a cold-chain parcel, so only reefers are listed."
              : "The receiving van gets the stop at the end of its route."}
          </DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel htmlFor="reassign-van">Van</FieldLabel>
          <Select value={vanId} onValueChange={(value) => setVanId(value)}>
            <SelectTrigger id="reassign-van" className="w-full">
              <SelectValue placeholder="Pick a van" />
            </SelectTrigger>
            <SelectContent>
              {candidates.map((van) => {
                const driver = state.drivers.find((item) => item.id === van.driverId);
                const load = parcelsOnBoard(van, state.stops);
                return (
                  <SelectItem key={van.id} value={van.id}>
                    {van.name} · {driver?.name ?? "Unassigned"} · {statusLabels[van.status]} · {load}/{van.capacity}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <FieldError>{errors.vanId}</FieldError>
        </Field>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={!candidates.length}>Reassign</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
