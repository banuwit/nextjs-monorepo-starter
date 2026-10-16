import { CalendarDaysIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  formatProjectDate,
  isOverdue,
  projectPriorities,
  type Project,
} from "../project-model";
import { ProjectProgress, ProjectStatus } from "./project-meta";

export function ProjectCards({
  projects,
  today,
  onView,
  onEdit,
  onDelete,
}: {
  projects: Project[];
  today: string;
  onView: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}) {
  return (
    <div
      aria-label="Project dalam tampilan card"
      className="grid grid-cols-1 gap-4 bg-muted/20 p-4 md:grid-cols-2 xl:grid-cols-4 sm:p-5"
    >
      {projects.map((project) => {
        const overdue = !!today && isOverdue(project, today);
        return (
          <Card key={project.id} className="min-w-0">
            <CardHeader className="gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <ProjectStatus status={project.status} />
                <Badge variant="outline">
                  {projectPriorities[project.priority]}
                </Badge>
              </div>
              <div className="flex flex-col gap-1">
                <CardTitle>
                  <button
                    onClick={() => onView(project)}
                    className="w-full break-words rounded-sm text-left underline-offset-4 hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    {project.name}
                  </button>
                </CardTitle>
                <CardDescription className="truncate">
                  {project.client || "Tanpa klien / tim"}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-5">
              <p className="line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
                {project.description || "Belum ada deskripsi project."}
              </p>
              <div className="mt-auto flex flex-col gap-2">
                <span className="text-xs text-muted-foreground">Progres</span>
                <ProjectProgress project={project} />
              </div>
              <div className="flex min-w-0 items-center gap-2">
                <Avatar className="size-7">
                  <AvatarFallback>
                    {project.owner
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate text-sm">{project.owner}</span>
              </div>
            </CardContent>
            <CardFooter className="flex-wrap justify-between gap-2">
              <div
                className={cn(
                  "flex flex-col gap-1 text-xs",
                  overdue ? "text-destructive" : "text-muted-foreground",
                )}
              >
                <span className="flex items-center gap-1.5">
                  <CalendarDaysIcon className="size-3.5" />
                  {formatProjectDate(project.dueDate)}
                </span>
                {overdue && <span className="font-medium">Lewat tenggat</span>}
              </div>
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
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
