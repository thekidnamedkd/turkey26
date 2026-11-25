import { EQUIPMENT } from "../data/equipment.ts";
import { CATEGORIES, INGREDIENTS } from "../data/ingredients.ts";
import { PREP_STAGES, PREP_TASKS } from "../data/prep.ts";

export const LISTS = ["shop", "prep", "pack"] as const;
export type ListId = (typeof LISTS)[number];

/** Stable saved-state id for a checklist row, such as `shop:oranges`. */
export const checkId = (list: ListId, id: string) => `${list}:${id}`;

export interface CatalogItem {
  id: string;
  list: ListId;
  /** Human label used in previews. */
  name: string;
  /** Read-only context written into exports. Ignored on import. */
  info: Record<string, string | boolean>;
}

const plain = (value: string) =>
  value.replaceAll(/\*\*?(?<inner>[^*]+)\*\*?/gu, "$<inner>");

const compact = (info: Record<string, string | boolean | undefined>) =>
  Object.fromEntries(
    Object.entries(info).filter(
      (entry): entry is [string, string | boolean] =>
        entry[1] !== undefined && entry[1] !== ""
    )
  );

const categoryLabel = (id: string) =>
  CATEGORIES.find((category) => category.id === id)?.label ?? id;

const stageLabel = (id: string) =>
  PREP_STAGES.find((stage) => stage.id === id)?.label ?? id;

const taskTitle = (id: string) =>
  PREP_TASKS.find((task) => task.id === id)?.title ?? id;

/** Every checkable row, in display order. Content only; no progress. */
export const CATALOG: CatalogItem[] = [
  ...INGREDIENTS.map((item) => ({
    id: checkId("shop", item.id),
    list: "shop" as const,
    name: item.name,
    info: compact({
      ingredient: item.name,
      spanish: item.alt,
      latin: item.latin,
      department: categoryLabel(item.category),
      quantity: plain(item.amount),
      notes: plain(item.detail),
      usedFor: item.usedFor,
    }),
  })),
  ...PREP_TASKS.map((task) => ({
    id: checkId("prep", task.id),
    list: "prep" as const,
    name: task.title,
    info: compact({
      stage: stageLabel(task.stage),
      task: task.title,
      details: task.detail,
      temperature: task.temp,
      optional: task.optional || undefined,
      after: task.after?.map(taskTitle).join("; "),
    }),
  })),
  ...EQUIPMENT.map((item) => ({
    id: checkId("pack", item.id),
    list: "pack" as const,
    name: item.title,
    info: compact({ item: item.title, details: plain(item.detail) }),
  })),
];

export const CATALOG_IDS: ReadonlySet<string> = new Set(
  CATALOG.map((item) => item.id)
);

export const catalogItem = (id: string) =>
  CATALOG.find((item) => item.id === id);
