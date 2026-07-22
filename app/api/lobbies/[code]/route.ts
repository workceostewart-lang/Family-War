import { ensureLobbySchema, getD1 } from "../../../../db";

export const dynamic = "force-dynamic";

type LobbyRow = {
  code: string;
  host_token: string;
  guest_token: string | null;
  host_family_name: string;
  guest_family_name: string | null;
  family_size: number;
  difficulty: string;
  status: string;
  game_state: string | null;
  pending_answer: string | null;
  pending_by: string | null;
  created_at: number;
  updated_at: number;
};

function json(data: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("cache-control", "no-store");
  return Response.json(data, { ...init, headers });
}

function cleanCode(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
}

function cleanName(value: unknown, fallback: string): string {
  const name = String(value ?? "").trim().replace(/\s+/g, " ").slice(0, 18);
  return name || fallback;
}

function bearerToken(request: Request): string {
  const value = request.headers.get("authorization") ?? "";
  return value.startsWith("Bearer ") ? value.slice(7) : "";
}

function parseGameState(value: string | null): unknown {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function publicLobby(row: LobbyRow, includePending = false) {
  return {
    code: row.code,
    status: row.status,
    hostFamilyName: row.host_family_name,
    guestFamilyName: row.guest_family_name,
    familySize: row.family_size,
    difficulty: row.difficulty,
    gameState: parseGameState(row.game_state),
    pendingAnswer: includePending ? row.pending_answer : null,
    pendingBy: includePending ? row.pending_by : null,
    updatedAt: row.updated_at,
  };
}

async function getLobby(code: string): Promise<LobbyRow | null> {
  return getD1().prepare("SELECT * FROM lobbies WHERE code = ?").bind(code).first<LobbyRow>();
}

type RouteContext = { params: Promise<{ code: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    await ensureLobbySchema();
    const { code: rawCode } = await context.params;
    const code = cleanCode(rawCode);
    const row = await getLobby(code);
    if (!row) return json({ error: "Lobby not found." }, { status: 404 });
    const token = bearerToken(request);
    if (token !== row.host_token && token !== row.guest_token) {
      return json({ error: "This device is not part of the lobby." }, { status: 403 });
    }
    return json({ lobby: publicLobby(row, token === row.host_token) });
  } catch (error) {
    console.error("Could not read Family War lobby", error);
    return json({ error: "The lobby could not be loaded." }, { status: 500 });
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    await ensureLobbySchema();
    const { code: rawCode } = await context.params;
    const code = cleanCode(rawCode);
    const body = (await request.json()) as Record<string, unknown>;
    const action = String(body.action ?? "");
    const token = bearerToken(request);
    const row = await getLobby(code);
    if (!row) return json({ error: "Lobby not found." }, { status: 404 });

    if (action === "join") {
      if (row.status !== "waiting") return json({ error: "This match has already started." }, { status: 409 });
      if (row.guest_token) return json({ error: "This private lobby is already full." }, { status: 409 });
      const guestFamilyName = cleanName(body.familyName, "The Challengers");
      const guestToken = randomToken();
      const now = Date.now();
      const result = await getD1().prepare(`UPDATE lobbies
        SET guest_token = ?, guest_family_name = ?, updated_at = ?
        WHERE code = ? AND guest_token IS NULL AND status = 'waiting'`)
        .bind(guestToken, guestFamilyName, now, code)
        .run();
      if (!result.meta.changes) return json({ error: "Another family joined first." }, { status: 409 });
      const joined = await getLobby(code);
      return json({ token: guestToken, role: "guest", lobby: publicLobby(joined!) });
    }

    if (action === "start") {
      if (token !== row.host_token) return json({ error: "Only the host can start this match." }, { status: 403 });
      if (!row.guest_token || !row.guest_family_name) return json({ error: "Waiting for the challenger family." }, { status: 409 });
      const now = Date.now();
      await getD1().prepare("UPDATE lobbies SET status = 'started', updated_at = ? WHERE code = ?")
        .bind(now, code)
        .run();
      const started = await getLobby(code);
      return json({ lobby: publicLobby(started!, true) });
    }

    if (action === "answer") {
      const role = token === row.host_token ? "host" : token === row.guest_token ? "guest" : null;
      if (!role) return json({ error: "This device is not part of the lobby." }, { status: 403 });
      if (row.status !== "started") return json({ error: "The match has not started." }, { status: 409 });
      const answer = String(body.answer ?? "").trim().slice(0, 32);
      if (!answer) return json({ error: "Enter an answer first." }, { status: 400 });
      const result = await getD1().prepare(`UPDATE lobbies
        SET pending_answer = ?, pending_by = ?, updated_at = ?
        WHERE code = ? AND pending_answer IS NULL AND status = 'started'`)
        .bind(answer, role, Date.now(), code)
        .run();
      if (!result.meta.changes) return json({ error: "An answer is already being judged." }, { status: 409 });
      return json({ accepted: true });
    }

    if (action === "consume") {
      if (token !== row.host_token) return json({ error: "Only the host can judge answers." }, { status: 403 });
      await getD1().prepare("UPDATE lobbies SET pending_answer = NULL, pending_by = NULL, updated_at = ? WHERE code = ?")
        .bind(Date.now(), code)
        .run();
      return json({ consumed: true });
    }

    return json({ error: "Unsupported lobby action." }, { status: 400 });
  } catch (error) {
    console.error("Could not update Family War lobby", error);
    return json({ error: "The lobby could not be updated." }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await ensureLobbySchema();
    const { code: rawCode } = await context.params;
    const code = cleanCode(rawCode);
    const token = bearerToken(request);
    const row = await getLobby(code);
    if (!row) return json({ error: "Lobby not found." }, { status: 404 });
    if (token !== row.host_token) return json({ error: "Only the host can sync the board." }, { status: 403 });
    const body = (await request.json()) as Record<string, unknown>;
    const state = JSON.stringify(body.gameState ?? null);
    if (state.length > 24_000) return json({ error: "Game state is too large." }, { status: 413 });
    await getD1().prepare("UPDATE lobbies SET game_state = ?, updated_at = ? WHERE code = ?")
      .bind(state, Date.now(), code)
      .run();
    return json({ synced: true });
  } catch (error) {
    console.error("Could not sync Family War board", error);
    return json({ error: "The board could not be synchronized." }, { status: 500 });
  }
}

function randomToken(): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = new Uint32Array(40);
  crypto.getRandomValues(bytes);
  return [...bytes].map((value) => alphabet[value % alphabet.length]).join("");
}
