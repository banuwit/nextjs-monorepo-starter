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
      <PageHeading title="Drag & Drop Rows" currentPage="Drag & Drop Rows" />
      <Card>
        <CardHeader>
          <CardTitle>User profiles</CardTitle>
          <CardDescription>
            Geser handle di kiri untuk mengatur urutan {users.length} pengguna
            contoh. Dengan keyboard, tekan Space pada handle, gunakan panah
            atas/bawah, lalu Space untuk melepas atau Escape untuk membatalkan.
            Urutan kembali ke awal saat halaman dimuat ulang.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RowUserTable users={users} />
        </CardContent>
      </Card>
    </AppBody>
  );
}
