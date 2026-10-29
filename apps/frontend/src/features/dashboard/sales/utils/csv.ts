type CsvValue = string | number;

function escapeCsv(value: CsvValue) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

export function toCsv(header: readonly string[], rows: readonly CsvValue[][]) {
  return (
    [header, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\r\n") +
    "\r\n"
  );
}

/** Downloads rows as a CSV file. Call from an event handler only. */
export function downloadCsv(
  filename: string,
  header: readonly string[],
  rows: readonly CsvValue[][],
) {
  const url = URL.createObjectURL(
    new Blob([toCsv(header, rows)], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
