"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { User } from "@/mocks/user.mock";
import { sectionColumns } from "../utils/user-sections";

export function SectionUserDialog({
  user,
  users,
  onClose,
}: {
  user: User;
  users: User[];
  onClose: () => void;
}) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User profile</DialogTitle>
          <DialogDescription>{user.id}</DialogDescription>
        </DialogHeader>
        <dl className="space-y-3">
          {sectionColumns
            .filter(({ id }) => id !== "no")
            .map(({ id, label }) => (
              <div key={id} className="grid grid-cols-[6rem_1fr] gap-3 text-sm">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="break-words">{user[id as keyof User]}</dd>
              </div>
            ))}
          <div className="grid grid-cols-[6rem_1fr] gap-3 text-sm">
            <dt className="text-muted-foreground">Manager</dt>
            <dd>
              {users.find((item) => item.id === user.managerId)?.name ??
                "No manager"}
            </dd>
          </div>
        </dl>
      </DialogContent>
    </Dialog>
  );
}
