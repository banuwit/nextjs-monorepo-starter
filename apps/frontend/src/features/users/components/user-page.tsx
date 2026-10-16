"use client";
import { CrudResource } from "@/components/crud/crud-resource";
import type { CrudColumn } from "@/components/crud/crud-list";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { MockEntity } from "@/mocks/crud-model";
import { useCrudData } from "@/mocks/use-crud-data";
import { UserForm } from "./user-form";

type User = MockEntity<"users">;
export const userColumns: CrudColumn<User>[] = [
  {
    key: "name",
    label: "Nama",
    value: (user) => user.name,
    width: 250,
    render: (user) => (
      <div className="flex items-center gap-3">
        <Avatar className="size-8">
          <AvatarFallback>
            {user.name
              .split(/\s+/)
              .slice(0, 2)
              .map((part) => part[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <span className="truncate font-medium">{user.name}</span>
      </div>
    ),
  },
  { key: "email", label: "Email", value: (user) => user.email, width: 240 },
  {
    key: "role",
    label: "Role",
    value: (user) => user.role,
    render: (user) => <Badge variant="outline">{user.role}</Badge>,
    width: 120,
  },
  {
    key: "status",
    label: "Status",
    value: (user) => (user.status === "active" ? "Aktif" : "Nonaktif"),
    render: (user) => (
      <Badge variant={user.status === "active" ? "secondary" : "outline"}>
        {user.status === "active" ? "Aktif" : "Nonaktif"}
      </Badge>
    ),
    width: 120,
  },
];
export function UserPage() {
  const { data, ready, error, reload, commit } = useCrudData();
  return (
    <CrudResource
      title="User"
      pattern="page"
      basePath="/users"
      rows={data.users}
      ready={ready}
      error={error}
      reload={reload}
      columns={userColumns}
      label={(user) => user.name}
      filters={[
        {
          label: "Role",
          value: (user) => user.role,
          options: ["admin", "editor", "viewer"].map((value) => ({
            value,
            label: value,
          })),
        },
        {
          label: "Status",
          value: (user) => user.status,
          options: [
            { value: "active", label: "Aktif" },
            { value: "inactive", label: "Nonaktif" },
          ],
        },
      ]}
      onSave={(record, isNew, expectedUpdatedAt) =>
        commit({
          type: "save",
          resource: "users",
          record,
          isNew,
          expectedUpdatedAt,
        })
      }
      onDelete={(record) =>
        commit({ type: "delete", resource: "users", id: record.id })
      }
      form={(props) => <UserForm {...props} />}
    />
  );
}
