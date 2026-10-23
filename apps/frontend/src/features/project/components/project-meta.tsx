import {
  CircleCheckIcon,
  CircleDashedIcon,
  CirclePauseIcon,
  LoaderCircleIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { projectStatuses } from "../utils/project";
import type { Project } from "../types/project";

const statusIcons = {
  planned: CircleDashedIcon,
  active: LoaderCircleIcon,
  "on-hold": CirclePauseIcon,
  completed: CircleCheckIcon,
};

export function ProjectStatus({ status }: { status: Project["status"] }) {
  const Icon = statusIcons[status];
  return (
    <Badge variant={status === "active" ? "default" : "secondary"}>
      <Icon data-icon="inline-start" />
      {projectStatuses[status]}
    </Badge>
  );
}

export function ProjectProgress({ project }: { project: Project }) {
  return (
    <div className="flex min-w-24 items-center gap-3">
      <Progress
        value={project.progress}
        aria-label={`Progres ${project.name}`}
        className="flex-1"
      />
      <span className="w-9 text-right text-xs tabular-nums text-muted-foreground">
        {project.progress}%
      </span>
    </div>
  );
}
