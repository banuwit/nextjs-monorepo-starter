import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserProfiles } from "@/mocks/user-profile.mock";
import { GroupFilterUserTable } from "./group-filter-user-table";

export function GroupFilterPage() {
  return (
    <AppBody>
      <PageHeading title="Group Filter" currentPage="Group Filter" />
      <Card>
        <CardHeader>
          <CardTitle>User profiles</CardTitle>
          <CardDescription>
            Builder kondisi bertingkat: aturan dan grup AND/OR yang bisa disusun
            ulang, dibuka dari popover atau tampil inline. Setiap nilai
            menunjukkan berapa user yang cocok dengan aturan itu sendiri, dan
            query dibaca ulang sebagai ekspresi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GroupFilterUserTable users={getUserProfiles()} />
        </CardContent>
      </Card>
    </AppBody>
  );
}
