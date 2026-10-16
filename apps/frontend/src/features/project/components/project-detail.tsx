import { CalendarDaysIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  formatProjectDate,
  isOverdue,
  projectPriorities,
  type Project,
} from "../project-model";
import { ProjectProgress, ProjectStatus } from "./project-meta";

export function ProjectDetail({
  project,
  today,
  onEdit,
  onDelete,
}: {
  project: Project;
  today: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-6">
        <div className="flex flex-wrap gap-2">
          <ProjectStatus status={project.status} />
          <Badge variant="outline">
            Prioritas {projectPriorities[project.priority].toLowerCase()}
          </Badge>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">Tentang project</h3>
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground">
            {project.description || "Belum ada deskripsi untuk project ini."}
          </p>
        </div>
        <Separator />
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 text-sm">
          {[
            ["Penanggung jawab", project.owner],
            ["Klien / tim", project.client || "—"],
            ["Tanggal mulai", formatProjectDate(project.startDate)],
            ["Tenggat", formatProjectDate(project.dueDate)],
          ].map(([label, value]) => (
            <div key={label} className="flex flex-col gap-1">
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="break-words font-medium">{value}</dd>
            </div>
          ))}
        </dl>
        {today && isOverdue(project, today) && (
          <p className="flex items-center gap-2 text-sm text-destructive">
            <CalendarDaysIcon className="size-4" />
            Project sudah melewati tenggat.
          </p>
        )}
        <Separator />
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium">Progres keseluruhan</h3>
          <ProjectProgress project={project} />
          <p className="text-xs text-muted-foreground">
            Progres diperbarui oleh project manager.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 border-t bg-muted/30 p-4 sm:px-6">
        <Button variant="destructive" onClick={onDelete}>
          <Trash2Icon data-icon="inline-start" />
          Hapus
        </Button>
        <Button onClick={onEdit}>
          <PencilIcon data-icon="inline-start" />
          Edit project
        </Button>
      </div>
    </>
  );
}
