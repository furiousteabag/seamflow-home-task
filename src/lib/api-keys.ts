import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { apiKeys } from "@/db/schema";

export const KEY_PREFIX = "sf_live_";

export const hashKey = (key: string) =>
  createHash("sha256").update(key).digest("hex");

export function generateKey() {
  const key = KEY_PREFIX + randomBytes(24).toString("base64url");
  return {
    key,
    prefix: key.slice(0, KEY_PREFIX.length + 4),
    keyHash: hashKey(key),
  };
}

/** Resolves `Authorization: Bearer sf_live_…` to the owning user, or null. */
export async function authenticateApiKey(request: Request) {
  const header = request.headers.get("authorization") ?? "";
  const key = header.match(/^Bearer\s+(\S+)$/i)?.[1];
  if (!key?.startsWith(KEY_PREFIX)) return null;

  const [row] = await db
    .update(apiKeys)
    .set({ lastUsedAt: new Date() })
    .where(and(eq(apiKeys.keyHash, hashKey(key)), isNull(apiKeys.revokedAt)))
    .returning({ userId: apiKeys.userId });
  return row ?? null;
}
