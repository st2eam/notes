import { ref, onMounted } from "vue";
export function useEmbedMode() {
  const isEmbedded = ref(false);
  onMounted(() => {
    let inIframe = false;
    try {
      inIframe = window.self !== window.top;
    } catch {
      inIframe = true;
    }
    isEmbedded.value =
      new URLSearchParams(window.location.search).get("embed") === "true" ||
      inIframe;
    document.documentElement.classList.toggle("embed-mode", isEmbedded.value);
  });
  return { isEmbedded };
}
