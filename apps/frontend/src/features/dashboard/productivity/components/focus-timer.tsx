"use client";

import { PauseIcon, PlayIcon, RotateCcwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import type { useFocusTimer } from "../hooks/use-focus-timer";
import { formatClock } from "../utils/productivity";

const presets = [25, 50, 90] as const;
const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function FocusTimer({ timer }: { timer: ReturnType<typeof useFocusTimer> }) {
  const progress = 1 - timer.remaining / timer.duration;
  const started = timer.remaining < timer.duration;

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Focus session</CardTitle>
        <CardDescription>
          {timer.running
            ? "Notifications are muted until the timer ends"
            : started
              ? "Paused"
              : "Pick a length and start when ready"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-5">
        <div className="relative grid size-40 place-items-center">
          <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90" aria-hidden="true">
            <circle cx="60" cy="60" r={RADIUS} fill="none" strokeWidth="6" className="stroke-muted" />
            <circle
              cx="60"
              cy="60"
              r={RADIUS}
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              className="stroke-primary transition-[stroke-dashoffset] duration-1000 ease-linear motion-reduce:transition-none"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
            />
          </svg>
          <div className="flex flex-col items-center">
            <span
              className="text-4xl font-semibold tracking-tight tabular-nums"
              role="timer"
              aria-label={`${Math.ceil(timer.remaining / 60)} minutes remaining`}
            >
              {formatClock(timer.remaining)}
            </span>
            <span className="text-xs text-muted-foreground">
              of {timer.duration / 60} minutes
            </span>
          </div>
        </div>
        <ToggleGroup
          aria-label="Session length"
          variant="outline"
          size="sm"
          spacing={0}
          value={[String(timer.duration / 60)]}
          onValueChange={(values) => {
            const minutes = Number(values[0]);
            if (minutes) timer.dispatch({ type: "preset", minutes });
          }}
        >
          {presets.map((minutes) => (
            <ToggleGroupItem key={minutes} value={String(minutes)}>
              {minutes} min
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div className="flex w-full gap-2">
          <Button className="flex-1" onClick={() => timer.dispatch({ type: "toggle" })}>
            {timer.running ? <PauseIcon data-icon="inline-start" /> : <PlayIcon data-icon="inline-start" />}
            {timer.running ? "Pause" : started ? "Resume" : "Start focus"}
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Reset timer"
            disabled={!started}
            onClick={() => timer.dispatch({ type: "reset" })}
          >
            <RotateCcwIcon />
          </Button>
        </div>
        <p role="status" className="min-h-4 text-xs text-muted-foreground">
          {timer.sessions > 0 &&
            `${timer.sessions} ${timer.sessions === 1 ? "session" : "sessions"} finished today. Take a short break.`}
        </p>
      </CardContent>
    </Card>
  );
}
