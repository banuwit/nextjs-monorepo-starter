import type { Metadata } from "next";
import { InfrastructurePage } from "@/features/infrastructure/infrastructure-page";

export const metadata: Metadata = {
  title: "Infrastructure | Dashboard",
  description:
    "Monitor environments, server health, uptime, and resource usage across every project.",
};

export default function Page() {
  return <InfrastructurePage />;
}
