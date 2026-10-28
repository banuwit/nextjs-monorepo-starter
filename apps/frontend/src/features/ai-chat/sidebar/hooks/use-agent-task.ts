"use client";

import { useCallback, useRef, useState } from "react";

import {
  agentForkAfterStep,
  agentForkChoices,
  agentInitialFiles,
  agentOwners,
  agentSources,
  aiChatModels,
} from "@/mocks/ai-chat.mock";
import { useChatThread } from "../../hooks/use-chat-thread";
import type {
  AgentFile,
  AgentMessageMeta,
  AgentPhase,
  PlanStepState,
} from "../types/agent-task";
import {
  AGENT_REPLIES,
  createInitialMessages,
  createSteps,
} from "../utils/agent-task";

export function useAgentTask() {
  const thread = useChatThread<AgentMessageMeta>(createInitialMessages());
  const { send, reply, timers } = thread;
  const [phase, setPhase] = useState<AgentPhase>("brief");
  const [sources, setSources] = useState(() => agentSources.map((s) => s.id));
  const [files, setFiles] = useState<AgentFile[]>(agentInitialFiles);
  const [steps, setStepsState] = useState(createSteps);
  const [forkChoice, setForkChoice] = useState<string | null>(null);
  const [owner, setOwner] = useState(agentOwners[0]!.value);
  const [modelId, setModelId] = useState(aiChatModels[1]!.value);
  const [contextChanged, setContextChanged] = useState(false);
  const [prompt, setPrompt] = useState("");
  // Timer langkah membaca nilai terbaru lewat ref, bukan closure render lama.
  const stepsRef = useRef(steps);
  const forkRef = useRef<string | null>(null);

  const commitSteps = useCallback((next: PlanStepState[]) => {
    stepsRef.current = next;
    setStepsState(next);
  }, []);

  const patchStep = useCallback(
    (id: string, patch: Partial<PlanStepState>) =>
      commitSteps(
        stepsRef.current.map((step) =>
          step.id === id ? { ...step, ...patch } : step,
        ),
      ),
    [commitSteps],
  );

  function markContextChanged() {
    if (phase !== "brief") setContextChanged(true);
  }

  function toggleSource(id: string) {
    setSources((list) =>
      list.includes(id) ? list.filter((item) => item !== id) : [...list, id],
    );
    markContextChanged();
  }

  function toggleFile(file: AgentFile) {
    setFiles((list) =>
      list.some((item) => item.id === file.id)
        ? list.filter((item) => item.id !== file.id)
        : [...list, file],
    );
    markContextChanged();
  }

  function confirmBrief() {
    setPhase("plan");
    send(
      `Sumber dikonfirmasi: ${sources.length} sumber dan ${files.length} file.`,
    );
    reply(AGENT_REPLIES.plan, { meta: { kind: "plan" } });
  }

  function toggleSkip(id: string) {
    const step = stepsRef.current.find((item) => item.id === id);
    if (!step) return;
    patchStep(id, {
      status: step.status === "skipped" ? "pending" : "skipped",
    });
  }

  function finish() {
    setPhase("handoff");
    reply(AGENT_REPLIES.handoff, { meta: { kind: "handoff" } });
  }

  function runNext() {
    const next = stepsRef.current.find((step) => step.status === "pending");
    if (next) runStep(next);
    else finish();
  }

  function runStep(step: PlanStepState) {
    patchStep(step.id, { status: "running" });
    timers.after(step.runMs, () => {
      const attempts =
        (stepsRef.current.find((item) => item.id === step.id)?.attempts ?? 0) +
        1;
      if (step.failFirstRun && attempts === 1) {
        patchStep(step.id, { status: "error", attempts });
        setPhase("failed");
        reply(AGENT_REPLIES.failed(step.title), {
          meta: { kind: "retry" },
          delay: 300,
        });
        return;
      }
      patchStep(step.id, { status: "done", attempts });
      if (step.id === agentForkAfterStep && forkRef.current === null) {
        setPhase("fork");
        reply(AGENT_REPLIES.fork, { meta: { kind: "fork" }, delay: 300 });
        return;
      }
      runNext();
    });
  }

  function runPlan() {
    setPhase("running");
    send("Jalankan rencana.");
    runNext();
  }

  function retryStep(id: string) {
    const step = stepsRef.current.find((item) => item.id === id);
    if (!step) return;
    setPhase("running");
    runStep(step);
  }

  function chooseFork(choiceId: string) {
    const choice = agentForkChoices.find((item) => item.id === choiceId);
    if (!choice) return;
    forkRef.current = choiceId;
    setForkChoice(choiceId);
    send(choice.label);
    commitSteps(
      stepsRef.current.map((step) =>
        step.branch &&
        choiceId !== "both" &&
        step.branch !== choiceId &&
        step.status === "pending"
          ? { ...step, status: "skipped" }
          : step,
      ),
    );
    setPhase("running");
    runNext();
  }

  function createTask() {
    const ownerLabel =
      agentOwners.find((item) => item.value === owner)?.label ?? owner;
    setPhase("created");
    send(`Tugaskan ke ${ownerLabel}.`);
    reply(AGENT_REPLIES.created(ownerLabel), { meta: { kind: "note" } });
  }

  function rewind() {
    forkRef.current = null;
    setForkChoice(null);
    commitSteps(createSteps());
    setContextChanged(false);
    setPhase("brief");
    thread.reset(createInitialMessages());
  }

  function sendNote() {
    const text = prompt.trim();
    if (!text) return;
    setPrompt("");
    send(text);
    reply(AGENT_REPLIES.note, { meta: { kind: "note" } });
  }

  return {
    messages: thread.messages,
    replying: thread.replying,
    phase,
    sources,
    toggleSource,
    files,
    toggleFile,
    steps,
    toggleSkip,
    confirmBrief,
    runPlan,
    retryStep,
    forkChoice,
    chooseFork,
    owner,
    setOwner,
    createTask,
    modelId,
    setModelId,
    contextChanged,
    rewind,
    prompt,
    setPrompt,
    sendNote,
  };
}

export type AgentTask = ReturnType<typeof useAgentTask>;
