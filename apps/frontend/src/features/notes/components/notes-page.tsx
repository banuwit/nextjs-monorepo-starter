"use client";

import { useEffect, useRef, useState } from "react";
import {
  EditorContent,
  useEditor,
  useEditorState,
  type Editor,
} from "@tiptap/react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CopyIcon,
  DownloadIcon,
  GripVerticalIcon,
  ListIcon,
  LockIcon,
  MoreHorizontalIcon,
  PlusIcon,
  Redo2Icon,
  Trash2Icon,
  Undo2Icon,
} from "lucide-react";
import { AppBody } from "@/components/app-body";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { exampleNote, notePeople } from "@/mocks/notes.mock";
import { noteSchema } from "../schemas/notes.schema";
import type { Note } from "../types/notes";
import { blockCommands, noteExtensions, NoteOutline } from "./notes-extensions";
import { NoteFormatting } from "./note-formatting";
import "./notes.css";

const storageKey = "playground-notes:v1";

export function NotesPage() {
  const [title, setTitle] = useState(exampleNote.title);
  const titleRef = useRef(title);
  const ready = useRef(false);
  const [status, setStatus] = useState("Loading…");
  const [error, setError] = useState("");
  const [fullWidth, setFullWidth] = useState(false);
  const [smallText, setSmallText] = useState(false);
  const [locked, setLocked] = useState(false);
  const editor = useEditor({
    extensions: noteExtensions,
    content: exampleNote.content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "notes-prose",
        role: "textbox",
        "aria-label": "Note content",
        "aria-multiline": "true",
      },
    },
    onUpdate: ({ editor }) => {
      if (ready.current)
        save({
          title: titleRef.current || "Untitled note",
          content: editor.getJSON(),
        });
    },
  });

  function save(note: Note) {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          ...note,
          title: note.title.trim() || "Untitled note",
        }),
      );
      setStatus("Saved in this browser");
      setError("");
    } catch {
      setStatus("Not saved");
      setError(
        "Your changes could not be saved. Browser storage may be full or disabled. Export a copy to keep your work.",
      );
    }
  }

  useEffect(() => {
    if (!editor) return;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const note = noteSchema.parse(JSON.parse(stored));
        editor.commands.setContent(note.content, {
          emitUpdate: false,
          errorOnInvalidContent: true,
        });
        titleRef.current = note.title;
        // Restore the browser draft only after the client editor mounts.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTitle(note.title);
      }
      ready.current = true;
      setStatus(
        stored
          ? "Saved in this browser"
          : "Example note · stored in this browser",
      );
    } catch {
      setError(
        "The saved note could not be restored. Your stored copy has been kept. Export it from the page menu before replacing it.",
      );
      setStatus("Recovery needed");
    }
  }, [editor]);

  function download(raw = false) {
    if (!editor) return;
    try {
      const content = raw
        ? localStorage.getItem(storageKey)
        : JSON.stringify(
            {
              title: titleRef.current || "Untitled note",
              content: editor.getJSON(),
            },
            null,
            2,
          );
      if (!content) {
        setError("There is no stored note to export.");
        return;
      }
      const url = URL.createObjectURL(
        new Blob([content], { type: "application/json" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = raw ? "notes-recovery.json" : "notes.json";
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError(
        "Browser storage is unavailable. You can still export the currently open note.",
      );
    }
  }

  return (
    <AppBody>
      <section
        aria-label="Notes"
        className="notes-page min-w-0 flex-1 rounded-xl border bg-background"
      >
        <header className="sticky top-12 z-10 flex flex-wrap items-center justify-between gap-3 rounded-t-xl border-b bg-background px-4 py-3">
          <div className="min-w-0 flex-1">
            <input
              aria-label="Note title"
              maxLength={200}
              readOnly={locked}
              className="w-full min-w-0 rounded bg-transparent text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                titleRef.current = event.target.value;
                if (editor && ready.current)
                  save({
                    title: event.target.value || "Untitled note",
                    content: editor.getJSON(),
                  });
              }}
              onBlur={() => {
                if (!title.trim()) {
                  setTitle("Untitled note");
                  titleRef.current = "Untitled note";
                }
              }}
            />
            <p role="status" className="mt-0.5 text-xs text-muted-foreground">
              Support wiki · {status}
              {locked && " · Locked"}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="mr-3 hidden gap-1 sm:flex"
              aria-label="Example collaborators"
            >
              {notePeople.map((person) => (
                <Avatar
                  key={person.id}
                  className="size-6 ring-2 ring-background"
                  title={`${person.label} (example)`}
                >
                  <AvatarFallback>
                    {person.label
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            {editor && <HistoryButtons editor={editor} locked={locked} />}
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Show page outline"
                  />
                }
              >
                <ListIcon />
              </PopoverTrigger>
              <PopoverContent align="end">
                <PopoverTitle>On this page</PopoverTitle>
                {editor && <NoteOutline editor={editor} />}
              </PopoverContent>
            </Popover>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Page settings"
                  />
                }
              >
                <MoreHorizontalIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuGroup>
                  <DropdownMenuCheckboxItem
                    checked={fullWidth}
                    onCheckedChange={setFullWidth}
                  >
                    Full width
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={smallText}
                    onCheckedChange={setSmallText}
                  >
                    Small text
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={locked}
                    onCheckedChange={(value) => {
                      setLocked(value);
                      editor?.setEditable(!value);
                    }}
                  >
                    Lock page
                  </DropdownMenuCheckboxItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => download()}>
                    <DownloadIcon />
                    Export note
                  </DropdownMenuItem>
                  {error && (
                    <DropdownMenuItem onClick={() => download(true)}>
                      Export stored copy
                    </DropdownMenuItem>
                  )}
                  {error && (
                    <DropdownMenuItem
                      onClick={() => {
                        if (
                          editor &&
                          window.confirm(
                            "Replace the stored note with the currently open note? Export the stored copy first if you need it.",
                          )
                        ) {
                          ready.current = true;
                          save({
                            title: titleRef.current || "Untitled note",
                            content: editor.getJSON(),
                          });
                        }
                      }}
                    >
                      Save current note
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        {error && (
          <Alert variant="destructive" className="mx-4 mt-4 w-auto">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div
          className={cn(
            "relative mx-auto min-w-0 px-10 py-10 sm:px-16 sm:py-12",
            !fullWidth && "max-w-3xl",
            smallText && "notes-small",
          )}
        >
          {editor ? (
            <NoteDocument editor={editor} locked={locked} />
          ) : (
            <div
              aria-label="Loading note"
              role="status"
              className="flex flex-col gap-6"
            >
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-96 w-full" />
            </div>
          )}
          {locked ? (
            <p className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
              <LockIcon className="size-3" />
              Page locked. Unlock it in page settings to edit.
            </p>
          ) : (
            <p className="mt-8 text-xs text-muted-foreground">
              Type / for blocks · @ to mention · Select text to format
            </p>
          )}
        </div>
        {editor && (
          <aside className="notes-outline-rail" aria-label="Page outline">
            <div className="notes-outline-ticks" aria-hidden="true">
              {Array.from({ length: 8 }, (_, index) => (
                <span key={index} />
              ))}
            </div>
            <div className="notes-outline-panel">
              <NoteOutline editor={editor} />
            </div>
          </aside>
        )}
      </section>
    </AppBody>
  );
}

function HistoryButtons({
  editor,
  locked,
}: {
  editor: Editor;
  locked: boolean;
}) {
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      undo: editor.can().undo(),
      redo: editor.can().redo(),
    }),
  });
  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Undo"
        disabled={locked || !state.undo}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2Icon />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Redo"
        disabled={locked || !state.redo}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2Icon />
      </Button>
    </>
  );
}

function NoteDocument({ editor, locked }: { editor: Editor; locked: boolean }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const dragPosition = useRef<number | null>(null);
  const [block, setBlock] = useState<{ pos: number; top: number } | null>(null);
  const table = useEditorState({
    editor,
    selector: ({ editor }) => editor.isActive("table"),
  });

  function moveBlock(destination: number, source = block?.pos) {
    if (source === undefined) return;
    const node = editor.state.doc.nodeAt(source);
    if (
      !node ||
      (destination >= source && destination <= source + node.nodeSize)
    )
      return;
    editor
      .chain()
      .focus()
      .command(({ tr }) => {
        tr.delete(source, source + node.nodeSize);
        tr.insert(
          destination > source ? destination - node.nodeSize : destination,
          node,
        );
        return true;
      })
      .run();
    setBlock(null);
  }

  return (
    <div
      ref={wrapper}
      className="relative min-w-0"
      onMouseMove={(event) => {
        if (
          locked ||
          !(event.target instanceof HTMLElement) ||
          !editor.view.dom.contains(event.target)
        )
          return;
        let element: HTMLElement | null = event.target;
        while (element && element.parentElement !== editor.view.dom)
          element = element.parentElement;
        if (!element || !wrapper.current) return;
        editor.state.doc.forEach((_node, pos) => {
          if (editor.view.nodeDOM(pos) === element)
            setBlock({
              pos,
              top:
                element.getBoundingClientRect().top -
                wrapper.current!.getBoundingClientRect().top,
            });
        });
      }}
      onDragOverCapture={(event) => {
        if (dragPosition.current !== null) event.preventDefault();
      }}
      onDropCapture={(event) => {
        if (dragPosition.current === null || locked) return;
        event.preventDefault();
        event.stopPropagation();
        const target = editor.view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        });
        if (target) {
          const resolved = editor.state.doc.resolve(target.pos);
          moveBlock(
            resolved.depth ? resolved.before(1) : target.pos,
            dragPosition.current,
          );
        }
        dragPosition.current = null;
      }}
    >
      {!locked && (
        <div className="mb-3 flex flex-wrap items-center gap-1 sm:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button size="sm" variant="outline" />}
            >
              <PlusIcon />
              Insert block
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                {blockCommands.map((item) => (
                  <DropdownMenuItem
                    key={item.label}
                    onClick={() => item.run(editor)}
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      {block && !locked && (
        <div
          className="absolute -left-9 z-10 flex items-center sm:-left-[4.5rem]"
          style={{ top: block.top }}
        >
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Add block below"
            onClick={() => {
              const node = editor.state.doc.nodeAt(block.pos);
              if (node)
                editor
                  .chain()
                  .focus()
                  .insertContentAt(block.pos + node.nodeSize, {
                    type: "paragraph",
                    content: [{ type: "text", text: "/" }],
                  })
                  .run();
            }}
          >
            <PlusIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            className="hidden sm:inline-flex"
            aria-label="Drag block"
            draggable
            onDragStart={(event) => {
              dragPosition.current = block.pos;
              event.dataTransfer.setData("text/plain", "Move note block");
              event.dataTransfer.effectAllowed = "move";
            }}
            onDragEnd={() => {
              dragPosition.current = null;
            }}
          >
            <GripVerticalIcon />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Block actions"
                />
              }
            >
              <MoreHorizontalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    const node = editor.state.doc.nodeAt(block.pos);
                    if (node)
                      editor
                        .chain()
                        .focus()
                        .insertContentAt(
                          block.pos + node.nodeSize,
                          node.toJSON(),
                        )
                        .run();
                  }}
                >
                  <CopyIcon />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={block.pos === 0}
                  onClick={() => {
                    let previous = 0;
                    editor.state.doc.forEach((_node, pos) => {
                      if (pos < block.pos) previous = pos;
                    });
                    moveBlock(previous);
                  }}
                >
                  <ArrowUpIcon />
                  Move up
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    const node = editor.state.doc.nodeAt(block.pos);
                    if (!node) return;
                    const next = editor.state.doc.nodeAt(
                      block.pos + node.nodeSize,
                    );
                    if (next)
                      moveBlock(block.pos + node.nodeSize + next.nodeSize);
                  }}
                >
                  <ArrowDownIcon />
                  Move down
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {blockCommands.slice(0, 9).map((item) => (
                  <DropdownMenuItem
                    key={item.label}
                    onClick={() => {
                      editor.commands.setTextSelection(block.pos + 1);
                      item.run(editor);
                    }}
                  >
                    Turn into {item.label.toLowerCase()}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    const node = editor.state.doc.nodeAt(block.pos);
                    if (node)
                      editor
                        .chain()
                        .focus()
                        .deleteRange({
                          from: block.pos,
                          to: block.pos + node.nodeSize,
                        })
                        .run();
                    setBlock(null);
                  }}
                >
                  <Trash2Icon />
                  Delete block
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      {table && !locked && (
        <div
          className="sticky top-32 z-10 mb-3 flex flex-wrap gap-1 rounded-lg border bg-background p-1"
          aria-label="Table controls"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().addRowAfter().run()}
          >
            + Row
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
          >
            + Column
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().deleteRow().run()}
          >
            Delete row
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().deleteColumn().run()}
          >
            Delete column
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeaderRow().run()}
          >
            Header row
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().mergeOrSplit().run()}
          >
            Merge / split
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().deleteTable().run()}
          >
            Delete table
          </Button>
        </div>
      )}
      <EditorContent editor={editor} />
      {!locked && <NoteFormatting editor={editor} />}
    </div>
  );
}
