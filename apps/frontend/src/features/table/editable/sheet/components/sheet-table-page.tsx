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
import { SheetUserTable } from "./sheet-user-table";

export function SheetTablePage() {
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
            Edit data langsung di sel tabel. Klik dua kali atau tekan Enter
            untuk mengubah sel; Enter menyimpan dan Escape membatalkan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SheetUserTable users={users} />
        </CardContent>
      </Card>
    </AppBody>
  );
}
