<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { withBase } from "vitepress";

type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
};
const offline = ref(false);
const ready = ref(false);
const update = ref(false);
const installPrompt = ref<InstallPrompt | null>(null);
let registration: ServiceWorkerRegistration | undefined;
let timer: ReturnType<typeof setInterval> | undefined;
const dismissed = ref(false);
let hadController = false;
let reloading = false;
const connection = () => { offline.value = !navigator.onLine; };
const offerInstall = (event: Event) => {
  event.preventDefault();
  installPrompt.value = event as InstallPrompt;
};
const installed = () => { installPrompt.value = null; };
const changed = () => {
  ready.value = true;
  // First install should not interrupt reading. Updated tabs reload together.
  if (hadController && !reloading) {
    reloading = true;
    window.location.reload();
  }
  hadController = true;
  // The first page loaded before the worker took control; cache it now too.
  if (navigator.onLine) fetch(window.location.pathname).catch(() => {});
};
const check = () => { if (navigator.onLine) registration?.update().catch(() => {}); };
const visible = () => { if (!document.hidden) check(); };
async function install() {
  const prompt = installPrompt.value;
  if (!prompt) return;
  installPrompt.value = null;
  await prompt.prompt();
  await prompt.userChoice;
}
function refresh() {
  registration?.waiting?.postMessage({ type: "SKIP_WAITING" });
}

onMounted(async () => {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;
  connection();
  hadController = !!navigator.serviceWorker.controller;
  ready.value = hadController;
  window.addEventListener("online", connection);
  window.addEventListener("offline", connection);
  window.addEventListener("beforeinstallprompt", offerInstall);
  window.addEventListener("appinstalled", installed);
  navigator.serviceWorker.addEventListener("controllerchange", changed);
  document.addEventListener("visibilitychange", visible);
  try {
    registration = await navigator.serviceWorker.register(withBase("/sw.js"), {
      scope: withBase("/"), updateViaCache: "none",
    });
    const waiting = () => { update.value = !!registration?.waiting && !!navigator.serviceWorker.controller; };
    waiting();
    registration.addEventListener("updatefound", () => {
      registration?.installing?.addEventListener("statechange", waiting);
    });
    timer = setInterval(check, 60 * 60 * 1000);
  } catch (error) {
    console.warn("离线支持暂时不可用", error);
  }
});
onUnmounted(() => {
  clearInterval(timer);
  window.removeEventListener("online", connection);
  window.removeEventListener("offline", connection);
  window.removeEventListener("beforeinstallprompt", offerInstall);
  window.removeEventListener("appinstalled", installed);
  navigator.serviceWorker?.removeEventListener("controllerchange", changed);
  document.removeEventListener("visibilitychange", visible);
});
</script>

<template>
  <aside v-if="update || offline || (installPrompt && !dismissed)" class="pwa-status" aria-label="应用状态">
    <span role="status">{{ update ? '新版本已准备好' : offline ? (ready ? '离线阅读 · 可打开已缓存笔记' : '当前离线 · 联网后可启用离线阅读') : '将知识库安装到设备' }}</span>
    <button v-if="update" type="button" @click="refresh">刷新更新</button>
    <button v-else-if="installPrompt && !offline" type="button" @click="install">安装</button>
    <button v-if="!update && !offline" type="button" aria-label="关闭安装提示" @click="dismissed = true">×</button>
  </aside>
</template>

<style scoped>
.pwa-status { position: fixed; bottom: calc(36px + env(safe-area-inset-bottom)); left: 50%; transform: translateX(-50%); z-index: 100; display: flex; align-items: center; gap: 12px; width: max-content; max-width: calc(100vw - 24px); padding: 10px 14px; border: 1px solid var(--vault-border); border-radius: 8px; background: var(--vault-bg); color: var(--vault-text); font-size: 13px; box-shadow: 0 4px 20px #0002; }
button { flex-shrink: 0; color: var(--vault-accent); cursor: pointer; padding: 4px; }
button:focus-visible { outline: 2px solid var(--vault-accent); outline-offset: 2px; }
:global(.embed-mode) .pwa-status { display: none; }
@media (max-width: 760px), (max-width: 1023px) and (pointer: coarse), (max-height: 500px) and (pointer: coarse) {
  .pwa-status {
    bottom: calc(92px + env(safe-area-inset-bottom));
    gap: 8px;
    padding: 6px 12px;
    max-width: calc(100vw - 24px - env(safe-area-inset-left) - env(safe-area-inset-right));
  }
  button { min-width: 44px; min-height: 44px; }
}
</style>
