import { earlyHistoricalMaps } from "./geo-early-catalog.mjs";
import { modernMaps } from "./geo-modern-catalog.mjs";

// A curated list, not an automatic import of the upstream historical index.
// `period` permits a representative snapshot; it does not assert unchanged borders.
export const historicalMaps = [
  ...earlyHistoricalMaps,
  ...modernMaps,
  {
    id: "east-asia-800",
    scope: "china",
    period: "唐",
    year: 800,
    from: 755,
    to: 907,
    name: "唐代与周边 · 800 年",
    geometry: "/geo/v1/east-asia-800.geojson",
    source: {
      title: "Historical Basemaps · 公元 800 年",
      url: "https://github.com/aourednik/historical-basemaps/blob/master/geojson/world_800.geojson",
    },
    accuracy: "大陆尺度疆域概览；代表年份不能还原事件当年的控制范围。",
  },
];

export const landMap = {
  geometry: "/geo/v1/land.geojson",
  source: {
    title: "Natural Earth · 自然地理参照",
    url: "https://www.naturalearthdata.com/about/terms-of-use/",
  },
  accuracy: "现代海岸线参照，不含现代行政疆界，非古代地貌复原。",
};
