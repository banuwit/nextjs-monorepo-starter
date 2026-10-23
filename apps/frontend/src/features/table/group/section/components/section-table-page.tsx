import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { users } from "@/mocks/user.mock";
import { SectionUserTable } from "./section-user-table";

export function SectionTablePage() {
  return (
    <AppBody>
      <PageHeading title="Group Section" currentPage="Group Section" />
      <SectionUserTable users={users} />
    </AppBody>
  );
}
