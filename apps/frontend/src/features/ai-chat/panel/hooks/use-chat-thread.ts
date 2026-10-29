"use client";

import { useCallback, useState } from "react";

import type { ChatMessage } from "../types/chat";
import { createId } from "@/features/ai-chat/utils/stream-text";
import { useTimers } from "@/features/ai-chat/hooks/use-timers";

type ReplyOptions<TMeta> = {
  meta?: TMeta;
  delay?: number;
  onDone?: (id: string) => void;
};

/** State percakapan bersama untuk varian AI Chat dengan balasan yang di-stream. */
export function useChatThread<TMeta = undefined>(
  initial: ChatMessage<TMeta>[] = [],
) {
  const [messages, setMessages] = useState(initial);
  const timers = useTimers();

  const update = useCallback(
    (id: string, patch: Partial<ChatMessage<TMeta>>) =>
      setMessages((list) =>
        list.map((message) =>
          message.id === id ? { ...message, ...patch } : message,
        ),
      ),
    [],
  );

  const send = useCallback((text: string, meta?: TMeta) => {
    const message: ChatMessage<TMeta> = {
      id: createId(),
      role: "user",
      text,
      status: "done",
      meta,
    };
    setMessages((list) => [...list, message]);
    return message;
  }, []);

  const reply = useCallback(
    (text: string, { meta, delay = 700, onDone }: ReplyOptions<TMeta> = {}) => {
      const id = createId();
      setMessages((list) => [
        ...list,
        { id, role: "assistant", text: "", status: "thinking", meta },
      ]);
      timers.stream(text, {
        delay,
        onChunk: (chunk) => update(id, { text: chunk, status: "streaming" }),
        onDone: () => {
          update(id, { status: "done" });
          onDone?.(id);
        },
      });
      return id;
    },
    [timers, update],
  );

  const reset = useCallback(
    (next: ChatMessage<TMeta>[] = []) => {
      timers.clear();
      setMessages(next);
    },
    [timers],
  );

  return {
    messages,
    send,
    reply,
    update,
    reset,
    timers,
    replying: messages.some((message) => message.status !== "done"),
  };
}
