"use client";

import {
  CrudForm,
  type CrudField,
  type CrudFormProps,
} from "@/components/crud/crud-form";
import { crudSchemas, type MockEntity } from "@/mocks/crud-model";

export type Example = MockEntity<"parameters">;

const fields: CrudField<Example>[] = [
  { name: "key", label: "Key", required: true, placeholder: "app.name" },
  {
    name: "type",
    label: "Tipe",
    type: "select",
    required: true,
    options: ["string", "number", "boolean", "json"].map((value) => ({
      value,
      label: value,
    })),
  },
  {
    name: "value",
    label: "Nilai",
    type: "textarea",
    description:
      "Boolean: true / false. JSON harus valid. Jangan isi password, token, atau secret.",
  },
  {
    name: "description",
    label: "Deskripsi",
    type: "textarea",
    placeholder: "Kegunaan parameter ini…",
  },
  { name: "isActive", label: "Parameter aktif", type: "boolean" },
];

export function ExampleForm(props: CrudFormProps<Example>) {
  return (
    <CrudForm
      {...props}
      schema={crudSchemas.parameters}
      fields={fields}
      defaults={{
        key: "",
        value: "",
        type: "string",
        description: "",
        isActive: true,
      }}
    />
  );
}
