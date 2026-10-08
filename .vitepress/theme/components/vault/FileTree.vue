<script setup lang="ts">
import Icon from "./Icon.vue";
import type { VaultNote } from "../../../vault/types";
defineOptions({ name: "FileTree" });
defineProps<{ branch: any; current: string; expanded: string[] }>();
const emit = defineEmits(["toggle", "open"]);
</script>
<template>
  <ul class="vault-tree" role="group">
    <li v-for="folder in branch.folders" :key="folder.path">
      <button
        class="tree-folder"
        :aria-expanded="expanded.includes(folder.path)"
        @click="emit('toggle', folder.path)"
      >
        <Icon
          name="chevron"
          :size="13"
          :class="{ rotated: expanded.includes(folder.path) }"
        /><Icon name="folder" :size="15" /><span>{{ folder.name }}</span>
      </button>
      <FileTree
        v-if="expanded.includes(folder.path)"
        :branch="folder"
        :current="current"
        :expanded="expanded"
        @toggle="emit('toggle', $event)"
        @open="(n: VaultNote, e: MouseEvent) => emit('open', n, e)"
      />
    </li>
    <li v-for="note in branch.notes" :key="note.id">
      <button
        :class="['tree-note', { active: current === note.id }]"
        :aria-current="current === note.id ? 'page' : undefined"
        @click="emit('open', note, $event)"
      >
        <Icon name="file" :size="14" /><span>{{
          note.id.endsWith("/index.md") ? "总览" : note.title
        }}</span>
      </button>
    </li>
  </ul>
</template>
