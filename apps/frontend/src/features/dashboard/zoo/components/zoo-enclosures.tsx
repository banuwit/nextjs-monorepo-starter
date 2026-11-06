import { DropletsIcon, ThermometerIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { zooEnclosures } from "@/mocks/dashboard-zoo.mock";

import { enclosureStatusStyles, isOverLimit } from "../utils/zoo";
import { Sparkline } from "./sparkline";
import { StatusBadge } from "./status-badge";

function Reading({
  icon: Icon,
  label,
  values,
  unit,
  limit,
  over,
}: {
  icon: typeof ThermometerIcon;
  label: string;
  values: readonly number[];
  unit: string;
  limit: number;
  over: boolean;
}) {
  const latest = values.at(-1) ?? 0;
  return (
    <div className="flex items-center gap-3">
      <Icon
        aria-hidden="true"
        className="size-4 shrink-0 text-muted-foreground"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-xs text-muted-foreground">
          {label} · limit {limit}
          {unit}
        </span>
        <span
          className={cn(
            "text-sm font-semibold tabular-nums",
            over && "text-destructive",
          )}
        >
          {latest}
          {unit}
          {over && <span className="sr-only"> (above limit)</span>}
        </span>
      </div>
      <Sparkline values={values} className="shrink-0" />
    </div>
  );
}

export function ZooEnclosures() {
  const open = zooEnclosures.filter(
    (enclosure) => enclosure.status === "open",
  ).length;
  const closed = zooEnclosures.filter(
    (enclosure) => enclosure.status === "cleaning",
  ).length;

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Enclosures</CardTitle>
        <CardDescription>
          {open} of {zooEnclosures.length} open to visitors
          {closed ? `, ${closed} closed for cleaning` : ""}. Readings from the
          last hour.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {zooEnclosures.map((enclosure) => {
            const style = enclosureStatusStyles[enclosure.status];
            const over = isOverLimit(enclosure);
            return (
              <li
                key={enclosure.id}
                className={cn(
                  "flex flex-col gap-3 rounded-lg border border-border p-3",
                  (over.temp || over.humidity) && "border-destructive/40",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {enclosure.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {enclosure.zone} · {enclosure.species} species
                    </p>
                  </div>
                  <StatusBadge
                    tone={style.tone}
                    icon={style.icon}
                    className="shrink-0"
                  >
                    {style.label}
                  </StatusBadge>
                </div>
                <Reading
                  icon={ThermometerIcon}
                  label="Temp"
                  values={enclosure.temp}
                  unit="°C"
                  limit={enclosure.maxTemp}
                  over={over.temp}
                />
                <Reading
                  icon={DropletsIcon}
                  label="Humidity"
                  values={enclosure.humidity}
                  unit="%"
                  limit={enclosure.maxHumidity}
                  over={over.humidity}
                />
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
