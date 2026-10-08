<script setup lang="ts">
import {
  computed,
  onMounted,
  onBeforeUnmount,
  ref,
  watch,
  nextTick,
} from "vue";
import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceX,
  forceY,
} from "d3-force";
import { graphData, defaultGraphSettings } from "../../../vault/graph.mjs";
import {
  restoreGraphSettings,
  readStorage,
} from "../../../vault/workspace.mjs";
import { matchesQuery } from "../../../vault/model.mjs";
import type {
  VaultIndex,
  VaultNote,
  GraphSettings,
} from "../../../vault/types";
import Icon from "./Icon.vue";
const props = withDefaults(
  defineProps<{
    index: VaultIndex;
    current?: string;
    activeNote?: string;
    depth?: number;
    filter?: string;
    compact?: boolean;
    enabled?: boolean;
  }>(),
  { depth: 1, filter: "", enabled: true },
);
const emit = defineEmits<{
  open: [note: VaultNote, event?: MouseEvent];
  expand: [];
}>();
const canvas = ref<HTMLCanvasElement>();
const host = ref<HTMLElement>();
const showSettings = ref(false);
const showList = ref(false);
const settings = ref<GraphSettings>(defaultGraphSettings());
const hovered = ref<any>();
const count = ref(0);
const selected = ref("");
const documents = ref<{ id: string; text: string }[]>([]);
const textLoading = ref(false);
const texts = computed(
  () => new Map(documents.value.map((d) => [d.id, d.text])),
);
let searchPromise: Promise<void> | null = null;
async function loadFilterText() {
  const queries = [
    settings.value.query,
    ...settings.value.groups.map((g) => g.query),
  ];
  if (
    documents.value.length ||
    !queries.some((q) =>
      (q.match(/-?(?:path:|tag:|category:|origin:)?"[^"]+"|\S+/g) || []).some(
        (w) => !/^(-?path:|-?tag:|-?category:|-?origin:)/.test(w),
      ),
    )
  )
    return;
  if (!searchPromise) {
    textLoading.value = true;
    searchPromise = import("../../../vault/search.data")
      .then((m) => {
        documents.value = m.data;
      })
      .finally(() => (textLoading.value = false));
  }
  await searchPromise;
}
watch(() => [settings.value.query, settings.value.groups], loadFilterText, {
  deep: true,
});
const data = computed(() =>
  graphData(
    props.index,
    { ...settings.value, query: props.compact ? "" : settings.value.query },
    props.current,
    props.depth,
    documents.value,
  ),
);
let simulation: any,
  nodes: any[] = [],
  edges: any[] = [],
  width = 1,
  height = 1,
  scale = 1,
  offset = { x: 0, y: 0 },
  observer: ResizeObserver,
  themeObserver: MutationObserver,
  frame = 0;
let palette: any = {};
const pointers = new Map<number, { x: number; y: number }>();
let drag: any = null,
  moved = false,
  start = { x: 0, y: 0 },
  previous = { x: 0, y: 0 },
  pinchDistance = 0,
  pinchMid = { x: 0, y: 0 };
let pendingFit = false;
const storage = "steam-vault-graph-v1";
const storageKey = () =>
  storage + (props.compact ? ":local" : props.filter ? ":" + props.filter : "");
function colors() {
  if (!host.value) return;
  const css = getComputedStyle(host.value);
  palette = {
    node: css.getPropertyValue("--graph-node").trim(),
    line: css.getPropertyValue("--graph-line").trim(),
    text: css.getPropertyValue("--vault-muted").trim(),
    accent: css.getPropertyValue("--vault-accent").trim(),
    dim: css.getPropertyValue("--graph-dim").trim(),
  };
  schedule();
}
function schedule() {
  if (!frame && props.enabled && !document.hidden)
    frame = requestAnimationFrame(() => {
      frame = 0;
      draw();
    });
}
function draw() {
  const c = canvas.value,
    ctx = c?.getContext("2d");
  if (!ctx) return;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.translate(width / 2 + offset.x, height / 2 + offset.y);
  ctx.scale(scale, scale);
  const focus = hovered.value?.id || selected.value;
  const neighbors = new Set([focus]);
  for (const e of edges)
    if (e.source.id === focus || e.target.id === focus) {
      neighbors.add(e.source.id);
      neighbors.add(e.target.id);
    }
  ctx.lineWidth = settings.value.lineWidth / Math.sqrt(scale);
  for (const e of edges) {
    const connected = e.source.id === focus || e.target.id === focus;
    ctx.globalAlpha = focus ? (connected ? 0.8 : 0.13) : 0.6;
    ctx.strokeStyle = connected ? palette.accent : palette.line;
    ctx.beginPath();
    ctx.moveTo(e.source.x, e.source.y);
    ctx.lineTo(e.target.x, e.target.y);
    ctx.stroke();
    if (settings.value.arrows) {
      if (e.forward) arrow(ctx, e.source, e.target);
      if (e.backward) arrow(ctx, e.target, e.source);
    }
  }
  for (const n of nodes) {
    const highlighted = n.id === props.activeNote || n.id === focus;
    ctx.globalAlpha = focus && !neighbors.has(n.id) ? 0.2 : 1;
    ctx.fillStyle = highlighted
      ? palette.accent
      : settings.value.groups.find(
          (g) =>
            g.query &&
            n.note &&
            matchesQuery(n.note, g.query, texts.value.get(n.id) || ""),
        )?.color || palette.node;
    ctx.beginPath();
    ctx.arc(n.x, n.y, radius(n), 0, Math.PI * 2);
    ctx.fill();
    const alpha = highlighted
      ? 1
      : Math.min(
          1,
          Math.max(0, (scale - settings.value.labelThreshold + 0.35) / 0.6),
        );
    if (alpha > 0) {
      ctx.globalAlpha *= alpha;
      ctx.font = `${11 / Math.sqrt(scale)}px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif`;
      ctx.textAlign = "center";
      ctx.fillStyle = highlighted ? palette.accent : palette.text;
      ctx.fillText(n.title, n.x, n.y + radius(n) + 15 / Math.sqrt(scale));
    }
  }
  ctx.globalAlpha = 1;
}
function arrow(ctx: CanvasRenderingContext2D, from: any, to: any) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x),
    r = radius(to) + 2;
  const x = to.x - Math.cos(angle) * r,
    y = to.y - Math.sin(angle) * r;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - Math.cos(angle - 0.5) * 6, y - Math.sin(angle - 0.5) * 6);
  ctx.lineTo(x - Math.cos(angle + 0.5) * 6, y - Math.sin(angle + 0.5) * 6);
  ctx.closePath();
  ctx.fillStyle = ctx.strokeStyle;
  ctx.fill();
}
function radius(n: any) {
  return (3 + Math.sqrt(n.degree || 0) * 0.7) * settings.value.nodeSize;
}
function rebuild() {
  simulation?.stop();
  const previousNodes = new Map(nodes.map((n) => [n.id, n]));
  const d = data.value;
  nodes = d.nodes.map((n) => ({
    ...n,
    ...(previousNodes.has(n.id)
      ? { x: previousNodes.get(n.id).x, y: previousNodes.get(n.id).y }
      : {}),
  }));
  edges = d.edges.map((e) => ({ ...e }));
  count.value = nodes.length;
  hovered.value = null;
  simulation = forceSimulation(nodes)
    .force("charge", forceManyBody().strength(-settings.value.repel))
    .force(
      "link",
      forceLink(edges)
        .id((n: any) => n.id)
        .distance(settings.value.distance)
        .strength(settings.value.link),
    )
    .force("x", forceX(0).strength(settings.value.center))
    .force("y", forceY(0).strength(settings.value.center))
    .on("tick", schedule)
    .on("end", () => {
      if (pendingFit) {
        fit();
        pendingFit = false;
      }
    });
  if (!props.enabled) simulation.stop();
  schedule();
}
function fit() {
  if (!nodes.length) return;
  const xs = nodes.map((n) => n.x || 0),
    ys = nodes.map((n) => n.y || 0);
  const minx = Math.min(...xs),
    maxx = Math.max(...xs),
    miny = Math.min(...ys),
    maxy = Math.max(...ys);
  scale = Math.max(
    0.12,
    Math.min(
      2,
      (width - 80) / (maxx - minx + 80),
      (height - 80) / (maxy - miny + 80),
    ),
  );
  offset = { x: (-(maxx + minx) / 2) * scale, y: (-(maxy + miny) / 2) * scale };
  schedule();
}
function zoom(factor: number, x = width / 2, y = height / 2) {
  const next = Math.max(0.12, Math.min(5, scale * factor));
  const px = x - width / 2,
    py = y - height / 2;
  offset = {
    x: px - ((px - offset.x) * next) / scale,
    y: py - ((py - offset.y) * next) / scale,
  };
  scale = next;
  schedule();
}
function position(e: PointerEvent | WheelEvent) {
  const r = canvas.value!.getBoundingClientRect();
  return { x: e.clientX - r.left, y: e.clientY - r.top };
}
function hit(p: { x: number; y: number }) {
  const x = (p.x - width / 2 - offset.x) / scale,
    y = (p.y - height / 2 - offset.y) / scale;
  return [...nodes]
    .reverse()
    .find((n) => Math.hypot(n.x - x, n.y - y) < radius(n) + 6 / scale);
}
function down(e: PointerEvent) {
  if (e.button !== 0) return;
  canvas.value?.focus();
  canvas.value?.setPointerCapture(e.pointerId);
  const p = position(e);
  pointers.set(e.pointerId, p);
  start = p;
  previous = p;
  moved = false;
  if (pointers.size === 1) {
    drag = hit(p);
    if (drag) {
      drag.fx = drag.x;
      drag.fy = drag.y;
      simulation.alphaTarget(0.15).restart();
    }
  } else {
    if (drag) {
      drag.fx = null;
      drag.fy = null;
      drag = null;
      simulation.alphaTarget(0);
    }
    const [a, b] = [...pointers.values()];
    pinchDistance = Math.hypot(a.x - b.x, a.y - b.y);
    pinchMid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    moved = true;
  }
}
function move(e: PointerEvent) {
  const p = position(e);
  if (!pointers.has(e.pointerId)) {
    hovered.value = hit(p);
    if (canvas.value)
      canvas.value.style.cursor = hovered.value ? "pointer" : "grab";
    schedule();
    return;
  }
  pointers.set(e.pointerId, p);
  if (Math.hypot(p.x - start.x, p.y - start.y) > 4) moved = true;
  if (pointers.size === 2) {
    const [a, b] = [...pointers.values()];
    const d = Math.hypot(a.x - b.x, a.y - b.y),
      mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    if (pinchDistance) zoom(d / pinchDistance, mid.x, mid.y);
    offset.x += mid.x - pinchMid.x;
    offset.y += mid.y - pinchMid.y;
    pinchDistance = d;
    pinchMid = mid;
  } else if (drag) {
    drag.fx = (p.x - width / 2 - offset.x) / scale;
    drag.fy = (p.y - height / 2 - offset.y) / scale;
  } else {
    offset.x += p.x - previous.x;
    offset.y += p.y - previous.y;
  }
  previous = p;
  schedule();
}
function up(e: PointerEvent) {
  const n = drag;
  pointers.delete(e.pointerId);
  if (drag) {
    drag.fx = null;
    drag.fy = null;
    simulation.alphaTarget(0);
    drag = null;
  }
  if (!moved && n) open(n, e as any);
  pinchDistance = 0;
  if (pointers.size === 1) {
    previous = [...pointers.values()][0];
    moved = true;
  }
}
function cancel(e: PointerEvent) {
  moved = true;
  up(e);
}
function open(n: any, e?: MouseEvent) {
  if (n.kind === "note") emit("open", n.note, e);
  else if (n.kind === "attachment") {
    const a = props.index.attachments.find((a) => a.id === n.id);
    if (a) window.open("/notes" + a.route, "_blank", "noopener");
  } else if (n.kind === "tag") settings.value.query = "tag:" + n.title.slice(1);
}
function wheel(e: WheelEvent) {
  const p = position(e);
  zoom(Math.exp(-e.deltaY * 0.0015), p.x, p.y);
}
function key(e: KeyboardEvent) {
  if (
    [
      "+",
      "=",
      "-",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "0",
      "Home",
      "Escape",
    ].includes(e.key)
  ) {
    e.preventDefault();
    if (e.key === "+" || e.key === "=") zoom(1.2);
    else if (e.key === "-") zoom(1 / 1.2);
    else if (e.key === "0" || e.key === "Home") fit();
    else if (e.key === "Escape") selected.value = "";
    else {
      offset.x += e.key === "ArrowLeft" ? 40 : e.key === "ArrowRight" ? -40 : 0;
      offset.y += e.key === "ArrowUp" ? 40 : e.key === "ArrowDown" ? -40 : 0;
      schedule();
    }
  }
}
function visibility() {
  if (document.hidden) {
    simulation?.stop();
    cancelAnimationFrame(frame);
    frame = 0;
  } else if (props.enabled) {
    resize();
    simulation?.alpha(0.1).restart();
    schedule();
  }
}
function resize() {
  if (!host.value || !canvas.value) return;
  const wasHidden = width <= 1 || height <= 1;
  const rect = host.value.getBoundingClientRect();
  width = Math.max(1, rect.width);
  height = Math.max(1, rect.height);
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.value.width = width * dpr;
  canvas.value.height = height * dpr;
  canvas.value.style.width = width + "px";
  canvas.value.style.height = height + "px";
  if (props.compact && wasHidden && nodes.length) fit();
  schedule();
}
watch(
  () => props.filter,
  (value) => {
    settings.value = restoreGraphSettings(readStorage(storageKey()));
    if (value) settings.value.query = value;
  },
);
watch(
  data,
  () => {
    if (canvas.value) rebuild();
  },
  { deep: true },
);
watch(
  () => [
    settings.value.nodeSize,
    settings.value.lineWidth,
    settings.value.labelThreshold,
    settings.value.arrows,
    settings.value.groups,
    props.activeNote,
  ],
  schedule,
  { deep: true },
);
watch(
  () => [
    settings.value.center,
    settings.value.repel,
    settings.value.link,
    settings.value.distance,
  ],
  () => {
    if (canvas.value) rebuild();
  },
);
watch(
  settings,
  () => {
    try {
      localStorage.setItem(storageKey(), JSON.stringify(settings.value));
    } catch {}
  },
  { deep: true },
);
watch(
  () => props.enabled,
  (enabled) => {
    if (enabled) {
      resize();
      simulation?.alpha(0.1).restart();
      schedule();
    } else {
      simulation?.stop();
      cancelAnimationFrame(frame);
      frame = 0;
    }
  },
);
onMounted(async () => {
  try {
    settings.value = restoreGraphSettings(readStorage(storageKey()));
  } catch {}
  if (props.filter) settings.value.query = props.filter;
  await nextTick();
  document.addEventListener("visibilitychange", visibility);
  colors();
  resize();
  rebuild();
  pendingFit = true;
  observer = new ResizeObserver(resize);
  observer.observe(host.value!);
  themeObserver = new MutationObserver(colors);
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  setTimeout(() => {
    if (canvas.value) {
      fit();
      pendingFit = false;
    }
  }, 700);
});
onBeforeUnmount(() => {
  simulation?.stop();
  document.removeEventListener("visibilitychange", visibility);
  observer?.disconnect();
  themeObserver?.disconnect();
  cancelAnimationFrame(frame);
});
</script>
<template>
  <div ref="host" :class="['vault-graph', { compact }]">
    <canvas
      ref="canvas"
      tabindex="0"
      :aria-label="
        compact
          ? '局部图谱；加减键缩放，方向键平移，Home 适合屏幕'
          : '知识图谱；加减键缩放，方向键平移，Home 适合屏幕。使用节点列表选择笔记'
      "
      @pointerdown="down"
      @pointermove="move"
      @pointerup="up"
      @pointercancel="cancel"
      @pointerleave="
        hovered = null;
        schedule();
      "
      @wheel.prevent="wheel"
      @keydown="key"
    />
    <div class="graph-toolbar">
      <button
        v-if="!compact"
        class="icon-button"
        title="图谱设置"
        aria-label="图谱设置"
        :aria-expanded="showSettings"
        @click="showSettings = !showSettings"
      >
        <Icon name="settings" />
      </button>
      <button
        class="icon-button"
        title="适合屏幕"
        aria-label="适合屏幕"
        @click="fit"
      >
        <Icon name="fit" />
      </button>
      <button
        v-if="compact"
        class="icon-button"
        title="打开全局图谱"
        aria-label="打开全局图谱"
        @click="emit('expand')"
      >
        <Icon name="graph" :size="15" />
      </button>
      <button
        v-else
        class="icon-button"
        title="节点列表"
        aria-label="节点列表"
        :aria-expanded="showList"
        @click="showList = !showList"
      >
        <Icon name="list" />
      </button>
    </div>
    <div v-if="hovered" class="graph-tooltip">{{ hovered.title }}</div>
    <div v-if="!compact" class="graph-caption">
      {{ count }} 个节点 <span>· 拖动平移 · 滚轮缩放</span
      ><button aria-label="放大图谱" @click="zoom(1.2)">+</button
      ><button aria-label="缩小图谱" @click="zoom(1 / 1.2)">−</button>
    </div>
    <p v-if="textLoading" class="graph-empty">正在加载全文筛选…</p>
    <p v-else-if="!count" class="graph-empty">没有符合筛选条件的笔记</p>
    <section
      v-if="showSettings && !compact"
      class="graph-settings"
      aria-label="图谱设置面板"
    >
      <details open>
        <summary>过滤</summary>
        <label
          >分类<select v-model="settings.category" aria-label="图谱分类">
            <option value="">全部分类</option>
            <option
              v-for="category in index.categories || []"
              :key="category.id"
              :value="category.id"
            >
              {{ category.id }}
            </option>
          </select></label
        >
        <label
          >关系状态<select
            v-model="settings.relationStatus"
            aria-label="图谱关系状态"
          >
            <option value="all">全部关系</option>
            <option value="confirmed">已确认</option>
            <option value="inferred">推断</option>
          </select></label
        >
        <fieldset class="graph-relation-types">
          <legend>关系类型</legend>
          <label
            v-for="type in [
              { id: 'citation', name: '引用' },
              { id: 'similar', name: '相似主题' },
              { id: 'subordinate', name: '从属' },
              { id: 'causal', name: '因果' },
            ]"
            :key="type.id"
          >
            <input
              v-model="settings.relationTypes"
              type="checkbox"
              :value="type.id"
            />{{ type.name }}
          </label>
        </fieldset>
        <label
          >搜索<input
            v-model="settings.query"
            placeholder="搜索笔记、path:历史/、tag:历史"
            aria-label="图谱过滤" /></label
        ><label
          v-for="[key, title] of [
            ['orphans', '孤立笔记'],
            ['tags', '标签'],
            ['attachments', '附件'],
          ]"
          :key="key"
          class="check"
          ><span>{{ title }}</span
          ><input v-model="settings[key]" type="checkbox"
        /></label>
      </details>
      <details>
        <summary>分组</summary>
        <div v-for="(group, i) in settings.groups" :key="i" class="color-group">
          <input
            v-model="group.query"
            placeholder="path:历史/"
            aria-label="分组筛选"
          /><input
            v-model="group.color"
            type="color"
            aria-label="分组颜色"
          /><button
            class="icon-button"
            aria-label="删除分组"
            @click="settings.groups.splice(i, 1)"
          >
            <Icon name="close" :size="12" />
          </button>
        </div>
        <button
          class="vault-button"
          @click="settings.groups.push({ query: '', color: '#a88bfa' })"
        >
          添加分组
        </button>
      </details>
      <details>
        <summary>显示</summary>
        <label class="check"
          ><span>箭头</span
          ><input v-model="settings.arrows" type="checkbox" /></label
        ><label
          >节点尺寸<input
            v-model.number="settings.nodeSize"
            type="range"
            min="0.5"
            max="3"
            step="0.1" /></label
        ><label
          >连线宽度<input
            v-model.number="settings.lineWidth"
            type="range"
            min="0.2"
            max="3"
            step="0.1" /></label
        ><label
          >文字显示缩放阈值<input
            v-model.number="settings.labelThreshold"
            type="range"
            min="0.1"
            max="3"
            step="0.1"
        /></label>
      </details>
      <details>
        <summary>力</summary>
        <label
          >向心力<input
            v-model.number="settings.center"
            type="range"
            min="0.01"
            max="0.3"
            step="0.01" /></label
        ><label
          >排斥力<input
            v-model.number="settings.repel"
            type="range"
            min="20"
            max="600"
            step="10" /></label
        ><label
          >连接力<input
            v-model.number="settings.link"
            type="range"
            min="0.05"
            max="1"
            step="0.05" /></label
        ><label
          >连线距离<input
            v-model.number="settings.distance"
            type="range"
            min="20"
            max="180"
            step="5"
        /></label>
      </details>
      <button
        class="vault-button"
        @click="
          settings = defaultGraphSettings();
          fit();
        "
      >
        恢复默认设置
      </button>
    </section>
    <section
      v-if="showList && !compact"
      class="graph-node-list"
      aria-label="图谱节点列表"
    >
      <h3>节点 · {{ count }}</h3>
      <button
        v-for="node in data.nodes"
        :key="node.id"
        @focus="
          selected = node.id;
          schedule();
        "
        @blur="
          selected = '';
          schedule();
        "
        @click="open(node, $event)"
      >
        {{ node.title }}<small>{{ node.degree }} 条连接</small>
      </button>
    </section>
  </div>
</template>
