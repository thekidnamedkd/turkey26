import { CATALOG, CATALOG_IDS, LISTS } from "./catalog.ts";
import type { ListId } from "./catalog.ts";
import { isRecord, sanitizeChecks } from "./state.ts";
import type { AppState } from "./state.ts";

export const EXPORT_FORMAT = "turkey26-progress";
export const EXPORT_VERSION = 1;
/** Imports larger than this are rejected before parsing. */
export const MAX_IMPORT_BYTES = 1_000_000;

const README = [
  "Progress backup for Turkey 26 (Thanksgiving, via Málaga).",
  "Each entry has a stable `id` and a `done` flag (true or false).",
  "To change progress, edit only `done`. Keep every `id` exactly as written.",
  "All other fields describe the item for reading and are ignored on import.",
  "Import the file from the site's Backup panel; you can merge or replace.",
];

/** Combines content and progress into one self-describing snapshot. */
export const buildExport = (state: AppState, now = new Date()) => {
  const lists = Object.fromEntries(
    LISTS.map((list) => [
      list,
      CATALOG.filter((item) => item.list === list).map((item) => ({
        id: item.id,
        done: state.checks[item.id] === true,
        ...item.info,
      })),
    ])
  ) as Record<ListId, { id: string; done: boolean }[]>;

  const summary = Object.fromEntries(
    LISTS.map((list) => [
      list,
      {
        done: lists[list].filter((entry) => entry.done).length,
        total: lists[list].length,
      },
    ])
  );

  return {
    format: EXPORT_FORMAT,
    version: EXPORT_VERSION,
    exportedAt: now.toISOString(),
    readme: README,
    summary,
    ...lists,
  };
};

export const exportFileName = (now = new Date()) =>
  `turkey26-progress-${now.toISOString().slice(0, 10)}.json`;

export interface ParsedImport {
  /** Known ids found in the file, with their `done` value. */
  incoming: Map<string, boolean>;
  /** Lists the file actually covers; replace only touches these. */
  lists: ListId[];
  /** Ids in the file that this version of the site doesn't know. */
  unknown: string[];
  /** Entries that had no usable `id` or `done`. */
  invalid: number;
}

export type ImportResult =
  | ({ ok: true } & ParsedImport)
  | { ok: false; error: string };

const fail = (error: string): ImportResult => ({ ok: false, error });

/**
 * Accepts the export format (lists of `{ id, done }`) or a raw stored-state
 * object (`{ checks }`). Reconciles every id against the catalog.
 */
export const parseImport = (text: string): ImportResult => {
  if (text.length > MAX_IMPORT_BYTES) {
    return fail("That file is too large to be a progress backup.");
  }

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return fail("That file isn't valid JSON.");
  }
  if (!isRecord(raw)) {
    return fail("That file isn't a Turkey 26 progress backup.");
  }
  if (raw.format !== undefined && raw.format !== EXPORT_FORMAT) {
    return fail("That JSON file is from a different app.");
  }

  const incoming = new Map<string, boolean>();
  const unknown: string[] = [];
  let invalid = 0;

  const take = (id: string, done: boolean) => {
    if (CATALOG_IDS.has(id)) {
      incoming.set(id, done);
    } else {
      unknown.push(id);
    }
  };

  const listed = LISTS.filter((list) => Array.isArray(raw[list]));
  if (listed.length > 0) {
    for (const list of listed) {
      for (const entry of raw[list] as unknown[]) {
        if (
          isRecord(entry) &&
          typeof entry.id === "string" &&
          typeof entry.done === "boolean"
        ) {
          take(entry.id, entry.done);
        } else {
          invalid += 1;
        }
      }
    }
  } else if (isRecord(raw.checks)) {
    const checks = sanitizeChecks(raw.checks);
    for (const id of Object.keys(checks)) {
      take(id, true);
    }
    // A stored-state object lists only ticks, so every other known id is open.
    for (const id of CATALOG_IDS) {
      if (!incoming.has(id)) {
        incoming.set(id, false);
      }
    }
  } else {
    return fail("That file has no shop, prep or pack lists.");
  }

  if (incoming.size === 0) {
    return fail("None of the items in that file match this list.");
  }
  return {
    ok: true,
    incoming,
    lists: listed.length > 0 ? listed : [...LISTS],
    unknown,
    invalid,
  };
};

export type ImportMode = "merge" | "replace";

/**
 * Merge keeps every tick on this device and adds the file's ticks.
 * Replace makes this device match the file; known items missing from the
 * file become unticked.
 */
export const planImport = (
  current: Record<string, true>,
  incoming: ReadonlyMap<string, boolean>,
  mode: ImportMode,
  lists: readonly ListId[]
) => {
  const next: Record<string, true> = {};
  for (const id of CATALOG_IDS) {
    const covered = lists.includes(id.split(":")[0] as ListId);
    const done =
      mode === "merge" || !covered
        ? current[id] === true || (covered && incoming.get(id) === true)
        : incoming.get(id) === true;
    if (done) {
      next[id] = true;
    }
  }

  const ticked = [...CATALOG_IDS].filter((id) => next[id] && !current[id]);
  const unticked = [...CATALOG_IDS].filter((id) => current[id] && !next[id]);
  return { next, ticked, unticked };
};
