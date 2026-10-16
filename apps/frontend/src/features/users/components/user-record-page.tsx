"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, PencilIcon } from "lucide-react";
import { CrudPage } from "@/components/crud/crud-page";
import { Button } from "@/components/ui/button";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useCrudData } from "@/mocks/use-crud-data";
import { UserForm } from "./user-form";
import { userColumns } from "./user-page";

export function UserRecordPage({
  mode,
  id,
}: {
  mode: "create" | "view" | "edit";
  id?: string;
}) {
  const { data, ready, error, reload, commit } = useCrudData();
  const router = useRouter();
  const [dirty, setDirty] = useState(false);
  const [discard, setDiscard] = useState(false);
  const user = data.users.find((user) => user.id === id);
  const title =
    mode === "create"
      ? "Tambah user"
      : mode === "edit"
        ? "Edit user"
        : "Detail user";
  const back = mode === "edit" ? `/users/${id}` : "/users";
  useEffect(() => {
    if (!dirty) return;
    const prevent = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
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
      parent={{ label: "User", href: "/users" }}
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
      ) : mode !== "create" && !user && !dirty ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>User tidak ditemukan</EmptyTitle>
            <EmptyDescription>
              Data mungkin sudah dihapus dari browser ini.
            </EmptyDescription>
          </EmptyHeader>
          <Button nativeButton={false} render={<Link href="/users" />}>
            Kembali ke daftar user
          </Button>
        </Empty>
      ) : (
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>
              {mode === "view" ? user?.name : "Informasi user"}
            </CardTitle>
            <CardDescription>
              {mode === "view"
                ? "Detail profil dan akses workspace."
                : "Lengkapi nama, email, role, dan status. Tanda * wajib diisi."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mode === "view" && user ? (
              <div className="flex flex-col gap-6">
                <dl className="grid gap-5 sm:grid-cols-2">
                  {userColumns.map((column) => (
                    <div key={column.key}>
                      <dt className="mb-1 text-xs text-muted-foreground">
                        {column.label}
                      </dt>
                      <dd className="break-words text-sm">
                        {column.render
                          ? column.render(user)
                          : String(column.value(user))}
                      </dd>
                    </div>
                  ))}
                  <div>
                    <dt className="mb-1 text-xs text-muted-foreground">
                      Dibuat
                    </dt>
                    <dd className="text-sm">
                      {new Date(user.createdAt).toLocaleDateString("id-ID")}
                    </dd>
                  </div>
                  <div>
                    <dt className="mb-1 text-xs text-muted-foreground">
                      Diperbarui
                    </dt>
                    <dd className="text-sm">
                      {new Date(user.updatedAt).toLocaleDateString("id-ID")}
                    </dd>
                  </div>
                </dl>
                <Button
                  className="w-fit"
                  nativeButton={false}
                  render={<Link href={`/users/${user.id}/edit`} />}
                >
                  <PencilIcon data-icon="inline-start" />
                  Edit user
                </Button>
              </div>
            ) : (
              <UserForm
                key={id ?? "new"}
                record={mode === "edit" ? user : undefined}
                error={error}
                onDirty={() => setDirty(true)}
                onCancel={cancel}
                onSave={(record, original) => {
                  if (
                    !commit({
                      type: "save",
                      resource: "users",
                      record,
                      isNew: mode === "create",
                      expectedUpdatedAt: original?.updatedAt,
                    })
                  )
                    return false;
                  setDirty(false);
                  router.push(`/users/${record.id}`);
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
