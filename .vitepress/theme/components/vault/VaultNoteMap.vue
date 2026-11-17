<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { withBase } from "vitepress";
import type { VaultNote } from "../../../vault/types";
import { mapPlaces, noteGeoTime, timeLabel, yearLabel } from "../../../vault/geo.mjs";
import { describeJiangshanPlace, initialJiangshanYear, jiangshanYears, jiangshanSource, selectJiangshanPhase, settlementsAt, visibleAt } from "../../../vault/jiangshan-map.mjs";
import Icon from "./Icon.vue";
import HistoryReferences from "../history/HistoryReferences.vue";
import "leaflet/dist/leaflet.css";
import { mapWorkspaceKey, type MapViewState } from "../../composables/useMapWorkspace";

const props = defineProps<{ note: VaultNote; notes: VaultNote[]; enabled: boolean; expanded?: boolean; view?: MapViewState }>();
const emit = defineEmits<{ open: [note: VaultNote, event: MouseEvent]; "view-change": [view: MapViewState] }>();
const openMapWorkspace = inject(mapWorkspaceKey, undefined);
const showDetails = ref(false);
const host = ref<HTMLElement>();
const selectedYear = ref<number | null>(null);
const selectedVariants = ref<Record<string, string>>({});
const selectedPlace = ref("");
const selectedArea = ref("");
const DEFAULT_ZOOM = 4;
const MAX_ZOOM = 12;
const FIT_PADDING: [number, number] = [4, 4];
const busy = ref(false);
const failures = ref<string[]>([]);
const territoryNames = ref<string[]>([]);
const rawPlaces = computed(() => mapPlaces(props.note, props.notes));
const time = computed(() => noteGeoTime(props.note));
const years = computed(() => [...new Set([...jiangshanYears(props.note),
  ...(Number.isInteger(selectedYear.value) && selectedYear.value !== 0 ? [selectedYear.value!] : [])])].sort((a, b) => a - b));
const areaFeatures = ref<any[]>([]);
const showRegions = ref(true);
const showSettlements = ref(true);
const places = computed(() => rawPlaces.value.map((item: any) =>
  describeJiangshanPlace(item, selectedYear.value, areaFeatures.value, selectedVariants.value[item.key])));
const historical = computed(() => selectJiangshanPhase(selectedYear.value));
const hasGeometry = computed(() => places.value.some((p: any) => p.variant));
const countLabel = computed(() => `${places.value.length} 处`);
const snapshotNote = computed(() => !historical.value
  ? selectedYear.value == null ? "选择年代后匹配江山地图" : "江山地图未覆盖该年代；支持前 403 年至 1948 年的非零整数年份。"
  : "江山地图阶段示意边界；阶段内共用轮廓，不表示逐年复原。聚落为代表点，数据以中国史及周边为主。");
const sourceList = [jiangshanSource];
function initialSelection() {
  selectedVariants.value = {};
  selectedPlace.value = "";
  areaFeatures.value = [];
  selectedYear.value = props.view ? props.view.year : initialJiangshanYear(props.note);
  showRegions.value = props.view?.showRegions ?? true;
  showSettlements.value = props.view?.showSettlements ?? true;
  selectedVariants.value = { ...props.view?.variants };
  failures.value = [];
}
watch(() => props.note.id, initialSelection, { immediate: true, flush: "sync" });
watch(selectedYear, () => { selectedVariants.value = {}; }, { flush: "sync" });
function currentView(): MapViewState {
  return { year: selectedYear.value, showRegions: showRegions.value, showSettlements: showSettlements.value,
    variants: { ...selectedVariants.value } };
}
watch(() => props.view, (view) => {
  if (!view || JSON.stringify(view) === JSON.stringify(currentView())) return;
  selectedYear.value = view.year;
  showRegions.value = view.showRegions;
  showSettlements.value = view.showSettlements;
  selectedVariants.value = { ...view.variants };
}, { deep: true });
watch([selectedYear, showRegions, showSettlements, selectedVariants], () => {
  if (props.expanded) emit("view-change", currentView());
}, { deep: true });
function mapKeydown(event: KeyboardEvent) {
  if (event.key === "0" || event.key === "Home") { event.preventDefault(); fit(); }
  if (event.key === "Escape") { clearAreaSelection(); showDetails.value = false; }
}
function setYear(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  selectedYear.value = value === "" ? null : Number(value);
}

let leaflet: any;
let map: any;
let landLayer: any;
let backgroundLayer: any;
let placeLayer: any;
let selectionLayer: any;
let observer: ResizeObserver | undefined;
let request: AbortController | undefined;
let generation = 0;
let alive = false;
let initializing = false;
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
function clearAreaSelection() {
  selectionLayer?.clearLayers();
  selectedArea.value = "";
}
function selectArea(feature: any) {
  clearAreaSelection();
  if (!feature?.geometry || !selectionLayer) return;
  selectedArea.value = String(feature.properties?.title || "关联区域");
  leaflet.geoJSON(feature, {
    pane: "mapSelection", interactive: false,
    style: { color: styleTokens().mark, weight: 2.5, fill: false, className: "note-map-selected-contour" },
  }).addTo(selectionLayer);
}
function bindAreaSelection(feature: any, layer: any, label: string) {
  layer.on("click", () => selectArea(feature));
  layer.on("add", () => {
    const element = layer.getElement();
    if (!element) return;
    element.setAttribute("tabindex", "0");
    element.setAttribute("role", "button");
    element.setAttribute("aria-label", `选择${label}`);
    leaflet.DomEvent.on(element, "keydown", (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      leaflet.DomEvent.stop(event);
      selectArea(feature);
    });
  });
}
function clearLayers() {
  clearAreaSelection();
  landLayer?.clearLayers();
  backgroundLayer?.clearLayers();
  placeLayer?.clearLayers();
  placeLayers.clear();
  labelMarkers.length = 0;
  allBounds = null;
  territoryNames.value = [];
}
function fitBounds(bounds: any) {
  if (bounds.getSouthWest().equals(bounds.getNorthEast())) {
    map.setView(bounds.getCenter(), DEFAULT_ZOOM, { animate: false });
  } else {
    // Fit both dimensions without a fixed zoom ceiling or asymmetric margins.
    // Leaflet preserves the projection's aspect ratio; zoomSnap: 0 avoids rounding down.
    map.fitBounds(bounds, { padding: FIT_PADDING, animate: false });
  }
}
function fit() {
  if (!map) return;
  if (allBounds?.isValid()) fitBounds(allBounds);
  else if (props.note.geo?.scope === "china" || props.note.historyTrack === "china" || props.note.id.startsWith("历史/中国史/"))
    map.setView([34, 108], DEFAULT_ZOOM, { animate: false });
  else map.fitWorld({ animate: false });
}
function arrangeLabels() {
  if (!map || !host.value) return;
  const boxes: { x: number; y: number; width: number }[] = [];
  const sorted = labelMarkers.toSorted((a, b) => Number(b.chosen) - Number(a.chosen));
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
function labelAt(position: any, text: string, chosen = false, territory = false) {
  const label = textNode(text, "note-map-label-text" + (territory ? " note-map-territory-label" : ""));
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
  clearAreaSelection();
  if (layer.getLatLng) map.setView(layer.getLatLng(), Math.min(MAX_ZOOM, Math.max(DEFAULT_ZOOM, map.getZoom())), { animate: false });
  else if (layer.getBounds?.().isValid()) {
    selectArea(item.variant?.feature);
    fitBounds(layer.getBounds());
  }
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
  const historicalMap = historical.value;
  const year = selectedYear.value;
  areaFeatures.value = [];
  const paths = historicalMap ? [jiangshanSource.neighbors, jiangshanSource.hydro, historicalMap.geometry] : [];
  busy.value = true;
  const resources = new Map<string, any>();
  const failed: string[] = [];
  await Promise.all([...new Set(paths)].map(async (path) => {
    try { resources.set(path, await geojson(path, signal)); }
    catch (error: any) { if (error.name !== "AbortError") failed.push(path); }
  }));
  if (serial !== generation || !alive || signal.aborted) return;
  const colors = styleTokens();
  const land = resources.get(jiangshanSource.neighbors);
  if (land) leaflet.geoJSON(land, {
    interactive: false, className: "note-map-land", smoothFactor: 0.6,
    style: { weight: 0.7, fillOpacity: 1 },
  }).addTo(landLayer);
  allBounds = leaflet.latLngBounds([]);
  const background = historicalMap && resources.get(historicalMap.geometry);
  areaFeatures.value = background?.features || [];
  if (background) {
    const territories = leaflet.geoJSON(background, {
      bubblingMouseEvents: false,
      filter: (feature: any) => showRegions.value || feature.properties.layer !== "region",
      style: (feature: any) => ({ color: colors.border, weight: feature.properties.layer === "polity" ? 1.5 : 0.7,
        dashArray: feature.properties.layer === "region" ? "3 3" : undefined,
        fillColor: colors.border, fillOpacity: feature.properties.layer === "polity" ? 0.13 : 0.04, className: "note-map-territory" }),
      onEachFeature(feature: any, layer: any) {
        const p = feature.properties;
        const label = `${p.title} · ${p.layer === 'region' ? '一级区划' : '政权'}`;
        layer.bindTooltip(textNode(label), { direction: "center", className: "note-map-tooltip" });
        bindAreaSelection(feature, layer, label);
      },
    }).addTo(backgroundLayer);
    if (territories.getBounds().isValid()) allBounds.extend(territories.getBounds());
  }
  const hydro = resources.get(jiangshanSource.hydro);
  if (hydro) leaflet.geoJSON(hydro, {
    filter: (f: any) => visibleAt(f.properties, year),
    style: { color: colors.border, weight: 0.8, opacity: 0.5, fillColor: colors.surface, fillOpacity: 1 },
    onEachFeature(f: any, layer: any) { if (f.properties.name) layer.bindTooltip(textNode(f.properties.name)); },
  }).addTo(backgroundLayer);
  territoryNames.value = background ? [...new Set<string>(background.features
    .filter((f: any) => showRegions.value || f.properties.layer !== "region")
    .map((f: any) => `${f.properties.title} · ${f.properties.layer === 'region' ? '一级区划' : '政权'}`))] : [];
  if (historicalMap && showSettlements.value) for (const city of settlementsAt(year)) {
    const position = leaflet.latLng(city.coord[1], city.coord[0]);
    leaflet.circleMarker(position, { radius: city.isCapital ? 4 : 2.5, color: colors.surface, weight: 1,
      fillColor: colors.border, fillOpacity: 0.9 }).bindTooltip(textNode(`${city.ancient}${city.modern ? '（今' + city.modern + '）' : ''}`)).addTo(placeLayer);
    if (city.isCapital) labelAt(position, city.ancient, false);
  }
  for (const item of places.value) {
    const v = item.variant;
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
    } else if (v.feature) {
      layer = leaflet.geoJSON(v.feature, {
        bubblingMouseEvents: false,
        style: { color: colors.mark, weight: 2, fillColor: colors.mark, fillOpacity: 0.16 },
        onEachFeature(feature: any, featureLayer: any) { bindAreaSelection(feature, featureLayer, item.label); },
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
    layer.on("click", () => {
      selectedPlace.value = key;
      if (!v.feature) clearAreaSelection();
    });
    if (labelPosition) labelAt(labelPosition, item.label, key === selectedPlace.value);
  }
  for (const feature of background?.features || []) {
    const p = feature.properties;
    if (p?.layer === "polity" && Array.isArray(p.anchor))
      labelAt(leaflet.latLng(p.anchor[1], p.anchor[0]), String(p.title), false, true);
  }
  failures.value = failed;
  busy.value = false;
  await nextTick();
  if (serial !== generation || !alive) return;
  map.invalidateSize();
  fit();
  arrangeLabels();
}
watch([rawPlaces, selectedYear, selectedVariants, showRegions, showSettlements, () => props.enabled], () => {
  if (map) void render();
  else if (alive && host.value) void initializeMap();
}, { flush: "post", deep: true });

function retry() {
  if (map) void render();
  else void initializeMap();
}
async function initializeMap() {
  if (initializing || map || !alive || !host.value) return;
  initializing = true;
  busy.value = true;
  failures.value = [];
  try {
    leaflet = await import("leaflet");
    if (!alive || !host.value) return;
    map = leaflet.map(host.value, {
      zoomControl: false, attributionControl: false, scrollWheelZoom: Boolean(props.expanded),
      minZoom: -3, maxZoom: MAX_ZOOM, zoom: DEFAULT_ZOOM, zoomSnap: 0, worldCopyJump: false,
      maxBounds: [[-75, -180], [85, 180]], maxBoundsViscosity: 0.8,
    });
    map.setView([34, 108], DEFAULT_ZOOM);
    map.createPane("mapSelection");
    map.getPane("mapSelection").style.zIndex = "430";
    map.getPane("mapSelection").style.pointerEvents = "none";
    map.createPane("mapLabels");
    map.getPane("mapLabels").style.zIndex = "450";
    landLayer = leaflet.layerGroup().addTo(map);
    backgroundLayer = leaflet.layerGroup().addTo(map);
    placeLayer = leaflet.layerGroup().addTo(map);
    selectionLayer = leaflet.layerGroup().addTo(map);
    map.on("click", clearAreaSelection);
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
  } finally { initializing = false; }
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
  <section v-if="expanded || rawPlaces.length || note.geo?.locationNote || time" :class="['note-map-section', { 'note-map-expanded': expanded }]" :aria-label="expanded ? note.title + '的大图地图' : '关联地点地图'">
    <h2 v-if="!expanded">关联地点 <small>{{ countLabel }}</small></h2>
    <div class="note-map-time">
      <strong v-if="expanded" class="note-map-workspace-title"><Icon name="locate" :size="16" />{{ note.title }} · 地图</strong>
      <span>{{ timeLabel(time) }}</span>
      <label v-if="years.length > 1">
        <span class="note-map-sr-only">地图显示年代</span>
        <select v-model="selectedYear" aria-label="地图显示年代">
          <option v-if="!time" :value="null">选择年代</option>
          <option v-for="year in years" :key="year" :value="year">{{ yearLabel(year) }}</option>
        </select>
      </label>
      <label class="note-map-year-input"><span>指定年份</span><input :value="selectedYear" type="number" step="1" aria-label="指定地图年份" placeholder="如 650" @input="setYear" /></label>
      <button v-if="expanded" type="button" class="note-map-details-toggle" :aria-pressed="showDetails" @click="showDetails = !showDetails"><Icon name="settings" :size="15" />地图详情</button>
    </div>
    <div class="note-map-frame" :aria-busy="busy">
      <div ref="host" class="note-map-canvas" role="region" aria-label="历史地点地图，可用方向键平移、加减号缩放，0 或 Home 适应视图；关联地点见地图详情" @keydown="mapKeydown" />
      <div class="note-map-controls" aria-label="地图操作">
        <button v-if="!expanded && openMapWorkspace" type="button" aria-label="查看大图" title="查看大图" @click="openMapWorkspace(note, currentView())"><Icon name="locate" :size="14" /></button>
        <button type="button" aria-label="放大地图" title="放大" @click="map?.zoomIn()"><Icon name="plus" :size="14" /></button>
        <button type="button" aria-label="缩小地图" title="缩小" @click="map?.zoomOut()"><Icon name="minus" :size="14" /></button>
        <button type="button" aria-label="显示完整疆域与全部关联地点" title="显示完整疆域与全部地点" @click="fit"><Icon name="fit" :size="14" /></button>
      </div>
      <div v-if="busy" class="note-map-loading" role="status">正在载入地理数据…</div>
      <div class="note-map-attribution"><a :href="withBase('/history/sources/jiangshan/SOURCES.md')" target="_blank" rel="noopener">地图资料</a> · <a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a></div>
    </div>
    <div v-show="!expanded || showDetails" class="note-map-details" @keydown.esc.stop="showDetails = false">
    <div class="note-map-caption" aria-live="polite">
      <strong v-if="historical">江山地图 · {{ historical.period }} · {{ yearLabel(historical.from) }}—{{ yearLabel(historical.to) }}</strong>
      <span v-if="historical">{{ historical.title }}</span>
      <span>{{ snapshotNote }}</span>
      <span v-if="selectedArea">已选区域：{{ selectedArea }}</span>
      <span v-if="!rawPlaces.length">本笔记未关联具体地点</span>
      <span v-else-if="!hasGeometry">关联地点尚无可显示的地理资料</span>
      <span v-if="note.geo?.bindingStatus === 'uncertain'">地点或古址存在考证，列表仅表示相关地区；具体说明见数据来源。</span>
    </div>
    <p v-if="failures.length" class="note-map-error" role="status">
      部分地图资源未载入，离线时可能尚未缓存。地点列表仍可使用。
      <button type="button" @click="retry">重试</button>
    </p>
    <div class="note-map-legend" aria-label="地图图例">
      <span><i class="note-map-dot" />关联地点</span><span><i class="note-map-area" />政权轮廓</span><span><i class="note-map-context" />一级区划</span>
    </div>
    <div class="note-map-layers" aria-label="江山地图图层">
      <label><input v-model="showRegions" type="checkbox" />一级区划</label>
      <label><input v-model="showSettlements" type="checkbox" />聚落与都城</label>
    </div>
    <details v-if="territoryNames.length" class="note-map-territories">
      <summary>政权与区划 · {{ territoryNames.length }}</summary>
      <ul aria-label="地图区域名称"><li v-for="name in territoryNames" :key="name">{{ name }}</li></ul>
    </details>
    <ul class="note-map-places" aria-label="关联地点列表">
      <li v-for="item in places" :key="item.key" :class="{ 'is-selected': selectedPlace === (item.key) }">
        <div class="note-map-place-row">
          <button type="button" class="note-map-place-focus" :disabled="!item.variant" :aria-label="'在地图上定位' + item.label" @click="focusPlace(item)">
            <i :class="item.place?.kind === 'point' || !item.place ? 'note-map-dot' : 'note-map-area'" />
            <span>{{ item.label }}</span>
          </button>
          <button v-if="item.note" type="button" class="note-map-open" :aria-label="'打开' + item.note.title + '笔记'" title="打开地点笔记" @click="emit('open', item.note, $event)"><Icon name="forward" :size="14" /></button>
        </div>
        <label v-if="item.candidates.length > 1" class="note-map-variant">
          <span>同名地点</span>
          <select v-model="selectedVariants[item.key]" :aria-label="item.name + '的同名地点'">
            <option :value="undefined">请选择地点</option>
            <option v-for="variant in item.candidates" :key="variant.id" :value="variant.id">{{ variant.name }}{{ variant.modern ? ' · 今' + variant.modern : '' }}</option>
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
      <a :href="withBase('/history/sources/jiangshan/SOURCES.md')" target="_blank" rel="noopener">数据版本、许可与处理说明</a>
    </details>
    <HistoryReferences :history-id="note.historyId" />
    </div>
    <div v-if="expanded" class="note-map-workspace-caption"><span>{{ countLabel }}关联地点</span><span>拖动平移 · 滚轮缩放 · 方向键移动</span><span v-if="failures.length" role="status">部分资源未载入 <button type="button" @click="retry">重试</button></span></div>
  </section>
</template>

<style>
.note-map-expanded { position: relative; display: grid; grid-template: auto minmax(0, 1fr) auto / minmax(0, 1fr); height: 100%; min-height: 0; margin: 0 !important; }
.note-map-expanded .note-map-time { grid-area: 1 / 1; justify-content: flex-start; gap: 10px; margin: 0; padding: 10px 14px; border-bottom: 1px solid var(--vault-border); }
.note-map-workspace-title { display: inline-flex; align-items: center; gap: 6px; margin-right: auto; color: var(--vault-text); font-size: 12px; font-weight: 500; }
.note-map-details-toggle { display: inline-flex; align-items: center; gap: 5px; padding: 5px 7px; border: 1px solid var(--vault-border); border-radius: 4px; }
.note-map-details-toggle[aria-pressed="true"] { background: var(--vault-hover); }
.note-map-expanded .note-map-frame { grid-area: 2 / 1; height: auto; min-height: 0; border: 0; border-radius: 0; }
.note-map-expanded .note-map-details { grid-area: 2 / 1; position: relative; z-index: 3; justify-self: end; min-height: 0; margin: 12px 54px 12px 12px; width: min(300px, calc(100% - 76px)); overflow: auto; padding: 14px; border: 1px solid var(--vault-border); border-radius: 5px; background: var(--vault-bg); }
.note-map-workspace-caption { grid-area: 3 / 1; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 6px 16px; padding: 8px 14px; border-top: 1px solid var(--vault-border); color: var(--vault-detail-muted); font-size: 11px; }
.note-map-workspace-caption button { text-decoration: underline; }
.note-map-layers { display: flex; flex-wrap: wrap; gap: 12px; padding: 0 8px 10px; font-size: 11px; color: var(--vault-detail-muted); }
.note-map-layers label { display: inline-flex; align-items: center; gap: 5px; }
.note-map-year-input { display: inline-flex; align-items: center; gap: 5px; }
.note-map-year-input input { width: 76px; border: 1px solid var(--vault-border, var(--vp-c-divider)); border-radius: 4px; padding: 3px 5px; background: var(--vault-bg, var(--vp-c-bg)); color: inherit; font: inherit; }
.note-map-layers input { accent-color: var(--map-mark); }
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
/* SVG outlines use the element's bounding rectangle; use the geographic path instead. */
.note-map-section .leaflet-interactive:focus { outline: none; }
.note-map-section .leaflet-interactive:focus-visible { stroke: var(--map-mark); stroke-width: 3px; }
.note-map-selected-contour { pointer-events: none; stroke-linejoin: round; stroke-linecap: round; }
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
.note-map-territory-label { font-weight: 600; letter-spacing: 0.04em; }
.note-map-territories { margin: 0 8px 9px; font-size: 11px; color: var(--vault-detail-muted); }
.note-map-territories summary { cursor: pointer; }
.vault-shell .note-map-territories ul { display: flex; flex-wrap: wrap; gap: 5px 12px; margin: 7px 0; padding: 0; list-style: none; }
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
