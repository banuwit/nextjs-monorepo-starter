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
import { ExpansionUserTable } from "./expansion-user-table";

export function ExpansionTablePage() {
  return (
    <AppBody>
      <PageHeading title="Group Expansion" currentPage="Group Expansion" />
      <Card>
        <CardHeader>
          <CardTitle>User profiles</CardTitle>
          <CardDescription>
            Buka baris atasan untuk melihat profil bawahan langsung. Relasi
            organisasi dan perubahan status menggunakan data demo lokal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExpansionUserTable users={users} />
        </CardContent>
      </Card>
    </AppBody>
  );
}
