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
            Edit data langsung di sel tabel. Klik dua kali atau tekan Enter
            untuk mengubah sel; Enter menyimpan dan Escape membatalkan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CellUserTable users={users} />
        </CardContent>
      </Card>
    </AppBody>
  );
}
