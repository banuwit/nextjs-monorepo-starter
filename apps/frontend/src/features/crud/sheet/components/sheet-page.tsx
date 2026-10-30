"use client";

import { CrudResource } from "@/components/crud/crud-resource";
import { useCrudExamples } from "@/mocks/use-crud-examples";
import { sheetColumns } from "./sheet-columns";
import { SheetForm } from "./sheet-form";
import type { SheetExample } from "../types/sheet-example";

export function SheetPage() {
  const { data, ready, error, reload, commit } = useCrudExamples();
  return (
    <CrudResource<SheetExample>
      title="Data"
      heading="Sheet"
      pattern="sheet"
      rows={data}
      ready={ready}
      error={error}
      reload={reload}
      columns={sheetColumns}
      label={(row) => row.key}
      onSave={(record, isNew, expectedUpdatedAt) =>
        commit({ type: "save", record, isNew, expectedUpdatedAt })
      }
      onDelete={(record) => commit({ type: "delete", id: record.id })}
      form={(props) => <SheetForm {...props} />}
    />
  );
}
