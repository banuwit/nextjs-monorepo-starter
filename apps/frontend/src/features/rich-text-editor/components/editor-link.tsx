"use client";

import { useId, useState } from "react";
import { type Editor, useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { ExternalLinkIcon, LinkIcon, UnlinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { normalizeEditorLink } from "../editor-model";

export function EditorLink({ editor }: { editor: Editor }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (value) {
          setUrl(editor.getAttributes("link").href ?? "");
          setError(false);
        }
      }}
    >
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Insert or edit link"
            title="Insert or edit link"
          />
        }
      >
        <LinkIcon />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-80 max-w-[calc(100vw-2rem)]"
        finalFocus={false}
      >
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
            const chain = editor.chain().focus().extendMarkRange("link");
            if (editor.state.selection.empty && !editor.isActive("link")) {
              chain
                .insertContent({
                  type: "text",
                  text: href,
                  marks: [{ type: "link", attrs: { href } }],
                })
                .run();
            } else {
              chain.setLink({ href }).run();
            }
            setOpen(false);
          }}
        >
          <Field data-invalid={error}>
            <FieldLabel htmlFor={id}>URL</FieldLabel>
            <Input
              id={id}
              value={url}
              onChange={(event) => {
                setUrl(event.target.value);
                setError(false);
              }}
              placeholder="https://example.com"
              aria-invalid={error}
              aria-describedby={error ? `${id}-error` : undefined}
              autoComplete="url"
            />
            {error && (
              <FieldError id={`${id}-error`}>
                Enter a valid http, https, or mailto link.
              </FieldError>
            )}
          </Field>
          <div className="flex justify-end gap-2">
            {editor.isActive("link") && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  editor
                    .chain()
                    .focus()
                    .extendMarkRange("link")
                    .unsetLink()
                    .run();
                  setOpen(false);
                }}
              >
                Remove
              </Button>
            )}
            <Button type="submit" size="sm">
              Apply link
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}

export function EditorLinkBubble({ editor }: { editor: Editor }) {
  const href = useEditorState({
    editor,
    selector: ({ editor }) =>
      normalizeEditorLink(editor.getAttributes("link").href ?? ""),
  });
  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor }) => editor.isEditable && editor.isActive("link")}
      options={{ placement: "bottom" }}
    >
      <div className="flex items-center gap-1 rounded-lg border bg-popover p-1 text-popover-foreground shadow-md">
        {href && (
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<a href={href} target="_blank" rel="noopener noreferrer" />}
          >
            <span className="max-w-44 truncate">{href}</span>
            <ExternalLinkIcon data-icon="inline-end" />
          </Button>
        )}
        <EditorLink editor={editor} />
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Remove link"
          onClick={() =>
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
          }
        >
          <UnlinkIcon />
        </Button>
      </div>
    </BubbleMenu>
  );
}
