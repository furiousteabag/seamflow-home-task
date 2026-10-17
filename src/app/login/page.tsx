import { ShieldCheck } from "lucide-react";
import { Suspense } from "react";
import { signInAsGuest } from "@/app/auth/actions";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
          {/* Google sign-in (signInWithGoogle) is wired up; enable the provider in Supabase to add it back */}
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
