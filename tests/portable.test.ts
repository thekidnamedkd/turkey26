import assert from "node:assert/strict";
import test from "node:test";

import { CATALOG, CATALOG_IDS } from "../src/lib/catalog.ts";
import { inline } from "../src/lib/inline.ts";
import {
  buildExport,
  EXPORT_FORMAT,
  parseImport,
  planImport,
} from "../src/lib/portable.ts";
import { createState, parseStored, sanitizeChecks } from "../src/lib/state.ts";

const stateWith = (...ids: string[]) => {
  const state = createState();
  for (const id of ids) {
    state.checks[id] = true;
  }
  return state;
};

test("catalog ids are unique, prefixed and complete", () => {
  assert.equal(CATALOG.length, CATALOG_IDS.size);
  const counts = { shop: 0, prep: 0, pack: 0 };
  for (const item of CATALOG) {
    assert.ok(item.id.startsWith(`${item.list}:`), item.id);
    counts[item.list] += 1;
  }
  assert.deepEqual(counts, { shop: 31, prep: 20, pack: 4 });
});

test("inline renders bold measurements, italics and escapes html", () => {
  assert.equal(
    inline("**6–7 kg**, one bird"),
    "<strong>6–7 kg</strong>, one bird"
  );
  assert.equal(
    inline("Ask for *pintarroja limpia*"),
    "Ask for <em>pintarroja limpia</em>"
  );
  assert.equal(inline("<script>"), "&lt;script&gt;");
});

test("export is self-describing and includes complete and incomplete items", () => {
  const snapshot = buildExport(
    stateWith("shop:turkey"),
    new Date("2026-11-26T00:00:00Z")
  );
  assert.equal(snapshot.format, EXPORT_FORMAT);
  assert.equal(snapshot.exportedAt, "2026-11-26T00:00:00.000Z");
  assert.ok(snapshot.readme.some((line) => line.includes("`done`")));
  assert.deepEqual(snapshot.summary.shop, { done: 1, total: 31 });

  const turkey = snapshot.shop.find((item) => item.id === "shop:turkey");
  assert.ok(turkey);
  assert.equal(turkey.done, true);
  assert.equal(turkey.ingredient, "Fresh whole turkey");
  assert.equal(turkey.quantity, "6–7 kg");
  assert.equal(turkey.usedFor, "Roast");

  const unticked = snapshot.shop.filter((item) => !item.done);
  assert.equal(unticked.length, 30);
  const prep = snapshot.prep.find((item) => item.id === "prep:venue-turkey-in");
  assert.ok(prep);
  assert.equal(prep.done, false);
  assert.equal(prep.temperature, "165°C");
});

test("export round-trips through import", () => {
  const snapshot = buildExport(stateWith("shop:oranges", "prep:home-mash"));
  const result = parseImport(JSON.stringify(snapshot));
  assert.ok(result.ok);
  assert.equal(result.incoming.get("shop:oranges"), true);
  assert.equal(result.incoming.get("shop:turkey"), false);
  assert.equal(result.incoming.get("prep:home-mash"), true);
  assert.equal(result.unknown.length, 0);
  assert.equal(result.invalid, 0);
});

test("a hand-edited export reimports its edits", () => {
  const snapshot = buildExport(createState());
  snapshot.shop.find((item) => item.id === "shop:bread").done = true;
  const result = parseImport(JSON.stringify(snapshot));
  assert.ok(result.ok);
  assert.equal(result.incoming.get("shop:bread"), true);
});

test("import reconciles ids against the catalog", () => {
  const result = parseImport(
    JSON.stringify({
      shop: [
        { id: "shop:turkey", done: true },
        { id: "shop:not-a-thing", done: true },
        { id: 42, done: true },
        { id: "shop:bread", done: "yes" },
      ],
    })
  );
  assert.ok(result.ok);
  assert.deepEqual([...result.incoming.entries()], [["shop:turkey", true]]);
  assert.deepEqual(result.unknown, ["shop:not-a-thing"]);
  assert.equal(result.invalid, 2);
  assert.deepEqual(result.lists, ["shop"]);
});

test("import rejects junk, foreign formats and empty matches", () => {
  assert.equal(parseImport("not json").ok, false);
  assert.equal(parseImport("[]").ok, false);
  assert.equal(parseImport(JSON.stringify({ format: "other-app" })).ok, false);
  assert.equal(parseImport(JSON.stringify({ hello: "world" })).ok, false);
  const empty = parseImport(JSON.stringify({ shop: [] }));
  assert.equal(empty.ok, false);
});

test("import accepts a stored-state object", () => {
  const result = parseImport(
    JSON.stringify({ checks: { "pack:trays": true } })
  );
  assert.ok(result.ok);
  assert.equal(result.incoming.get("pack:trays"), true);
  assert.equal(result.incoming.get("shop:turkey"), false);
});

test("merge adds ticks and keeps local ones", () => {
  const current = sanitizeChecks({ "shop:turkey": true });
  const incoming = new Map<string, boolean>([
    ["shop:oranges", true],
    ["shop:turkey", false],
  ]);
  const { next, ticked, unticked } = planImport(current, incoming, "merge", [
    "shop",
  ]);
  assert.equal(next["shop:turkey"], true);
  assert.equal(next["shop:oranges"], true);
  assert.deepEqual(ticked, ["shop:oranges"]);
  assert.deepEqual(unticked, []);
});

test("replace matches the file but leaves uncovered lists alone", () => {
  const current = sanitizeChecks({ "shop:turkey": true, "pack:trays": true });
  const incoming = new Map<string, boolean>([["shop:oranges", true]]);
  const { next, ticked, unticked } = planImport(current, incoming, "replace", [
    "shop",
  ]);
  assert.equal(next["shop:turkey"], undefined);
  assert.equal(next["shop:oranges"], true);
  assert.equal(next["pack:trays"], true);
  assert.deepEqual(ticked, ["shop:oranges"]);
  assert.deepEqual(unticked, ["shop:turkey"]);
});

test("stored state rejects junk and keeps only true ticks", () => {
  assert.equal(parseStored(null), null);
  assert.equal(parseStored({}), null);
  assert.deepEqual(sanitizeChecks({ a: true, b: false, c: 1 }), { a: true });
  const parsed = parseStored({
    checks: { "shop:turkey": true },
    section: "pack",
  });
  assert.equal(parsed?.section, "pack");
  assert.deepEqual(parsed?.checks, { "shop:turkey": true });
  const fallback = parseStored({ checks: {}, section: "nope" });
  assert.equal(fallback?.section, "shop");
});
