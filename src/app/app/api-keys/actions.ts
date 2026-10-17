"use server";

import { and, desc, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { apiKeys } from "@/db/schema";
import { generateKey } from "@/lib/api-keys";
import { getUser } from "@/lib/supabase/server";

export type ApiKeyRow = {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsedAt: string | null;
};

async function requireUser() {
  const user = await getUser();
  if (!user) throw new Error("Not signed in");
  return user;
}

export async function listApiKeys(): Promise<ApiKeyRow[]> {
  const user = await requireUser();
  const rows = await db
    .select()
    .from(apiKeys)
    .where(and(eq(apiKeys.userId, user.id), isNull(apiKeys.revokedAt)))
    .orderBy(desc(apiKeys.createdAt));
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    prefix: r.prefix,
    createdAt: r.createdAt.toISOString(),
    lastUsedAt: r.lastUsedAt?.toISOString() ?? null,
  }));
}

/** Returns the plaintext key exactly once; only its hash is stored. */
export async function createApiKey(name: string) {
  const user = await requireUser();
  const parsed = z.string().trim().min(1).max(60).safeParse(name);
  if (!parsed.success)
    return { error: "Name must be 1–60 characters" } as const;

  const active = await listApiKeys();
  if (active.length >= 10)
    return { error: "Limit of 10 active keys reached" } as const;

  const { key, prefix, keyHash } = generateKey();
  await db
    .insert(apiKeys)
    .values({ userId: user.id, name: parsed.data, prefix, keyHash });
  return { key } as const;
}

export async function revokeApiKey(id: string) {
  const user = await requireUser();
  await db
    .update(apiKeys)
    .set({ revokedAt: new Date() })
    .where(and(eq(apiKeys.id, id), eq(apiKeys.userId, user.id)));
}
