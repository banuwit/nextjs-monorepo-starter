import {
  columnVisibilityFeature,
  createPaginatedRowModel,
  rowPaginationFeature,
  rowSelectionFeature,
  tableFeatures,
} from "@tanstack/react-table";

export const tableFeaturesClient = tableFeatures({
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  paginatedRowModel: createPaginatedRowModel(),
});

export type ClientTableFeatures = typeof tableFeaturesClient;
