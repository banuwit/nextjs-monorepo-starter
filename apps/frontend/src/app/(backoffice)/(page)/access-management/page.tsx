import type { Metadata } from "next";
import { AccessManagementPage } from "@/features/access-management/components/access-management-page";

export const metadata: Metadata = {
  title: "Access Management | Dashboard",
  description: "Choose a role, then set which actions it can perform on each page.",
};

export default function Page() {
  return <AccessManagementPage />;
}
