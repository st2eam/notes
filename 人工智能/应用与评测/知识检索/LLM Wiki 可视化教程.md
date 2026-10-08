---
title: LLM Wiki
aside: false
originalPath: AI/LLM Wiki 可视化教程.md
primaryCategory: 人工智能/应用与评测/知识检索
categories:
  - path: 人工智能/应用与评测/知识检索
    reason: >-
      核心学习对象为“LLM Wiki”，正文依据：“前置：RAG
      与检索质量。目标：比较“提问时检索”与“提前整理知识页面”的流程。最后核对：2026-09-29。
      下方保留原有互动页。它展示一种知识整理方案，不代表生成内容天然准确；来源、版本和人工核验仍需保留。”；据其实体与学习对象归入人工智能/应用与评测/知识检索。
classificationStatus: confirmed
relations: []
tags: []
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

> 前置：[RAG 与检索质量](/%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD/%E5%BA%94%E7%94%A8%E4%B8%8E%E8%AF%84%E6%B5%8B/%E7%9F%A5%E8%AF%86%E6%A3%80%E7%B4%A2/RAG%E4%B8%8E%E6%A3%80%E7%B4%A2%E8%B4%A8%E9%87%8F.md)。目标：比较“提问时检索”与“提前整理知识页面”的流程。最后核对：2026-09-29。

下方保留原有互动页。它展示一种知识整理方案，不代表生成内容天然准确；来源、版本和人工核验仍需保留。

<iframe
  id="llm-wiki-frame"
  src="/notes/embeds/llm-wiki-tutorial.html?embed=true"
  title="LLM Wiki"
  loading="lazy"
  style="display:block;width:100%;height:900px;border:0;border-radius:16px;background:transparent"
></iframe>

参考：[Anthropic Contextual Retrieval](https://www.anthropic.com/engineering/contextual-retrieval)、[OpenAI Retrieval 指南](https://developers.openai.com/api/docs/guides/retrieval)。
