# AI Mastery Online

A public, multi-user version of the AI Mastery tool directory — an orbiting
"galaxy" of AI tools you can search, organise, and launch. Every account gets
its own full copy of the starter library on first sign-in, then owns it
outright: add, edit, delete, and reorder freely without affecting anyone else.

## Stack

- **React 19 + TypeScript + Vite** — single-page app, no SSR needed
- **Supabase** — Postgres, Auth (Google / GitHub OAuth), Row-Level Security
- **Tailwind CSS** — compiled properly, not the CDN script
- **framer-motion** — orbit physics, transitions, ambient motion
- **dnd-kit** — drag-to-reorder in the Manage overlay

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase values
npm run dev
```

The app expects two environment variables:

| Variable | Where it comes from |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase dashboard → Project Settings → API |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Same page — the publishable (not secret) key |

Both are safe in the browser. **Security comes from Row-Level Security, not
from hiding these values.** The `service_role` key must never appear in this
repo or any client code.

## How data is organised

Three tables carry the library, all guarded by RLS:

- `profiles` — one row per account, including an `is_admin` flag
- `folders` — nestable one level deep (`parent_folder_id`)
- `tools` — the links themselves, each belonging to a folder
- `tool_clicks` — append-only per-user usage log

Ownership uses a single convention: `owner_id IS NULL` marks the shared base
template that only an admin can write, and any other value marks a row private
to that user. A database trigger clones the whole template into personal rows
the first time someone signs in.

## Security notes

- **Isolation is enforced in Postgres**, not the frontend. Policies restrict
  every read and write to the signed-in user's own rows.
- **URLs are validated twice** — a CHECK constraint rejects anything that
  isn't `http(s)` at the database level, and `src/lib/safeUrl.ts` does the
  same client-side before rendering. Never put a raw user URL in an `href`.
- **Outbound links** open in a new tab with `rel="noopener noreferrer nofollow ugc"`.
- **Logos are links, not uploads** — no base64 blobs are stored, so there is
  no untrusted image data in the database.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server on port 5173 |
| `npm run build` | Typecheck, then build for production |
| `npm run typecheck` | Types only, no build |
| `npm run preview` | Serve the production build locally |
