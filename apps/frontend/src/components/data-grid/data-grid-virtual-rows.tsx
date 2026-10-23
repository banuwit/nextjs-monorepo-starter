"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { LoaderCircle } from "lucide-react";
import {
  Fragment,
  useEffect,
  useState,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

export type DataGridVirtualScroll = {
  height?: CSSProperties["height"];
  label: string;
  estimateSize?: number;
  totalCount: number;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
};

/** Virtualizes flat rows while retaining the grid's existing cell renderer. */
export function DataGridVirtualRows<T extends { id: string }>({
  rows,
  colSpan,
  scrollRef,
  options,
  renderRow,
}: {
  rows: T[];
  colSpan: number;
  scrollRef: RefObject<HTMLDivElement | null>;
  options: DataGridVirtualScroll;
  renderRow: (row: T, props?: ComponentProps<"tr">) => ReactNode;
}) {
  "use no memo"; // TanStack Virtual owns mutable measurements; do not compiler-memoize them.
  const [headerHeight, setHeaderHeight] = useState(40);
  const { hasMore, loadingMore, onLoadMore } = options;
  useEffect(() => {
    const header = scrollRef.current?.querySelector("thead");
    if (!header) return;
    const measure = () =>
      setHeaderHeight(header.getBoundingClientRect().height);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    return () => observer.disconnect();
  }, [scrollRef]);

  // This component explicitly opts out of React Compiler memoization above.
  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => options.estimateSize ?? 52,
    getItemKey: (index) => rows[index]!.id,
    overscan: 6,
    scrollMargin: headerHeight,
  });
  const items = virtualizer.getVirtualItems();
  const top = Math.max(0, (items[0]?.start ?? headerHeight) - headerHeight);
  const bottom = Math.max(
    0,
    virtualizer.getTotalSize() -
      ((items.at(-1)?.end ?? headerHeight) - headerHeight),
  );

  useEffect(() => {
    const element = scrollRef.current;
    if (!element || !hasMore || loadingMore) return;
    const checkEnd = () => {
      if (element.scrollHeight - element.scrollTop - element.clientHeight <= 80)
        onLoadMore();
    };
    element.addEventListener("scroll", checkEnd, { passive: true });
    const observer = new ResizeObserver(checkEnd);
    observer.observe(element);
    checkEnd();
    return () => {
      element.removeEventListener("scroll", checkEnd);
      observer.disconnect();
    };
  }, [hasMore, loadingMore, onLoadMore, rows.length, scrollRef]);

  return (
    <>
      {top > 0 && (
        <tr aria-hidden="true">
          <td
            colSpan={colSpan}
            className="border-0 p-0"
            style={{ height: top }}
          />
        </tr>
      )}
      {items.map((item) => (
        <Fragment key={item.key}>
          {renderRow(rows[item.index]!, {
            ref: virtualizer.measureElement,
            "aria-rowindex": item.index + 2,
            ...{ "data-index": item.index },
          })}
        </Fragment>
      ))}
      {bottom > 0 && (
        <tr aria-hidden="true">
          <td
            colSpan={colSpan}
            className="border-0 p-0"
            style={{ height: bottom }}
          />
        </tr>
      )}
      <TableRow className="hover:bg-transparent">
        <TableCell colSpan={colSpan} className="h-14 text-center">
          {hasMore ? (
            <Button
              variant="ghost"
              size="sm"
              disabled={loadingMore}
              onClick={onLoadMore}
            >
              {loadingMore && (
                <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" />
              )}
              {loadingMore ? "Loading more users..." : "Load more users"}
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground">
              All {rows.length.toLocaleString("en-US")} users loaded
            </span>
          )}
        </TableCell>
      </TableRow>
    </>
  );
}
