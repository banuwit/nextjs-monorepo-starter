import { useId } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { GripVerticalIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import {
  formatInvoiceCurrency,
  getLineAmount,
  type InvoiceLineItem,
} from "../invoice-model";

export function InvoiceItems({
  items,
  onChange,
}: {
  items: InvoiceLineItem[];
  onChange: (items: InvoiceLineItem[]) => void;
}) {
  const id = useId();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  return (
    <section className="@container/items flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-medium tracking-tight">Invoice Items</h2>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={items.length >= 100}
          onClick={() =>
            onChange([
              ...items,
              {
                id: crypto.randomUUID(),
                description: "",
                quantity: 1,
                unitPrice: 0,
              },
            ])
          }
        >
          <PlusIcon data-icon="inline-start" />
          Add Item
        </Button>
      </div>
      <div
        className="hidden grid-cols-[24px_minmax(0,1fr)_56px_88px_96px_32px] items-center gap-2 text-xs text-muted-foreground @min-[560px]/items:grid"
        aria-hidden="true"
      >
        <span />
        <span>Description</span>
        <span>Units</span>
        <span>Unit cost</span>
        <span className="text-right">Line Total</span>
        <span />
      </div>
      <DndContext
        id={id}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={({ active, over }) => {
          if (over && active.id !== over.id) {
            const from = items.findIndex((item) => item.id === active.id);
            const to = items.findIndex((item) => item.id === over.id);
            if (from >= 0 && to >= 0) onChange(arrayMove(items, from, to));
          }
        }}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-3">
            {items.map((item, index) => (
              <InvoiceItemRow
                key={item.id}
                item={item}
                index={index}
                onChange={(patch) =>
                  onChange(
                    items.map((row) =>
                      row.id === item.id ? { ...row, ...patch } : row,
                    ),
                  )
                }
                onRemove={() =>
                  onChange(items.filter((row) => row.id !== item.id))
                }
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      {!items.length && (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyTitle>No invoice items</EmptyTitle>
            <EmptyDescription>
              Add an item to start building this invoice.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </section>
  );
}

function InvoiceItemRow({
  item,
  index,
  onChange,
  onRemove,
}: {
  item: InvoiceLineItem;
  index: number;
  onChange: (patch: Partial<InvoiceLineItem>) => void;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: transform
          ? `translate3d(0, ${transform.y}px, 0)`
          : undefined,
        transition,
      }}
      className={cn(
        "grid min-w-0 grid-cols-[24px_minmax(0,1fr)_minmax(0,1fr)_32px] items-center gap-2 rounded-lg @min-[560px]/items:grid-cols-[24px_minmax(0,1fr)_56px_88px_96px_32px]",
        isDragging && "relative opacity-50",
      )}
    >
      <Button
        ref={setActivatorNodeRef}
        type="button"
        variant="ghost"
        size="icon-sm"
        className="-ml-1 touch-none cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
        aria-label={`Reorder item ${index + 1}`}
      >
        <GripVerticalIcon />
      </Button>
      <Input
        className="col-span-3 min-w-0 @min-[560px]/items:col-span-1"
        aria-label={`Item ${index + 1} description`}
        placeholder="Item description"
        maxLength={300}
        value={item.description}
        onChange={(event) => onChange({ description: event.target.value })}
      />
      <Input
        type="number"
        min="0"
        max="1000000"
        step="1"
        className="col-start-2 @min-[560px]/items:col-start-auto"
        aria-label={`Item ${index + 1} quantity`}
        value={item.quantity}
        onChange={(event) =>
          onChange({
            quantity: Math.min(
              1_000_000,
              Math.max(0, Number(event.target.value)),
            ),
          })
        }
      />
      <Input
        type="number"
        min="0"
        max="1000000"
        step="0.01"
        aria-label={`Item ${index + 1} unit price`}
        value={item.unitPrice}
        onChange={(event) =>
          onChange({
            unitPrice: Math.min(
              1_000_000,
              Math.max(0, Number(event.target.value)),
            ),
          })
        }
      />
      <div className="col-span-3 col-start-2 row-start-3 flex min-w-0 justify-between gap-2 text-sm font-medium @min-[560px]/items:col-span-1 @min-[560px]/items:col-start-auto @min-[560px]/items:row-start-auto @min-[560px]/items:justify-end">
        <span className="text-muted-foreground @min-[560px]/items:hidden">
          Line total
        </span>
        <span className="break-all tabular-nums">
          {formatInvoiceCurrency(getLineAmount(item))}
        </span>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="col-start-4 row-start-2 @min-[560px]/items:col-start-auto @min-[560px]/items:row-start-auto"
        aria-label={`Remove item ${index + 1}`}
        onClick={onRemove}
      >
        <Trash2Icon />
      </Button>
    </div>
  );
}
