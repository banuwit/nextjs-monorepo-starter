import type { ReactNode } from "react";

import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";

export function ChartExamplePage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <AppBody>
      <PageHeading title={`${title} Chart`} currentPage={title} />
      <div className="grid gap-4 @4xl/main:grid-cols-2">{children}</div>
    </AppBody>
  );
}
