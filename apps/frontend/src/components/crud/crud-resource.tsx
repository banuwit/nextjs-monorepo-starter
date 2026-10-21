"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CrudDialog } from "./crud-dialog";
import { CrudInlinePanel } from "./crud-inline-panel";
import { CrudPage } from "./crud-page";
import { CrudSheet } from "./crud-sheet";
import { CrudList, type CrudColumn, type CrudFilter } from "./crud-list";
import type { CrudFormProps, CrudRecord } from "./crud-form";

type Panel<T> = { mode: "create" } | { mode: "view" | "edit"; record: T };
export function CrudResource<T extends CrudRecord>({
  title,
  heading,
  parent,
  description,
  pattern,
  basePath,
  rows,
  ready,
  error,
  reload,
  columns,
  filters,
  label,
  form,
  onSave,
  onDelete,
}: {
  title: string;
  heading?: string;
  parent?: { label: string; href: string };
  description?: string;
  pattern: "page" | "dialog" | "sheet" | "inline";
  basePath?: string;
  rows: T[];
  ready: boolean;
  error: string;
  reload: () => void;
  columns: CrudColumn<T>[];
  filters?: CrudFilter<T>[];
  label: (row: T) => string;
  form: (props: CrudFormProps<T>) => ReactNode;
  onSave: (record: T, isNew: boolean, expectedUpdatedAt?: string) => boolean;
  onDelete: (record: T) => boolean;
}) {
  const [panel, setPanel] = useState<Panel<T> | null>(null);
  const [pendingDelete, setPendingDelete] = useState<T | null>(null);
  const [dirty, setDirty] = useState(false);
  const [discard, setDiscard] = useState(false);
  const [notice, setNotice] = useState("");
  const returnFocus = useRef<HTMLElement | null>(null);
  const newButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!panel && pattern === "inline") returnFocus.current?.focus();
  }, [panel, pattern]);
  function open(next: Panel<T>) {
    if (dirty) return;
    returnFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : newButton.current;
    reload();
    setDirty(false);
    setPanel(next);
  }
  function dismiss() {
    setDirty(false);
    setPanel(null);
  }
  function close() {
    if (dirty) setDiscard(true);
    else dismiss();
  }
  const panelTitle = `${panel?.mode === "create" ? "Tambah" : panel?.mode === "edit" ? "Edit" : "Detail"} ${title.toLowerCase()}`;
  const panelDescription =
    panel?.mode === "view"
      ? "Informasi lengkap data yang dipilih."
      : "Lengkapi informasi berikut. Tanda * wajib diisi.";
  const content =
    panel?.mode === "view" ? (
      <div className="flex flex-col gap-6">
        <dl className="grid gap-4">
          {columns.map((column) => (
            <div key={column.key} className="flex flex-col gap-1">
              <dt className="text-xs text-muted-foreground">{column.label}</dt>
              <dd className="break-words text-sm">
                {column.render
                  ? column.render(panel.record)
                  : String(column.value(panel.record))}
              </dd>
            </div>
          ))}
          <div>
            <dt className="text-xs text-muted-foreground">
              Terakhir diperbarui
            </dt>
            <dd className="text-sm">
              {new Date(panel.record.updatedAt).toLocaleString("id-ID")}
            </dd>
          </div>
        </dl>
        <Button
          className={
            pattern === "inline"
              ? "min-h-11 touch-manipulation md:min-h-8"
              : undefined
          }
          onClick={() => setPanel({ mode: "edit", record: panel.record })}
        >
          Edit {title.toLowerCase()}
        </Button>
      </div>
    ) : panel ? (
      form({
        layout: pattern === "inline" ? "panel" : "default",
        heading: panelTitle,
        record: panel.mode === "edit" ? panel.record : undefined,
        onSave: (record, original) => {
          if (!onSave(record, panel.mode === "create", original?.updatedAt))
            return false;
          setNotice(`${title} “${label(record)}” berhasil disimpan.`);
          dismiss();
          return true;
        },
        onCancel: close,
        onDirty: () => setDirty(true),
        error,
      })
    ) : null;
  return (
    <CrudPage
      title={heading ?? title}
      parent={parent}
      sidePanel={
        pattern === "inline" && panel ? (
          <CrudInlinePanel
            title={panelTitle}
            actions={
              panel.mode === "view" ? (
                <Button variant="outline" onClick={close}>
                  Batal
                </Button>
              ) : undefined
            }
          >
            <div
              className={
                panel.mode === "view" ? "p-4 md:p-6" : "h-full min-h-0"
              }
              key={panel.mode + ("record" in panel ? panel.record.id : "new")}
            >
              {content}
            </div>
          </CrudInlinePanel>
        ) : undefined
      }
      actions={
        pattern === "page" ? (
          <Button
            nativeButton={false}
            render={<Link href={`${basePath}/new`} />}
          >
            <PlusIcon data-icon="inline-start" />
            Tambah {title.toLowerCase()}
          </Button>
        ) : (
          <Button
            ref={newButton}
            disabled={!ready || !!panel}
            onClick={() => open({ mode: "create" })}
          >
            <PlusIcon data-icon="inline-start" />
            Tambah {title.toLowerCase()}
          </Button>
        )
      }
    >
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="flex flex-wrap items-center justify-between gap-2">
            {error}
            <Button variant="outline" size="sm" onClick={reload}>
              Coba muat ulang
            </Button>
          </AlertDescription>
        </Alert>
      )}
      <p
        role="status"
        className={notice ? "text-sm text-primary-text" : "sr-only"}
      >
        {notice}
      </p>
      <CrudList
        title={title}
        rows={ready ? rows : []}
        columns={columns}
        filters={filters}
        loading={!ready && !error}
        label={label}
        basePath={basePath}
        onView={(row) => open({ mode: "view", record: row })}
        onEdit={(row) => open({ mode: "edit", record: row })}
        onDelete={(row) => {
          reload();
          setPendingDelete(row);
        }}
      />
      {pattern === "dialog" && (
        <CrudDialog
          open={!!panel}
          onOpenChange={(open) => {
            if (!open) close();
          }}
          title={panelTitle}
          description={panelDescription}
          finalFocus={returnFocus}
        >
          <div
            key={
              panel?.mode +
              (panel && "record" in panel ? panel.record.id : "new")
            }
          >
            {content}
          </div>
        </CrudDialog>
      )}
      {pattern === "sheet" && (
        <CrudSheet
          open={!!panel}
          onOpenChange={(open) => {
            if (!open) close();
          }}
          title={panelTitle}
          description={panelDescription}
          finalFocus={returnFocus}
        >
          <div
            className="overflow-y-auto p-6"
            key={
              panel?.mode +
              (panel && "record" in panel ? panel.record.id : "new")
            }
          >
            {content}
          </div>
        </CrudSheet>
      )}
      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <AlertDialogContent finalFocus={newButton}>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus {title.toLowerCase()}?</AlertDialogTitle>
            <AlertDialogDescription>
              “{pendingDelete ? label(pendingDelete) : ""}” akan dihapus dari
              browser ini. Data yang masih digunakan tidak dapat dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => {
                if (pendingDelete && onDelete(pendingDelete)) {
                  setNotice(`${title} berhasil dihapus.`);
                  setPendingDelete(null);
                }
              }}
            >
              Hapus
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={discard} onOpenChange={setDiscard}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Buang perubahan?</AlertDialogTitle>
            <AlertDialogDescription>
              Perubahan yang belum disimpan akan hilang.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Lanjut mengedit</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => {
                setDiscard(false);
                dismiss();
              }}
            >
              Buang perubahan
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CrudPage>
  );
}
