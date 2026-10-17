import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { env } from "@/env";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a Server Component; proxy.ts refreshes the session instead
          }
        },
      },
    },
  );
}

/** Verified user from the session JWT, or null when signed out. */
export async function getUser() {
  // Supabase reads the clock while loading the session; keep it out of prerendering
  await connection();
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  // Guest sessions from before anonymous sign-in was disabled no longer count
  if (!claims || claims.is_anonymous) return null;

  const meta = (claims.user_metadata ?? {}) as Record<string, unknown>;
  const text = (value: unknown) =>
    typeof value === "string" && value ? value : null;
  return {
    id: claims.sub,
    email: text(claims.email),
    name: text(meta.full_name) ?? text(meta.name),
    avatarUrl: text(meta.avatar_url) ?? text(meta.picture),
  };
}
