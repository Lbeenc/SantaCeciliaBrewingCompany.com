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
