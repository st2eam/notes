---
title: MarkItDown
aliases: [Microsoft MarkItDown, 微软 MarkItDown]
primaryCategory: 计算机/工程化/命令行工具
categories:
  - path: 计算机/工程化/命令行工具
    reason: 正文介绍将文档转换成 Markdown 的 Python 工具及其命令行用法。
classificationStatus: confirmed
relations: []
---
# MarkItDown

MarkItDown 是微软开源的 Python 文档转换工具，可将 PDF、Word、Excel、PowerPoint 和 HTML 等资料转成 [[计算机/工程化/开发实践/Markdown|Markdown]]，供大模型与文本分析流程使用。它重点保留标题、列表、表格和链接等结构。

```bash
pip install 'markitdown[pdf,docx,pptx]'
markitdown input.pdf -o output.md
```

转换的目标是提取内容，并不保证高保真还原版面。批量处理前应抽查标题层级、表格和阅读顺序，保留原件用于核验。内置转换与外部视觉模型、OCR 插件、云服务的依赖和费用应分别确认。

来源：[Microsoft MarkItDown 官方项目](https://github.com/microsoft/markitdown)。核对日期：2026-10-14。
