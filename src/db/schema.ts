import {
  index,
  integer,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";

export const itemSource = pgEnum("item_source", ["manual", "ai"]);

export const items = pgTable(
  "items",
  {
    id: uuid().primaryKey().defaultRandom(),
    title: text().notNull(),
    source: itemSource().notNull().default("manual"),
    // Nullable so rows written before auth existed stay valid
    userId: uuid().references(() => authUsers.id, { onDelete: "cascade" }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index().on(t.userId)],
  // RLS with no policies blocks Supabase's public data API; server uses the owner role
).enableRLS();

export type Item = typeof items.$inferSelect;

export const verdict = pgEnum("verdict", ["hot_dog", "not_hot_dog"]);
export const scanFeedback = pgEnum("scan_feedback", ["correct", "incorrect"]);
export const scanChannel = pgEnum("scan_channel", ["web", "api"]);

export const scans = pgTable(
  "scans",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid()
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    verdict: verdict().notNull(),
    confidence: real().notNull(),
    // What the model saw, e.g. "a bratwurst in a bun"
    label: text().notNull(),
    reasoning: text().notNull(),
    imagePath: text().notNull(),
    // Small data-URL preview so history renders offline
    thumbnail: text().notNull(),
    model: text().notNull(),
    latencyMs: integer().notNull(),
    channel: scanChannel().notNull().default("web"),
    feedback: scanFeedback(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index().on(t.userId, t.createdAt)],
).enableRLS();

export const apiKeys = pgTable(
  "api_keys",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid()
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    name: text().notNull(),
    // First chars of the key, shown in the UI to identify it
    prefix: text().notNull(),
    // SHA-256 of the full key; the key itself is shown once and never stored
    keyHash: text().notNull().unique(),
    lastUsedAt: timestamp({ withTimezone: true }),
    revokedAt: timestamp({ withTimezone: true }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index().on(t.userId)],
).enableRLS();

export type Scan = typeof scans.$inferSelect;
export type ApiKey = typeof apiKeys.$inferSelect;
