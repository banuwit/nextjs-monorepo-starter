import type {
  ColumnOrderState,
  ColumnPinningState,
  ColumnVisibilityState,
} from "@tanstack/react-table";

/** Editable coordinates must follow the rendered start/center/end regions. */
export function getUserCellColumnOrder(
  ids: string[],
  order: ColumnOrderState,
  visibility: ColumnVisibilityState,
  pinning: ColumnPinningState,
) {
  const ordered = [
    ...order.filter((id) => ids.includes(id)),
    ...ids.filter((id) => !order.includes(id)),
  ];
  const visible = ordered.filter((id) => visibility[id] !== false);
  const start = new Set(pinning.start);
  const end = new Set(pinning.end);
  return [
    ...pinning.start.filter((id) => visible.includes(id)),
    ...visible.filter((id) => !start.has(id) && !end.has(id)),
    ...pinning.end.filter((id) => visible.includes(id) && !start.has(id)),
  ];
}
