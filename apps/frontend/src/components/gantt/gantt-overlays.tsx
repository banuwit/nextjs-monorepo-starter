"use client";

import { useEffect, useState, type RefObject } from "react";
import { format, type Locale } from "date-fns";
import { useGanttSettings } from "./gantt";
import { toZoned } from "./gantt-lib";
import type { GanttOccurrence } from "./gantt-types";
import { useNow } from "./gantt-clock";
import { getPaneViewport, getScrollStart } from "./gantt-scroll";
import { IconPlaceholder } from "./icon-placeholder";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * The red now-line, self-ticking: only this component re-renders on the 30s
 * clock, never the grid around it. z-10 keeps it above row content but UNDER
 * the sticky header (z-30) - vertical scrolling slides it beneath, never over.
 */
function GanttNowLine({
  rangeStartMs,
  rangeEndMs,
}: {
  rangeStartMs: number;
  rangeEndMs: number;
}) {
  const now = useNow();
  const ms = now.getTime();
  if (ms < rangeStartMs || ms >= rangeEndMs) return null;
  const fraction = (ms - rangeStartMs) / (rangeEndMs - rangeStartMs);
  return (
    <div
      data-slot="gantt-now-indicator"
      // comet tail: solid at the cap, dissolving toward the bottom -
      // present without ruling a hard line through every row
      className="from-destructive/80 via-destructive/45 to-destructive/15 absolute inset-y-0 z-10 w-px bg-linear-to-b"
      style={{ insetInlineStart: `${fraction * 100}%` }}
    />
  );
}

/**
 * The now-line's dot cap, pinned INSIDE the sticky header at the header/body
 * boundary: it stays put while the line scrolls beneath the header.
 */
function GanttNowDot({
  rangeStartMs,
  rangeEndMs,
}: {
  rangeStartMs: number;
  rangeEndMs: number;
}) {
  const now = useNow();
  const ms = now.getTime();
  if (ms < rangeStartMs || ms >= rangeEndMs) return null;
  const fraction = (ms - rangeStartMs) / (rangeEndMs - rangeStartMs);
  return (
    <span
      aria-hidden
      data-slot="gantt-now-dot"
      className="bg-destructive absolute -bottom-0.75 z-10 size-1.5 -translate-x-1/2 rounded-full"
      style={{ insetInlineStart: `${fraction * 100}%` }}
    />
  );
}

interface OffscreenChip {
  id: string;
  side: "start" | "end";
  top: number;
  color?: string;
  label: string;
  /** First bar start, shown in the chip tooltip. */
  startMs: number | null;
  /** scrollLeft that brings the bar back into view. */
  target: number;
}

function sameChips(a: OffscreenChip[], b: OffscreenChip[]): boolean {
  return (
    a.length === b.length &&
    a.every(
      (chip, i) =>
        chip.id === b[i]?.id &&
        chip.side === b[i]?.side &&
        chip.top === b[i]?.top &&
        chip.target === b[i]?.target,
    )
  );
}

/**
 * Edge chips for rows whose bars sit entirely outside the visible timeline;
 * clicking scrolls the bar back into view. Reads geometry straight from the
 * DOM (row data attributes), so scrolling never re-renders the grid.
 */
function GanttOffscreenChips({
  paneRef,
  occurrences,
  locale,
  refreshKey,
}: {
  paneRef: RefObject<HTMLDivElement | null>;
  occurrences: GanttOccurrence[];
  locale?: Locale;
  refreshKey: string;
}) {
  const settings = useGanttSettings();
  const [chips, setChips] = useState<OffscreenChip[]>([]);

  useEffect(() => {
    const pane = paneRef.current;
    const viewport = getPaneViewport(pane);
    if (!pane || !viewport) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const paneRect = pane.getBoundingClientRect();
      const header = viewport.querySelector<HTMLElement>(
        "[data-slot=gantt-timeline-header]",
      );
      const headerBottom = header
        ? header.getBoundingClientRect().bottom - paneRect.top
        : 0;
      const trackW = viewport.scrollWidth;
      const visibleStart = getScrollStart(viewport);
      const visibleEnd = visibleStart + viewport.clientWidth;
      // The floating zoom control shares the right edge. The chips stay in
      // their column - a shifted chip reads as misaligned, and its position
      // IS its meaning - so it is the ZOOM CONTROL that glides inward while
      // any end chip occupies its band (published as --gantt-zoom-shift,
      // written imperatively like the rest of this measure pass). The band
      // test uses the control's VERTICAL extent only, which a horizontal
      // dodge never changes, so the loop cannot oscillate.
      const zoomEl = pane.querySelector<HTMLElement>("[data-slot=gantt-zoom]");
      const zoom = zoomEl
        ? {
            top: zoomEl.getBoundingClientRect().top - paneRect.top - 8,
            bottom: zoomEl.getBoundingClientRect().bottom - paneRect.top + 8,
          }
        : null;
      let chipInZoomBand = false;
      const next: OffscreenChip[] = [];
      for (const rowEl of viewport.querySelectorAll<HTMLElement>(
        "[data-gantt-row]",
      )) {
        const from = parseFloat(rowEl.dataset.ganttBarMin ?? "");
        const to = parseFloat(rowEl.dataset.ganttBarMax ?? "");
        if (Number.isNaN(from) || Number.isNaN(to)) continue;
        const rect = rowEl.getBoundingClientRect();
        const top = rect.top - paneRect.top + rect.height / 2;
        if (top < headerBottom + 10 || top > paneRect.height - 16) continue;
        const startPx = from * trackW;
        const endPx = to * trackW;
        const startMs = parseFloat(rowEl.dataset.ganttBarStartMs ?? "");
        const base = {
          id: rowEl.dataset.ganttRowId ?? "",
          top: Math.round(top),
          color: rowEl.dataset.ganttBarColor,
          label: rowEl.dataset.ganttBarLabel ?? "",
          startMs: Number.isNaN(startMs) ? null : startMs,
        };
        if (endPx <= visibleStart + 2) {
          next.push({
            ...base,
            side: "start",
            target: startPx - 24,
          });
        } else if (startPx >= visibleEnd - 2) {
          if (zoom && top >= zoom.top && top <= zoom.bottom) {
            chipInZoomBand = true;
          }
          next.push({
            ...base,
            side: "end",
            target: endPx - viewport.clientWidth + 24,
          });
        }
      }
      // 28px clears the 20px chip column plus breathing room on both sides
      zoomEl?.style.setProperty(
        "--gantt-zoom-shift",
        chipInZoomBand ? "28px" : "0px",
      );
      setChips((prev) => (sameChips(prev, next) ? prev : next));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    viewport.addEventListener("scroll", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(viewport);
    schedule();
    return () => {
      viewport.removeEventListener("scroll", schedule);
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
      // the zoom control returns to its corner once no chip can collide
      pane
        .querySelector<HTMLElement>("[data-slot=gantt-zoom]")
        ?.style.removeProperty("--gantt-zoom-shift");
    };
  }, [paneRef, occurrences, refreshKey]);

  if (chips.length === 0) return null;

  const scrollTo = (chip: OffscreenChip) => {
    const viewport = getPaneViewport(paneRef.current);
    if (!viewport) return;
    const target = Math.max(0, chip.target);
    viewport.scrollTo({
      // chip targets are distances from the inline start; RTL signs them
      left: getComputedStyle(viewport).direction === "rtl" ? -target : target,
      behavior: "smooth",
    });
    // hand keyboard focus to the bar the chip promised (the chip unmounts)
    const bar = viewport.querySelector<HTMLElement>(
      `[data-gantt-row-id="${CSS.escape(chip.id)}"] [data-slot=gantt-bar]`,
    );
    bar?.focus({ preventScroll: true });
  };

  return (
    <div
      data-slot="gantt-offscreen-chips"
      className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
    >
      <TooltipProvider delay={600} closeDelay={0} timeout={300}>
        {chips.map((chip) => (
          <Tooltip key={`${chip.id}-${chip.side}`}>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  data-slot="gantt-offscreen-chip"
                  data-side={chip.side}
                  aria-label={settings.i18n.labels.jumpToBar(chip.label)}
                  className="bg-background text-muted-foreground hover:text-foreground pointer-events-auto absolute flex size-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border shadow-xs"
                  style={{
                    top: chip.top,
                    ...(chip.side === "start"
                      ? { insetInlineStart: "0.5rem" }
                      : { insetInlineEnd: "0.875rem" }),
                  }}
                  onClick={() => scrollTo(chip)}
                />
              }
            >
              {chip.side === "start" ? (
                <IconPlaceholder
                  lucide="ChevronLeftIcon"
                  tabler="IconChevronLeft"
                  hugeicons="ArrowLeft01Icon"
                  phosphor="CaretLeftIcon"
                  remixicon="RiArrowLeftSLine"
                  className="size-3"
                  aria-hidden="true"
                />
              ) : (
                <IconPlaceholder
                  lucide="ChevronRightIcon"
                  tabler="IconChevronRight"
                  hugeicons="ArrowRight01Icon"
                  phosphor="CaretRightIcon"
                  remixicon="RiArrowRightSLine"
                  className="size-3"
                  aria-hidden="true"
                />
              )}
              <span
                aria-hidden
                className="ring-background absolute -end-px -top-px size-1.5 rounded-full ring-1"
                style={{ background: chip.color ?? "var(--color-primary)" }}
              />
            </TooltipTrigger>
            <TooltipContent side={chip.side === "start" ? "right" : "left"}>
              <div className="font-medium">{chip.label}</div>
              {chip.startMs !== null && (
                <div className="opacity-80">
                  {/* zoned: the chip must name the same day the grid shows */}
                  {format(
                    toZoned(new Date(chip.startMs), settings.timeZone),
                    "MMM d, yyyy",
                    { locale },
                  )}
                </div>
              )}
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
}

export { GanttNowLine, GanttNowDot, GanttOffscreenChips };
