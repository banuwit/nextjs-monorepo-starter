import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { clientSchema, type InvoiceClient } from "../invoice-model";

export function ClientSelector({
  value,
  clients,
  onSelect,
  onAdd,
}: {
  value: InvoiceClient;
  clients: InvoiceClient[];
  onSelect: (client: InvoiceClient) => void;
  onAdd: (client: InvoiceClient) => void;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-medium tracking-tight">Billed To</h2>
        <Dialog
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            setError("");
          }}
        >
          <DialogTrigger
            render={<Button type="button" variant="ghost" size="sm" />}
          >
            <PlusIcon data-icon="inline-start" />
            Add New Client
          </DialogTrigger>
          <DialogContent className="max-h-[90svh] overflow-y-auto">
            <form
              className="flex flex-col gap-5"
              onSubmit={(event) => {
                event.preventDefault();
                const form = new FormData(event.currentTarget);
                const parsed = clientSchema.safeParse({
                  id: crypto.randomUUID(),
                  name: form.get("name"),
                  email: form.get("email"),
                  addressLines: String(form.get("address"))
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean),
                  taxId: form.get("taxId"),
                });
                if (!parsed.success) {
                  setError(
                    parsed.error.issues[0]?.message ?? "Check client details.",
                  );
                  return;
                }
                onAdd(parsed.data);
                setOpen(false);
              }}
            >
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
                <DialogDescription>
                  Add billing details for this invoice.
                </DialogDescription>
              </DialogHeader>
              <FieldGroup className="gap-4">
                <Field>
                  <FieldLabel htmlFor="client-name">Client name</FieldLabel>
                  <Input
                    id="client-name"
                    name="name"
                    required
                    maxLength={300}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="client-email">Email</FieldLabel>
                  <Input
                    id="client-email"
                    name="email"
                    type="email"
                    required
                    maxLength={300}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="client-address">
                    Billing address
                  </FieldLabel>
                  <Textarea
                    id="client-address"
                    name="address"
                    placeholder="One address line per row"
                    maxLength={1500}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="client-tax">Tax ID</FieldLabel>
                  <Input id="client-tax" name="taxId" maxLength={300} />
                </Field>
              </FieldGroup>
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Client</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Field className="gap-1">
        <FieldLabel htmlFor="invoice-client">Client</FieldLabel>
        <Select
          value={value.id}
          onValueChange={(id) => {
            const client = clients.find((option) => option.id === id);
            if (client) onSelect(client);
          }}
        >
          <SelectTrigger
            id="invoice-client"
            className="w-full data-[size=default]:h-auto"
          >
            <SelectValue>
              <span className="flex min-w-0 items-center gap-2">
                <Avatar>
                  <AvatarFallback>
                    {value.name
                      .split(/\s+/)
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="flex min-w-0 flex-col text-left text-xs">
                  <span className="truncate">{value.name}</span>
                  <span className="truncate text-muted-foreground">
                    {value.email}
                  </span>
                </span>
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="start" alignItemWithTrigger={false}>
            <SelectGroup>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </section>
  );
}
