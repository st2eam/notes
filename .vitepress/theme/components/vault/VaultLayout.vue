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
} from "../../../vault/workspace.mjs";
import { migrateQuery } from "../../../vault/migration.mjs";
import { searchNotes } from "../../../vault/search.mjs";
import type { VaultNote, VaultLink } from "../../../vault/types";
import { useEmbedMode } from "../../composables/useEmbedMode";
import Icon from "./Icon.vue";
import FileTree from "./FileTree.vue";
const VaultGraph = defineAsyncComponent(() => import("./VaultGraph.vue"));
const router = useRouter();
const { page, isDark: vpIsDark, site } = useData();
const isDark = ref(false);
const { isEmbedded } = useEmbedMode();
const notes = index.notes as VaultNote[],
  links = index.links as VaultLink[];
const tree = buildTree(notes);
const categoryFilter = ref("");
const categoryTree = computed(() =>
  buildCategoryTree(notes, categoryFilter.value),
);
function browseCategory(category: string) {
  pane.value = "categories";
  categoryFilter.value = category;
  leftOpen.value = true;
  expanded.value = category.split("/").map((_, i) =>
    category
      .split("/")
      .slice(0, i + 1)
      .join("/"),
  );
}
const relationName = (l: VaultLink) =>
  l.label ||
  {
    citation: "引用",
    similar: "相似主题",
    subordinate: "从属",
    causal: "因果",
  }[l.relationType || "citation"];
type Tab = {
  key: string;
  title: string;
  href: string;
  noteId?: string;
  filter?: string;
};
const tabs = ref<Tab[]>([]);
const active = ref("");
const leftOpen = ref(true),
  rightOpen = ref(true);
const leftWidth = ref(250),
  rightWidth = ref(280);
const expanded = ref<string[]>(["历史"]);
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
const results = computed(() =>
  searchNotes(notes, documents.value, query.value),
);
const quickResults = computed(() =>
  searchNotes(notes, [], modalQuery.value, true),
);
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
    { title: "快速切换笔记", icon: "file", action: () => showModal("quick") },
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
    { title: "在文件树中定位当前笔记", icon: "folder", action: () => reveal() },
    {
      title: "关闭当前标签页",
      icon: "close",
      action: () => closeTab(active.value),
    },
  ].filter((c) =>
    c.title.toLowerCase().includes(modalQuery.value.toLowerCase()),
  ),
);
function goBack() {
  window.history.back();
}
function goForward() {
  window.history.forward();
}
function save() {
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
  if (graph) {
    const filter = migrateQuery(url.searchParams.get("filter") || "");
    return {
      key: "graph:" + filter,
      noteId: current.value?.id,
      title: /^(path:历史|path:"历史)/.test(filter)
        ? "历史图谱"
        : filter
          ? "筛选图谱"
          : "全局图谱",
      href:
        (current.value?.route || "/") +
        "?view=graph" +
        (filter ? "&filter=" + encodeURIComponent(filter) : ""),
      filter,
    };
  }
  const n = current.value;
  return {
    key: n?.id || url.pathname,
    title: n?.title || page.value.title || "笔记",
    href: n?.route || url.pathname.replace(/^\/notes/, ""),
    noteId: n?.id,
  };
}
function syncRoute() {
  const t = routeTab();
  const existing = tabs.value.find((x) => x.key === t.key);
  if (!existing) tabs.value.push(t);
  else Object.assign(existing, t);
  active.value = t.key;
  preview.value = null;
  const parts = current.value?.folder.split("/") || [];
  let path = "";
  for (const part of parts) {
    path += (path ? "/" : "") + part;
    if (part && !expanded.value.includes(path)) expanded.value.push(path);
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
  rememberScroll();
  active.value = tab.key;
  await router.go(withBase(tab.href));
  syncRoute();
}
async function openNote(note: VaultNote, e?: MouseEvent, anchor = "") {
  const isNew = !!(e?.ctrlKey || e?.metaKey || e?.shiftKey);
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
  await navigate(
    anchor
      ? { ...tab, href: tab.href + "#" + encodeURIComponent(anchor) }
      : tab,
  );
  if (anchor) document.getElementById(decode(anchor))?.scrollIntoView();
  if (typeof window !== "undefined" && window.innerWidth <= 760) {
    leftOpen.value = false;
    rightOpen.value = false;
  }
}
function openGraph(filter = "") {
  filter = migrateQuery(filter);
  const tab = {
    key: "graph:" + filter,
    noteId: current.value?.id,
    title: /^(path:历史|path:"历史)/.test(filter)
      ? "历史图谱"
      : filter
        ? "筛选图谱"
        : "全局图谱",
    href:
      (current.value?.route || "/") +
      "?view=graph" +
      (filter ? "&filter=" + encodeURIComponent(filter) : ""),
    filter,
  };
  if (!tabs.value.some((t) => t.key === tab.key)) tabs.value.push(tab);
  navigate(tab);
  if (typeof window !== "undefined" && window.innerWidth <= 760) {
    leftOpen.value = false;
    rightOpen.value = false;
  }
}
function closeTab(key: string) {
  const at = tabs.value.findIndex((t) => t.key === key);
  if (at < 0) return;
  const wasActive = active.value === key;
  tabs.value.splice(at, 1);
  scrolls.delete(key);
  if (wasActive) {
    const next = tabs.value[Math.min(at, tabs.value.length - 1)];
    if (next) navigate(next);
    else {
      const home = notes.find((n) => n.id === "index.md")!;
      openNote(home);
    }
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
      .querySelector(".tree-note.active")
      ?.scrollIntoView({ block: "nearest" }),
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
  if (isEmbedded.value) return;
  if (e.key === "Escape") {
    modal.value = null;
    preview.value = null;
    if (window.innerWidth <= 760) {
      leftOpen.value = false;
      rightOpen.value = false;
    }
  }
  if (!(e.metaKey || e.ctrlKey) || e.altKey) return;
  if (e.key.toLowerCase() === "o") {
    e.preventDefault();
    showModal("quick");
  } else if (e.key.toLowerCase() === "p") {
    e.preventDefault();
    showModal("commands");
  } else if (e.key.toLowerCase() === "w" && tabs.value.length > 1) {
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
    history.replaceState(history.state, "", hit.url.href);
    return;
  }
  openNote(hit.note, e, decode(hit.url.hash.slice(1)));
}
function hover(e: MouseEvent | FocusEvent) {
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
function jumpHeading(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  if (window.innerWidth <= 760) rightOpen.value = false;
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
watch(modalQuery, () => (modalIndex.value = 0));
watch(query, loadSearch);
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
    leftOpen.value = false;
    rightOpen.value = false;
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
  if (window.innerWidth <= 760) {
    leftOpen.value = false;
    rightOpen.value = false;
  }
  restoring = false;
  const resumed =
    state.active && tabs.value.find((t) => t.key === state.active);
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
  window.removeEventListener("keydown", shortcut);
  window.removeEventListener("popstate", syncRoute);
  router.onAfterRouteChanged = oldAfter;
  cleanupResize?.();
  clearTimeout(previewTimer);
});
</script>
<template>
  <div
    class="vault-shell"
    :style="{
      '--left-width': leftWidth + 'px',
      '--right-width': rightWidth + 'px',
    }"
  >
    <a class="vault-skip" href="#vault-document">跳到正文</a>
    <nav class="vault-ribbon" aria-label="工具栏">
      <button
        class="icon-button ribbon-toggle"
        aria-label="切换文件侧栏"
        title="文件侧栏"
        @click="leftOpen = !leftOpen"
      >
        <Icon name="left" />
      </button>
      <button
        class="icon-button"
        aria-label="全文搜索"
        title="全文搜索"
        @click="showSearch"
      >
        <Icon name="search" />
      </button>
      <button
        class="icon-button"
        aria-label="打开全局图谱"
        title="全局图谱"
        @click="openGraph()"
      >
        <Icon name="graph" />
      </button>
      <button
        class="icon-button"
        aria-label="快速切换笔记"
        title="快速切换 · Ctrl/⌘ O"
        @click="showModal('quick')"
      >
        <Icon name="file" />
      </button>
      <button
        class="icon-button"
        aria-label="命令面板"
        title="命令面板 · Ctrl/⌘ P"
        @click="showModal('commands')"
      >
        <Icon name="command" />
      </button>
      <div class="ribbon-spacer" />
      <button
        class="icon-button"
        :aria-label="isDark ? '切换浅色主题' : '切换深色主题'"
        title="切换主题"
        @click="toggleTheme"
      >
        <Icon :name="isDark ? 'sun' : 'moon'" />
      </button>
      <button
        class="icon-button"
        aria-label="工作台命令"
        title="工作台命令"
        @click="showModal('commands')"
      >
        <Icon name="settings" />
      </button>
    </nav>
    <button
      v-if="leftOpen || rightOpen"
      class="vault-drawer-backdrop"
      aria-label="关闭侧栏"
      @click="
        leftOpen = false;
        rightOpen = false;
      "
    />
    <aside v-show="leftOpen" class="vault-left" aria-label="文件与搜索">
      <div class="sidebar-tabbar">
        <button
          :class="['icon-button', { selected: pane === 'files' }]"
          aria-label="文件列表"
          title="文件列表"
          @click="pane = 'files'"
        >
          <Icon name="folder" /></button
        ><button
          :class="['icon-button', { selected: pane === 'search' }]"
          aria-label="搜索面板"
          title="搜索面板"
          @click="showSearch"
        >
          <Icon name="search" /></button
        ><button
          :class="['icon-button', { selected: pane === 'categories' }]"
          aria-label="分类浏览"
          title="分类浏览"
          @click="pane = 'categories'"
        >
          <Icon name="list" /></button
        ><span /><button
          class="icon-button mobile-only"
          aria-label="关闭文件侧栏"
          @click="leftOpen = false"
        >
          <Icon name="close" /></button
        ><button
          v-if="pane === 'files'"
          class="icon-button"
          title="定位当前笔记"
          aria-label="定位当前笔记"
          @click="reveal"
        >
          <Icon name="file" :size="16" />
        </button>
      </div>
      <div v-if="pane === 'files'" class="file-actions">
        <span>文件</span
        ><button
          class="icon-button"
          title="折叠所有文件夹"
          aria-label="折叠所有文件夹"
          @click="expanded = []"
        >
          <Icon name="list" :size="15" />
        </button>
      </div>
      <div v-if="pane === 'files'" class="file-tree-scroll">
        <FileTree
          :branch="tree"
          :current="current?.id || ''"
          :expanded="expanded"
          @toggle="toggleFolder"
          @open="openNote"
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
            <strong>{{ result.note.title }}</strong
            ><small>{{ result.note.folder }}</small>
            <p>{{ result.context }}</p>
          </button>
          <p v-if="searchReady && !results.length" class="empty-hint">
            没有找到匹配的笔记
          </p>
        </div>
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
        <button
          v-if="!leftOpen"
          class="icon-button"
          aria-label="打开文件侧栏"
          @click="leftOpen = true"
        >
          <Icon name="left" />
        </button>
        <div class="tab-scroll">
          <div
            v-for="tab in tabs"
            :key="tab.key"
            :class="['vault-tab', { active: tab.key === active }]"
          >
            <button
              role="tab"
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
          class="icon-button"
          aria-label="切换辅助侧栏"
          title="辅助侧栏"
          @click="rightOpen = !rightOpen"
        >
          <Icon name="right" />
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
            :index="index"
            :active-note="current?.id"
            :filter="graphFilter"
            @open="openNote"
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
        @mouseover="hover"
        @mouseout="leave"
        @focusin="hover"
        @focusout="leave"
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
    <aside v-show="rightOpen" class="vault-right" aria-label="笔记辅助面板">
      <div class="sidebar-tabbar">
        <button
          :class="['icon-button', { selected: rightTab === 'outline' }]"
          aria-label="笔记目录"
          title="目录"
          @click="rightTab = 'outline'"
        >
          <Icon name="list" /></button
        ><button
          :class="['icon-button', { selected: rightTab === 'links' }]"
          aria-label="双向链接"
          title="反向链接与出链"
          @click="rightTab = 'links'"
        >
          <Icon name="link" /></button
        ><span /><button
          class="icon-button mobile-only"
          aria-label="关闭辅助侧栏"
          @click="rightOpen = false"
        >
          <Icon name="close" />
        </button>
      </div>
      <div class="vault-right-scroll">
        <section
          v-if="current?.categories.length"
          class="vault-classifications"
        >
          <h2>
            分类
            <small v-if="current.classificationStatus === 'provisional'"
              >待补充正文</small
            >
          </h2>
          <div v-for="category in current.categories" :key="category.path">
            <button @click="browseCategory(category.path)">
              {{ category.path }}
              <small>{{
                category.path === current.primaryCategory
                  ? "主分类"
                  : "交叉分类"
              }}</small>
            </button>
            <details>
              <summary>分类理由</summary>
              <p>{{ category.reason }}</p>
            </details>
          </div>
        </section>
        <section v-if="rightTab === 'outline'" class="vault-outline">
          <h2>目录</h2>
          <button
            v-for="h in current?.headings.filter((h) => h.level > 1)"
            :key="h.id"
            :style="{ paddingLeft: (h.level - 2) * 12 + 12 + 'px' }"
            @click="jumpHeading(h.id)"
          >
            {{ h.title }}
          </button>
          <p
            v-if="!current?.headings.some((h) => h.level > 1)"
            class="empty-hint"
          >
            当前笔记没有小节
          </p>
        </section>
        <template v-else
          ><section class="vault-relations">
            <h2>
              反向链接 <small>{{ backlinks.length }}</small>
            </h2>
            <button
              v-for="link in backlinks"
              :key="link.source + link.relationType + link.label + link.anchor"
              @click="openRelation(link, true, $event)"
            >
              <strong>{{ relationTitle(link, true) }}</strong>
              <small
                >{{ relationName(link) }} ·
                {{ link.status === "inferred" ? "推断" : "已确认" }}</small
              >
              <p>{{ link.explanation || link.context }}</p>
              <span class="relation-evidence"
                >证据：{{ link.evidence || link.context }}</span
              >
            </button>
            <p v-if="!backlinks.length" class="empty-hint">
              没有笔记链接到此处
            </p>
          </section>
          <section class="vault-relations">
            <h2>
              出链 <small>{{ outlinks.length }}</small>
            </h2>
            <button
              v-for="link in outlinks"
              :key="
                (link.target || link.reference) +
                link.relationType +
                link.label +
                link.anchor
              "
              :disabled="!link.target"
              @click="openRelation(link, false, $event)"
            >
              <strong
                >{{ relationTitle(link)
                }}<small v-if="link.reason">
                  · {{ !link.target ? "未解析" : "标题未找到" }}</small
                ></strong
              >
              <small
                >{{ relationName(link) }} ·
                {{ link.status === "inferred" ? "推断" : "已确认" }}</small
              >
              <p>{{ link.explanation || link.context }}</p>
              <span class="relation-evidence"
                >证据：{{ link.evidence || link.context }}</span
              >
            </button>
            <p v-if="!outlinks.length" class="empty-hint">当前笔记没有出链</p>
          </section></template
        >
        <section class="vault-local">
          <h2>
            <button @click="localOpen = !localOpen" :aria-expanded="localOpen">
              <Icon
                name="chevron"
                :size="12"
                :class="{ rotated: localOpen }"
              />局部图谱</button
            ><label
              >深度
              <select v-model.number="localDepth" aria-label="局部图谱深度">
                <option v-for="depth in 5" :value="depth">{{ depth }}</option>
              </select></label
            >
          </h2>
          <div
            v-if="localOpen && current && rightOpen && !isEmbedded"
            class="local-graph-container"
          >
            <ClientOnly
              ><VaultGraph
                :index="index"
                :current="current.id"
                :active-note="current.id"
                :depth="localDepth"
                compact
                :enabled="rightOpen && !isEmbedded"
                @open="openNote"
                @expand="openGraph()"
            /></ClientOnly>
          </div>
          <button
            class="local-list-toggle"
            @click="localListOpen = !localListOpen"
            :aria-expanded="localListOpen"
          >
            局部节点列表 · {{ localNeighbors.length }}
          </button>
          <div
            v-if="localListOpen"
            class="local-node-list"
            aria-label="局部图谱节点列表"
          >
            <button
              v-for="note in localNeighbors"
              :key="note.id"
              @click="openNote(note, $event)"
            >
              {{ note.title }}
            </button>
          </div>
        </section>
      </div>
    </aside>
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
