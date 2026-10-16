import { UserRecordPage } from "@/features/users/components/user-record-page";
export const metadata = { title: "Tambah user | Workspace" };
export default function Page() {
  return <UserRecordPage mode="create" />;
}
