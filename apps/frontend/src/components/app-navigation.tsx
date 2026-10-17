"use client";
import { useCrudData } from "@/mocks/use-crud-data";
import { getMockMenuItems } from "@/mocks/crud-model";
import {
  BookOpenIcon,
  BotIcon,
  LayoutDashboardIcon,
  Settings2Icon,
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
    ],
  },
  {
    title: "Playground",
    url: "#",
    icon: <TerminalSquareIcon />,
    items: [
      { title: "History", url: "#" },
      { title: "Starred", url: "#" },
      { title: "Settings", url: "#" },
    ],
  },
  {
    title: "Models",
    url: "#",
    icon: <BotIcon />,
    items: [
      { title: "Genesis", url: "#" },
      { title: "Explorer", url: "#" },
      { title: "Quantum", url: "#" },
    ],
  },
  {
    title: "Documentation",
    url: "#",
    icon: <BookOpenIcon />,
    items: [
      { title: "Introduction", url: "#" },
      { title: "Get Started", url: "#" },
      { title: "Tutorials", url: "#" },
      { title: "Changelog", url: "#" },
    ],
  },
  {
    title: "Settings",
    url: "#",
    icon: <Settings2Icon />,
    items: [
      { title: "General", url: "#" },
      { title: "Team", url: "#" },
      { title: "Billing", url: "#" },
      { title: "Limits", url: "#" },
    ],
  },
];

export function useAppNavigation() {
  const { data } = useCrudData();
  return [
    mainNavigation[0]!,
    {
      title: "Master Data",
      url: "#",
      icon: <DatabaseIcon />,
      isActive: true,
      items: getMockMenuItems(data.menus, "admin"),
    },
    ...mainNavigation.slice(1),
  ];
}
