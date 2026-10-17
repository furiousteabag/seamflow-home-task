import type {
  AbstractPowerSyncDatabase,
  PowerSyncBackendConnector,
} from "@powersync/web";
import { createClient } from "@/lib/supabase/client";
import type { CrudOp } from "@/lib/upload";

export class SupabaseConnector implements PowerSyncBackendConnector {
  private supabase = createClient();

  async fetchCredentials() {
    const { data } = await this.supabase.auth.getSession();
    const session = data.session;
    if (!session) return null;
    return {
      // biome-ignore lint/style/noNonNullAssertion: public env inlined at build
      endpoint: process.env.NEXT_PUBLIC_POWERSYNC_URL!,
      token: session.access_token,
      expiresAt: session.expires_at
        ? new Date(session.expires_at * 1000)
        : undefined,
    };
  }

  async uploadData(database: AbstractPowerSyncDatabase) {
    const transaction = await database.getNextCrudTransaction();
    if (!transaction) return;

    const ops: CrudOp[] = transaction.crud.map((entry) => ({
      op: entry.op,
      table: entry.table as CrudOp["table"],
      id: entry.id,
      data: entry.opData,
    }));

    const response = await fetch("/api/powersync/upload", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ops }),
    });

    if (response.ok) {
      await transaction.complete();
      return;
    }
    // A rejected batch would block the queue forever, so drop it; retry everything else
    if (response.status === 400 || response.status === 403) {
      console.error("Upload rejected, discarding", await response.text());
      await transaction.complete();
      return;
    }
    throw new Error(`Upload failed with ${response.status}`);
  }
}
