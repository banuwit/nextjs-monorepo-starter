// Data contoh untuk dashboard Finance; tidak ada rekening atau transfer yang terhubung.
import type { KpiItem } from "@/features/dashboard/finance/types/dashboard";

/** Month-end net worth in USD, oldest first; the last value is this month. */
export const financeNetWorthHistory = [
  96_200, 98_900, 101_400, 100_100, 104_800, 108_300,
  110_900, 109_600, 114_200, 117_000, 118_600, 128_400,
];

export const financeAccounts = [
  { name: "Everyday checking", institution: "Revolut", last4: "4182", balance: 12_840, color: "var(--chart-1)" },
  { name: "High-yield savings", institution: "HSBC", last4: "1004", balance: 48_320, color: "var(--chart-2)" },
  { name: "Index investments", institution: "Vanguard", last4: "7731", balance: 42_780, color: "var(--chart-3)" },
  { name: "Emergency reserve", institution: "Barclays", last4: "9912", balance: 24_460, color: "var(--chart-4)" },
] as const;

export const financeMetrics = [
  {
    label: "Available cash",
    value: "$12,840",
    delta: { value: "+3.2%", direction: "up", sentiment: "good" },
    context: "$410 above your 30-day average",
  },
  {
    label: "Spent this month",
    value: "$2,140",
    delta: { value: "+6.1%", direction: "up", sentiment: "bad" },
    context: "$124 more than September",
  },
  {
    label: "Savings rate",
    value: "28%",
    delta: { value: "+2.4 pts", direction: "up", sentiment: "good" },
    context: "up from 25.6%",
  },
] as const satisfies readonly KpiItem[];

export const financeSpentThisMonth = 2_140;

export const financeIncome = [
  { label: "Salary", amount: 4_560, color: "var(--chart-1)" },
  { label: "Freelance projects", amount: 1_412, color: "var(--chart-2)" },
  { label: "Dividends and interest", amount: 765, color: "var(--chart-3)" },
] as const;

export const financeSpending = [
  { day: "Mon", thisWeek: 165, lastWeek: 210 },
  { day: "Tue", thisWeek: 290, lastWeek: 240 },
  { day: "Wed", thisWeek: 220, lastWeek: 260 },
  { day: "Thu", thisWeek: 390, lastWeek: 310 },
  { day: "Fri", thisWeek: 315, lastWeek: 330 },
  { day: "Sat", thisWeek: 445, lastWeek: 380 },
  { day: "Sun", thisWeek: 280, lastWeek: 300 },
] as const;

export const financeBills = [
  { name: "Claude Pro", category: "Software", amount: 20, due: "2026-10-30", autopay: true },
  { name: "Electricity", category: "Utilities", amount: 145, due: "2026-11-01", autopay: true },
  { name: "Resend Pro Team", category: "Software", amount: 80, due: "2026-11-03", autopay: false },
  { name: "Apartment rent", category: "Housing", amount: 1_000, due: "2026-11-05", autopay: false },
  { name: "Linear Plus", category: "Software", amount: 14, due: "2026-11-08", autopay: true },
] as const;

export type FinanceTransaction = {
  id: string;
  name: string;
  category: string;
  date: string;
  amount: number;
};

export const financeTransactions: FinanceTransaction[] = [
  { id: "t8", name: "Salary", category: "Income", date: "2026-10-28", amount: 4_560 },
  { id: "t7", name: "Whole Foods", category: "Groceries", date: "2026-10-27", amount: -86.5 },
  { id: "t6", name: "Northwind Studio", category: "Freelance", date: "2026-10-25", amount: 1_412 },
  { id: "t5", name: "City Utilities", category: "Utilities", date: "2026-10-24", amount: -145 },
  { id: "t4", name: "Blue Bottle Coffee", category: "Dining", date: "2026-10-23", amount: -12.4 },
  { id: "t3", name: "Uber", category: "Transport", date: "2026-10-22", amount: -23.8 },
  { id: "t2", name: "Vanguard dividend", category: "Investments", date: "2026-10-20", amount: 765 },
  { id: "t1", name: "Uniqlo", category: "Shopping", date: "2026-10-19", amount: -64.9 },
];

export const financeRecipients = [
  { id: "ar", name: "Aisha Rahman" },
  { id: "sc", name: "Sam Carter" },
  { id: "mj", name: "Maya Jensen" },
  { id: "ed", name: "Elliot Diaz" },
] as const;
