import { MailIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/features/dashboard/components/status-badge";
import { usdWhole } from "@/features/dashboard/utils/format";
import type { DashboardCustomer } from "@/mocks/dashboard-main.mock";

import { summarizeBilling } from "../utils/customers";
import { billingStyles } from "./customer-status";

export function CustomerAttention({
  customers,
}: {
  customers: readonly DashboardCustomer[];
}) {
  const summary = summarizeBilling(customers);
  const overdue = customers.filter((customer) => customer.billing === "Overdue");

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Needs attention</CardTitle>
        <CardDescription>Billing issues to resolve this week</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-lg bg-border ring-1 ring-border">
          {summary.map((item) => {
            const style = billingStyles[item.billing];
            return (
              <div key={item.billing} className="flex flex-col gap-1 bg-card p-3">
                <dt>
                  <StatusBadge tone={style.tone} icon={style.icon}>
                    {item.billing}
                  </StatusBadge>
                </dt>
                <dd className="text-xl font-semibold">{item.count}</dd>
                <dd className="text-xs text-muted-foreground">
                  {item.count === 1 ? "account" : "accounts"}
                </dd>
              </div>
            );
          })}
        </dl>

        <div className="flex flex-col gap-2">
          <p className="text-sm">
            <span className="font-medium">
              {usdWhole.format(overdue.reduce((sum, row) => sum + row.mrr, 0))}
            </span>{" "}
            <span className="text-muted-foreground">monthly revenue at risk</span>
          </p>
          <ul className="flex flex-col divide-y">
            {overdue.map((customer) => (
              <li key={customer.id} className="flex items-center gap-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{customer.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {customer.plan} plan, {usdWhole.format(customer.mrr)}/mo
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  nativeButton={false}
                  render={
                    <a
                      href={`mailto:${customer.email}?subject=${encodeURIComponent("Your payment did not go through")}`}
                    />
                  }
                  aria-label={`Email ${customer.name} about the failed payment`}
                >
                  <MailIcon data-icon="inline-start" />
                  Remind
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
