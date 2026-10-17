import { column, Schema, Table } from "@powersync/web";

// Local SQLite mirror of the user's public.scans rows (id column is implicit)
const scans = new Table(
  {
    verdict: column.text,
    confidence: column.real,
    label: column.text,
    reasoning: column.text,
    image_path: column.text,
    thumbnail: column.text,
    model: column.text,
    latency_ms: column.integer,
    channel: column.text,
    feedback: column.text,
    hot_dog_score: column.integer,
    improvements: column.text,
    enhanced_image_path: column.text,
    enhanced_score: column.integer,
    created_at: column.text,
  },
  { indexes: { created: ["created_at"] } },
);

export const AppSchema = new Schema({ scans });

export type LocalScan = (typeof AppSchema)["types"]["scans"] & { id: string };
