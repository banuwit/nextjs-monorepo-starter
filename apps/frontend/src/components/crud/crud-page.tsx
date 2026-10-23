import type { ReactNode } from "react";
import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function CrudPage({
  title,
  actions,
  children,
  sidePanel,
}: {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
  sidePanel?: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col md:flex-row">
      <div
        data-slot="crud-page-body"
        className={cn(
          "min-w-0 flex-1 [&_[data-slot=page-heading-content]]:flex-wrap",
          sidePanel && "hidden md:block",
        )}
      >
        <AppBody>
          <PageHeading
            title={title}
            currentPage={title}
          >
            {actions}
          </PageHeading>
          {children}
        </AppBody>
      </div>
      {sidePanel}
    </div>
  );
}
