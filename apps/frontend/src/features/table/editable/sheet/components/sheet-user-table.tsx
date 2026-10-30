"use client";

import type {
  Column,
  ColumnDef,
  ColumnOrderState,
  ColumnPinningState,
  ColumnVisibilityState,
} from "@tanstack/react-table";
import { ListFilter, FilterX, Redo2, Undo2 } from "lucide-react";
import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import {
  DataGridClient,
  type DataGridColumnState,
} from "@/components/data-grid/data-grid-client";
import { getUserCellColumnOrder } from "../utils/user-sheet-columns";
import { DataGridHeaderDropdown } from "@/components/data-grid/data-grid-header-dropdown";
import {
  DataGridSheetEditing,
  DataGridCellEditor,
  useDataGridSheetEditing,
} from "@/components/data-grid/data-grid-sheet-editing";
import {
  quoteClipboardValue,
  type CellChange,
  type CellPosition,
} from "@/components/data-grid/data-grid-sheet-range";
import type { DataGridFeatures } from "@/components/data-grid/data-grid-features";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import type { User } from "@/mocks/user.mock";
import {
  applyUserCellChanges,
  createUserCellDraft,
  userCellHistoryReducer,
} from "../utils/user-editing";
import type { EditableUserField } from "../types/user-editing";
import { filterUserCells, sortUserCells } from "../utils/user-sheet-filters";
import type {
  UserCellSorting,
  UserFilter,
  UserFilterField,
} from "../types/user-sheet-filters";
import { SheetColumnFilter } from "./sheet-table-filters";
import {
  SheetUserDelete,
  SheetUserForm,
  type SheetUserEditor,
} from "./sheet-user-dialogs";

const fields: {
  field: EditableUserField;
  title: string;
  type?: "email" | "date";
  options?: string[];
}[] = [
  { field: "name", title: "Name" },
  { field: "email", title: "Email", type: "email" },
  { field: "gender", title: "Gender", options: ["male", "female"] },
  { field: "role", title: "Role", options: ["admin", "editor", "viewer"] },
  { field: "joinDate", title: "Join Date", type: "date" },
  {
    field: "status",
    title: "Status",
    options: ["active", "inactive", "pending"],
  },
];
const filterFields = [
  { field: "no" as const, title: "No" },
  { field: "id" as const, title: "User ID" },
  ...fields,
];
const defaultWidths: Record<string, number> = {
  no: 60,
  id: 150,
  name: 240,
  email: 280,
  gender: 140,
  role: 140,
  joinDate: 170,
  status: 160,
};
const ViewContext = createContext<{
  baseline: User[];
  allRows: User[];
  visible: typeof fields;
  visibleIds: string[];
  columnState: DataGridColumnState;
  filters: UserFilter[];
  showFilters: boolean;
  setFilter: (filter: UserFilter) => void;
  clearFilters: () => void;
  sorting: UserCellSorting;
  setSorting: (sorting: UserCellSorting) => void;
} | null>(null);
function useView() {
  return useContext(ViewContext)!;
}

function renderStatus(value: string) {
  const colors =
    value === "active"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
      : value === "pending"
        ? "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400"
        : "border-border bg-muted/50 text-muted-foreground";
  return (
    <Badge variant="outline" className={cn("gap-1.5 capitalize", colors)}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {value}
    </Badge>
  );
}

function UserHeader({
  column,
  title,
}: {
  column: Column<DataGridFeatures, User, unknown>;
  title: string;
}) {
  const { filters, showFilters, setFilter, clearFilters, sorting, setSorting } =
    useView();
  const id = column.id;
  const config = filterFields.find(({ field }) => field === id);
  return (
    <div className="relative flex h-full flex-col justify-center gap-1.5 py-2">
      <DataGridHeaderDropdown
        column={column}
        title={title}
        showVisibilityToggle={false}
        showColumnActions
        sorted={sorting?.field === id ? (sorting.desc ? "desc" : "asc") : false}
        onSortChange={(desc) =>
          setSorting({ field: id as UserFilterField, desc })
        }
      />
      {showFilters &&
        (id === "no" ? (
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label="Clear all column filters"
            disabled={!filters.length}
            onClick={clearFilters}
          >
            <FilterX />
          </Button>
        ) : (
          config && (
            <SheetColumnFilter
              field={id as UserFilterField}
              title={title}
              options={"options" in config ? config.options : undefined}
              value={filters.find(({ field }) => field === id)?.value ?? ""}
              onChange={setFilter}
            />
          )
        ))}
    </div>
  );
}

function UserCell({
  user,
  rowIndex,
  field,
}: {
  user: User;
  rowIndex: number;
  field: EditableUserField;
}) {
  const { baseline, visible } = useView();
  const initial = baseline.find((row) => row.id === user.id);
  const column = visible.findIndex((config) => config.field === field);
  const config = fields.find((config) => config.field === field)!;
  return (
    <DataGridCellEditor
      cell={{ row: rowIndex, column }}
      label={`${config.title} for ${user.id}`}
      value={user[field]}
      type={config.type}
      options={config.options}
      renderOption={field === "status" ? renderStatus : undefined}
      dirty={user[field] !== initial?.[field]}
    >
      {field === "name" ? (
        <span className="flex min-w-0 items-center gap-2">
          <Avatar className="size-6 shrink-0">
            <AvatarFallback>
              {user.name
                .split(" ")
                .filter(Boolean)
                .map((part) => part[0])
                .slice(0, 2)
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="truncate font-medium">{user.name}</span>
        </span>
      ) : field === "status" ? (
        renderStatus(user.status)
      ) : field === "role" ? (
        <Badge className="capitalize" variant="outline">
          {user.role}
        </Badge>
      ) : (
        <span className={cn("truncate", config.options && "capitalize")}>
          {user[field]}
        </span>
      )}
    </DataGridCellEditor>
  );
}
function RowNumber({ id }: { id: string }) {
  const { allRows } = useView();
  return (
    <span className="tabular-nums">
      {allRows.findIndex((row) => row.id === id) + 1}
    </span>
  );
}
const columns: ColumnDef<DataGridFeatures, User>[] = [
  {
    id: "no",
    enableHiding: false,
    accessorFn: (user) => user.id,
    header: ({ column }) => <UserHeader column={column} title="No" />,
    cell: ({ row }) => <RowNumber id={row.id} />,
  },
  {
    accessorKey: "id",
    enableHiding: false,
    header: ({ column }) => <UserHeader column={column} title="User ID" />,
  },
  ...fields.map((config): ColumnDef<DataGridFeatures, User> => ({
    accessorKey: config.field,
    header: ({ column }) => <UserHeader column={column} title={config.title} />,
    cell: ({ row }) => (
      <UserCell user={row.original} rowIndex={row.index} field={config.field} />
    ),
  })),
];

function UserGrid({
  rows,
  canUndo,
  canRedo,
  toolbar,
}: {
  rows: User[];
  canUndo: boolean;
  canRedo: boolean;
  toolbar: () => ReactNode;
}) {
  const { editing, getCellProps, undo, redo } = useDataGridSheetEditing();
  const { visible, visibleIds, columnState, sorting } = useView();
  return (
    <>
      <div className="min-w-0 [&_th]:h-10 [&_[data-cell-content]]:min-h-9 [&_[data-cell-content]]:py-1 [&_[data-cell-editor]]:h-9!">
        <DataGridClient
          columns={columns}
          columnState={columnState}
          columnLines={true}
          enableColumnPinning
          enableColumnOrdering
          renderToolbar={() => (
            <div className="flex flex-wrap items-center gap-2">
              {toolbar()}
              <Button
                variant="outline"
                size="sm"
                disabled={!canUndo || Boolean(editing)}
                onClick={undo}
                title="Ctrl/⌘ Z"
              >
                <Undo2 />
                Undo
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!canRedo || Boolean(editing)}
                onClick={redo}
                title="Ctrl/⌘ Shift Z"
              >
                <Redo2 />
                Redo
              </Button>
            </div>
          )}
          data={rows}
          getRowId={(user) => user.id}
          pagination="none"
          showVisibilityToggle={false}
          showHeaderVisibilityToggle={false}
          tableProps={{
            role: "grid",
            "aria-label": "Editable user cells",
            "aria-describedby": "cell-editing-help",
            "aria-multiselectable": true,
            style: {
              tableLayout: "fixed",
              width: "100%",
              minWidth: visibleIds.reduce(
                (total, id) => total + defaultWidths[id]!,
                0,
              ),
            },
          }}
          getHeaderProps={(id) => ({
            style: { width: defaultWidths[id] },
            "aria-sort":
              sorting?.field === id
                ? sorting.desc
                  ? "descending"
                  : "ascending"
                : "none",
          })}
          getCellProps={({ row, rowIndex, columnId }) => {
            const column = visible.findIndex(
              (config) => config.field === columnId,
            );
            return column < 0
              ? {
                  role: "gridcell",
                  "aria-readonly": true,
                  className: "truncate",
                }
              : getCellProps(
                  { row: rowIndex, column },
                  `${visible[column]!.title} for ${row.id}`,
                );
          }}
        />
      </div>
    </>
  );
}

function UserRowMenu({
  user,
  open,
  remove,
  activate,
}: {
  user?: User;
  open: (mode: "details" | "duplicate", user: User) => void;
  remove: (user: User) => void;
  activate: (user: User) => void;
}) {
  const { setMessage } = useDataGridSheetEditing();
  if (!user) return null;
  return (
    <ContextMenuGroup>
      <ContextMenuLabel>{user.id}</ContextMenuLabel>
      <ContextMenuItem
        disabled={user.status === "active"}
        onClick={() => activate(user)}
      >
        Mark Active
      </ContextMenuItem>
      <ContextMenuItem onClick={() => open("details", user)}>
        Open Details
      </ContextMenuItem>
      <ContextMenuItem onClick={() => open("duplicate", user)}>
        Duplicate
      </ContextMenuItem>
      <ContextMenuItem
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(
              [user.id, ...fields.map(({ field }) => user[field])]
                .map(quoteClipboardValue)
                .join("\t"),
            );
            setMessage("User row copied.");
          } catch {
            setMessage(
              "Clipboard access was blocked. Select cells and use Ctrl/⌘ C.",
            );
          }
        }}
      >
        Copy Row
      </ContextMenuItem>
      <ContextMenuItem variant="destructive" onClick={() => remove(user)}>
        Delete User
      </ContextMenuItem>
    </ContextMenuGroup>
  );
}

export function SheetUserTable({ users }: { users: User[] }) {
  const [state, dispatch] = useReducer(userCellHistoryReducer, {
    rows: users,
    past: [],
    future: [],
  });
  const [filters, setFilters] = useState<UserFilter[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<UserCellSorting>(null);
  const [editor, setEditor] = useState<SheetUserEditor | null>(null);
  const [deleting, setDeleting] = useState<User>();
  const rows = useMemo(
    () =>
      sortUserCells(
        filterUserCells(state.rows, filters).filter((user) =>
          [user.id, user.name, user.email].some((value) =>
            value.toLowerCase().includes(search.trim().toLowerCase()),
          ),
        ),
        sorting,
      ),
    [state.rows, filters, search, sorting],
  );
  const [visibility, setVisibility] = useState<ColumnVisibilityState>({});
  const [order, setOrder] = useState<ColumnOrderState>([]);
  const [pinning, setPinning] = useState<ColumnPinningState>({
    start: [],
    end: [],
  });
  const columnState: DataGridColumnState = {
    visibility,
    order,
    pinning,
    onVisibilityChange: setVisibility,
    onOrderChange: setOrder,
    onPinningChange: setPinning,
  };
  const visibleIds = getUserCellColumnOrder(
    filterFields.map(({ field }) => field),
    order,
    visibility,
    pinning,
  );
  const visible = visibleIds.flatMap((id) =>
    fields.filter(({ field }) => field === id),
  );
  function apply(changes: CellChange[]) {
    const mapped = changes.map(({ row, column, value }) => ({
      id: rows[row]?.id ?? "",
      field: visible[column]?.field as EditableUserField,
      value,
    }));
    const result = applyUserCellChanges(state.rows, mapped);
    if (result.error) return result.error;
    dispatch({ type: "apply", changes: mapped });
  }
  const getValue = ({ row, column }: CellPosition) =>
    rows[row]?.[visible[column]!.field] ?? "";
  return (
    <ViewContext.Provider
      value={{
        baseline: users,
        allRows: state.rows,
        visible,
        visibleIds,
        columnState,
        sorting,
        setSorting,
        filters,
        showFilters,
        setFilter: (next) =>
          setFilters((current) => [
            ...current.filter(({ field }) => field !== next.field),
            ...(next.value ? [next] : []),
          ]),
        clearFilters: () => setFilters([]),
      }}
    >
      <div
        className="flex flex-col gap-3"
        onKeyDown={(event) => {
          if (
            event.defaultPrevented ||
            !(event.ctrlKey || event.metaKey) ||
            (event.target as HTMLElement).closest(
              "input,textarea,select,[contenteditable=true],[role=combobox]",
            )
          )
            return;
          const key = event.key.toLowerCase();
          if (key === "z" || key === "y") {
            event.preventDefault();
            dispatch({ type: key === "y" || event.shiftKey ? "redo" : "undo" });
          }
        }}
      >
        <DataGridSheetEditing
          viewKey={
            rows.map((row) => row.id).join(",") +
            ":" +
            visible.map(({ field }) => field).join(",")
          }
          rowCount={rows.length}
          columnCount={visible.length}
          getValue={getValue}
          onApply={apply}
          onUndo={() => dispatch({ type: "undo" })}
          onRedo={() => dispatch({ type: "redo" })}
          rowMenu={(cell) => (
            <UserRowMenu
              user={rows[cell.row]}
              open={(mode, user) =>
                setEditor({
                  mode,
                  draft:
                    mode === "duplicate"
                      ? createUserCellDraft(state.rows, user)
                      : { ...user },
                })
              }
              remove={setDeleting}
              activate={(user) =>
                dispatch({
                  type: "apply",
                  changes: [{ id: user.id, field: "status", value: "active" }],
                })
              }
            />
          )}
        >
          <UserGrid
            toolbar={() => (
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  className="w-full sm:w-64"
                  aria-label="Search users"
                  placeholder="Search user ID, name or email"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                <Button
                  size="sm"
                  variant={showFilters ? "secondary" : "outline"}
                  aria-pressed={showFilters}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <ListFilter />
                  Filters{filters.length > 0 && ` (${filters.length})`}
                </Button>
              </div>
            )}
            rows={rows}
            canUndo={state.past.length > 0}
            canRedo={state.future.length > 0}
          />
        </DataGridSheetEditing>
      </div>
      {editor && (
        <SheetUserForm
          key={editor.mode + editor.draft.id}
          editor={editor}
          rows={state.rows}
          fields={fields}
          onSave={(next) => {
            dispatch({ type: "replace", rows: next });
            if (editor.mode !== "details") {
              setFilters([]);
              setSearch("");
            }
          }}
          onClose={() => setEditor(null)}
        />
      )}
      <SheetUserDelete
        user={deleting}
        onDelete={(id) =>
          dispatch({
            type: "replace",
            rows: state.rows.filter((row) => row.id !== id),
          })
        }
        onClose={() => setDeleting(undefined)}
      />
    </ViewContext.Provider>
  );
}
