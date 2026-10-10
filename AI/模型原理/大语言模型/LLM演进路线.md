---
originalPath: AI/LLM演进路线.md
primaryCategory: AI/模型原理/大语言模型
categories:
  - path: AI/模型原理/大语言模型
    reason: >-
      核心学习对象为“LLM 演进路线：理解技术选择”，正文依据：“前置：大语言模型基础。目标：分清架构、训练目标、对齐、推理时计算和 Agent
      系统分别解决什么问题。最后核对：2026-09-29。
      这是一条理解思路的路线，不是每年“最强模型”排行榜。产品名称、性能与定价变化很快；阅读时关注可迁移的技术问题，并到官方资料核对具体版本。”；据其实体与学习对象归入AI/模型原理/大语言模型。
classificationStatus: confirmed
relations:
  - target: AI/自然语言处理/BERT/快速入门.md
    type: similar
    label: 主题对照
    reason: 演进路线包含 BERT 预训练范式，BERT 笔记细化输入和训练任务；属于架构对照。
    evidence: >-
      源笔记：前置：大语言模型基础。目标：分清架构、训练目标、对齐、推理时计算和 Agent 系统分别解决什么问题。最后核对：2026-09-29。
      这是一条理解思路的路线，不是每年“最强模型”排行榜。产品名称、性能与定价变化很快；阅读时关注可迁移的技术问题，并到官方资料核对具体版本。；目标笔记：BERT（Bidirectional
      Encoder Representations from Transformers）是 Google 在 2018
      年提出的预训练语言模型，彻底改变了 NLP 领域。 BERT 的核心思想用两句话概括：
    status: inferred
tags: []
---
# LLM 演进路线：理解技术选择

> 前置：大语言模型基础。目标：分清架构、训练目标、对齐、推理时计算和 Agent 系统分别解决什么问题。最后核对：2026-09-29。

这是一条理解思路的路线，不是每年“最强模型”排行榜。产品名称、性能与定价变化很快；阅读时关注可迁移的技术问题，并到官方资料核对具体版本。

## 一张路线图

| 阶段 | 代表工作 | 主要问题 |
|------|----------|----------|
| 2017：Transformer | Attention Is All You Need | 用注意力有效处理序列 |
| 2018–2020：预训练范式 | BERT、GPT 系列、T5 | 如何利用大规模数据得到可迁移能力 |
| 2022 起：指令与对话 | InstructGPT、对话模型 | 如何更好遵循用户意图 |
| 2024 起：效率与开放模型 | MoE、开放权重模型 | 如何权衡容量、计算和部署 |
| 2025 起：推理时计算 | 推理模型 | 如何为复杂任务分配更多计算 |
| 持续发展：工具化系统 | 工具调用、检索、Coding Agent | 如何与外部世界交互并验证结果 |

这些趋势相互重叠，不构成严格的替代关系。BERT 仍适合一些表示和分类任务，生成式模型也不只用一种架构。

## Encoder、Decoder 与训练目标

BERT 一类 Encoder 模型常用双向上下文学习表示，适合编码、分类与检索等任务。自回归 Decoder 模型按顺序预测下一个 token，适合连续生成。Encoder-Decoder 架构把输入表示和目标生成分开，适合翻译、摘要等序列到序列任务。选择哪种架构取决于任务与资源，不能只用“新旧”判断。

大规模预训练提供通用能力；指令微调与偏好优化使模型更能遵循任务和交互约束。它们不能保证事实正确、权限安全或在每个场景都符合用户需求。

## 效率与推理

MoE（混合专家）让每个输入只激活部分参数，可能改善特定规模下的计算效率，但路由、训练稳定性和部署复杂度也随之增加。推理模型可在回答前或过程中使用更多计算处理复杂问题；具体实现和是否展示中间推理因产品而异。不要把面向用户的解释等同于模型内部全部计算过程。

## 从模型到 Agent 系统

工具调用、代码执行、检索、权限与审计通常由模型和应用框架共同完成。模型提出下一步，宿主程序校验并执行动作；工具结果再进入后续上下文。Agent 是否需要自主循环、多个子 Agent 或长期状态，应由任务复杂度、成本和评测结果决定，而非由年份决定。

继续读：AI 应用开发、Agent 工具与安全、[Agentic 工程模式](/AI/%E5%BA%94%E7%94%A8%E4%B8%8E%E8%AF%84%E6%B5%8B/%E6%99%BA%E8%83%BD%E4%BD%93/agentic-engineering-patterns.md)。

## 一手资料

- [Transformer 原论文](https://arxiv.org/abs/1706.03762)、[BERT 原论文](https://arxiv.org/abs/1810.04805)、[GPT-3 原论文](https://arxiv.org/abs/2005.14165)
- [InstructGPT 原论文](https://arxiv.org/abs/2203.02155)、[Switch Transformer 原论文](https://arxiv.org/abs/2101.03961)、[DeepSeek-R1 原论文](https://arxiv.org/abs/2501.12948)
- [Anthropic 构建有效 Agent](https://www.anthropic.com/engineering/building-effective-agents)、[MCP 官方文档](https://modelcontextprotocol.io/)
