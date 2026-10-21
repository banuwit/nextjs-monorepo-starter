import type { Metadata } from "next";
import { FlowProcessPage } from "@/features/flow-process/components/flow-process-page";

export const metadata: Metadata = {
  title: "Flow Process | Dashboard",
  description: "Build and inspect an interactive automation workflow.",
};

export default function Page() {
  return <FlowProcessPage />;
}
