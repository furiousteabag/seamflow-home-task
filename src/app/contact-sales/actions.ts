"use server";

import { db } from "@/db";
import { salesLeads } from "@/db/schema";
import { leadInput } from "./schema";

export async function submitLead(
  input: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = leadInput.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid form",
    };
  }
  const { website, ...lead } = parsed.data;
  // Honeypot: bots fill the hidden field; pretend it worked
  if (website) return { ok: true };

  try {
    await db.insert(salesLeads).values({
      ...lead,
      jobTitle: lead.jobTitle || null,
      companySize: lead.companySize || null,
      message: lead.message || null,
    });
    return { ok: true };
  } catch (error) {
    console.error("submitLead failed", error);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}
