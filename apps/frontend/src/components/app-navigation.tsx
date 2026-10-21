"use client";

import type { ReactNode } from "react";
import { useCrudData } from "@/mocks/use-crud-data";
import { getMockMenuItems } from "@/mocks/crud-model";
import {
  ActivityIcon,
  CalendarDaysIcon,
  FilePenLineIcon,
  FileTextIcon,
  FolderKanbanIcon,
  FolderOpenIcon,
  GlobeIcon,
  HouseIcon,
  ListTodoIcon,
  ListTreeIcon,
  NotebookPenIcon,
  PresentationIcon,
  ReceiptIcon,
  ServerIcon,
  SlidersHorizontalIcon,
  UsersIcon,
  WorkflowIcon,
} from "lucide-react";

export type NavigationItem = {
  title: string;
  url: string;
  icon?: ReactNode;
  items?: NavigationItem[];
};

export type NavigationSection = {
  title: string;
  items: NavigationItem[];
};

export const mainNavigation: NavigationSection[] = [
  {
    title: "Dashboard",
    items: [
      { title: "Main", url: "/dashboard/main", icon: <HouseIcon /> },
      {
        title: "Productivity",
        url: "/dashboard/productivity",
        icon: <ActivityIcon />,
      },
    ],
  },
  {
    title: "Page",
    items: [
      {
        title: "Project",
        url: "/dashboard/project",
        icon: <FolderKanbanIcon />,
      },
      { title: "Task", url: "/dashboard/task", icon: <ListTodoIcon /> },
      {
        title: "Calendar",
        url: "/dashboard/calendar",
        icon: <CalendarDaysIcon />,
      },
      { title: "Invoice", url: "/dashboard/invoice", icon: <ReceiptIcon /> },
      {
        title: "File Manager",
        url: "/dashboard/file-manager",
        icon: <FolderOpenIcon />,
      },
      {
        title: "Infrastructure",
        url: "/dashboard/infrastructure",
        icon: <ServerIcon />,
      },
      {
        title: "Timeline",
        url: "#",
        icon: <WorkflowIcon />,
        items: [
          { title: "Workflow", url: "/dashboard/timeline-workflow" },
          { title: "Activity", url: "/dashboard/timeline-activity" },
        ],
      },
    ],
  },
  {
    title: "Playground",
    items: [
      {
        title: "Rich Text Editor",
        url: "/playground/rich-text-editor",
        icon: <FilePenLineIcon />,
      },
      {
        title: "Note",
        url: "/playground/notes",
        icon: <NotebookPenIcon />,
      },
      {
        title: "Whiteboard",
        url: "/whiteboard",
        icon: <PresentationIcon />,
      },
      {
        title: "Flow",
        url: "#",
        icon: <WorkflowIcon />,
        items: [
          { title: "Structure", url: "/dashboard/flow-structure" },
          { title: "Process", url: "/dashboard/flow-process" },
        ],
      },
    ],
  },
];

export function useAppNavigation(): NavigationSection[] {
  const { data } = useCrudData();
  const documentationIcons: Record<string, ReactNode> = {
    "/users": <UsersIcon />,
    "/countries": <GlobeIcon />,
    "/menus": <ListTreeIcon />,
    "/parameters": <SlidersHorizontalIcon />,
  };
  const documentationItems = getMockMenuItems(data.menus, "admin")
    .filter((item) => item.url !== "/provinces" && item.url !== "/cities")
    .map((item) => ({
      ...item,
      icon: documentationIcons[item.url] ?? <FileTextIcon />,
    }));

  return [
    ...mainNavigation,
    {
      title: "Documentation",
      items: documentationItems,
    },
  ];
}
