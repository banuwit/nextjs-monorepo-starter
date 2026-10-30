"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import { PlusIcon } from "lucide-react";
import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  compareProducts,
  compareSpecGroups,
  defaultCompareProductIds,
} from "@/mocks/compare.mock";
import { useCompareSelection } from "../hooks/use-compare-selection";
import { CompareIllustration } from "./compare-illustration";
import { ComparePicker } from "./compare-picker";
import { CompareTable } from "./compare-table";

export function ComparePage() {
  const { selectedIds, remove, toggle } = useCompareSelection(
    defaultCompareProductIds,
  );
  const [cartIds, setCartIds] = useState<string[]>([]);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef<"add" | "table" | null>(null);

  const selectedProducts = selectedIds.flatMap((id) =>
    compareProducts.filter((product) => product.id === id),
  );
  const addableProducts = compareProducts.filter(
    (product) => !selectedIds.includes(product.id),
  );

  // The clicked button unmounts with its column, so move focus once the new
  // columns have rendered.
  useEffect(() => {
    const target = restoreFocus.current;
    restoreFocus.current = null;
    if (target === "add") addButtonRef.current?.focus();
    if (target === "table") tableRef.current?.focus();
  }, [selectedIds]);

  const handleRemove = (id: string) => {
    restoreFocus.current = "add";
    remove(id);
  };

  const handleToggleCart = (id: string) => {
    setCartIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const handleAdd = (id: string) => {
    // Adding the last product unmounts the "Add product" column.
    restoreFocus.current = addableProducts.length === 1 ? "table" : null;
    toggle(id);
  };

  const renderAddPicker = (trigger: ReactElement) => (
    <ComparePicker
      products={addableProducts}
      selectedIds={selectedIds}
      onToggle={handleAdd}
      trigger={trigger}
      align="center"
      closeOnSelect
    />
  );

  return (
    <AppBody>
      <PageHeading
        title="Compare Products"
        currentPage="Compare"
        description="Side-by-side specs and features to help you decide."
      />

      {selectedProducts.length > 0 ? (
        <div ref={tableRef} tabIndex={-1} className="outline-none">
          <CompareTable
            products={selectedProducts}
            specGroups={compareSpecGroups}
            cartIds={cartIds}
            addColumn={
              addableProducts.length > 0 ? (
                <>
                  <CompareIllustration />
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">Add another product</p>
                    <p className="text-xs text-muted-foreground">
                      Pick from {addableProducts.length} more to compare.
                    </p>
                  </div>
                  {renderAddPicker(
                    <Button
                      ref={addButtonRef}
                      variant="outline"
                      size="lg"
                      className="h-10 px-5 text-sm"
                    >
                      <PlusIcon data-icon="inline-start" />
                      Add product
                    </Button>,
                  )}
                </>
              ) : undefined
            }
            onRemove={handleRemove}
            onToggleCart={handleToggleCart}
          />
        </div>
      ) : (
        <Empty className="border border-dashed border-border">
          <EmptyHeader>
            <CompareIllustration className="mx-auto h-32" />
            <EmptyTitle>No products to compare</EmptyTitle>
            <EmptyDescription>
              Add at least one product to see its specs here.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            {renderAddPicker(
              <Button
                ref={addButtonRef}
                variant="outline"
                size="lg"
                className="h-10 px-5 text-sm"
              >
                <PlusIcon data-icon="inline-start" />
                Add product
              </Button>,
            )}
          </EmptyContent>
        </Empty>
      )}
    </AppBody>
  );
}
