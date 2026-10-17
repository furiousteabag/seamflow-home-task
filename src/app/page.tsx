import { Suspense } from "react";
import { ItemForm } from "@/components/item-form";
import { ItemList } from "@/components/item-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Seamflow</CardTitle>
          <CardDescription>
            Items are stored in Supabase Postgres. AI suggestions come from
            Claude.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <ItemForm />
          <Suspense fallback={<ListSkeleton />}>
            <ItemList />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-3 py-3">
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-4/5" />
      <Skeleton className="h-6 w-3/5" />
    </div>
  );
}
