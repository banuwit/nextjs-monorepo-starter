import assert from "node:assert/strict";
import { test } from "node:test";

const baseUrl = "http://localhost:3000";

for (const [path, title, currentPage] of [
  ["/dashboard", "Dashboard", "Main"],
  ["/dashboard/main", "Dashboard", "Main"],
  ["/dashboard/productivity", "Good morning, Arham.", "Productivity"],
  ["/user", "User", "User"],
]) {
  test(`${path} renders one shared header and breadcrumb before the title`, async () => {
    const response = await fetch(new URL(path, baseUrl));
    assert.equal(response.status, 200);

    const html = await response.text();
    assert.equal(html.match(/data-slot="app-body"/g)?.length, 1);
    const headers = [...html.matchAll(/<header\b[^>]*>/g)];
    assert.equal(headers.length, 1);
    assert.match(html, /<header\b[^>]*>[\s\S]*?data-slot="sidebar-trigger"/);

    const breadcrumb = html.indexOf('aria-label="breadcrumb"');
    const page = html.indexOf(`>${currentPage}</span>`, breadcrumb);
    const heading = html.indexOf(`<h1`, page);

    assert.ok(breadcrumb > headers[0].index);
    assert.ok(page > breadcrumb);
    assert.ok(heading > page);
    assert.match(
      html.slice(heading),
      new RegExp(`^<h1[^>]*>${title.replaceAll(".", "\\.")}</h1>`),
    );
  });
}

test("dashboard date control sits beside the page title", async () => {
  const response = await fetch(new URL("/dashboard/main", baseUrl));
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /data-slot="page-heading-content"[^>]*class="[^"]*justify-between[^"]*"[^>]*>[\s\S]*?<h1[^>]*>Dashboard<\/h1>[\s\S]*?<input[^>]*type="date"[^>]*aria-label="Filter dashboard by date"/,
  );
});

test("account menu appears after the theme toggle in the header", async () => {
  const response = await fetch(new URL("/user", baseUrl));
  assert.equal(response.status, 200);

  const html = await response.text();
  const header = html.match(/<header\b[^>]*>([\s\S]*?)<\/header>/)?.[1];
  assert.ok(header);

  const themeToggle = header.indexOf('aria-label="Toggle light and dark mode"');
  const accountMenu = header.indexOf(
    'aria-label="Account menu for Arham Khan"',
  );
  assert.ok(themeToggle >= 0);
  assert.ok(accountMenu > themeToggle);
});

test("account menu shows name initials instead of an avatar image", async () => {
  const response = await fetch(new URL("/dashboard/main", baseUrl));
  assert.equal(response.status, 200);

  const html = await response.text();
  const header = html.match(/<header\b[^>]*>([\s\S]*?)<\/header>/)?.[1];
  assert.ok(header);
  assert.match(header, /data-slot="avatar-fallback"[^>]*>AK<\/span>/);
  assert.doesNotMatch(header, /data-slot="avatar-image"/);
});
