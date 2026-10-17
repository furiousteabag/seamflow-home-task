"use client";

import { Check, Copy, KeyRound, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  type ApiKeyRow,
  createApiKey,
  listApiKeys,
  revokeApiKey,
} from "@/app/app/api-keys/actions";
import { PageHeader } from "@/components/app/app-shell";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, { dateStyle: "medium" })
    : "Never";

export function ApiKeysManager() {
  const [keys, setKeys] = useState<ApiKeyRow[] | null>(null);
  const [name, setName] = useState("");
  const [created, setCreated] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  const refresh = useCallback(
    () =>
      listApiKeys()
        .then(setKeys)
        .catch(() => toast.error("API keys need a network connection")),
    [],
  );
  useEffect(() => {
    refresh();
  }, [refresh]);

  const onCreate = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await createApiKey(name);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      setCreated(result.key);
      setCopied(false);
      setName("");
      refresh();
    });
  };

  const onRevoke = (id: string) =>
    startTransition(async () => {
      await revokeApiKey(id);
      toast.success("Key revoked");
      refresh();
    });

  const copy = async () => {
    if (!created) return;
    await navigator.clipboard.writeText(created);
    setCopied(true);
  };

  return (
    <>
      <PageHeader
        title="API keys"
        description="Authenticate server-to-server requests to the SeeFood REST API."
        actions={
          <Link
            href="/docs"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Read the docs
          </Link>
        }
      />

      {created && (
        <Card className="mb-6 border-emerald-200 bg-emerald-50/50">
          <CardHeader>
            <CardTitle className="text-base">Copy your new key now</CardTitle>
            <CardDescription>
              For security it won't be shown again. Store it in your secrets
              manager.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <code className="flex-1 truncate rounded-md border bg-background px-3 py-2 font-mono text-sm">
              {created}
            </code>
            <Button variant="outline" onClick={copy}>
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Create a key</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onCreate} className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Key name, e.g. Production backend"
              maxLength={60}
            />
            <Button type="submit" disabled={pending || !name.trim()}>
              <Plus className="size-4" /> Create key
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6 overflow-hidden py-0">
        {keys === null ? (
          <div className="flex justify-center p-10">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : keys.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-10 text-center text-sm text-muted-foreground">
            <KeyRound className="size-5" />
            No active keys.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Key</th>
                <th className="hidden px-4 py-2 font-medium sm:table-cell">
                  Created
                </th>
                <th className="hidden px-4 py-2 font-medium sm:table-cell">
                  Last used
                </th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {keys.map((k) => (
                <tr key={k.id}>
                  <td className="px-4 py-2 font-medium">{k.name}</td>
                  <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                    {k.prefix}…
                  </td>
                  <td className="hidden px-4 py-2 text-muted-foreground sm:table-cell">
                    {formatDate(k.createdAt)}
                  </td>
                  <td className="hidden px-4 py-2 text-muted-foreground sm:table-cell">
                    {formatDate(k.lastUsedAt)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600"
                      disabled={pending}
                      onClick={() => onRevoke(k.id)}
                    >
                      Revoke
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </>
  );
}
