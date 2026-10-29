"use client";

import {
  BlocksIcon,
  FileIcon,
  PaperclipIcon,
  SparklesIcon,
  SquarePenIcon,
  XIcon,
} from "lucide-react";

import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  aiChatModels,
  chatModes,
  composerFiles,
  connectedApps,
} from "@/mocks/ai-chat.mock";
import { ChatComposer } from "@/features/ai-chat/components/chat-composer";
import { useConnectedAppsChat } from "../hooks/use-connected-apps-chat";
import { AppLogo } from "./app-logo";
import { RunPanel } from "./run-panel";

const modeItems = chatModes.map((mode) => ({
  value: mode.id,
  label: mode.label,
}));

export function ConnectedAppsChatPage() {
  const chat = useConnectedAppsChat();
  const started = chat.runs.length > 0;

  const toolbar = (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <InputGroupButton size="icon-sm" aria-label="Lampirkan file" />
          }
        >
          <PaperclipIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60">
          <DropdownMenuGroup>
            <DropdownMenuLabel>File terbaru</DropdownMenuLabel>
            {composerFiles.map((file) => (
              <DropdownMenuCheckboxItem
                key={file.id}
                checked={chat.files.some((item) => item.id === file.id)}
                onCheckedChange={() => chat.toggleFile(file)}
              >
                <FileIcon />
                <span className="truncate">{file.name}</span>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={<InputGroupButton size="xs" aria-label="Pilih aplikasi" />}
        >
          <BlocksIcon />
          <span className="hidden sm:inline">Aplikasi</span>
          <span className="tabular-nums">
            {chat.connected.length}/{connectedApps.length}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Boleh dibaca asisten</DropdownMenuLabel>
            {connectedApps.map((app) => (
              <DropdownMenuCheckboxItem
                key={app.id}
                checked={chat.connected.includes(app.id)}
                onCheckedChange={() => chat.toggleApp(app.id)}
              >
                <AppLogo appId={app.id} className="size-5 [&_svg]:size-3" />
                {app.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Select
        items={modeItems}
        value={chat.modeId}
        onValueChange={(value) => {
          if (value) chat.selectMode(value);
        }}
      >
        <SelectTrigger
          size="sm"
          aria-label="Mode"
          className="border-0 shadow-none"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {modeItems.map((mode) => (
            <SelectItem key={mode.value} value={mode.value}>
              {mode.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        items={aiChatModels}
        value={chat.modelId}
        onValueChange={(value) => {
          if (value) chat.setModelId(value);
        }}
      >
        <SelectTrigger
          size="sm"
          aria-label="Model"
          className="hidden border-0 shadow-none md:flex"
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
  );

  const stagedFiles = chat.files.length > 0 && (
    <div className="flex flex-wrap gap-2">
      {chat.files.map((file) => (
        <Attachment key={file.id} size="xs">
          <AttachmentMedia>
            <FileIcon />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{file.name}</AttachmentTitle>
            <AttachmentDescription>{file.size}</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction
              aria-label={`Hapus ${file.name}`}
              onClick={() => chat.toggleFile(file)}
            >
              <XIcon />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      ))}
    </div>
  );

  return (
    <AppBody>
      <PageHeading title="AI Chat" currentPage="Page">
        <Button variant="outline" disabled={!started} onClick={chat.newChat}>
          <SquarePenIcon data-icon="inline-start" />
          Chat baru
        </Button>
      </PageHeading>

      <div
        className={cn(
          "mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6",
          !started && "justify-center py-8",
        )}
      >
        {started ? (
          <div
            role="log"
            aria-label="Percakapan"
            className="flex flex-col gap-10 pt-2"
          >
            {chat.runs.map((run) => (
              <RunPanel
                key={run.id}
                run={run}
                connected={chat.connected}
                onConnect={chat.toggleApp}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <SparklesIcon className="size-6" aria-hidden="true" />
            </span>
            <h2 className="text-2xl font-semibold tracking-tight">
              Apa yang ingin Anda ketahui hari ini?
            </h2>
            <p className="max-w-md text-sm text-muted-foreground">
              Jawaban hanya diambil dari aplikasi yang terhubung. Aktifkan atau
              matikan aplikasi di bawah kotak pesan untuk mengatur sumbernya.
            </p>
          </div>
        )}

        <div
          data-slot="composer-frame"
          className={cn(
            "rounded-2xl border border-border bg-muted p-1",
            started && "sticky bottom-4 mt-auto shadow-lg",
          )}
        >
          <ChatComposer
            label="Pesan untuk asisten"
            placeholder="Tanyakan apa saja tentang pekerjaan Anda…"
            value={chat.prompt}
            onValueChange={chat.setPrompt}
            onSubmit={chat.send}
            busy={chat.busy}
            header={stagedFiles || undefined}
            toolbar={toolbar}
            showHint={!started}
          />
          <div
            data-slot="composer-frame-footer"
            className="flex items-center gap-2 overflow-x-auto px-2 pt-1.5 pb-1"
          >
            <span className="shrink-0 text-xs text-muted-foreground">
              Sumber
            </span>
            <div className="flex items-center gap-1">
              {connectedApps.map((app) => {
                const isConnected = chat.connected.includes(app.id);
                return (
                  <Tooltip key={app.id}>
                    <TooltipTrigger
                      render={
                        <button
                          type="button"
                          aria-pressed={isConnected}
                          aria-label={`${app.name}: ${isConnected ? "terhubung" : "belum terhubung"}`}
                          className="rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                          onClick={() => chat.toggleApp(app.id)}
                        />
                      }
                    >
                      <AppLogo
                        appId={app.id}
                        muted={!isConnected}
                        className={cn(!isConnected && "opacity-60")}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      {app.name} ·{" "}
                      {isConnected ? "terhubung" : "belum terhubung"}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </div>

        {!started && (
          <div className="grid gap-2 sm:grid-cols-2" aria-label="Mode kerja">
            {chatModes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                aria-pressed={chat.modeId === mode.id}
                onClick={() => chat.selectMode(mode.id)}
                className="flex flex-col items-start gap-0.5 rounded-lg border border-border bg-card p-3 text-left text-card-foreground transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 aria-pressed:border-primary"
              >
                <span className="text-sm font-medium">{mode.label}</span>
                <span className="text-xs text-muted-foreground">
                  {mode.description}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </AppBody>
  );
}
