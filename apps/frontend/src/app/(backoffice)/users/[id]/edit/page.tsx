import { UserRecordPage } from "@/features/users/components/user-record-page";
export const metadata = { title: "Edit user | Workspace" };
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <UserRecordPage key={id} mode="edit" id={id} />;
}
