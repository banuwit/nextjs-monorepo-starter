import type { Metadata } from "next";
import { AccessManagementPage } from "@/features/access-management/components/access-management-page";

export const metadata: Metadata = {
  title: "Access Management | Dashboard",
  description: "Map workspace roles to grouped permission scopes in one matrix.",
};

export default function Page() {
  return <AccessManagementPage />;
}
