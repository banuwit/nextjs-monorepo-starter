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
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EditorLink } from "./editor-link";

function Tool({
  label,
  icon: Icon,
  active,
  disabled,
  onClick,
}: {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  const props = {
    "aria-label": label,
    disabled,
    onMouseDown: (event: React.MouseEvent) => event.preventDefault(),
  };
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          active === undefined ? (
            <Button
              {...props}
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onClick}
            />
          ) : (
            <Toggle
              {...props}
              size="sm"
              pressed={active}
              onPressedChange={onClick}
              className="px-1.5"
            />
          )
        }
      >
        <Icon />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

const highlights = ["Yellow", "Green", "Blue", "Pink", "Purple"] as const;
const alignments = [
  { value: "left", label: "Align left", icon: AlignLeftIcon },
  { value: "center", label: "Align center", icon: AlignCenterIcon },
  { value: "right", label: "Align right", icon: AlignRightIcon },
  { value: "justify", label: "Justify", icon: AlignJustifyIcon },
] as const;

export function EditorToolbar({ editor }: { editor: Editor }) {
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      heading: [1, 2, 3].find((level) => editor.isActive("heading", { level })),
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      underline: editor.isActive("underline"),
      strike: editor.isActive("strike"),
      code: editor.isActive("code"),
      bulletList: editor.isActive("bulletList"),
      orderedList: editor.isActive("orderedList"),
      taskList: editor.isActive("taskList"),
      blockquote: editor.isActive("blockquote"),
      codeBlock: editor.isActive("codeBlock"),
      undo: editor.can().undo(),
      redo: editor.can().redo(),
      alignment:
        alignments.find(({ value }) => editor.isActive({ textAlign: value }))
          ?.value ?? "left",
    }),
  });
  const AlignmentIcon = alignments.find(
    ({ value }) => value === state.alignment,
  )!.icon;

  return (
    <div
      role="group"
      aria-label="Text formatting"
      className="flex shrink-0 flex-wrap items-center gap-0.5 border-y bg-background px-3 py-2"
    >
      <Tool
        label="Undo (⌘/Ctrl Z)"
        icon={Undo2Icon}
        disabled={!state.undo}
        onClick={() => editor.chain().focus().undo().run()}
      />
      <Tool
        label="Redo (⌘/Ctrl Shift Z)"
        icon={Redo2Icon}
        disabled={!state.redo}
        onClick={() => editor.chain().focus().redo().run()}
      />
      <Separator orientation="vertical" className="mx-1 h-5" />
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="sm" aria-label="Text style" />}
        >
          {state.heading ? `Heading ${state.heading}` : "Paragraph"}
          <ChevronDownIcon data-icon="inline-end" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().setParagraph().run()}
            >
              Paragraph
            </DropdownMenuItem>
            {([1, 2, 3] as const).map((level) => (
              <DropdownMenuItem
                key={level}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level }).run()
                }
              >
                Heading {level}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Separator orientation="vertical" className="mx-1 h-5" />
      <Tool
        label="Bold (⌘/Ctrl B)"
        icon={BoldIcon}
        active={state.bold}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <Tool
        label="Italic (⌘/Ctrl I)"
        icon={ItalicIcon}
        active={state.italic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <Tool
        label="Underline (⌘/Ctrl U)"
        icon={UnderlineIcon}
        active={state.underline}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />
      <Tool
        label="Strikethrough"
        icon={StrikethroughIcon}
        active={state.strike}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />
      <Tool
        label="Inline code"
        icon={CodeIcon}
        active={state.code}
        onClick={() => editor.chain().focus().toggleCode().run()}
      />
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Highlight color"
              title="Highlight color"
            />
          }
        >
          <HighlighterIcon />
        </PopoverTrigger>
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
            onClick={() => editor.chain().focus().unsetHighlight().run()}
          >
            Remove highlight
          </Button>
        </PopoverContent>
      </Popover>
      <EditorLink editor={editor} />
      <Separator orientation="vertical" className="mx-1 h-5" />
      <Tool
        label="Bullet list"
        icon={ListIcon}
        active={state.bulletList}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <Tool
        label="Numbered list"
        icon={ListOrderedIcon}
        active={state.orderedList}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <Tool
        label="Task list"
        icon={ListChecksIcon}
        active={state.taskList}
        onClick={() => editor.chain().focus().toggleTaskList().run()}
      />
      <Tool
        label="Blockquote"
        icon={QuoteIcon}
        active={state.blockquote}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />
      <Tool
        label="Code block"
        icon={CodeSquareIcon}
        active={state.codeBlock}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      />
      <Tool
        label="Horizontal rule"
        icon={MinusIcon}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      />
      <Separator orientation="vertical" className="mx-1 h-5" />
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="sm" aria-label="Text alignment" />
          }
        >
          <AlignmentIcon />
          <ChevronDownIcon data-icon="inline-end" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          <DropdownMenuGroup>
            {alignments.map(({ value, label, icon: Icon }) => (
              <DropdownMenuItem
                key={value}
                onClick={() => editor.chain().focus().setTextAlign(value).run()}
              >
                <Icon />
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
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
    </div>
  );
}
