// Presentational sample data; no accounts or transfers are connected.
export const financeMetrics = [
  {
    label: "Net worth",
    value: "$128.4K",
    detail: "+$9.8K vs last month",
    change: "+8.4%",
    tone: "positive",
  },
  {
    label: "Available cash",
    value: "$12.8K",
    detail: "$410 above your 30-day average",
    change: "+3.2%",
    tone: "positive",
  },
  {
    label: "Monthly spend",
    value: "$2,140",
    detail: "$124 more than last month",
    change: "+6.1%",
    tone: "negative",
  },
  {
    label: "Savings rate",
    value: "28%",
    detail: "Up from 25.6% last month",
    change: "+2.4%",
    tone: "positive",
  },
] as const;

export const financeIncome = [
  { label: "Primary salary", share: 68, amount: "$4,560.00" },
  { label: "Freelance projects", share: 21, amount: "$1,412.00" },
  { label: "Dividends and interest", share: 11, amount: "$765.00" },
] as const;

export const financeSpending = [
  { day: "Monday", weekly: 165, monthly: 310 },
  { day: "Tuesday", weekly: 290, monthly: 460 },
  { day: "Wednesday", weekly: 220, monthly: 390 },
  { day: "Thursday", weekly: 390, monthly: 530 },
  { day: "Friday", weekly: 315, monthly: 420 },
  { day: "Saturday", weekly: 445, monthly: 620 },
  { day: "Sunday", weekly: 280, monthly: 350 },
] as const;

export const financeAllocation = [
  {
    label: "Main Wallet",
    amount: 122540,
    share: "52.2%",
    fill: "var(--chart-1)",
  },
  {
    label: "Savings Account",
    amount: 48320,
    share: "20.6%",
    fill: "var(--chart-2)",
  },
  {
    label: "Investment Account",
    amount: 36780,
    share: "15.7%",
    fill: "var(--chart-3)",
  },
  {
    label: "Reserve Account",
    amount: 27256,
    share: "11.5%",
    fill: "var(--chart-4)",
  },
] as const;

export const financeWallet = [
  {
    name: "Revolut Premium",
    detail: "•••• 4182",
    value: "$12,450.60",
    mark: "R",
  },
  { name: "HSBC Bank", detail: "•••• 1004", value: "$3,200.11", mark: "H" },
  { name: "Barclays Bank", detail: "•••• 9912", value: "$1,450.00", mark: "B" },
  {
    name: "Bitcoin",
    detail: "Binance",
    value: "0.42 BTC · $24,150.00",
    mark: "₿",
  },
  {
    name: "Ethereum",
    detail: "MetaMask",
    value: "4.85 ETH · $12,420.10",
    mark: "Ξ",
  },
] as const;

export const financeBills = [
  { name: "Claude Pro Subscription", date: "October 24, 2026", mark: "C" },
  { name: "Resend Pro Team", date: "October 26, 2026", mark: "R" },
  { name: "Linear Plus Plan", date: "November 01, 2026", mark: "L" },
] as const;

export const financeTransactions = [
  {
    name: "Primary salary",
    date: "October 21, 2026",
    amount: 4560,
    type: "Income",
  },
  {
    name: "Groceries",
    date: "October 20, 2026",
    amount: -86.5,
    type: "Expense",
  },
  {
    name: "Freelance projects",
    date: "October 18, 2026",
    amount: 1412,
    type: "Income",
  },
  {
    name: "Utilities",
    date: "October 16, 2026",
    amount: -145,
    type: "Expense",
  },
] as const;
