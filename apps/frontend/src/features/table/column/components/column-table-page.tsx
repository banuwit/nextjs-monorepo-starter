import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getMockUsers } from "@/mocks/user.mock";
import { ColumnUserTable } from "./column-user-table";

export function ColumnTablePage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const result = getMockUsers(searchParams);

  return (
    <AppBody>
      <PageHeading title="Column Table" currentPage="Column Table" />
      <Card>
        <CardHeader>
          <CardTitle>User profiles</CardTitle>
          <CardDescription>
            Data contoh pengguna dengan filter, menu pengurutan dan tampilan
            kolom, serta pilihan ukuran halaman.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ColumnUserTable {...result} />
        </CardContent>
      </Card>
    </AppBody>
  );
}
