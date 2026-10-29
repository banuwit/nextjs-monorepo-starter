import type { Metadata } from "next";
import { BaseTablePage } from "@/features/table/base/components/base-table-page";

export const metadata: Metadata = {
  title: "Table · Base | Workspace",
  description:
    "A basic data table with search, sorting, filters, and pagination.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <BaseTablePage searchParams={await searchParams} />;
}
