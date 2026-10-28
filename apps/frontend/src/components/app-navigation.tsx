"use client";

import type { ReactNode } from "react";
import {
  ActivityIcon,
  BlocksIcon,
  BookOpenIcon,
  BoxIcon,
  CalendarDaysIcon,
  ChartColumnIcon,
  ChartNoAxesCombinedIcon,
  FilePenLineIcon,
  FlaskConicalIcon,
  GitBranchIcon,
  BanknoteIcon,
  FolderKanbanIcon,
  FolderOpenIcon,
  HouseIcon,
  ListTodoIcon,
  LockKeyholeIcon,
  NotebookPenIcon,
  NetworkIcon,
  PanelsTopLeftIcon,
  PresentationIcon,
  ReceiptIcon,
  ReceiptTextIcon,
  ShoppingBagIcon,
  SparklesIcon,
  Table2Icon,
  WandSparklesIcon,
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
  icon?: ReactNode;
  items: NavigationItem[];
};

export const mainNavigation: NavigationSection[] = [
  {
    title: "Page",
    icon: <PanelsTopLeftIcon />,
    items: [
      {
        title: "Dashboard",
        url: "#",
        icon: <HouseIcon />,
        items: [
          { title: "Main", url: "/dashboard/main", icon: <HouseIcon /> },
          {
            title: "Sales",
            url: "/dashboard/sales",
            icon: <ShoppingBagIcon />,
          },
          {
            title: "Finance",
            url: "/dashboard/finance",
            icon: <BanknoteIcon />,
          },
          {
            title: "CRM",
            url: "/dashboard/crm",
            icon: <ChartNoAxesCombinedIcon />,
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
          { title: "Login 1", url: "/login-1" },
          { title: "Login 2", url: "/login-2" },
          { title: "Login 3", url: "/login-3" },
          { title: "Login 4", url: "/login-4" },
          { title: "Login 5", url: "/login-5" },
        ],
      },
      {
        title: "AI Chat",
        url: "#",
        icon: <SparklesIcon />,
        items: [
          { title: "Page", url: "/dashboard/ai-chat/page" },
          { title: "Sidebar", url: "/dashboard/ai-chat/sidebar" },
          { title: "Float", url: "/dashboard/ai-chat/float" },
        ],
      },
      {
        title: "Project",
        url: "/dashboard/project",
        icon: <FolderKanbanIcon />,
      },
      { title: "Task", url: "/dashboard/task", icon: <ListTodoIcon /> },
      {
        title: "File Manager",
        url: "/dashboard/file-manager",
        icon: <FolderOpenIcon />,
      },
      {
        title: "Calendar",
        url: "/dashboard/calendar",
        icon: <CalendarDaysIcon />,
      },
      { title: "Receipt", url: "/dashboard/receipt", icon: <ReceiptTextIcon /> },
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
    icon: <FlaskConicalIcon />,
    items: [
      {
        title: "Wizard",
        url: "/playground/wizard",
        icon: <WandSparklesIcon />,
      },
      { title: "Invoice", url: "/playground/invoice", icon: <ReceiptIcon /> },
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
      {
        title: "3D Scenes",
        url: "/playground/3d-scenes",
        icon: <BoxIcon />,
      },
    ],
  },
];

export function useAppNavigation(): NavigationSection[] {
  return [
    ...mainNavigation,
    {
      title: "Documentation",
      icon: <BookOpenIcon />,
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
                {
                  title: "Drag & Drop Column",
                  url: "/table/drag-and-drop/column",
                },
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
        {
          title: "Chart",
          url: "#",
          icon: <ChartColumnIcon />,
          items: [
            { title: "Area", url: "/chart/area" },
            { title: "Bar", url: "/chart/bar" },
            { title: "Box Plot", url: "/chart/box-plot" },
            { title: "Brush & Sync", url: "/chart/brush-sync" },
            { title: "Candlestick", url: "/chart/candlestick" },
            { title: "Composed", url: "/chart/composed" },
            { title: "Funnel", url: "/chart/funnel" },
            { title: "Gauge", url: "/chart/gauge" },
            { title: "Line", url: "/chart/line" },
            { title: "Pie", url: "/chart/pie" },
            { title: "Pyramid", url: "/chart/pyramid" },
            { title: "Radar", url: "/chart/radar" },
            { title: "Radial", url: "/chart/radial" },
            { title: "Sankey", url: "/chart/sankey" },
            { title: "Scatter", url: "/chart/scatter" },
            { title: "Slope", url: "/chart/slope" },
            { title: "Sparkline", url: "/chart/sparkline" },
            { title: "Status Tracker", url: "/chart/status-tracker" },
            { title: "Timeline", url: "/chart/timeline" },
            { title: "Treemap", url: "/chart/treemap" },
            { title: "Waterfall", url: "/chart/waterfall" },
          ],
        },
      ],
    },
  ];
}
