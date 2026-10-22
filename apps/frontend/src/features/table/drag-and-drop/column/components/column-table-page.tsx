import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { users } from "@/mocks/user.mock";
import { ColumnUserTable } from "./column-user-table";

export function ColumnTablePage() {
  return (
    <AppBody>
      <PageHeading title="Drag & Drop Columns" currentPage="Drag & Drop Columns" />
      <Card>
        <CardHeader>
          <CardTitle>User profiles</CardTitle>
          <CardDescription>
            Geser header berikon grip ke kiri atau kanan untuk mengatur urutan kolom.
            Dengan keyboard, fokuskan header lalu tekan Space, gunakan panah
            kiri/kanan, dan Space untuk melepas atau Escape untuk membatalkan.
            Urutan kembali ke awal saat halaman dimuat ulang.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ColumnUserTable users={users} />
        </CardContent>
      </Card>
    </AppBody>
  );
}
