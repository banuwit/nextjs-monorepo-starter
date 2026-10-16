"use client";
import type { ComponentProps } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CrudSheet } from "./crud-sheet";

export function CrudDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  finalFocus,
}: ComponentProps<typeof CrudSheet>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        finalFocus={finalFocus}
        className="max-h-[90dvh] overflow-y-auto p-6 sm:max-w-lg"
      >
        <DialogHeader className="pr-6">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
