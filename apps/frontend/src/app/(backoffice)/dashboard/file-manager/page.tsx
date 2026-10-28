import type { Metadata } from "next";
import { FileManagerPage } from "@/features/file-manager/components/file-manager-page";

export const metadata: Metadata = { title: "File Manager" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ item?: string | string[] }>;
}) {
  const { item } = await searchParams;
  return (
    <FileManagerPage
      initialItemId={typeof item === "string" ? item : undefined}
    />
  );
}
