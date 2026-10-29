import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usd, usdWhole } from "@/features/dashboard/utils/format";
import { financeIncome, financeSpentThisMonth } from "@/mocks/dashboard-finance.mock";

const total = financeIncome.reduce((sum, source) => sum + source.amount, 0);
const share = (amount: number) => Math.round((amount / total) * 100);

export function FinanceIncome() {
  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Income this month</CardTitle>
        <CardDescription>Where your money came from</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-5">
        <p className="text-xl font-semibold">{usdWhole.format(total)}</p>
        <div
          role="img"
          aria-label={financeIncome
            .map((source) => `${source.label} ${share(source.amount)}%`)
            .join(", ")}
          className="flex h-3 gap-0.5 overflow-hidden rounded-full"
        >
          {financeIncome.map((source) => (
            <span
              key={source.label}
              style={{ backgroundColor: source.color, width: `${share(source.amount)}%` }}
            />
          ))}
        </div>
        <ul className="flex flex-col gap-3">
          {financeIncome.map((source) => (
            <li key={source.label} className="flex items-center gap-2 text-sm">
              <span
                aria-hidden="true"
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: source.color }}
              />
              <span className="min-w-0 flex-1 truncate">{source.label}</span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {share(source.amount)}%
              </span>
              <span className="w-20 text-right font-medium tabular-nums">
                {usd.format(source.amount)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-baseline justify-between gap-3 rounded-lg bg-muted/60 px-3 py-2.5 text-sm">
          <span className="text-muted-foreground">
            Left after {usdWhole.format(financeSpentThisMonth)} spending
          </span>
          <span className="font-semibold tabular-nums">
            {usdWhole.format(total - financeSpentThisMonth)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
