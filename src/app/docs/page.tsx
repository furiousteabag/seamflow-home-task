import Link from "next/link";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "API reference",
  description:
    "Classify images as Hot Dog or Not Hot Dog with the SeeFood REST API.",
};

const errors = [
  [
    "400",
    "missing_image / invalid_body",
    "No `image` field, or the body isn't multipart/form-data",
  ],
  ["401", "invalid_api_key", "Missing, malformed or revoked API key"],
  ["413", "image_too_large", "Image is larger than 5 MB"],
  ["415", "unsupported_type", "File isn't a JPEG, PNG or WebP image"],
  ["429", "rate_limited", "More than 20 scans per minute for this workspace"],
  ["502", "classifier_unavailable", "The vision model failed; safe to retry"],
];

const fields = [
  ["id", "string (uuid)", "Scan ID, also shown in your workspace audit log"],
  ["verdict", '"hot_dog" | "not_hot_dog"', "The definitive answer"],
  ["is_hot_dog", "boolean", 'Convenience flag, same as verdict === "hot_dog"'],
  ["confidence", "number 0–1", "Model certainty in the verdict"],
  ["label", "string", "Short description of what the image shows"],
  ["reasoning", "string", "One-sentence explanation"],
  ["model", "string", "Model that produced the verdict"],
  ["latency_ms", "integer", "Inference time"],
  ["created_at", "string (ISO 8601)", "When the scan was recorded"],
];

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border bg-zinc-950 p-4 text-xs leading-relaxed text-zinc-100">
      <code>{children}</code>
    </pre>
  );
}

export default function DocsPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16">
        <p className="text-sm font-medium text-primary">API reference · v1</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          SeeFood REST API
        </h1>
        <p className="mt-4 text-muted-foreground">
          One endpoint that answers one question. Every API scan is recorded in
          your workspace&apos;s scan history with channel{" "}
          <code className="rounded bg-muted px-1">api</code>.
        </p>

        <h2 className="mt-12 text-xl font-semibold">Authentication</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Create a key under{" "}
          <Link
            href="/app/api-keys"
            className="text-primary underline-offset-2 hover:underline"
          >
            API keys
          </Link>{" "}
          in the app and send it as a bearer token. Keys start with{" "}
          <code className="rounded bg-muted px-1">sf_live_</code>, are shown
          once, and are stored only as a hash. Revoke a key at any time.
        </p>
        <div className="mt-4">
          <Code>{"Authorization: Bearer sf_live_…"}</Code>
        </div>

        <h2 className="mt-12 text-xl font-semibold">Classify an image</h2>
        <p className="mt-2 font-mono text-sm">POST /api/v1/classify</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Send{" "}
          <code className="rounded bg-muted px-1">multipart/form-data</code>{" "}
          with an <code className="rounded bg-muted px-1">image</code> field:
          JPEG, PNG or WebP, up to 5 MB.
        </p>
        <div className="mt-4 flex flex-col gap-4">
          <Code>{`curl ${SITE_URL}/api/v1/classify \\
  -H "Authorization: Bearer $SEEFOOD_API_KEY" \\
  -F image=@lunch.jpg`}</Code>
          <Code>{`// Node.js 18+
const form = new FormData();
form.append("image", new Blob([await fs.readFile("lunch.jpg")]), "lunch.jpg");

const res = await fetch("${SITE_URL}/api/v1/classify", {
  method: "POST",
  headers: { Authorization: \`Bearer \${process.env.SEEFOOD_API_KEY}\` },
  body: form,
});
const scan = await res.json();
console.log(scan.is_hot_dog ? "Hot Dog" : "Not Hot Dog");`}</Code>
          <Code>{`# Python
import os, requests

res = requests.post(
    "${SITE_URL}/api/v1/classify",
    headers={"Authorization": f"Bearer {os.environ['SEEFOOD_API_KEY']}"},
    files={"image": open("lunch.jpg", "rb")},
)
print(res.json()["verdict"])`}</Code>
        </div>

        <h3 className="mt-8 font-semibold">Response</h3>
        <div className="mt-3">
          <Code>{`{
  "id": "69413952-892a-4761-b412-66933a69a0db",
  "verdict": "not_hot_dog",
  "is_hot_dog": false,
  "confidence": 0.99,
  "label": "golden retriever dog sitting on grass",
  "reasoning": "The image shows a dog, not a sausage in a bun.",
  "model": "claude-haiku-5-5",
  "latency_ms": 1730,
  "created_at": "2026-10-17T14:04:14.360Z"
}`}</Code>
        </div>
        <div className="mt-4 overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <tbody className="divide-y">
              {fields.map(([name, type, desc]) => (
                <tr key={name}>
                  <td className="px-4 py-2 font-mono text-xs">{name}</td>
                  <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                    {type}
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-12 text-xl font-semibold">Errors</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Errors return JSON shaped as{" "}
          <code className="rounded bg-muted px-1">{`{ "error": { "code", "message" } }`}</code>
          .
        </p>
        <div className="mt-4 overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Code</th>
                <th className="px-4 py-2 font-medium">Meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {errors.map(([status, code, meaning]) => (
                <tr key={code}>
                  <td className="px-4 py-2 font-mono text-xs">{status}</td>
                  <td className="px-4 py-2 font-mono text-xs">{code}</td>
                  <td className="px-4 py-2 text-muted-foreground">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-12 text-xl font-semibold">Limits</h2>
        <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
          <li>
            20 scans per minute per workspace, shared between the web app and
            the API.
          </li>
          <li>
            Images up to 5 MB. Larger photos should be downscaled client-side;
            1280 px on the long side is plenty.
          </li>
          <li>10 active API keys per workspace.</li>
        </ul>
      </main>
      <SiteFooter />
    </div>
  );
}
