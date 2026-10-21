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
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { blockCommands } from "./notes-extensions";

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
      icon: BoldIcon,
      active: state.bold,
      run: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "Italic",
      icon: ItalicIcon,
      active: state.italic,
      run: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "Underline",
      icon: UnderlineIcon,
      active: state.underline,
      run: () => editor.chain().focus().toggleUnderline().run(),
    },
    {
      label: "Strikethrough",
      icon: StrikethroughIcon,
      active: state.strike,
      run: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      label: "Inline code",
      icon: CodeIcon,
      active: state.code,
      run: () => editor.chain().focus().toggleCode().run(),
    },
    {
      label: "Highlight",
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
        {marks.map(({ label, icon: Icon, active, run }) => (
          <Toggle
            key={label}
            size="sm"
            aria-label={label}
            title={label}
            pressed={active}
            onPressedChange={run}
          >
            <Icon />
          </Toggle>
        ))}
        <Popover
          open={linkOpen}
          onOpenChange={(open) => {
            setLinkOpen(open);
            setUrl(editor.getAttributes("link").href ?? "");
            setError(false);
          }}
        >
          <PopoverTrigger
            render={
              <Button variant="ghost" size="icon-sm" aria-label="Edit link" />
            }
          >
            <LinkIcon />
          </PopoverTrigger>
          <PopoverContent finalFocus={false}>
            <PopoverTitle>Edit link</PopoverTitle>
            <form
              className="flex flex-col gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                try {
                  const parsed = new URL(url);
                  if (!["https:", "http:", "mailto:"].includes(parsed.protocol))
                    throw new Error();
                } catch {
                  setError(true);
                  return;
                }
                editor
                  .chain()
                  .focus()
                  .extendMarkRange("link")
                  .setLink({ href: url })
                  .run();
                setLinkOpen(false);
              }}
            >
              <Field data-invalid={error}>
                <FieldLabel htmlFor="note-link">URL</FieldLabel>
                <Input
                  id="note-link"
                  value={url}
                  onChange={(event) => {
                    setUrl(event.target.value);
                    setError(false);
                  }}
                  placeholder="https://example.com"
                  aria-invalid={error}
                />
                {error && (
                  <FieldError>Use an http, https, or mailto URL.</FieldError>
                )}
              </Field>
              <div className="flex gap-2">
                <Button type="submit">Apply</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    editor.chain().focus().unsetLink().run();
                    setLinkOpen(false);
                  }}
                >
                  Remove link
                </Button>
              </div>
            </form>
          </PopoverContent>
        </Popover>
      </div>
    </BubbleMenu>
  );
}
