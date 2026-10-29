"use client";

import { useState, type ReactNode } from "react";

import { KpiStrip } from "@/features/dashboard/components/kpi-strip";
import {
  productivityFocusLoggedMinutes,
  productivityGoals,
  productivityTasks,
  type ProductivityTask,
} from "@/mocks/dashboard-productivity.mock";

import { useFocusTimer } from "../hooks/use-focus-timer";
import { formatMinutes } from "../utils/productivity";
import { FocusTimer } from "./focus-timer";
import { ProductivityTasks } from "./productivity-tasks";

/** Owns task and timer state so the summary row reflects them live. */
export function ProductivityWorkspace({
  main,
  aside,
}: {
  main: ReactNode;
  aside: ReactNode;
}) {
  const [tasks, setTasks] = useState<ProductivityTask[]>(productivityTasks);
  const timer = useFocusTimer(25);
  const done = tasks.filter((task) => task.done).length;
  const focusMinutes = productivityFocusLoggedMinutes + timer.completedMinutes;

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="flex min-w-0 flex-col gap-4">
        <KpiStrip
          label="Today at a glance"
          items={[
            {
              label: "Tasks done",
              value: `${done} of ${tasks.length}`,
              context: done === tasks.length ? "All clear for today" : `${tasks.length - done} still open`,
            },
            {
              label: "Focus time",
              value: formatMinutes(focusMinutes),
              context: "Goal: 3h of deep work",
            },
            {
              label: "Weekly goals",
              value: `${productivityGoals.completed} of ${productivityGoals.total}`,
              context: `${productivityGoals.total - productivityGoals.completed} left this week`,
            },
          ]}
        />
        <ProductivityTasks
          tasks={tasks}
          onToggle={(id, checked) =>
            setTasks((current) =>
              current.map((task) => (task.id === id ? { ...task, done: checked } : task)),
            )
          }
          onAdd={({ title, tag }) =>
            setTasks((current) => [
              ...current,
              { id: `task-${current.length + 1}-${title}`, title, tag, time: "", done: false },
            ])
          }
        />
        {main}
      </div>
      <aside className="flex min-w-0 flex-col gap-4" aria-label="Focus and schedule">
        <FocusTimer timer={timer} />
        {aside}
      </aside>
    </div>
  );
}
