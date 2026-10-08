import { ref, onMounted, onBeforeUnmount } from "vue";
import { useData } from "vitepress";
import { embedOptions, validEmbedMessage } from "../../vault/embed.mjs";

export function useEmbedMode() {
  const isEmbedded = ref(false);
  const { isDark } = useData();
  let cleanup = () => {};
  onMounted(() => {
    isEmbedded.value =
      new URLSearchParams(location.search).get("embed") === "true" ||
      window.self !== window.top;
    document.documentElement.classList.toggle("embed-mode", isEmbedded.value);
    if (!isEmbedded.value) return;
    const options = embedOptions(
      location.search,
      document.referrer,
      location.origin,
    );
    const media = matchMedia("(prefers-color-scheme: dark)");
    let parentRoot: HTMLElement | undefined;
    try {
      if (window.parent !== window)
        parentRoot = window.parent.document.documentElement;
    } catch {
      /* Cross-origin parents configure the frame via messages. */
    }
    const apply = () => {
      let dark = media.matches;
      if (parentRoot) {
        const theme =
          parentRoot.dataset.theme ||
          parentRoot.getAttribute("data-color-mode");
        const scheme = window.parent.getComputedStyle(parentRoot).colorScheme;
        dark =
          theme === "dark" ||
          parentRoot.classList.contains("dark") ||
          (theme !== "light" && scheme === "dark");
      }
      isDark.value = options.theme === "auto" ? dark : options.theme === "dark";
      document.documentElement.classList.toggle("dark", isDark.value);
      document.documentElement.dataset.embedBackground = options.background;
    };
    const receive = (event: MessageEvent) => {
      if (!validEmbedMessage(event, window.parent, options.parentOrigin))
        return;
      if (event.data.theme) options.theme = event.data.theme;
      if (event.data.background) options.background = event.data.background;
      apply();
    };
    const observer = new MutationObserver(apply);
    if (parentRoot)
      observer.observe(parentRoot, {
        attributes: true,
        attributeFilter: ["class", "data-theme", "data-color-mode", "style"],
      });
    media.addEventListener("change", apply);
    window.addEventListener("message", receive);
    apply();
    if (window.parent !== window)
      window.parent.postMessage(
        { type: "notes:embed-ready" },
        options.parentOrigin,
      );
    cleanup = () => {
      observer.disconnect();
      media.removeEventListener("change", apply);
      window.removeEventListener("message", receive);
      delete document.documentElement.dataset.embedBackground;
      document.documentElement.classList.remove("embed-mode");
    };
  });
  onBeforeUnmount(() => cleanup());
  return { isEmbedded };
}
