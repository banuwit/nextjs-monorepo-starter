import type { Metadata } from "next";
import { ColumnTablePage } from "@/features/table/column/components/column-table-page";

export const metadata: Metadata = {
  title: "Table · Column | Workspace",
  description: "A server-driven data table with column pinning and ordering.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <ColumnTablePage searchParams={await searchParams} />;
}
