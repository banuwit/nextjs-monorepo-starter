"use client";

import {
  MessagesSquareIcon,
  PinIcon,
  PinOffIcon,
  Trash2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import { Marker, MarkerContent } from "@/components/ui/marker";
import type { CornerChat } from "../hooks/use-corner-chat";
import type { CornerChatThread } from "../types/corner-chat";

function ThreadSection({
  label,
  threads,
  chat,
}: {
  label: string;
  threads: CornerChatThread[];
  chat: CornerChat;
}) {
  if (threads.length === 0) return null;
  return (
    <section aria-label={label} className="flex flex-col gap-2">
      <Marker variant="separator" className="text-xs">
        <MarkerContent>{label}</MarkerContent>
      </Marker>
      <ItemGroup className="gap-1">
        {threads.map((thread) => {
          const last = thread.messages.at(-1)?.text ?? "";
          const active = thread.id === chat.activeId;
          return (
            <Item
              key={thread.id}
              size="xs"
              role="listitem"
              variant={active ? "muted" : "default"}
              className="relative hover:bg-muted"
            >
              <ItemContent>
                <ItemTitle>
                  <button
                    type="button"
                    className="text-left outline-none after:absolute after:inset-0 after:rounded-lg focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
                    aria-current={active || undefined}
                    onClick={() => chat.openThread(thread)}
                  >
                    {thread.title}
                  </button>
                </ItemTitle>
                <ItemDescription className="line-clamp-1">
                  {thread.updatedAt} · {last}
                </ItemDescription>
              </ItemContent>
              <ItemActions className="relative z-10">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={
                    thread.pinned
                      ? `Lepas sematan ${thread.title}`
                      : `Sematkan ${thread.title}`
                  }
                  aria-pressed={thread.pinned}
                  onClick={() => chat.togglePin(thread.id)}
                >
                  {thread.pinned ? <PinOffIcon /> : <PinIcon />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Hapus ${thread.title}`}
                  onClick={() => chat.deleteThread(thread.id)}
                >
                  <Trash2Icon />
                </Button>
              </ItemActions>
            </Item>
          );
        })}
      </ItemGroup>
    </section>
  );
}

export function CornerChatHistory({ chat }: { chat: CornerChat }) {
  const pinned = chat.historyThreads.filter((thread) => thread.pinned);
  const recent = chat.historyThreads.filter((thread) => !thread.pinned);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-3">
      <div role="status" className="empty:hidden">
        {chat.deleted && (
          <div className="flex items-center justify-between gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
            Percakapan “{chat.deleted.thread.title}” dihapus.
            <Button size="sm" variant="outline" onClick={chat.undoDelete}>
              Urungkan
            </Button>
          </div>
        )}
      </div>
      {chat.historyThreads.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MessagesSquareIcon />
            </EmptyMedia>
            <EmptyTitle>Belum ada riwayat</EmptyTitle>
            <EmptyDescription>
              Percakapan yang Anda mulai akan muncul di sini.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          <ThreadSection label="Disematkan" threads={pinned} chat={chat} />
          <ThreadSection label="Terbaru" threads={recent} chat={chat} />
        </>
      )}
    </div>
  );
}
