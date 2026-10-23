import type { GanttSegment } from "./gantt-types";

export interface DependencyEdge {
  key: string;
  fromId: string;
  toId: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

export function laneTopRem(
  laneOffsetRem: number,
  lane: number,
  laneHeightRem: number,
  laneGapRem: number,
) {
  return laneOffsetRem + lane * (laneHeightRem + laneGapRem);
}

export function calculateDependencyEdges(
  rows: { resource: { id: string } }[],
  rowBars: ReadonlyMap<
    string,
    { segments: GanttSegment[]; laneOffsetRem: number; heightRem: number }
  >,
  rangeDurationMs: number,
  trackRemWidth: number,
  laneHeightRem: number,
  laneGapRem: number,
  minRowRem: number,
  enabled: boolean | undefined,
) {
  const none = { edges: [] as DependencyEdge[], totalRem: 0 };
  if (!enabled) return none;
  const totalMin = rangeDurationMs / 60000;
  if (totalMin <= 0) return none;
  type Pending = {
    id: string;
    dependencies: string[];
    startX: number;
    y: number;
  };
  const anchors = new Map<string, { endX: number; y: number }>();
  const pending: Pending[] = [];
  let topRem = 0;
  for (const row of rows) {
    const bars = rowBars.get(row.resource.id);
    if (bars) {
      for (const segment of bars.segments) {
        const occ = segment.occurrence;
        // a recurring instance has no single edge to anchor a plan on
        if (occ.isRecurring) continue;
        const lane = segment.column ?? 0;
        const y =
          topRem +
          laneTopRem(bars.laneOffsetRem, lane, laneHeightRem, laneGapRem) +
          laneHeightRem / 2;
        const startX = ((segment.startMin ?? 0) / totalMin) * trackRemWidth;
        const endX = ((segment.endMin ?? 0) / totalMin) * trackRemWidth;
        anchors.set(occ.eventId, { endX, y });
        if (occ.event.dependencies?.length) {
          pending.push({
            id: occ.eventId,
            dependencies: occ.event.dependencies,
            startX,
            y,
          });
        }
      }
    }
    topRem += bars?.heightRem ?? minRowRem;
  }
  if (pending.length === 0) return none;
  const edges: DependencyEdge[] = [];
  for (const item of pending) {
    for (const depId of item.dependencies) {
      if (depId === item.id) continue;
      const from = anchors.get(depId);
      if (!from) continue;
      edges.push({
        key: `${depId}->${item.id}`,
        fromId: depId,
        toId: item.id,
        fromX: from.endX,
        fromY: from.y,
        toX: item.startX,
        toY: item.y,
      });
    }
  }
  return { edges, totalRem: topRem };
}
