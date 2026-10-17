import { column, Schema, Table } from "@powersync/web";

// Local SQLite mirror of public.items (id column is implicit)
const items = new Table(
  {
    title: column.text,
    source: column.text,
    user_id: column.text,
    created_at: column.text,
  },
  { indexes: { created: ["created_at"] } },
);

export const AppSchema = new Schema({ items });

export type LocalItem = (typeof AppSchema)["types"]["items"];
