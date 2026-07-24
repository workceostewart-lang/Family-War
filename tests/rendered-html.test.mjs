import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";

async function render(t) {
  const port = 18_000 + (process.pid % 10_000);
  const projectRoot = fileURLToPath(new URL("..", import.meta.url));
  const wrangler = fileURLToPath(new URL("../node_modules/wrangler/bin/wrangler.js", import.meta.url));
  const child = spawn(
    process.execPath,
    [wrangler, "dev", "--config", "dist/server/wrangler.json", "--ip", "127.0.0.1", "--port", String(port)],
    { cwd: projectRoot, env: { ...process.env, WRANGLER_LOG_PATH: ".wrangler/test.log" } },
  );
  let output = "";
  child.stdout.on("data", (chunk) => { output += chunk; });
  child.stderr.on("data", (chunk) => { output += chunk; });
  t.after(() => child.kill("SIGTERM"));

  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/`, { headers: { accept: "text/html" } });
      if (response.ok) return { response, baseUrl: `http://127.0.0.1:${port}` };
    } catch {
      // Wrangler is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error(`The built Worker did not start.\n${output}`);
}

test("server-renders the menu and runs the cross-device lobby protocol", async (t) => {
  const { response, baseUrl } = await render(t);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Family War — Own the Board<\/title>/i);
  assert.match(html, /Family game night, upgraded/i);
  assert.match(html, /Play now/i);
  assert.match(html, /How to play/i);
  assert.doesNotMatch(html, /Your site is taking shape|codex-preview|react-loading-skeleton/i);

  const createdResponse = await fetch(`${baseUrl}/api/lobbies`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ familyName: "The Testers", familySize: 3, difficulty: "medium" }),
  });
  assert.equal(createdResponse.status, 201);
  const created = await createdResponse.json();
  assert.match(created.lobby.code, /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/);

  const unauthorized = await fetch(`${baseUrl}/api/lobbies/${created.lobby.code}`);
  assert.equal(unauthorized.status, 403);

  const joinedResponse = await fetch(`${baseUrl}/api/lobbies/${created.lobby.code}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ action: "join", familyName: "The Challengers" }),
  });
  assert.equal(joinedResponse.status, 200);
  const joined = await joinedResponse.json();

  const startedResponse = await fetch(`${baseUrl}/api/lobbies/${created.lobby.code}`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${created.token}` },
    body: JSON.stringify({ action: "start" }),
  });
  assert.equal(startedResponse.status, 200);

  const sharedState = { roundIndex: 0, round: { revealed: [], strikes: 0, control: 0, stealing: false, bank: 0 }, scores: [0, 0] };
  const syncedResponse = await fetch(`${baseUrl}/api/lobbies/${created.lobby.code}`, {
    method: "PATCH",
    headers: { "content-type": "application/json", authorization: `Bearer ${created.token}` },
    body: JSON.stringify({ gameState: sharedState }),
  });
  assert.equal(syncedResponse.status, 200);

  const guestView = await fetch(`${baseUrl}/api/lobbies/${created.lobby.code}`, {
    headers: { authorization: `Bearer ${joined.token}` },
  }).then((result) => result.json());
  assert.deepEqual(guestView.lobby.gameState.scores, [0, 0]);

  const answerResponse = await fetch(`${baseUrl}/api/lobbies/${created.lobby.code}`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${joined.token}` },
    body: JSON.stringify({ action: "answer", answer: "toilet paper" }),
  });
  assert.equal(answerResponse.status, 200);

  const hostView = await fetch(`${baseUrl}/api/lobbies/${created.lobby.code}`, {
    headers: { authorization: `Bearer ${created.token}` },
  }).then((result) => result.json());
  assert.equal(hostView.lobby.guestFamilyName, "The Challengers");
  assert.equal(hostView.lobby.pendingAnswer, "toilet paper");

  const consumedResponse = await fetch(`${baseUrl}/api/lobbies/${created.lobby.code}`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${created.token}` },
    body: JSON.stringify({ action: "consume" }),
  });
  assert.equal(consumedResponse.status, 200);
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
  assert.match(page, /data-testid="round-timer"/);
  assert.match(page, /data-testid="bonus-timer"/);
  assert.match(page, /data-testid="bonus-reveal-board"/);
  assert.match(page, /"bonus-reveal"/);
  assert.match(page, /SURVEY BOARD REVEAL/);
  assert.match(page, /getUnrevealedAnswerIndexes/);
  assert.match(page, /full five-board answer reveal/i);
  assert.match(page, /ROUND_TIME_LIMIT = 60/);
  assert.match(page, /BONUS_TIME_LIMIT = 40/);
  assert.match(page, /pickQuestionIds/);
  assert.match(page, /speechSynthesis/);
  assert.match(page, /maxLength=\{32\}/);
  assert.match(css, /height:\s*100svh/);
  assert.match(css, /@media \(max-width:\s*520px\)/);
  assert.match(css, /grid-template-rows:\s*repeat\(3/);
  assert.match(agentGuide, /must fit inside the visible viewport/i);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
