"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { ArrowUpIcon } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type ChatComposerProps = {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
  label: string;
  placeholder?: string;
  busy?: boolean;
  disabled?: boolean;
  /** Konten di atas textarea, misalnya lampiran yang disiapkan. */
  header?: ReactNode;
  /** Kontrol tambahan di kiri tombol kirim. */
  toolbar?: ReactNode;
  showHint?: boolean;
  className?: string;
};

export function ChatComposer({
  value,
  onValueChange,
  onSubmit,
  label,
  placeholder = "Tanyakan sesuatu…",
  busy = false,
  disabled = false,
  header,
  toolbar,
  showHint = false,
  className,
}: ChatComposerProps) {
  const canSend = !!value.trim() && !busy && !disabled;

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key !== "Enter" ||
      event.shiftKey ||
      event.nativeEvent.isComposing
    )
      return;
    event.preventDefault();
    if (canSend) onSubmit();
  }

  return (
    <form
      data-slot="chat-composer"
      className={cn("w-full", className)}
      onSubmit={(event) => {
        event.preventDefault();
        if (canSend) onSubmit();
      }}
    >
      <InputGroup className="rounded-xl bg-card dark:bg-card">
        {header && (
          <InputGroupAddon align="block-start" className="flex-wrap">
            {header}
          </InputGroupAddon>
        )}
        <InputGroupTextarea
          aria-label={label}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          rows={2}
          className="max-h-48 min-h-14 px-3"
          onChange={(event) => onValueChange(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <InputGroupAddon align="block-end" className="gap-1">
          {toolbar}
          <div className="ml-auto flex items-center gap-2">
            {showHint && (
              <span className="hidden items-center gap-1 text-xs font-normal sm:flex">
                <Kbd>Enter</Kbd> kirim · <Kbd>Shift</Kbd>+<Kbd>Enter</Kbd> baris
                baru
              </span>
            )}
            {/* aria-disabled: atribut disabled akan memicu has-disabled pada InputGroup dan meredupkan seluruh composer. */}
            <InputGroupButton
              type="submit"
              variant="default"
              size="icon-sm"
              className="rounded-full aria-disabled:pointer-events-none aria-disabled:opacity-50"
              aria-disabled={!canSend || undefined}
              aria-label="Kirim pesan"
            >
              {busy ? <Spinner /> : <ArrowUpIcon />}
            </InputGroupButton>
          </div>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
