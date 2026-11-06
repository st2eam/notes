<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { withBase } from "vitepress";
import type { VaultNote, GeoVariant } from "../../../vault/types";
import { describePlace, mapPlaces, mapYearOptions, noteGeoTime, selectHistoricalMap, timeLabel, yearLabel } from "../../../vault/geo.mjs";
import { landMap } from "../../../vault/geo-catalog.mjs";
import Icon from "./Icon.vue";
import "leaflet/dist/leaflet.css";

const props = defineProps<{ note: VaultNote; notes: VaultNote[]; enabled: boolean }>();
const emit = defineEmits<{ open: [note: VaultNote, event: MouseEvent] }>();
const host = ref<HTMLElement>();
const selectedYear = ref<number | null>(null);
const selectedVariants = ref<Record<string, string>>({});
const selectedPlace = ref("");
const busy = ref(false);
const failures = ref<string[]>([]);
const rawPlaces = computed(() => mapPlaces(props.note, props.notes));
const time = computed(() => noteGeoTime(props.note));
const years = computed(() => mapYearOptions(props.note, rawPlaces.value));
const places = computed(() => rawPlaces.value.map((item: any) =>
  describePlace(item, selectedYear.value, selectedVariants.value[item.key])));
const historical = computed(() => selectHistoricalMap(props.note, selectedYear.value));
const hasGeometry = computed(() => places.value.some((p: any) => p.variant));
const countLabel = computed(() => `${places.value.length} 处`);
const snapshotNote = computed(() => {
  if (!historical.value) return selectedYear.value == null ? "选择年代后匹配历史疆域" : "该时期暂无已核验疆域数据";
  return historical.value.year === selectedYear.value ? "代表年份疆域概览" : "代表年份参照，与事件当年疆域可能不同";
});
const sourceList = computed(() => {
  const sources = [landMap, ...(historical.value ? [historical.value] : []),
    ...places.value.flatMap((p: any) => p.variant ? [p.variant] : [])];
  return [...new Map(sources.map((s) => [s.source.url + s.accuracy, s])).values()];
});
function initialSelection() {
  selectedVariants.value = {};
  selectedPlace.value = "";
  const snapshot = props.note.geo?.place?.variants.find((v) => v.snapshotYear)?.snapshotYear;
  selectedYear.value = snapshot ?? time.value?.from ?? null;
  failures.value = [];
}
watch(() => props.note.id, initialSelection, { immediate: true, flush: "sync" });

let leaflet: any;
let map: any;
let landLayer: any;
let backgroundLayer: any;
let placeLayer: any;
let observer: ResizeObserver | undefined;
let request: AbortController | undefined;
let generation = 0;
let alive = false;
const cache = new Map<string, any>();
const placeLayers = new Map<string, any>();
const labelMarkers: { marker: any; position: any; text: string; chosen: boolean }[] = [];
let allBounds: any;

function textNode(text: string, className = "") {
  const el = document.createElement("span");
  el.textContent = text;
  if (className) el.className = className;
  return el;
}
function popupContent(item: any) {
  const el = document.createElement("div");
  el.append(textNode(item.label, "note-map-popup-title"));
  const detail = document.createElement("p");
  detail.textContent = item.variant.accuracy + (item.variant.snapshotYear ? ` · ${yearLabel(item.variant.snapshotYear)}` : "");
  el.append(detail);
  return el;
}
function styleTokens() {
  const style = getComputedStyle(host.value!);
  return {
    mark: style.getPropertyValue("--map-mark").trim(),
    surface: style.getPropertyValue("--map-water").trim(),
    border: style.getPropertyValue("--map-boundary").trim(),
  };
}
async function geojson(path: string, signal: AbortSignal) {
  if (cache.has(path)) return cache.get(path);
  const response = await fetch(withBase(path), { signal });
  if (!response.ok) throw new Error(`Map resource: ${response.status}`);
  const value = await response.json();
  if (value.type !== "FeatureCollection" || !Array.isArray(value.features)) throw new Error("Invalid GeoJSON");
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
  cache.set(path, value);
  return value;
}
function clearLayers() {
  landLayer?.clearLayers();
  backgroundLayer?.clearLayers();
  placeLayer?.clearLayers();
  placeLayers.clear();
  labelMarkers.length = 0;
  allBounds = null;
}
function fit() {
  if (!map) return;
  if (allBounds?.isValid()) map.fitBounds(allBounds, {
    paddingTopLeft: [22, 30], paddingBottomRight: [52, 30], maxZoom: 6, animate: false,
  });
  else if (props.note.geo?.scope === "china" || props.note.historyTrack === "china" || props.note.id.startsWith("历史/中国史/"))
    map.setView([34, 108], 3, { animate: false });
  else map.fitWorld({ animate: false });
}
function arrangeLabels() {
  if (!map || !host.value) return;
  const boxes: { x: number; y: number; width: number }[] = [];
  const sorted = [...labelMarkers].sort((a, b) => Number(b.chosen) - Number(a.chosen));
  const width = host.value.clientWidth;
  const height = host.value.clientHeight;
  for (const { marker, position, text } of sorted) {
    const element = marker.getElement();
    if (!element) continue;
    const point = map.latLngToContainerPoint(position);
    const textElement = element.firstElementChild as HTMLElement;
    textElement.style.maxWidth = `${Math.min(150, width - 56)}px`;
    const labelWidth = textElement.getBoundingClientRect().width;
    const candidates = [
      { x: point.x + 9, y: point.y - 11 },
      { x: point.x - labelWidth - 9, y: point.y - 11 },
      { x: point.x - labelWidth / 2, y: point.y + 10 },
      { x: point.x - labelWidth / 2, y: point.y - 31 },
    ];
    const placement = candidates.map((p) => ({ ...p,
      x: Math.max(4, Math.min(width - labelWidth - 4, p.x)),
    })).find(({ x, y }) => y >= 4 && y < height - 30 &&
      // Leave the top-right map controls unobscured.
      !(x + labelWidth > width - 43 && y < 104) &&
      !boxes.some((b) => x < b.x + b.width + 5 && x + labelWidth + 5 > b.x && Math.abs(y - b.y) < 23));
    element.style.visibility = placement ? "visible" : "hidden";
    if (placement) {
      element.style.marginLeft = `${placement.x - point.x}px`;
      element.style.marginTop = `${placement.y - point.y}px`;
      boxes.push({ ...placement, width: labelWidth });
    }
  }
}
function labelAt(position: any, text: string, chosen = false) {
  const label = textNode(text, "note-map-label-text");
  const marker = leaflet.marker(position, {
    icon: leaflet.divIcon({ html: label, className: "note-map-label", iconSize: [150, 22], iconAnchor: [0, 11] }),
    interactive: false, keyboard: false, pane: "mapLabels",
  }).addTo(placeLayer);
  labelMarkers.push({ marker, position, text, chosen });
}
function focusPlace(item: any) {
  selectedPlace.value = item.key;
  const layer = placeLayers.get(selectedPlace.value);
  if (!layer || !map) return;
  if (layer.getLatLng) map.setView(layer.getLatLng(), Math.min(6, Math.max(4, map.getZoom())), { animate: false });
  else if (layer.getBounds?.().isValid()) map.fitBounds(layer.getBounds(), { padding: [28, 28], maxZoom: 6, animate: false });
  layer.openPopup();
}
async function render() {
  request?.abort();
  const serial = ++generation;
  if (!alive || !map) return;
  clearLayers();
  failures.value = [];
  busy.value = false;
  if (!props.enabled) return;
  request = new AbortController();
  const signal = request.signal;
  const items = places.value;
  const historicalMap = historical.value;
  const paths = [landMap.geometry, ...(historicalMap ? [historicalMap.geometry] : []),
    ...items.flatMap((p: any) => p.variant?.geometry ? [p.variant.geometry] : [])];
  busy.value = true;
  const resources = new Map<string, any>();
  const failed: string[] = [];
  await Promise.all([...new Set(paths)].map(async (path) => {
    try { resources.set(path, await geojson(path, signal)); }
    catch (error: any) { if (error.name !== "AbortError") failed.push(path); }
  }));
  if (serial !== generation || !alive || signal.aborted) return;
  const colors = styleTokens();
  const land = resources.get(landMap.geometry);
  if (land) leaflet.geoJSON(land, {
    interactive: false, className: "note-map-land", smoothFactor: 0.6,
    style: { weight: 0.7, fillOpacity: 1 },
  }).addTo(landLayer);
  const background = historicalMap && resources.get(historicalMap.geometry);
  if (background) leaflet.geoJSON(background, {
    style: { color: colors.border, weight: 1, dashArray: "3 3", fillColor: colors.border, fillOpacity: 0.13 },
    onEachFeature(feature: any, layer: any) {
      const name = String(feature.properties?.displayName || feature.properties?.NAME || "历史区域");
      layer.bindTooltip(textNode(name), { direction: "center", className: "note-map-tooltip" });
    },
  }).addTo(backgroundLayer);
  allBounds = leaflet.latLngBounds([]);
  for (const item of items) {
    const v: GeoVariant | undefined = item.variant;
    if (!v) continue;
    let layer: any;
    let labelPosition: any;
    if (v.coordinates) {
      labelPosition = leaflet.latLng(v.coordinates[1], v.coordinates[0]);
      // A transparent outer marker supplies a larger target than the visible dot.
      layer = leaflet.circleMarker(labelPosition, {
        radius: 13, weight: 0, fillOpacity: 0, fill: true,
      }).addTo(placeLayer);
      leaflet.circleMarker(labelPosition, {
        radius: 4.5, color: colors.surface, weight: 2, fillColor: colors.mark,
        fillOpacity: 1, interactive: false,
      }).addTo(placeLayer);
      allBounds.extend(labelPosition);
    } else if (v.geometry && resources.has(v.geometry)) {
      layer = leaflet.geoJSON(resources.get(v.geometry), {
        style: { color: colors.mark, weight: 2, fillColor: colors.mark, fillOpacity: 0.16 },
      }).addTo(placeLayer);
      if (layer.getBounds().isValid()) {
        allBounds.extend(layer.getBounds());
        labelPosition = v.labelCoordinates ? leaflet.latLng(v.labelCoordinates[1], v.labelCoordinates[0]) : layer.getBounds().getCenter();
      }
    }
    if (!layer) continue;
    const key = item.key;
    placeLayers.set(key, layer);
    layer.bindPopup(popupContent(item), { maxWidth: 220, autoPanPadding: [12, 12], className: "note-map-popup" });
    layer.bindTooltip(textNode(item.label), { className: "note-map-tooltip", direction: "top" });
    layer.on("click", () => { selectedPlace.value = key; });
    if (labelPosition) labelAt(labelPosition, item.label, key === selectedPlace.value);
  }
  failures.value = failed;
  busy.value = false;
  await nextTick();
  if (serial !== generation || !alive) return;
  map.invalidateSize();
  fit();
  arrangeLabels();
}
watch([places, historical, () => props.enabled], () => { void render(); }, { flush: "post" });

function retry() {
  if (map) void render();
  else void initializeMap();
}
async function initializeMap() {
  busy.value = true;
  failures.value = [];
  try {
    leaflet = await import("leaflet");
    if (!alive || !host.value) return;
    map = leaflet.map(host.value, {
      zoomControl: false, attributionControl: false, scrollWheelZoom: false,
      minZoom: 0, maxZoom: 7, zoomSnap: 0.25, worldCopyJump: false,
      maxBounds: [[-75, -180], [85, 180]], maxBoundsViscosity: 0.8,
    });
    map.setView([34, 108], 3);
    map.createPane("mapLabels");
    map.getPane("mapLabels").style.zIndex = "450";
    landLayer = leaflet.layerGroup().addTo(map);
    backgroundLayer = leaflet.layerGroup().addTo(map);
    placeLayer = leaflet.layerGroup().addTo(map);
    map.on("moveend zoomend", arrangeLabels);
    observer = new ResizeObserver(() => {
      if (props.enabled && host.value?.clientWidth) {
        map.invalidateSize(); fit(); arrangeLabels();
      }
    });
    observer.observe(host.value);
    await render();
  } catch {
    map?.remove(); map = undefined;
    if (alive) { busy.value = false; failures.value = ["map-engine"]; }
  }
}
onMounted(() => { alive = true; void initializeMap(); });
// CSS classes style the geographic layers; recreate JS-styled marks on theme changes.
let themeObserver: MutationObserver | undefined;
onMounted(() => {
  themeObserver = new MutationObserver(() => { void render(); });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
});
onBeforeUnmount(() => {
  alive = false; generation++; request?.abort(); observer?.disconnect(); themeObserver?.disconnect();
  map?.remove(); cache.clear();
});
</script>

<template>
  <section v-if="rawPlaces.length || note.geo?.locationNote" class="note-map-section" aria-label="关联地点地图">
    <h2>关联地点 <small>{{ countLabel }}</small></h2>
    <div class="note-map-time">
      <span>{{ timeLabel(time) }}</span>
      <label v-if="years.length > 1">
        <span class="note-map-sr-only">地图显示年代</span>
        <select v-model="selectedYear" aria-label="地图显示年代">
          <option v-if="!time" :value="null">选择年代</option>
          <option v-for="year in years" :key="year" :value="year">{{ yearLabel(year) }}</option>
        </select>
      </label>
    </div>
    <div class="note-map-frame" :aria-busy="busy">
      <div ref="host" class="note-map-canvas" role="region" aria-label="历史地点地图，可用方向键平移、加减号缩放；全部地点见下方列表" />
      <div class="note-map-controls" aria-label="地图操作">
        <button type="button" aria-label="放大地图" title="放大" @click="map?.zoomIn()"><Icon name="plus" :size="14" /></button>
        <button type="button" aria-label="缩小地图" title="缩小" @click="map?.zoomOut()"><Icon name="minus" :size="14" /></button>
        <button type="button" aria-label="显示全部关联地点" title="显示全部地点" @click="fit"><Icon name="fit" :size="14" /></button>
      </div>
      <div v-if="busy" class="note-map-loading" role="status">正在载入地理数据…</div>
      <div class="note-map-attribution"><a :href="withBase('/geo/SOURCES.md')" target="_blank" rel="noopener">地图资料</a> · <a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a></div>
    </div>
    <div class="note-map-caption" aria-live="polite">
      <strong v-if="historical">疆域参照：{{ yearLabel(historical.year) }}</strong>
      <span>{{ snapshotNote }}</span>
      <span v-if="!hasGeometry">关联地点尚无可显示的地理资料</span>
      <span v-if="note.geo?.bindingStatus === 'uncertain'">地点或古址存在考证，列表仅表示相关地区；具体说明见数据来源。</span>
    </div>
    <p v-if="failures.length" class="note-map-error" role="status">
      部分地图资源未载入，离线时可能尚未缓存。地点列表仍可使用。
      <button type="button" @click="retry">重试</button>
    </p>
    <div class="note-map-legend" aria-label="地图图例">
      <span><i class="note-map-dot" />地点</span><span><i class="note-map-area" />区域</span><span><i class="note-map-context" />疆域参照</span>
    </div>
    <ul class="note-map-places" aria-label="关联地点列表">
      <li v-for="item in places" :key="item.key" :class="{ 'is-selected': selectedPlace === (item.key) }">
        <div class="note-map-place-row">
          <button type="button" class="note-map-place-focus" :disabled="!item.variant" :aria-label="'在地图上定位' + item.label" @click="focusPlace(item)">
            <i :class="item.place?.kind === 'point' || !item.place ? 'note-map-dot' : 'note-map-area'" />
            <span>{{ item.label }}</span>
          </button>
          <button v-if="item.note" type="button" class="note-map-open" :aria-label="'打开' + item.note.title + '笔记'" title="打开地点笔记" @click="emit('open', item.note, $event)"><Icon name="forward" :size="14" /></button>
        </div>
        <label v-if="item.place?.variants.length > 1" class="note-map-variant">
          <span>历史形态</span>
          <select v-model="selectedVariants[item.key]" :aria-label="item.name + '的历史形态'">
            <option :value="undefined">按年代匹配</option>
            <option v-for="variant in item.place.variants" :key="variant.id" :value="variant.id">{{ variant.name }} · {{ variant.accuracy }}</option>
          </select>
        </label>
        <small v-if="item.missing" class="note-map-place-detail">{{ item.missing }}</small>
        <small v-else class="note-map-place-detail">{{ item.variant.accuracy }}<template v-if="item.variant.snapshotYear"> · {{ yearLabel(item.variant.snapshotYear) }}参照</template></small>
      </li>
    </ul>
    <details class="note-map-sources">
      <summary>数据来源与精度</summary>
      <p v-if="note.geo?.locationNote"><strong>笔记中的地点说明</strong><span>{{ note.geo.locationNote }}</span></p>
      <p v-for="source in sourceList" :key="source.source.url + source.accuracy"><a :href="source.source.url" target="_blank" rel="noopener">{{ source.source.title }}</a><span>{{ source.accuracy }}</span></p>
      <a :href="withBase('/geo/SOURCES.md')" target="_blank" rel="noopener">数据版本、许可与处理说明</a>
    </details>
  </section>
</template>

<style>
.note-map-section {
  --map-water: #edf0f2;
  --map-land: #f8f7f3;
  --map-coast: #c2c5c0;
  --map-boundary: #918575;
  --map-mark: #7852ee;
  margin: 0 0 22px;
  color: var(--vault-text);
}
.dark .note-map-section {
  --map-water: #252c32;
  --map-land: #333631;
  --map-coast: #626961;
  --map-boundary: #a79983;
  --map-mark: #9085e9;
}
.note-map-time {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 5px;
  margin: 0 8px 9px;
  color: var(--vault-detail-muted);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}
.vault-shell .note-map-section select {
  min-width: 0;
  max-width: 100%;
  padding: 3px 5px;
  border: 1px solid var(--vault-border);
  border-radius: 4px;
  background: var(--vault-bg);
  color: var(--vault-text);
  font-size: 11px;
}
.note-map-frame {
  position: relative;
  height: 218px;
  overflow: hidden;
  border: 1px solid var(--vault-border);
  border-radius: 5px;
  isolation: isolate;
}
.note-map-canvas {
  width: 100%;
  height: 100%;
  background: var(--map-water);
  font-family: var(--vp-font-family-base);
  z-index: 0;
}
.note-map-land { fill: var(--map-land); stroke: var(--map-coast); }
.note-map-controls {
  position: absolute;
  top: 8px;
  right: 8px;
  display: grid;
  z-index: 1;
  padding: 2px;
  border: 1px solid var(--vault-border);
  border-radius: 4px;
  background: var(--vault-bg);
}
.vault-shell .note-map-controls button {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 2px;
}
.vault-shell .note-map-controls button:hover { background: var(--vault-hover); }
.note-map-attribution {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 1;
  padding: 2px 5px;
  background: var(--vault-bg);
  color: var(--vault-detail-muted);
  font-size: 9px;
}
.note-map-attribution a { color: inherit; }
.note-map-loading {
  position: absolute;
  bottom: 24px;
  left: 8px;
  right: 8px;
  z-index: 1;
  padding: 5px 7px;
  border-radius: 3px;
  background: var(--vault-bg);
  color: var(--vault-detail-muted);
  font-size: 11px;
  pointer-events: none;
}
.note-map-label { pointer-events: none; }
.note-map-label-text {
  display: inline-block;
  max-width: 150px;
  padding: 2px 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 2px;
  background: color-mix(in srgb, var(--vault-bg) 92%, transparent);
  color: var(--vault-text);
  font-size: 10px;
  line-height: 16px;
}
.note-map-section .leaflet-tooltip,
.note-map-section .leaflet-popup-content-wrapper,
.note-map-section .leaflet-popup-tip {
  background: var(--vault-bg);
  color: var(--vault-text);
  border-color: var(--vault-border);
  box-shadow: none;
}
.note-map-section .leaflet-popup-content { margin: 12px; font-size: 12px; line-height: 1.6; }
.note-map-section .leaflet-popup-content p { margin: 6px 0 0; }
.note-map-popup-title { font-weight: 600; }
.note-map-section .leaflet-container a.leaflet-popup-close-button { color: var(--vault-detail-muted); }
.note-map-caption {
  display: grid;
  gap: 3px;
  padding: 9px 8px 0;
  color: var(--vault-detail-muted);
  font-size: 11px;
  line-height: 1.6;
}
.note-map-caption strong { font-weight: 500; color: var(--vault-text); }
.note-map-legend {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  padding: 9px 8px;
  color: var(--vault-detail-muted);
  font-size: 10px;
}
.note-map-legend > span { display: inline-flex; align-items: center; gap: 5px; }
.note-map-dot,
.note-map-area,
.note-map-context { display: inline-block; flex-shrink: 0; }
.note-map-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--map-mark); }
.note-map-area { width: 11px; height: 9px; border: 1.5px solid var(--map-mark); background: color-mix(in srgb, var(--map-mark) 16%, transparent); }
.note-map-context { width: 11px; height: 0; border-top: 1.5px dashed var(--map-boundary); }
.vault-shell .note-map-places { margin: 0; padding: 0; list-style: none; }
.note-map-places > li { padding: 6px 8px 8px; border-top: 1px solid var(--vault-border); }
.note-map-places > li.is-selected { background: var(--vault-hover); }
.note-map-place-row { display: flex; align-items: flex-start; gap: 4px; }
.vault-shell .note-map-place-focus {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  flex: 1;
  min-width: 0;
  padding: 3px 0;
  text-align: left;
  font-size: 12px;
  line-height: 1.6;
}
.note-map-place-focus i { margin-top: 6px; }
.note-map-place-focus span { overflow-wrap: anywhere; }
.vault-shell .note-map-place-focus:disabled { opacity: 1; }
.vault-shell .note-map-place-focus:hover:not(:disabled) { color: var(--vault-accent); }
.vault-shell .note-map-open { display: grid; place-items: center; flex-shrink: 0; width: 26px; height: 26px; }
.vault-shell .note-map-open:hover { background: var(--vault-hover); }
.note-map-place-detail { display: block; margin-left: 15px; color: var(--vault-detail-muted); font-size: 10px; line-height: 1.6; }
.note-map-variant { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; margin: 4px 0 5px 15px; font-size: 10px; color: var(--vault-detail-muted); }
.note-map-sources { padding: 9px 8px 0; font-size: 11px; color: var(--vault-detail-muted); }
.note-map-sources summary { cursor: pointer; width: fit-content; }
.note-map-sources p { margin: 10px 0; line-height: 1.6; }
.note-map-sources span { display: block; margin-top: 3px; }
.note-map-sources a { color: var(--vault-text); text-decoration: underline; text-underline-offset: 3px; overflow-wrap: anywhere; }
.note-map-error { margin: 8px; font-size: 11px; color: var(--vault-detail-muted); line-height: 1.6; }
.vault-shell .note-map-error button { margin-left: 4px; padding: 2px 5px; text-decoration: underline; }
.note-map-sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
@media (pointer: coarse) {
  .vault-shell .note-map-controls button,
  .vault-shell .note-map-open { width: 44px; height: 44px; }
  .vault-shell .note-map-place-focus { min-height: 44px; }
  .vault-shell .note-map-section select { font-size: 16px; }
}
@media (forced-colors: active) {
  .note-map-dot { background: CanvasText; }
  .note-map-area, .note-map-context { border-color: CanvasText; }
  .note-map-label-text { background: Canvas; color: CanvasText; }
}
</style>
