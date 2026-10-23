"use client";

import type { ReactNode } from "react";
import {
  ActivityIcon,
  ChartAreaIcon,
  BlocksIcon,
  CalendarDaysIcon,
  ChartNoAxesCombinedIcon,
  FilePenLineIcon,
  GitBranchIcon,
  BanknoteIcon,
  FolderKanbanIcon,
  FolderOpenIcon,
  HouseIcon,
  ListTodoIcon,
  LockKeyholeIcon,
  NotebookPenIcon,
  NetworkIcon,
  PresentationIcon,
  ReceiptIcon,
  ServerIcon,
  ShoppingBagIcon,
  Table2Icon,
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
    title: "Page",
    items: [
      {
        title: "Dashboard",
        url: "#",
        icon: <HouseIcon />,
        items: [
          { title: "Main", url: "/dashboard/main", icon: <HouseIcon /> },
          { title: "Sales", url: "/dashboard/sales", icon: <ShoppingBagIcon /> },
          { title: "Finance", url: "/dashboard/finance", icon: <BanknoteIcon /> },
          {
            title: "CRM",
            url: "/dashboard/crm",
            icon: <ChartNoAxesCombinedIcon />,
          },
          {
            title: "Analytic",
            url: "/dashboard/analytic",
            icon: <ChartAreaIcon />,
          },
          {
            title: "Productivity",
            url: "/dashboard/productivity",
            icon: <ActivityIcon />,
          },
        ],
      },
      {
        title: "Authentication",
        url: "#",
        icon: <LockKeyholeIcon />,
        items: [
          { title: "Login 1", url: "/login" },
          { title: "Login 2", url: "/login-2" },
          { title: "Login 3", url: "/login-3" },
          { title: "Login 4", url: "/login-4" },
          { title: "Login 5", url: "/login-5" },
        ],
      },
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
        title: "Workflow",
        url: "/dashboard/timeline-workflow",
        icon: <WorkflowIcon />,
      },
      {
        title: "Activity",
        url: "/dashboard/timeline-activity",
        icon: <ActivityIcon />,
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
        title: "Structure",
        url: "/dashboard/flow-structure",
        icon: <NetworkIcon />,
      },
      {
        title: "Process",
        url: "/dashboard/flow-process",
        icon: <GitBranchIcon />,
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
        {
          title: "Table",
          url: "#",
          icon: <Table2Icon />,
          items: [
            { title: "Base", url: "/table/base" },
            { title: "Column", url: "/table/column" },
            { title: "Scroll", url: "/table/scroll" },
            {
              title: "Group",
              url: "#",
              items: [
                { title: "Group Expansion", url: "/table/group/expansion" },
                { title: "Group Section", url: "/table/group/section" },
                { title: "Group Tree", url: "/table/group/tree" },
              ],
            },
            {
              title: "Drag & Drop",
              url: "#",
              items: [
                { title: "Drag & Drop Row", url: "/table/drag-and-drop/row" },
                { title: "Drag & Drop Column", url: "/table/drag-and-drop/column" },
              ],
            },
            {
              title: "Editable",
              url: "#",
              items: [
                { title: "Editable Inline", url: "/table/editable/inline" },
                { title: "Editable Row", url: "/table/editable/row" },
                { title: "Editable Sheet", url: "/table/editable/sheet" },
              ],
            },
          ],
        },
      ],
    },
  ];
}
