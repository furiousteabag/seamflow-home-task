import { Suspense } from "react";
import { signInWithGoogle } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Seamflow</CardTitle>
          <CardDescription>
            Sign in to sync your items across devices. Works offline once
            loaded.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <form action={signInWithGoogle}>
            <Button type="submit" className="w-full">
              Continue with Google
            </Button>
          </form>
          <Suspense>
            <LoginError searchParams={searchParams} />
          </Suspense>
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
