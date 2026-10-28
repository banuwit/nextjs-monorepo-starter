"use client";

import { type Editor, useEditorState } from "@tiptap/react";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ChevronDownIcon,
  CodeIcon,
  CodeSquareIcon,
  HighlighterIcon,
  ItalicIcon,
  ListChecksIcon,
  ListIcon,
  ListOrderedIcon,
  MinusIcon,
  QuoteIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  StrikethroughIcon,
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
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Toggle } from "@/components/ui/toggle";
import {
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
} from "@/components/ui/toolbar";
import { cn } from "@/lib/utils";
import {
  ariaShortcut,
  formatShortcut,
  isMacPlatform,
} from "@/utils/editor-shortcut";
import { EditorLink } from "./editor-link";
import { EditorTooltip } from "./editor-tooltip";

// Keep the editor selection when a toolbar control is pressed.
const keepSelection = (event: React.MouseEvent) => event.preventDefault();

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
    <EditorTooltip
      label={label}
      shortcut={shortcut}
      render={
        <ToolbarButton
          render={control}
          aria-label={label}
          aria-keyshortcuts={
            shortcut ? ariaShortcut(shortcut, isMacPlatform()) : undefined
          }
          disabled={disabled}
          focusableWhenDisabled={false}
          onMouseDown={keepSelection}
        />
      }
    >
      <Icon />
    </EditorTooltip>
  );
}

const highlights = ["Yellow", "Green", "Blue", "Pink", "Purple"] as const;
const textStyles = [
  { value: "paragraph", label: "Paragraph", shortcut: "Mod+Alt+0" },
  { value: "1", label: "Heading 1", shortcut: "Mod+Alt+1" },
  { value: "2", label: "Heading 2", shortcut: "Mod+Alt+2" },
  { value: "3", label: "Heading 3", shortcut: "Mod+Alt+3" },
] as const;
const alignments = [
  { value: "left", label: "Align left", icon: AlignLeftIcon },
  { value: "center", label: "Align center", icon: AlignCenterIcon },
  { value: "right", label: "Align right", icon: AlignRightIcon },
  { value: "justify", label: "Justify", icon: AlignJustifyIcon },
] as const;

type TextStyle = (typeof textStyles)[number]["value"];
type Alignment = (typeof alignments)[number]["value"];

export function EditorToolbar({ editor }: { editor: Editor }) {
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
      strike: editor.isActive("strike"),
      code: editor.isActive("code"),
      highlight: editor.isActive("highlight"),
      bulletList: editor.isActive("bulletList"),
      orderedList: editor.isActive("orderedList"),
      taskList: editor.isActive("taskList"),
      blockquote: editor.isActive("blockquote"),
      codeBlock: editor.isActive("codeBlock"),
      undo: editor.can().undo(),
      redo: editor.can().redo(),
      alignment: (alignments.find(({ value }) =>
        editor.isActive({ textAlign: value }),
      )?.value ?? "left") as Alignment,
    }),
  });
  const textStyle = textStyles.find(({ value }) => value === state.textStyle);
  const alignment = alignments.find(({ value }) => value === state.alignment);
  const AlignmentIcon = alignment?.icon ?? AlignLeftIcon;

  function setTextStyle(value: TextStyle) {
    const chain = editor.chain().focus();
    if (value === "paragraph") chain.setParagraph().run();
    else chain.setHeading({ level: Number(value) as 1 | 2 | 3 }).run();
  }

  return (
    <Toolbar
      aria-label="Text formatting"
      className="shrink-0 overflow-x-auto border-y bg-background px-3 py-2 [scrollbar-width:none] max-sm:[mask-image:linear-gradient(to_right,transparent,black_0.75rem,black_calc(100%-0.75rem),transparent)] [&::-webkit-scrollbar]:hidden"
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
        <EditorTooltip
          label="Text style"
          render={
            <DropdownMenuTrigger
              render={
                <ToolbarButton
                  render={<Button variant="ghost" size="sm" />}
                  aria-label={`Text style: ${textStyle?.label ?? "Paragraph"}`}
                />
              }
            />
          }
        >
          {textStyle?.label ?? "Paragraph"}
          <ChevronDownIcon data-icon="inline-end" />
        </EditorTooltip>
        <DropdownMenuContent className="w-48">
          <DropdownMenuRadioGroup
            value={state.textStyle}
            onValueChange={(value: TextStyle) => setTextStyle(value)}
          >
            {textStyles.map(({ value, label, shortcut }) => (
              <DropdownMenuRadioItem key={value} value={value}>
                {label}
                <span className="ml-auto text-xs text-muted-foreground">
                  {formatShortcut(shortcut, isMacPlatform()).join(" ")}
                </span>
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
      <Tool
        label="Strikethrough"
        shortcut="Mod+Shift+S"
        icon={StrikethroughIcon}
        active={state.strike}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />
      <Tool
        label="Inline code"
        shortcut="Mod+E"
        icon={CodeIcon}
        active={state.code}
        onClick={() => editor.chain().focus().toggleCode().run()}
      />
      <Popover>
        <EditorTooltip
          label="Highlight color"
          render={
            <PopoverTrigger
              render={
                <ToolbarButton
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className={cn(state.highlight && "bg-muted")}
                    />
                  }
                  aria-label="Highlight color"
                  onMouseDown={keepSelection}
                />
              }
            />
          }
        >
          <HighlighterIcon />
        </EditorTooltip>
        <PopoverContent
          className="rich-text-highlights w-56"
          align="start"
          finalFocus={false}
        >
          <PopoverTitle>Highlight color</PopoverTitle>
          <div className="flex gap-1">
            {highlights.map((color) => (
              <Button
                key={color}
                variant="outline"
                size="icon-sm"
                aria-label={`${color} highlight`}
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHighlight({
                      color: `var(--editor-highlight-${color.toLowerCase()})`,
                    })
                    .run()
                }
              >
                <span
                  aria-hidden="true"
                  className="size-4 rounded-sm"
                  style={{
                    backgroundColor: `var(--editor-highlight-${color.toLowerCase()})`,
                  }}
                />
              </Button>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            disabled={!state.highlight}
            onClick={() => editor.chain().focus().unsetHighlight().run()}
          >
            Remove highlight
          </Button>
        </PopoverContent>
      </Popover>
      <EditorLink editor={editor} inToolbar />
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
      <Tool
        label="Blockquote"
        shortcut="Mod+Shift+B"
        icon={QuoteIcon}
        active={state.blockquote}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />
      <Tool
        label="Code block"
        shortcut="Mod+Alt+C"
        icon={CodeSquareIcon}
        active={state.codeBlock}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      />
      <Tool
        label="Horizontal rule"
        icon={MinusIcon}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      />
      <ToolbarSeparator />
      <DropdownMenu>
        <EditorTooltip
          label="Text alignment"
          render={
            <DropdownMenuTrigger
              render={
                <ToolbarButton
                  render={<Button variant="ghost" size="sm" />}
                  aria-label={`Text alignment: ${alignment?.label ?? "Align left"}`}
                />
              }
            />
          }
        >
          <AlignmentIcon />
          <ChevronDownIcon data-icon="inline-end" />
        </EditorTooltip>
        <DropdownMenuContent className="w-48">
          <DropdownMenuRadioGroup
            value={state.alignment}
            onValueChange={(value: Alignment) =>
              editor.chain().focus().setTextAlign(value).run()
            }
          >
            {alignments.map(({ value, label, icon: Icon }) => (
              <DropdownMenuRadioItem key={value} value={value}>
                <Icon />
                {label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Tool
        label="Clear formatting"
        icon={RemoveFormattingIcon}
        onClick={() =>
          editor
            .chain()
            .focus()
            .unsetAllMarks()
            .clearNodes()
            .unsetTextAlign()
            .run()
        }
      />
    </Toolbar>
  );
}
