import { ensureLobbySchema, getD1 } from "../../../db";

export const dynamic = "force-dynamic";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const SIX_HOURS = 6 * 60 * 60 * 1000;

function json(data: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("cache-control", "no-store");
  return Response.json(data, { ...init, headers });
}

function cleanName(value: unknown, fallback: string): string {
  const name = String(value ?? "").trim().replace(/\s+/g, " ").slice(0, 18);
  return name || fallback;
}

function randomString(length: number, alphabet = CODE_ALPHABET): string {
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return [...bytes].map((value) => alphabet[value % alphabet.length]).join("");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const hostFamilyName = cleanName(body.familyName, "The Home Team");
    const familySize = Math.min(5, Math.max(1, Number(body.familySize) || 3));
    const difficulty = ["easy", "medium", "hard"].includes(String(body.difficulty))
      ? String(body.difficulty)
      : "medium";
    const hostToken = randomString(40, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");
    const now = Date.now();

    await ensureLobbySchema();
    const d1 = getD1();
    await d1.prepare("DELETE FROM lobbies WHERE updated_at < ?").bind(now - SIX_HOURS).run();

    let code = "";
    let created = false;
    for (let attempt = 0; attempt < 6 && !created; attempt += 1) {
      code = randomString(6);
      try {
        await d1.prepare(`INSERT INTO lobbies (
          code, host_token, host_family_name, family_size, difficulty, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, 'waiting', ?, ?)`)
          .bind(code, hostToken, hostFamilyName, familySize, difficulty, now, now)
          .run();
        created = true;
      } catch (error) {
        if (attempt === 5) throw error;
      }
    }

    return json({
      token: hostToken,
      role: "host",
      lobby: {
        code,
        status: "waiting",
        hostFamilyName,
        guestFamilyName: null,
        familySize,
        difficulty,
        gameState: null,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Could not create Family War lobby", error);
    return json({ error: "The lobby could not be created. Please try again." }, { status: 500 });
  }
}
