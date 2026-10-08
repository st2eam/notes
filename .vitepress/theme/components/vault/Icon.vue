<script setup lang="ts">
defineProps<{ name: string; size?: number }>();
const paths: Record<string, string> = {
  folder:
    "M3 7V5a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7Z",
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm0 0v6h6",
  search: "m21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  graph:
    "M9 5 5 17m4-12 10 10M5 17l14-2M12 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm14-3a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  left: "M3 3h18v18H3V3Zm5 0v18m8-12-3 3 3 3",
  right: "M3 3h18v18H3V3Zm13 0v18M8 9l3 3-3 3",
  chevron: "m9 5 7 7-7 7",
  close: "m6 6 12 12M6 18 18 6",
  sun: "M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  moon: "M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z",
  command:
    "M9 7V4a2 2 0 1 0-2 2h10a2 2 0 1 0-2-2v16a2 2 0 1 0 2-2H7a2 2 0 1 0 2 2V7Z",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  settings:
    "M18.93 9.13 L21.81 10.05 L21.81 13.95 L18.93 14.87 L18.93 14.87 L20.31 17.56 L17.56 20.31 L14.87 18.93 L14.87 18.93 L13.95 21.81 L10.05 21.81 L9.13 18.93 L9.13 18.93 L6.44 20.31 L3.69 17.56 L5.07 14.87 L5.07 14.87 L2.19 13.95 L2.19 10.05 L5.07 9.13 L5.07 9.13 L3.69 6.44 L6.44 3.69 L9.13 5.07 L9.13 5.07 L10.05 2.19 L13.95 2.19 L14.87 5.07 L14.87 5.07 L17.56 3.69 L20.31 6.44 L18.93 9.13Z M15.5 12a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0",
  fit: "M8 3H3v5m13-5h5v5M3 16v5h5m8 0h5v-5M8 12h8m-4-4v8",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  back: "m12 5-7 7 7 7M5 12h15",
  forward: "m12 5 7 7-7 7M19 12H4",
  link: "M10 13a5 5 0 0 0 7 .5l3-3a5 5 0 0 0-7-7l-2 2M14 11a5 5 0 0 0-7-.5l-3 3a5 5 0 0 0 7 7l2-2",
};
</script>
<template>
  <svg
    :width="size || 18"
    :height="size || 18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="paths[name] || paths.file" />
  </svg>
</template>
