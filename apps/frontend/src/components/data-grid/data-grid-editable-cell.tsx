"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { cn } from "@/lib/utils";

type EditableCellProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "date";
  options?: readonly { value: string; label: string }[];
  error?: string;
  dirty?: boolean;
  children?: ReactNode;
};

/** Edits a controlled draft; saving the dataset belongs to the feature. */
export function DataGridEditableCell({
  label,
  value,
  onChange,
  type = "text",
  options,
  error,
  dirty,
  children,
}: EditableCellProps) {
  const [editing, setEditing] = useState(false);
  const [original, setOriginal] = useState(value);
  const trigger = useRef<HTMLDivElement | null>(null);
  const restoreFocus = useRef(false);
  const errorId = useId();

  useEffect(() => {
    if (!editing && restoreFocus.current) {
      trigger.current?.focus();
      restoreFocus.current = false;
    }
  }, [editing]);

  const editorProps = {
    value,
    autoFocus: true,
    "aria-label": label,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? errorId : undefined,
    onBlur: () => setEditing(false),
    onKeyDown: (
      event: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
      if (event.nativeEvent.isComposing) return;
      if (event.key === "Escape" || event.key === "Enter") {
        event.preventDefault();
        if (event.key === "Escape") onChange(original);
        restoreFocus.current = true;
        setEditing(false);
      }
    },
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => onChange(event.target.value),
  };

  return (
    <div
      className={cn(
        "min-w-32 rounded-md",
        dirty && "bg-yellow-100/70 ring-1 ring-yellow-300/60 dark:bg-yellow-400/10 dark:ring-yellow-400/25",
      )}
    >
      {editing ? (
        options ? (
          <NativeSelect {...editorProps} className="w-full">
            {options.map((option) => (
              <NativeSelectOption key={option.value} value={option.value}>
                {option.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        ) : (
          <Input
            {...editorProps}
            type={type}
            className={type === "email" ? "min-w-60" : "min-w-40"}
          />
        )
      ) : (
        <div
          ref={trigger}
          role="button"
          tabIndex={0}
          className="flex min-h-8 w-full cursor-text items-center rounded-sm px-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Edit ${label}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onClick={() => {
            setOriginal(value);
            setEditing(true);
          }}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing) return;
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setOriginal(value);
              setEditing(true);
            }
          }}
        >
          <span>{children ?? (value || "—")}</span>
        </div>
      )}
      {error && (
        <p
          id={errorId}
          className="max-w-64 px-2 py-1 text-xs whitespace-normal text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}
