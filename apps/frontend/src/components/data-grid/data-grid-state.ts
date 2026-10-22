export function getDataGridBodyState(input: {
  error?: string
  pending?: boolean
  rowCount: number
}): "error" | "loading" | "empty" | "rows" {
  if (input.error !== undefined) return "error"
  if (input.pending) return "loading"
  return input.rowCount > 0 ? "rows" : "empty"
}
