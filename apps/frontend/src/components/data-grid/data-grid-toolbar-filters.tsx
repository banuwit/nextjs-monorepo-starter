"use client"

import { ComboboxFilter } from "@/components/filter/combobox-filter"
import { SelectFilter } from "@/components/filter/select-filter"

import type { ToolbarConfig } from "./types"

/** Keys of the dropdown and combobox filters in a toolbar. */
export function getToolbarFilterKeys(toolbar: ToolbarConfig | undefined) {
  return [
    ...(toolbar?.dropdowns ?? []),
    ...(toolbar?.comboboxes ?? []),
  ].map((filter) => filter.key)
}

interface DataGridToolbarFiltersProps {
  toolbar: ToolbarConfig | undefined
  /** Applied values for a filter key; single-pick filters read the first. */
  getValues: (key: string) => string[]
  onChange: (key: string, values: string[]) => void
}

/**
 * Renders the dropdown and combobox filters of a toolbar config.
 * Shared by `DataGridClient` and `DataGridServer`, which only differ in where
 * the applied values live (column filters vs. the URL).
 */
export function DataGridToolbarFilters({
  toolbar,
  getValues,
  onChange,
}: DataGridToolbarFiltersProps) {
  return (
    <>
      {toolbar?.dropdowns?.map((dropdown) => (
        <SelectFilter
          key={dropdown.key}
          options={dropdown.options}
          placeholder={dropdown.placeholder}
          allLabel={dropdown.allLabel}
          value={getValues(dropdown.key)[0] ?? null}
          onValueChange={(value) =>
            onChange(dropdown.key, value ? [value] : [])
          }
        />
      ))}
      {toolbar?.comboboxes?.map(({ key, multiple, ...combobox }) =>
        multiple ? (
          <ComboboxFilter
            key={key}
            {...combobox}
            multiple
            value={getValues(key)}
            onValueChange={(values) => onChange(key, values)}
          />
        ) : (
          <ComboboxFilter
            key={key}
            {...combobox}
            value={getValues(key)[0] ?? null}
            onValueChange={(value) => onChange(key, value ? [value] : [])}
          />
        ),
      )}
    </>
  )
}
