import {
  agentCostPerThousandTokens,
  agentPlanSteps,
} from "@/mocks/ai-chat.mock";
import type { ChatMessage } from "../../types/ai-chat";
import type {
  AgentMessageMeta,
  AgentPhase,
  PlanStepState,
} from "../types/agent-task";

export const AGENT_REPLIES = {
  brief:
    "Saya akan menyiapkan rekomendasi harga Q4. Sebelum mulai, konfirmasi sumber workspace dan file yang boleh saya baca, ubah, atau jalankan.",
  plan: "Ini rencana kerja saya. Hapus centang langkah yang ingin dilewati, lalu jalankan.",
  fork: "Data elastisitas menunjukkan dua arah yang sama kuat. Skenario mana yang perlu saya simulasikan?",
  failed: (title: string) =>
    `Langkah “${title}” gagal: tabel harga kompetitor memakai mata uang berbeda. Saya sudah menormalkan kolomnya — coba jalankan ulang langkah ini.`,
  handoff:
    "Selesai. Rekomendasi: naikkan harga paket Pro 8% dengan diskon volume hingga 20%. Saya menghasilkan dua file di bawah. Tugaskan ke siapa untuk ditinjau?",
  created: (owner: string) =>
    `Tiket PRC-142 dibuat dan ditugaskan ke ${owner}, lengkap dengan kedua file hasil run.`,
  note: "Catatan diterima. Saya akan memakainya pada langkah berikutnya.",
};

export const PHASE_LABELS: Record<AgentPhase, string> = {
  brief: "Menunggu brief",
  plan: "Menunggu persetujuan",
  running: "Berjalan",
  fork: "Butuh jawaban",
  failed: "Langkah gagal",
  handoff: "Siap diserahkan",
  created: "Selesai",
};

export function createSteps(): PlanStepState[] {
  return agentPlanSteps.map((step) => ({
    ...step,
    status: "pending",
    attempts: 0,
  }));
}

export function createInitialMessages(): ChatMessage<AgentMessageMeta>[] {
  return [
    {
      id: "agent-brief",
      role: "assistant",
      text: AGENT_REPLIES.brief,
      status: "done",
      meta: { kind: "brief" },
    },
  ];
}

export function summarizeRun(steps: PlanStepState[]) {
  const finished = steps.filter((step) => step.status === "done");
  const tokens = finished.reduce((total, step) => total + step.tokens, 0);
  const seconds =
    finished.reduce((total, step) => total + step.runMs, 0) / 1000;
  return {
    tokens,
    seconds,
    cost: (tokens / 1000) * agentCostPerThousandTokens,
  };
}

export const formatTokens = (tokens: number) =>
  `${(tokens / 1000).toLocaleString("id-ID", { maximumFractionDigits: 1 })}k token`;

export const formatCost = (cost: number) =>
  cost.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 3,
  });
