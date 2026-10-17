import assert from "node:assert/strict";
import { test } from "node:test";

test("login renders the branded layout with accessible credential fields", async () => {
  const response = await fetch("http://localhost:3000/login");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.equal(html.match(/<h1\b/g)?.length, 1);
  assert.match(html, /Login to your account/);
  assert.match(html, /<aside\b[\s\S]*?Studio Admin/);
  assert.match(html, /<footer\b[\s\S]*?Studio Admin/);
  assert.match(html, /<label[^>]*for="email"[^>]*>Email Address<\/label>/);
  assert.match(html, /<input[^>]*type="email"[^>]*autoComplete="email"/);
  assert.match(html, /<input[^>]*type="password"[^>]*autoComplete="current-password"/);
  assert.doesNotMatch(html, /login-abstract-background/);
});

test("login keeps preview navigation explicit without offering unavailable authentication", async () => {
  const response = await fetch("http://localhost:3000/login");
  const html = await response.text();

  assert.match(html, /<a[^>]*href="\/dashboard"[^>]*>Login<\/a>/);
  assert.match(html, /Pratinjau navigasi: email dan password belum diverifikasi/);
  assert.match(html, /<button[^>]*disabled=""[^>]*aria-describedby="google-login-description"/);
  assert.match(html, /Login Google belum tersedia/);
  assert.match(html, /Hubungi administrator/);
  assert.doesNotMatch(html, /href="[^"]*(register|sign-up)/);
});
