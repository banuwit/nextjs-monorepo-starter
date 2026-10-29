"use client";

import { useRef, useState } from "react";

import { cornerPageSource, cornerThreads } from "@/mocks/ai-chat.mock";
import { useChatThread } from "./use-chat-thread";
import { useTimers } from "@/features/ai-chat/hooks/use-timers";
import { createId } from "@/features/ai-chat/utils/stream-text";
import type {
  CornerChatMessage,
  CornerChatMeta,
  CornerChatThread,
} from "../types/corner-chat";
import { composeReply, sortThreads, toThread } from "../utils/corner-chat";

export type CornerChatTab = "chat" | "history";

const UNDO_MS = 5000;

export function useCornerChat() {
  const thread = useChatThread<CornerChatMeta>();
  const undoTimers = useTimers();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState<CornerChatTab>("chat");
  const [prompt, setPrompt] = useState("");
  const [contextAttached, setContextAttached] = useState(true);
  const [hasNewReply, setHasNewReply] = useState(false);
  const [activeId, setActiveId] = useState(() => createId("thread"));
  const [threads, setThreads] = useState<CornerChatThread[]>(cornerThreads);
  const [deleted, setDeleted] = useState<{
    thread: CornerChatThread;
    index: number;
  } | null>(null);
  // Callback stream membaca status minimize terbaru tanpa closure render lama.
  const minimizedRef = useRef(false);

  function setMinimizedState(value: boolean) {
    minimizedRef.current = value;
    setMinimized(value);
    if (!value) setHasNewReply(false);
  }

  function launch() {
    setOpen(true);
    setMinimizedState(false);
  }

  function ask(text: string) {
    const question = text.trim();
    if (!question || thread.replying) return;
    const sources = contextAttached ? [cornerPageSource.title] : undefined;
    const { answer, usedContext } = composeReply(question, contextAttached);
    thread.send(question, { sources });
    thread.reply(answer, {
      meta: { sources: usedContext ? sources : undefined },
      onDone: () => {
        if (minimizedRef.current) setHasNewReply(true);
      },
    });
    setPrompt("");
    setTab("chat");
  }

  /** Menyimpan percakapan aktif ke riwayat sebelum diganti. */
  function archiveCurrent() {
    if (thread.messages.length === 0) return;
    setThreads((list) => {
      const existing = list.find((item) => item.id === activeId);
      const next = toThread(
        activeId,
        thread.messages,
        existing?.pinned ?? false,
      );
      return [next, ...list.filter((item) => item.id !== activeId)];
    });
  }

  function newChat() {
    archiveCurrent();
    thread.reset([]);
    setActiveId(createId("thread"));
    setTab("chat");
  }

  function openThread(target: CornerChatThread) {
    if (target.id !== activeId) {
      archiveCurrent();
      thread.reset(target.messages);
      setActiveId(target.id);
    }
    setTab("chat");
  }

  function endChat() {
    newChat();
    setOpen(false);
    setExpanded(false);
    setMinimizedState(false);
  }

  function togglePin(id: string) {
    if (id === activeId && !threads.some((item) => item.id === id)) {
      setThreads((list) => [
        toThread(activeId, thread.messages, true),
        ...list,
      ]);
      return;
    }
    setThreads((list) =>
      list.map((item) =>
        item.id === id ? { ...item, pinned: !item.pinned } : item,
      ),
    );
  }

  function deleteThread(id: string) {
    const list = historyThreads;
    const index = list.findIndex((item) => item.id === id);
    const target = list[index];
    if (!target) return;
    setThreads((items) => items.filter((item) => item.id !== id));
    if (id === activeId) {
      thread.reset([]);
      setActiveId(createId("thread"));
    }
    setDeleted({ thread: target, index });
    undoTimers.clear();
    undoTimers.after(UNDO_MS, () => setDeleted(null));
  }

  function undoDelete() {
    if (!deleted) return;
    setThreads((list) => {
      const next = [...list];
      next.splice(Math.min(deleted.index, next.length), 0, deleted.thread);
      return next;
    });
    undoTimers.clear();
    setDeleted(null);
  }

  function rate(message: CornerChatMessage, rating: "up" | "down") {
    thread.update(message.id, {
      meta: {
        ...message.meta,
        rating: message.meta?.rating === rating ? undefined : rating,
      },
    });
  }

  // Percakapan aktif ditampilkan di riwayat walaupun belum diarsipkan.
  const storedActive = threads.find((item) => item.id === activeId);
  const historyThreads = sortThreads(
    thread.messages.length > 0
      ? [
          toThread(activeId, thread.messages, storedActive?.pinned ?? false),
          ...threads.filter((item) => item.id !== activeId),
        ]
      : threads,
  );

  return {
    open,
    launch,
    minimized,
    minimize: () => setMinimizedState(true),
    restore: () => setMinimizedState(false),
    expanded,
    toggleExpanded: () => setExpanded((value) => !value),
    tab,
    setTab,
    prompt,
    setPrompt,
    contextAttached,
    setContextAttached,
    hasNewReply,
    messages: thread.messages,
    replying: thread.replying,
    ask,
    rate,
    newChat,
    endChat,
    activeId,
    historyThreads,
    openThread,
    togglePin,
    deleteThread,
    deleted,
    undoDelete,
  };
}

export type CornerChat = ReturnType<typeof useCornerChat>;
