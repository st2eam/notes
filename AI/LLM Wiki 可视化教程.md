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

# LLM Wiki 可视化教程

> 前置：[RAG 与检索质量](./RAG与检索质量.md)。目标：比较“提问时检索”与“提前整理知识页面”的流程。最后核对：2026-09-29。

下方保留原有互动页。它展示一种知识整理方案，不代表生成内容天然准确；来源、版本和人工核验仍需保留。

<iframe
  id="llm-wiki-frame"
  src="/notes/embeds/llm-wiki-tutorial.html?embed=true"
  title="LLM Wiki"
  loading="lazy"
  style="display:block;width:100%;height:900px;border:0;border-radius:16px;background:transparent"
></iframe>

参考：[Anthropic Contextual Retrieval](https://www.anthropic.com/engineering/contextual-retrieval)、[OpenAI Retrieval 指南](https://developers.openai.com/api/docs/guides/retrieval)。
