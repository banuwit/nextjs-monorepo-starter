import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usdWhole } from "../utils/format";
import { financeAccounts } from "@/mocks/dashboard-finance.mock";

const total = financeAccounts.reduce((sum, account) => sum + account.balance, 0);
const share = (value: number) => (value / total) * 100;

export function FinanceAccounts() {
  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Accounts</CardTitle>
        <CardDescription>
          {usdWhole.format(total)} across {financeAccounts.length} accounts
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div
          role="img"
          aria-label={financeAccounts
            .map((account) => `${account.name} ${share(account.balance).toFixed(0)}%`)
            .join(", ")}
          className="flex h-3 gap-0.5 overflow-hidden rounded-full"
        >
          {financeAccounts.map((account) => (
            <span
              key={account.name}
              style={{ backgroundColor: account.color, width: `${share(account.balance)}%` }}
            />
          ))}
        </div>
        <ul className="flex flex-col divide-y">
          {financeAccounts.map((account) => (
            <li key={account.name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <span
                aria-hidden="true"
                className="h-8 w-1 shrink-0 rounded-full"
                style={{ backgroundColor: account.color }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{account.name}</p>
                <p className="text-xs text-muted-foreground">
                  {account.institution} ending {account.last4}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium tabular-nums">
                  {usdWhole.format(account.balance)}
                </p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {share(account.balance).toFixed(1)}%
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
