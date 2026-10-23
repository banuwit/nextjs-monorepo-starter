import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { users } from "@/mocks/user.mock";
import { RowUserTable } from "./row-user-table";

export function RowTablePage() {
  return (
    <AppBody>
      <PageHeading
        title="Row Editable Table"
        currentPage="Row Editable Table"
      />
      <Card>
        <CardHeader>
          <CardTitle>User profiles</CardTitle>
          <CardDescription>
            Klik Edit untuk mengubah satu baris, lalu Save atau Cancel.
            Duplicate membuat draft user baru yang perlu email unik. Aksi baris
            lain terkunci selama mengedit. Perubahan hanya disimpan lokal dan
            kembali ke data contoh saat reload.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RowUserTable users={users} />
        </CardContent>
      </Card>
    </AppBody>
  );
}
