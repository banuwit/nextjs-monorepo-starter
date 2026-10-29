"use client";

import { createContext, use, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { PencilIcon } from "lucide-react";

import { DataGridClient } from "@/components/data-grid/data-grid-client";
import type { DataGridFeatures } from "@/components/data-grid/data-grid-features";
import { DataGridHeader } from "@/components/data-grid/data-grid-header";
import { DataGridHeaderSort } from "@/components/data-grid/data-grid-header-sort";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { StatusBadge } from "./status-badge";
import { usdWhole } from "../utils/format";
import type { CrmOpportunity } from "@/mocks/dashboard-crm.mock";

import { CrmOpportunityEditor } from "./crm-opportunity-editor";
import { healthStyles, priorityLabels } from "../utils/crm-status";

// Row actions come from context so the column definitions stay stable.
const EditContext = createContext<(opportunity: CrmOpportunity) => void>(() => {});

function EditButton({ opportunity }: { opportunity: CrmOpportunity }) {
  const onEdit = use(EditContext);
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={`Edit ${opportunity.account}`}
      onClick={() => onEdit(opportunity)}
    >
      <PencilIcon />
    </Button>
  );
}

const columns: ColumnDef<DataGridFeatures, CrmOpportunity>[] = [
  {
    accessorKey: "account",
    header: ({ column }) => <DataGridHeaderSort column={column} title="Account" />,
    cell: ({ row }) => (
      <div className="flex min-w-40 flex-col">
        <span className="font-medium">{row.original.account}</span>
        <span className="text-xs text-muted-foreground tabular-nums">{row.original.id}</span>
      </div>
    ),
  },
  {
    accessorKey: "stage",
    header: ({ column }) => <DataGridHeaderSort column={column} title="Stage" />,
  },
  {
    // String values so the toolbar facet can match them; "1" sorts before "3".
    id: "priority",
    accessorFn: (row) => String(row.priority),
    header: ({ column }) => <DataGridHeaderSort column={column} title="Priority" />,
    cell: ({ row }) => priorityLabels[row.original.priority],
  },
  {
    accessorKey: "health",
    header: () => <DataGridHeader title="Health" />,
    cell: ({ row }) => {
      const style = healthStyles[row.original.health];
      return (
        <StatusBadge tone={style.tone} icon={style.icon}>
          {row.original.health}
        </StatusBadge>
      );
    },
  },
  {
    accessorKey: "value",
    header: ({ column }) => <DataGridHeaderSort column={column} title="Value" />,
    cell: ({ row }) => (
      <span className="font-medium tabular-nums">{usdWhole.format(row.original.value)}</span>
    ),
  },
  {
    id: "actions",
    header: () => <DataGridHeader title="Edit" />,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => <EditButton opportunity={row.original} />,
  },
];

export function CrmOpportunities({
  opportunities,
  stage,
  onSave,
}: {
  opportunities: CrmOpportunity[];
  stage: CrmOpportunity["stage"] | null;
  onSave: (opportunity: CrmOpportunity) => void;
}) {
  const [editing, setEditing] = useState<CrmOpportunity | null>(null);
  const rows = stage
    ? opportunities.filter((opportunity) => opportunity.stage === stage)
    : opportunities;

  return (
    <EditContext value={setEditing}>
      <Card id="opportunities" className="min-w-0">
        <CardHeader>
          <CardTitle>Opportunities</CardTitle>
          <CardDescription aria-live="polite">
            {stage ? `${rows.length} deals in ${stage}` : `${rows.length} open deals`}
          </CardDescription>
        </CardHeader>
        <CardContent className="min-w-0">
          <DataGridClient
            columns={columns}
            data={rows}
            getRowId={(row) => row.id}
            defaultSorting={[{ id: "value", desc: true }]}
            defaultPageSize={8}
            pagination="simple"
            defaultColumnPinning={{ start: [], end: ["actions"] }}
            toolbar={{
              searches: [{ key: "account", placeholder: "Search accounts..." }],
              facets: [
                {
                  key: "health",
                  title: "Health",
                  options: Object.keys(healthStyles).map((value) => ({ label: value, value })),
                },
                {
                  key: "priority",
                  title: "Priority",
                  options: ([1, 2, 3] as const).map((value) => ({
                    label: priorityLabels[value],
                    value: String(value),
                  })),
                },
              ],
            }}
            emptyFilteredTitle="No deals match these filters"
            emptyFilteredDescription="Clear a filter or pick another stage."
          />
        </CardContent>
      </Card>
      <Sheet
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
      >
        <SheetContent className="w-full sm:max-w-sm">
          {editing && (
            <CrmOpportunityEditor
              key={editing.id}
              opportunity={editing}
              onSave={(next) => {
                onSave(next);
                setEditing(null);
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </EditContext>
  );
}
