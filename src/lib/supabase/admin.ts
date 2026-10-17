import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/env";

// Service-role client for Storage; never import from client code
export const supabaseAdmin = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SECRET_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

export const SCANS_BUCKET = "scans";
