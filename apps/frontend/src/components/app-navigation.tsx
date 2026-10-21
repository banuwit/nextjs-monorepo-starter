"use client";
import { useCrudData } from "@/mocks/use-crud-data";
import { getMockMenuItems } from "@/mocks/crud-model";
import {
  LayoutDashboardIcon,
  TerminalSquareIcon,
  DatabaseIcon,
} from "lucide-react";

export const mainNavigation = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <LayoutDashboardIcon />,
    isActive: true,
    items: [
      { title: "Main", url: "/dashboard/main" },
      { title: "Productivity", url: "/dashboard/productivity" },
      { title: "Task", url: "/dashboard/task" },
      { title: "Project", url: "/dashboard/project" },
      { title: "Calendar", url: "/dashboard/calendar" },
      { title: "Invoice", url: "/dashboard/invoice" },
      { title: "File Manager", url: "/dashboard/file-manager" },
      { title: "Infrastructure", url: "/dashboard/infrastructure" },
      { title: "Flow Structure", url: "/dashboard/flow-structure" },
      { title: "Flow Process", url: "/dashboard/flow-process" },
      { title: "Timeline Workflow", url: "/dashboard/timeline-workflow" },
      { title: "Timeline Activity", url: "/dashboard/timeline-activity" },
    ],
  },
  {
    title: "Playground",
    url: "#",
    icon: <TerminalSquareIcon />,
    items: [
      { title: "Rich Text Editor", url: "/playground/rich-text-editor" },
      { title: "Notes", url: "/playground/notes" },
      { title: "Whiteboard", url: "/whiteboard" },
      { title: "Wizard", url: "/playground/wizard" },
    ],
  },
];

export function useAppNavigation() {
  const { data } = useCrudData();
  const masterDataItems = getMockMenuItems(data.menus, "admin");
  return [
    mainNavigation[0]!,
    ...(masterDataItems.length
      ? [{
          title: "Pages",
          url: "#",
          icon: <DatabaseIcon />,
          isActive: true,
          items: masterDataItems,
        }]
      : []),
    ...mainNavigation.slice(1),
  ];
}
