"use client";

import { useState } from "react";
import { MapPinIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import { deliveryDraftSchema, fieldErrors, type FieldErrors } from "../schemas/map-delivery.schema";
import type { DeliveryDraft, FleetState, LngLat } from "../types/map-delivery";
import { addMinutes, formatClock, parcelsOnBoard, statusLabels, suggestVan } from "../utils/map-delivery";

type NewDeliveryDialogProps = {
  state: FleetState;
  position: LngLat | null;
  onClose: () => void;
  onSubmit: (draft: DeliveryDraft) => void;
};

export function NewDeliveryDialog({ state, position, onClose, onSubmit }: NewDeliveryDialogProps) {
  const [recipient, setRecipient] = useState("");
  const [merchant, setMerchant] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [windowStart, setWindowStart] = useState(() => addMinutes(state.now, 40));
  const [parcels, setParcels] = useState(1);
  const [coldChain, setColdChain] = useState(false);
  const [vanId, setVanId] = useState<string | null>(
    () => (position ? suggestVan(state, position, 1)?.id : undefined) ?? null,
  );
  const [errors, setErrors] = useState<FieldErrors<DeliveryDraft>>({});
  const candidates = state.vans.filter(
    (van) =>
      ["en-route", "loading", "at-depot"].includes(van.status) && (!coldChain || van.body === "reefer"),
  );

  function submit() {
    const parsed = deliveryDraftSchema.safeParse({
      recipient,
      merchant,
      address,
      note,
      windowStart,
      parcels,
      coldChain,
      vanId: vanId ?? "",
      position,
    });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    onSubmit(parsed.data as DeliveryDraft);
  }

  return (
    <Dialog open={!!position} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New delivery</DialogTitle>
          <DialogDescription className="flex items-center gap-1">
            <MapPinIcon className="size-3.5" />
            {position ? `${position[1].toFixed(4)}, ${position[0].toFixed(4)}` : ""} · 2-hour window from{" "}
            {formatClock(windowStart)}
          </DialogDescription>
        </DialogHeader>
        <FieldGroup className="gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="nd-recipient">Recipient</FieldLabel>
              <Input id="nd-recipient" value={recipient} onChange={(event) => setRecipient(event.target.value)} aria-invalid={!!errors.recipient} />
              <FieldError>{errors.recipient}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="nd-merchant">Merchant</FieldLabel>
              <Input id="nd-merchant" value={merchant} onChange={(event) => setMerchant(event.target.value)} aria-invalid={!!errors.merchant} />
              <FieldError>{errors.merchant}</FieldError>
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="nd-address">Address</FieldLabel>
            <Input id="nd-address" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Street and number" aria-invalid={!!errors.address} />
            <FieldError>{errors.address}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="nd-note">Note</FieldLabel>
            <Textarea id="nd-note" rows={2} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Leave with reception, ring twice…" />
            <FieldError>{errors.note}</FieldError>
          </Field>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field>
              <FieldLabel htmlFor="nd-window">Window start</FieldLabel>
              <Input id="nd-window" type="time" value={windowStart} onChange={(event) => setWindowStart(event.target.value)} aria-invalid={!!errors.windowStart} />
              <FieldError>{errors.windowStart}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="nd-parcels">Parcels</FieldLabel>
              <Input id="nd-parcels" type="number" min={1} max={40} value={parcels} onChange={(event) => setParcels(Number(event.target.value))} aria-invalid={!!errors.parcels} />
              <FieldError>{errors.parcels}</FieldError>
            </Field>
            <Field className="justify-end">
              <FieldLabel className="items-center font-normal">
                <Checkbox
                  checked={coldChain}
                  onCheckedChange={(checked) => {
                    setColdChain(checked === true);
                    setVanId(null);
                  }}
                />
                Cold chain
              </FieldLabel>
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="nd-van">Van</FieldLabel>
            <Select value={vanId} onValueChange={(value) => setVanId(value)}>
              <SelectTrigger id="nd-van" className="w-full" aria-invalid={!!errors.vanId}>
                <SelectValue placeholder="Pick a van" />
              </SelectTrigger>
              <SelectContent>
                {candidates.map((van) => (
                  <SelectItem key={van.id} value={van.id}>
                    {van.name} · {statusLabels[van.status]} · {parcelsOnBoard(van, state.stops)}/{van.capacity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError>{errors.vanId}</FieldError>
          </Field>
        </FieldGroup>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>Add to route</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
