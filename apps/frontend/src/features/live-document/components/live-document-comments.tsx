"use client";

import { useState } from "react";
import { CheckIcon, MessageSquareIcon, RotateCcwIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { CommentThread, Person } from "../types/live-document";
import { formatCommentTime, initials } from "../utils/time";

function PersonAvatar({ person }: { person: Person }) {
  return (
    <Avatar size="sm">
      <AvatarFallback
        className="text-[0.6rem] font-semibold text-white"
        style={{ background: person.color }}
      >
        {initials(person.name)}
      </AvatarFallback>
    </Avatar>
  );
}

function ReplyForm({
  threadId,
  onReply,
}: {
  threadId: string;
  onReply: (body: string) => void;
}) {
  const [body, setBody] = useState("");

  function submit() {
    const text = body.trim();
    if (!text) return;
    onReply(text);
    setBody("");
  }

  return (
    <form
      className="mt-3 flex flex-col gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <Label htmlFor={`reply-${threadId}`} className="sr-only">
        Reply
      </Label>
      <Textarea
        id={`reply-${threadId}`}
        rows={2}
        placeholder="Reply…"
        className="min-h-0 text-sm"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            submit();
          }
        }}
      />
      <div className="flex justify-end">
        <Button type="submit" size="sm" variant="outline" disabled={!body.trim()}>
          Reply
        </Button>
      </div>
    </form>
  );
}

export function LiveDocumentComments({
  threads,
  people,
  activeId,
  showResolved,
  onSelect,
  onReply,
  onResolve,
  onReopen,
}: {
  threads: CommentThread[];
  people: Person[];
  activeId: string | null;
  showResolved: boolean;
  onSelect: (id: string | null) => void;
  onReply: (id: string, body: string) => void;
  onResolve: (id: string) => void;
  onReopen: (id: string) => void;
}) {
  const personById = (id: string) =>
    people.find((person) => person.id === id) ?? {
      id,
      name: "Unknown",
      role: "",
      color: "var(--muted-foreground)",
    };
  const open = threads.filter((thread) => !thread.resolved);
  const visible = showResolved ? threads : open;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center gap-2 px-4 py-3">
        <h3 className="text-sm font-semibold">Comments</h3>
        <Badge variant="secondary" aria-label={`${open.length} open comments`}>
          {open.length}
        </Badge>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
        {visible.length === 0 ? (
          <Empty className="border-0 py-10">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MessageSquareIcon />
              </EmptyMedia>
              <EmptyTitle>No open comments</EmptyTitle>
              <EmptyDescription>
                Select text and press Comment to start a thread.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="flex flex-col gap-2">
            {visible.map((thread) => {
              const author = personById(thread.authorId);
              const active = thread.id === activeId;
              return (
                <li key={thread.id}>
                  <article
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "rounded-lg border border-transparent p-3 text-sm transition-colors hover:bg-muted/50",
                      active && "border-border bg-muted/60",
                      thread.resolved && "opacity-70",
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <PersonAvatar person={author} />
                      <button
                        type="button"
                        className="min-w-0 flex-1 rounded text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        onClick={() => onSelect(active ? null : thread.id)}
                        aria-expanded={active}
                      >
                        <span className="flex items-baseline gap-2">
                          <span className="truncate font-medium">
                            {author.name}
                          </span>
                          <time
                            className="shrink-0 text-xs text-muted-foreground"
                            dateTime={thread.createdAt}
                          >
                            {formatCommentTime(thread.createdAt)}
                          </time>
                        </span>
                        <span className="mt-1 block truncate text-xs text-muted-foreground italic">
                          “{thread.quote}”
                        </span>
                      </button>
                      {thread.resolved ? (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Reopen thread"
                          onClick={() => onReopen(thread.id)}
                        >
                          <RotateCcwIcon />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Resolve thread"
                          onClick={() => onResolve(thread.id)}
                        >
                          <CheckIcon />
                        </Button>
                      )}
                    </div>
                    <p className={cn("mt-2 pl-8", !active && "line-clamp-2")}>
                      {thread.body}
                    </p>
                    {active ? (
                      <div className="pl-8">
                        {thread.replies.length > 0 && (
                          <ul className="mt-3 flex flex-col gap-3 border-l-2 border-border pl-3">
                            {thread.replies.map((reply) => {
                              const replier = personById(reply.authorId);
                              return (
                                <li key={reply.id}>
                                  <div className="flex items-baseline gap-2">
                                    <span className="truncate text-xs font-medium">
                                      {replier.name}
                                    </span>
                                    <time
                                      className="text-xs text-muted-foreground"
                                      dateTime={reply.createdAt}
                                    >
                                      {formatCommentTime(reply.createdAt)}
                                    </time>
                                  </div>
                                  <p className="mt-0.5">{reply.body}</p>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                        {!thread.resolved && (
                          <ReplyForm
                            threadId={thread.id}
                            onReply={(body) => onReply(thread.id, body)}
                          />
                        )}
                      </div>
                    ) : (
                      thread.replies.length > 0 && (
                        <p className="mt-1 pl-8 text-xs text-muted-foreground">
                          {thread.replies.length === 1
                            ? "1 reply"
                            : `${thread.replies.length} replies`}
                        </p>
                      )
                    )}
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
