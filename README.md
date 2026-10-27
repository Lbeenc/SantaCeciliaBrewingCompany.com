# The Santa Cecilia Brewing Company

Website for santaceciliabrewingcompany.com — a home brewery that shares its beer with friends
and family and pours it now and then at local events.

- `server/SantaCecilia.Api` — ASP.NET Core (.NET 10) API. In production it also serves the built site.
- `client/` — React + TypeScript (Vite). The "Workshop" design (Option 2).

## Running it locally

Two terminals:

```bash
cd server/SantaCecilia.Api
dotnet run --launch-profile http
```

```bash
cd client
npm install
npm run dev
```

Open the address Vite prints (usually http://localhost:5173). API calls are forwarded to the
server on http://localhost:5172.

## Updating the site's content

Everything on the page — batches, events, the logbook, the brewer's story — lives in
[`server/SantaCecilia.Api/Data/content.json`](server/SantaCecilia.Api/Data/content.json).
Edit it and refresh; the server picks up changes without a restart.

- **Batches:** `stage` is one of `planned`, `fermenting`, `conditioning`, `ready`, `archived`.
  `color` is the beer's color as a hex code (it tints the little glass icon). Dates are `YYYY-MM-DD`.
  `abv` is a number like `6.2`; leave it `null` until it's measured.
- **Events:** set `date` once it's confirmed — until then the site shows the `month` and "TBA",
  and the "Add to calendar" button stays hidden. `pouring` lists the batch numbers being served.
  An event moves to "Past events" automatically once its date has gone by.
- **Logbook:** newest entries show first; the home page shows the latest three.

Email sign-ups are saved to `server/SantaCecilia.Api/App_Data/subscribers.json`. That folder is
git-ignored on purpose — it holds real people's addresses.

## API

| Method | Path | |
|---|---|---|
| GET | `/api/site` | Brewer info plus counts (batches brewed, styles tried) |
| GET | `/api/batches?stage=ready` | All batches, newest first; `stage` is optional |
| GET | `/api/events` | `{ upcoming, past }`, each with the batches being poured |
| GET | `/api/events/{id}/calendar.ics` | Calendar file for an event with a confirmed date |
| GET | `/api/logbook?take=3` | Logbook entries, newest first |
| POST | `/api/subscribers` | `{ "email": "…" }` → `{ "added": true \| false }` |

## Building for production

```bash
cd client && npm run build
cd ../server/SantaCecilia.Api && dotnet publish -c Release -o ../../publish
```

`npm run build` writes the site into the server's `wwwroot`, so the published app serves both
the site and the API from one place.

## Deploying to Google Cloud Run (santaceciliabrewingcompany.com)

Cloud Run builds the `Dockerfile` straight from GitHub, so nothing needs to be installed
locally. Every push to `main` redeploys the site — including edits to `content.json`.

### 1. One-time setup

1. In the [Google Cloud console](https://console.cloud.google.com/), create a project
   (e.g. `santa-cecilia-brewing`) and link your billing account. The site should stay within
   Cloud Run's free tier; set a budget alert (Billing → Budgets & alerts, e.g. $1) anyway.

### 2. Create the service

1. Open **Cloud Run** → **Deploy container** → **Service**, and choose
   **Continuously deploy from a repository (source or function)**.
2. **Set up with Cloud Build**: connect GitHub, pick `Lbeenc/SantaCeciliaBrewingCompany.com`,
   branch `^main$`, build type **Dockerfile** (path `/Dockerfile`).
3. Service settings:
   - **Region:** `us-central1` (inside the free tier, and it supports custom domains)
   - **Authentication:** Allow unauthenticated invocations (it's a public website)
   - **Billing:** Request-based. **Minimum instances:** 0. **Maximum instances:** 1
     (one instance keeps all sign-ups in one place, and caps the cost)
4. Click **Create**. The first build takes a few minutes. You'll get a URL like
   `https://santa-cecilia-xxxxx-uc.a.run.app` — check the site works there.

No secrets or environment variables are needed.

### 3. Point santaceciliabrewingcompany.com at it

1. In Cloud Run, open **Manage custom domains** → **Add mapping**, pick the service, and enter
   `santaceciliabrewingcompany.com`. Google asks you to verify you own the domain the first time.
2. Google shows DNS records (A and AAAA records for the bare domain). Add exactly those at
   your registrar. On Cloudflare, set each record to **DNS only** (grey cloud), not Proxied.
3. Wait for the HTTPS certificate (15 minutes to a few hours).
4. Optional: add `www.santaceciliabrewingcompany.com` as a second mapping
   (CNAME to `ghs.googlehosted.com`).

### Email sign-ups on Cloud Run

Cloud Run's disk is temporary: `App_Data/subscribers.json` is wiped whenever the site
redeploys or sits idle long enough to shut down. Until sign-ups are moved to permanent
storage (e.g. Firestore), treat the "Batch alerts" list as unreliable in production.
