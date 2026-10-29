import type { ReactNode } from "react";

import { NavigationBreadcrumb } from "@/components/navigation-breadcrumb";

type PageHeadingProps = {
  title: string;
  currentPage: string;
  titleClassName?: string;
  /** Optional supporting line under the title, such as a date or summary. */
  description?: ReactNode;
  children?: ReactNode;
};

export function PageHeading({
  title,
  currentPage,
  titleClassName,
  description,
  children,
}: PageHeadingProps) {
  return (
    <div className="flex flex-col">
      <NavigationBreadcrumb currentPage={currentPage} />
      <div
        data-slot="page-heading-content"
        className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className={titleClassName ?? "text-2xl font-semibold tracking-tight"}>
            {title}
          </h1>
          {description && (
            <div className="text-sm text-muted-foreground">{description}</div>
          )}
        </div>
        {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
      </div>
    </div>
  );
}
