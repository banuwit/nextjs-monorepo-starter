import type { Metadata } from "next";
import { FileManagerPage } from "@/features/file-manager/components/file-manager-page";

export const metadata: Metadata = {
  title: "File Manager | Dashboard",
  description: "Browse, organize, and preview files and folders.",
};

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
