import assert from "node:assert/strict";
import { test } from "node:test";
import { filterInfrastructure } from "../src/features/infrastructre/infrastructure-model.ts";
import { infrastructureGroups } from "../src/mocks/infrastructure.mock.ts";

test("unfiltered projects include the empty Inbox project", () => {
  assert.deepEqual(
    filterInfrastructure(infrastructureGroups, "", {}),
    infrastructureGroups,
  );
});

test("search matches project, organization and domain, ignoring case and whitespace", () => {
  assert.equal(
    filterInfrastructure(infrastructureGroups, " WEBLABS ", {})[0].name,
    "Admin Console",
  );
  assert.equal(
    filterInfrastructure(infrastructureGroups, "analytics", {})[0].rows.length,
    2,
  );
  const reports = filterInfrastructure(infrastructureGroups, "/reports", {});
  assert.equal(reports.length, 1);
  assert.equal(reports[0].rows.length, 1);
  assert.equal(reports[0].rows[0].platform.name, "Remix");
  assert.equal(
    filterInfrastructure(infrastructureGroups, "inbox", {})[0].rows.length,
    0,
  );
});

test("filters combine across projects and environments without retaining unrelated rows", () => {
  const result = filterInfrastructure(infrastructureGroups, "", {
    organization: "Aiy Cap",
    platform: "React",
    server: "AWS",
    project: "Analytics",
    environment: "Production",
    status: "Online",
  });
  assert.equal(result.length, 1);
  assert.equal(result[0].rows.length, 1);
  assert.equal(result[0].rows[0].platform.name, "React");
  assert.deepEqual(
    filterInfrastructure(infrastructureGroups, "", {
      server: "AWS",
      environment: "Staging",
    }),
    [],
  );
  assert.deepEqual(
    filterInfrastructure(infrastructureGroups, "no-match", {}),
    [],
  );
});

test("empty projects remain for project filters but disappear for environment filters", () => {
  assert.equal(
    filterInfrastructure(infrastructureGroups, "", {
      organization: "Acme Corp",
    }).length,
    1,
  );
  assert.equal(
    filterInfrastructure(infrastructureGroups, "", {
      environment: "Production",
    }).length,
    2,
  );
  assert.equal(
    filterInfrastructure(infrastructureGroups, "", { status: "Unhealthy" })[0]
      .name,
    "Admin Console",
  );
});

test("filtering does not mutate the mock dataset", () => {
  const before = structuredClone(infrastructureGroups);
  filterInfrastructure(infrastructureGroups, "", { platform: "Remix" });
  assert.deepEqual(infrastructureGroups, before);
});
