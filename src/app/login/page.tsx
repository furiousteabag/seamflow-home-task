import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { signInWithGoogle } from "@/app/auth/actions";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
            Use your Google account. Your scans, history and API keys stay in
            your private workspace.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Suspense>
            <RedirectIfSignedIn />
          </Suspense>
          <form action={signInWithGoogle}>
            <Button type="submit" className="w-full">
              <GoogleIcon /> Continue with Google
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

// Already signed in: skip the sign-in screen
async function RedirectIfSignedIn() {
  if (await getUser()) redirect("/app");
  return null;
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M21.8 10H12v4h5.6c-.8 2.4-3 4-5.6 4a6 6 0 1 1 3.9-10.6l2.9-2.8A10 10 0 1 0 22 12c0-.7 0-1.4-.2-2Z"
      />
      <path
        fill="#FF3D00"
        d="m3.2 7.3 3.3 2.4A6 6 0 0 1 15.9 7.4l2.9-2.8A10 10 0 0 0 3.2 7.3Z"
      />
      <path
        fill="#4CAF50"
        d="M12 22c2.6 0 4.9-1 6.7-2.6l-3.1-2.6A6 6 0 0 1 6.5 14l-3.3 2.5A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#1976D2"
        d="M21.8 10H12v4h5.6a6 6 0 0 1-2 2.8l3.1 2.6C18.5 19.6 22 17 22 12c0-.7 0-1.4-.2-2Z"
      />
    </svg>
  );
}
