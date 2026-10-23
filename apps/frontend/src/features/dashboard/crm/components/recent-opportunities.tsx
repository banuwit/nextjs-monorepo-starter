"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
  SearchIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  crmHealth,
  crmOpportunities,
  crmStages,
  type CrmOpportunity,
} from "@/mocks/dashboard-crm.mock";

import { filterCrmOpportunities } from "../utils/crm-data";

const pageSize = 10;
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const stageOptions = [
  { value: "all", label: "All stages" },
  ...crmStages.map((stage) => ({ value: stage, label: stage })),
];
const healthOptions = [
  { value: "all", label: "All health" },
  ...crmHealth.map((health) => ({ value: health, label: health })),
];

function OpportunityEditor({
  opportunity,
  onChange,
  onSave,
}: {
  opportunity: CrmOpportunity;
  onChange: (opportunity: CrmOpportunity) => void;
  onSave: () => void;
}) {
  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        onSave();
      }}
    >
      <SheetHeader>
        <SheetTitle>Edit opportunity</SheetTitle>
        <SheetDescription>
          {opportunity.id} · {opportunity.account}. Changes remain until this
          page is refreshed.
        </SheetDescription>
      </SheetHeader>
      <FieldGroup className="overflow-y-auto px-4">
        <Field>
          <FieldLabel htmlFor="crm-stage">Stage</FieldLabel>
          <Select
            value={opportunity.stage}
            onValueChange={(value) =>
              onChange({
                ...opportunity,
                stage:
                  crmStages.find((stage) => stage === value) ??
                  opportunity.stage,
              })
            }
            items={stageOptions.slice(1)}
          >
            <SelectTrigger id="crm-stage" aria-label="Opportunity stage">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {crmStages.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {stage}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="crm-priority">Priority</FieldLabel>
          <Select
            value={String(opportunity.priority)}
            onValueChange={(value) =>
              onChange({
                ...opportunity,
                priority: Number(value) as CrmOpportunity["priority"],
              })
            }
            items={[1, 2, 3].map((priority) => ({
              value: String(priority),
              label: String(priority),
            }))}
          >
            <SelectTrigger id="crm-priority" aria-label="Opportunity priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[1, 2, 3].map((priority) => (
                  <SelectItem key={priority} value={String(priority)}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="crm-health">Health</FieldLabel>
          <Select
            value={opportunity.health}
            onValueChange={(value) =>
              onChange({
                ...opportunity,
                health:
                  crmHealth.find((health) => health === value) ??
                  opportunity.health,
              })
            }
            items={healthOptions.slice(1)}
          >
            <SelectTrigger id="crm-health" aria-label="Opportunity health">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {crmHealth.map((health) => (
                  <SelectItem key={health} value={health}>
                    {health}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="crm-value">Value (USD)</FieldLabel>
          <Input
            id="crm-value"
            type="number"
            min={0}
            step={100}
            required
            value={opportunity.value}
            onChange={(event) =>
              onChange({ ...opportunity, value: Number(event.target.value) })
            }
          />
        </Field>
      </FieldGroup>
      <SheetFooter>
        <Button type="submit">Save changes</Button>
      </SheetFooter>
    </form>
  );
}

export function RecentOpportunities() {
  const [opportunities, setOpportunities] =
    useState<CrmOpportunity[]>(crmOpportunities);
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("all");
  const [health, setHealth] = useState("all");
  const [pageIndex, setPageIndex] = useState(0);
  const [editing, setEditing] = useState<CrmOpportunity | null>(null);

  const filtered = useMemo(
    () => filterCrmOpportunities(opportunities, { query, stage, health }),
    [opportunities, query, stage, health],
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(pageIndex, pageCount - 1);
  const visible = filtered.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize,
  );

  function updateFilters(next: {
    query?: string;
    stage?: string;
    health?: string;
  }) {
    if (next.query !== undefined) setQuery(next.query);
    if (next.stage !== undefined) setStage(next.stage);
    if (next.health !== undefined) setHealth(next.health);
    setPageIndex(0);
  }

  return (
    <>
      <Card id="recent-opportunities" className="min-w-0 shadow-xs">
        <CardHeader>
          <CardTitle>Recent Opportunities</CardTitle>
          <CardDescription>
            Track qualified leads moving through discovery, proposal, and
            closing stages.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <div className="relative min-w-48 flex-1 sm:max-w-72">
              <SearchIcon
                className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                aria-label="Search deals"
                placeholder="Search deals..."
                className="pl-8"
                value={query}
                onChange={(event) =>
                  updateFilters({ query: event.target.value })
                }
              />
            </div>
            <Select
              value={stage}
              onValueChange={(value) =>
                updateFilters({ stage: value ?? "all" })
              }
              items={stageOptions}
            >
              <SelectTrigger
                size="sm"
                aria-label="Filter by stage"
                className="w-38"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {stageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              value={health}
              onValueChange={(value) =>
                updateFilters({ health: value ?? "all" })
              }
              items={healthOptions}
            >
              <SelectTrigger
                size="sm"
                aria-label="Filter by health"
                className="w-36"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {healthOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Health</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((opportunity) => (
                <TableRow key={opportunity.id}>
                  <TableCell className="font-medium tabular-nums">
                    {opportunity.id}
                  </TableCell>
                  <TableCell className="font-medium">
                    {opportunity.account}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{opportunity.stage}</Badge>
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {opportunity.priority}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        opportunity.health === "At Risk"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {opportunity.health}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium tabular-nums">
                    {currency.format(opportunity.value)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Edit ${opportunity.account}`}
                      onClick={() => setEditing({ ...opportunity })}
                    >
                      <PencilIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
            <span>
              Viewing {visible.length} out of {filtered.length} opportunities
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Previous page"
                disabled={currentPage === 0}
                onClick={() => {
                  setPageIndex(currentPage - 1);
                }}
              >
                <ChevronLeftIcon />
              </Button>
              <span className="whitespace-nowrap">
                Page {currentPage + 1} of {pageCount}
              </span>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Next page"
                disabled={currentPage === pageCount - 1}
                onClick={() => {
                  setPageIndex(currentPage + 1);
                }}
              >
                <ChevronRightIcon />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Sheet
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
      >
        <SheetContent className="w-full sm:max-w-sm">
          {editing && (
            <OpportunityEditor
              opportunity={editing}
              onChange={setEditing}
              onSave={() => {
                setOpportunities((current) =>
                  current.map((opportunity) =>
                    opportunity.id === editing.id ? editing : opportunity,
                  ),
                );
                setEditing(null);
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
