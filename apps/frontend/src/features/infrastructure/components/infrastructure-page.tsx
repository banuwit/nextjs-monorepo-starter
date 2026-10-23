"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { toast } from "@/components/ui/toast";
import { infrastructureGroups } from "@/mocks/infrastructure.mock";
import { filterInfrastructure } from "../utils/infrastructure";
import type { InfrastructureFilters } from "../types/infrastructure";
import { InfrastructureHeader } from "./infrastructure-header";
import { ProjectEnvironments } from "./project-environments";

export function InfrastructurePage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<InfrastructureFilters>({});
  const [updated, setUpdated] = useState(false);
  const groups = filterInfrastructure(infrastructureGroups, search, filters);
  function resetFilters() {
    setSearch("");
    setFilters({});
  }
  function refresh() {
    setUpdated(true);
    toast.add({
      title: "Demo snapshot refreshed",
      description: "These are sample metrics; no live servers are connected.",
      type: "info",
    });
  }
  return (
    <div className="flex min-w-0 flex-col gap-4 p-4 lg:p-6">
      <InfrastructureHeader
        search={search}
        onSearchChange={setSearch}
        filters={filters}
        onFiltersChange={setFilters}
        onReset={resetFilters}
        updated={updated}
        onRefresh={refresh}
      />
      {groups.map((group) => (
        <ProjectEnvironments
          key={group.name}
          group={group}
          onRefresh={refresh}
        />
      ))}
      {groups.length === 0 && (
        <Empty className="border">
          <EmptyHeader>
            <EmptyTitle>No matching environments</EmptyTitle>
            <EmptyDescription>
              Try another name, domain, or combination of filters.
            </EmptyDescription>
          </EmptyHeader>
          <Button variant="outline" onClick={resetFilters}>
            Clear filters
          </Button>
        </Empty>
      )}
      <p className="text-xs text-muted-foreground">
        Demo data · Global totals include projects outside this sample. Cloud
        actions are previews only.
      </p>
    </div>
  );
}
