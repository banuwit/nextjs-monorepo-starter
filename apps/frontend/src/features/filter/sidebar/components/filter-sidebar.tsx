"use client";

import { CheckIcon, StarIcon, XIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type {
  CatalogColorOption,
  CatalogDepartment,
  CatalogFacetOption,
  CatalogFilterChip,
  CatalogFilterState,
  CatalogRatingOption,
} from "../types/catalog-filter";
import {
  formatPrice,
  isLightHex,
  toggleListValue,
} from "../utils/catalog-filter";

export type FilterSidebarOptions = {
  departments: { value: CatalogDepartment; label: string }[];
  categories: CatalogFacetOption[];
  materials: CatalogFacetOption[];
  brands: CatalogFacetOption[];
  colors: CatalogColorOption[];
  sizes: readonly string[];
  ratings: CatalogRatingOption[];
  priceMax: number;
};

export type FilterSidebarCounts = {
  categories: Map<string, number>;
  materials: Map<string, number>;
  brands: Map<string, number>;
};

/**
 * Faceted catalog filter, after ReUI `filter-sidebar-3`: department pills,
 * removable chips, checkbox facets with counts, price slider, color swatches,
 * size buttons, star-rating radios, and stock/sale switches.
 */
export function FilterSidebar({
  id,
  value,
  onValueChange,
  chips,
  onRemoveChip,
  options,
  counts,
  canApply,
  onApply,
  onClearAll,
  onClose,
}: {
  id: string;
  value: CatalogFilterState;
  onValueChange: (next: CatalogFilterState) => void;
  chips: CatalogFilterChip[];
  onRemoveChip: (chipId: string) => void;
  options: FilterSidebarOptions;
  counts: FilterSidebarCounts;
  canApply: boolean;
  onApply: () => void;
  onClearAll: () => void;
  onClose: () => void;
}) {
  const update = (patch: Partial<CatalogFilterState>) =>
    onValueChange({ ...value, ...patch });

  const [priceMin, priceMax] = value.priceRange;

  return (
    <aside
      id={id}
      aria-label="Product filters"
      className="flex flex-col rounded-lg border bg-card text-card-foreground md:max-h-[calc(100dvh-5rem)]"
    >
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <h3 className="text-base font-semibold">Filters</h3>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            Clear all
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Close filters"
            onClick={onClose}
          >
            <XIcon />
          </Button>
        </div>
      </div>
      <Separator />

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
        <Section title="Department">
          <div className="flex flex-wrap gap-1.5">
            <Pill
              pressed={value.department === null}
              onClick={() => update({ department: null })}
            >
              All
            </Pill>
            {options.departments.map((department) => (
              <Pill
                key={department.value}
                pressed={value.department === department.value}
                onClick={() => update({ department: department.value })}
              >
                {department.label}
              </Pill>
            ))}
          </div>
        </Section>

        {chips.length > 0 && (
          <>
            <Separator />
            <ul className="flex flex-wrap gap-1.5" aria-label="Active filters">
              {chips.map((chip) => (
                <li key={chip.id}>
                  <Badge variant="secondary" className="h-6 gap-1 pr-1 pl-2">
                    {chip.hex && (
                      <span
                        aria-hidden
                        className="size-2.5 rounded-full border border-black/10"
                        style={{ backgroundColor: chip.hex }}
                      />
                    )}
                    {chip.label}
                    <button
                      type="button"
                      aria-label={`Remove ${chip.label}`}
                      className="inline-flex size-4 items-center justify-center rounded-full hover:bg-foreground/10 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                      onClick={() => onRemoveChip(chip.id)}
                    >
                      <XIcon className="size-3" />
                    </button>
                  </Badge>
                </li>
              ))}
            </ul>
          </>
        )}

        <Separator />
        <CheckboxFacet
          title="Category"
          name={`${id}-category`}
          options={options.categories}
          counts={counts.categories}
          selected={value.categories}
          onToggle={(item) =>
            update({ categories: toggleListValue(value.categories, item) })
          }
        />

        <Separator />
        <Section
          title="Price"
          aside={
            <span className="text-sm font-medium tabular-nums">
              {formatPrice(priceMin)}{" "}
              <span className="text-muted-foreground">–</span>{" "}
              {formatPrice(priceMax)}
            </span>
          }
        >
          <Slider
            aria-label="Price range"
            min={0}
            max={options.priceMax}
            step={5}
            value={value.priceRange}
            onValueChange={(next) => {
              const [min = 0, max = options.priceMax] = Array.isArray(next)
                ? next
                : [next];
              update({ priceRange: [min, max] });
            }}
          />
        </Section>

        <Separator />
        <Section title="Color">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Color">
            {options.colors.map((color) => {
              const pressed = value.colors.includes(color.value);
              return (
                <button
                  key={color.value}
                  type="button"
                  aria-pressed={pressed}
                  aria-label={color.label}
                  title={color.label}
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full border border-black/10 transition-shadow focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none dark:border-white/15",
                    pressed &&
                      "ring-2 ring-foreground ring-offset-2 ring-offset-card",
                  )}
                  style={{ backgroundColor: color.hex }}
                  onClick={() =>
                    update({
                      colors: toggleListValue(value.colors, color.value),
                    })
                  }
                >
                  {pressed && (
                    <CheckIcon
                      className={cn(
                        "size-3.5",
                        isLightHex(color.hex) ? "text-black" : "text-white",
                      )}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </Section>

        <Separator />
        <Section title="Size">
          <div
            className="flex flex-wrap gap-1.5"
            role="group"
            aria-label="Size"
          >
            {options.sizes.map((size) => {
              const pressed = value.sizes.includes(size);
              return (
                <Button
                  key={size}
                  type="button"
                  variant={pressed ? "default" : "outline"}
                  size="sm"
                  aria-pressed={pressed}
                  className="min-w-9 px-2 tabular-nums"
                  onClick={() =>
                    update({ sizes: toggleListValue(value.sizes, size) })
                  }
                >
                  {size}
                </Button>
              );
            })}
          </div>
        </Section>

        <Separator />
        <CheckboxFacet
          title="Material"
          name={`${id}-material`}
          options={options.materials}
          counts={counts.materials}
          selected={value.materials}
          onToggle={(item) =>
            update({ materials: toggleListValue(value.materials, item) })
          }
        />

        <Separator />
        <CheckboxFacet
          title="Brand"
          name={`${id}-brand`}
          options={options.brands}
          counts={counts.brands}
          selected={value.brands}
          onToggle={(item) =>
            update({ brands: toggleListValue(value.brands, item) })
          }
        />

        <Separator />
        <Section title="Rating">
          <RadioGroup
            aria-label="Minimum rating"
            value={value.rating === null ? "" : String(value.rating)}
            onValueChange={(next) =>
              update({
                rating: next === "" || next == null ? null : Number(next),
              })
            }
          >
            {options.ratings.map((rating) => {
              const itemId = `${id}-rating-${rating.value}`;
              return (
                <div key={rating.value} className="flex items-center gap-2">
                  <RadioGroupItem id={itemId} value={String(rating.value)} />
                  <Label htmlFor={itemId} className="font-normal">
                    <span className="flex items-center gap-0.5" aria-hidden>
                      {Array.from({ length: 5 }, (_, index) => (
                        <StarIcon
                          key={index}
                          className={cn(
                            "size-3.5",
                            index < rating.value
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/40",
                          )}
                        />
                      ))}
                    </span>
                    <span className="text-muted-foreground">
                      {rating.value}★ &amp; up
                    </span>
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </Section>

        <Separator />
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor={`${id}-in-stock`} className="font-normal">
              In stock only
            </Label>
            <Switch
              id={`${id}-in-stock`}
              checked={value.inStockOnly}
              onCheckedChange={(checked) => update({ inStockOnly: checked })}
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor={`${id}-on-sale`} className="font-normal">
              On sale
            </Label>
            <Switch
              id={`${id}-on-sale`}
              checked={value.onSaleOnly}
              onCheckedChange={(checked) => update({ onSaleOnly: checked })}
            />
          </div>
        </div>
      </div>

      <Separator />
      <div className="p-4">
        <Button className="w-full" disabled={!canApply} onClick={onApply}>
          Apply filters
        </Button>
      </div>
    </aside>
  );
}

function Section({
  title,
  aside,
  children,
}: {
  title: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold">{title}</h4>
        {aside}
      </div>
      {children}
    </section>
  );
}

function Pill({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Button
      type="button"
      variant={pressed ? "default" : "outline"}
      size="sm"
      aria-pressed={pressed}
      className="rounded-full"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function CheckboxFacet({
  title,
  name,
  options,
  counts,
  selected,
  onToggle,
}: {
  title: string;
  name: string;
  options: CatalogFacetOption[];
  counts: Map<string, number>;
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <Section title={title}>
      <ul className="flex flex-col gap-2" role="group" aria-label={title}>
        {options.map((option) => {
          const itemId = `${name}-${option.value}`;
          return (
            <li key={option.value} className="flex items-center gap-2">
              <Checkbox
                id={itemId}
                checked={selected.includes(option.value)}
                onCheckedChange={() => onToggle(option.value)}
              />
              <Label htmlFor={itemId} className="flex-1 font-normal">
                {option.label}
              </Label>
              <span className="text-xs text-muted-foreground tabular-nums">
                {counts.get(option.value) ?? 0}
              </span>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
