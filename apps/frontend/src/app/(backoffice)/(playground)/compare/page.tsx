import type { Metadata } from "next";
import { ComparePage } from "@/features/compare/components/compare-page";

export const metadata: Metadata = {
  title: "Compare | Playground",
  description: "Compare product specs side by side and choose which products to include.",
};

export default function Page() {
  return <ComparePage />;
}
