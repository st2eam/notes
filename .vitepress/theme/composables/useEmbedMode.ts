import { ref, watch, onMounted, onBeforeUnmount } from "vue";
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
    const paletteKeys = ["background", "text", "accent"];
    const clearPalette = () => {
      delete document.documentElement.dataset.embedPalette;
      for (const key of paletteKeys)
        document.documentElement.style.removeProperty(`--embed-${key}`);
    };
    let parentDark = media.matches;
    const stopThemeWatch = watch(isDark, (value) => {
      if (value !== parentDark) clearPalette();
    });
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
      parentDark = dark;
      isDark.value = options.theme === "auto" ? dark : options.theme === "dark";
      document.documentElement.classList.toggle("dark", isDark.value);
      document.documentElement.dataset.embedBackground = options.background;
      clearPalette();
      // Inherit the host palette only while following its theme. Explicit theme
      // overrides retain the corresponding standalone palette.
      if (parentRoot && (options.theme === "auto" || isDark.value === dark)) {
        const host = window.parent.document;
        const style = window.parent.getComputedStyle(host.body || parentRoot);
        const background = style.backgroundColor;
        if (background !== "transparent" && background !== "rgba(0, 0, 0, 0)") {
          const link = host.querySelector("main a, article a, a");
          const accent = link ? window.parent.getComputedStyle(link).color : style.color;
          for (const [key, value] of Object.entries({ background, text: style.color, accent }))
            document.documentElement.style.setProperty(`--embed-${key}`, value);
          document.documentElement.dataset.embedPalette = "parent";
        }
      }
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
    if (parentRoot?.ownerDocument.body)
      observer.observe(parentRoot.ownerDocument.body, {
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
      stopThemeWatch();
      clearPalette();
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
