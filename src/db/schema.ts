import {
  index,
  pgEnum,
  pgTable,
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
