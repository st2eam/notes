<script setup lang="ts">
import Icon from "./Icon.vue";
import type { VaultNote } from "../../../vault/types";
defineOptions({ name: "FileTree" });
defineProps<{ branch: any; current: string; expanded: string[] }>();
const emit = defineEmits<{
  toggle: [path: string];
  open: [note: VaultNote, event: MouseEvent];
  context: [target: { kind: "note"; noteId: string } | { kind: "folder"; path: string }, event: MouseEvent | KeyboardEvent];
}>();
</script>
<template>
  <ul class="vault-tree" role="group">
    <li v-for="folder in branch.folders" :key="folder.path">
      <button
        class="tree-folder"
        :aria-expanded="expanded.includes(folder.path)"
        aria-haspopup="menu"
        @click="emit('toggle', folder.path)"
        @contextmenu="emit('context', { kind: 'folder', path: folder.path }, $event)"
        @keydown="emit('context', { kind: 'folder', path: folder.path }, $event)"
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
        @context="(target, event) => emit('context', target, event)"
      />
    </li>
    <li v-for="note in branch.notes.filter((n: VaultNote) => !n.id.endsWith('/index.md') || ['历史/中国史/index.md', '历史/世界史/index.md'].includes(n.id))" :key="note.id">
      <button
        :class="['tree-note', { active: current === note.id }]"
        :aria-current="current === note.id ? 'page' : undefined"
        aria-haspopup="menu"
        @click="emit('open', note, $event)"
        @contextmenu="emit('context', { kind: 'note', noteId: note.id }, $event)"
        @keydown="emit('context', { kind: 'note', noteId: note.id }, $event)"
      >
        <Icon name="file" :size="14" /><span>{{
          note.id.endsWith("/index.md") &&
          (!note.categoryContext ||
            note.categoryOverview === note.categoryContext)
            ? "时间总览"
            : note.title
        }}</span
        ><small
          v-if="
            note.categoryContext &&
            note.categoryContext !== note.primaryCategory
          "
          class="category-cross-label"
          >交叉</small
        >
      </button>
    </li>
  </ul>
</template>
