import { sql } from "drizzle-orm";
import { connection } from "next/server";
import { db } from "@/db";

export async function GET() {
  await connection();
  const start = performance.now();
  try {
    const [row] = await db.execute<{ version: string }>(sql`select version()`);
    return Response.json({
      ok: true,
      db: row.version,
      latencyMs: Math.round(performance.now() - start),
    });
  } catch (error) {
    return Response.json(
      { ok: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}
