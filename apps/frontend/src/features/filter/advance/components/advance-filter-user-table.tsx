"use client";

import { BracesIcon, HistoryIcon, RotateCcwIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { matchesFilterNode } from "@/components/filter/advanced/filter-query";
import { Filters } from "@/components/reui/filters/filters";
import {
  countFilterRules,
  createFilterQuery,
  createFilterRule,
} from "@/components/reui/filters/filters-query";
import type { FilterQuery } from "@/components/reui/filters/filters-types";
import { Button } from "@/components/ui/button";
import { createUserFilterFields } from "./user-filter-fields";
import { UserProfileGrid } from "./user-profile-grid";
import { readUserProfileField } from "../utils/user-profile-filter";
import type { UserProfile } from "@/mocks/user-profile.mock";

/** What the page opens with: three chips, three editor kinds. */
const seedQuery = () =>
  createFilterQuery<unknown>([
    createFilterRule({
      id: "seed-status",
      path: ["status"],
      operator: "is_any_of",
      value: ["active", "pending"],
    }),
    createFilterRule({
      id: "seed-last-active",
      path: ["lastActive"],
      operator: "between",
      value: [
        { relative: { unit: "day", offset: -29 } },
        { relative: { unit: "day", offset: 0 } },
      ],
    }),
    createFilterRule({
      id: "seed-score",
      path: ["score"],
      operator: "between",
      value: [20, 100],
    }),
  ]);

/**
 * A stored query of bare ids (c-filters-4): the Person chip resolves names
 * through `resolveValues` because no search has loaded them yet.
 */
const savedViewQuery = () =>
  createFilterQuery<unknown>([
    createFilterRule({
      id: "saved-person",
      path: ["person"],
      operator: "is_any_of",
      value: ["USR-001", "USR-004", "USR-009", "USR-016", "USR-025"],
    }),
    createFilterRule({
      id: "saved-two-factor",
      path: ["account", "twoFactor"],
      operator: "is",
      value: true,
    }),
  ]);

export function AdvanceFilterUserTable({ users }: { users: UserProfile[] }) {
  const [query, setQuery] = useState<FilterQuery>(seedQuery);
  const [showQuery, setShowQuery] = useState(false);

  const fields = useMemo(() => createUserFilterFields(users), [users]);

  const rows = useMemo(
    () =>
      users.filter((user) =>
        matchesFilterNode(user, query, readUserProfileField),
      ),
    [users, query],
  );

  const ruleCount = countFilterRules(query);

  return (
    <div className="flex flex-col gap-3">
      <Filters
        fields={fields}
        query={query}
        onQueryChange={setQuery}
        showClear
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p role="status" className="text-sm text-muted-foreground">
          {rows.length} dari {users.length} user cocok
          {ruleCount > 0 ? ` dengan ${ruleCount} aturan` : ""}.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuery(savedViewQuery())}
          >
            <HistoryIcon />
            Restore saved view
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setQuery(seedQuery())}
          >
            <RotateCcwIcon />
            Reset
          </Button>
          <Button
            variant="ghost"
            size="sm"
            aria-expanded={showQuery}
            aria-controls="advance-filter-query"
            onClick={() => setShowQuery((open) => !open)}
          >
            <BracesIcon />
            {showQuery ? "Hide query" : "Show query"}
          </Button>
        </div>
      </div>

      {showQuery && (
        <pre
          id="advance-filter-query"
          className="max-h-72 overflow-auto rounded-lg border bg-muted p-3 text-xs dark:bg-muted/60"
        >
          {JSON.stringify(query, null, 2)}
        </pre>
      )}

      <UserProfileGrid users={users} rows={rows} />
    </div>
  );
}
