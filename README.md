# SeeFood Enterprise 🌭

An enterprise edition of Jian Yang's "Hot Dog or Not" from HBO's *Silicon Valley*. You upload an image and get a definitive **Hot Dog** or **Not Hot Dog** verdict.

- **Live:** https://seefoodsystems.com (website) · https://seefoodsystems.com/app (app) · https://seefoodsystems.com/docs (API)
- **Fallback URL:** https://seamflow-home-task.vercel.app

## What's in it

| Area | What it does |
|---|---|
| **Classifier** | Claude Haiku 5.5 vision with structured output: verdict, confidence, label, one-line reasoning. Text inside images is treated as content, not instructions. |
| **Web app** (`/app`) | Upload, drag-and-drop, paste, mobile camera, or one-click samples. A large verdict banner with confidence, model, latency and scan ID. |
| **Scan history** | Audit log with thumbnails, filters, search, CSV export and a full-image viewer (short-lived signed URLs). |
| **Feedback** | Confirm or flag each verdict. Flagged scans get their own filter; analytics shows reported accuracy. |
| **Analytics** | Volume, hot-dog rate, average confidence and latency, and a 14-day chart. |
| **Offline** | History, analytics, feedback and deletes run on a local SQLite replica ([PowerSync](https://powersync.com)) and sync when you're back online. Use *Go offline* in the sidebar to try it. |
| **REST API** | `POST /api/v1/classify` with bearer keys (`sf_live_…`). Keys are shown once, stored as SHA-256 hashes, and revocable. |
| **Website** | Marketing site and API reference. Static, with SEO and OpenGraph metadata. |

## Production concerns covered

- **Security:**
  - Per-user isolation: guest workspaces via Supabase anonymous auth.
  - Every write is scoped to the session user.
  - Postgres RLS is on with no policies, so Supabase's REST API is closed.
  - Originals live in a private Storage bucket.
- **Input validation:** the file type is checked from the image bytes (JPEG, PNG, WebP), max 5 MB. The client downscales to 1280 px before upload.
- **Abuse limits:** 20 scans per minute per workspace (web and API combined), and 10 API keys per workspace.
- **Errors:** typed JSON errors (`{ error: { code, message } }`). If classification fails, the stored image is removed so nothing is orphaned.
- **Operations:**
  - CI checks lint/format (Biome), types, migration drift and the build.
  - Drizzle migrations run automatically on production deploys.
  - `/api/health` checks the database.

## Stack

Next.js 16 (App Router, Cache Components) · Tailwind 4 + shadcn/ui · Supabase (Postgres, Auth, Storage) · Drizzle ORM · Vercel AI SDK + Anthropic · PowerSync · Vercel

## Run locally

```bash
pnpm install
cp .env.example .env.local   # fill in values (see below)
pnpm db:migrate
pnpm dev
```

`.env.local` needs `DATABASE_URL`, `ANTHROPIC_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` and `NEXT_PUBLIC_POWERSYNC_URL`. PowerSync instance config lives in `powersync/` and deploys with `npx powersync deploy`; one-time database setup is in `powersync/setup.sql`.

## Layout

```
src/app/page.tsx              marketing site
src/app/docs/                 API reference
src/app/app/                  authenticated app (classify, history, analytics, api-keys)
src/app/api/classify          web upload endpoint (session auth)
src/app/api/v1/classify       public REST API (API key auth)
src/app/api/powersync/upload  applies offline writes from the sync queue
src/lib/classify.ts           vision prompt + structured output
src/lib/scans.ts              validation, rate limit, storage, persistence
powersync/                    sync streams + instance config
```
