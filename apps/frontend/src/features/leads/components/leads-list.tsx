"use client";

import { createContext, useContext, useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowRightLeftIcon, EyeIcon } from "lucide-react";
import { DataGridClient } from "@/components/data-grid/data-grid-client";
import type { DataGridFeatures } from "@/components/data-grid/data-grid-features";
import { DataGridHeader } from "@/components/data-grid/data-grid-header";
import { DataGridHeaderSort } from "@/components/data-grid/data-grid-header-sort";
import type { ToolbarConfig } from "@/components/data-grid/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Lead, Pipeline } from "../types/leads";
import {
  daysInStage,
  formatCurrency,
  formatDate,
  initials,
  leadPriorities,
  leadSources,
} from "../utils/leads";
import { LeadMoveMenu } from "./lead-move-menu";
import { StageBadge } from "./stage-badge";

type RowActions = {
  pipeline: Pipeline;
  today: string;
  onOpen: (lead: Lead) => void;
  onMove: (lead: Lead, stageId: string) => void;
};

// Handlers change every render; reading them from context keeps column definitions stable.
const RowActionsContext = createContext<RowActions | null>(null);

function useRowActions() {
  const value = useContext(RowActionsContext);
  if (!value) throw new Error("LeadsList row cells must render inside LeadsList.");
  return value;
}

function StageCell({ lead }: { lead: Lead }) {
  const { pipeline, today } = useRowActions();
  const stage = pipeline.stages.find((item) => item.id === lead.stageId);
  if (!stage) return null;
  const days = daysInStage(lead, today);
  return (
    <div className="flex flex-col items-start gap-1">
      <StageBadge stage={stage} />
      <span className="text-xs text-muted-foreground">
        {stage.kind === "lost" && lead.lostReason
          ? lead.lostReason
          : days !== null && stage.kind === "open"
            ? `${days} hari di tahap ini`
            : `${lead.history.length - 1} perpindahan`}
      </span>
    </div>
  );
}

function CloseCell({ lead }: { lead: Lead }) {
  const { pipeline, today } = useRowActions();
  const open = pipeline.stages.find((stage) => stage.id === lead.stageId)?.kind === "open";
  const overdue = open && today !== "" && lead.expectedClose < today;
  return (
    <div className="flex flex-col">
      <span className={cn(overdue && "font-medium text-destructive")}>
        {formatDate(lead.expectedClose)}
      </span>
      {overdue && <span className="text-xs text-destructive">Lewat perkiraan</span>}
    </div>
  );
}

function ActionsCell({ lead }: { lead: Lead }) {
  const { pipeline, onOpen, onMove } = useRowActions();
  return (
    <div className="flex justify-end gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`Detail ${lead.company}`}
        onClick={() => onOpen(lead)}
      >
        <EyeIcon />
      </Button>
      <LeadMoveMenu
        pipeline={pipeline}
        lead={lead}
        onMove={onMove}
        trigger={
          <Button variant="ghost" size="icon-sm" aria-label={`Pindahkan tahap ${lead.company}`}>
            <ArrowRightLeftIcon />
          </Button>
        }
      />
    </div>
  );
}

const columns: ColumnDef<DataGridFeatures, Lead>[] = [
  {
    accessorKey: "company",
    header: ({ column }) => <DataGridHeaderSort column={column} title="Lead" />,
    cell: ({ row }) => <LeadNameCell lead={row.original} />,
  },
  {
    accessorKey: "stageId",
    header: () => <DataGridHeader title="Tahap" />,
    enableSorting: false,
    cell: ({ row }) => <StageCell lead={row.original} />,
  },
  {
    accessorKey: "value",
    header: ({ column }) => <DataGridHeaderSort column={column} title="Nilai" />,
    cell: ({ row }) => (
      <span className="font-medium tabular-nums">{formatCurrency(row.original.value)}</span>
    ),
  },
  {
    accessorKey: "owner",
    header: ({ column }) => <DataGridHeaderSort column={column} title="Penanggung jawab" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar className="size-6">
          <AvatarFallback className="text-[0.625rem]">{initials(row.original.owner)}</AvatarFallback>
        </Avatar>
        <span className="truncate">{row.original.owner}</span>
      </div>
    ),
  },
  {
    accessorKey: "source",
    header: () => <DataGridHeader title="Sumber" />,
    enableSorting: false,
    cell: ({ row }) => leadSources[row.original.source],
  },
  {
    accessorKey: "priority",
    header: () => <DataGridHeader title="Prioritas" />,
    enableSorting: false,
    cell: ({ row }) => (
      <Badge variant={row.original.priority === "high" ? "outline" : "secondary"}>
        {leadPriorities[row.original.priority]}
      </Badge>
    ),
  },
  {
    accessorKey: "expectedClose",
    header: ({ column }) => <DataGridHeaderSort column={column} title="Perkiraan closing" />,
    cell: ({ row }) => <CloseCell lead={row.original} />,
  },
  {
    id: "actions",
    header: () => <DataGridHeader title="Aksi" />,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => <ActionsCell lead={row.original} />,
  },
];

function LeadNameCell({ lead }: { lead: Lead }) {
  const { onOpen } = useRowActions();
  return (
    <div className="flex flex-col items-start py-1">
      <button
        type="button"
        onClick={() => onOpen(lead)}
        className="max-w-full truncate rounded-sm text-left font-medium underline-offset-4 hover:text-primary-text hover:underline focus-visible:outline-2 focus-visible:outline-ring"
      >
        {lead.company}
      </button>
      <span className="max-w-full truncate text-xs text-muted-foreground">
        {lead.name} · {lead.email}
      </span>
    </div>
  );
}

export function LeadsList({ leads, ...actions }: RowActions & { leads: Lead[] }) {
  const { pipeline, today, onOpen, onMove } = actions;
  const value = useMemo(
    () => ({ pipeline, today, onOpen, onMove }),
    [pipeline, today, onOpen, onMove],
  );
  const toolbar = useMemo<ToolbarConfig>(
    () => ({
      facets: [
        {
          key: "stageId",
          title: "Tahap",
          options: pipeline.stages.map((stage) => ({ label: stage.name, value: stage.id })),
        },
        {
          key: "source",
          title: "Sumber",
          options: Object.entries(leadSources).map(([optionValue, label]) => ({
            label,
            value: optionValue,
          })),
        },
      ],
    }),
    [pipeline],
  );

  return (
    <RowActionsContext.Provider value={value}>
      <DataGridClient
        // Stage facets belong to one pipeline; remount so stale stage filters reset.
        key={pipeline.id}
        columns={columns}
        data={leads}
        getRowId={(lead) => lead.id}
        toolbar={toolbar}
        pagination="simple"
        defaultPageSize={20}
        defaultColumnPinning={{ start: [], end: ["actions"] }}
        emptyTitle="Belum ada lead"
        emptyDescription="Tambahkan lead pertama di pipeline ini."
        emptyFilteredTitle="Lead tidak ditemukan"
        emptyFilteredDescription="Coba ubah filter tahap atau sumber."
      />
    </RowActionsContext.Provider>
  );
}
