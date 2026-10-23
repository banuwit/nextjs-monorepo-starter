/** The pane's scrollable viewport (custom ScrollArea or native host). */
export function getPaneViewport(pane: HTMLElement | null): HTMLElement | null {
  return (
    pane?.querySelector<HTMLElement>("[data-slot=scroll-area-viewport]") ?? null
  );
}

/** Distance scrolled from the inline-start edge (RTL reports negative). */
export function getScrollStart(viewport: HTMLElement): number {
  return Math.abs(viewport.scrollLeft);
}

/** Write a distance-from-inline-start back as a signed scrollLeft. */
export function setScrollStart(viewport: HTMLElement, value: number) {
  viewport.scrollLeft =
    getComputedStyle(viewport).direction === "rtl" ? -value : value;
}
