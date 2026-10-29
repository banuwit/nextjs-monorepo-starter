import { ArrowDownLeftIcon, ArrowUpRightIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatShortDate, usd } from "@/features/dashboard/utils/format";
import { cn } from "@/lib/utils";
import { financeTransactions } from "@/mocks/dashboard-finance.mock";

export function FinanceTransactions() {
  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Recent transactions</CardTitle>
        <CardDescription>Last 10 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col divide-y">
          {financeTransactions.map((transaction) => {
            const income = transaction.amount > 0;
            const Icon = income ? ArrowDownLeftIcon : ArrowUpRightIcon;
            return (
              <li key={transaction.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full",
                    income
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{transaction.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.category}, {formatShortDate(transaction.date)}
                  </p>
                </div>
                <span
                  className={cn(
                    "text-sm font-medium tabular-nums",
                    income && "text-emerald-700 dark:text-emerald-400",
                  )}
                >
                  <span className="sr-only">{income ? "Received" : "Spent"} </span>
                  {income ? "+" : "−"}
                  {usd.format(Math.abs(transaction.amount))}
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
