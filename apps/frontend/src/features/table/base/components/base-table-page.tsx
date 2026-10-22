import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BaseUserTable } from "./base-user-table";
import { getMockUsers } from "@/mocks/user.mock";

export function BaseTablePage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const result = getMockUsers(searchParams);

  return (
    <AppBody>
      <PageHeading title="Base Table" currentPage="Base Table" />
      <Card>
        <CardHeader>
          <CardTitle>User profiles</CardTitle>
          <CardDescription>
            Data contoh pengguna dengan pencarian, filter, pengurutan kolom, dan
            pagination sederhana.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BaseUserTable {...result} />
        </CardContent>
      </Card>
    </AppBody>
  );
}
