import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getMockUsers, users } from "@/mocks/user.mock";
import { getJoinMonthOptions } from "../utils/join-month-options";
import { getManagerOptions } from "../utils/manager-options";
import { BaseFilterUserTable } from "./base-filter-user-table";

export function BaseFilterPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const result = getMockUsers(searchParams);

  return (
    <AppBody>
      <PageHeading title="Base Filter" currentPage="Base Filter" />
      <Card>
        <CardHeader>
          <CardTitle>User profiles</CardTitle>
          <CardDescription>
            Filter: search input, select (role; join month yang scrollable dan
            dikelompokkan per tahun), combobox (atasan), combobox multiple
            dengan chips (department), combobox popup (kota), dan multi checkbox
            (status, dengan tombol Apply). Semua filter tersimpan di URL.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BaseFilterUserTable
            {...result}
            managerOptions={getManagerOptions(users)}
            joinMonthOptions={getJoinMonthOptions(users)}
          />
        </CardContent>
      </Card>
    </AppBody>
  );
}
