"use client";

import { useEffect, useMemo, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import {
  DownloadIcon,
  MessageSquareTextIcon,
  MoreHorizontalIcon,
  RotateCcwIcon,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { PEOPLE, SPEC_META, SPEC_TITLE } from "@/mocks/live-document.mock";
import {
  localUser,
  usePresence,
  useRoomSnapshot,
  useThreads,
} from "../hooks/use-live-room";
import { createLiveDocumentExtensions } from "../schemas/live-document.schema";
import type { RoomAdapter } from "../types/live-document";
import { currentTime, formatEdited } from "../utils/time";
import { LiveDocumentComments } from "./live-document-comments";
import { LiveDocumentPresence } from "./live-document-presence";
import { LiveDocumentToolbar } from "./live-document-toolbar";
import "./live-document.css";

const editorAttributes = {
  class: "live-prose",
  role: "textbox",
  "aria-multiline": "true",
  "aria-label": "Document content",
};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

export function LiveDocumentWorkspace({
  room,
  onReplay,
}: {
  room: RoomAdapter;
  onReplay: () => void;
}) {
  const snapshot = useRoomSnapshot(room);
  const presence = usePresence(room);
  const threads = useThreads(room);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [showResolved, setShowResolved] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [followTarget, setFollowTarget] = useState<string | null>(null);
  const [replayOpen, setReplayOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  // Following ends when the teammate stops editing or drops out of the room.
  const followingId = presence.some(
    (entry) => entry.user.id === followTarget && entry.editing && !entry.isLocal,
  )
    ? followTarget
    : null;

  const extensions = useMemo(
    () =>
      createLiveDocumentExtensions({
        document: room.doc,
        awareness: room.awareness,
        user: localUser,
      }),
    [room],
  );

  const editor = useEditor(
    {
      extensions,
      editorProps: {
        attributes: editorAttributes,
        handleDOMEvents: {
          click: (_view, event) => {
            const target = event.target as HTMLElement | null;
            const anchor = target?.closest<HTMLElement>("[data-comment-id]");
            if (anchor?.dataset.commentId)
              setActiveThreadId(anchor.dataset.commentId);
            return false;
          },
          keydown: () => {
            setFollowTarget(null);
            return false;
          },
          mousedown: () => {
            setFollowTarget(null);
            return false;
          },
        },
      },
    },
    [extensions],
  );

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);

  // Keep the followed teammate's caret in view as they move.
  useEffect(() => {
    if (!editor || !followingId) return;
    let frame = 0;
    const scroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        editor.view.dom
          .querySelector<HTMLElement>(`[data-live-caret="${followingId}"]`)
          ?.scrollIntoView({
            block: "center",
            behavior: prefersReducedMotion() ? "instant" : "smooth",
          });
      });
    };
    scroll();
    room.awareness.on("change", scroll);
    return () => {
      cancelAnimationFrame(frame);
      room.awareness.off("change", scroll);
    };
  }, [editor, followingId, room]);

  // Highlight the anchor of the active thread; re-apply after re-renders.
  useEffect(() => {
    if (!editor) return;
    const apply = () => {
      const dom = editor.view.dom;
      for (const node of dom.querySelectorAll(".live-comment.is-active"))
        node.classList.remove("is-active");
      if (activeThreadId)
        for (const node of dom.querySelectorAll(
          `[data-comment-id="${activeThreadId}"]`,
        ))
          node.classList.add("is-active");
    };
    apply();
    editor.on("transaction", apply);
    return () => {
      editor.off("transaction", apply);
    };
  }, [editor, activeThreadId]);

  function focusThread(id: string | null) {
    setActiveThreadId(id);
    if (!id || !editor) return;
    editor.view.dom
      .querySelector<HTMLElement>(`[data-comment-id="${id}"]`)
      ?.scrollIntoView({
        block: "center",
        behavior: prefersReducedMotion() ? "instant" : "smooth",
      });
  }

  function addComment(body: string) {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    const quote = editor.state.doc.textBetween(from, to, " ").trim();
    const id = `thread-${Date.now().toString(36)}`;
    editor.chain().focus().setMark("comment", { id }).run();
    room.setThread({
      id,
      authorId: localUser.id,
      quote: quote.length > 80 ? `${quote.slice(0, 77)}…` : quote,
      body,
      createdAt: currentTime().toISOString(),
      resolved: false,
      replies: [],
    });
    setActiveThreadId(id);
  }

  function replyToThread(id: string, body: string) {
    room.updateThread(id, (thread) => ({
      ...thread,
      replies: [
        ...thread.replies,
        {
          id: `${id}-${localUser.id}-${thread.replies.length + 1}`,
          authorId: localUser.id,
          body,
          createdAt: currentTime().toISOString(),
        },
      ],
    }));
  }

  function resolveThread(id: string) {
    room.updateThread(id, (thread) => ({ ...thread, resolved: true }));
    editor?.commands.command(({ tr, state }) => {
      state.doc.descendants((node, pos) => {
        for (const mark of node.marks) {
          if (mark.type.name === "comment" && mark.attrs.id === id)
            tr.removeMark(pos, pos + node.nodeSize, mark);
        }
      });
      return true;
    });
    if (activeThreadId === id) setActiveThreadId(null);
  }

  function reopenThread(id: string) {
    room.updateThread(id, (thread) => ({ ...thread, resolved: false }));
    setActiveThreadId(id);
  }

  function changeConnection(online: boolean) {
    const result = room.setOnline(online);
    if (online) {
      toast.add({
        title: "Back online",
        type: "success",
        description:
          result.merged || result.sent
            ? `Merged ${plural(result.merged, "teammate edit")} and sent ${plural(result.sent, "of yours")}.`
            : "Nothing was waiting in the queue.",
      });
    } else {
      toast.add({
        title: "Working offline",
        type: "warning",
        description: "Edits are queued here and merge when you reconnect.",
      });
    }
  }

  function exportDocument() {
    if (!editor) return;
    const content = JSON.stringify(
      { title: SPEC_TITLE, content: editor.getJSON(), threads },
      null,
      2,
    );
    const url = URL.createObjectURL(
      new Blob([content], { type: "application/json" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "live-document.json";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const openCount = threads.filter((thread) => !thread.resolved).length;
  const comments = (
    <LiveDocumentComments
      threads={threads}
      people={PEOPLE}
      activeId={activeThreadId}
      showResolved={showResolved}
      onSelect={focusThread}
      onReply={replyToThread}
      onResolve={resolveThread}
      onReopen={reopenThread}
    />
  );

  return (
    <section
      aria-label="Live document"
      className="live-document flex h-[calc(100svh-6.5rem)] min-h-[32rem] min-w-0 flex-col overflow-hidden rounded-xl border bg-muted/25"
    >
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-sm font-semibold">{SPEC_TITLE}</h2>
            {snapshot.online ? (
              <Badge
                variant="secondary"
                className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
              >
                Live
              </Badge>
            ) : (
              <Badge variant="destructive">Offline</Badge>
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {[...SPEC_META, formatEdited(snapshot.lastEditedAt, now)].join(
              " · ",
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <LiveDocumentPresence
            presence={presence}
            followingId={followingId}
            onFollow={setFollowTarget}
          />
          <div className="flex items-center gap-2">
            <Switch
              id="live-connection"
              checked={snapshot.online}
              onCheckedChange={changeConnection}
              aria-describedby="live-connection-status"
            />
            <Label htmlFor="live-connection" className="text-xs">
              {snapshot.online ? "Online" : "Offline"}
            </Label>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon-sm" aria-label="Document menu" />
              }
            >
              <MoreHorizontalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuCheckboxItem
                  checked={panelOpen}
                  onCheckedChange={setPanelOpen}
                  className="max-lg:hidden"
                >
                  Comments panel
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={showResolved}
                  onCheckedChange={setShowResolved}
                >
                  Show resolved comments
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={exportDocument}>
                  <DownloadIcon />
                  Export JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setReplayOpen(true)}>
                  <RotateCcwIcon />
                  Replay session
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {editor ? (
        <LiveDocumentToolbar editor={editor} onComment={addComment}>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  aria-label={`Open comments (${openCount} open)`}
                />
              }
            >
              <MessageSquareTextIcon />
              {openCount}
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md">
              <SheetHeader className="sr-only">
                <SheetTitle>Comments</SheetTitle>
                <SheetDescription>
                  Threads anchored to this document.
                </SheetDescription>
              </SheetHeader>
              <div className="flex min-h-0 flex-1 flex-col pt-8">
                {comments}
              </div>
            </SheetContent>
          </Sheet>
        </LiveDocumentToolbar>
      ) : (
        <div className="shrink-0 border-b px-3 py-2">
          <Skeleton className="h-7 w-80 max-w-full" />
        </div>
      )}

      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain bg-background">
        <div className="flex items-start gap-6 lg:pr-6">
          {editor ? (
            <div className="mx-auto w-full max-w-3xl px-6 py-8 sm:px-12 sm:py-10">
              <EditorContent editor={editor} />
            </div>
          ) : (
            <div
              role="status"
              aria-label="Loading document"
              className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-6 py-8 sm:px-12 sm:py-10"
            >
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="mt-5 h-5 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          )}
          {panelOpen && (
            <aside
              aria-label="Comments"
              className="sticky top-8 mt-8 hidden max-h-[calc(100svh-15rem)] w-80 shrink-0 flex-col rounded-xl border bg-card shadow-xs lg:flex"
            >
              {comments}
            </aside>
          )}
        </div>
      </div>

      <footer
        id="live-connection-status"
        className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t px-4 py-2 text-xs text-muted-foreground"
      >
        <span role="status">
          {snapshot.online
            ? `Synced · ${presence.length === 1 ? "1 person" : `${presence.length} people`} in the room`
            : `Offline · ${plural(snapshot.queuedLocal, "edit")} queued · ${plural(snapshot.queuedRemote, "teammate edit")} waiting to merge`}
        </span>
        <span>Select text to comment · Click an avatar to follow</span>
      </footer>

      <AlertDialog open={replayOpen} onOpenChange={setReplayOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replay the session?</AlertDialogTitle>
            <AlertDialogDescription>
              The document returns to the sample spec and the scripted
              teammates start again. Edits made in this session are discarded.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setReplayOpen(false);
                onReplay();
              }}
            >
              Replay session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
