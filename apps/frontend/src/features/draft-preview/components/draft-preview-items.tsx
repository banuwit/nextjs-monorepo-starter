import { PlusIcon, Trash2Icon } from "lucide-react";
import {
  DataGridRowDnd,
  DataGridRowDragHandle,
  DataGridSortableRow,
} from "@/components/data-grid/data-grid-row-dnd";
import { reorderDataGridItems } from "@/components/data-grid/data-grid-reordering";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { DraftPreview, DraftPreviewErrors } from "../types/draft-preview";
import { calculateDraftPreview, formatMoney } from "../utils/draft-preview";

export function DraftPreviewItems({
  draftPreview,
  errors,
  onChange,
}: {
  draftPreview: DraftPreview;
  errors: DraftPreviewErrors;
  onChange: (items: DraftPreview["items"]) => void;
}) {
  const totals = calculateDraftPreview(draftPreview);
  function update(id: string, patch: Partial<DraftPreview["items"][number]>) {
    onChange(
      draftPreview.items.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    );
  }
  return (
    <section
      aria-labelledby="items-heading"
      className="@container/items px-5 py-6 sm:px-7"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 id="items-heading" className="font-medium">
            Items & services
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            A clear breakdown of the work you are billing for.
          </p>
        </div>
        <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
          {draftPreview.items.length} items
        </span>
      </div>
      <DataGridRowDnd
        items={draftPreview.items.map((item) => item.id)}
        onReorder={(activeId, overId) =>
          onChange(
            reorderDataGridItems(
              draftPreview.items,
              activeId,
              overId,
              (item) => item.id,
            ),
          )
        }
      >
        <Table
          aria-label="Draft Preview items"
          className="min-w-[36rem] table-fixed"
          containerProps={{
            className: "rounded-lg border",
            tabIndex: 0,
            role: "region",
            "aria-label": "Scrollable draft preview items",
          }}
        >
          <TableCaption className="sr-only">
            Draft Preview items. Drag a row handle to reorder, or press Space,
            use the arrow keys, and press Space to drop.
          </TableCaption>
          <TableHeader className="bg-muted/50 [&_th]:h-8 [&_th]:px-1.5 [&_th]:text-xs">
            <TableRow>
              <TableHead className="w-8">
                <span className="sr-only">Reorder</span>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-14">Qty</TableHead>
              <TableHead className="w-20">Unit</TableHead>
              <TableHead className="w-28">Unit price</TableHead>
              <TableHead className="w-24 text-right">Amount</TableHead>
              <TableHead className="w-8">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {draftPreview.items.map((item, index) => (
              <DataGridSortableRow key={item.id} id={item.id}>
                <TableCell className="p-1.5 align-top">
                  <DataGridRowDragHandle label={`Reorder item ${index + 1}`} />
                </TableCell>
                {(["description", "quantity", "unit", "rate"] as const).map(
                  (key) => {
                    const id = `items.${index}.${key}`;
                    const error = errors[id];
                    const numeric = key === "quantity" || key === "rate";
                    const label = {
                      description: "Description",
                      quantity: "Quantity",
                      unit: "Unit",
                      rate: "Unit price",
                    }[key];
                    const attrs = {
                      id,
                      "aria-label": `Item ${index + 1} ${label.toLowerCase()}`,
                      "aria-invalid": !!error,
                      "aria-describedby": error ? `${id}-error` : undefined,
                    };
                    return (
                      <TableCell
                        key={key}
                        className="p-1.5 align-top whitespace-normal"
                      >
                        {key === "description" ? (
                          <Textarea
                            {...attrs}
                            maxLength={500}
                            value={item.description}
                            rows={1}
                            className="min-h-8 resize-y px-2 py-1 text-xs md:text-xs"
                            placeholder="Describe your service or product"
                            onChange={(e) =>
                              update(item.id, { description: e.target.value })
                            }
                          />
                        ) : (
                          <Input
                            {...attrs}
                            className="h-8 px-2 text-xs md:text-xs"
                            type={numeric ? "number" : "text"}
                            min={numeric ? 0 : undefined}
                            step={numeric ? "any" : undefined}
                            maxLength={key === "unit" ? 20 : undefined}
                            value={
                              numeric && !Number.isFinite(item[key])
                                ? ""
                                : item[key]
                            }
                            onChange={(e) =>
                              update(item.id, {
                                [key]: numeric
                                  ? e.target.valueAsNumber
                                  : e.target.value,
                              })
                            }
                          />
                        )}
                        {error && (
                          <p
                            id={`${id}-error`}
                            className="mt-1 text-xs text-destructive"
                          >
                            {error}
                          </p>
                        )}
                      </TableCell>
                    );
                  },
                )}
                <TableCell className="px-1.5 py-3 text-right align-top text-xs font-medium tabular-nums">
                  {Number.isFinite(item.quantity) && Number.isFinite(item.rate)
                    ? formatMoney(
                        totals.lines[index] ?? 0,
                        draftPreview.currency,
                      )
                    : "—"}
                </TableCell>
                <TableCell className="p-1.5 align-top">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground hover:text-destructive"
                    aria-label={`Remove item ${index + 1}`}
                    onClick={() =>
                      onChange(
                        draftPreview.items.filter(
                          (entry) => entry.id !== item.id,
                        ),
                      )
                    }
                  >
                    <Trash2Icon />
                  </Button>
                </TableCell>
              </DataGridSortableRow>
            ))}
          </TableBody>
        </Table>
      </DataGridRowDnd>
      <p className="mt-2 text-xs text-muted-foreground">
        Drag the handle to reorder items. Use Space and the arrow keys with a
        keyboard.
      </p>
      {!draftPreview.items.length && (
        <p className="py-6 text-sm text-muted-foreground">
          Add your first item to start this draft preview.
        </p>
      )}
      <Button
        id="items"
        type="button"
        variant="outline"
        className="mt-2 h-10 border-dashed"
        disabled={draftPreview.items.length >= 100}
        onClick={() =>
          onChange([
            ...draftPreview.items,
            {
              id: crypto.randomUUID(),
              description: "",
              quantity: 1,
              unit: "item",
              rate: 0,
            },
          ])
        }
      >
        <PlusIcon /> Add item
      </Button>
      {errors.items && (
        <p className="mt-2 text-xs text-destructive">{errors.items}</p>
      )}
    </section>
  );
}
