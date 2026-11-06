"use client";

import type { ReactNode } from "react";
import {
  ActivityIcon,
  BlocksIcon,
  BookOpenIcon,
  BoxIcon,
  CalendarDaysIcon,
  ChartSplineIcon,
  ChartColumnIcon,
  ChartNoAxesCombinedIcon,
  FilePenLineIcon,
  FileTextIcon,
  FunnelIcon,
  FlaskConicalIcon,
  GitBranchIcon,
  BanknoteIcon,
  FolderKanbanIcon,
  FolderOpenIcon,
  HouseIcon,
  ListTodoIcon,
  LockKeyholeIcon,
  MapPinIcon,
  MapPinnedIcon,
  NotebookPenIcon,
  NetworkIcon,
  PanelsTopLeftIcon,
  PresentationIcon,
  ReceiptIcon,
  ReceiptTextIcon,
  ScaleIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  SparklesIcon,
  Table2Icon,
  UsersRoundIcon,
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

const mainNavigation: NavigationSection[] = [
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
        title: "Access Management",
        url: "/access-management",
        icon: <ShieldCheckIcon />,
      },
      {
        title: "Activity",
        url: "/activity",
        icon: <ActivityIcon />,
      },
      {
        title: "AI Chat",
        url: "#",
        icon: <SparklesIcon />,
        items: [
          { title: "Page", url: "/ai-chat/page" },
          { title: "Panel", url: "/ai-chat/panel" },
          { title: "Float", url: "/ai-chat/float" },
        ],
      },
      {
        title: "AI Usage",
        url: "/ai-usage",
        icon: <ChartSplineIcon />,
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
        title: "Calendar",
        url: "/calendar",
        icon: <CalendarDaysIcon />,
      },
      {
        title: "Checkout",
        url: "/checkout",
        icon: <ShoppingCartIcon />,
      },
      {
        title: "Invoice",
        url: "/invoice",
        icon: <FileTextIcon />,
      },
      {
        title: "Products",
        url: "/product",
        icon: <ShoppingBagIcon />,
      },
      {
        title: "Project",
        url: "/project",
        icon: <FolderKanbanIcon />,
      },
      {
        title: "Receipt",
        url: "/receipt",
        icon: <ReceiptTextIcon />,
      },
      {
        title: "Workflow",
        url: "/workflow",
        icon: <WorkflowIcon />,
      },
    ],
  },
  {
    title: "Playground",
    icon: <FlaskConicalIcon />,
    items: [
      {
        title: "3D Scenes",
        url: "/scenes-3d",
        icon: <BoxIcon />,
      },
      {
        title: "Compare",
        url: "/compare",
        icon: <ScaleIcon />,
      },
      {
        title: "Draft Preview",
        url: "/draft-preview",
        icon: <ReceiptIcon />,
      },
      {
        title: "File Manager",
        url: "/file-manager",
        icon: <FolderOpenIcon />,
      },
      {
        title: "Live Document",
        url: "/live-document",
        icon: <UsersRoundIcon />,
      },
      {
        title: "Map Delivery",
        url: "/map-delivery",
        icon: <MapPinnedIcon />,
      },
      {
        title: "Map Location",
        url: "/map-location",
        icon: <MapPinIcon />,
      },
      {
        title: "Note",
        url: "/notes",
        icon: <NotebookPenIcon />,
      },
      {
        title: "Process",
        url: "/process",
        icon: <GitBranchIcon />,
      },
      {
        title: "Rich Text Editor",
        url: "/rich-text-editor",
        icon: <FilePenLineIcon />,
      },
      {
        title: "Structure",
        url: "/structure",
        icon: <NetworkIcon />,
      },
      { title: "Task", url: "/task", icon: <ListTodoIcon /> },
      {
        title: "Whiteboard",
        url: "/whiteboard",
        icon: <PresentationIcon />,
      },
      {
        title: "Wizard",
        url: "/wizard",
        icon: <WandSparklesIcon />,
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
          title: "Filter",
          url: "#",
          icon: <FunnelIcon />,
          items: [
            { title: "Base", url: "/filter/base" },
            { title: "Advance", url: "/filter/advance" },
            { title: "Group", url: "/filter/group" },
            { title: "Sidebar", url: "/filter/sidebar" },
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
      ],
    },
  ];
}
