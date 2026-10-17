import { PowerSyncDatabase } from "@powersync/web";
import { SupabaseConnector } from "./connector";
import { AppSchema } from "./schema";

export const DB_FILENAME = "seefood.db";

let db: PowerSyncDatabase | undefined;
export const connector = new SupabaseConnector();

// Browser-only singleton; the worker is copied to public/@powersync at build time
export function getDB() {
  if (!db) {
    db = new PowerSyncDatabase({
      schema: AppSchema,
      database: {
        dbFilename: DB_FILENAME,
        worker: "/@powersync/worker.js",
        // One worker per tab: a shared worker outlives "clear site data" while any tab is
        // open and then fails every query with "Client has already been closed"
        enableMultiTabs: false,
      },
    });
    db.connect(connector);
  }
  return db;
}

/** Drops the local replica so it can be rebuilt from the server on the next sync. */
export async function resetLocalDatabase() {
  await db?.close().catch(() => {});
  db = undefined;
  await new Promise<void>((resolve) => {
    const request = indexedDB.deleteDatabase(DB_FILENAME);
    request.onsuccess = request.onerror = request.onblocked = () => resolve();
  });
}
