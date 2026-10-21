"use client";

import { useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import {
  DownloadIcon,
  EllipsisIcon,
  EyeIcon,
  KeyboardIcon,
  PencilIcon,
  RotateCcwIcon,
} from "lucide-react";
import { AppBody } from "@/components/app-body";
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd } from "@/components/ui/kbd";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  documentCollaborators,
  launchBrief,
} from "@/mocks/rich-text-editor.mock";
import {
  DRAFT_KEY,
  editorExtensions,
  getDocumentStats,
  readDraft,
} from "../editor-model";
import { EditorToolbar } from "./editor-toolbar";
import { EditorLinkBubble } from "./editor-link";

const shortcuts = [
  ["Bold", "⌘ / Ctrl B"],
  ["Italic", "⌘ / Ctrl I"],
  ["Underline", "⌘ / Ctrl U"],
  ["Undo", "⌘ / Ctrl Z"],
  ["Redo", "⌘ / Ctrl Shift Z"],
  ["Heading 1–3", "⌘ / Ctrl Alt 1–3"],
  ["Bullet list", "⌘ / Ctrl Shift 8"],
  ["Numbered list", "⌘ / Ctrl Shift 7"],
  ["Task list", "⌘ / Ctrl Shift 9"],
];

export function RichTextEditorPage() {
  const [saveStatus, setSaveStatus] = useState("Demo document");
  const [viewing, setViewing] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const editor = useEditor({
    extensions: editorExtensions,
    content: launchBrief,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "rich-text-prose",
        role: "textbox",
        "aria-label": "Document content",
        "aria-multiline": "true",
        "aria-readonly": String(viewing),
      },
    },
    onCreate: ({ editor }) => {
      try {
        const stored = localStorage.getItem(DRAFT_KEY);
        if (stored) {
          editor
            .chain()
            .setMeta("addToHistory", false)
            .setContent(readDraft(stored), { emitUpdate: false })
            .run();
          setSaveStatus("Saved locally");
        }
      } catch {
        setSaveStatus("Could not restore draft. Showing demo.");
      }
    },
    onUpdate: ({ editor }) => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(editor.getJSON()));
        setSaveStatus("Saved locally");
      } catch {
        setSaveStatus(
          "Not saved · Browser storage unavailable. Export to keep your changes.",
        );
      }
    },
  });
  const stats = useEditorState({
    editor,
    selector: ({ editor }) =>
      editor ? getDocumentStats(editor.getText()) : null,
  });

  function exportDocument(format: "html" | "json") {
    if (!editor) return;
    const content =
      format === "html"
        ? `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Loomwell 4.2 Launch Brief</title><style>
          :root { --editor-highlight-yellow: #fef08a; --editor-highlight-green: #bbf7d0; --editor-highlight-blue: #bfdbfe; --editor-highlight-pink: #fbcfe8; --editor-highlight-purple: #e9d5ff; }
          body { max-width: 48rem; margin: 2rem auto; padding: 0 1rem; font: 16px/1.7 system-ui, sans-serif; overflow-wrap: anywhere; }
          blockquote { border-left: 2px solid #ddd; padding-left: 1rem; color: #555; }
          pre { overflow-x: auto; background: #f5f5f5; padding: 1rem; }
          ul[data-type="taskList"] { list-style: none; padding: 0; }
          li[data-type="taskItem"] { display: flex; align-items: baseline; gap: .5rem; }
          li[data-checked="true"] p { text-decoration: line-through; }
        </style></head><body>${editor.getHTML()}</body></html>`
        : JSON.stringify(editor.getJSON(), null, 2);
    const url = URL.createObjectURL(
      new Blob([content], {
        type: format === "html" ? "text/html" : "application/json",
      }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `loomwell-launch-brief.${format}`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <AppBody>
      <h1 className="sr-only">Rich Text Editor</h1>
      <TooltipProvider delay={300}>
        <section
          aria-label="Rich Text Editor"
          className="rich-text-editor flex h-[calc(100svh-6.5rem)] min-h-[32rem] min-w-0 flex-col overflow-hidden rounded-xl border bg-muted/25"
        >
          <header className="flex shrink-0 items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <h2 className="text-sm font-semibold">Loomwell 4.2</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Launch brief <span aria-hidden="true">·</span>{" "}
                <span role="status">{saveStatus}</span>
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <AvatarGroup
                aria-label="Demo collaborators"
                className="hidden sm:flex"
              >
                {documentCollaborators.map((person) => (
                  <Avatar
                    key={person.name}
                    size="sm"
                    title={`${person.name} (demo)`}
                  >
                    <AvatarFallback>{person.initials}</AvatarFallback>
                  </Avatar>
                ))}
              </AvatarGroup>
              {viewing && (
                <span className="text-xs text-muted-foreground">Viewing</span>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Document actions"
                      disabled={!editor}
                    />
                  }
                >
                  <EllipsisIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => {
                        editor?.setEditable(viewing);
                        setViewing(!viewing);
                      }}
                    >
                      {viewing ? <PencilIcon /> : <EyeIcon />}
                      {viewing ? "Switch to editing" : "Switch to viewing"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportDocument("html")}>
                      <DownloadIcon />
                      Export HTML
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportDocument("json")}>
                      <DownloadIcon />
                      Export JSON
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      variant="destructive"
                      disabled={viewing}
                      onClick={() => setResetOpen(true)}
                    >
                      <RotateCcwIcon />
                      Reset document
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          {editor && !viewing && <EditorToolbar editor={editor} />}
          <div
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-background"
            aria-label="Document page"
          >
            {editor ? (
              <>
                <EditorContent
                  editor={editor}
                  className="mx-auto w-full max-w-3xl px-6 py-8 sm:px-12 sm:py-10"
                />
                {!viewing && <EditorLinkBubble editor={editor} />}
              </>
            ) : (
              <p role="status" className="p-8 text-sm text-muted-foreground">
                Loading editor…
              </p>
            )}
          </div>
          <footer className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t px-4 py-2 text-xs text-muted-foreground">
            <p aria-label="Document statistics">
              <span className="font-medium text-foreground">
                {stats?.words.toLocaleString() ?? 0}
              </span>{" "}
              words <span aria-hidden="true">·</span>{" "}
              <span className="font-medium text-foreground">
                {stats?.characters.toLocaleString() ?? 0}
              </span>{" "}
              characters <span aria-hidden="true">·</span> {stats?.minutes ?? 0}{" "}
              min read
            </p>
            <Popover>
              <PopoverTrigger render={<Button variant="ghost" size="sm" />}>
                <KeyboardIcon data-icon="inline-start" />
                Shortcuts
              </PopoverTrigger>
              <PopoverContent
                align="end"
                side="top"
                className="w-80 max-w-[calc(100vw-2rem)]"
              >
                <PopoverTitle>Keyboard shortcuts</PopoverTitle>
                <dl className="flex flex-col gap-2">
                  {shortcuts.map(([label, keys]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-3"
                    >
                      <dt>{label}</dt>
                      <dd>
                        <Kbd>{keys}</Kbd>
                      </dd>
                    </div>
                  ))}
                </dl>
              </PopoverContent>
            </Popover>
          </footer>
        </section>
      </TooltipProvider>
      <p className="text-xs text-muted-foreground">
        Playground · Demo document. Changes are saved only in this browser.
      </p>
      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset this document?</AlertDialogTitle>
            <AlertDialogDescription>
              This replaces your local draft with the original launch brief.
              Export your changes first if you want to keep them.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                editor?.commands.setContent(launchBrief);
                setResetOpen(false);
              }}
            >
              Reset document
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppBody>
  );
}
