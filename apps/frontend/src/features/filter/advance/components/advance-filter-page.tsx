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
import { AdvanceFilterUserTable } from "./advance-filter-user-table";

export function AdvanceFilterPage() {
  return (
    <AppBody>
      <PageHeading title="Advance Filter" currentPage="Advance Filter" />
      <Card>
        <CardHeader>
          <CardTitle>User profiles</CardTitle>
          <CardDescription>
            Filter berbasis chip: pilih field (termasuk grup bertingkat
            Organization dan Account), kondisi, lalu nilai. Editor nilai
            mencakup pencarian async, tanggal, slider, kontrol pilihan, dan
            input bertipe. Query disusun sebagai pohon aturan dan dikompilasi
            menjadi predikat baris.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdvanceFilterUserTable users={getUserProfiles()} />
        </CardContent>
      </Card>
    </AppBody>
  );
}
