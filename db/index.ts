import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

let lobbySchemaReady: Promise<void> | null = null;

export function getD1(): D1Database {
  if (!env.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Set the `d1` field in .openai/hosting.json to `DB` before using private lobbies.",
    );
  }
  return env.DB;
}

export function getDb() {
  return drizzle(getD1(), { schema });
}

export async function ensureLobbySchema(): Promise<void> {
  lobbySchemaReady ??= (async () => {
    const d1 = getD1();
    await d1.batch([
      d1.prepare(`CREATE TABLE IF NOT EXISTS lobbies (
        code TEXT PRIMARY KEY NOT NULL,
        host_token TEXT NOT NULL,
        guest_token TEXT,
        host_family_name TEXT NOT NULL,
        guest_family_name TEXT,
        family_size INTEGER NOT NULL,
        difficulty TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'waiting',
        game_state TEXT,
        pending_answer TEXT,
        pending_by TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )`),
      d1.prepare("CREATE INDEX IF NOT EXISTS lobbies_updated_at_idx ON lobbies (updated_at)"),
    ]);
  })();

  try {
    await lobbySchemaReady;
  } catch (error) {
    lobbySchemaReady = null;
    throw error;
  }
}
