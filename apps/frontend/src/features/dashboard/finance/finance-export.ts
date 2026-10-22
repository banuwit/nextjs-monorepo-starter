type Transaction = { name: string; date: string; type: string; amount: number };

export function transactionsCsv(transactions: readonly Transaction[]): string {
  const escape = (value: string) => `"${value.replaceAll('"', '""')}"`;
  const rows = transactions.map(({ name, date, type, amount }) =>
    [name, date, type, amount.toFixed(2)].map(escape).join(","),
  );
  return ['"Name","Date","Type","Amount (USD)"', ...rows].join("\r\n") + "\r\n";
}
