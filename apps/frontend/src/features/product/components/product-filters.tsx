import { useId } from "react";
import { SelectFilter } from "@/components/filter/select-filter";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { ProductColor, ProductFilters } from "../types/product";
import { ProductColorOption } from "./product-color-option";

function ProductFilterSwitch({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <Label className="cursor-pointer">
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
      {label}
    </Label>
  );
}

export function ProductFiltersPanel({
  id,
  filters,
  categories,
  colors,
  showClear,
  onCategoryChange,
  onInStockOnlyChange,
  onOnSaleOnlyChange,
  onToggleColor,
  onClear,
}: {
  id: string;
  filters: ProductFilters;
  categories: string[];
  colors: ProductColor[];
  showClear: boolean;
  onCategoryChange: (category: string | null) => void;
  onInStockOnlyChange: (checked: boolean) => void;
  onOnSaleOnlyChange: (checked: boolean) => void;
  onToggleColor: (colorId: string) => void;
  onClear: () => void;
}) {
  const colorGroupName = useId();

  return (
    <div
      id={id}
      className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-lg border border-border bg-card p-3 text-card-foreground"
    >
      <SelectFilter
        placeholder="Category"
        allLabel="All categories"
        options={categories.map((category) => ({
          label: category,
          value: category,
        }))}
        value={filters.category}
        onValueChange={onCategoryChange}
      />
      <ProductFilterSwitch
        label="In stock"
        checked={filters.inStockOnly}
        onCheckedChange={onInStockOnlyChange}
      />
      <ProductFilterSwitch
        label="On sale"
        checked={filters.onSaleOnly}
        onCheckedChange={onOnSaleOnlyChange}
      />
      <div
        role="group"
        aria-label="Color"
        className="flex flex-wrap items-center gap-1"
      >
        <span className="mr-1 text-sm font-medium">Color</span>
        {colors.map((color) => (
          <ProductColorOption
            key={color.id}
            color={color}
            type="checkbox"
            name={colorGroupName}
            checked={filters.colorIds.includes(color.id)}
            accessibleLabel={`Filter by ${color.name}`}
            onChange={() => onToggleColor(color.id)}
          />
        ))}
      </div>
      {showClear && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="ml-auto"
          onClick={onClear}
        >
          Clear filters
        </Button>
      )}
    </div>
  );
}
