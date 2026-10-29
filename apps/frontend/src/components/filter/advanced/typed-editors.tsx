"use client";

import { useId, useState, type KeyboardEvent, type ReactNode } from "react";

import type { FilterEditorProps } from "@/components/reui/filters/filters-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/* Typed values in shadcn inputs (pola `c-filters-9`). */

const PANEL = "flex w-64 flex-col gap-2 p-2";
const FOOTER = "flex items-center justify-end gap-1.5 pt-1";
const HELPER = "text-xs text-muted-foreground";

const toNumber = (raw: string): number | undefined => {
  const parsed = Number(raw.replace(/[.,\s]/g, ""));
  return raw.trim() === "" || Number.isNaN(parsed) ? undefined : parsed;
};

/** Escape cancels without closing the whole bar. */
const escapeCancels = (event: KeyboardEvent, cancel: () => void) => {
  if (event.key !== "Escape") return;
  event.preventDefault();
  event.stopPropagation();
  cancel();
};

/** An amount box with a currency prefix and unit suffix; two boxes for ranges. */
export function createAmountEditor({
  prefix,
  suffix,
}: {
  prefix: string;
  suffix: string;
}) {
  function AmountEditor({
    value,
    onValueChange,
    commit,
    cancel,
    labels,
    field,
    operator,
    autoFocusProps,
  }: FilterEditorProps<number | number[]>) {
    const dual = operator.arity === "range";
    const tuple = Array.isArray(value) ? value : [];
    const single = typeof value === "number" ? value : undefined;
    const [from, setFrom] = useState(() =>
      String((dual ? tuple[0] : single) ?? ""),
    );
    const [to, setTo] = useState(() => (dual ? String(tuple[1] ?? "") : ""));

    const draft = (low: string, high: string) => {
      if (!dual) return toNumber(low);
      const start = toNumber(low);
      const end = toNumber(high);
      return start === undefined || end === undefined
        ? undefined
        : [start, end];
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        commit(draft(from, to));
      }
      escapeCancels(event, cancel);
    };

    const amount = (children: ReactNode) => (
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>{prefix}</InputGroupText>
        </InputGroupAddon>
        {children}
        <InputGroupAddon align="inline-end">
          <InputGroupText>{suffix}</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    );

    return (
      <div className={PANEL}>
        {amount(
          <InputGroupInput
            {...autoFocusProps}
            inputMode="numeric"
            value={from}
            aria-label={dual ? labels.rangeFrom(field.label) : field.label}
            placeholder={field.placeholder}
            onChange={(event) => {
              setFrom(event.target.value);
              onValueChange(draft(event.target.value, to));
            }}
            onKeyDown={onKeyDown}
          />,
        )}
        {dual && (
          <>
            <span className={cn(HELPER, "ps-1")}>{labels.rangeSeparator}</span>
            {amount(
              <InputGroupInput
                inputMode="numeric"
                value={to}
                aria-label={labels.rangeTo(field.label)}
                onChange={(event) => {
                  setTo(event.target.value);
                  onValueChange(draft(from, event.target.value));
                }}
                onKeyDown={onKeyDown}
              />,
            )}
          </>
        )}
        <div className={FOOTER}>
          <Button variant="ghost" size="sm" onClick={cancel}>
            {labels.discard}
          </Button>
          <Button size="sm" onClick={() => commit(draft(from, to))}>
            {labels.apply}
          </Button>
        </div>
      </div>
    );
  }

  return AmountEditor;
}

/** Free terms pasted one per line; ⌘/Ctrl + Enter applies. */
export function TermListEditor({
  value,
  onValueChange,
  commit,
  cancel,
  autoFocusProps,
  labels,
  field,
}: FilterEditorProps<string[]>) {
  const [text, setText] = useState(() =>
    Array.isArray(value) ? value.join("\n") : "",
  );
  const hintId = useId();
  const parse = (raw: string) =>
    raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

  return (
    <div className={PANEL}>
      <Textarea
        {...autoFocusProps}
        rows={4}
        value={text}
        aria-label={field.label}
        aria-describedby={hintId}
        placeholder={field.placeholder}
        onChange={(event) => {
          setText(event.target.value);
          onValueChange(parse(event.target.value));
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            commit(parse(text));
          }
          escapeCancels(event, cancel);
        }}
      />
      <span id={hintId} className={HELPER}>
        Satu nilai per baris
      </span>
      <div className={FOOTER}>
        <Button variant="ghost" size="sm" onClick={cancel}>
          {labels.discard}
        </Button>
        <Button size="sm" onClick={() => commit(parse(text))}>
          {labels.apply}
        </Button>
      </div>
    </div>
  );
}

/** A 6-character code in OTP slots; commits once every slot is filled. */
export function CodeEditor({
  value,
  onValueChange,
  commit,
  field,
  autoFocusProps,
}: FilterEditorProps<string>) {
  return (
    <div className="p-2">
      <InputOTP
        {...autoFocusProps}
        maxLength={6}
        value={typeof value === "string" ? value : ""}
        aria-label={field.label}
        inputMode="text"
        pattern="^[a-zA-Z0-9]*$"
        onChange={(next) => onValueChange(next.toUpperCase())}
        onComplete={(next: string) => commit(next.toUpperCase())}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
}

const DOMAIN = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i;

/** A domain that cannot be applied until it has a dot. */
export function DomainEditor({
  value,
  onValueChange,
  commit,
  cancel,
  labels,
  field,
  autoFocusProps,
}: FilterEditorProps<string>) {
  const [text, setText] = useState(() =>
    typeof value === "string" ? value : "",
  );
  const hintId = useId();
  const invalid = text.trim() !== "" && !DOMAIN.test(text.trim());
  const submit = () => {
    if (invalid || text.trim() === "") return;
    commit(text.trim().toLowerCase());
  };

  return (
    <div className={PANEL}>
      <Input
        {...autoFocusProps}
        value={text}
        aria-label={field.label}
        aria-invalid={invalid}
        aria-describedby={hintId}
        placeholder={field.placeholder}
        onChange={(event) => {
          setText(event.target.value);
          onValueChange(event.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            submit();
          }
          escapeCancels(event, cancel);
        }}
      />
      <span
        id={hintId}
        aria-live="polite"
        className={cn(HELPER, invalid && "text-destructive")}
      >
        {invalid ? "Butuh titik, misalnya acme.co.id" : "contoh: acme.co.id"}
      </span>
      <div className={FOOTER}>
        <Button variant="ghost" size="sm" onClick={cancel}>
          {labels.discard}
        </Button>
        <Button size="sm" disabled={invalid} onClick={submit}>
          {labels.apply}
        </Button>
      </div>
    </div>
  );
}
