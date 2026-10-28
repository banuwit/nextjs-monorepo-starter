"use client";
import { useEffect, useRef, type ReactNode } from "react";

export function CrudInlinePanelHeader({
  title,
  actions,
}: {
  title: string;
  actions: ReactNode;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, [title]);
  return (
    <div
      data-slot="crud-inline-panel-header"
      className="flex shrink-0 items-center justify-between gap-3 border-b p-4"
    >
      <h2
        ref={heading}
        tabIndex={-1}
        className="min-w-0 rounded font-semibold break-words focus-visible:outline-2 focus-visible:outline-ring"
      >
        {title}
      </h2>
      <div className="flex shrink-0 items-center gap-2 [&_button]:min-h-11 [&_button]:touch-manipulation md:[&_button]:min-h-8">
        {actions}
      </div>
    </div>
  );
}

export function CrudInlinePanel({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      aria-label={title}
      data-slot="crud-inline-panel"
      className="flex h-[calc(100dvh-3rem)] w-full min-w-0 flex-col bg-background md:border-l"
    >
      {actions && <CrudInlinePanelHeader title={title} actions={actions} />}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {children}
      </div>
    </section>
  );
}
