import {
  BoxIcon,
  CalendarDaysIcon,
  CloudIcon,
  DropletIcon,
  HardDriveIcon,
  HashIcon,
  NotebookTextIcon,
  type LucideIcon,
  VideoIcon,
  WebcamIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

// Ikon generik pengganti logo merek, dengan aksen semantik per aplikasi.
const appLogos: Record<string, { icon: LucideIcon; className: string }> = {
  drive: {
    icon: HardDriveIcon,
    className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  },
  slack: {
    icon: HashIcon,
    className: "bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300",
  },
  calendar: {
    icon: CalendarDaysIcon,
    className: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  },
  dropbox: {
    icon: DropletIcon,
    className: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  },
  onedrive: {
    icon: CloudIcon,
    className: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
  },
  box: {
    icon: BoxIcon,
    className: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300",
  },
  zoom: {
    icon: VideoIcon,
    className: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  },
  loom: {
    icon: WebcamIcon,
    className: "bg-orange-500/15 text-orange-700 dark:text-orange-300",
  },
  notion: {
    icon: NotebookTextIcon,
    className: "bg-stone-500/15 text-stone-700 dark:text-stone-300",
  },
};

export function AppLogo({
  appId,
  muted = false,
  className,
}: {
  appId: string;
  muted?: boolean;
  className?: string;
}) {
  const logo = appLogos[appId] ?? appLogos.drive!;
  const Icon = logo.icon;
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-md [&_svg]:size-4",
        muted ? "bg-muted text-muted-foreground" : logo.className,
        className,
      )}
    >
      <Icon />
    </span>
  );
}
