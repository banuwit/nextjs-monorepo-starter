import assert from "node:assert/strict";
import { test } from "node:test";
import {
  applyCrudChange,
  parseCrudStorage,
  getMockMenuItems,
} from "../src/mocks/crud-model.ts";

const timestamp = "2026-10-16T00:00:00.000Z";
const base = { createdAt: timestamp, updatedAt: timestamp };
const country = { ...base, id: "id", code: "ID", name: "Indonesia" };
const province = {
  ...base,
  id: "jb",
  code: "JB",
  name: "Jawa Barat",
  countryId: "id",
};
const city = {
  ...base,
  id: "bdg",
  code: "BDG",
  name: "Bandung",
  provinceId: "jb",
};
const user = {
  ...base,
  id: "self",
  name: "Admin",
  email: "admin@example.com",
  role: "admin",
  status: "active",
};
const menu = {
  ...base,
  id: "master",
  title: "Master",
  path: "/countries",
  icon: "Globe",
  parentId: "",
  sortOrder: 0,
  isActive: true,
  role: "all",
};
const parameter = {
  ...base,
  id: "limit",
  key: "page_size",
  value: "10",
  description: "Page size",
  type: "number",
  isActive: true,
};
const fixture = () => ({
  users: [user],
  countries: [country],
  provinces: [province],
  cities: [city],
  menus: [menu],
  parameters: [parameter],
});
const save = (resource, record, isNew = false) => ({
  type: "save",
  resource,
  record,
  isNew,
});
const remove = (resource, id) => ({ type: "delete", resource, id });

test("navigation sorts menu siblings and excludes inactive or unauthorized branches", () => {
  const menus = [
    menu,
    {
      ...menu,
      id: "child",
      title: "Child",
      parentId: "master",
      path: "/cities",
    },
    { ...menu, id: "hidden", title: "Hidden", isActive: false },
    { ...menu, id: "hidden-child", parentId: "hidden" },
    { ...menu, id: "viewer", title: "Viewer", role: "viewer" },
  ];
  assert.deepEqual(getMockMenuItems(menus, "admin"), [
    { title: "Master", url: "/countries" },
    { title: "Master / Child", url: "/cities" },
  ]);
});

test("CRUD creates, updates and deletes without changing unrelated resources", () => {
  const original = fixture();
  const created = applyCrudChange(
    original,
    save(
      "countries",
      { ...country, id: "sg", code: "sg", name: " Singapore " },
      true,
    ),
  );
  assert.equal(created.countries[1].name, "Singapore");
  assert.equal(created.countries[1].code, "SG");
  const edited = applyCrudChange(
    created,
    save("countries", { ...created.countries[1], name: "Singapura" }),
  );
  assert.equal(edited.countries[1].name, "Singapura");
  assert.deepEqual(
    applyCrudChange(edited, remove("countries", "sg")).countries,
    [country],
  );
  assert.deepEqual(original.countries, [country]);
  assert.deepEqual(edited.provinces, [province]);
});

test("geography rejects duplicate codes, missing parents and deletion of referenced parents", () => {
  assert.throws(
    () =>
      applyCrudChange(
        fixture(),
        save("countries", { ...country, id: "other", code: "id" }, true),
      ),
    /sudah digunakan/,
  );
  assert.throws(
    () =>
      applyCrudChange(
        fixture(),
        save("provinces", { ...province, countryId: "missing" }),
      ),
    /Country/,
  );
  assert.throws(
    () =>
      applyCrudChange(
        fixture(),
        save("cities", { ...city, provinceId: "missing" }),
      ),
    /Province/,
  );
  assert.throws(
    () => applyCrudChange(fixture(), remove("countries", "id")),
    /digunakan/,
  );
  assert.throws(
    () => applyCrudChange(fixture(), remove("provinces", "jb")),
    /digunakan/,
  );
});

test("stale edits cannot resurrect deleted records", () => {
  const state = { ...fixture(), countries: [], provinces: [], cities: [] };
  assert.throws(
    () => applyCrudChange(state, save("countries", country)),
    /tidak ditemukan/,
  );
});

test("stale edits cannot overwrite changes saved from another tab", () => {
  const changed = {
    ...fixture(),
    countries: [
      { ...country, name: "Updated", updatedAt: "2026-10-16T01:00:00.000Z" },
    ],
  };
  assert.throws(
    () =>
      applyCrudChange(changed, {
        ...save("countries", { ...country, code: "INA" }),
        expectedUpdatedAt: country.updatedAt,
      }),
    /berubah/,
  );
  assert.equal(changed.countries[0].name, "Updated");
});

test("users validate email uniqueness and protect self and the last active admin", () => {
  assert.throws(
    () =>
      applyCrudChange(fixture(), save("users", { ...user, id: "other" }, true)),
    /sudah digunakan/,
  );
  assert.throws(
    () => applyCrudChange(fixture(), remove("users", "self"), "self"),
    /sendiri/,
  );
  assert.throws(
    () => applyCrudChange(fixture(), remove("users", "self")),
    /admin aktif terakhir/,
  );
  assert.throws(
    () =>
      applyCrudChange(
        fixture(),
        save("users", { ...user, status: "inactive" }),
      ),
    /admin aktif terakhir/,
  );
  assert.throws(() =>
    applyCrudChange(fixture(), save("users", { ...user, email: "invalid" })),
  );
});

test("menus reject external paths, hierarchy cycles and deletion of parents", () => {
  const state = {
    ...fixture(),
    menus: [menu, { ...menu, id: "child", parentId: "master" }],
  };
  assert.throws(
    () => applyCrudChange(state, save("menus", { ...menu, parentId: "child" })),
    /hierarki/,
  );
  assert.throws(
    () => applyCrudChange(state, remove("menus", "master")),
    /digunakan/,
  );
  for (const path of [
    "https://example.com",
    "//example.com",
    "/\\example.com",
    "javascript:alert(1)",
  ]) {
    assert.throws(() =>
      applyCrudChange(state, save("menus", { ...menu, path })),
    );
  }
});

test("parameters validate typed values and unique keys", () => {
  for (const patch of [
    { value: "NaN" },
    { type: "boolean", value: "yes" },
    { type: "json", value: "{" },
  ]) {
    assert.throws(() =>
      applyCrudChange(
        fixture(),
        save("parameters", { ...parameter, ...patch }),
      ),
    );
  }
  assert.throws(
    () =>
      applyCrudChange(
        fixture(),
        save("parameters", { ...parameter, id: "duplicate" }, true),
      ),
    /sudah digunakan/,
  );
  const next = applyCrudChange(
    fixture(),
    save("parameters", {
      ...parameter,
      type: "json",
      value: '{"enabled":true}',
    }),
  );
  assert.equal(next.parameters[0].value, '{"enabled":true}');
});

test("storage roundtrip preserves empty lists and rejects corrupt or incompatible data", () => {
  assert.deepEqual(
    parseCrudStorage(JSON.stringify({ version: 1, data: fixture() })),
    fixture(),
  );
  const empty = Object.fromEntries(
    Object.keys(fixture()).map((key) => [key, []]),
  );
  assert.deepEqual(
    parseCrudStorage(JSON.stringify({ version: 1, data: empty })),
    empty,
  );
  for (const raw of [
    "{",
    '{"version":2,"data":{}}',
    JSON.stringify({ version: 1, data: { ...fixture(), cities: [{}] } }),
    JSON.stringify({
      version: 1,
      data: { ...fixture(), countries: [country, country] },
    }),
  ]) {
    assert.throws(() => parseCrudStorage(raw));
  }
});
