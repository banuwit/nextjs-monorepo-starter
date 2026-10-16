"use client";
import {
  CrudForm,
  type CrudFormProps,
  type CrudField,
} from "@/components/crud/crud-form";
import { crudSchemas, type MockEntity } from "@/mocks/crud-model";

type User = MockEntity<"users">;
const fields: CrudField<User>[] = [
  { name: "name", label: "Nama", required: true, placeholder: "Nama lengkap" },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    placeholder: "nama@example.com",
  },
  {
    name: "role",
    label: "Role",
    type: "select",
    required: true,
    options: [
      { value: "admin", label: "Admin" },
      { value: "editor", label: "Editor" },
      { value: "viewer", label: "Viewer" },
    ],
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      { value: "active", label: "Aktif" },
      { value: "inactive", label: "Nonaktif" },
    ],
  },
];
export function UserForm(props: CrudFormProps<User>) {
  return (
    <CrudForm
      {...props}
      schema={crudSchemas.users}
      fields={fields}
      defaults={{ name: "", email: "", role: "viewer", status: "active" }}
    />
  );
}
