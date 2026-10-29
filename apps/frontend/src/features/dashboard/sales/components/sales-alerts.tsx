"use client";

import { useState } from "react";
import { CheckIcon, CircleAlertIcon, InfoIcon, TriangleAlertIcon, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { salesAlerts, type SalesAlert } from "@/mocks/dashboard-sales.mock";

const severity: Record<SalesAlert["severity"], { icon: LucideIcon; className: string; label: string }> = {
  danger: { icon: CircleAlertIcon, className: "text-destructive", label: "Urgent" },
  warning: { icon: TriangleAlertIcon, className: "text-amber-600 dark:text-amber-400", label: "Warning" },
  info: { icon: InfoIcon, className: "text-sky-600 dark:text-sky-400", label: "Note" },
};

export function SalesAlerts() {
  const [handled, setHandled] = useState<string[]>([]);
  const open = salesAlerts.filter((alert) => !handled.includes(alert.id));

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Alerts</CardTitle>
        <CardDescription aria-live="polite">
          {open.length ? `${open.length} need a look` : "All clear"}
        </CardDescription>
        {handled.length > 0 && (
          <CardAction>
            <Button variant="ghost" size="sm" onClick={() => setHandled([])}>
              Show handled
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        {open.length ? (
          <ul className="flex flex-col divide-y">
            {open.map((alert) => {
              const style = severity[alert.severity];
              return (
                <li key={alert.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                  <style.icon className={cn("mt-0.5 size-4 shrink-0", style.className)} aria-label={style.label} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">{alert.detail}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Mark "${alert.title}" as handled`}
                    onClick={() => setHandled((current) => [...current, alert.id])}
                  >
                    <CheckIcon />
                  </Button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
            <CheckIcon className="size-4 text-emerald-600" aria-hidden="true" />
            Nothing needs attention right now.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
