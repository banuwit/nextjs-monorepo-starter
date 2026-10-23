"use client";

import { Check, Copy, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type RowEditActionsProps = {
  label: string;
  editing: boolean;
  disabled?: boolean;
  saveDisabled?: boolean;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onSave: () => void;
  onCancel: () => void;
};

export function DataGridRowEditActions({
  label,
  editing,
  disabled,
  saveDisabled,
  onEdit,
  onDuplicate,
  onDelete,
  onSave,
  onCancel,
}: RowEditActionsProps) {
  return (
    <div className="flex items-center gap-1">
      {editing ? (
        <>
          <Button
            size="icon-sm"
            title="Save"
            aria-label={`Save ${label}`}
            disabled={saveDisabled}
            onClick={onSave}
          >
            <Check />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            title="Cancel"
            aria-label={`Cancel ${label}`}
            onClick={onCancel}
          >
            <X />
          </Button>
        </>
      ) : (
        <>
          <Button
            size="icon-sm"
            variant="ghost"
            title="Edit"
            aria-label={`Edit ${label}`}
            disabled={disabled}
            onClick={onEdit}
          >
            <Pencil />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            title="Duplicate"
            aria-label={`Duplicate ${label}`}
            disabled={disabled}
            onClick={onDuplicate}
          >
            <Copy />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            title="Delete"
            aria-label={`Delete ${label}`}
            disabled={disabled}
            onClick={onDelete}
          >
            <Trash2 />
          </Button>
        </>
      )}
    </div>
  );
}
