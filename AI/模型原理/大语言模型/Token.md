---
title: Token
aliases: [文本 Token, 文本词元, 词元]
primaryCategory: AI/模型原理/大语言模型
categories:
  - path: AI/模型原理/大语言模型
    reason: 正文解释语言模型处理文本的单位及文档格式与输入长度的关系。
classificationStatus: confirmed
relations: []
---
# Token

Token（词元）是语言模型处理文本时使用的单位，由分词器将文本切分得到。它可以对应一个词、子词或字符等片段，具体划分依赖分词算法和词表，不能直接等同于字数。

在 HTML 转 Markdown 的案例中，移除导航、样式、脚本和冗余标签可以减少输入的 token 数。Cloudflare 在 2026-02-12 发布的单篇博客案例中报告从 16,180 tokens 降至 3,150 tokens；这不是任意文档的固定节省比例。

来源：[Hugging Face：Tokenization algorithms](https://huggingface.co/docs/transformers/tokenizer_summary)、[Cloudflare：Markdown for Agents](https://blog.cloudflare.com/markdown-for-agents/)。核对日期：2026-10-14。
