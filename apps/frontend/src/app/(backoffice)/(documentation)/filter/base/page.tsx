import type { Metadata } from "next";
import { BaseFilterPage } from "@/features/filter/base/components/base-filter-page";

export const metadata: Metadata = {
  title: "Filter · Base | Workspace",
  description:
    "A data table filtered by search input, dropdown, searchable combobox, and multi checkbox.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <BaseFilterPage searchParams={await searchParams} />;
}
