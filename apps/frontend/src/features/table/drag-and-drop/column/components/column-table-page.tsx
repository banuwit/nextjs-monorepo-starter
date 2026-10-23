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
import { ColumnUserTable } from "./column-user-table";

export function ColumnTablePage() {
  return (
    <AppBody>
      <PageHeading
        title="Drag & Drop Columns"
        currentPage="Drag & Drop Columns"
      />
      <Card>
        <CardHeader>
          <CardTitle>User profiles</CardTitle>
          <CardDescription>
            Geser header untuk mengubah urutan kolom.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ColumnUserTable users={users} />
        </CardContent>
      </Card>
    </AppBody>
  );
}
