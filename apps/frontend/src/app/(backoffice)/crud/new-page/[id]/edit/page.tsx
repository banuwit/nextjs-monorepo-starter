import { ExampleRecordPage } from "@/features/crud-examples/components/example-record-page";

export const metadata = { title: "Edit parameter contoh | Workspace" };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ExampleRecordPage key={id} mode="edit" id={id} />;
}
