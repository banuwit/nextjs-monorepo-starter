"use client";

import { useCallback, useState } from "react";

import {
  aiChatModels,
  chatModes,
  connectedAtStart,
} from "@/mocks/ai-chat.mock";
import { useTimers } from "@/features/ai-chat/hooks/use-timers";
import { createId } from "@/features/ai-chat/utils/stream-text";
import type { ComposerFile, ConnectedRun } from "../types/connected-apps";
import {
  createReceipts,
  getMode,
  NO_SOURCE_ANSWER,
  STEP_MS,
} from "../utils/connected-apps";

export function useConnectedAppsChat() {
  const [connected, setConnected] = useState<string[]>(connectedAtStart);
  const [modeId, setModeId] = useState(chatModes[0]!.id);
  const [modelId, setModelId] = useState(aiChatModels[0]!.value);
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState<ComposerFile[]>([]);
  const [runs, setRuns] = useState<ConnectedRun[]>([]);
  const timers = useTimers();

  const updateRun = useCallback(
    (id: string, patch: Partial<ConnectedRun>) =>
      setRuns((list) =>
        list.map((run) => (run.id === id ? { ...run, ...patch } : run)),
      ),
    [],
  );

  function toggleApp(appId: string) {
    setConnected((list) =>
      list.includes(appId)
        ? list.filter((id) => id !== appId)
        : [...list, appId],
    );
  }

  function selectMode(id: string) {
    setModeId(id);
    setPrompt(getMode(id).prompt);
  }

  function toggleFile(file: ComposerFile) {
    setFiles((list) =>
      list.some((item) => item.id === file.id)
        ? list.filter((item) => item.id !== file.id)
        : [...list, file],
    );
  }

  function send() {
    const text = prompt.trim();
    if (!text) return;
    const mode = getMode(modeId);
    const receipts = createReceipts(mode, connected);
    const id = createId("run");
    setRuns((list) => [
      ...list,
      {
        id,
        prompt: text,
        modeId,
        modelId,
        files,
        receipts,
        stepIndex: 0,
        answer: "",
        status: "working",
      },
    ]);
    setPrompt("");
    setFiles([]);

    const answer = receipts.some((receipt) => receipt.state === "read")
      ? mode.answer
      : NO_SOURCE_ANSWER;
    const tick = (index: number) =>
      timers.after(STEP_MS, () => {
        const next = index + 1;
        updateRun(id, { stepIndex: next });
        if (next < mode.steps.length) return tick(next);
        updateRun(id, { status: "answering" });
        timers.stream(answer, {
          delay: 200,
          onChunk: (chunk) => updateRun(id, { answer: chunk }),
          onDone: () => updateRun(id, { status: "done" }),
        });
      });
    tick(0);
  }

  function newChat() {
    timers.clear();
    setRuns([]);
    setPrompt("");
    setFiles([]);
  }

  return {
    connected,
    toggleApp,
    modeId,
    selectMode,
    modelId,
    setModelId,
    prompt,
    setPrompt,
    files,
    toggleFile,
    runs,
    send,
    newChat,
    busy: runs.some((run) => run.status !== "done"),
  };
}
