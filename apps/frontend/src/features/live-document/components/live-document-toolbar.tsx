"use client";

import { useState, type ReactNode } from "react";
import { type Editor, useEditorState } from "@tiptap/react";
import {
  BoldIcon,
  ChevronDownIcon,
  ItalicIcon,
  Link2Icon,
  ListChecksIcon,
  ListIcon,
  ListOrderedIcon,
  MessageSquarePlusIcon,
  Redo2Icon,
  UnderlineIcon,
  Undo2Icon,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import {
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
} from "@/components/ui/toolbar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { normalizeEditorLink } from "@/utils/editor-link";
import {
  ariaShortcut,
  formatShortcut,
  isMacPlatform,
} from "@/utils/editor-shortcut";

// Keep the editor selection when a toolbar control is pressed.
const keepSelection = (event: React.MouseEvent) => event.preventDefault();

function platformIsMac() {
  return typeof navigator !== "undefined" && isMacPlatform();
}

function Tool({
  label,
  shortcut,
  icon: Icon,
  active,
  disabled,
  onClick,
}: {
  label: string;
  shortcut?: string;
  icon: LucideIcon;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  const control =
    active === undefined ? (
      <Button type="button" variant="ghost" size="icon-sm" onClick={onClick} />
    ) : (
      <Toggle
        size="sm"
        pressed={active}
        onPressedChange={onClick}
        className="shrink-0 px-1.5"
      />
    );
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <ToolbarButton
            render={control}
            aria-label={label}
            aria-keyshortcuts={
              shortcut ? ariaShortcut(shortcut, platformIsMac()) : undefined
            }
            disabled={disabled}
            focusableWhenDisabled={false}
            onMouseDown={keepSelection}
          />
        }
      >
        <Icon />
      </TooltipTrigger>
      <TooltipContent>
        {label}
        {shortcut && (
          <KbdGroup>
            {formatShortcut(shortcut, platformIsMac()).map((key) => (
              <Kbd key={key}>{key}</Kbd>
            ))}
          </KbdGroup>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

const textStyles = [
  { value: "paragraph", label: "Text", shortcut: "Mod+Alt+0" },
  { value: "1", label: "Heading 1", shortcut: "Mod+Alt+1" },
  { value: "2", label: "Heading 2", shortcut: "Mod+Alt+2" },
  { value: "3", label: "Heading 3", shortcut: "Mod+Alt+3" },
] as const;

type TextStyle = (typeof textStyles)[number]["value"];

function LinkTool({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [invalid, setInvalid] = useState(false);
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      link: editor.isActive("link"),
      canLink: !editor.state.selection.empty || editor.isActive("link"),
    }),
  });

  function apply() {
    const href = normalizeEditorLink(value);
    if (!href) {
      setInvalid(true);
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    setOpen(false);
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          const href = editor.getAttributes("link").href;
          setValue(typeof href === "string" ? href : "");
          setInvalid(false);
        }
      }}
    >
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger
              render={
                <ToolbarButton
                  render={
                    <Toggle
                      size="sm"
                      pressed={state.link}
                      className="shrink-0 px-1.5"
                    />
                  }
                  aria-label="Link"
                  disabled={!state.canLink}
                  focusableWhenDisabled={false}
                  onMouseDown={keepSelection}
                />
              }
            />
          }
        >
          <Link2Icon />
        </TooltipTrigger>
        <TooltipContent>Link</TooltipContent>
      </Tooltip>
      <PopoverContent align="start" className="w-80">
        <PopoverTitle>Link</PopoverTitle>
        <form
          className="mt-3 flex flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            apply();
          }}
        >
          <Label htmlFor="live-link-url" className="sr-only">
            URL
          </Label>
          <Input
            id="live-link-url"
            autoFocus
            placeholder="https://example.com"
            value={value}
            aria-invalid={invalid}
            onChange={(event) => {
              setValue(event.target.value);
              setInvalid(false);
            }}
          />
          {invalid && (
            <p className="text-xs text-destructive" role="alert">
              Enter a valid http, https, mailto or tel link.
            </p>
          )}
          <div className="flex justify-end gap-2">
            {state.link && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  editor.chain().focus().extendMarkRange("link").unsetLink().run();
                  setOpen(false);
                }}
              >
                Remove
              </Button>
            )}
            <Button type="submit" size="sm">
              Apply
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}

function CommentTool({
  disabled,
  onSubmit,
}: {
  disabled: boolean;
  onSubmit: (body: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");

  function submit() {
    const text = body.trim();
    if (!text) return;
    onSubmit(text);
    setBody("");
    setOpen(false);
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setBody("");
      }}
    >
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger
              render={
                <ToolbarButton
                  render={<Button type="button" variant="ghost" size="icon-sm" />}
                  aria-label="Comment on selection"
                  disabled={disabled}
                  focusableWhenDisabled={false}
                  onMouseDown={keepSelection}
                />
              }
            />
          }
        >
          <MessageSquarePlusIcon />
        </TooltipTrigger>
        <TooltipContent>
          {disabled ? "Select text to comment on it" : "Comment on selection"}
        </TooltipContent>
      </Tooltip>
      <PopoverContent align="end" className="w-80">
        <PopoverTitle>New comment</PopoverTitle>
        <form
          className="mt-3 flex flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <Label htmlFor="live-comment-body" className="sr-only">
            Comment
          </Label>
          <Textarea
            id="live-comment-body"
            autoFocus
            rows={3}
            placeholder="Ask a question or leave a note…"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                submit();
              }
            }}
          />
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">
              ⌘/Ctrl + Enter to send
            </span>
            <Button type="submit" size="sm" disabled={!body.trim()}>
              Comment
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}

export function LiveDocumentToolbar({
  editor,
  onComment,
  children,
}: {
  editor: Editor;
  onComment: (body: string) => void;
  /** Extra controls rendered at the end of the bar. */
  children?: ReactNode;
}) {
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      textStyle: (textStyles.find(
        ({ value }) =>
          value !== "paragraph" &&
          editor.isActive("heading", { level: Number(value) }),
      )?.value ?? "paragraph") as TextStyle,
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      underline: editor.isActive("underline"),
      bulletList: editor.isActive("bulletList"),
      orderedList: editor.isActive("orderedList"),
      taskList: editor.isActive("taskList"),
      undo: editor.can().undo(),
      redo: editor.can().redo(),
      hasSelection: !editor.state.selection.empty,
    }),
  });
  const textStyle = textStyles.find(({ value }) => value === state.textStyle);

  function setTextStyle(value: TextStyle) {
    const chain = editor.chain().focus();
    if (value === "paragraph") chain.setParagraph().run();
    else chain.setHeading({ level: Number(value) as 1 | 2 | 3 }).run();
  }

  return (
    <Toolbar
      aria-label="Text formatting"
      className="flex shrink-0 items-center gap-0.5 overflow-x-auto border-b bg-background px-3 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <Tool
        label="Undo"
        shortcut="Mod+Z"
        icon={Undo2Icon}
        disabled={!state.undo}
        onClick={() => editor.chain().focus().undo().run()}
      />
      <Tool
        label="Redo"
        shortcut="Mod+Shift+Z"
        icon={Redo2Icon}
        disabled={!state.redo}
        onClick={() => editor.chain().focus().redo().run()}
      />
      <ToolbarSeparator />
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <ToolbarButton
              render={<Button variant="ghost" size="sm" className="w-32 justify-between" />}
              aria-label={`Text style: ${textStyle?.label ?? "Text"}`}
            />
          }
        >
          {textStyle?.label ?? "Text"}
          <ChevronDownIcon data-icon="inline-end" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuRadioGroup
            value={state.textStyle}
            onValueChange={(value) => setTextStyle(value as TextStyle)}
          >
            {textStyles.map(({ value, label, shortcut }) => (
              <DropdownMenuRadioItem key={value} value={value}>
                {label}
                <KbdGroup className="ml-auto">
                  {formatShortcut(shortcut, platformIsMac()).map((key) => (
                    <Kbd key={key}>{key}</Kbd>
                  ))}
                </KbdGroup>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <ToolbarSeparator />
      <Tool
        label="Bold"
        shortcut="Mod+B"
        icon={BoldIcon}
        active={state.bold}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <Tool
        label="Italic"
        shortcut="Mod+I"
        icon={ItalicIcon}
        active={state.italic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <Tool
        label="Underline"
        shortcut="Mod+U"
        icon={UnderlineIcon}
        active={state.underline}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />
      <LinkTool editor={editor} />
      <ToolbarSeparator />
      <Tool
        label="Bullet list"
        shortcut="Mod+Shift+8"
        icon={ListIcon}
        active={state.bulletList}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <Tool
        label="Numbered list"
        shortcut="Mod+Shift+7"
        icon={ListOrderedIcon}
        active={state.orderedList}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <Tool
        label="Task list"
        shortcut="Mod+Shift+9"
        icon={ListChecksIcon}
        active={state.taskList}
        onClick={() => editor.chain().focus().toggleTaskList().run()}
      />
      <ToolbarSeparator />
      <CommentTool disabled={!state.hasSelection} onSubmit={onComment} />
      {children && <div className="ml-auto flex items-center gap-1 pl-2">{children}</div>}
    </Toolbar>
  );
}
