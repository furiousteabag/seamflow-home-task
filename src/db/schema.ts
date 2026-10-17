import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const itemSource = pgEnum("item_source", ["manual", "ai"]);

export const items = pgTable("items", {
  id: uuid().primaryKey().defaultRandom(),
  title: text().notNull(),
  source: itemSource().notNull().default("manual"),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  // RLS with no policies blocks Supabase's public data API; server uses the owner role
}).enableRLS();

export type Item = typeof items.$inferSelect;
