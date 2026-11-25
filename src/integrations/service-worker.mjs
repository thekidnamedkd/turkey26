import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const { join, relative, sep } = path;

const walk = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) =>
      entry.isDirectory()
        ? walk(join(dir, entry.name))
        : [join(dir, entry.name)]
    )
  );
  return files.flat();
};

const SKIP = /(?:^|\/)(?:sw\.js|robots\.txt|404\.html|sitemap[^/]*\.xml)$/u;

/**
 * Writes `sw.js` after the build. The precache list is every built file, and
 * the cache name is a hash of their contents, so each deploy replaces the old
 * cache instead of serving stale pages.
 */
export default function serviceWorker() {
  let base = "/";
  return {
    name: "turkey26-service-worker",
    hooks: {
      "astro:config:done": ({ config }) => {
        base = config.base.endsWith("/") ? config.base : `${config.base}/`;
      },
      "astro:build:done": async ({ dir }) => {
        const out = fileURLToPath(dir);
        const walked = await walk(out);
        const files = walked
          .map((file) => relative(out, file).split(sep).join("/"))
          .filter((file) => !SKIP.test(file) && !file.endsWith(".DS_Store"))
          .toSorted();
        const contents = await Promise.all(
          files.map((file) => readFile(join(out, file)))
        );

        const hash = createHash("sha256");
        for (const [index, file] of files.entries()) {
          hash.update(file);
          hash.update(contents[index]);
        }
        const version = hash.digest("hex").slice(0, 12);
        const urls = files.map((file) =>
          file === "index.html" ? base : `${base}${file}`
        );

        const source = `const CACHE = "turkey26-${version}";
const BASE = ${JSON.stringify(base)};
const PRECACHE = ${JSON.stringify(urls)};

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("turkey26-") && key !== CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;

  if (request.mode === "navigate") {
    // Network first so a new deploy shows up; the cached page keeps it usable offline.
    event.respondWith(
      fetch(request).catch(() =>
        caches
          .match(request, { ignoreSearch: true, ignoreVary: true })
          .then((hit) => hit || caches.match(BASE, { ignoreVary: true })),
      ),
    );
    return;
  }

  event.respondWith(
    caches
      .match(request, { ignoreVary: true })
      .then((hit) => hit || fetch(request)),
  );
});
`;
        await writeFile(join(out, "sw.js"), source);
      },
    },
  };
}
