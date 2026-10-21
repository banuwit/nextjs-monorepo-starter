import type { Metadata } from "next";
import { WizardPage } from "@/features/wizard/components/wizard-page";

export const metadata: Metadata = {
  title: "Wizard | Playground",
  description:
    "A four-step billing upgrade wizard with a live invoice preview.",
};

export default function Page() {
  return <WizardPage />;
}
