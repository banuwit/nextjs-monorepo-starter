"use client";

import type { ReactNode } from "react";
import {
  ActivityIcon,
  BlocksIcon,
  CalendarDaysIcon,
  FilePenLineIcon,
  FolderKanbanIcon,
  FolderOpenIcon,
  HouseIcon,
  ListTodoIcon,
  NotebookPenIcon,
  PresentationIcon,
  ReceiptIcon,
  ServerIcon,
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
  return [
    ...mainNavigation,
    {
      title: "Documentation",
      items: [
        {
          title: "CRUD",
          url: "#",
          icon: <BlocksIcon />,
          items: [
            { title: "New Page", url: "/crud/new-page" },
            { title: "Modal", url: "/crud/modal" },
            { title: "Sheet", url: "/crud/sheet" },
            { title: "Panel Inline", url: "/crud/panel-inline" },
          ],
        },
      ],
    },
  ];
}
