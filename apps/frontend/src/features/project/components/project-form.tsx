"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  getProjectErrors,
  projectPriorities,
  projectStatuses,
  todayDate,
  type Project,
  type ProjectErrors,
} from "../project-model";

export function ProjectForm({
  project,
  onSave,
  onCancel,
  onDirty,
  saveError,
}: {
  project?: Project;
  onSave: (project: Project) => void;
  onCancel: () => void;
  onDirty: () => void;
  saveError: string;
}) {
  const [status, setStatus] = useState<Project["status"]>(
    project?.status ?? "planned",
  );
  const [progress, setProgress] = useState(String(project?.progress ?? 0));
  const [errors, setErrors] = useState<ProjectErrors>({});

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const value = (key: string) => String(values.get(key) ?? "").trim();
    const next: Project = {
      id: project?.id ?? crypto.randomUUID(),
      name: value("name"),
      description: value("description"),
      client: value("client"),
      owner: value("owner"),
      status,
      priority: value("priority") as Project["priority"],
      startDate: value("startDate"),
      dueDate: value("dueDate"),
      progress:
        status === "completed"
          ? 100
          : progress.trim() === ""
            ? NaN
            : Number(progress),
    };
    const validation = getProjectErrors(next);
    setErrors(validation);
    const firstError = Object.keys(validation)[0];
    if (firstError) {
      form.querySelector<HTMLElement>(`[name="${firstError}"]`)?.focus();
      return;
    }
    onSave(next);
  }

  return (
    <form
      noValidate
      onSubmit={submit}
      onChange={onDirty}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="flex-1 overflow-y-auto p-6">
        <FieldGroup>
          {saveError && (
            <Alert variant="destructive">
              <AlertDescription>{saveError}</AlertDescription>
            </Alert>
          )}
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="project-name">Nama project *</FieldLabel>
            <Input
              id="project-name"
              name="name"
              defaultValue={project?.name}
              placeholder="Contoh: Customer portal"
              maxLength={100}
              required
              autoFocus
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "project-name-error" : undefined}
            />
            {errors.name && (
              <FieldError id="project-name-error">{errors.name}</FieldError>
            )}
          </Field>
          <Field data-invalid={!!errors.description}>
            <FieldLabel htmlFor="project-description">Deskripsi</FieldLabel>
            <Textarea
              id="project-description"
              name="description"
              defaultValue={project?.description}
              placeholder="Tujuan, ruang lingkup, atau catatan penting project…"
              rows={4}
              maxLength={2000}
              aria-invalid={!!errors.description}
              aria-describedby={
                errors.description ? "project-description-error" : undefined
              }
            />
            {errors.description && (
              <FieldError id="project-description-error">
                {errors.description}
              </FieldError>
            )}
          </Field>
          <FieldGroup className="grid gap-5 sm:grid-cols-2">
            <Field data-invalid={!!errors.owner}>
              <FieldLabel htmlFor="project-owner">
                Penanggung jawab *
              </FieldLabel>
              <Input
                id="project-owner"
                name="owner"
                defaultValue={project?.owner}
                placeholder="Nama project manager"
                maxLength={80}
                required
                aria-invalid={!!errors.owner}
                aria-describedby={
                  errors.owner ? "project-owner-error" : undefined
                }
              />
              {errors.owner && (
                <FieldError id="project-owner-error">{errors.owner}</FieldError>
              )}
            </Field>
            <Field data-invalid={!!errors.client}>
              <FieldLabel htmlFor="project-client">Klien / tim</FieldLabel>
              <Input
                id="project-client"
                name="client"
                defaultValue={project?.client}
                placeholder="Contoh: Internal"
                maxLength={100}
                aria-invalid={!!errors.client}
                aria-describedby={
                  errors.client ? "project-client-error" : undefined
                }
              />
              {errors.client && (
                <FieldError id="project-client-error">
                  {errors.client}
                </FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="project-status">Status *</FieldLabel>
              <NativeSelect
                id="project-status"
                name="status"
                value={status}
                onChange={(event) => {
                  const next = event.target.value as Project["status"];
                  setStatus(next);
                  if (next === "completed") setProgress("100");
                }}
              >
                {Object.entries(projectStatuses).map(([value, label]) => (
                  <NativeSelectOption key={value} value={value}>
                    {label}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
            <Field>
              <FieldLabel htmlFor="project-priority">Prioritas *</FieldLabel>
              <NativeSelect
                id="project-priority"
                name="priority"
                defaultValue={project?.priority ?? "medium"}
              >
                {Object.entries(projectPriorities).map(([value, label]) => (
                  <NativeSelectOption key={value} value={value}>
                    {label}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
            <Field data-invalid={!!errors.startDate}>
              <FieldLabel htmlFor="project-start">Tanggal mulai *</FieldLabel>
              <Input
                id="project-start"
                name="startDate"
                type="date"
                defaultValue={project?.startDate ?? todayDate()}
                required
                aria-invalid={!!errors.startDate}
                aria-describedby={
                  errors.startDate ? "project-start-error" : undefined
                }
              />
              {errors.startDate && (
                <FieldError id="project-start-error">
                  {errors.startDate}
                </FieldError>
              )}
            </Field>
            <Field data-invalid={!!errors.dueDate}>
              <FieldLabel htmlFor="project-due">Tenggat *</FieldLabel>
              <Input
                id="project-due"
                name="dueDate"
                type="date"
                defaultValue={project?.dueDate}
                required
                aria-invalid={!!errors.dueDate}
                aria-describedby={
                  errors.dueDate ? "project-due-error" : undefined
                }
              />
              {errors.dueDate && (
                <FieldError id="project-due-error">{errors.dueDate}</FieldError>
              )}
            </Field>
          </FieldGroup>
          <Field data-invalid={!!errors.progress}>
            <FieldLabel htmlFor="project-progress">Progres (%) *</FieldLabel>
            <Input
              id="project-progress"
              name="progress"
              type="number"
              min={0}
              max={100}
              step={1}
              value={progress}
              onChange={(event) => setProgress(event.target.value)}
              readOnly={status === "completed"}
              required
              aria-invalid={!!errors.progress}
              aria-describedby="project-progress-help"
            />
            <p
              id="project-progress-help"
              className="text-xs text-muted-foreground"
            >
              {errors.progress ??
                (status === "completed"
                  ? "Project selesai otomatis memiliki progres 100%."
                  : "Perbarui secara manual sesuai perkembangan project.")}
            </p>
          </Field>
        </FieldGroup>
      </div>
      <div className="flex items-center justify-between gap-3 border-t bg-muted/30 p-4 sm:px-6">
        <p className="text-xs text-muted-foreground">* Wajib diisi</p>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button type="submit">
            {project ? "Simpan perubahan" : "Buat project"}
          </Button>
        </div>
      </div>
    </form>
  );
}
