import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("private lobbies use durable D1 state and authenticated devices", async () => {
  const [hosting, wrangler, database, createRoute, lobbyRoute] = await Promise.all([
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
    readFile(new URL("../wrangler.jsonc", import.meta.url), "utf8"),
    readFile(new URL("../db/schema.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/lobbies/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/lobbies/[code]/route.ts", import.meta.url), "utf8"),
  ]);

  assert.match(hosting, /"d1"\s*:\s*"DB"/);
  assert.match(wrangler, /"binding"\s*:\s*"DB"/);
  assert.match(database, /sqliteTable\(\s*"lobbies"/);
  assert.match(createRoute, /INSERT INTO lobbies/);
  assert.match(lobbyRoute, /action === "join"/);
  assert.match(lobbyRoute, /action === "start"/);
  assert.match(lobbyRoute, /action === "answer"/);
  assert.match(lobbyRoute, /action === "consume"/);
  assert.match(lobbyRoute, /token !== row\.host_token && token !== row\.guest_token/);
  assert.match(lobbyRoute, /pending_answer IS NULL/);
});

test("the menu and waiting room expose the complete online flow", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

  assert.match(page, /Private Lobby/);
  assert.match(page, /Create private lobby/i);
  assert.match(page, /Join lobby/i);
  assert.match(page, /data-testid="lobby-code"/);
  assert.match(page, /startPrivateLobby/);
  assert.match(page, /sendOnlineAnswer/);
  assert.match(page, /beginOnlineGame/);
});
