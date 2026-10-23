import { useEffect, useRef } from "react";
import {
  Box,
  Container,
  Filter,
  PlusCircle,
  RefreshCw,
  Search,
  Server,
  Settings,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import {
  infrastructureGroups,
  infrastructureSummary,
} from "@/mocks/infrastructure.mock";
import type { InfrastructureFilters } from "../types/infrastructure";
import { previewCloudAction } from "./infrastructure-actions";

const rows = infrastructureGroups.flatMap((group) => group.rows);
const filterOptions = [
  {
    key: "organization",
    label: "Organization",
    values: infrastructureGroups.map((group) => group.organization),
  },
  {
    key: "platform",
    label: "Stack",
    values: rows.map((row) => row.platform.name),
  },
  {
    key: "server",
    label: "Cloud provider",
    values: rows.map((row) => row.server),
  },
  {
    key: "project",
    label: "Project type",
    values: infrastructureGroups.map((group) => group.name),
  },
  {
    key: "environment",
    label: "Environment",
    values: rows.map((row) => row.environment),
  },
  { key: "status", label: "Filters", values: rows.map((row) => row.status) },
] satisfies {
  key: keyof InfrastructureFilters;
  label: string;
  values: string[];
}[];

export function InfrastructureHeader({
  search,
  onSearchChange,
  filters,
  onFiltersChange,
  onReset,
  updated,
  onRefresh,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  filters: InfrastructureFilters;
  onFiltersChange: (filters: InfrastructureFilters) => void;
  onReset: () => void;
  updated: boolean;
  onRefresh: () => void;
}) {
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);
  const hasFilters = search || Object.values(filters).some(Boolean);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-col gap-1">
            <h1 className="text-2xl font-medium leading-tight tracking-tight sm:text-3xl sm:leading-none">
              Infrastructure Overview
            </h1>
            <p className="text-sm text-muted-foreground">
              Monitor environments, server health, uptime, and resource usage
              across every project.
            </p>
          </div>
          <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
            <span
              className="whitespace-nowrap text-sm text-muted-foreground"
              role="status"
            >
              {updated ? "Demo snapshot refreshed" : "Last updated: 30s ago"}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Refresh infrastructure"
                onClick={onRefresh}
              >
                <RefreshCw />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Infrastructure settings"
                onClick={() => previewCloudAction("Infrastructure settings")}
              >
                <Settings />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className="h-auto gap-1 rounded-sm px-1.5 py-0.5"
          >
            <Container />
            {infrastructureSummary.projects} Projects
          </Badge>
          <Badge
            variant="outline"
            className="h-auto gap-1 rounded-sm px-1.5 py-0.5"
          >
            <Box />
            {infrastructureSummary.environments} Environments
          </Badge>
          <Badge
            variant="outline"
            className="h-auto gap-1 rounded-sm px-1.5 py-0.5"
          >
            <Server />
            {infrastructureSummary.servers} Servers
          </Badge>
          <Badge
            variant="outline"
            className="h-auto gap-1 rounded-sm px-1.5 py-0.5"
          >
            <span className="size-2 rounded-full bg-emerald-600 dark:bg-emerald-500" />
            {infrastructureSummary.uptime} Global Uptime
          </Badge>
        </div>
      </div>
      <div className="flex flex-col gap-3 xl:flex-row">
        <InputGroup className="min-w-48 flex-1">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            ref={searchRef}
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label="Search infrastructure by name or domain"
            placeholder="Search by name or domain..."
          />
          <InputGroupAddon align="inline-end">
            <Kbd>⌘ K</Kbd>
          </InputGroupAddon>
        </InputGroup>
        <div className="flex flex-wrap gap-2">
          {filterOptions.map(({ key, label, values }) => (
            <DropdownMenu key={key} modal={false}>
              <DropdownMenuTrigger
                render={
                  <Button variant={filters[key] ? "secondary" : "outline"} />
                }
              >
                {key === "status" ? (
                  <Filter data-icon="inline-start" />
                ) : (
                  <PlusCircle data-icon="inline-start" />
                )}
                {filters[key] || label}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    {key === "status" ? "Health" : label}
                  </DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={filters[key] || ""}
                    onValueChange={(value) =>
                      onFiltersChange({ ...filters, [key]: value })
                    }
                  >
                    <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
                    {[...new Set(values)].map((value) => (
                      <DropdownMenuRadioItem key={value} value={value}>
                        {value}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
          {hasFilters && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Clear filters"
              onClick={onReset}
            >
              <X />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
