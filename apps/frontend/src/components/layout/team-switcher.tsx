"use client";

import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { AppLogo } from "@/components/app-logo";

const teams = ["Bandung", "Jakarta", "Surabaya"] as const;
const TeamContext = React.createContext<{
  activeTeam: string;
  setActiveTeam: (team: string) => void;
} | null>(null);

export function TeamSwitcherProvider({ children }: { children: React.ReactNode }) {
  const [activeTeam, setActiveTeam] = React.useState<string>(teams[0]);

  return (
    <TeamContext.Provider value={{ activeTeam, setActiveTeam }}>
      {children}
    </TeamContext.Provider>
  );
}

export function TeamSwitcher({
  placement = "sidebar",
  showLogo = true,
}: {
  placement?: "sidebar" | "header";
  showLogo?: boolean;
}) {
  const { isMobile } = useSidebar();
  const team = React.useContext(TeamContext);
  if (!team) throw new Error("TeamSwitcherProvider is required");
  const { activeTeam, setActiveTeam } = team;
  const inHeader = placement === "header";

  return (
    <SidebarMenu className={inHeader ? "min-w-0 max-w-48 flex-1" : undefined}>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                aria-label={`Switch team: ${activeTeam}`}
                className={
                  inHeader
                    ? "h-10 text-foreground hover:bg-muted hover:text-foreground active:bg-muted active:text-foreground data-open:bg-muted data-open:text-foreground data-open:hover:bg-muted data-open:hover:text-foreground focus-visible:ring-ring"
                    : "data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
                }
              />
            }
          >
            {showLogo && (
              <AppLogo className="w-14 group-data-[collapsible=icon]:w-8" />
            )}
            <span className="grid min-w-0 flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate font-medium">{showLogo ? "Indonesia" : "WIT. Indonesia"}</span>
              <span className="truncate text-xs">{activeTeam}</span>
            </span>
            <ChevronsUpDownIcon className="ml-auto group-data-[collapsible=icon]:hidden" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            side={inHeader || isMobile ? "bottom" : "right"}
            sideOffset={4}
            className="min-w-48"
          >
            <DropdownMenuGroup>
              {teams.map((team) => (
                <DropdownMenuItem
                  key={team}
                  onClick={() => setActiveTeam(team)}
                  className="gap-2 p-2"
                >
                  <span className="flex size-6 items-center justify-center rounded-md border">
                    {team === activeTeam && <CheckIcon className="size-4" />}
                  </span>
                  {team}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
