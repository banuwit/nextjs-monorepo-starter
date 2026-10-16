import { Fragment, type ReactNode } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type PageHeadingProps = {
  title: string;
  currentPage: string;
  parents?: { label: string; href: string }[];
  titleClassName?: string;
  children?: ReactNode;
};

export function PageHeading({
  title,
  currentPage,
  parents,
  titleClassName,
  children,
}: PageHeadingProps) {
  return (
    <div className="flex flex-col">
      <Breadcrumb>
        <BreadcrumbList className="text-xs">
          {parents?.map(({ label, href }) => (
            <Fragment key={href}>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
            </Fragment>
          ))}
          <BreadcrumbItem>
            <BreadcrumbPage>{currentPage}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
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
