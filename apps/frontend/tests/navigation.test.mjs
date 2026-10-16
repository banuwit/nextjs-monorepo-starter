import assert from "node:assert/strict";
import { test } from "node:test";

const baseUrl = "http://localhost:3000";

test("halaman awal mengarahkan pengunjung ke login", async () => {
  const response = await fetch(baseUrl, { redirect: "manual" });

  assert.equal(response.status, 307);
  assert.equal(new URL(response.headers.get("location"), baseUrl).pathname, "/login");
});

test("halaman login menyediakan tautan langsung ke dashboard", async () => {
  const response = await fetch(baseUrl + "/login");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /<a[^>]*href="\/dashboard"[^>]*>\s*Login\s*<\/a>/);
});

test("halaman dashboard tersedia sebagai tujuan navigasi", async () => {
  const response = await fetch(baseUrl + "/dashboard");

  assert.equal(response.status, 200);
});
