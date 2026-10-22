import { ColumnTablePage } from "@/features/table/column/components/column-table-page";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <ColumnTablePage searchParams={await searchParams} />;
}
