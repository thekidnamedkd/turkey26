import { isSectionId } from "@/data/sections.ts";
import type { SectionId } from "@/data/sections.ts";
import { CATALOG } from "@/lib/catalog.ts";
import {
  buildExport,
  exportFileName,
  MAX_IMPORT_BYTES,
  parseImport,
  planImport,
} from "@/lib/portable.ts";
import type { ImportMode, ParsedImport } from "@/lib/portable.ts";
import { createState, loadState, saveState, STORAGE_KEY } from "@/lib/state.ts";
import type { LoadStatus } from "@/lib/state.ts";

const root = document.documentElement;
const boxes = [...document.querySelectorAll<HTMLInputElement>("[data-check]")];

const el = <T extends HTMLElement>(selector: string) =>
  document.querySelector<T>(selector);

const statusEl = el("[data-status]");
const searchEl = document.querySelector<HTMLInputElement>("[data-search]");
const hideEl = document.querySelector<HTMLButtonElement>("[data-hide]");
const emptyEl = el("[data-empty]");
const fileEl = document.querySelector<HTMLInputElement>("[data-file]");
const dialog = document.querySelector<HTMLDialogElement>(
  "[data-import-dialog]"
);
const summaryEl = el("[data-import-summary]");
const pendingEl = el("[data-import-pending]");
const applyEl = document.querySelector<HTMLButtonElement>(
  "[data-import-apply]"
);

const MESSAGES: Record<LoadStatus, string> = {
  ok: "Saved on this browser. Export a backup before clearing browser data.",
  empty: "Saved on this browser. Tick something to start.",
  migrated: "Progress from an earlier version was kept and upgraded.",
  corrupt:
    "Saved progress could not be read. It was set aside and the lists start empty.",
  unavailable:
    "This browser blocks storage. Ticks last until you close the tab, so export a backup to keep them.",
};

const loaded = loadState();
let { state } = loaded;
let pending: ParsedImport | null = null;

const setStatus = (message: string) => {
  if (statusEl) {
    statusEl.textContent = message;
  }
};

const save = () => {
  if (!saveState(state)) {
    setStatus(
      "Could not save in this browser. Export a backup to keep your ticks."
    );
  }
};

const normalise = (value: string) =>
  value
    .normalize("NFD")
    .replaceAll(/\p{Diacritic}/gu, "")
    .toLowerCase();

const applyProgress = (id: string, done: number, total: number) => {
  for (const bar of document.querySelectorAll<HTMLProgressElement>(
    `[data-progress="${id}"]`
  )) {
    bar.max = total || 1;
    bar.value = done;
  }
  for (const count of document.querySelectorAll<HTMLElement>(
    `[data-count="${id}"]`
  )) {
    count.textContent = `${done} / ${total}`;
  }
};

const countBoxes = (nodes: Iterable<HTMLInputElement>) => {
  let done = 0;
  let total = 0;
  for (const box of nodes) {
    total += 1;
    if (state.checks[box.dataset.check ?? ""]) {
      done += 1;
    }
  }
  return { done, total };
};

const updateCounts = () => {
  for (const panel of document.querySelectorAll<HTMLElement>("[data-panel]")) {
    const own = panel.querySelectorAll<HTMLInputElement>("[data-check]");
    if (own.length > 0) {
      const { done, total } = countBoxes(own);
      applyProgress(panel.dataset.panel ?? "", done, total);
    }
  }

  for (const block of document.querySelectorAll<HTMLElement>(
    "[data-group-progress]"
  )) {
    const { done, total } = countBoxes(
      block.querySelectorAll<HTMLInputElement>("[data-check]")
    );
    applyProgress(block.dataset.groupProgress ?? "", done, total);
  }
};

const applyFilter = () => {
  const query = normalise(searchEl?.value.trim() ?? "");
  let visible = 0;

  for (const row of document.querySelectorAll<HTMLElement>("[data-item]")) {
    const id = row.dataset.item ?? "";
    const inShop = id.startsWith("shop:");
    const matches = !query || normalise(row.textContent ?? "").includes(query);
    const bought = state.checks[id] === true;
    const hidden = !matches || (inShop && state.prefs.hideBought && bought);

    row.hidden = hidden;
    if (!hidden && inShop) {
      visible += 1;
    }
  }

  for (const block of document.querySelectorAll<HTMLElement>(
    "[data-group-block]"
  )) {
    block.hidden = [
      ...block.querySelectorAll<HTMLElement>("[data-item]"),
    ].every((row) => row.hidden);
  }

  if (emptyEl) {
    emptyEl.hidden = visible > 0;
  }
};

const applyState = () => {
  root.dataset.section = state.section;

  for (const box of boxes) {
    box.checked = state.checks[box.dataset.check ?? ""] === true;
  }

  for (const button of document.querySelectorAll<HTMLElement>("[data-nav]")) {
    if (button.dataset.tab === state.section) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  }

  for (const panel of document.querySelectorAll<HTMLElement>("[data-panel]")) {
    panel.hidden = panel.dataset.panel !== state.section;
  }

  if (hideEl) {
    hideEl.setAttribute("aria-pressed", String(state.prefs.hideBought));
    hideEl.textContent = state.prefs.hideBought ? "Show bought" : "Hide bought";
  }

  updateCounts();
  applyFilter();
};

const setSection = (section: SectionId) => {
  state.section = section;
  save();
  applyState();
  window.scrollTo(0, 0);
  document.querySelector<HTMLElement>(`#${section}-title`)?.focus({
    preventScroll: true,
  });
};

const download = (text: string, name: string) => {
  const url = URL.createObjectURL(
    new Blob([text], { type: "application/json" })
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const exportProgress = async () => {
  const name = exportFileName();
  const text = JSON.stringify(buildExport(state), null, 2);
  const file = new File([text], name, { type: "application/json" });

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: "Turkey 26 progress",
      });
      setStatus("Backup shared. Keep the file somewhere you can find it.");
      return;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
    }
  }

  download(text, name);
  setStatus("Backup downloaded. Keep the file somewhere you can find it.");
};

const label = (id: string) =>
  CATALOG.find((item) => item.id === id)?.name.replace(/\.$/u, "") ?? id;

const renderPreview = () => {
  if (!pending) {
    return;
  }
  const mode = (document.querySelector<HTMLInputElement>(
    "[data-import-mode]:checked"
  )?.value ?? "merge") as ImportMode;
  const { ticked, unticked } = planImport(
    state.checks,
    pending.incoming,
    mode,
    pending.lists
  );
  const total = pending.incoming.size;

  if (summaryEl) {
    const fileTicks = [...pending.incoming.values()].filter(Boolean).length;
    summaryEl.textContent = [
      `${fileTicks} of ${total} items in the file are ticked.`,
      pending.unknown.length > 0
        ? `${pending.unknown.length} unknown ids will be skipped.`
        : "",
      pending.invalid > 0 ? `${pending.invalid} unreadable entries.` : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  if (pendingEl) {
    const lines = [
      ...ticked.slice(0, 6).map((id) => `✓ ${label(id)}`),
      ...unticked.slice(0, 6).map((id) => `✗ ${label(id)}`),
    ];
    const more = ticked.length + unticked.length - lines.length;
    pendingEl.textContent =
      lines.length === 0
        ? "Nothing on this device would change."
        : `${lines.join("\n")}${more > 0 ? `\n…and ${more} more` : ""}`;
  }

  if (applyEl) {
    applyEl.textContent =
      mode === "merge" ? "Merge progress" : "Replace progress";
  }
};

const openImport = async (file: File) => {
  if (!dialog || !summaryEl || !pendingEl) {
    return;
  }
  if (file.size > MAX_IMPORT_BYTES) {
    setStatus("That file is too large to be a progress backup.");
    return;
  }

  const result = parseImport(await file.text());
  if (!result.ok) {
    setStatus(result.error);
    return;
  }

  pending = result;
  const merge = document.querySelector<HTMLInputElement>(
    '[data-import-mode][value="merge"]'
  );
  if (merge) {
    merge.checked = true;
  }
  renderPreview();
  dialog.showModal();
};

const applyImport = () => {
  if (!pending) {
    return;
  }
  const mode = (document.querySelector<HTMLInputElement>(
    "[data-import-mode]:checked"
  )?.value ?? "merge") as ImportMode;
  const { next, ticked, unticked } = planImport(
    state.checks,
    pending.incoming,
    mode,
    pending.lists
  );
  state.checks = next;
  save();
  applyState();
  const parts = [
    ticked.length > 0 ? `${ticked.length} ticked` : "",
    unticked.length > 0 ? `${unticked.length} unticked` : "",
  ].filter(Boolean);
  setStatus(
    parts.length > 0
      ? `Backup applied: ${parts.join(", ")}.`
      : "Backup applied. Nothing changed."
  );
  pending = null;
  dialog?.close();
};

document.addEventListener("click", (event) => {
  const { target } = event;
  if (!(target instanceof Element)) {
    return;
  }
  const tab = target.closest<HTMLElement>("[data-tab]");
  if (tab && isSectionId(tab.dataset.tab)) {
    setSection(tab.dataset.tab);
  }
});

document.addEventListener("change", (event) => {
  const { target } = event;
  if (
    target instanceof HTMLInputElement &&
    target.matches("[data-import-mode]")
  ) {
    renderPreview();
    return;
  }
  if (!(target instanceof HTMLInputElement) || !target.dataset.check) {
    return;
  }

  const id = target.dataset.check;
  if (target.checked) {
    state.checks[id] = true;
  } else {
    delete state.checks[id];
  }

  save();
  updateCounts();
  applyFilter();
});

searchEl?.addEventListener("input", applyFilter);

hideEl?.addEventListener("click", () => {
  state.prefs.hideBought = !state.prefs.hideBought;
  save();
  applyState();
});

el("[data-export]")?.addEventListener("click", () => {
  void exportProgress();
});

el("[data-import]")?.addEventListener("click", () => fileEl?.click());

fileEl?.addEventListener("change", () => {
  const file = fileEl.files?.[0];
  if (file) {
    void openImport(file);
  }
  fileEl.value = "";
});

const dropTarget = el("[data-drop]");
const dropPanel = document.querySelector<HTMLDetailsElement>(".state_wrap");

const setDragging = (active: boolean) => {
  dropTarget?.classList.toggle("active", active);
};

// Listen on the document so a stray drop can't navigate away from the app.
document.addEventListener("dragover", (event) => {
  event.preventDefault();
  if (dropPanel && !dropPanel.open) {
    dropPanel.open = true;
  }
  setDragging(true);
});

document.addEventListener("dragleave", (event) => {
  if (!event.relatedTarget) {
    setDragging(false);
  }
});

document.addEventListener("drop", (event) => {
  event.preventDefault();
  setDragging(false);
  const file = event.dataTransfer?.files[0];
  if (file) {
    void openImport(file);
  }
});

applyEl?.addEventListener("click", applyImport);

el("[data-reset]")?.addEventListener("click", () => {
  const confirmed = window.confirm(
    "Clear every tick on this device? Shopping, prep and packing progress will be lost."
  );
  if (!confirmed) {
    return;
  }
  const { section } = state;
  const { state: next } = { state: createState() };
  next.section = section;
  state = next;
  save();
  applyState();
  setStatus("Progress cleared on this device.");
});

window.addEventListener("storage", (event) => {
  if (event.key !== STORAGE_KEY) {
    return;
  }
  const { state: stored } = loadState();
  state = stored;
  applyState();
});

setStatus(MESSAGES[loaded.status]);
applyState();

const startServiceWorker = async () => {
  const { registerServiceWorker } = await import("@/scripts/sw.ts");
  registerServiceWorker();
};

void startServiceWorker();
