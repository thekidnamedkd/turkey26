# Turkey 26

A phone-first companion for a Spanish-inspired Thanksgiving for 14, cooked with one oven. Shop the market in Málaga, work through prep in three stages, read the recipes, pack the venue kit and see the menu. Everything ticks off and stays ticked.

Live: <https://thekidnamedkd.github.io/turkey26/>

## Stack

- [Astro](https://astro.build) static output
- [Lumos for Astro](https://lumosframework.com) components and design tokens
- TypeScript, no UI framework, one small client script
- [Ultracite](https://ultracite.ai) with Oxlint and Oxfmt for linting and formatting
- A hand-written service worker, generated per build

## Local development

```sh
npm install
npm run dev        # http://localhost:4321/turkey26/
npm run check      # astro check (types + .astro diagnostics)
npm test           # node --test, logic tests for state and export/import
npm run lint       # ultracite check (Oxlint)
npm run format     # oxfmt
npm run build      # static build to dist/
npm run preview    # serve dist/ at http://localhost:4322/turkey26/
```

The site is served from a repository subpath, so `base` is `/turkey26/` and every page lives under that prefix, in dev and in production.

## Where things live

```
src/
  data/            content: ingredients, prep tasks, recipes, equipment, menu
  lib/
    catalog.ts     every checkable row, with a stable id, built from data/
    state.ts       the single localStorage object, versioned
    portable.ts    export/import format, validation, merge and replace plans
  components/
    content/       the five panels and their shared rows
  scripts/
    app.ts         rendering, filtering, persistence, backup UI
    sw.ts          service worker registration and update banner
  integrations/
    service-worker.mjs   writes dist/sw.js with a precache list and hash
tests/             node:test logic tests
```

Content and mutable state are separate. `data/` holds what never changes; `lib/state.ts` holds only ids that are ticked, the active section and display preferences. The two are combined only when an export is built.

Ids are semantic (`shop:oranges`, `prep:venue-turkey-in`, `pack:trays`), so reordering a list or editing a recipe never loses progress.

## Saved state

One versioned object under `turkey26:state`:

```json
{
  "version": 1,
  "section": "shop",
  "prefs": { "hideBought": false },
  "checks": { "shop:oranges": true }
}
```

- Saved automatically on every tick, tab change and preference change.
- Read and written defensively: if storage is blocked the site still works for the session, and if the stored JSON is unreadable it is copied to `turkey26:state:corrupt` and the lists start empty rather than crashing.
- Older versions are upgraded on load (`version` is checked).
- A second tab picks up changes through the `storage` event.
- Nothing leaves the device unless you export it.

### Backup, export and import

"Progress & backup" at the bottom of the page exports a self-describing JSON snapshot:

- every shop, prep and pack item, ticked and unticked;
- ingredient names, Spanish names, quantities, shopping notes and the dish each ingredient is for;
- prep stage, task text, temperature targets and dependencies;
- a `summary` of done/total per list, a `format` and `version` marker, an `exportedAt` timestamp and a short `readme`.

On a phone the export goes through the Web Share API when the browser supports sharing files, and falls back to a download. Import accepts a file picker or a drag-and-drop onto the page, validates the JSON, drops ids this version does not know, and shows a preview of what would change. You then choose:

- **Merge** keeps ticks on this device and adds the file's.
- **Replace** matches the file exactly, but only for the lists the file contains, so a shop-only file never clears prep or pack.

Because the export is plain JSON with a `done` flag per item, it can be opened and edited in any text editor or in an assistant such as ChatGPT, then imported again. Edit only `done`; keep every `id` as written.

## Offline

`npm run build` writes `dist/sw.js` from `src/integrations/service-worker.mjs`. The worker precaches every built file under the repository subpath, names its cache after a hash of those files, and deletes old `turkey26-*` caches on activation. Navigations are network-first so a new deploy appears immediately, with the cached page as the offline fallback; assets are cache-first.

When a new build is waiting, the page shows a small "newer version is ready" banner with a Reload button that activates it.

The web app manifest (`/manifest.webmanifest`), icons and `display: standalone` make the site installable; the shopping list and recipes work after the first visit with no connection.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`: install, type check, tests, build, then upload `dist/` and deploy with GitHub Pages.

One-time setup, if the repository is new:

```sh
gh repo create turkey26 --private --source=. --remote=origin --push
gh api -X POST repos/thekidnamedkd/turkey26/pages \
  -f build_type=workflow
```

Then check the run with `gh run watch`.

GitHub Pages for a private repository needs a paid plan. On a free account, either make the repository public (`gh repo edit --visibility public`) or upgrade the account; otherwise enabling Pages returns 422.

If the repository is ever renamed, change `BASE_PATH` and `SITE_URL` in `src/consts.ts` to match. Everything else (manifest, icons, service worker scope, canonical URLs) derives from those two values.

## Content

The market list, quantities, recipes, temperatures and food-safety guidance come from the source market list and are reproduced without reinterpretation. The site is marked `noindex` and `robots.txt` disallows crawlers.
