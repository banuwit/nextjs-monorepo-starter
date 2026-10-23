import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { User } from "@/mocks/user.mock";

export function TreeUserDetails({
  user,
  manager,
  onClose,
}: {
  user: User;
  manager?: User;
  onClose: () => void;
}) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user.name}</DialogTitle>
          <DialogDescription>{user.id} · User profile</DialogDescription>
        </DialogHeader>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3">
          {[
            ["Email", user.email],
            ["Gender", user.gender],
            ["Role", user.role],
            ["Join date", user.joinDate],
            ["Status", user.status],
            ["Manager", manager?.name ?? "No manager"],
          ].map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="break-all">{value}</dd>
            </div>
          ))}
        </dl>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}
