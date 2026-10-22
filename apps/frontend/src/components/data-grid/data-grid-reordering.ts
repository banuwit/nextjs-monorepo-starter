/** Move by stable IDs, keeping the source data and every record intact. */
export function reorderDataGridItems<TData>(
  data: TData[],
  activeId: string,
  overId: string | null,
  getRowId: (row: TData) => string,
): TData[] {
  if (overId === null || activeId === overId) return data;
  const from = data.findIndex((row) => getRowId(row) === activeId);
  const to = data.findIndex((row) => getRowId(row) === overId);
  if (from < 0 || to < 0) return data;

  const result = [...data];
  const [moved] = result.splice(from, 1);
  result.splice(to, 0, moved as TData);
  return result;
}
