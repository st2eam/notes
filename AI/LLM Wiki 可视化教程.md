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

## 动手练习

选择一篇原始笔记，列出将它整理成 Wiki 页面时必须保留的来源、更新日期和未确认结论。再与[笔记问答实战](./笔记问答实战.md)的“提问时检索”流程比较维护成本。

<details><summary>参考答案</summary>

至少保留原文位置、版本或时间、生成页面到原文的引用关系，以及需要人工复核的断言。提前整理可以提高浏览便利性，但源文更新时也必须同步维护生成页面。

</details>

参考：[Anthropic Contextual Retrieval](https://www.anthropic.com/engineering/contextual-retrieval)、[OpenAI Retrieval 指南](https://developers.openai.com/api/docs/guides/retrieval)。
