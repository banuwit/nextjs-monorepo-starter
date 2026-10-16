"use client";

import { useEffect, useRef, useState } from "react";
import type { SortingState } from "@tanstack/react-table";
import {
  CalendarClockIcon,
  CheckCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FolderKanbanIcon,
  LayersIcon,
  LayoutGridIcon,
  Table2Icon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";
import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { CrudSheet } from "@/components/crud/crud-sheet";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  isOverdue,
  projectPriorities,
  projectStatuses,
  selectProjects,
  sortProjects,
  todayDate,
  type Project,
} from "../project-model";
import { useProjects } from "../use-projects";
import { ProjectDetail } from "./project-detail";
import { ProjectForm } from "./project-form";
import { ProjectTable } from "./project-table";
import { ProjectCards } from "./project-cards";

type Panel = { mode: "create" } | { mode: "view" | "edit"; project: Project };

export function ProjectPage() {
  const { projects, ready, error, reload, commit } = useProjects();
  const [panel, setPanel] = useState<Panel | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null);
  const [dirty, setDirty] = useState(false);
  const [discard, setDiscard] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [view, setView] = useState("table");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [today, setToday] = useState("");
  const [notice, setNotice] = useState("");
  const newButton = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const update = () => setToday(todayDate());
    const initial = window.setTimeout(update, 0);
    const interval = window.setInterval(update, 60_000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
    };
  }, []);

  const overdueCount = today
    ? projects.filter((project) => isOverdue(project, today)).length
    : 0;
  const filtered = sortProjects(
    selectProjects(projects, query, status, priority).filter(
      (project) => !overdueOnly || (today && isOverdue(project, today)),
    ),
    sorting,
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const hasFilters =
    query !== "" || status !== "all" || priority !== "all" || overdueOnly;

  function openPanel(next: Panel) {
    returnFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : newButton.current;
    setDirty(false);
    setPanel(next);
  }

  function closePanel() {
    if (dirty) setDiscard(true);
    else setPanel(null);
  }

  function save(project: Project) {
    if (!commit({ type: "save", project, isNew: panel?.mode === "create" }))
      return;
    setNotice(
      panel?.mode === "create"
        ? `Project “${project.name}” berhasil dibuat.`
        : `Perubahan “${project.name}” tersimpan.`,
    );
    setDirty(false);
    setPanel(null);
    resetFilters();
  }

  function resetFilters() {
    setQuery("");
    setStatus("all");
    setPriority("all");
    setOverdueOnly(false);
    setPage(0);
  }

  const stats = [
    {
      label: "Total project",
      value: projects.length,
      icon: FolderKanbanIcon,
      hint: "Seluruh portofolio",
    },
    {
      label: "Sedang berjalan",
      value: projects.filter((project) => project.status === "active").length,
      icon: LayersIcon,
      hint: "Dalam pengerjaan",
    },
    {
      label: "Lewat tenggat",
      value: overdueCount,
      icon: CalendarClockIcon,
      hint: "Perlu ditindaklanjuti",
    },
    {
      label: "Selesai",
      value: projects.filter((project) => project.status === "completed")
        .length,
      icon: CheckCheckIcon,
      hint: "Sudah diselesaikan",
    },
  ];

  return (
    <AppBody>
      <PageHeading
        title="Project"
        currentPage="Project"
        parents={[{ label: "Dashboard", href: "/dashboard" }]}
      >
        <Button
          ref={newButton}
          disabled={!ready}
          onClick={() => openPanel({ mode: "create" })}
        >
          <PlusIcon data-icon="inline-start" />
          Tambah project
        </Button>
      </PageHeading>
      <section
        aria-label="Ringkasan project"
        className="grid grid-cols-2 divide-x divide-border overflow-hidden rounded-xl border bg-card lg:grid-cols-4"
      >
        {stats.map(({ label, value, icon: Icon, hint }) => (
          <div key={label} className="flex flex-col gap-3 p-4 lg:p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-muted-foreground">
                {label}
              </p>
              <Icon className="size-4 shrink-0 text-muted-foreground" />
            </div>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="text-3xl font-semibold tracking-tight tabular-nums">
                {ready ? value : "—"}
              </p>
              <span className="text-xs text-muted-foreground">{hint}</span>
            </div>
          </div>
        ))}
      </section>
      {ready && overdueCount > 0 && (
        <Alert>
          <CalendarClockIcon />
          <AlertDescription className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <span>
              <strong>{overdueCount} project melewati tenggat.</strong> Tinjau
              progres dan jadwal bersama tim.
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                resetFilters();
                setOverdueOnly(true);
              }}
            >
              Lihat project terlambat
            </Button>
          </AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="flex flex-col items-start gap-2">
            {error}
            <Button variant="outline" size="sm" onClick={reload}>
              Coba muat ulang
            </Button>
          </AlertDescription>
        </Alert>
      )}
      <p role="status" className={notice ? "text-sm text-primary" : "sr-only"}>
        {notice}
      </p>
      <section
        aria-label="Daftar project"
        className="min-w-0 overflow-hidden rounded-xl border bg-card"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-4 sm:px-5">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold">Semua project</h2>
            <Badge variant="secondary">{ready ? projects.length : "…"}</Badge>
          </div>
          <ToggleGroup
            aria-label="Tampilan project"
            variant="outline"
            spacing={0}
            value={[view]}
            onValueChange={(values) => {
              if (values[0]) setView(values[0]);
            }}
          >
            <ToggleGroupItem value="table" aria-label="Table">
              <Table2Icon data-icon="inline-start" />
              Table
            </ToggleGroupItem>
            <ToggleGroupItem value="card" aria-label="Card">
              <LayoutGridIcon data-icon="inline-start" />
              Card
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="flex flex-wrap items-center gap-3 p-4 sm:px-5">
          <InputGroup className="w-full sm:max-w-sm">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              type="search"
              aria-label="Cari project"
              placeholder="Cari project, klien, atau penanggung jawab…"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(0);
              }}
            />
          </InputGroup>
          <NativeSelect
            aria-label="Filter status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(0);
            }}
          >
            <NativeSelectOption value="all">Semua status</NativeSelectOption>
            {Object.entries(projectStatuses).map(([value, label]) => (
              <NativeSelectOption key={value} value={value}>
                {label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <NativeSelect
            aria-label="Filter prioritas"
            value={priority}
            onChange={(event) => {
              setPriority(event.target.value);
              setPage(0);
            }}
          >
            <NativeSelectOption value="all">Semua prioritas</NativeSelectOption>
            {Object.entries(projectPriorities).map(([value, label]) => (
              <NativeSelectOption key={value} value={value}>
                {label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          {overdueOnly && <Badge variant="destructive">Lewat tenggat</Badge>}
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Reset filter
            </Button>
          )}
        </div>
        {ready && filtered.length === 0 ? (
          <Empty className="py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderKanbanIcon />
              </EmptyMedia>
              <EmptyTitle>
                {hasFilters
                  ? "Project tidak ditemukan"
                  : "Mulai project pertama Anda"}
              </EmptyTitle>
              <EmptyDescription>
                {hasFilters
                  ? "Coba kata kunci lain atau reset filter untuk melihat seluruh project."
                  : "Tambahkan project, tentukan penanggung jawab, dan atur tenggatnya."}
              </EmptyDescription>
            </EmptyHeader>
            <Button
              variant={hasFilters ? "outline" : "default"}
              onClick={
                hasFilters ? resetFilters : () => openPanel({ mode: "create" })
              }
            >
              {hasFilters ? "Reset filter" : "Tambah project"}
            </Button>
          </Empty>
        ) : view === "card" && ready ? (
          <ProjectCards
            projects={filtered.slice(
              currentPage * pageSize,
              (currentPage + 1) * pageSize,
            )}
            today={today}
            onView={(project) => openPanel({ mode: "view", project })}
            onEdit={(project) => openPanel({ mode: "edit", project })}
            onDelete={setPendingDelete}
          />
        ) : (
          <ProjectTable
            projects={filtered}
            pageIndex={currentPage}
            pageSize={pageSize}
            sorting={sorting}
            onSort={(updater) => {
              setSorting(updater);
              setPage(0);
            }}
            today={today}
            loading={!ready}
            onView={(project) => openPanel({ mode: "view", project })}
            onEdit={(project) => openPanel({ mode: "edit", project })}
            onDelete={setPendingDelete}
          />
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-xs text-muted-foreground sm:px-5">
          <p aria-live="polite">
            {filtered.length ? currentPage * pageSize + 1 : 0}–
            {Math.min((currentPage + 1) * pageSize, filtered.length)} dari{" "}
            {filtered.length} project
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <NativeSelect
              size="sm"
              aria-label="Project per halaman"
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(0);
              }}
            >
              {[5, 10, 20].map((count) => (
                <NativeSelectOption key={count} value={count}>
                  {count} / halaman
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <span>
              {currentPage + 1} / {pageCount}
            </span>
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="outline"
                aria-label="Halaman sebelumnya"
                disabled={currentPage === 0}
                onClick={() => setPage(currentPage - 1)}
              >
                <ChevronLeftIcon />
              </Button>
              <Button
                size="icon"
                variant="outline"
                aria-label="Halaman berikutnya"
                disabled={currentPage + 1 >= pageCount}
                onClick={() => setPage(currentPage + 1)}
              >
                <ChevronRightIcon />
              </Button>
            </div>
          </div>
        </div>
      </section>
      <CrudSheet
        open={panel !== null}
        onOpenChange={(open) => {
          if (!open) closePanel();
        }}
        finalFocus={returnFocus}
        title={
          panel?.mode === "create"
            ? "Tambah project"
            : panel?.mode === "edit"
              ? "Edit project"
              : (panel?.project.name ?? "Detail project")
        }
        description={
          panel?.mode === "view"
            ? "Ringkasan dan informasi project."
            : "Lengkapi informasi project. Perubahan disimpan di browser ini."
        }
      >
        {panel?.mode === "view" ? (
          <ProjectDetail
            project={panel.project}
            today={today}
            onEdit={() => setPanel({ mode: "edit", project: panel.project })}
            onDelete={() => {
              setPendingDelete(panel.project);
              setPanel(null);
            }}
          />
        ) : (
          panel && (
            <ProjectForm
              key={panel.mode === "edit" ? panel.project.id : "new"}
              project={panel.mode === "edit" ? panel.project : undefined}
              onSave={save}
              onCancel={closePanel}
              onDirty={() => setDirty(true)}
              saveError={error}
            />
          )
        )}
      </CrudSheet>
      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <AlertDialogContent finalFocus={newButton}>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus project?</AlertDialogTitle>
            <AlertDialogDescription>
              Project “{pendingDelete?.name}” akan dihapus dari browser ini.
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (
                  pendingDelete &&
                  commit({ type: "delete", id: pendingDelete.id })
                ) {
                  setNotice(`Project “${pendingDelete.name}” dihapus.`);
                  setPendingDelete(null);
                }
              }}
            >
              Hapus project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={discard} onOpenChange={setDiscard}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Buang perubahan?</AlertDialogTitle>
            <AlertDialogDescription>
              Perubahan yang belum disimpan akan hilang.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Lanjut mengedit</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                setDirty(false);
                setDiscard(false);
                setPanel(null);
              }}
            >
              Buang perubahan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppBody>
  );
}
