import { ref, onMounted } from 'vue'

const isEmbedded = ref(false)

export function useEmbedMode() {
  onMounted(() => {
    const params = new URLSearchParams(window.location.search)
    const embedParam = params.get('embed') === 'true'
    const inIframe = window.self !== window.top

    isEmbedded.value = embedParam || inIframe

    if (isEmbedded.value) {
      document.documentElement.classList.add('embed-mode')
    }
  })

  return { isEmbedded }
}
