import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { ScrollUserTable } from "./scroll-user-table";

export function ScrollTablePage() {
  return (
    <AppBody>
      <PageHeading title="Scroll" currentPage="Scroll" />
      <ScrollUserTable />
    </AppBody>
  );
}
