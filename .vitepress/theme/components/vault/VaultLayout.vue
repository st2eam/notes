<script setup lang="ts">
import {
  computed,
  defineAsyncComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { useData, useRouter, withBase } from "vitepress";
import { data as index } from "../../../vault/vault.data";
import {
  buildTree,
  buildCategoryTree,
  decode,
  neighborhood,
  matchesQuery,
} from "../../../vault/model.mjs";
import {
  restoreWorkspace,
  readStorage,
  migrateGraphStorage,
  createGraphTab,
  closeWorkspaceTabs,
} from "../../../vault/workspace.mjs";
import { embedHref } from "../../../vault/embed.mjs";
import { searchNotes, searchTerms } from "../../../vault/search.mjs";
import { sortHistoryTree } from "../../../vault/history.mjs";
import { noteGeoTime } from "../../../vault/geo.mjs";
import type { VaultNote, VaultLink } from "../../../vault/types";
import { useEmbedMode } from "../../composables/useEmbedMode";
import Icon from "./Icon.vue";
import FileTree from "./FileTree.vue";
import ContextMenu from "./ContextMenu.vue";
import { publicNoteUrl } from "../../../vault/context-menu.mjs";
const VaultGraph = defineAsyncComponent(() => import("./VaultGraph.vue"));
const VaultNoteMap = defineAsyncComponent(() => import("./VaultNoteMap.vue"));
const router = useRouter();
const { page, isDark: vpIsDark, site } = useData();
const isDark = ref(false);
const { isEmbedded } = useEmbedMode();
const drawerViewport = () => typeof window !== "undefined" && window.matchMedia(
  "(max-width: 760px), (max-width: 1023px) and (pointer: coarse), (max-height: 500px) and (pointer: coarse)",
).matches;
function toggleSidebar(side: "left" | "right") {
  if (side === "left") {
    leftOpen.value = !leftOpen.value;
    if (leftOpen.value && drawerViewport()) rightOpen.value = false;
  } else {
    rightOpen.value = !rightOpen.value;
    if (rightOpen.value && drawerViewport()) leftOpen.value = false;
  }
}
function showNoteBrowser() {
  pane.value = "files";
  leftOpen.value = true;
  if (drawerViewport()) rightOpen.value = false;
}
const embedDesktop = ref(false);
let embedMedia: MediaQueryList | undefined;
function updateEmbedLayout() {
  embedDesktop.value = Boolean(isEmbedded.value && embedMedia?.matches);
}
function toggleEmbedOutline() {
  rightTab.value = "outline";
  rightOpen.value = !rightOpen.value;
}
const notes = index.notes as VaultNote[],
  links = index.links as VaultLink[];
const tree = sortHistoryTree(buildTree(notes));
const categoryFilter = ref("");
const categoryTree = computed(() =>
  sortHistoryTree(buildCategoryTree(notes, categoryFilter.value)),
);
function browseCategory(category: string) {
  pane.value = "categories";
  categoryFilter.value = category;
  leftOpen.value = true;
  if (drawerViewport()) rightOpen.value = false;
  expanded.value = category.split("/").map((_, i) =>
    category
      .split("/")
      .slice(0, i + 1)
      .join("/"),
  );
}
const relationLabels: Record<string, string> = {
  citation: "引用",
  similar: "相似主题",
  subordinate: "从属",
  causal: "因果",
};
const relationName = (link: VaultLink) =>
  relationLabels[link.label || ""] || link.label || relationLabels[link.relationType || "citation"];
type Tab = {
  key: string;
  title: string;
  href: string;
  noteId?: string;
  filter?: string;
  related?: boolean;
};
const tabs = ref<Tab[]>([]);
const active = ref("");
const leftOpen = ref(true),
  rightOpen = ref(true);
const leftWidth = ref(250),
  rightWidth = ref(280);
const expanded = ref<string[]>([]);
const pane = ref("files");
const query = ref("");
const documents = ref<{ id: string; text: string }[]>([]);
const searchReady = ref(false);
const current = computed(
  () =>
    notes.find((n) => n.id === page.value.relativePath) ||
    notes.find(
      (n) =>
        n.route === router.route.path.replace(/^\/notes/, "").split(/[?#]/)[0],
    ),
);
const activeTab = computed(() =>
  tabs.value.find((t) => t.key === active.value),
);
const graphActive = computed(() => activeTab.value?.key.startsWith("graph:"));
const graphFilter = computed(() => activeTab.value?.filter || "");
const rightTab = ref("outline");
const outlineHeadings = computed(() => current.value?.headings.filter((h) => h.level > 1) || []);
const activeHeading = ref("");
let outlineFrame = 0;
const localDepth = ref(1);
const localListOpen = ref(false);
const localOpen = ref(true);
const modalNewTab = ref(false);
const modal = ref<"quick" | "commands" | null>(null);
const modalQuery = ref("");
const modalIndex = ref(0);
const modalInput = ref<HTMLInputElement>();
const article = ref<HTMLElement>();
const scrolls = new Map<string, number>();
const preview = ref<{ note: VaultNote; x: number; y: number } | null>(null);
let previewTimer: ReturnType<typeof setTimeout>;
let restoring = true,
  loadSearchPromise: Promise<void> | null = null;
let cleanupResize: (() => void) | null = null;
let oldAfter: any;
const storage = "steam-vault-workspace-v1";
type MenuTarget =
  | { kind: "note"; noteId: string; href?: string }
  | { kind: "folder"; path: string }
  | { kind: "tab"; key: string };
const contextMenu = ref<{
  serial: number;
  target: MenuTarget;
  trigger: HTMLElement;
  route: string;
  x: number;
  y: number;
} | null>(null);
let menuSerial = 0;
const menuStatus = ref("");
let menuStatusTimer: ReturnType<typeof setTimeout>;
const contextItems = computed(() => {
  const target = contextMenu.value?.target;
  if (!target) return [];
  if (target.kind === "folder") return [{
    id: "toggle-folder",
    label: expanded.value.includes(target.path) ? "收起目录" : "展开目录",
    icon: "folder",
  }];
  const items = [];
  const tab = target.kind === "tab" ? tabs.value.find((t) => t.key === target.key) : undefined;
  if (target.kind === "note") {
    items.push({ id: "open", label: "打开笔记", icon: "file" });
    if (!isEmbedded.value) items.push({ id: "new-tab", label: "在新笔记标签页打开", icon: "switch" });
  }
  items.push({ id: "copy", label: "复制链接", icon: "link" });
  if (!isEmbedded.value && (target.kind === "note" || (tab?.noteId && !tab.key.startsWith("graph:"))))
    items.push({ id: "relations", label: "查看关联", icon: "graph" });
  if (target.kind === "tab") {
    items.push(
      { id: "close-tab", label: "关闭标签页", icon: "close", separator: true, disabled: tab?.key === "graph:" },
      { id: "close-others", label: "关闭其他", icon: "close", disabled: !tabs.value.some((t) => t.key !== target.key && t.key !== "graph:") },
      { id: "close-all", label: "全部关闭", icon: "close", disabled: !tabs.value.some((t) => t.key !== "graph:") },
    );
  }
  return items;
});
const results = computed(() =>
  searchNotes(notes, documents.value, query.value),
);
const quickResults = computed(() =>
  searchNotes(notes, [], modalQuery.value, true),
);
const searchTermsList = computed(() => searchTerms(query.value));
function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function dedupeTerms() {
  return [
    ...new Set(searchTermsList.value.map((t) => t.trim()).filter(Boolean)),
  ].sort((a, b) => b.length - a.length);
}
function buildRegex(terms: string[]) {
  return terms.length
    ? new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi")
    : null;
}
function highlightSegments(text: string) {
  const terms = dedupeTerms();
  const re = buildRegex(terms);
  if (!text || !re) return [{ text: text || "", match: false }];
  return text.split(re).map((part) => ({
    text: part,
    match: terms.some((t) => t.toLowerCase() === part.toLowerCase()),
  }));
}
const localNeighbors = computed(() => {
  const ids = neighborhood(
    current.value?.id,
    index.links.filter((l) => l.kind === "note"),
    localDepth.value,
  );
  return notes.filter((n) => ids.has(n.id));
});
const backlinks = computed(() =>
  dedupe(
    links.filter(
      (l) => l.target === current.value?.id && l.source !== l.target,
    ),
    "source",
  ),
);
const outlinks = computed(() =>
  dedupe(
    links.filter(
      (l) => l.source === current.value?.id && l.target !== l.source,
    ),
    "target",
  ),
);
const relationGroups = computed(() => [
  { title: "反向链接", incoming: true, items: backlinks.value, empty: "没有笔记链接到此处" },
  { title: "出链", incoming: false, items: outlinks.value, empty: "当前笔记没有出链" },
]);
function dedupe(items: VaultLink[], key: "source" | "target") {
  return [
    ...new Map(
      items.map((l) => [
        (l[key] || l.reference) +
          "\0" +
          (l.relationType || "citation") +
          "\0" +
          (l.label || "") +
          "\0" +
          l.anchor,
        l,
      ]),
    ).values(),
  ];
}
const commands = computed(() =>
  [
    { title: "打开全局图谱", icon: "graph", action: () => openGraph() },
    {
      title: "打开历史图谱",
      icon: "graph",
      action: () => openGraph("path:历史/"),
    },
    { title: "查找并切换笔记", icon: "switch", action: () => showModal("quick") },
    { title: "全文搜索", icon: "search", action: () => showSearch() },
    { title: "切换浅色 / 深色主题", icon: "sun", action: () => toggleTheme() },
    {
      title: "切换左侧栏",
      icon: "left",
      action: () => (leftOpen.value = !leftOpen.value),
    },
    {
      title: "切换右侧栏",
      icon: "right",
      action: () => (rightOpen.value = !rightOpen.value),
    },
    { title: "在文件树中定位当前笔记", icon: "locate", action: () => reveal() },
    {
      title: "关闭当前标签页",
      icon: "close",
      action: () => closeTab(active.value),
    },
  ].filter((c) =>
    c.title.toLowerCase().includes(modalQuery.value.toLowerCase()),
  ),
);
function closeContextMenu(restoreFocus = false) {
  const trigger = contextMenu.value?.trigger;
  contextMenu.value = null;
  if (restoreFocus && trigger?.isConnected) trigger.focus({ preventScroll: true });
}
function showContextMenu(target: MenuTarget, event: MouseEvent | KeyboardEvent, trigger?: HTMLElement) {
  const keyboard = event.type === "keydown";
  if (keyboard) {
    const key = event as KeyboardEvent;
    if (key.key !== "ContextMenu" && !(key.key === "F10" && key.shiftKey)) return;
  } else if ((event as PointerEvent).pointerType === "touch" ||
    (event as MouseEvent & { sourceCapabilities?: { firesTouchEvents: boolean } }).sourceCapabilities?.firesTouchEvents) return;
  if (modal.value || (event.target as Element)?.closest?.("input, textarea, select, [contenteditable]:not([contenteditable='false']), [role='textbox']")) return;
  const selection = window.getSelection();
  if (selection && !selection.isCollapsed) return;
  const element = trigger || event.currentTarget as HTMLElement;
  if (!element) return;
  if (target.kind === "note" && !notes.some((note) => note.id === target.noteId)) return;
  if (target.kind === "tab" && !tabs.value.some((tab) => tab.key === target.key)) return;
  event.preventDefault();
  event.stopPropagation();
  leave();
  const rect = element.getBoundingClientRect();
  const pointer = event as MouseEvent;
  contextMenu.value = {
    serial: ++menuSerial,
    target,
    trigger: element,
    route: window.location.href,
    x: keyboard ? rect.left : pointer.clientX,
    y: keyboard ? rect.bottom : pointer.clientY,
  };
}
function tabContextMenu(tab: Tab, event: MouseEvent | KeyboardEvent) {
  const trigger = (event.currentTarget as HTMLElement).querySelector<HTMLElement>("[role='tab']");
  if (trigger) showContextMenu({ kind: "tab", key: tab.key }, event, trigger);
}
function graphContextMenu(note: VaultNote, event: MouseEvent | KeyboardEvent) {
  showContextMenu({ kind: "note", noteId: note.id }, event);
}
async function viewGraphRelations(note: VaultNote) {
  const serial = menuSerial;
  await openGraph("", note);
  await nextTick();
  if (menuSerial === serial)
    document.querySelector<HTMLCanvasElement>(".vault-graph-workspace canvas")?.focus({ preventScroll: true });
}
function contentContextMenu(event: MouseEvent | KeyboardEvent) {
  const hit = anchorNote(event.target);
  if (!hit?.note || hit.url.searchParams.get("view") === "graph" || hit.url.searchParams.get("embed") === "true") return;
  showContextMenu({ kind: "note", noteId: hit.note.id, href: hit.url.href }, event, hit.anchor);
}
async function contextAction(action: string) {
  const request = contextMenu.value;
  if (!request) return;
  const target = request.target;
  const tab = target.kind === "tab" ? tabs.value.find((t) => t.key === target.key) : undefined;
  const note = notes.find((n) => n.id === (target.kind === "note" ? target.noteId : tab?.noteId));
  const href = target.kind === "note" ? target.href || note?.route
    : tab?.key === active.value ? window.location.href : tab?.href;
  closeContextMenu(action === "copy" || action === "toggle-folder");
  if (action === "toggle-folder" && target.kind === "folder") {
    toggleFolder(target.path);
  } else if (action === "copy" && href) {
    clearTimeout(menuStatusTimer);
    menuStatus.value = "";
    try {
      await navigator.clipboard.writeText(publicNoteUrl(href, window.location.origin, withBase("/")));
      menuStatus.value = "链接已复制";
    } catch {
      menuStatus.value = "无法复制链接，请检查浏览器剪贴板权限";
    }
    menuStatusTimer = setTimeout(() => (menuStatus.value = ""), 4000);
  } else if (["close-tab", "close-others", "close-all"].includes(action) && target.kind === "tab") {
    const keys = action === "close-tab" ? [target.key]
      : tabs.value.filter((t) => action === "close-all" || t.key !== target.key).map((t) => t.key);
    await closeTabs(keys, action === "close-others" ? target.key : active.value);
    await nextTick();
    if (menuSerial === request.serial)
      (document.querySelector(".vault-tab.active [role='tab']") as HTMLElement)?.focus({ preventScroll: true });
  } else if (note && action === "relations") {
    await viewGraphRelations(note);
  } else if (note && ["open", "new-tab"].includes(action)) {
    const url = new URL(href || note.route, window.location.href);
    await openNote(note, undefined, "", {
      newTab: action === "new-tab",
      href: note.route + url.search + url.hash,
    });
    await nextTick();
    if (menuSerial === request.serial) article.value?.focus({ preventScroll: true });
  }
}
function goBack() {
  window.history.back();
}
function goForward() {
  window.history.forward();
}
function save() {
  if (isEmbedded.value) {
    if (restoring) return;
    try {
      localStorage.setItem("steam-vault-embed-panels-v1", JSON.stringify({
        leftOpen: leftOpen.value,
        rightOpen: rightOpen.value,
      }));
    } catch {}
    return;
  }
  if (restoring) return;
  try {
    localStorage.setItem(
      storage,
      JSON.stringify({
        tabs: tabs.value,
        active: active.value,
        leftOpen: leftOpen.value,
        rightOpen: rightOpen.value,
        leftWidth: leftWidth.value,
        rightWidth: rightWidth.value,
        expanded: expanded.value,
        theme: isDark.value ? "dark" : "light",
        localDepth: localDepth.value,
        rightTab: rightTab.value,
      }),
    );
  } catch {}
}
function rememberScroll() {
  if (article.value) scrolls.set(active.value, article.value.scrollTop);
}
function routeTab(): Tab {
  const url =
    typeof window === "undefined"
      ? new URL("https://local" + router.route.path)
      : new URL(window.location.href);
  const graph = url.searchParams.get("view") === "graph";
  if (graph) return createGraphTab(
    current.value,
    url.searchParams.get("filter") || "",
    url.searchParams.get("scope") === "related",
  );
  const n = current.value;
  return {
    key: n?.id || url.pathname,
    title: n?.title || page.value.title || "笔记",
    href: n?.route || url.pathname.replace(/^\/notes/, ""),
    noteId: n?.id,
  };
}
function syncRoute() {
  if (contextMenu.value && contextMenu.value.route !== window.location.href) closeContextMenu();
  const t = routeTab();
  const existing = tabs.value.find((x) => x.key === t.key);
  if (!existing) tabs.value.push(t);
  else Object.assign(existing, t);
  active.value = t.key;
  preview.value = null;
  if (current.value?.id === "index.md") {
    expanded.value = [];
  } else {
    const parts = current.value?.folder.split("/") || [];
    let path = "";
    for (const part of parts) {
      path += (path ? "/" : "") + part;
      if (part && !expanded.value.includes(path)) expanded.value.push(path);
    }
  }
  nextTick(() => {
    const anchor =
      typeof window !== "undefined" && decode(window.location.hash.slice(1));
    if (anchor) document.getElementById(anchor)?.scrollIntoView();
    else if (article.value) article.value.scrollTop = scrolls.get(t.key) || 0;
  });
  save();
}
async function navigate(tab: Tab) {
  closeContextMenu();
  rememberScroll();
  active.value = tab.key;
  await router.go(
    withBase(
      isEmbedded.value ? embedHref(tab.href, window.location.search) : tab.href,
    ),
  );
  syncRoute();
}
async function openNote(
  note: VaultNote,
  e?: MouseEvent,
  anchor = "",
  options: { newTab?: boolean; href?: string } = {},
) {
  const isNew = options.newTab ?? !!(e?.ctrlKey || e?.metaKey || e?.shiftKey);
  rememberScroll();
  const tab: Tab = {
    key: note.id,
    title: note.title,
    href: note.route,
    noteId: note.id,
  };
  const existing = tabs.value.find((t) => t.key === tab.key);
  if (!existing) {
    const at = tabs.value.findIndex((t) => t.key === active.value);
    if (!isNew && at >= 0 && !graphActive.value) tabs.value.splice(at, 1, tab);
    else tabs.value.push(tab);
  }
  await navigate({
    ...tab,
    href: options.href || (anchor ? tab.href + "#" + encodeURIComponent(anchor) : tab.href),
  });
  if (anchor) document.getElementById(decode(anchor))?.scrollIntoView();
  if (
    typeof window !== "undefined" &&
    drawerViewport()
  ) {
    leftOpen.value = false;
    rightOpen.value = embedDesktop.value;
  }
}
async function openGraph(filter = "", relatedNote?: VaultNote) {
  const tab = createGraphTab(relatedNote || current.value, filter, !!relatedNote);
  if (!tabs.value.some((t) => t.key === tab.key)) tabs.value.push(tab);
  await navigate(tab);
  if (
    typeof window !== "undefined" &&
    drawerViewport()
  ) {
    leftOpen.value = false;
    rightOpen.value = embedDesktop.value;
  }
}
function closeTab(key: string) {
  return closeTabs([key]);
}
async function closeTabs(keys: string[], nextActive = active.value) {
  const state: { tabs: Tab[]; active: string } = closeWorkspaceTabs(tabs.value, nextActive, keys);
  for (const tab of tabs.value) {
    if (!state.tabs.some((remaining) => remaining.key === tab.key)) scrolls.delete(tab.key);
  }
  tabs.value = state.tabs;
  if (state.active !== active.value) {
    await navigate(state.tabs.find((tab) => tab.key === state.active)!);
  }
  save();
}
function toggleFolder(folder: string) {
  const at = expanded.value.indexOf(folder);
  if (at < 0) expanded.value.push(folder);
  else expanded.value.splice(at, 1);
}
function reveal() {
  const parts = current.value?.folder.split("/") || [];
  let path = "";
  for (const part of parts) {
    path += (path ? "/" : "") + part;
    if (!expanded.value.includes(path)) expanded.value.push(path);
  }
  pane.value = "files";
  leftOpen.value = true;
  nextTick(() =>
    document
      .querySelector("#vault-note-browser .file-tree-scroll .tree-note.active")
      ?.scrollIntoView({ block: "center", inline: "nearest" }),
  );
}
async function loadSearch() {
  if (searchReady.value) return;
  if (!loadSearchPromise)
    loadSearchPromise = import("../../../vault/search.data").then((module) => {
      documents.value = module.data;
      searchReady.value = true;
    });
  await loadSearchPromise;
}
async function showSearch() {
  pane.value = "search";
  leftOpen.value = true;
  if (drawerViewport()) rightOpen.value = false;
  await loadSearch();
  nextTick(() =>
    document.querySelector<HTMLInputElement>(".vault-search-input")?.focus(),
  );
}
function showModal(kind: "quick" | "commands", newTab = false) {
  modalNewTab.value = newTab;
  modal.value = kind;
  modalQuery.value = "";
  modalIndex.value = 0;
  nextTick(() => modalInput.value?.focus());
}
function openQuickResult(note: VaultNote, e: MouseEvent) {
  openNote(note, {
    ctrlKey: e.ctrlKey || modalNewTab.value,
    metaKey: e.metaKey,
    shiftKey: e.shiftKey,
  } as MouseEvent);
}
function toggleTheme() {
  isDark.value = !isDark.value;
  vpIsDark.value = isDark.value;
  document.documentElement.classList.toggle("dark", isDark.value);
  save();
}
function modalKey(e: KeyboardEvent) {
  const items = modal.value === "quick" ? quickResults.value : commands.value;
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    modalIndex.value =
      (modalIndex.value + (e.key === "ArrowDown" ? 1 : -1) + items.length) %
      Math.max(1, items.length);
    nextTick(() =>
      document
        .querySelector(".modal-result.selected")
        ?.scrollIntoView({ block: "nearest" }),
    );
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (modal.value === "quick") {
      const n = quickResults.value[modalIndex.value]?.note;
      if (n) {
        modal.value = null;
        openNote(n, {
          ctrlKey: e.ctrlKey || modalNewTab.value,
          metaKey: e.metaKey,
          shiftKey: e.shiftKey,
        } as MouseEvent);
      }
    } else {
      const action = commands.value[modalIndex.value]?.action;
      modal.value = null;
      action?.();
    }
  }
}
function shortcut(e: KeyboardEvent) {
  if (contextMenu.value && e.key === "Escape") {
    e.preventDefault();
    closeContextMenu(true);
    return;
  }
  if (e.key === "Escape") {
    modal.value = null;
    preview.value = null;
    if (drawerViewport()) {
      leftOpen.value = false;
      rightOpen.value = embedDesktop.value;
    }
  }
  if (isEmbedded.value || !(e.metaKey || e.ctrlKey) || e.altKey) return;
  if (e.key.toLowerCase() === "o") {
    e.preventDefault();
    showModal("quick");
  } else if (e.key.toLowerCase() === "p") {
    e.preventDefault();
    showModal("commands");
  } else if (e.key.toLowerCase() === "w") {
    e.preventDefault();
    closeTab(active.value);
  } else if (
    e.key.toLowerCase() === "f" &&
    !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)
  ) {
    e.preventDefault();
    showSearch();
  }
}
function resize(side: "left" | "right", e: PointerEvent) {
  e.preventDefault();
  const start = e.clientX,
    initial = side === "left" ? leftWidth.value : rightWidth.value;
  const move = (ev: PointerEvent) => {
    const value = Math.min(
      420,
      Math.max(
        190,
        initial + (ev.clientX - start) * (side === "left" ? 1 : -1),
      ),
    );
    if (side === "left") leftWidth.value = value;
    else rightWidth.value = value;
  };
  const done = () => {
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerup", done);
    document.body.classList.remove("vault-resizing");
    save();
    cleanupResize = null;
  };
  cleanupResize?.();
  cleanupResize = done;
  document.body.classList.add("vault-resizing");
  document.addEventListener("pointermove", move);
  document.addEventListener("pointerup", done, { once: true });
}
function resizeKey(side: "left" | "right", e: KeyboardEvent) {
  if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
  e.preventDefault();
  const delta = e.key === "ArrowRight" ? 10 : -10;
  if (side === "left")
    leftWidth.value = Math.max(190, Math.min(420, leftWidth.value + delta));
  else
    rightWidth.value = Math.max(190, Math.min(420, rightWidth.value - delta));
}
function anchorNote(target: EventTarget | null) {
  const anchor = (target as HTMLElement)?.closest?.(
    "a[href]",
  ) as HTMLAnchorElement;
  if (!anchor) return;
  const url = new URL(anchor.href, window.location.href);
  if (
    url.origin !== window.location.origin ||
    !url.pathname.startsWith("/notes/")
  )
    return;
  const route = decode(url.pathname.replace(/^\/notes/, ""));
  const note = notes.find(
    (n) =>
      decode(n.route) === route ||
      decode(n.route).replace(/\.html$/, "") === route.replace(/\.html$/, ""),
  );
  return { anchor, url, note };
}
function contentClick(e: MouseEvent) {
  const hit = anchorNote(e.target);
  if (!hit) return;
  if (hit.url.searchParams.get("view") === "graph") {
    e.preventDefault();
    e.stopPropagation();
    openGraph(hit.url.searchParams.get("filter") || "");
    return;
  }
  if (!hit.note) return;
  if (hit.url.searchParams.get("embed") === "true") {
    e.preventDefault();
    e.stopPropagation();
    window.location.assign(hit.url.href);
    return;
  }
  e.preventDefault();
  e.stopPropagation();
  if (
    hit.note.id === current.value?.id &&
    hit.url.hash &&
    !e.ctrlKey &&
    !e.metaKey
  ) {
    document
      .getElementById(decode(hit.url.hash.slice(1)))
      ?.scrollIntoView({ behavior: "smooth" });
    history.replaceState(
      history.state,
      "",
      isEmbedded.value
        ? withBase(
            embedHref(
              hit.url.pathname.replace(/^\/notes/, "") +
                hit.url.search +
                hit.url.hash,
              window.location.search,
            ),
          )
        : hit.url.href,
    );
    return;
  }
  openNote(hit.note, e, decode(hit.url.hash.slice(1)));
}
function hover(e: MouseEvent | FocusEvent) {
  if (contextMenu.value) return;
  clearTimeout(previewTimer);
  const hit = anchorNote(e.target);
  if (!hit?.note || hit.note.id === current.value?.id) return;
  const rect = hit.anchor.getBoundingClientRect();
  previewTimer = setTimeout(() => {
    preview.value = {
      note: hit.note!,
      x: Math.min(window.innerWidth - 340, Math.max(12, rect.left)),
      y: Math.min(window.innerHeight - 210, rect.bottom + 8),
    };
  }, 350);
}
function leave() {
  clearTimeout(previewTimer);
  preview.value = null;
}
function openRelation(link: VaultLink, incoming = false, e?: MouseEvent) {
  const n = notes.find((n) => n.id === (incoming ? link.source : link.target));
  if (n) openNote(n, e, incoming ? "" : link.anchor);
  else if (link.kind === "attachment") {
    const a = index.attachments.find((a) => a.id === link.target);
    if (a) window.open(withBase(a.route), "_blank", "noopener");
  }
}
function relationTitle(link: VaultLink, incoming = false) {
  return (
    notes.find((n) => n.id === (incoming ? link.source : link.target))?.title ||
    link.reference
  );
}
function trackOutline() {
  if (outlineFrame || graphActive.value || !article.value) return;
  outlineFrame = requestAnimationFrame(() => {
    outlineFrame = 0;
    const top = article.value?.getBoundingClientRect().top || 0;
    let selected = "";
    for (const heading of outlineHeadings.value) {
      const element = document.getElementById(heading.id);
      if (!element || element.getBoundingClientRect().top > top + 80) break;
      selected = heading.id;
    }
    activeHeading.value = selected;
  });
}
async function jumpHeading(id: string) {
  activeHeading.value = id;
  if (graphActive.value && current.value) {
    await openNote(current.value, undefined, id);
  } else {
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }
  if (!embedDesktop.value && (isEmbedded.value || drawerViewport()))
    rightOpen.value = false;
}
watch(
  [
    tabs,
    active,
    leftOpen,
    rightOpen,
    leftWidth,
    rightWidth,
    expanded,
    isDark,
    localDepth,
    rightTab,
  ],
  save,
  { deep: true },
);
watch(vpIsDark, (value) => {
  isDark.value = value;
});
watch(modalQuery, () => (modalIndex.value = 0));
watch([pane, leftOpen, rightOpen, categoryFilter, isEmbedded, modal], () => closeContextMenu());
watch(query, loadSearch);
function clearBodyHighlight(root: HTMLElement) {
  for (const mark of Array.from(root.querySelectorAll("mark.search-hit")))
    mark.replaceWith(document.createTextNode(mark.textContent || ""));
}
function highlightMatches(text: string, terms: string[]): DocumentFragment | null {
  const re = buildRegex(terms);
  if (!re) return null;
  const frag = document.createDocumentFragment();
  let last = 0;
  let found = false;
  for (const m of text.matchAll(re)) {
    const idx = m.index ?? 0;
    if (idx > last) frag.append(document.createTextNode(text.slice(last, idx)));
    const mark = document.createElement("mark");
    mark.className = "search-hit";
    mark.textContent = m[0];
    frag.append(mark);
    last = idx + m[0].length;
    found = true;
  }
  if (!found) return null;
  if (last < text.length) frag.append(document.createTextNode(text.slice(last)));
  return frag;
}
function applyBodyHighlight() {
  const root = article.value;
  if (!root) return;
  clearBodyHighlight(root);
  const terms = dedupeTerms();
  if (!terms.length) return;
  const lower = terms.map((t) => t.toLowerCase());
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const value = node.nodeValue || "";
      if (!value.trim()) return NodeFilter.FILTER_REJECT;
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (
        parent.closest(
          "mark.search-hit, pre, script, style, noscript, mjx-container, math, .katex, .MathJax",
        )
      )
        return NodeFilter.FILTER_REJECT;
      if (!lower.some((t) => value.toLowerCase().includes(t)))
        return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  for (const node of nodes) {
    const parent = node.parentNode;
    if (!parent) continue;
    const frag = highlightMatches(node.nodeValue || "", terms);
    if (frag) parent.replaceChild(frag, node);
  }
}
watch([query, () => page.value.relativePath], () => {
  if (typeof window === "undefined") return;
  nextTick(applyBodyHighlight);
  window.setTimeout(applyBodyHighlight, 60);
});
watch([() => current.value?.id, graphActive], () => {
  activeHeading.value = "";
  nextTick(trackOutline);
});
watch([() => current.value?.id, rightTab], () => {
  nextTick(() => document.querySelector(".vault-right-scroll")?.scrollTo({ top: 0 }));
});
// SSR always includes the current note. Browser state is restored after hydration.
const initialNote = current.value;
if (initialNote) {
  tabs.value = [
    {
      key: initialNote.id,
      title: initialNote.title,
      href: initialNote.route,
      noteId: initialNote.id,
    },
  ];
  active.value = initialNote.id;
}
onMounted(() => {
  if (isEmbedded.value) {
    embedMedia = window.matchMedia("(min-width: 761px)");
    updateEmbedLayout();
    let panels: { leftOpen?: boolean; rightOpen?: boolean } = {};
    try {
      panels = JSON.parse(readStorage("steam-vault-embed-panels-v1") || "{}") || {};
    } catch {}
    leftOpen.value = typeof panels.leftOpen === "boolean" ? panels.leftOpen : false;
    rightOpen.value =
      typeof panels.rightOpen === "boolean" ? panels.rightOpen : embedDesktop.value;
    rightTab.value = "outline";
    restoring = false;
    embedMedia.addEventListener("change", updateEmbedLayout);
    isDark.value = vpIsDark.value;
    oldAfter = router.onAfterRouteChanged;
    router.onAfterRouteChanged = async (to) => {
      await oldAfter?.(to);
      syncRoute();
    };
    window.addEventListener("keydown", shortcut);
    window.addEventListener("popstate", syncRoute);
    return;
  }
  migrateGraphStorage();
  const state = restoreWorkspace(readStorage(storage), notes);
  tabs.value = state.tabs;
  leftWidth.value = state.leftWidth;
  rightWidth.value = state.rightWidth;
  leftOpen.value = state.leftOpen;
  rightOpen.value = state.rightOpen;
  expanded.value = state.expanded;
  localDepth.value = state.localDepth;
  rightTab.value = state.rightTab;
  isDark.value = state.theme ? state.theme === "dark" : vpIsDark.value;
  vpIsDark.value = isDark.value;
  document.documentElement.classList.toggle("dark", isDark.value);
  if (drawerViewport()) {
    leftOpen.value = false;
    rightOpen.value = false;
  }
  restoring = false;
  const resumed =
    state.active && tabs.value.find((t) => t.key === state.active);
  if (/^\/notes\/?$/.test(window.location.pathname) && !window.location.search) {
    const url = new URL(window.location.href);
    url.searchParams.set("view", "graph");
    history.replaceState(null, "", url.pathname + url.search + url.hash);
  }
  if (
    resumed &&
    /^\/notes\/?$/.test(window.location.pathname) &&
    !window.location.search &&
    !window.location.hash
  )
    navigate(resumed);
  else syncRoute();
  oldAfter = router.onAfterRouteChanged;
  router.onAfterRouteChanged = async (to) => {
    await oldAfter?.(to);
    syncRoute();
  };
  window.addEventListener("keydown", shortcut);
  window.addEventListener("popstate", syncRoute);
});
onBeforeUnmount(() => {
  embedMedia?.removeEventListener("change", updateEmbedLayout);
  window.removeEventListener("keydown", shortcut);
  window.removeEventListener("popstate", syncRoute);
  router.onAfterRouteChanged = oldAfter;
  cleanupResize?.();
  clearTimeout(previewTimer);
  clearTimeout(menuStatusTimer);
  cancelAnimationFrame(outlineFrame);
});
</script>
<template>
  <div
    class="vault-shell"
    :class="{ 'embed-desktop': embedDesktop }"
    :style="{
      '--left-width': leftWidth + 'px',
      '--right-width': rightWidth + 'px',
    }"
  >
    <nav
      v-if="isEmbedded"
      class="vault-embed-toolbar"
      aria-label="嵌入阅读工具"
    >
      <button
        :aria-pressed="leftOpen && pane === 'files'"
        aria-controls="vault-note-browser"
        :class="{ selected: leftOpen }"
        @click="showNoteBrowser"
      >
        <Icon name="notebook" />笔记
      </button>
      <button
        :aria-expanded="rightOpen"
        :aria-pressed="rightOpen"
        aria-controls="vault-note-details"
        :class="{ selected: rightOpen }"
        @click="toggleEmbedOutline"
      >
        <Icon name="list" />目录
      </button>
      <span :title="current?.title">{{ current?.title }}</span>
    </nav>
    <div class="vault-embed-workspace">
    <a class="vault-skip" href="#vault-document">跳到正文</a>
    <nav class="vault-ribbon" aria-label="工具栏">
      <button
        :class="['icon-button', 'ribbon-toggle', { selected: leftOpen && pane === 'files' }]"
        aria-label="浏览笔记"
        :aria-pressed="leftOpen && pane === 'files'"
        aria-controls="vault-note-browser"
        title="浏览笔记"
        @click="showNoteBrowser"
      >
        <Icon name="notebook" /><span class="ribbon-label">笔记</span>
      </button>
      <button
        :class="['icon-button', { selected: leftOpen && pane === 'search' }]"
        aria-label="全文搜索"
        title="全文搜索"
        @click="showSearch"
      >
        <Icon name="search" /><span class="ribbon-label">搜索</span>
      </button>
      <button
        :class="['icon-button', { selected: graphActive && (!drawerViewport() || !(leftOpen || rightOpen)) }]"
        aria-label="打开全局图谱"
        title="全局图谱"
        @click="openGraph()"
      >
        <Icon name="graph" /><span class="ribbon-label">图谱</span>
      </button>
      <div class="ribbon-spacer" />
      <button
        class="icon-button ribbon-secondary"
        :aria-label="isDark ? '切换浅色主题' : '切换深色主题'"
        :title="isDark ? '切换浅色主题' : '切换深色主题'"
        @click="toggleTheme"
      >
        <Icon :name="isDark ? 'sun' : 'moon'" /><span class="ribbon-label">主题</span>
      </button>
      <button
        class="icon-button ribbon-secondary"
        aria-label="命令面板"
        title="命令面板 · Ctrl/⌘ P"
        @click="showModal('commands')"
      >
        <Icon name="terminal" /><span class="ribbon-label">命令</span>
      </button>
    </nav>
    <button
      v-if="(leftOpen || rightOpen) && !(isEmbedded && embedDesktop)"
      class="vault-drawer-backdrop"
      aria-label="关闭侧栏"
      @click="
        leftOpen = false;
        rightOpen = false;
      "
    />
    <aside
      id="vault-note-browser"
      v-show="leftOpen"
      class="vault-left"
      aria-label="文件与搜索"
    >
      <div class="file-actions">
        <span>{{ pane === 'files' ? '文件' : pane === 'search' ? '搜索' : '分类' }}</span>
        <button
          v-if="pane === 'files'"
          class="icon-button"
          aria-label="定位当前笔记"
          @click="reveal"
        >
          <Icon name="locate" :size="16" />
          <span class="sidebar-tooltip" aria-hidden="true">定位当前笔记</span>
        </button>
        <button
          v-if="pane === 'files'"
          class="icon-button"
          aria-label="折叠所有文件夹"
          @click="expanded = []"
        >
          <Icon name="collapse" :size="16" />
          <span class="sidebar-tooltip" aria-hidden="true">折叠所有文件夹</span>
        </button>
        <button
          class="icon-button"
          aria-label="收起笔记侧栏"
          :aria-expanded="leftOpen"
          aria-controls="vault-note-browser"
          @click="leftOpen = false"
        >
          <Icon name="left" :size="16" />
          <span class="sidebar-tooltip" aria-hidden="true">收起笔记侧栏</span>
        </button>
      </div>
      <div v-if="pane === 'files'" class="file-tree-scroll">
        <FileTree
          :branch="tree"
          :current="current?.id || ''"
          :expanded="expanded"
          @toggle="toggleFolder"
          @open="openNote"
          @context="showContextMenu"
        />
      </div>
      <div v-else-if="pane === 'categories'" class="file-tree-scroll">
        <label class="category-browser-filter"
          >分类
          <select v-model="categoryFilter" aria-label="浏览分类">
            <option value="">全部分类</option>
            <option
              v-for="category in index.categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.id }}
            </option>
          </select>
        </label>
        <p class="empty-hint">同一笔记可出现在多个分类中，文件只保存一份。</p>
        <FileTree
          :branch="categoryTree"
          :current="current?.id || ''"
          :expanded="expanded"
          @toggle="toggleFolder"
          @open="openNote"
          @context="showContextMenu"
        />
      </div>
      <div v-else class="vault-search">
        <input
          v-model="query"
          class="vault-search-input"
          placeholder="搜索全部笔记…"
          aria-label="搜索全部笔记"
        />
        <p class="search-count">
          {{ searchReady ? results.length + " 个结果" : "正在加载搜索…" }}
        </p>
        <div class="search-results">
          <button
            v-for="result in results"
            :key="result.note.id"
            @click="openNote(result.note, $event)"
          >
            <strong>
              <template
                v-for="(seg, i) in highlightSegments(result.note.title)"
                :key="'t' + i"
                ><mark v-if="seg.match" class="search-hit">{{
                  seg.text
                }}</mark
                ><template v-else>{{ seg.text }}</template></template
              ></strong
            ><small>
              <template
                v-for="(seg, i) in highlightSegments(result.note.folder)"
                :key="'f' + i"
                ><mark v-if="seg.match" class="search-hit">{{
                  seg.text
                }}</mark
                ><template v-else>{{ seg.text }}</template></template
              ></small
            >
            <p>
              <template
                v-for="(seg, i) in highlightSegments(result.context)"
                :key="'c' + i"
                ><mark v-if="seg.match" class="search-hit">{{
                  seg.text
                }}</mark
                ><template v-else>{{ seg.text }}</template></template
              >
            </p>
          </button>
          <p v-if="searchReady && !results.length" class="empty-hint">
            没有找到匹配的笔记
          </p>
        </div>
      </div>
      <div v-if="!isEmbedded" class="vault-mobile-tools" role="group" aria-label="阅读工具">
        <button
          :aria-label="isDark ? '切换浅色主题' : '切换深色主题'"
          @click="toggleTheme"
        >
          <Icon :name="isDark ? 'sun' : 'moon'" :size="17" />
          <span>{{ isDark ? '切换浅色' : '切换深色' }}</span>
        </button>
        <button aria-label="命令面板" @click="showModal('commands')">
          <Icon name="terminal" :size="17" /><span>命令面板</span>
        </button>
      </div>
      <div class="vault-name">
        <Icon name="folder" :size="15" /><span>{{ site.title }}</span
        ><small>{{ notes.length }}</small>
      </div>
    </aside>
    <div
      v-show="leftOpen"
      class="vault-resizer"
      role="separator"
      aria-label="调整文件侧栏宽度"
      aria-orientation="vertical"
      :aria-valuenow="leftWidth"
      aria-valuemin="190"
      aria-valuemax="420"
      tabindex="0"
      @pointerdown="resize('left', $event)"
      @keydown="resizeKey('left', $event)"
    />
    <section class="vault-center" aria-label="阅读工作区">
      <div class="vault-tabs" role="tablist" aria-label="已打开笔记">
        <div class="tab-scroll">
          <div
            v-for="tab in tabs"
            :key="tab.key"
            :class="['vault-tab', { active: tab.key === active }]"
            @contextmenu="tabContextMenu(tab, $event)"
            @keydown="tabContextMenu(tab, $event)"
          >
            <button
              role="tab"
              aria-haspopup="menu"
              :aria-selected="tab.key === active"
              :tabindex="tab.key === active ? 0 : -1"
              @click="navigate(tab)"
              @keydown.right.prevent="
                navigate(tabs[(tabs.indexOf(tab) + 1) % tabs.length])
              "
              @keydown.left.prevent="
                navigate(
                  tabs[(tabs.indexOf(tab) - 1 + tabs.length) % tabs.length],
                )
              "
            >
              <Icon
                :name="tab.key.startsWith('graph:') ? 'graph' : 'file'"
                :size="15"
              /><span>{{ tab.title }}</span></button
            ><button
              v-if="tab.key !== 'graph:'"
              class="tab-close"
              :aria-label="'关闭 ' + tab.title"
              @click="closeTab(tab.key)"
            >
              <Icon name="close" :size="13" />
            </button>
          </div>
        </div>
        <button
          class="icon-button"
          title="新标签页 · 快速切换"
          aria-label="打开新笔记标签"
          @click="showModal('quick', true)"
        >
          <Icon name="plus" />
        </button>
        <button
          v-if="!rightOpen"
          class="icon-button detail-toggle"
          aria-label="打开笔记辅助栏"
          :aria-expanded="rightOpen"
          aria-controls="vault-note-details"
          @click="toggleSidebar('right')"
        >
          <Icon name="right-open" />
          <span class="sidebar-tooltip" aria-hidden="true">打开笔记辅助栏</span>
        </button>
      </div>
      <div class="vault-document-toolbar">
        <button
          class="icon-button"
          aria-label="后退"
          title="后退"
          @click="goBack"
        >
          <Icon name="back" :size="16" /></button
        ><button
          class="icon-button"
          aria-label="前进"
          title="前进"
          @click="goForward"
        >
          <Icon name="forward" :size="16" />
        </button>
        <div class="vault-breadcrumb">
          {{
            graphActive
              ? "图谱视图"
              : current?.folder.replaceAll("/", " / ") || site.title
          }}<span v-if="!graphActive && current?.folder">
            / {{ current.title }}</span
          >
        </div>
        <span class="reading-mode">{{
          graphActive ? "关系探索" : "阅读视图"
        }}</span>
      </div>
      <div v-if="graphActive" class="vault-graph-workspace" role="tabpanel">
        <ClientOnly
          ><VaultGraph
            :key="active"
            :index="index"
            :current="activeTab?.related ? activeTab.noteId : undefined"
            :active-note="current?.id"
            :filter="graphFilter"
            @relations="viewGraphRelations"
            @context="graphContextMenu"
        /></ClientOnly>
      </div>
      <article
        v-show="!graphActive"
        id="vault-document"
        ref="article"
        class="vault-reading"
        role="tabpanel"
        tabindex="-1"
        @click="contentClick"
        @contextmenu="contentContextMenu"
        @keydown="contentContextMenu"
        @mouseover="hover"
        @mouseout="leave"
        @focusin="hover"
        @focusout="leave"
        @scroll.passive="trackOutline"
      >
        <div v-if="page.isNotFound" class="vault-note-content vp-doc">
          <h1>找不到这篇笔记</h1>
          <p>请从文件树或搜索中选择笔记。</p>
          <a :href="withBase('/')">返回知识库</a>
        </div>
        <div v-else class="vault-note-content vp-doc"><Content /></div>
      </article>
      <div class="vault-status">
        <span>{{
          graphActive ? "图谱" : current?.tags.map((t) => "#" + t).join("  ")
        }}</span
        ><span
          >{{
            graphActive
              ? notes.length + " 篇笔记"
              : backlinks.length + " 个反向链接"
          }}
          <span class="status-dot">·</span> 本地发布</span
        >
      </div>
    </section>
    <div
      v-show="rightOpen"
      class="vault-resizer"
      role="separator"
      aria-label="调整辅助侧栏宽度"
      aria-orientation="vertical"
      :aria-valuenow="rightWidth"
      aria-valuemin="190"
      aria-valuemax="420"
      tabindex="0"
      @pointerdown="resize('right', $event)"
      @keydown="resizeKey('right', $event)"
    />
    <aside
      id="vault-note-details"
      v-show="rightOpen"
      class="vault-right"
      aria-label="笔记辅助面板"
    >
      <div class="sidebar-tabbar">
        <button
          :class="['icon-button', 'sidebar-tab', { selected: rightTab === 'outline' }]"
          aria-label="笔记目录"
          :aria-pressed="rightTab === 'outline'"
          title="目录"
          @click="rightTab = 'outline'"
        >
          <Icon name="list" :size="16" /><span>目录</span></button
        ><button
          :class="['icon-button', 'sidebar-tab', { selected: rightTab === 'links' }]"
          v-if="!embedDesktop"
          aria-label="双向链接"
          :aria-pressed="rightTab === 'links'"
          title="反向链接与出链"
          @click="rightTab = 'links'"
        >
          <Icon name="link" :size="16" /><span>链接</span></button
        ><span /><button
          class="icon-button"
          aria-label="收起笔记辅助栏"
          :aria-expanded="rightOpen"
          aria-controls="vault-note-details"
          @click="rightOpen = false"
        >
          <Icon name="right" :size="16" />
          <span class="sidebar-tooltip" aria-hidden="true">收起笔记辅助栏</span>
        </button>
      </div>
      <div class="vault-right-scroll">
        <div v-if="current" class="vault-detail-context">
          <Icon name="notebook" :size="16" />
          <strong>{{ current.title }}</strong>
        </div>
        <ClientOnly>
          <VaultNoteMap
            v-if="current && rightOpen && (current.geo?.place || current.geo?.locationNote || current.tags.includes('地点') || current.geoReferences?.length || noteGeoTime(current))"
            :note="current"
            :notes="notes"
            :enabled="rightOpen"
            @open="openNote"
          />
        </ClientOnly>
        <section v-if="!isEmbedded" class="vault-local">
          <h2>
            <button
              @click="localOpen = !localOpen"
              :aria-expanded="localOpen"
              aria-controls="vault-local-content"
            >
              <Icon name="chevron" :size="12" :class="{ rotated: localOpen }" />局部图谱
            </button>
            <label v-if="localOpen">深度
              <select v-model.number="localDepth" aria-label="局部图谱深度">
                <option v-for="depth in 5" :key="depth" :value="depth">{{ depth }} 层</option>
              </select>
            </label>
          </h2>
          <div v-if="localOpen" id="vault-local-content">
            <div v-if="current && rightOpen" class="local-graph-container">
              <ClientOnly>
                <VaultGraph
                  :index="index"
                  :current="current.id"
                  :active-note="current.id"
                  :depth="localDepth"
                  compact
                  :enabled="rightOpen"
                  @relations="viewGraphRelations"
                  @context="graphContextMenu"
                  @expand="openGraph()"
                />
              </ClientOnly>
            </div>
            <button
              class="local-list-toggle"
              @click="localListOpen = !localListOpen"
              :aria-expanded="localListOpen"
              aria-controls="vault-local-nodes"
            >
              <Icon name="chevron" :size="12" :class="{ rotated: localListOpen }" />
              <span>相关笔记</span><small>{{ localNeighbors.length }}</small>
            </button>
            <div v-if="localListOpen" id="vault-local-nodes" class="local-node-list" aria-label="局部图谱节点列表">
              <button v-for="note in localNeighbors" :key="note.id" @click="viewGraphRelations(note)">
                <Icon name="file" :size="14" /><span>{{ note.title }}</span>
              </button>
            </div>
          </div>
        </section>
        <section v-if="rightTab === 'outline'" class="vault-outline" aria-label="文章目录">
          <h2>文章目录 <small>{{ outlineHeadings.length }} 个小节</small></h2>
          <button
            v-for="heading in outlineHeadings"
            :key="heading.id"
            :class="{ active: activeHeading === heading.id }"
            :aria-current="activeHeading === heading.id ? 'location' : undefined"
            :style="{ paddingLeft: (heading.level - 2) * 12 + 10 + 'px' }"
            @click="jumpHeading(heading.id)"
          >
            {{ heading.title }}
          </button>
          <p v-if="!outlineHeadings.length" class="empty-hint">当前笔记没有小节</p>
        </section>
        <template v-else>
          <section v-for="group in relationGroups" :key="group.title" class="vault-relations">
            <h2>{{ group.title }} <small>{{ group.items.length }}</small></h2>
            <div
              v-for="link in group.items"
              :key="link.source + (link.target || link.reference) + link.relationType + link.label + link.anchor"
              class="relation-item"
            >
              <button
                class="relation-open"
                :disabled="!group.incoming && !link.target"
                @click="openRelation(link, group.incoming, $event)"
              >
                <strong>{{ relationTitle(link, group.incoming) }}</strong>
                <small class="relation-meta">
                  {{ relationName(link) }} · {{ link.status === 'inferred' ? '推断' : '已确认' }}
                  <span v-if="!group.incoming && link.reason"> · {{ !link.target ? '未解析' : '标题未找到' }}</span>
                </small>
                <p v-if="link.explanation || link.context">{{ link.explanation || link.context }}</p>
              </button>
              <details v-if="link.evidence || link.context" class="relation-evidence">
                <summary>查看依据</summary>
                <p>{{ link.evidence || link.context }}</p>
              </details>
            </div>
            <p v-if="!group.items.length" class="empty-hint">{{ group.empty }}</p>
          </section>
        </template>
        <details
          v-if="current?.categories.length && (!isEmbedded || rightTab === 'links')"
          :key="current.id"
          class="vault-classifications"
        >
          <summary>
            <Icon name="chevron" :size="12" />
            <span>分类信息</span><small>{{ current.categories.length }}</small>
          </summary>
          <p v-if="current.classificationStatus === 'provisional'" class="empty-hint">待补充正文</p>
          <div v-for="category in current.categories" :key="category.path" class="classification-item">
            <button @click="browseCategory(category.path)">
              {{ category.path }}
              <small>{{ category.path === current.primaryCategory ? '主分类' : '交叉分类' }}</small>
            </button>
            <details>
              <summary>分类理由</summary>
              <p>{{ category.reason }}</p>
            </details>
          </div>
        </details>
      </div>
    </aside>
    </div>
    <ContextMenu
      v-if="contextMenu"
      :key="contextMenu.serial"
      :items="contextItems"
      :trigger="contextMenu.trigger"
      :x="contextMenu.x"
      :y="contextMenu.y"
      :label="contextMenu.target.kind === 'folder' ? '目录操作' : contextMenu.target.kind === 'tab' ? '标签页操作' : '笔记操作'"
      @select="contextAction"
      @close="closeContextMenu"
    />
    <div class="vault-menu-status" role="status" aria-live="polite" aria-atomic="true" :class="{ visible: menuStatus }">{{ menuStatus }}</div>
    <div
      v-if="preview"
      class="vault-hover-preview"
      :style="{ left: preview.x + 'px', top: preview.y + 'px' }"
      role="tooltip"
    >
      <div><Icon name="file" :size="15" />{{ preview.note.title }}</div>
      <p>{{ preview.note.excerpt }}</p>
      <small>{{ preview.note.folder }}</small>
    </div>
    <div v-if="modal" class="vault-modal-backdrop" @click.self="modal = null">
      <section
        class="vault-modal"
        role="dialog"
        aria-modal="true"
        :aria-label="modal === 'quick' ? '快速切换笔记' : '命令面板'"
        @keydown="modalKey"
        @keydown.tab.prevent="modalInput?.focus()"
      >
        <div class="vault-modal-header mobile-only">
          <span>{{ modal === 'quick' ? '快速切换笔记' : '命令面板' }}</span>
          <button class="icon-button" type="button" aria-label="关闭对话框" @click="modal = null">
            <Icon name="close" />
          </button>
        </div>
        <input
          ref="modalInput"
          v-model="modalQuery"
          :placeholder="modal === 'quick' ? '输入笔记名称或别名…' : '输入命令…'"
          :aria-label="modal === 'quick' ? '快速切换搜索' : '命令搜索'"
          aria-autocomplete="list"
          :aria-activedescendant="'vault-result-' + modalIndex"
        />
        <div
          class="modal-results"
          role="listbox"
          :aria-label="modal === 'quick' ? '笔记结果' : '命令结果'"
        >
          <template v-if="modal === 'quick'"
            ><button
              v-for="(result, i) in quickResults"
              :id="'vault-result-' + i"
              :key="result.note.id"
              :class="['modal-result', { selected: i === modalIndex }]"
              role="option"
              :aria-selected="i === modalIndex"
              tabindex="-1"
              @mousemove="modalIndex = i"
              @click="
                modal = null;
                openQuickResult(result.note, $event);
              "
            >
              <Icon name="file" :size="17" /><span
                >{{ result.note.title
                }}<small>{{ result.note.id }}</small></span
              >
            </button>
            <p v-if="!quickResults.length" class="empty-hint">
              没有匹配的笔记
            </p></template
          ><template v-else
            ><button
              v-for="(command, i) in commands"
              :id="'vault-result-' + i"
              :key="command.title"
              :class="['modal-result', { selected: i === modalIndex }]"
              role="option"
              :aria-selected="i === modalIndex"
              tabindex="-1"
              @mousemove="modalIndex = i"
              @click="
                modal = null;
                command.action();
              "
            >
              <Icon :name="command.icon" :size="17" /><span>{{
                command.title
              }}</span>
            </button></template
          >
        </div>
        <footer>
          <span>↑ ↓ 选择</span><span>↵ 打开</span
          ><span v-if="modal === 'quick'">Ctrl / ⌘ ↵ 新标签</span
          ><span>Esc 关闭</span>
        </footer>
      </section>
    </div>
  </div>
</template>
