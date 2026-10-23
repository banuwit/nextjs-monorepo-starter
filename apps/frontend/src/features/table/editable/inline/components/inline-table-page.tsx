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
            Edit sel langsung di tabel, lalu simpan atau batalkan perubahan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InlineUserTable users={users} />
        </CardContent>
      </Card>
    </AppBody>
  );
}
