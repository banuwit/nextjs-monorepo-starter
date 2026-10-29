import type { Metadata } from "next";
import { NewPageRecordPage } from "@/features/crud/new-page/components/new-page-record-page";

export const metadata: Metadata = {
  title: "CRUD · New Page · Detail | Workspace",
  description: "View the details of a record on its own page.",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <NewPageRecordPage key={id} mode="view" id={id} />;
}
