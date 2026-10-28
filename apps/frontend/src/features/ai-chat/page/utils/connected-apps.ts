import { chatModes, connectedApps } from "@/mocks/ai-chat.mock";
import type {
  ChatMode,
  ConnectedApp,
  SourceReceipt,
} from "../types/connected-apps";

/** Jeda antarlangkah kerja simulasi. */
export const STEP_MS = 900;

export const NO_SOURCE_ANSWER =
  "Tidak ada aplikasi yang terhubung untuk mode ini, jadi saya belum bisa membaca data apa pun. Hubungkan salah satu sumber di bawah, lalu kirim ulang pertanyaan.";

export function getMode(id: string): ChatMode {
  return chatModes.find((mode) => mode.id === id) ?? chatModes[0]!;
}

export function getApp(id: string): ConnectedApp | undefined {
  return connectedApps.find((app) => app.id === id);
}

export function createReceipts(
  mode: ChatMode,
  connected: string[],
): SourceReceipt[] {
  return mode.sources.map((appId, index) =>
    connected.includes(appId)
      ? { appId, state: "read", items: (((appId.length + index) * 3) % 9) + 2 }
      : { appId, state: "skipped", items: 0 },
  );
}
