import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { signInAsGuest, signInWithGoogle } from "@/app/auth/actions";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { env } from "@/env";
import { getUser } from "@/lib/supabase/server";

export const metadata = { title: "Sign in" };

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-gradient-to-b from-primary/5 to-background px-4">
      <Logo />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign in to SeeFood</CardTitle>
          <CardDescription>
            Start with a private guest workspace. Your scans, history and API
            keys stay in it.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Suspense>
            <RedirectIfSignedIn />
            <GoogleSignIn />
          </Suspense>
          <form action={signInAsGuest}>
            <Button type="submit" className="w-full">
              Continue as guest
            </Button>
          </form>
          <Button
            variant="outline"
            className="w-full"
            disabled
            title="Available on the Enterprise plan"
          >
            Single sign-on (SAML)
          </Button>
          <Suspense>
            <LoginError searchParams={searchParams} />
          </Suspense>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5" /> Images are stored privately and
            only visible to you.
          </p>
          <p className="text-xs text-muted-foreground">
            By continuing you agree to the{" "}
            <Link href="/terms" className="underline underline-offset-2">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

async function LoginError({
  searchParams,
}: {
  searchParams: PageProps<"/login">["searchParams"];
}) {
  const { error } = await searchParams;
  if (!error) return null;
  return <p className="text-sm text-destructive">{String(error)}</p>;
}

// Appears as soon as the Google provider is enabled in Supabase, no redeploy needed
async function GoogleSignIn() {
  const enabled = await fetch(
    `${env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/settings`,
    {
      headers: { apikey: env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY },
    },
  )
    .then((r) => r.json())
    .then((s) => s.external?.google === true)
    .catch(() => false);
  if (!enabled) return null;

  return (
    <form action={signInWithGoogle}>
      <Button type="submit" variant="outline" className="w-full">
        Continue with Google
      </Button>
    </form>
  );
}

// Already signed in: skip the sign-in screen
async function RedirectIfSignedIn() {
  if (await getUser()) redirect("/app");
  return null;
}
