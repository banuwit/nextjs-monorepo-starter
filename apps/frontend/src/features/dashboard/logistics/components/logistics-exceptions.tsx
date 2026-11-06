"use client";

import { useState } from "react";
import {
  CheckIcon,
  CircleAlertIcon,
  InfoIcon,
  TriangleAlertIcon,
  type LucideIcon,
} from "lucide-react";

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
import { logisticsExceptions } from "@/mocks/dashboard-logistics.mock";

import type { LogisticsException } from "../types/logistics";

const severity: Record<
  LogisticsException["severity"],
  { icon: LucideIcon; className: string; label: string }
> = {
  danger: {
    icon: CircleAlertIcon,
    className: "text-destructive",
    label: "Urgent",
  },
  warning: {
    icon: TriangleAlertIcon,
    className: "text-amber-600 dark:text-amber-400",
    label: "Warning",
  },
  info: {
    icon: InfoIcon,
    className: "text-sky-600 dark:text-sky-400",
    label: "Note",
  },
};

function ago(minutes: number) {
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours} h ${minutes % 60} min ago`;
}

export function LogisticsExceptions() {
  const [acknowledged, setAcknowledged] = useState<string[]>([]);
  const open = logisticsExceptions.filter(
    (item) => !acknowledged.includes(item.id),
  );

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Exceptions</CardTitle>
        <CardDescription aria-live="polite">
          {open.length ? `${open.length} open` : "All clear"}
        </CardDescription>
        {acknowledged.length > 0 && (
          <CardAction>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAcknowledged([])}
            >
              Show acknowledged
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        {open.length ? (
          <ul className="flex flex-col divide-y">
            {open.map((item) => {
              const style = severity[item.severity];
              return (
                <li
                  key={item.id}
                  className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <style.icon
                    className={cn("mt-0.5 size-4 shrink-0", style.className)}
                    aria-label={style.label}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.detail}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                      {item.routeId ? `${item.routeId} · ` : ""}
                      {ago(item.minutesAgo)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Acknowledge "${item.title}"`}
                    onClick={() =>
                      setAcknowledged((current) => [...current, item.id])
                    }
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
            No open exceptions.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
