import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { users } from "@/mocks/user.mock";
import { TreeUserTable } from "./tree-user-table";

export function TreeTablePage() {
  return (
    <AppBody>
      <PageHeading title="Group Tree" currentPage="Group Tree" />
      <TreeUserTable users={users} />
    </AppBody>
  );
}
