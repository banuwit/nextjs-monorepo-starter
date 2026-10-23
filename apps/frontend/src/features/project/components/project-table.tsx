"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PencilIcon, Trash2Icon } from "lucide-react";
import {
  formatProjectDate,
  isOverdue,
  projectPriorities,
} from "../utils/project";
import type { Project } from "../types/project";
import { ProjectProgress, ProjectStatus } from "./project-meta";

export function ProjectTable({
  projects,
  today,
  loading,
  onView,
  onEdit,
  onDelete,
}: {
  projects: Project[];
  today: string;
  loading: boolean;
  onView: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Penanggung jawab</TableHead>
          <TableHead>Prioritas</TableHead>
          <TableHead>Progres</TableHead>
          <TableHead>Tenggat</TableHead>
          <TableHead>
            <span className="sr-only">Aksi</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell
              colSpan={7}
              className="py-8 text-center text-muted-foreground"
            >
              Memuat project…
            </TableCell>
          </TableRow>
        ) : projects.length ? (
          projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>
                <div className="flex flex-col items-start gap-1 py-2">
                  <button
                    onClick={() => onView(project)}
                    className="max-w-full truncate rounded-sm text-left font-medium underline-offset-4 hover:text-primary-text hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    {project.name}
                  </button>
                  <span className="max-w-full truncate text-xs text-muted-foreground">
                    {project.client || "Tanpa klien / tim"}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <ProjectStatus status={project.status} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="size-7">
                    <AvatarFallback>
                      {project.owner
                        .split(/\s+/)
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{project.owner}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    project.priority === "high" ? "outline" : "secondary"
                  }
                >
                  {projectPriorities[project.priority]}
                </Badge>
              </TableCell>
              <TableCell>
                <ProjectProgress project={project} />
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span>{formatProjectDate(project.dueDate)}</span>
                  {today && isOverdue(project, today) && (
                    <span className="text-xs font-medium text-destructive">
                      Lewat tenggat
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit ${project.name}`}
                    onClick={() => onEdit(project)}
                  >
                    <PencilIcon />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Hapus ${project.name}`}
                    onClick={() => onDelete(project)}
                  >
                    <Trash2Icon />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={7}
              className="py-8 text-center text-muted-foreground"
            >
              Tidak ada project.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
