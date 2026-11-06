"use client";

import { useCallback, useRef, useState } from "react";
import { GitBranchPlusIcon, KanbanIcon, ListIcon, PlusIcon } from "lucide-react";
import { AppBody } from "@/components/app-body";
import { CrudSheet } from "@/components/crud/crud-sheet";
import { SearchFilter } from "@/components/filter/search-filter";
import { SelectFilter } from "@/components/filter/select-filter";
import { PageHeading } from "@/components/page-heading";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { leadOwners, lostReasons } from "@/mocks/leads.mock";
import { useLeads } from "../hooks/use-leads";
import { useToday } from "../hooks/use-today";
import type { Lead, LeadsView } from "../types/leads";
import { buildLead, buildPipeline, updateLeadFields } from "../utils/lead-builders";
import {
  canMoveLead,
  findStage,
  moveLead,
  movementRuleDescriptions,
  movementRuleLabels,
} from "../utils/lead-movement";
import { leadPriorities, selectLeads } from "../utils/leads";
import { LeadDetail } from "./lead-detail";
import { LeadFormDialog } from "./lead-form-dialog";
import { LeadsKanban } from "./leads-kanban";
import { LeadsList } from "./leads-list";
import { LeadsStageFlow } from "./leads-stage-flow";
import { LeadsSummary } from "./leads-summary";
import { LostReasonDialog } from "./lost-reason-dialog";
import { PipelineFormDialog } from "./pipeline-form-dialog";

const CURRENT_USER = "Anda";

type FormState = { mode: "create"; stageId?: string } | { mode: "edit"; leadId: string };
type Notice = { tone: "info" | "error"; text: string };

const ownerOptions = leadOwners.map((owner) => ({ label: owner, value: owner }));
const priorityOptions = Object.entries(leadPriorities).map(([value, label]) => ({ label, value }));

export function LeadsPage() {
  const { pipelines, leads, saveLead, deleteLead, addPipeline } = useLeads();
  const today = useToday();
  const [pipelineId, setPipelineId] = useState(pipelines[0]?.id ?? "");
  const [view, setView] = useState<LeadsView>("kanban");
  const [query, setQuery] = useState("");
  const [owner, setOwner] = useState<string | null>(null);
  const [priority, setPriority] = useState<string | null>(null);
  const [searchKey, setSearchKey] = useState(0);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [pendingLost, setPendingLost] = useState<{ leadId: string; stageId: string } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Lead | null>(null);
  const [pipelineOpen, setPipelineOpen] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const addButton = useRef<HTMLButtonElement>(null);

  const pipeline = pipelines.find((item) => item.id === pipelineId) ?? pipelines[0];
  const pipelineLeads = pipeline ? leads.filter((lead) => lead.pipelineId === pipeline.id) : [];
  const visible = pipeline ? selectLeads(leads, pipeline.id, { query, owner, priority }) : [];
  const detail = leads.find((lead) => lead.id === detailId);
  const editing = form?.mode === "edit" ? leads.find((lead) => lead.id === form.leadId) : undefined;
  const lostLead = pendingLost ? leads.find((lead) => lead.id === pendingLost.leadId) : undefined;
  const lostStage = pendingLost && pipeline ? findStage(pipeline, pendingLost.stageId) : undefined;
  const hasFilters = query !== "" || owner !== null || priority !== null;

  const requestMove = useCallback(
    (lead: Lead, stageId: string) => {
      if (!pipeline) return;
      const check = canMoveLead(pipeline, lead, stageId);
      if (!check.ok) {
        setNotice({ tone: "error", text: check.reason });
        return;
      }
      const from = findStage(pipeline, lead.stageId);
      const to = findStage(pipeline, stageId);
      if (to?.kind === "lost") {
        setPendingLost({ leadId: lead.id, stageId });
        return;
      }
      saveLead(
        moveLead(lead, stageId, {
          at: new Date().toISOString(),
          by: CURRENT_USER,
          note: from?.kind === "open" ? undefined : `Dibuka kembali dari ${from?.name}`,
        }),
      );
      setNotice({ tone: "info", text: `${lead.company} dipindah dari ${from?.name} ke ${to?.name}.` });
    },
    [pipeline, saveLead],
  );

  const openDetail = useCallback((lead: Lead) => setDetailId(lead.id), []);

  function resetFilters() {
    setQuery("");
    setOwner(null);
    setPriority(null);
    setSearchKey((key) => key + 1);
  }

  if (!pipeline) return null;

  return (
    <AppBody>
      <PageHeading
        title="Leads"
        currentPage="Leads"
        description="Pantau pergerakan lead dari tahap awal hingga menang atau kalah di setiap pipeline."
      >
        <Button variant="outline" onClick={() => setPipelineOpen(true)}>
          <GitBranchPlusIcon data-icon="inline-start" />
          Pipeline baru
        </Button>
        <Button ref={addButton} onClick={() => setForm({ mode: "create" })}>
          <PlusIcon data-icon="inline-start" />
          Tambah lead
        </Button>
      </PageHeading>

      <section
        aria-label="Pipeline"
        className="flex min-w-0 flex-col gap-4 rounded-xl border bg-card p-4 text-card-foreground"
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Tabs value={pipeline.id} onValueChange={(value) => setPipelineId(String(value))} className="min-w-0">
            <div className="-mx-1 overflow-x-auto px-1">
              <TabsList aria-label="Pilih pipeline" className="w-fit">
                {pipelines.map((item) => (
                  <TabsTrigger key={item.id} value={item.id}>
                    {item.name}
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {leads.filter((lead) => lead.pipelineId === item.id).length}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline">Aturan: {movementRuleLabels[pipeline.movement]}</Badge>
            <span>{pipeline.stages.length} tahap</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <p>{pipeline.description || "Tanpa deskripsi."}</p>
          <p className="text-xs text-muted-foreground">{movementRuleDescriptions[pipeline.movement]}</p>
        </div>
        <LeadsStageFlow pipeline={pipeline} leads={pipelineLeads} />
      </section>

      <LeadsSummary pipeline={pipeline} leads={pipelineLeads} />

      <div className="flex flex-wrap items-center gap-2">
        <ToggleGroup
          aria-label="Tampilan lead"
          variant="outline"
          spacing={0}
          value={[view]}
          onValueChange={(values) => {
            const next = values[0];
            if (next === "kanban" || next === "list") setView(next);
          }}
        >
          <ToggleGroupItem value="kanban" aria-label="Kanban">
            <KanbanIcon data-icon="inline-start" />
            Kanban
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List">
            <ListIcon data-icon="inline-start" />
            List
          </ToggleGroupItem>
        </ToggleGroup>
        <SearchFilter
          key={searchKey}
          placeholder="Cari perusahaan, kontak, email…"
          className="w-full sm:w-64"
          onValueChange={setQuery}
        />
        <SelectFilter
          options={ownerOptions}
          value={owner}
          onValueChange={setOwner}
          placeholder="Penanggung jawab"
          allLabel="Semua penanggung jawab"
        />
        <SelectFilter
          options={priorityOptions}
          value={priority}
          onValueChange={setPriority}
          placeholder="Prioritas"
          allLabel="Semua prioritas"
        />
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Reset filter
          </Button>
        )}
        <p className="ml-auto text-xs text-muted-foreground tabular-nums" aria-live="polite">
          {visible.length} dari {pipelineLeads.length} lead
        </p>
      </div>

      <p
        role="status"
        className={cn(
          notice ? "rounded-lg border px-3 py-2 text-sm" : "sr-only",
          notice?.tone === "error" && "border-destructive/40 bg-destructive/5 text-destructive",
          notice?.tone === "info" && "bg-muted/50",
        )}
      >
        {notice?.text}
      </p>

      {view === "kanban" ? (
        <LeadsKanban
          pipeline={pipeline}
          leads={visible}
          today={today}
          onOpen={openDetail}
          onMove={requestMove}
          onAdd={(stageId) => setForm({ mode: "create", stageId })}
        />
      ) : (
        <LeadsList
          pipeline={pipeline}
          leads={visible}
          today={today}
          onOpen={openDetail}
          onMove={requestMove}
        />
      )}

      <CrudSheet
        open={detail !== undefined}
        onOpenChange={(open) => {
          if (!open) setDetailId(null);
        }}
        title={detail?.company ?? "Detail lead"}
        description={detail ? `${detail.name} · ${pipeline.name}` : "Ringkasan lead."}
      >
        {detail && (
          <LeadDetail
            lead={detail}
            pipeline={pipeline}
            onMove={requestMove}
            onEdit={() => setForm({ mode: "edit", leadId: detail.id })}
            onDelete={() => setPendingDelete(detail)}
          />
        )}
      </CrudSheet>

      <LeadFormDialog
        open={form !== null}
        onOpenChange={(open) => {
          if (!open) setForm(null);
        }}
        pipeline={pipeline}
        owners={leadOwners}
        lead={editing}
        defaultStageId={form?.mode === "create" ? form.stageId : undefined}
        onSubmit={(values) => {
          if (editing) {
            saveLead(updateLeadFields(editing, values));
            setNotice({ tone: "info", text: `Perubahan ${values.company} tersimpan.` });
          } else {
            saveLead(
              buildLead(values, {
                id: `lead-${crypto.randomUUID().slice(0, 8)}`,
                pipelineId: pipeline.id,
                at: new Date().toISOString(),
                by: CURRENT_USER,
              }),
            );
            setNotice({ tone: "info", text: `Lead ${values.company} ditambahkan ke ${pipeline.name}.` });
          }
          setForm(null);
        }}
      />

      <LostReasonDialog
        open={pendingLost !== null}
        onOpenChange={(open) => {
          if (!open) setPendingLost(null);
        }}
        leadLabel={lostLead?.company ?? ""}
        stageName={lostStage?.name ?? "Lost"}
        reasons={lostReasons}
        onConfirm={({ reason, note }) => {
          if (lostLead && lostStage) {
            saveLead(
              moveLead(lostLead, lostStage.id, {
                at: new Date().toISOString(),
                by: CURRENT_USER,
                note: note ? `${reason} — ${note}` : reason,
                lostReason: reason,
              }),
            );
            setNotice({ tone: "info", text: `${lostLead.company} dipindah ke ${lostStage.name}.` });
          }
          setPendingLost(null);
        }}
      />

      <PipelineFormDialog
        open={pipelineOpen}
        onOpenChange={setPipelineOpen}
        existingNames={pipelines.map((item) => item.name)}
        onCreate={(values) => {
          const created = buildPipeline(values, `pipeline-${crypto.randomUUID().slice(0, 8)}`);
          addPipeline(created);
          setPipelineId(created.id);
          setPipelineOpen(false);
          setNotice({ tone: "info", text: `Pipeline ${created.name} dibuat.` });
        }}
      />

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <AlertDialogContent finalFocus={addButton}>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus lead?</AlertDialogTitle>
            <AlertDialogDescription>
              Lead “{pendingDelete?.company}” beserta riwayat pergerakannya akan dihapus. Tindakan
              ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (!pendingDelete) return;
                deleteLead(pendingDelete.id);
                setNotice({ tone: "info", text: `Lead ${pendingDelete.company} dihapus.` });
                setDetailId(null);
                setPendingDelete(null);
              }}
            >
              Hapus lead
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppBody>
  );
}
