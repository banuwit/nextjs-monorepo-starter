"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { Input } from "@/components/ui/input";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  copyCellRange,
  fillCellRange,
  getCellRange,
  isCellInRange,
  pasteCellRange,
  moveCellFocus,
  type CellChange,
  type CellPosition,
  type CellRange,
} from "./data-grid-sheet-range";

type Edit = CellPosition & { value: string; error?: string };
type CellEditingContext = {
  selection: CellRange | null;
  editing: Edit | null;
  getCellProps: (cell: CellPosition, label: string) => ComponentProps<"td">;
  changeDraft: (value: string) => void;
  finish: (cancel?: boolean, next?: CellPosition) => boolean;
  nextCell: (
    cell: CellPosition,
    direction: number,
    vertical?: boolean,
  ) => CellPosition | undefined;
  startFill: () => void;
  fillDown: () => void;
  undo: () => void;
  redo: () => void;
  copy: () => Promise<void>;
  paste: () => Promise<void>;
  clear: () => void;
  begin: (cell: CellPosition, value?: string) => void;
  setMessage: (message: string) => void;
  errorId: string;
};
const CellEditingContext = createContext<CellEditingContext | null>(null);

export function useDataGridSheetEditing() {
  const context = useContext(CellEditingContext);
  if (!context) throw new Error("Cell editing requires DataGridSheetEditing.");
  return context;
}

/** Coordinates cell interaction. Validation and undo history belong to the feature. */
export function DataGridSheetEditing({
  rowCount,
  columnCount,
  getValue,
  onApply,
  onUndo,
  onRedo,
  children,
  rowMenu,
  viewKey,
}: {
  rowCount: number;
  columnCount: number;
  getValue: (cell: CellPosition) => string;
  onApply: (changes: CellChange[]) => string | undefined;
  onUndo: () => void;
  onRedo: () => void;
  children: ReactNode;
  rowMenu?: (cell: CellPosition) => ReactNode;
  viewKey?: string;
}) {
  const first = { row: 0, column: 0 };
  const [selection, setSelection] = useState<CellRange | null>(null);
  const [editing, setEditing] = useState<Edit | null>(null);
  const [message, setMessage] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const selectionRef = useRef(selection);
  const editRef = useRef<Edit | null>(null);
  const drag = useRef<{ source: CellRange; fill: boolean } | null>(null);
  const errorId = useId();
  const [menuCell, setMenuCell] = useState<CellPosition>(first);
  const [previousViewKey, setPreviousViewKey] = useState(viewKey);
  if (previousViewKey !== viewKey) {
    setPreviousViewKey(viewKey);
    setSelection(null);
    setEditing(null);
    setMessage("");
  }
  useEffect(() => {
    selectionRef.current = selection;
    editRef.current = editing;
  }, [selection, editing]);
  useEffect(() => {
    drag.current = null;
  }, [viewKey]);

  function select(range: CellRange) {
    selectionRef.current = range;
    setSelection(range);
  }
  function edit(value: Edit | null) {
    editRef.current = value;
    setEditing(value);
  }
  function focusCell(cell: CellPosition) {
    root.current
      ?.querySelector<HTMLElement>(
        `[data-edit-cell="${cell.row}:${cell.column}"]`,
      )
      ?.focus();
  }
  function focusEditor() {
    requestAnimationFrame(() =>
      root.current?.querySelector<HTMLElement>("[data-cell-editor]")?.focus(),
    );
  }
  function finish(cancel = false, next?: CellPosition) {
    const current = editRef.current;
    if (current && !cancel) {
      const error = onApply([
        { row: current.row, column: current.column, value: current.value },
      ]);
      if (error) {
        edit({ ...current, error });
        focusEditor();
        return false;
      }
    }
    edit(null);
    if (next) {
      select({ anchor: next, focus: next });
      requestAnimationFrame(() => focusCell(next));
    }
    return true;
  }
  function nextCell(cell: CellPosition, direction: number, vertical = false) {
    const index =
      cell.row * columnCount +
      cell.column +
      direction * (vertical ? columnCount : 1);
    return index >= 0 && index < rowCount * columnCount
      ? { row: Math.floor(index / columnCount), column: index % columnCount }
      : undefined;
  }
  function begin(cell: CellPosition, value = getValue(cell)) {
    if (!finish()) return;
    select({ anchor: cell, focus: cell });
    edit({ ...cell, value });
    setMessage("");
  }
  function fillDown() {
    if (!finish()) return;
    const range = selectionRef.current;
    if (!range) return;
    const bounds = getCellRange(range);
    const source = {
      anchor: { row: bounds.top, column: bounds.left },
      focus: { row: bounds.top, column: bounds.right },
    };
    setMessage(
      onApply(fillCellRange(source, range, getValue)) ??
        "Selection filled. Use Undo to revert.",
    );
  }

  function undo() {
    onUndo();
    setMessage("Undo applied.");
  }
  function redo() {
    onRedo();
    setMessage("Redo applied.");
  }

  function clear() {
    if (!finish() || !selectionRef.current) return;
    const changes = pasteCellRange(
      "",
      selectionRef.current,
      rowCount,
      columnCount,
    ).changes;
    setMessage(onApply(changes) ?? "Selection cleared. Use Undo to revert.");
  }
  async function copy() {
    if (!selectionRef.current) return;
    try {
      await navigator.clipboard.writeText(
        copyCellRange(selectionRef.current, getValue),
      );
      setMessage("Selected cells copied.");
    } catch {
      setMessage(
        "Clipboard access was blocked. Use Ctrl/⌘ C to copy the selection.",
      );
    }
  }
  function pasteText(text: string) {
    if (!selectionRef.current) return;
    const result = pasteCellRange(
      text,
      selectionRef.current,
      rowCount,
      columnCount,
    );
    setMessage(
      result.error ??
        onApply(result.changes) ??
        "Cells pasted. Use Undo to revert.",
    );
  }
  async function paste() {
    try {
      pasteText(await navigator.clipboard.readText());
    } catch {
      setMessage("Clipboard access was blocked. Use Ctrl/⌘ V to paste.");
    }
  }

  useEffect(() => {
    const end = () => {
      const current = drag.current;
      drag.current = null;
      if (current && selectionRef.current) {
        const cell = selectionRef.current.focus;
        root.current
          ?.querySelector<HTMLElement>(
            `[data-edit-cell="${cell.row}:${cell.column}"]`,
          )
          ?.focus();
      }
      if (current?.fill && selectionRef.current)
        setMessage(
          onApply(
            fillCellRange(current.source, selectionRef.current, getValue),
          ) ?? "Selection filled. Use Undo to revert.",
        );
    };
    const cancel = () => {
      drag.current = null;
    };
    document.addEventListener("pointerup", end);
    document.addEventListener("pointercancel", cancel);
    window.addEventListener("blur", cancel);
    return () => {
      document.removeEventListener("pointerup", end);
      document.removeEventListener("pointercancel", cancel);
      window.removeEventListener("blur", cancel);
    };
  }, [getValue, onApply]);

  function getCellProps(
    cell: CellPosition,
    label: string,
  ): ComponentProps<"td"> {
    const selected = isCellInRange(cell, selection);
    const bounds = selection ? getCellRange(selection) : null;
    const active =
      selection !== null &&
      cell.row === selection.focus.row &&
      cell.column === selection.focus.column;
    return {
      role: "gridcell",
      "aria-label": label,
      "aria-selected": selected,
      tabIndex:
        active || (!selection && cell.row === 0 && cell.column === 0) ? 0 : -1,
      ...{ "data-edit-cell": `${cell.row}:${cell.column}` },
      className: cn(
        "relative cursor-text select-none p-0 outline-none",
        selected &&
          "bg-primary/10 after:pointer-events-none after:absolute after:inset-0 after:border-primary",
        selected && cell.row === bounds?.top && "after:border-t-2",
        selected && cell.row === bounds?.bottom && "after:border-b-2",
        selected && cell.column === bounds?.left && "after:border-l-2",
        selected && cell.column === bounds?.right && "after:border-r-2",
        active && "z-10 ring-2 ring-inset ring-primary",
      ),
      onFocus: (event) => {
        if (
          event.target === event.currentTarget &&
          !isCellInRange(cell, selectionRef.current)
        )
          select({ anchor: cell, focus: cell });
      },
      onPointerDown: (event) => {
        if (
          event.button !== 0 ||
          (event.target as HTMLElement).closest("input,select,button")
        )
          return;
        event.preventDefault();
        if (!finish()) return;
        const range = {
          anchor: event.shiftKey
            ? (selectionRef.current?.anchor ?? cell)
            : cell,
          focus: cell,
        };
        select(range);
        drag.current =
          event.pointerType === "touch" ? null : { source: range, fill: false };
        focusCell(cell);
      },
      onPointerEnter: () => {
        const current = drag.current;
        if (!current) return;
        if (current.fill) {
          const bounds = getCellRange(current.source);
          select({
            anchor: {
              row: Math.min(bounds.top, cell.row),
              column: Math.min(bounds.left, cell.column),
            },
            focus: {
              row: Math.max(bounds.bottom, cell.row),
              column: Math.max(bounds.right, cell.column),
            },
          });
        } else select({ anchor: current.source.anchor, focus: cell });
      },
      onDoubleClick: (event) => {
        if (!(event.target as HTMLElement).closest("input,select,button"))
          begin(cell);
      },
      onKeyDown: (event) => {
        if (
          event.target !== event.currentTarget ||
          event.nativeEvent.isComposing
        )
          return;
        if (event.key === "Escape") {
          select({ anchor: cell, focus: cell });
          setMessage("");
          return;
        }
        if (event.key === "Enter" || event.key === "F2") {
          event.preventDefault();
          begin(cell);
          return;
        }
        if (event.key === "Delete" || event.key === "Backspace") {
          event.preventDefault();
          clear();
          return;
        }
        const viewport = event.currentTarget.closest(
          '[data-slot="table-container"]',
        );
        const pageRows = Math.max(
          1,
          Math.floor(
            (viewport?.clientHeight ?? 480) / event.currentTarget.offsetHeight,
          ) - 1,
        );
        const target = moveCellFocus(
          cell,
          event.key,
          rowCount,
          columnCount,
          event.ctrlKey || event.metaKey,
          pageRows,
        );
        if (target) {
          event.preventDefault();
          select({
            anchor: event.shiftKey
              ? (selectionRef.current?.anchor ?? cell)
              : target,
            focus: target,
          });
          focusCell(target);
        } else if (event.key === "Tab") {
          const target = nextCell(cell, event.shiftKey ? -1 : 1);
          if (target) {
            event.preventDefault();
            select({ anchor: target, focus: target });
            focusCell(target);
          }
        } else if (
          event.key.length === 1 &&
          !event.ctrlKey &&
          !event.metaKey &&
          !event.altKey
        ) {
          event.preventDefault();
          begin(cell, event.key);
        }
      },
    };
  }

  const bounds = selection ? getCellRange(selection) : null;
  const selectedCellCount =
    rowCount && bounds
      ? (bounds.bottom - bounds.top + 1) * (bounds.right - bounds.left + 1)
      : 0;

  return (
    <CellEditingContext.Provider
      value={{
        selection,
        editing,
        getCellProps,
        changeDraft: (value) => {
          if (editRef.current)
            edit({ ...editRef.current, value, error: undefined });
        },
        finish,
        nextCell,
        startFill: () => {
          if (finish() && selectionRef.current)
            drag.current = { source: selectionRef.current, fill: true };
        },
        fillDown,
        undo,
        redo,
        copy,
        paste,
        clear,
        begin,
        setMessage,
        errorId,
      }}
    >
      <ContextMenu>
        <ContextMenuTrigger
          ref={root}
          className="flex flex-col gap-3"
          onContextMenuCapture={(event) => {
            const element = (event.target as HTMLElement).closest<HTMLElement>(
              "[data-edit-cell]",
            );
            if (!element || !finish()) {
              event.preventDefault();
              return;
            }
            const [row, column] = element.dataset
              .editCell!.split(":")
              .map(Number);
            const cell = { row: row!, column: column! };
            if (!isCellInRange(cell, selectionRef.current))
              select({ anchor: cell, focus: cell });
            setMenuCell(cell);
          }}
          onCopy={(event) => {
            if (
              !selectionRef.current ||
              editRef.current ||
              !(event.target as HTMLElement).closest("[data-edit-cell]")
            )
              return;
            event.preventDefault();
            event.clipboardData.setData(
              "text/plain",
              copyCellRange(selectionRef.current, getValue),
            );
            setMessage("Selected cells copied.");
          }}
          onPaste={(event) => {
            if (
              editRef.current ||
              !(event.target as HTMLElement).closest("[data-edit-cell]")
            )
              return;
            event.preventDefault();
            pasteText(event.clipboardData.getData("text/plain"));
          }}
          onCut={(event) => {
            if (
              !selectionRef.current ||
              editRef.current ||
              !(event.target as HTMLElement).closest("[data-edit-cell]")
            )
              return;
            event.preventDefault();
            event.clipboardData.setData(
              "text/plain",
              copyCellRange(selectionRef.current, getValue),
            );
            const changes = pasteCellRange(
              "",
              selectionRef.current,
              rowCount,
              columnCount,
            ).changes;
            const error = onApply(changes);
            setMessage(
              error
                ? `Copied; cut was not applied. ${error}`
                : "Selected cells cut. Use Undo to restore them.",
            );
          }}
          onKeyDown={(event) => {
            if (
              editRef.current ||
              !(event.ctrlKey || event.metaKey) ||
              !(event.target as HTMLElement).closest("[data-edit-cell]")
            )
              return;
            const key = event.key.toLowerCase();
            if (key === "z" || key === "y") {
              event.preventDefault();
              if (key === "y" || event.shiftKey) redo();
              else undo();
            }
            if (key === "d") {
              event.preventDefault();
              fillDown();
            }
            if (key === "a") {
              event.preventDefault();
              select({
                anchor: first,
                focus: { row: rowCount - 1, column: columnCount - 1 },
              });
              focusCell({ row: rowCount - 1, column: columnCount - 1 });
            }
          }}
        >
          {children}
          <p role="status" className="min-h-5 text-sm text-muted-foreground">
            {selectedCellCount} cell{selectedCellCount === 1 ? "" : "s"}{" "}
            selected
            {message && ` · ${message}`}
          </p>
        </ContextMenuTrigger>
        <ContextMenuContent finalFocus={false}>
          <ContextMenuGroup>
            <ContextMenuLabel>Cell</ContextMenuLabel>
            <ContextMenuItem onClick={() => begin(menuCell)}>
              Edit Cell
            </ContextMenuItem>
            <ContextMenuItem onClick={() => void copy()}>Copy</ContextMenuItem>
            <ContextMenuItem onClick={() => void paste()}>
              Paste
            </ContextMenuItem>
            <ContextMenuItem onClick={clear}>Clear</ContextMenuItem>
          </ContextMenuGroup>
          {rowMenu && (
            <>
              <ContextMenuSeparator />
              {rowMenu(menuCell)}
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>
    </CellEditingContext.Provider>
  );
}

export function DataGridCellEditor({
  cell,
  label,
  value,
  type = "text",
  options,
  renderOption,
  dirty,
  children,
}: {
  cell: CellPosition;
  label: string;
  value: string;
  type?: "text" | "email" | "date";
  options?: readonly string[];
  renderOption?: (value: string) => ReactNode;
  dirty?: boolean;
  children?: ReactNode;
}) {
  const context = useDataGridSheetEditing();
  const { editing, selection, finish, nextCell, errorId } = context;
  const active = editing?.row === cell.row && editing.column === cell.column;
  const bounds = selection ? getCellRange(selection) : null;
  const handle =
    !editing &&
    bounds !== null &&
    cell.row === bounds.bottom &&
    cell.column === bounds.right;
  const editorProps = {
    "data-cell-editor": true,
    "aria-label": label,
    "aria-invalid": Boolean(editing?.error),
    "aria-describedby": editing?.error ? errorId : undefined,
    value: editing?.value ?? value,
    autoFocus: true,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => context.changeDraft(event.target.value),
    onBlur: () => finish(),
    onKeyDown: (
      event: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
      event.stopPropagation();
      if (event.nativeEvent.isComposing) return;
      if (event.key === "Escape") {
        event.preventDefault();
        finish(true, cell);
      }
      if (event.key === "Enter") {
        event.preventDefault();
        finish(false, nextCell(cell, event.shiftKey ? -1 : 1, true) ?? cell);
      }
      if (event.key === "Tab") {
        event.preventDefault();
        finish(false, nextCell(cell, event.shiftKey ? -1 : 1) ?? cell);
      }
    },
  };
  return (
    <div
      className={cn(
        "relative min-w-0",
        dirty && "bg-yellow-100/70 dark:bg-yellow-400/10",
      )}
    >
      {active ? (
        <div className="[&_[data-cell-editor]]:h-12 [&_[data-cell-editor]]:rounded-none [&_[data-cell-editor]]:border-0 [&_[data-cell-editor]]:bg-transparent! [&_[data-cell-editor]]:px-3 [&_[data-cell-editor]]:py-2 [&_[data-cell-editor]]:shadow-none [&_[data-cell-editor]]:ring-0!">
          {options ? (
            <Select
              defaultOpen
              value={options.includes(editing.value) ? editing.value : value}
              items={options.map((option) => ({
                value: option,
                label: option[0]!.toUpperCase() + option.slice(1),
              }))}
              onValueChange={(next) => {
                if (next === null) return;
                context.changeDraft(next);
                finish(false, cell);
              }}
              onOpenChange={(open, details) => {
                if (!open)
                  finish(
                    true,
                    details.reason === "escape-key" ? cell : undefined,
                  );
              }}
            >
              <SelectTrigger
                data-cell-editor
                aria-label={label}
                className="w-full rounded-none"
              >
                <SelectValue>
                  {renderOption
                    ? renderOption(
                        options.includes(editing.value) ? editing.value : value,
                      )
                    : undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent
                align="start"
                alignItemWithTrigger={false}
                finalFocus={false}
                className="p-1"
                onKeyDown={(event) => {
                  if (event.key === "Tab") {
                    event.preventDefault();
                    event.stopPropagation();
                    finish(
                      true,
                      nextCell(cell, event.shiftKey ? -1 : 1) ?? cell,
                    );
                  }
                }}
              >
                {options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {renderOption
                      ? renderOption(option)
                      : option[0]!.toUpperCase() + option.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input {...editorProps} type={type} />
          )}
          {editing.error && (
            <p
              id={errorId}
              className="max-w-64 px-3 pb-2 text-xs whitespace-normal text-destructive"
            >
              {editing.error}
            </p>
          )}
        </div>
      ) : (
        <div
          data-cell-content
          className="flex min-h-12 min-w-0 items-center overflow-hidden px-3 py-2"
        >
          {children ?? value}
        </div>
      )}
      {handle && (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Drag to fill selected cells"
          title="Drag to fill; or select a range and use Fill down"
          className="absolute right-0 bottom-0 z-20 size-2.5 cursor-crosshair border border-background bg-primary"
          onPointerDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
            context.startFill();
          }}
        />
      )}
    </div>
  );
}
