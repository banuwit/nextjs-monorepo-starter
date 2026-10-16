"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import {
  columns,
  taskTeams,
  taskOwnerOptions,
  type ColumnId,
  type Priority,
  type Task,
} from "@/mocks/task.mock";

export function TaskFormDialog({
  open,
  columnId,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  columnId: ColumnId;
  onOpenChange: (open: boolean) => void;
  onCreate: (task: Task, columnId: ColumnId) => void;
}) {
  const [formKey, setFormKey] = useState(0);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const target = String(form.get("status")) as ColumnId;
    const task: Task = {
      id: crypto.randomUUID(),
      title: String(form.get("title")).trim(),
      description: String(form.get("description")).trim(),
      priority: String(form.get("priority")) as Priority,
      dueDate: String(form.get("dueDate")),
      owner: taskOwnerOptions.find(
        (owner) => owner.name === String(form.get("owner")).trim(),
      ) ?? { name: String(form.get("owner")).trim(), tone: "" },
      team: taskTeams.find((team) => team === form.get("team")) ?? "Product",
      insights: [],
      progress: target === "shipped" ? 100 : 0,
    };
    if (!task.title || !task.owner.name || !task.dueDate) return;
    onCreate(task, target);
    setFormKey((value) => value + 1);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add task</DialogTitle>
          <DialogDescription>
            Create a task on this sample board.
          </DialogDescription>
        </DialogHeader>
        <form
          key={`${formKey}-${columnId}`}
          onSubmit={submit}
          className="flex flex-col gap-5"
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="task-title">Title</FieldLabel>
              <Input
                id="task-title"
                name="title"
                required
                maxLength={100}
                autoFocus
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="task-description">Description</FieldLabel>
              <Textarea
                id="task-description"
                name="description"
                rows={3}
                maxLength={500}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="task-owner">Owner</FieldLabel>
                <Input
                  id="task-owner"
                  name="owner"
                  required
                  defaultValue="Arham Khan"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="task-due">Due date</FieldLabel>
                <Input id="task-due" name="dueDate" type="date" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="task-priority">Priority</FieldLabel>
                <NativeSelect
                  id="task-priority"
                  name="priority"
                  defaultValue="Medium"
                  className="w-full"
                >
                  <NativeSelectOption>High</NativeSelectOption>
                  <NativeSelectOption>Medium</NativeSelectOption>
                  <NativeSelectOption>Low</NativeSelectOption>
                </NativeSelect>
              </Field>
              <Field>
                <FieldLabel htmlFor="task-team">Team</FieldLabel>
                <NativeSelect id="task-team" name="team" defaultValue="Product">
                  {taskTeams.map((team) => (
                    <NativeSelectOption key={team} value={team}>
                      {team}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="task-status">Status</FieldLabel>
              <NativeSelect
                id="task-status"
                name="status"
                defaultValue={columnId}
                className="w-full"
              >
                {columns.map((column) => (
                  <NativeSelectOption key={column.id} value={column.id}>
                    {column.title}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
