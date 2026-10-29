import { RepeatIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/features/dashboard/components/status-badge";
import { daysBetween, formatShortDate, usd, usdWhole } from "@/features/dashboard/utils/format";
import { financeBills } from "@/mocks/dashboard-finance.mock";

import { dueLabel } from "../utils/finance";

export function FinanceBills({ today }: { today: string }) {
  const bills = [...financeBills].sort((a, b) => a.due.localeCompare(b.due));
  const total = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const manual = bills.filter((bill) => !bill.autopay);

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Upcoming bills</CardTitle>
        <CardDescription>Next 14 days</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          <span className="text-xl font-semibold text-foreground">{usdWhole.format(total)}</span>{" "}
          due, {manual.length} {manual.length === 1 ? "needs" : "need"} manual payment
        </p>
        <ul className="flex flex-col divide-y">
          {bills.map((bill) => {
            const soon = daysBetween(today, bill.due) <= 2;
            return (
              <li key={bill.name} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{bill.name}</p>
                  <p className="text-xs text-muted-foreground">
                    <time dateTime={bill.due} title={formatShortDate(bill.due)}>
                      {dueLabel(bill.due, today)}
                    </time>
                  </p>
                </div>
                {bill.autopay ? (
                  <StatusBadge tone="neutral" icon={RepeatIcon}>
                    Autopay
                  </StatusBadge>
                ) : (
                  soon && <StatusBadge tone="warning">Pay soon</StatusBadge>
                )}
                <span className="w-20 text-right text-sm font-medium tabular-nums">
                  {usd.format(bill.amount)}
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
