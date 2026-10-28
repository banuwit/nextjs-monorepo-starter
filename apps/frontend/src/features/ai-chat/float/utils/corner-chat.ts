import {
  cornerFallbackReply,
  cornerNeedsContextReply,
  cornerReplyLibrary,
} from "@/mocks/ai-chat.mock";
import type { CornerChatMessage, CornerChatThread } from "../types/corner-chat";

/** Memilih jawaban statis berdasarkan kata kunci; ganti dengan output model. */
export function composeReply(prompt: string, hasContext: boolean) {
  const query = prompt.toLowerCase();
  const entry = cornerReplyLibrary.find((item) =>
    item.keywords.some((keyword) => query.includes(keyword)),
  );
  if (!entry) return { answer: cornerFallbackReply, usedContext: false };
  if (entry.needsContext && !hasContext)
    return { answer: cornerNeedsContextReply, usedContext: false };
  return { answer: entry.answer, usedContext: entry.needsContext };
}

export function toThread(
  id: string,
  messages: CornerChatMessage[],
  pinned: boolean,
): CornerChatThread {
  const first =
    messages.find((message) => message.role === "user")?.text ?? "Chat baru";
  return {
    id,
    title: first.length > 42 ? `${first.slice(0, 40).trimEnd()}…` : first,
    updatedAt: "Baru saja",
    pinned,
    // Balasan yang terpotong saat diarsipkan tetap disimpan sebagai selesai.
    messages: messages.map((message) => ({ ...message, status: "done" })),
  };
}

export function sortThreads(threads: CornerChatThread[]) {
  return [...threads].sort((a, b) => Number(b.pinned) - Number(a.pinned));
}
