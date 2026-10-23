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
import { InlineUserTable } from "./inline-user-table";

export function InlineTablePage() {
  return (
    <AppBody>
      <PageHeading
        title="Inline Editable Table"
        currentPage="Inline Editable Table"
      />
      <Card>
        <CardHeader>
          <CardTitle>User profiles</CardTitle>
          <CardDescription>
            Klik teks pada sel untuk mengedit. Enter menyelesaikan edit
            sel, Escape membatalkan edit sel, dan Tab berpindah fokus. Gunakan
            Save changes untuk menyimpan atau Discard untuk membatalkan
            perubahan. Data demo hanya disimpan lokal dan kembali ke awal saat
            halaman dimuat ulang.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InlineUserTable users={users} />
        </CardContent>
      </Card>
    </AppBody>
  );
}
