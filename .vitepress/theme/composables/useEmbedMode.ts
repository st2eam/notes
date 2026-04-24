import { ref, onMounted } from 'vue'
import { useRouter } from 'vitepress'

const isEmbedded = ref(false)
let initialized = false

export function useEmbedMode() {
  if (!initialized && typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    const embedParam = params.get('embed') === 'true'
    let inIframe = false
    try {
      inIframe = window.self !== window.top
    } catch {
      inIframe = true
    }

    if (embedParam || inIframe) {
      isEmbedded.value = true
      document.documentElement.classList.add('embed-mode')
    }
    initialized = true
  }

  onMounted(() => {
    if (isEmbedded.value) {
      document.documentElement.classList.add('embed-mode')
    }
  })

  const router = useRouter()

  if (typeof window !== 'undefined' && isEmbedded.value) {
    const path = window.location.pathname
    const base = router.route?.path || '/'
    if (base === '/' || path.endsWith('/notes/') || path.endsWith('/notes')) {
      router.go('/Web/')
    }
  }

  return { isEmbedded }
}
