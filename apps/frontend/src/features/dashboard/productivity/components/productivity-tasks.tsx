"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { productivityTaskTags, type ProductivityTask } from "@/mocks/dashboard-productivity.mock";

import { taskTitleError } from "../utils/productivity";

const views = ["Open", "Done", "All"] as const;
type View = (typeof views)[number];

export function ProductivityTasks({
  tasks,
  onToggle,
  onAdd,
}: {
  tasks: ProductivityTask[];
  onToggle: (id: string, done: boolean) => void;
  onAdd: (task: Pick<ProductivityTask, "title" | "tag">) => void;
}) {
  const [view, setView] = useState<View>("Open");
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState<string>(productivityTaskTags[0]);
  const [error, setError] = useState<string | null>(null);

  const visible = tasks.filter((task) =>
    view === "All" ? true : view === "Done" ? task.done : !task.done,
  );
  const counts = {
    Open: tasks.filter((task) => !task.done).length,
    Done: tasks.filter((task) => task.done).length,
    All: tasks.length,
  };

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Today&apos;s tasks</CardTitle>
        <CardDescription>
          {counts.Done} of {counts.All} done
        </CardDescription>
        <CardAction>
          <ToggleGroup
            aria-label="Show tasks"
            variant="outline"
            size="sm"
            spacing={0}
            value={[view]}
            onValueChange={(values) => {
              const next = views.find((item) => item === values[0]);
              if (next) setView(next);
            }}
          >
            {views.map((item) => (
              <ToggleGroupItem key={item} value={item}>
                {item}
                <span className="ml-1 text-muted-foreground tabular-nums">{counts[item]}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <form
          noValidate
          className="flex flex-col gap-1.5"
          onSubmit={(event) => {
            event.preventDefault();
            const message = taskTitleError(title);
            setError(message);
            if (message) return;
            onAdd({ title: title.trim(), tag });
            setTitle("");
            setView((current) => (current === "Done" ? "Open" : current));
          }}
        >
          <div className="flex flex-wrap gap-2">
            <Input
              className="basis-full sm:basis-0 sm:flex-1"
              aria-label="New task"
              placeholder="Add a task for today"
              value={title}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "task-title-error" : undefined}
              onChange={(event) => {
                setTitle(event.target.value);
                setError(null);
              }}
            />
            <NativeSelect
              aria-label="Task tag"
              className="w-32 flex-1 sm:flex-none"
              value={tag}
              onChange={(event) => setTag(event.target.value)}
            >
              {productivityTaskTags.map((item) => (
                <NativeSelectOption key={item} value={item}>
                  {item}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <Button type="submit">
              <PlusIcon data-icon="inline-start" />
              Add
            </Button>
          </div>
          {error && (
            <p id="task-title-error" role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
        </form>
        {visible.length ? (
          <ul className="flex flex-col divide-y">
            {visible.map((task) => (
              <li key={task.id} className="flex items-center gap-3 py-3 last:pb-0">
                <Checkbox
                  id={task.id}
                  checked={task.done}
                  onCheckedChange={(checked) => onToggle(task.id, checked === true)}
                />
                <label
                  htmlFor={task.id}
                  className={cn(
                    "min-w-0 flex-1 cursor-pointer truncate text-sm",
                    task.done && "text-muted-foreground line-through",
                  )}
                >
                  {task.title}
                </label>
                <Badge variant="outline" className="font-normal">
                  {task.tag}
                </Badge>
                <span className="w-12 text-right text-sm text-muted-foreground tabular-nums">
                  {task.time || "Today"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {view === "Open"
              ? "Everything on today's list is done."
              : "Nothing finished yet. Tick a task when it's done."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
