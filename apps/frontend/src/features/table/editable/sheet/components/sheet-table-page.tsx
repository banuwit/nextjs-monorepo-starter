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
import { CellUserTable } from "./sheet-user-table";

export function CellTablePage() {
  return (
    <AppBody>
      <PageHeading
        title="Cell Editable Table"
        currentPage="Cell Editable Table"
      />
      <Card>
        <CardHeader>
          <CardTitle>User profiles</CardTitle>
          <CardDescription id="cell-editing-help">
            Klik untuk memilih sel; klik dua kali, Enter, atau langsung ketik
            untuk mengedit. Enter atau Tab menyimpan, Escape membatalkan.
            Gunakan Shift + panah atau drag untuk memilih rentang, copy/paste,
            dan tarik sudut pilihan untuk mengisi sel. Undo/Redo mengembalikan
            perubahan lokal (Ctrl/⌘ Z dan Ctrl/⌘ Shift Z). Filters menampilkan
            filter di setiap header; Settings mengatur tampilan spreadsheet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CellUserTable users={users} />
        </CardContent>
      </Card>
    </AppBody>
  );
}
