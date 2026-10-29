"use client";

import {
  FileTextIcon,
  Maximize2Icon,
  Minimize2Icon,
  MinusIcon,
  SparklesIcon,
  SquarePenIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  XIcon,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { InputGroupButton } from "@/components/ui/input-group";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { cornerPageSource, cornerStarters } from "@/mocks/ai-chat.mock";
import { ChatComposer } from "@/features/ai-chat/components/chat-composer";
import { ChatMessageItem } from "./chat-message";
import { ChatThread, ChatThreadItem } from "./chat-thread";
import type { CornerChat, CornerChatTab } from "../hooks/use-corner-chat";
import { CornerChatHistory } from "./corner-chat-history";

function ChatBody({ chat }: { chat: CornerChat }) {
  if (chat.messages.length === 0)
    return (
      <Empty className="flex-1 overflow-y-auto">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SparklesIcon />
          </EmptyMedia>
          <EmptyTitle>Ada yang bisa dibantu?</EmptyTitle>
          <EmptyDescription>
            Tanyakan isi halaman ini atau cara memakai fitur laporan.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="items-stretch">
          {cornerStarters.map((starter) => (
            <Button
              key={starter}
              variant="outline"
              size="sm"
              className="h-auto justify-start py-1.5 text-left whitespace-normal"
              onClick={() => chat.ask(starter)}
            >
              {starter}
            </Button>
          ))}
        </EmptyContent>
      </Empty>
    );

  return (
    <ChatThread label="Percakapan dengan asisten">
      {chat.messages.map((message) => (
        <ChatThreadItem key={message.id} messageId={message.id}>
          <ChatMessageItem
            message={message}
            footer={
              message.role === "assistant" ? (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Jawaban membantu"
                    aria-pressed={message.meta?.rating === "up"}
                    className="aria-pressed:text-primary-text"
                    onClick={() => chat.rate(message, "up")}
                  >
                    <ThumbsUpIcon />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Jawaban tidak membantu"
                    aria-pressed={message.meta?.rating === "down"}
                    className="aria-pressed:text-destructive"
                    onClick={() => chat.rate(message, "down")}
                  >
                    <ThumbsDownIcon />
                  </Button>
                </div>
              ) : undefined
            }
          >
            {message.role === "assistant" && message.meta?.sources && (
              <Marker className="text-xs">
                <MarkerIcon>
                  <FileTextIcon />
                </MarkerIcon>
                <MarkerContent>
                  Berdasarkan {message.meta.sources.join(", ")}
                </MarkerContent>
              </Marker>
            )}
          </ChatMessageItem>
        </ChatThreadItem>
      ))}
    </ChatThread>
  );
}

export function CornerChatWindow({ chat }: { chat: CornerChat }) {
  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-label="Asisten AI"
      data-slot="corner-chat"
      data-expanded={chat.expanded || undefined}
      onKeyDown={(event) => {
        // Event dari dialog konfirmasi yang di-portal ikut bubble lewat pohon React.
        if (!event.currentTarget.contains(event.target as Node)) return;
        if (event.key === "Escape" && !event.defaultPrevented) chat.minimize();
      }}
      className={cn(
        "fixed inset-x-2 top-14 bottom-2 z-50 flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-2xl",
        "sm:inset-x-auto sm:top-auto sm:right-4 sm:bottom-4 sm:h-[min(40rem,calc(100dvh-6rem))] sm:w-96",
        "data-expanded:sm:h-[calc(100dvh-6rem)] data-expanded:sm:w-[min(44rem,calc(100vw-2rem))]",
      )}
    >
      <header className="flex shrink-0 flex-col gap-2 border-b p-3">
        <div className="flex items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <SparklesIcon className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm font-semibold">Asisten</h2>
            <p className="truncate text-xs text-muted-foreground">
              Membaca halaman yang sedang Anda buka
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Chat baru"
            onClick={chat.newChat}
          >
            <SquarePenIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="hidden sm:inline-flex"
            aria-label={chat.expanded ? "Perkecil jendela" : "Perbesar jendela"}
            aria-pressed={chat.expanded}
            onClick={chat.toggleExpanded}
          >
            {chat.expanded ? <Minimize2Icon /> : <Maximize2Icon />}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Minimalkan"
            onClick={chat.minimize}
          >
            <MinusIcon />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Akhiri chat"
                />
              }
            >
              <XIcon />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Akhiri chat?</AlertDialogTitle>
                <AlertDialogDescription>
                  Jendela akan ditutup. Percakapan ini tetap tersimpan di
                  riwayat.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <Button onClick={chat.endChat}>Akhiri chat</Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <Tabs
          value={chat.tab}
          onValueChange={(value) => chat.setTab(value as CornerChatTab)}
        >
          <TabsList className="w-full">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="history">Riwayat</TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      {chat.tab === "history" ? (
        <CornerChatHistory chat={chat} />
      ) : (
        <>
          <ChatBody chat={chat} />
          <div className="shrink-0 border-t p-3">
            <ChatComposer
              label="Pesan untuk asisten"
              value={chat.prompt}
              onValueChange={chat.setPrompt}
              onSubmit={() => chat.ask(chat.prompt)}
              busy={chat.replying}
              header={
                chat.contextAttached ? (
                  <Attachment size="xs">
                    <AttachmentMedia>
                      <FileTextIcon />
                    </AttachmentMedia>
                    <AttachmentContent>
                      <AttachmentTitle>
                        {cornerPageSource.title}
                      </AttachmentTitle>
                      <AttachmentDescription>
                        {cornerPageSource.description}
                      </AttachmentDescription>
                    </AttachmentContent>
                    <AttachmentActions>
                      <AttachmentAction
                        aria-label="Lepas konteks halaman"
                        onClick={() => chat.setContextAttached(false)}
                      >
                        <XIcon />
                      </AttachmentAction>
                    </AttachmentActions>
                  </Attachment>
                ) : undefined
              }
              toolbar={
                chat.contextAttached ? undefined : (
                  <InputGroupButton
                    size="xs"
                    onClick={() => chat.setContextAttached(true)}
                  >
                    <FileTextIcon />
                    Lampirkan halaman
                  </InputGroupButton>
                )
              }
            />
          </div>
        </>
      )}
    </section>
  );
}
