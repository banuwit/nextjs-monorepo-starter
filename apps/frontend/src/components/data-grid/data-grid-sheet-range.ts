export type CellPosition = { row: number; column: number };
export type CellRange = { anchor: CellPosition; focus: CellPosition };
export type CellChange = CellPosition & { value: string };

export function getCellRange({ anchor, focus }: CellRange) {
  return {
    top: Math.min(anchor.row, focus.row),
    bottom: Math.max(anchor.row, focus.row),
    left: Math.min(anchor.column, focus.column),
    right: Math.max(anchor.column, focus.column),
  };
}

export function isCellInRange(cell: CellPosition, range: CellRange | null) {
  if (!range) return false;
  const bounds = getCellRange(range);
  return (
    cell.row >= bounds.top &&
    cell.row <= bounds.bottom &&
    cell.column >= bounds.left &&
    cell.column <= bounds.right
  );
}

export function copyCellRange(
  range: CellRange,
  getValue: (cell: CellPosition) => string,
) {
  const { top, bottom, left, right } = getCellRange(range);
  const rows: string[] = [];
  for (let row = top; row <= bottom; row++) {
    const values: string[] = [];
    for (let column = left; column <= right; column++)
      values.push(quoteClipboardValue(getValue({ row, column })));
    rows.push(values.join("\t"));
  }
  return rows.join("\n");
}

export function quoteClipboardValue(value: string) {
  return /[\t\r\n"]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

/** Excel/Sheets TSV may quote tabs, line breaks, and double quotes inside a cell. */
export function parseClipboardText(text: string): string[][] | undefined {
  const rows: string[][] = [[]];
  let value = "";
  let quoted = false;
  const input = text.replace(/\r\n?/g, "\n");
  for (let index = 0; index < input.length; index++) {
    const char = input[index]!;
    if (char === '"') {
      if (quoted && input[index + 1] === '"') {
        value += '"';
        index++;
      } else if (quoted || value === "") quoted = !quoted;
      else value += char;
    } else if (!quoted && (char === "\t" || char === "\n")) {
      rows.at(-1)!.push(value);
      value = "";
      if (char === "\n") rows.push([]);
    } else value += char;
  }
  if (quoted) return undefined;
  rows.at(-1)!.push(value);
  if (input.endsWith("\n") && rows.length > 1) rows.pop();
  return rows;
}

export function moveCellFocus(
  cell: CellPosition,
  key: string,
  rowCount: number,
  columnCount: number,
  edge = false,
  pageRows = 10,
): CellPosition | undefined {
  let { row, column } = cell;
  switch (key) {
    case "ArrowLeft":
      column = edge ? 0 : column - 1;
      break;
    case "ArrowRight":
      column = edge ? columnCount - 1 : column + 1;
      break;
    case "ArrowUp":
      row = edge ? 0 : row - 1;
      break;
    case "ArrowDown":
      row = edge ? rowCount - 1 : row + 1;
      break;
    case "Home":
      column = 0;
      if (edge) row = 0;
      break;
    case "End":
      column = columnCount - 1;
      if (edge) row = rowCount - 1;
      break;
    case "PageUp":
      row -= pageRows;
      break;
    case "PageDown":
      row += pageRows;
      break;
    default:
      return undefined;
  }
  return {
    row: Math.max(0, Math.min(rowCount - 1, row)),
    column: Math.max(0, Math.min(columnCount - 1, column)),
  };
}

export function pasteCellRange(
  text: string,
  range: CellRange,
  rowCount: number,
  columnCount: number,
): { changes: CellChange[]; error?: string } {
  const matrix = parseClipboardText(text);
  if (!matrix)
    return {
      changes: [],
      error: "The clipboard contains an unclosed quoted value.",
    };
  const { top, bottom, left, right } = getCellRange(range);
  const width = matrix[0]!.length;
  if (matrix.some((row) => row.length !== width))
    return { changes: [], error: "Paste a rectangular range of cells." };
  const repeat =
    (bottom - top + 1) % matrix.length === 0 &&
    (right - left + 1) % width === 0;
  const height = repeat ? bottom - top + 1 : matrix.length;
  const columns = repeat ? right - left + 1 : width;
  if (top + height > rowCount || left + columns > columnCount)
    return {
      changes: [],
      error: "The pasted range exceeds the editable table area.",
    };
  const changes: CellChange[] = [];
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < columns; c++)
      changes.push({
        row: top + r,
        column: left + c,
        value: matrix[r % matrix.length]![c % width]!,
      });
  }
  return { changes };
}

/** Repeat the source pattern into the extended range, without changing the source. */
export function fillCellRange(
  source: CellRange,
  destination: CellRange,
  getValue: (cell: CellPosition) => string,
): CellChange[] {
  const start = getCellRange(source);
  const end = getCellRange(destination);
  const height = start.bottom - start.top + 1;
  const width = start.right - start.left + 1;
  const changes: CellChange[] = [];
  for (let row = end.top; row <= end.bottom; row++) {
    for (let column = end.left; column <= end.right; column++) {
      if (isCellInRange({ row, column }, source)) continue;
      const value = getValue({
        row: start.top + ((((row - start.top) % height) + height) % height),
        column:
          start.left + ((((column - start.left) % width) + width) % width),
      });
      changes.push({ row, column, value });
    }
  }
  return changes;
}
