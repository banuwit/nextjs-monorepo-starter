"use client";

import { useState } from "react";
import { CalendarDaysIcon, PlusIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { productivityTasks } from "@/mocks/dashboard-productivity.mock";

const taskPeriods = [
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "this-week", label: "This Week" },
];

export function ProductivityTasks() {
  const [tasks, setTasks] = useState(productivityTasks);

  return (
    <section className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl tracking-tight">Tasks</h2>
        <div className="flex items-center gap-2">
          <Select defaultValue="today" items={taskPeriods}>
            <SelectTrigger className="w-30" aria-label="Task period">
              <SelectValue placeholder="Today" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {taskPeriods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>{period.label}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button>
            <PlusIcon data-icon="inline-start" />
            New Task
          </Button>
        </div>
      </div>
      <div className="divide-y overflow-hidden rounded-xl border bg-background shadow-xs">
        {tasks.map((task) => (
          <div key={task.title} className="flex items-center gap-3 p-4">
            <Checkbox
              checked={task.checked}
              aria-label={task.title}
              onCheckedChange={(checked) =>
                setTasks((current) =>
                  current.map((item) =>
                    item.title === task.title
                      ? { ...item, checked: checked === true }
                      : item,
                  ),
                )
              }
            />
            <div className="flex min-w-0 flex-1 flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 flex-wrap items-center gap-2 lg:gap-4">
                <span className={task.checked ? "truncate text-sm text-muted-foreground line-through" : "truncate text-sm"}>
                  {task.title}
                </span>
                <Badge variant="outline" className="px-3 py-1 font-normal">
                  {task.tag}
                </Badge>
              </div>
              <div className="flex shrink-0 items-center gap-3 text-sm text-muted-foreground">
                <span>{task.time}</span>
                <CalendarDaysIcon className="size-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
