"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Department, Employee } from "../types/structure";
import { departments } from "../utils/structure";
import { EmployeeAvatar } from "./structure-elements";

export function EmployeeInspector({
  employee,
  manager,
  line,
  reports,
  startEditing = false,
  onSave,
  onDelete,
  onClose,
  onSelect,
}: {
  employee: Employee;
  manager?: Employee;
  /** Managers from the root down to this employee's manager. */
  line: Employee[];
  reports: Employee[];
  startEditing?: boolean;
  onSave: (employee: Employee) => void;
  onDelete: () => void;
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  const [editing, setEditing] = useState(
    startEditing || employee.name === "New position",
  );
  const [name, setName] = useState(employee.name);
  const [title, setTitle] = useState(employee.title);
  const [department, setDepartment] = useState(employee.department);
  const [email, setEmail] = useState(employee.email);
  const [location, setLocation] = useState(employee.location);

  function reset() {
    setName(employee.name);
    setTitle(employee.title);
    setDepartment(employee.department);
    setEmail(employee.email);
    setLocation(employee.location);
  }

  return (
    <div className="flex flex-col gap-5 p-4">
      <div className="flex items-center gap-3">
        <EmployeeAvatar employee={employee} className="size-11" />
        <div className="min-w-0">
          <h2 className="truncate font-semibold">{employee.name}</h2>
          <p className="truncate text-xs text-muted-foreground">
            {employee.title} · {employee.department}
          </p>
        </div>
      </div>
      {editing ? (
        <form
          className="flex flex-col gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            if (!name.trim() || !title.trim()) return;
            onSave({
              ...employee,
              name: name.trim(),
              title: title.trim(),
              department,
              email: email.trim(),
              location: location.trim(),
            });
            setEditing(false);
          }}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="employee-name">Name</FieldLabel>
              <Input
                id="employee-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={80}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="employee-title">Job title</FieldLabel>
              <Input
                id="employee-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={80}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="employee-department">Department</FieldLabel>
              <Select
                value={department}
                onValueChange={(value) => {
                  if (value) setDepartment(value as Department);
                }}
              >
                <SelectTrigger id="employee-department" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {departments.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="employee-email">Email</FieldLabel>
              <Input
                id="employee-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={120}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="employee-location">Location</FieldLabel>
              <Input
                id="employee-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                maxLength={60}
              />
            </Field>
          </FieldGroup>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setEditing(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || !title.trim()}>
              Save employee
            </Button>
          </div>
        </form>
      ) : (
        <>
          <h3 className="text-sm font-medium">Employee</h3>
          <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-4 text-sm">
            <dt className="text-muted-foreground">Email</dt>
            <dd className="break-all">{employee.email || "—"}</dd>
            <dt className="text-muted-foreground">Location</dt>
            <dd>{employee.location || "—"}</dd>
            <dt className="text-muted-foreground">Reports to</dt>
            <dd>
              {manager ? (
                <button
                  type="button"
                  className="text-left text-primary-text underline-offset-4 hover:underline"
                  onClick={() => onSelect(manager.id)}
                >
                  {manager.name}
                </button>
              ) : (
                "— (top of the organisation)"
              )}
            </dd>
            <dt className="text-muted-foreground">Reporting line</dt>
            <dd>
              {line.length ? line.map((item) => item.name).join(" › ") : "—"}
            </dd>
            <dt className="text-muted-foreground">Direct reports</dt>
            <dd>
              {reports.length ? (
                <ul className="flex flex-col gap-1">
                  {reports.map((report) => (
                    <li key={report.id}>
                      <button
                        type="button"
                        className="text-left text-primary-text underline-offset-4 hover:underline"
                        onClick={() => onSelect(report.id)}
                      >
                        {report.name}
                      </button>
                      <span className="text-muted-foreground"> · {report.title}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                "None"
              )}
            </dd>
          </dl>
          <Button
            variant="outline"
            onClick={() => {
              reset();
              setEditing(true);
            }}
          >
            Edit employee
          </Button>
          {employee.parent && (
            <Button variant="destructive" onClick={onDelete}>
              Remove position
            </Button>
          )}
        </>
      )}
      <Button variant="ghost" onClick={onClose}>
        Close details
      </Button>
    </div>
  );
}
