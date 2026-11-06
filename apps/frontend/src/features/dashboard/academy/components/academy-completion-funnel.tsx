import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { academyFunnel } from "@/mocks/dashboard-academy.mock";

import { describeFunnel, percent } from "../utils/academy";
import { integer } from "../utils/format";

/** Full Tailwind classes per step so the funnel darkens as it narrows. */
const stepTone = [
  "bg-chart-1/40",
  "bg-chart-1/55",
  "bg-chart-1/70",
  "bg-chart-1/85",
  "bg-chart-1",
] as const;

export function AcademyCompletionFunnel() {
  const steps = describeFunnel(academyFunnel);
  const top = steps[0]?.count ?? 0;
  const bottom = steps.at(-1)?.count ?? 0;

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Completion funnel</CardTitle>
        <CardDescription>
          {percent(bottom, top)}% of enrolled learners reach a certificate
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-center">
        <ol className="flex flex-col gap-3">
          {steps.map((step, index) => (
            <li key={step.id} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium">{step.label}</span>
                <span className="shrink-0 tabular-nums">
                  <span className="font-semibold">
                    {integer.format(step.count)}
                  </span>
                  <span className="text-muted-foreground">
                    {index === 0 ? " enrolled" : ` · -${step.dropOff}%`}
                  </span>
                </span>
              </div>
              <div
                role="meter"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={step.share}
                aria-label={`${step.label}, ${step.share}% of enrolled learners`}
                className="flex h-7 justify-center"
              >
                <div
                  className={cn(
                    "h-full rounded-md transition-[width]",
                    stepTone[index] ?? "bg-chart-1",
                  )}
                  style={{ width: `${Math.max(step.share, 6)}%` }}
                />
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs text-muted-foreground">
          Drop-off is measured against the previous step. Largest loss: Started
          → Halfway.
        </p>
      </CardContent>
    </Card>
  );
}
