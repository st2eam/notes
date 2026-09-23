---
title: LLM Wiki
aside: false
---

<script setup>
import { onBeforeUnmount, onMounted } from 'vue'

let frame
function resizeEmbeddedPage(event) {
  if (event.origin !== window.location.origin || event.source !== frame?.contentWindow) return
  if (event.data?.type === 'llmwiki-embed-height' && Number.isFinite(event.data.height)) {
    frame.style.height = `${Math.max(900, event.data.height)}px`
  }
}
onMounted(() => {
  frame = document.getElementById('llm-wiki-frame')
  window.addEventListener('message', resizeEmbeddedPage)
})
onBeforeUnmount(() => window.removeEventListener('message', resizeEmbeddedPage))
</script>

<iframe
  id="llm-wiki-frame"
  src="/notes/embeds/llm-wiki-tutorial.html?embed=true"
  title="LLM Wiki"
  loading="lazy"
  style="display:block;width:100%;height:900px;border:0;border-radius:16px;background:transparent"
></iframe>