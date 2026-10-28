"use client";

import { FileIcon, PaperclipIcon, RotateCcwIcon, XIcon } from "lucide-react";

import { CrudInlinePanel } from "@/components/crud/crud-inline-panel";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputGroupButton } from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  agentInitialFiles,
  agentPickableFiles,
  aiChatModels,
} from "@/mocks/ai-chat.mock";
import { ChatComposer } from "./chat-composer";
import { ChatMessageItem } from "./chat-message";
import { ChatThread, ChatThreadItem } from "./chat-thread";
import type { AgentTask } from "../hooks/use-agent-task";
import { PHASE_LABELS } from "../utils/agent-task";
import {
  BriefCard,
  ForkCard,
  HandoffCard,
  PlanCard,
  RetryAction,
} from "./agent-cards";

const attachableFiles = [...agentInitialFiles, ...agentPickableFiles];

export function AgentPanel({
  agent,
  onClose,
}: {
  agent: AgentTask;
  onClose: () => void;
}) {
  const working = agent.phase === "running";

  return (
    <CrudInlinePanel
      title="Agent harga Q4"
      actions={
        <>
          <Badge
            variant={agent.phase === "failed" ? "destructive" : "secondary"}
            role="status"
          >
            {PHASE_LABELS[agent.phase]}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Putar ulang dari brief"
            disabled={agent.phase === "brief"}
            onClick={agent.rewind}
          >
            <RotateCcwIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Tutup agent"
            onClick={onClose}
          >
            <XIcon />
          </Button>
        </>
      }
    >
      <div className="flex h-full min-h-0 flex-col">
        {agent.contextChanged && (
          <Alert className="m-3 mb-0 w-auto">
            <AlertDescription className="flex flex-wrap items-center justify-between gap-2">
              Konteks berubah setelah run dimulai.
              <Button size="sm" variant="outline" onClick={agent.rewind}>
                <RotateCcwIcon data-icon="inline-start" />
                Putar ulang
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <ChatThread label="Percakapan agent">
          {agent.messages.map((message) => (
            <ChatThreadItem key={message.id} messageId={message.id}>
              <ChatMessageItem message={message}>
                {message.meta?.kind === "brief" && <BriefCard agent={agent} />}
                {message.meta?.kind === "plan" && <PlanCard agent={agent} />}
                {message.meta?.kind === "retry" && (
                  <RetryAction agent={agent} />
                )}
                {message.meta?.kind === "fork" && <ForkCard agent={agent} />}
                {message.meta?.kind === "handoff" && (
                  <HandoffCard agent={agent} />
                )}
              </ChatMessageItem>
            </ChatThreadItem>
          ))}
        </ChatThread>

        <div className="shrink-0 border-t p-3">
          <ChatComposer
            label="Pesan untuk agent"
            placeholder={
              working ? "Tambahkan catatan untuk agent…" : "Kirim instruksi…"
            }
            value={agent.prompt}
            onValueChange={agent.setPrompt}
            onSubmit={agent.sendNote}
            busy={agent.replying}
            toolbar={
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <InputGroupButton
                        size="icon-sm"
                        aria-label="Lampirkan file"
                      />
                    }
                  >
                    <PaperclipIcon />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-60">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>File untuk agent</DropdownMenuLabel>
                      {attachableFiles.map((file) => (
                        <DropdownMenuCheckboxItem
                          key={file.id}
                          checked={agent.files.some(
                            (item) => item.id === file.id,
                          )}
                          onCheckedChange={() => agent.toggleFile(file)}
                        >
                          <FileIcon />
                          <span className="truncate">{file.name}</span>
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Select
                  items={aiChatModels}
                  value={agent.modelId}
                  onValueChange={(value) => {
                    if (value) agent.setModelId(value);
                  }}
                >
                  <SelectTrigger
                    size="sm"
                    aria-label="Model"
                    className="border-0 shadow-none"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {aiChatModels.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            }
          />
        </div>
      </div>
    </CrudInlinePanel>
  );
}
