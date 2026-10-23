import type { ReactNode } from "react";

import { NavigationBreadcrumb } from "@/components/navigation-breadcrumb";

type PageHeadingProps = {
  title: string;
  currentPage: string;
  titleClassName?: string;
  children?: ReactNode;
};

export function PageHeading({
  title,
  currentPage,
  titleClassName,
  children,
}: PageHeadingProps) {
  return (
    <div className="flex flex-col">
      <NavigationBreadcrumb currentPage={currentPage} />
      <div
        data-slot="page-heading-content"
        className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <h1 className={titleClassName ?? "text-2xl font-semibold tracking-tight"}>
          {title}
        </h1>
        {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
      </div>
    </div>
  );
}
