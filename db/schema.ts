import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const lobbies = sqliteTable(
  "lobbies",
  {
    code: text("code").primaryKey(),
    hostToken: text("host_token").notNull(),
    guestToken: text("guest_token"),
    hostFamilyName: text("host_family_name").notNull(),
    guestFamilyName: text("guest_family_name"),
    familySize: integer("family_size").notNull(),
    difficulty: text("difficulty").notNull(),
    status: text("status").notNull().default("waiting"),
    gameState: text("game_state"),
    pendingAnswer: text("pending_answer"),
    pendingBy: text("pending_by"),
    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at").notNull(),
  },
  (table) => [index("lobbies_updated_at_idx").on(table.updatedAt)],
);
