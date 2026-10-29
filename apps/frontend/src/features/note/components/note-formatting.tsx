"use client";

import { useState } from "react";
import { type Editor, useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  CodeIcon,
  HighlighterIcon,
  LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { normalizeEditorLink } from "@/utils/editor-link";
import {
  ariaShortcut,
  formatShortcut,
  isMacPlatform,
} from "@/utils/editor-shortcut";
import { blockCommands } from "./note-extensions";

export function NoteFormatting({ editor }: { editor: Editor }) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState(false);
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      underline: editor.isActive("underline"),
      strike: editor.isActive("strike"),
      code: editor.isActive("code"),
      highlight: editor.isActive("highlight"),
    }),
  });
  const marks = [
    {
      label: "Bold",
      shortcut: "Mod+B",
      icon: BoldIcon,
      active: state.bold,
      run: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "Italic",
      shortcut: "Mod+I",
      icon: ItalicIcon,
      active: state.italic,
      run: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "Underline",
      shortcut: "Mod+U",
      icon: UnderlineIcon,
      active: state.underline,
      run: () => editor.chain().focus().toggleUnderline().run(),
    },
    {
      label: "Strikethrough",
      shortcut: "Mod+Shift+S",
      icon: StrikethroughIcon,
      active: state.strike,
      run: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      label: "Inline code",
      shortcut: "Mod+E",
      icon: CodeIcon,
      active: state.code,
      run: () => editor.chain().focus().toggleCode().run(),
    },
    {
      label: "Highlight",
      shortcut: "Mod+Shift+H",
      icon: HighlighterIcon,
      active: state.highlight,
      run: () => editor.chain().focus().toggleHighlight().run(),
    },
  ];
  return (
    <BubbleMenu
      editor={editor}
      options={{ placement: "top", offset: 8 }}
      shouldShow={({ editor, state }) =>
        editor.isEditable && !state.selection.empty
      }
    >
      <TooltipProvider delay={300}>
        <div
          aria-label="Text formatting"
          className="flex max-w-[calc(100vw-2rem)] flex-wrap items-center gap-0.5 rounded-lg border bg-popover p-1 text-popover-foreground shadow-md"
        >
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="sm" />}>
              Turn into
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                {blockCommands.slice(0, 9).map((item) => (
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
          {marks.map(({ label, shortcut, icon: Icon, active, run }) => (
            <Tooltip key={label}>
              <TooltipTrigger
                render={
                  <Toggle
                    size="sm"
                    aria-label={label}
                    aria-keyshortcuts={ariaShortcut(shortcut, isMacPlatform())}
                    pressed={active}
                    onPressedChange={run}
                  />
                }
              >
                <Icon />
              </TooltipTrigger>
              <TooltipContent>
                {label}
                <KbdGroup>
                  {formatShortcut(shortcut, isMacPlatform()).map((key) => (
                    <Kbd key={key}>{key}</Kbd>
                  ))}
                </KbdGroup>
              </TooltipContent>
            </Tooltip>
          ))}
          <Popover
            open={linkOpen}
            onOpenChange={(open) => {
              setLinkOpen(open);
              setUrl(editor.getAttributes("link").href ?? "");
              setError(false);
            }}
          >
            <Tooltip>
              <TooltipTrigger
                render={
                  <PopoverTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Edit link"
                        className={cn(editor.isActive("link") && "bg-muted")}
                      />
                    }
                  />
                }
              >
                <LinkIcon />
              </TooltipTrigger>
              <TooltipContent>Edit link</TooltipContent>
            </Tooltip>
            <PopoverContent finalFocus={false}>
              <PopoverTitle>Edit link</PopoverTitle>
              <form
                className="flex flex-col gap-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  const href = normalizeEditorLink(url);
                  if (!href) {
                    setError(true);
                    return;
                  }
                  editor
                    .chain()
                    .focus()
                    .extendMarkRange("link")
                    .setLink({ href })
                    .run();
                  setLinkOpen(false);
                }}
              >
                <Field data-invalid={error}>
                  <FieldLabel htmlFor="note-link">URL</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <LinkIcon />
                    </InputGroupAddon>
                    <InputGroupInput
                      id="note-link"
                      value={url}
                      onChange={(event) => {
                        setUrl(event.target.value);
                        setError(false);
                      }}
                      placeholder="example.com or tel:+62…"
                      aria-invalid={error}
                      autoComplete="url"
                    />
                  </InputGroup>
                  {error && (
                    <FieldError>
                      Enter a web address, mailto, or tel link.
                    </FieldError>
                  )}
                </Field>
                <div className="flex gap-2">
                  <Button type="submit">Apply</Button>
                  {editor.isActive("link") && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        editor
                          .chain()
                          .focus()
                          .extendMarkRange("link")
                          .unsetLink()
                          .run();
                        setLinkOpen(false);
                      }}
                    >
                      Remove link
                    </Button>
                  )}
                </div>
              </form>
            </PopoverContent>
          </Popover>
        </div>
      </TooltipProvider>
    </BubbleMenu>
  );
}
