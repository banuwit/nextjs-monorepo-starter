"use client";

import { useEffect, useState } from "react";
import { Extension, Node, mergeAttributes, type Editor } from "@tiptap/react";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  useEditorState,
  type NodeViewProps,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { TaskList, TaskItem } from "@tiptap/extension-list";
import { TableKit } from "@tiptap/extension-table";
import Mention from "@tiptap/extension-mention";
import Highlight from "@tiptap/extension-highlight";
import Suggestion, {
  type SuggestionOptions,
  type SuggestionProps,
} from "@tiptap/suggestion";
import { PluginKey } from "@tiptap/pm/state";
import { filterPeople, getOutline } from "../utils/note";
import type { Person } from "../types/note";
import { notePeople } from "@/mocks/note.mock";

export function scrollToHeading(editor: Editor, index: number) {
  const heading = editor.view.dom.querySelectorAll("h1, h2, h3")[index];
  heading?.scrollIntoView({ block: "center", behavior: "instant" });
}

export function NoteOutline({
  editor,
  active,
}: {
  editor: Editor;
  /** Index of the heading currently in view. */
  active?: number;
}) {
  const headings = useEditorState({
    editor,
    selector: ({ editor }) => getOutline(editor.getJSON()),
  });
  return (
    <nav
      aria-label="Table of contents"
      className="flex flex-col gap-1 text-sm text-muted-foreground"
    >
      <span className="mb-1 text-xs">Contents</span>
      {headings.length === 0 && (
        <span>Add headings to build your outline.</span>
      )}
      {headings.map((heading, index) => (
        <button
          key={index}
          type="button"
          aria-current={index === active ? "location" : undefined}
          className="w-full rounded text-left hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring aria-[current=location]:font-medium aria-[current=location]:text-foreground"
          style={{ paddingInlineStart: (heading.level - 1) * 16 }}
          onClick={() => scrollToHeading(editor, index)}
        >
          {heading.title}
        </button>
      ))}
    </nav>
  );
}

// The heading nearest the top of the viewport, across any scroll container.
function useActiveHeading(editor: Editor, count: number) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    function update() {
      let index = 0;
      editor.view.dom.querySelectorAll("h1, h2, h3").forEach((heading, i) => {
        if (heading.getBoundingClientRect().top < window.innerHeight * 0.3)
          index = i;
      });
      setActive(index);
    }
    const frame = requestAnimationFrame(update);
    document.addEventListener("scroll", update, {
      capture: true,
      passive: true,
    });
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("scroll", update, { capture: true });
    };
  }, [editor, count]);
  return active;
}

export function NoteOutlineRail({ editor }: { editor: Editor }) {
  const levels = useEditorState({
    editor,
    selector: ({ editor }) =>
      getOutline(editor.getJSON())
        .map((heading) => heading.level)
        .join(),
  });
  const ticks = levels ? levels.split(",") : [];
  const active = useActiveHeading(editor, ticks.length);
  if (!ticks.length) return null;
  return (
    <aside className="note-outline-rail" aria-label="Page outline">
      <div className="note-outline-ticks" aria-hidden="true">
        {ticks.map((level, index) => (
          <span
            key={index}
            data-level={level}
            data-active={index === active || undefined}
          />
        ))}
      </div>
      <div className="note-outline-panel">
        <NoteOutline editor={editor} active={active} />
      </div>
    </aside>
  );
}

function ContentsView({ editor }: NodeViewProps) {
  return (
    <NodeViewWrapper contentEditable={false} className="my-4">
      <NoteOutline editor={editor} />
    </NodeViewWrapper>
  );
}

const Contents = Node.create({
  name: "tableOfContents",
  group: "block",
  atom: true,
  draggable: true,
  parseHTML: () => [{ tag: "nav[data-note-contents]" }],
  renderHTML: ({ HTMLAttributes }) => [
    "nav",
    mergeAttributes(HTMLAttributes, { "data-note-contents": "" }),
    "Contents",
  ],
  addNodeView: () => ReactNodeViewRenderer(ContentsView),
});

export const blockCommands: { label: string; run: (editor: Editor) => void }[] =
  [
    {
      label: "Text",
      run: (editor) => {
        editor.chain().focus().setParagraph().run();
      },
    },
    ...([1, 2, 3] as const).map((level) => ({
      label: `Heading ${level}`,
      run: (editor: Editor) => {
        editor.chain().focus().setHeading({ level }).run();
      },
    })),
    {
      label: "Bullet list",
      run: (editor) => {
        editor.chain().focus().toggleBulletList().run();
      },
    },
    {
      label: "Numbered list",
      run: (editor) => {
        editor.chain().focus().toggleOrderedList().run();
      },
    },
    {
      label: "Checklist",
      run: (editor) => {
        editor.chain().focus().toggleTaskList().run();
      },
    },
    {
      label: "Quote",
      run: (editor) => {
        editor.chain().focus().toggleBlockquote().run();
      },
    },
    {
      label: "Code block",
      run: (editor) => {
        editor.chain().focus().toggleCodeBlock().run();
      },
    },
    {
      label: "Table",
      run: (editor) => {
        editor
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run();
      },
    },
    {
      label: "Divider",
      run: (editor) => {
        editor.chain().focus().setHorizontalRule().run();
      },
    },
    {
      label: "Table of contents",
      run: (editor) => {
        editor.chain().focus().insertContent({ type: "tableOfContents" }).run();
      },
    },
  ];

// Tiptap owns positioning and dismissal; keep keyboard selection in the editor.
function suggestionMenu<Item extends { label: string }>(
  decorate?: (item: Item, option: HTMLButtonElement) => void,
): NonNullable<SuggestionOptions<Item, Item>["render"]> {
  return () => {
    let props: SuggestionProps<Item, Item>;
    let selected = 0;
    let menu: HTMLDivElement;
    let unmount: (() => void) | undefined;
    function paint() {
      menu.replaceChildren();
      if (!props.items.length) {
        menu.textContent = "No results";
        return;
      }
      props.items.forEach((item, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.role = "option";
        button.setAttribute("aria-selected", String(index === selected));
        button.className = "note-suggestion-item";
        button.textContent = item.label;
        decorate?.(item, button);
        button.onmousedown = (event) => {
          event.preventDefault();
        };
        button.onclick = () => props.command(item);
        menu.append(button);
      });
      menu.children[selected]?.scrollIntoView({ block: "nearest" });
    }
    return {
      onStart: (next) => {
        props = next;
        menu = document.createElement("div");
        menu.className = "note-suggestions";
        menu.role = "listbox";
        menu.setAttribute("aria-label", "Editor suggestions");
        paint();
        unmount = props.mount(menu);
      },
      onUpdate: (next) => {
        props = next;
        selected = 0;
        paint();
      },
      onKeyDown: ({ event }) => {
        if (event.key === "Escape") return false;
        if (!props.items.length) return false;
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          selected =
            (selected +
              (event.key === "ArrowDown" ? 1 : -1) +
              props.items.length) %
            props.items.length;
          paint();
          return true;
        }
        if (event.key === "Enter") {
          const item = props.items[selected];
          if (item) props.command(item);
          return true;
        }
        return false;
      },
      onExit: () => {
        unmount?.();
        menu?.remove();
      },
    };
  };
}

// Avatar initials and role beside the mention name.
function decoratePerson(person: Person, option: HTMLButtonElement) {
  const avatar = document.createElement("span");
  avatar.className = "note-suggestion-avatar";
  avatar.setAttribute("aria-hidden", "true");
  avatar.textContent = person.label
    .split(" ")
    .map((part) => part[0])
    .join("");
  const name = document.createElement("span");
  name.className = "note-suggestion-label";
  name.textContent = person.label;
  const role = document.createElement("span");
  role.className = "note-suggestion-description";
  role.textContent = person.role;
  option.classList.add("note-suggestion-person");
  option.replaceChildren(avatar, name, role);
}

const SlashCommands = Extension.create({
  name: "noteSlashCommands",
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        pluginKey: new PluginKey("noteSlashCommands"),
        char: "/",
        startOfLine: true,
        items: ({ query }) =>
          blockCommands.filter((item) =>
            item.label.toLowerCase().includes(query.toLowerCase()),
          ),
        command: ({ editor, range, props }) => {
          editor.chain().focus().deleteRange(range).run();
          props.run(editor);
        },
        render: suggestionMenu<(typeof blockCommands)[number]>(),
      }),
    ];
  },
});

export const noteExtensions = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
    link: { openOnClick: false },
  }),
  Placeholder.configure({
    placeholder: "Type / for commands, @ to mention someone…",
  }),
  TaskList,
  TaskItem.configure({ nested: true }),
  TableKit.configure({ table: { resizable: true } }),
  Highlight,
  Mention.configure({
    HTMLAttributes: { class: "note-mention" },
    suggestion: {
      items: ({ query }) => filterPeople(notePeople, query),
      render: suggestionMenu<Person>(decoratePerson),
    },
  }),
  Contents,
  SlashCommands,
];
