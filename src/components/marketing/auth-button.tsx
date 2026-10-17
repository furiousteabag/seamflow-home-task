"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

// Marketing pages stay static; the session is read from the local cookie after load
export function AuthButton() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, session) =>
      setSignedIn(!!session),
    );
    return () => data.subscription.unsubscribe();
  }, []);

  if (signedIn === null) {
    return <span className="h-8 w-24" aria-hidden />;
  }
  return signedIn ? (
    <Link href="/app" className={buttonVariants({ size: "sm" })}>
      Launch app
    </Link>
  ) : (
    <Link href="/login" className={buttonVariants({ size: "sm" })}>
      Sign in
    </Link>
  );
}
