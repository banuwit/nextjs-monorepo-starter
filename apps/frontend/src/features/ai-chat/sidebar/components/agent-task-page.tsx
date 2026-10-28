"use client";

import { useState } from "react";
import { BotIcon, CheckIcon, FileIcon, MinusIcon } from "lucide-react";

import { CrudPage } from "@/components/crud/crud-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { agentArtifacts, agentSources } from "@/mocks/ai-chat.mock";
import { useAgentTask } from "../hooks/use-agent-task";
import { formatCost, PHASE_LABELS, summarizeRun } from "../utils/agent-task";
import { AgentPanel } from "./agent-panel";

export function AgentTaskPage() {
  const agent = useAgentTask();
  const [open, setOpen] = useState(true);
  const run = summarizeRun(agent.steps);
  const planned = agent.steps.filter((step) => step.status !== "skipped");
  const finished = planned.filter((step) => step.status === "done");
  const delivered = agent.phase === "handoff" || agent.phase === "created";

  return (
    <CrudPage
      title="AI Chat"
      actions={
        <Button
          variant={open ? "outline" : "default"}
          aria-pressed={open}
          onClick={() => setOpen((value) => !value)}
        >
          <BotIcon data-icon="inline-start" />
          {open ? "Tutup agent" : "Buka agent"}
        </Button>
      }
      sidePanel={
        open ? (
          <AgentPanel agent={agent} onClose={() => setOpen(false)} />
        ) : undefined
      }
    >
      <p className="text-sm text-muted-foreground">
        Agent bekerja di panel samping: konfirmasi sumber, setujui rencana,
        jawab pertanyaan di tengah run, lalu serahkan hasilnya sebagai tiket.
      </p>

      <div className="grid gap-4 @3xl/main:grid-cols-2">
        <Card className="@3xl/main:col-span-2">
          <CardHeader>
            <CardTitle>Rekomendasi harga Q4</CardTitle>
            <CardDescription>
              Tinjau harga paket Pro dan Enterprise berdasarkan pendapatan Q3,
              harga kompetitor, dan elastisitas per segmen.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <span className="flex items-center gap-2">
              Status{" "}
              <Badge variant="secondary">{PHASE_LABELS[agent.phase]}</Badge>
            </span>
            <span className="tabular-nums text-muted-foreground">
              {finished.length}/{planned.length} langkah selesai
            </span>
            <span className="tabular-nums text-muted-foreground">
              Biaya run {formatCost(run.cost)}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Akses agent</CardTitle>
            <CardDescription>Diatur dari brief di panel agent.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2 text-sm">
              {agentSources.map((source) => {
                const allowed = agent.sources.includes(source.id);
                return (
                  <li key={source.id} className="flex items-center gap-2">
                    {allowed ? (
                      <CheckIcon
                        className="size-4 text-primary-text"
                        aria-label="Diizinkan"
                      />
                    ) : (
                      <MinusIcon
                        className="size-4 text-muted-foreground"
                        aria-label="Tidak diizinkan"
                      />
                    )}
                    <span
                      className={allowed ? undefined : "text-muted-foreground"}
                    >
                      {source.name}
                    </span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hasil run</CardTitle>
            <CardDescription>
              {delivered
                ? "File yang dihasilkan agent."
                : "Belum ada hasil. Jalankan rencana di panel agent."}
            </CardDescription>
          </CardHeader>
          {delivered && (
            <CardContent>
              <ul className="flex flex-col gap-2 text-sm">
                {agentArtifacts.map((artifact) => (
                  <li key={artifact.id} className="flex items-center gap-2">
                    <FileIcon
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span className="min-w-0 truncate">{artifact.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {artifact.size}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          )}
        </Card>
      </div>
    </CrudPage>
  );
}
