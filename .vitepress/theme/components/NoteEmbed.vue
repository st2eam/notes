<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'

defineProps<{ src: string; title: string }>()

const frame = ref<HTMLIFrameElement>()
let disconnect = () => {}

function connect() {
  disconnect()
  const element = frame.value
  const doc = element?.contentDocument
  const content = doc?.getElementById('root')
  if (!element || !doc || !content) return

  let active = true
  let pending = 0
  doc.documentElement.classList.add('notes-embed')

  function resize() {
    if (pending) cancelAnimationFrame(pending)
    pending = requestAnimationFrame(() => {
      pending = 0
      if (!active) return
      // Measure the content rather than scrollHeight, which includes the old
      // iframe viewport and prevents the frame from shrinking after a collapse.
      const height = Math.max(240, Math.ceil(content!.getBoundingClientRect().height) + 2)
      if (element!.style.height !== `${height}px`) element!.style.height = `${height}px`
    })
  }

  function syncTheme() {
    const style = getComputedStyle(element!)
    const colors: Record<string, string> = {
      '--bg': '--vault-bg',
      '--surface': '--vault-side',
      '--soft': '--vault-side',
      '--ink': '--vault-text',
      '--muted': '--vault-muted',
      '--line': '--vault-border',
      '--accent': '--vault-accent',
      '--on-accent': '--vault-bg',
    }
    for (const [name, source] of Object.entries(colors)) {
      doc!.documentElement.style.setProperty(name, style.getPropertyValue(source).trim())
    }
    doc!.documentElement.style.setProperty('--embed-font', style.fontFamily)
    doc!.documentElement.style.colorScheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  }

  const sizeObserver = new ResizeObserver(resize)
  sizeObserver.observe(content)
  const themeObserver = new MutationObserver(syncTheme)
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'style', 'data-theme'],
  })
  syncTheme()
  resize()
  doc.fonts.ready.then(() => { if (active) resize() })

  disconnect = () => {
    active = false
    cancelAnimationFrame(pending)
    sizeObserver.disconnect()
    themeObserver.disconnect()
  }
}

// A small cached HTML page can finish loading before Vue hydrates @load.
onMounted(() => {
  if (frame.value?.contentDocument?.readyState === 'complete') connect()
})
onBeforeUnmount(() => disconnect())
</script>

<template>
  <iframe
    ref="frame"
    :src="withBase(src)"
    :title="title"
    class="note-embed"
    @load="connect"
  ></iframe>
</template>

<style scoped>
.note-embed {
  display: block;
  width: 100%;
  height: 1000px;
  margin: 24px 0;
  border: 0;
  background: transparent;
  color-scheme: normal;
}
</style>
