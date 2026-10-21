"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, PencilIcon } from "lucide-react";
import { CrudPage } from "@/components/crud/crud-page";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useCrudExamples } from "@/mocks/use-crud-examples";
import { ExampleForm } from "./example-form";
import { exampleColumns } from "./example-page";

const basePath = "/crud/new-page";

export function ExampleRecordPage({
  mode,
  id,
}: {
  mode: "create" | "view" | "edit";
  id?: string;
}) {
  const { data, ready, error, reload, commit } = useCrudExamples();
  const router = useRouter();
  const [dirty, setDirty] = useState(false);
  const [discard, setDiscard] = useState(false);
  const record = data.find((item) => item.id === id);
  const title =
    mode === "create"
      ? "Tambah parameter contoh"
      : mode === "edit"
        ? "Edit parameter contoh"
        : "Detail parameter contoh";
  const back = mode === "edit" ? `${basePath}/${id}` : basePath;

  useEffect(() => {
    if (!dirty) return;
    const prevent = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", prevent);
    return () => window.removeEventListener("beforeunload", prevent);
  }, [dirty]);

  function cancel() {
    if (dirty) setDiscard(true);
    else router.push(back);
  }

  return (
    <CrudPage
      title={title}
      parent={{ label: "New Page", href: basePath }}
      actions={
        <Button variant="outline" onClick={cancel}>
          <ArrowLeftIcon data-icon="inline-start" />
          Kembali
        </Button>
      }
    >
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="flex flex-col items-start gap-2">
            {error}
            <Button variant="outline" onClick={reload}>
              Coba muat ulang
            </Button>
          </AlertDescription>
        </Alert>
      )}
      {!ready && !dirty ? (
        <Skeleton className="h-72 max-w-2xl" />
      ) : mode !== "create" && !record && !dirty ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Parameter contoh tidak ditemukan</EmptyTitle>
            <EmptyDescription>
              Data mungkin sudah dihapus dari browser ini.
            </EmptyDescription>
          </EmptyHeader>
          <Button nativeButton={false} render={<Link href={basePath} />}>
            Kembali ke daftar
          </Button>
        </Empty>
      ) : (
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>
              {mode === "view" ? record?.key : "Informasi parameter"}
            </CardTitle>
            <CardDescription>
              {mode === "view"
                ? "Detail data contoh yang digunakan oleh keempat pola CRUD."
                : "Lengkapi key, tipe, nilai, dan status. Tanda * wajib diisi."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mode === "view" && record ? (
              <div className="flex flex-col gap-6">
                <dl className="grid gap-5 sm:grid-cols-2">
                  {exampleColumns.map((column) => (
                    <div key={column.key}>
                      <dt className="mb-1 text-xs text-muted-foreground">
                        {column.label}
                      </dt>
                      <dd className="break-words text-sm">
                        {column.render
                          ? column.render(record)
                          : String(column.value(record))}
                      </dd>
                    </div>
                  ))}
                  <div>
                    <dt className="mb-1 text-xs text-muted-foreground">
                      Dibuat
                    </dt>
                    <dd className="text-sm">
                      {new Date(record.createdAt).toLocaleDateString("id-ID")}
                    </dd>
                  </div>
                  <div>
                    <dt className="mb-1 text-xs text-muted-foreground">
                      Diperbarui
                    </dt>
                    <dd className="text-sm">
                      {new Date(record.updatedAt).toLocaleDateString("id-ID")}
                    </dd>
                  </div>
                </dl>
                <Button
                  className="w-fit"
                  nativeButton={false}
                  render={<Link href={`${basePath}/${record.id}/edit`} />}
                >
                  <PencilIcon data-icon="inline-start" />
                  Edit parameter
                </Button>
              </div>
            ) : (
              <ExampleForm
                key={id ?? "new"}
                record={mode === "edit" ? record : undefined}
                error={error}
                onDirty={() => setDirty(true)}
                onCancel={cancel}
                onSave={(next, original) => {
                  if (
                    !commit({
                      type: "save",
                      record: next,
                      isNew: mode === "create",
                      expectedUpdatedAt: original?.updatedAt,
                    })
                  )
                    return false;
                  setDirty(false);
                  router.push(`${basePath}/${next.id}`);
                  return true;
                }}
              />
            )}
          </CardContent>
        </Card>
      )}
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
                setDirty(false);
                setDiscard(false);
                router.push(back);
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
