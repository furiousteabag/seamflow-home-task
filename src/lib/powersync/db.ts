import { PowerSyncDatabase } from "@powersync/web";
import { SupabaseConnector } from "./connector";
import { AppSchema } from "./schema";

let db: PowerSyncDatabase | undefined;
export const connector = new SupabaseConnector();

// Browser-only singleton; workers are copied to public/@powersync on install
export function getDB() {
  if (!db) {
    db = new PowerSyncDatabase({
      schema: AppSchema,
      database: { dbFilename: "seamflow.db", worker: "/@powersync/worker.js" },
      sync: { worker: "/@powersync/worker.js" },
    });
    db.connect(connector);
  }
  return db;
}
