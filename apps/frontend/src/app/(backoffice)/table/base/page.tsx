import { BaseTablePage } from "@/features/table/base/components/base-table-page";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <BaseTablePage searchParams={await searchParams} />;
}
