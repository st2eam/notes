<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { contextMenuPosition } from "../../../vault/context-menu.mjs";
import Icon from "./Icon.vue";

const props = defineProps<{
  items: { id: string; label: string; icon: string; disabled?: boolean; separator?: boolean }[];
  x: number;
  y: number;
  label: string;
  trigger: HTMLElement;
}>();
const emit = defineEmits<{
  select: [id: string];
  close: [restoreFocus: boolean];
}>();
const menu = ref<HTMLElement>();
const position = ref({ left: props.x, top: props.y });
const ready = ref(false);
const initialScroll = new Map<Element, { left: number; top: number }>();

function buttons() {
  return Array.from(menu.value?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") || []);
}
function focusItem(index: number) {
  buttons()[index]?.focus({ preventScroll: true });
}
function outside(event: Event) {
  if (!menu.value?.contains(event.target as Node)) emit("close", false);
}
function dismiss() {
  emit("close", false);
}
function scrollOutside(event: Event) {
  if (menu.value?.contains(event.target as Node)) return;
  const element = event.target === document ? document.scrollingElement : event.target as Element;
  const initial = element && initialScroll.get(element);
  // Focusing a tab can queue a scroll event before its context menu mounts.
  if (initial && element?.scrollLeft === initial.left && element?.scrollTop === initial.top) return;
  dismiss();
}
function hoverItem(event: PointerEvent) {
  const button = event.currentTarget as HTMLButtonElement;
  if (!button.disabled) button.focus({ preventScroll: true });
}
function keydown(event: KeyboardEvent) {
  if (event.key === "Escape" || event.key === "Tab") {
    if (event.key === "Escape") event.preventDefault();
    event.stopImmediatePropagation();
    emit("close", true);
    return;
  }
  const enabled = buttons();
  if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const index = enabled.indexOf(document.activeElement as HTMLButtonElement);
    const next = event.key === "Home" ? 0
      : event.key === "End" ? enabled.length - 1
      : (index + (event.key === "ArrowDown" ? 1 : -1) + enabled.length) % enabled.length;
    focusItem(next);
  } else if ((event.key === "Enter" || event.key === " ") && menu.value?.contains(event.target as Node)) {
    event.preventDefault();
    event.stopImmediatePropagation();
    (document.activeElement as HTMLButtonElement)?.click();
  }
}

onMounted(async () => {
  for (let element: Element | null = props.trigger; element; element = element.parentElement)
    initialScroll.set(element, { left: element.scrollLeft, top: element.scrollTop });
  if (document.scrollingElement)
    initialScroll.set(document.scrollingElement, { left: document.scrollingElement.scrollLeft, top: document.scrollingElement.scrollTop });
  await nextTick();
  if (!menu.value) return;
  position.value = contextMenuPosition(
    { x: props.x, y: props.y },
    menu.value.getBoundingClientRect(),
    { width: window.innerWidth, height: window.innerHeight },
  );
  ready.value = true;
  await nextTick();
  if (!menu.value) return;
  focusItem(0);
  window.addEventListener("pointerdown", outside, true);
  window.addEventListener("contextmenu", outside, true);
  window.addEventListener("focusin", outside, true);
  window.addEventListener("scroll", scrollOutside, true);
  window.addEventListener("keydown", keydown, true);
  window.addEventListener("resize", dismiss);
  window.addEventListener("blur", dismiss);
});
onBeforeUnmount(() => {
  window.removeEventListener("pointerdown", outside, true);
  window.removeEventListener("contextmenu", outside, true);
  window.removeEventListener("focusin", outside, true);
  window.removeEventListener("scroll", scrollOutside, true);
  window.removeEventListener("keydown", keydown, true);
  window.removeEventListener("resize", dismiss);
  window.removeEventListener("blur", dismiss);
});
</script>

<template>
  <div
    ref="menu"
    class="vault-context-menu"
    role="menu"
    :aria-label="label"
    :style="{ left: position.left + 'px', top: position.top + 'px', visibility: ready ? 'visible' : 'hidden' }"
    @contextmenu.prevent
  >
    <button
      v-for="item in items"
      :key="item.id"
      type="button"
      role="menuitem"
      tabindex="-1"
      :disabled="item.disabled"
      :class="{ separated: item.separator }"
      @pointermove="hoverItem"
      @click="emit('select', item.id)"
    >
      <Icon :name="item.icon" :size="15" />
      <span>{{ item.label }}</span>
    </button>
  </div>
</template>
