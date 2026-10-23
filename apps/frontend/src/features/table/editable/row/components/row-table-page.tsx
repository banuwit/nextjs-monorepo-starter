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
            Edit atau duplikasi pengguna langsung per baris.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RowUserTable users={users} />
        </CardContent>
      </Card>
    </AppBody>
  );
}
