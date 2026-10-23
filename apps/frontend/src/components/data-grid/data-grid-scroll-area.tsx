"use client";

import { ScrollArea } from "@base-ui/react/scroll-area";
import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

/** One viewport keeps header/body columns aligned; sticky headers leave the vertical track below the header. */
export function DataGridScrollArea({
  children,
  scrollRef,
  height,
  label,
  stickyHeader = true,
}: {
  children: ReactNode;
  scrollRef: RefObject<HTMLDivElement | null>;
  height: CSSProperties["height"];
  label: string;
  stickyHeader?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!stickyHeader) return;
    const header = scrollRef.current?.querySelector("thead");
    if (!header) return;
    const measure = () =>
      rootRef.current?.style.setProperty(
        "--data-grid-header-height",
        `${header.getBoundingClientRect().height}px`,
      );
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    return () => observer.disconnect();
  }, [scrollRef, stickyHeader]);

  return (
    <ScrollArea.Root
      ref={rootRef}
      data-slot="data-grid-scroll-area"
      className="relative [--data-grid-header-height:2.5rem]"
      style={{ height }}
    >
      <ScrollArea.Viewport
        ref={scrollRef}
        data-slot="table-container"
        role="region"
        aria-label={label}
        tabIndex={0}
        className="size-full overscroll-contain outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
        style={{ overflowAnchor: "none" }}
      >
        <ScrollArea.Content>{children}</ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollBar
        className={cn(
          "z-30",
          stickyHeader &&
            "data-vertical:top-[var(--data-grid-header-height)]! data-vertical:h-auto",
        )}
      />
      <ScrollBar orientation="horizontal" className="z-30" />
      <ScrollArea.Corner />
    </ScrollArea.Root>
  );
}
