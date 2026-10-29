"use client";

import { BracesIcon, Layers2Icon, RotateCcwIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { matchesFilterNode } from "@/components/filter/advanced/filter-query";
import { FilterBuilder } from "@/components/filter/group/filter-builder";
import { FilterExpression } from "@/components/filter/group/filter-expression";
import {
  createReachCounter,
  withTermReach,
} from "@/components/filter/group/term-reach";
import {
  countFilterRules,
  createFilterGroup,
  createFilterQuery,
  createFilterRule,
} from "@/components/reui/filters/filters-query";
import type { FilterQuery } from "@/components/reui/filters/filters-types";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { createUserFilterFields } from "./user-filter-fields";
import { UserProfileGrid } from "./user-profile-grid";
import {
  formatRupiah,
  readUserProfileField,
} from "../utils/user-profile-filter";
import type { UserProfile } from "@/mocks/user-profile.mock";

type BuilderMode = "popover" | "inline";

/** Opens with an OR group between two AND rules (c-filters-10/11). */
const SEED: FilterQuery = createFilterQuery<unknown>(
  [
    createFilterRule({
      id: "seed-status",
      path: ["status"],
      operator: "is_any_of",
      value: ["active", "pending"],
    }),
    createFilterGroup<unknown>({
      id: "seed-group",
      combinator: "or",
      rules: [
        createFilterRule({
          id: "seed-score",
          path: ["score"],
          operator: "between",
          value: [60, 100],
        }),
        createFilterRule({
          id: "seed-department",
          path: ["organization", "department"],
          operator: "is_any_of",
          value: ["engineering", "product"],
        }),
      ],
    }),
    createFilterRule({
      id: "seed-two-factor",
      path: ["account", "twoFactor"],
      operator: "is",
      value: true,
    }),
  ],
  "and",
);

/** A group nested two deep, loaded by "Nest two levels" (c-filters-11). */
const DEEP: FilterQuery = createFilterQuery<unknown>(
  [
    createFilterRule({
      id: "deep-level",
      path: ["level"],
      operator: "is_any_of",
      value: ["senior", "lead", "principal"],
    }),
    createFilterGroup<unknown>({
      id: "deep-outer",
      combinator: "or",
      rules: [
        createFilterRule({
          id: "deep-status",
          path: ["status"],
          operator: "is",
          value: ["inactive"],
        }),
        createFilterGroup<unknown>({
          id: "deep-inner",
          combinator: "and",
          rules: [
            createFilterRule({
              id: "deep-experience",
              path: ["experienceYears"],
              operator: "gte",
              value: 8,
            }),
            createFilterRule({
              id: "deep-domain",
              path: ["account", "emailDomain"],
              operator: "is",
              value: "acme.co.id",
            }),
          ],
        }),
      ],
    }),
  ],
  "and",
);

export function GroupFilterUserTable({ users }: { users: UserProfile[] }) {
  const [query, setQuery] = useState<FilterQuery>(SEED);
  const [mode, setMode] = useState<BuilderMode>("popover");
  const [showQuery, setShowQuery] = useState(false);

  const fields = useMemo(
    () =>
      withTermReach(
        createUserFilterFields(users),
        createReachCounter(users, readUserProfileField),
        users.length,
      ),
    [users],
  );

  const rows = useMemo(
    () =>
      users.filter((user) =>
        matchesFilterNode(user, query, readUserProfileField),
      ),
    [users, query],
  );

  const totalSalary = rows.reduce((sum, user) => sum + user.salary, 0);
  const ruleCount = countFilterRules(query);

  const builder = (
    <FilterBuilder
      mode={mode}
      fields={fields}
      query={query}
      onQueryChange={setQuery}
    />
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <ToggleGroup
          variant="outline"
          size="sm"
          spacing={0}
          aria-label="Builder mode"
          value={[mode]}
          onValueChange={(next) => {
            const [picked] = next;
            if (picked === "popover" || picked === "inline") setMode(picked);
          }}
        >
          <ToggleGroupItem value="popover">Popover</ToggleGroupItem>
          <ToggleGroupItem value="inline">Inline</ToggleGroupItem>
        </ToggleGroup>
        {mode === "popover" && builder}
      </div>

      {mode === "inline" && (
        <div className="rounded-lg border p-3">{builder}</div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p role="status" className="text-sm text-muted-foreground">
          {rows.length} dari {users.length} user cocok
          {ruleCount > 0 ? ` dengan ${ruleCount} aturan` : ""} · total gaji{" "}
          {formatRupiah(totalSalary)}/bln.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setQuery(DEEP)}>
            <Layers2Icon />
            Nest two levels
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={query === SEED}
            onClick={() => setQuery(SEED)}
          >
            <RotateCcwIcon />
            Reset
          </Button>
          <Button
            variant="ghost"
            size="sm"
            aria-expanded={showQuery}
            aria-controls="group-filter-query"
            onClick={() => setShowQuery((open) => !open)}
          >
            <BracesIcon />
            {showQuery ? "Hide query" : "Show query"}
          </Button>
        </div>
      </div>

      {showQuery && (
        <div id="group-filter-query" className="flex flex-col gap-2">
          <FilterExpression query={query} fields={fields} />
          <pre className="max-h-72 overflow-auto rounded-lg border bg-muted p-3 text-xs dark:bg-muted/60">
            {JSON.stringify(query, null, 2)}
          </pre>
        </div>
      )}

      <UserProfileGrid users={users} rows={rows} />
    </div>
  );
}
