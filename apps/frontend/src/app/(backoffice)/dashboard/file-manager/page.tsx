import type { Metadata } from "next";
import { FileManagerPage } from "@/features/file-manager/components/file-manager-page";

export const metadata: Metadata = {
  title: "File Manager | Dashboard",
  description: "Organize, search, and browse workspace files and folders.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ view?: string | string[] }>;
}) {
  const { view } = await searchParams;
  return <FileManagerPage activeView={view === "list" ? "list" : "grid"} />;
}
