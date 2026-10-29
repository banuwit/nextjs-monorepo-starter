import { daysBetween } from "@/features/dashboard/utils/format";
import type { FinanceTransaction } from "@/mocks/dashboard-finance.mock";

export const transactionsCsvHeader = ["Name", "Category", "Date", "Amount (USD)"] as const;

export function transactionsCsvRows(transactions: readonly FinanceTransaction[]) {
  return transactions.map(({ name, category, date, amount }) => [
    name,
    category,
    date,
    amount.toFixed(2),
  ]);
}

/** "Due today", "Due tomorrow", "Due in 5 days", or "Overdue by 2 days". */
export function dueLabel(due: string, today: string) {
  const days = daysBetween(today, due);
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  if (days < 0) return `Overdue by ${-days} ${days === -1 ? "day" : "days"}`;
  return `Due in ${days} days`;
}

/** Validates a transfer amount typed by the user. Returns an error or null. */
export function transferAmountError(raw: string, available: number) {
  const amount = Number(raw);
  if (!raw.trim() || Number.isNaN(amount)) return "Enter an amount.";
  if (amount <= 0) return "Enter an amount greater than zero.";
  if (amount > available) return "This is more than your available cash.";
  if (!/^\d+(\.\d{1,2})?$/.test(raw.trim())) return "Use at most two decimal places.";
  return null;
}
