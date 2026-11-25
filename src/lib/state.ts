import { isSectionId } from "../data/sections.ts";
import type { SectionId } from "../data/sections.ts";

export const STORAGE_KEY = "turkey26:state";
export const SCHEMA_VERSION = 1;

export interface Prefs {
  /** Hide bought rows in the shop list. */
  hideBought: boolean;
}

/** All mutable app state. Content lives in `catalog.ts`, never here. */
export interface AppState {
  version: number;
  section: SectionId;
  prefs: Prefs;
  /** Ticked ids only, keyed by stable semantic id such as `shop:oranges`. */
  checks: Record<string, true>;
}

export type LoadStatus =
  | "ok"
  | "empty"
  | "unavailable"
  | "corrupt"
  | "migrated";

export const createState = (): AppState => ({
  version: SCHEMA_VERSION,
  section: "shop",
  prefs: { hideBought: false },
  checks: {},
});

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Keeps only `true` flags on string ids. */
export const sanitizeChecks = (value: unknown): Record<string, true> => {
  const checks: Record<string, true> = {};
  if (!isRecord(value)) {
    return checks;
  }
  for (const [id, flag] of Object.entries(value)) {
    if (flag === true) {
      checks[id] = true;
    }
  }
  return checks;
};

/** Reads a stored state object. Returns `null` when the shape is unusable. */
export const parseStored = (raw: unknown): AppState | null => {
  if (!isRecord(raw) || !isRecord(raw.checks)) {
    return null;
  }
  const prefs = isRecord(raw.prefs) ? raw.prefs : {};
  return {
    version: SCHEMA_VERSION,
    section: isSectionId(raw.section) ? raw.section : "shop",
    prefs: { hideBought: prefs.hideBought === true },
    checks: sanitizeChecks(raw.checks),
  };
};

const getStore = (): Storage | null => {
  try {
    const store = globalThis.localStorage;
    const probe = `${STORAGE_KEY}:probe`;
    store.setItem(probe, "1");
    store.removeItem(probe);
    return store;
  } catch {
    return null;
  }
};

export const loadState = (): { state: AppState; status: LoadStatus } => {
  const store = getStore();
  if (!store) {
    return { state: createState(), status: "unavailable" };
  }

  const text = store.getItem(STORAGE_KEY);
  if (!text) {
    return { state: createState(), status: "empty" };
  }

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    raw = null;
  }

  const parsed = parseStored(raw);
  if (!parsed) {
    try {
      // Keep the unreadable copy so it can be recovered by hand.
      store.setItem(`${STORAGE_KEY}:corrupt`, text);
      store.removeItem(STORAGE_KEY);
    } catch {
      // The defaults are still usable.
    }
    return { state: createState(), status: "corrupt" };
  }

  const stored =
    isRecord(raw) && typeof raw.version === "number" ? raw.version : 0;
  return { state: parsed, status: stored < SCHEMA_VERSION ? "migrated" : "ok" };
};

export const saveState = (state: AppState): boolean => {
  const store = getStore();
  if (!store) {
    return false;
  }
  try {
    store.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
};
