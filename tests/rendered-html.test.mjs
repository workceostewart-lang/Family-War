import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Family War menu", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Family War — Own the Board<\/title>/i);
  assert.match(html, /Family game night, upgraded/i);
  assert.match(html, /Play now/i);
  assert.match(html, /How to play/i);
  assert.doesNotMatch(html, /Your site is taking shape|codex-preview|react-loading-skeleton/i);
});

test("keeps the mobile gameplay visibility contract in source", async () => {
  const [page, css, packageJson, agentGuide] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../.agent", import.meta.url), "utf8"),
  ]);

  assert.match(page, /data-testid="question"/);
  assert.match(page, /data-testid="answer-board"/);
  assert.match(page, /data-testid="strikes"/);
  assert.match(page, /speechSynthesis/);
  assert.match(page, /maxLength=\{32\}/);
  assert.match(css, /height:\s*100svh/);
  assert.match(css, /@media \(max-width:\s*520px\)/);
  assert.match(css, /grid-template-rows:\s*repeat\(3/);
  assert.match(agentGuide, /must fit inside the visible viewport/i);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
