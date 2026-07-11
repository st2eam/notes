# LLM 演进路线：从 BERT 到 Agent-Ready 模型

> 梳理预训练语言模型从 2018 年至今的核心架构演进，理解每个阶段的突破和今天的技术格局。
>
> 前置阅读：[BERT 快速入门](../Python/NLP/BERT/快速入门.md)、[大语言模型基础](./大语言模型基础.md)

---

## 演进全景图

```
2018 ─ BERT (Encoder-Only)
        │  双向理解，MLM+NSP
        │
2019 ─ GPT-2 (Decoder-Only)
        │  自回归生成，Zero-shot
        │
2020 ─ GPT-3  (175B)，T5 (Encoder-Decoder)
        │  In-Context Learning 涌现
        │
2022 ─ ChatGPT / GPT-3.5
        │  RLHF，对话对齐
        │
2023 ─ GPT-4，Llama 2，Claude 2
        │  多模态，开源追赶
        │
2024 ─ Llama 3，Qwen2，DeepSeek-V3，Claude 3.5
        │  MoE 爆发，超长上下文
        │
2025 ─ DeepSeek-R1，GPT-4.5/5，Claude 4，Gemini 3
        │  推理增强，Agent 原生，MCP 协议
        │
2026 ─ Agent-Ready Models
           原生工具调用，代码执行，自主工作流
```

---

## 阶段一：Encoder-Only 时代（2018）

### BERT — 理解语言的革命

[BERT](../Python/NLP/BERT/快速入门.md) 的核心贡献：

- **深度双向**：首次让每个词同时看到左右上下文
- **预训练-微调范式**：一个预训练模型 + 少量数据微调 = 各种下游任务 SOTA
- **MLM 任务**：随机遮词预测，迫使模型真正"理解"语言

**局限：** 不适合生成任务。BERT 是"理解"模型，不是"生成"模型。

### 同期模型

| 模型 | 架构 | 特点 |
|------|------|------|
| GPT-1 (2018) | Decoder-Only | 单向，自回归，12 层 |
| RoBERTa (2019) | Encoder-Only | BERT 的"训练更久更大"版本 |
| ALBERT (2019) | Encoder-Only | 参数共享，参数量大幅减少 |
| T5 (2019) | Encoder-Decoder | "万物皆 Seq2Seq"，统一 11 种任务 |

---

## 阶段二：Decoder-Only 崛起（2019-2022）

### GPT-2 → GPT-3：规模带来质变

| 模型 | 参数量 | 核心突破 |
|------|--------|---------|
| GPT-2 (2019) | 1.5B | Zero-shot Transfer — 不微调也能做下游任务 |
| GPT-3 (2020) | 175B | **In-Context Learning** — 给几个示例就能学会新任务 |

GPT-3 证明了一个关键假设：**模型足够大 + 数据足够多 = 涌现新能力**。不需要微调，只需要在 prompt 里放几个示例（Few-shot），模型就能完成从未训练过的任务。

### 为什么 Decoder-Only 赢了？

| 架构 | 优势 | 劣势 |
|------|------|------|
| **Encoder-Only** (BERT) | 理解能力强，分类/NER 效果好 | 不会生成，只能做"判断题" |
| **Encoder-Decoder** (T5) | 输入输出灵活 | 输入和输出共享 context window，效率低 |
| **Decoder-Only** (GPT) | 生成能力强，自回归训练简单高效，**可以统一所有任务为"补全"** | 对"理解"任务的效率不如 Encoder-Only |

**关键转折：** 当模型大到一定程度，Decoder-Only 的理解能力追上了 Encoder-Only，而生成能力是 Encoder-Only 永远做不到的。所以 Decoder-Only 一统天下。

---

## 阶段三：对齐与对话（2022-2023）

### ChatGPT — 让模型"听话"

GPT-3 能生成很好的文本，但它不懂"对话"，经常胡说八道。OpenAI 用三步让它变成 ChatGPT：

```
Step 1: SFT（Supervised Fine-Tuning）
    → 人工写高质量对话示例，微调模型
Step 2: RM（Reward Model）
    → 训练一个奖励模型来判断哪个回答更好
Step 3: PPO（强化学习）
    → 用 RM 的评分优化模型，让回答更符合人类偏好
```

这个流程叫 **RLHF**（Reinforcement Learning from Human Feedback），是所有对话模型的标准做法。

### Claude 的差异化路线

Anthropic 提出 **Constitutional AI**（宪法 AI），让模型自己根据一套原则（如"不要有害""要诚实"）来评判和改进自己的输出，减少对人工标注的依赖。

---

## 阶段四：MoE + 开源追赶（2024）

### MoE（Mixture of Experts）架构

传统 Dense 模型：每次推理激活**所有参数**。

MoE 模型：

```
输入 → Router（路由器）
         ↙    ↓    ↘
      Expert1 Expert2 Expert3 ... ExpertN
         ↘    ↓    ↙
          合并 → 输出

每次推理只激活 ~10% 的参数
```

| 优势 | 说明 |
|------|------|
| **推理成本低** | 总参数大但激活参数小，速度快、省钱 |
| **训练效率高** | 同样的算力可以训练更大的模型 |
| **专家分工** | 不同专家自动专精不同领域 |

**代表模型：** DeepSeek-V3（671B 总参数，37B 激活）、Mixtral 8x7B、Qwen3-MoE

### 开源生态爆发

| 组织 | 代表模型 | 贡献 |
|------|---------|------|
| **Meta** | Llama 3/4 | 开源标杆，推动整个社区 |
| **阿里** | Qwen2/3 | 中文最强，MoE 版本性价比极高 |
| **DeepSeek** | V3, R1 | 极低成本训练，R1 推理链公开 |
| **Mistral** | Mistral Large | 欧洲代表，轻量高效 |
| **Google** | Gemma 3 | 开源小模型，端侧部署 |

---

## 阶段五：推理增强（2025）

### DeepSeek-R1 与 o4 — "先想想再说"

传统 LLM 一问就答。推理增强模型会在回答前进行**内部思考链（Chain of Thought）**：

```
用户: 小明有 5 个苹果，给小红 2 个，又买了 3 个，现在有几个？

传统模型: 6 个 ← 直接给答案

推理模型:
  让我想想...
  小明一开始有 5 个
  给了小红 2 个 → 5 - 2 = 3
  又买了 3 个 → 3 + 3 = 6
  答案是 6 个 ← 展示完整推理过程
```

**训练方法：**

| 方法 | 说明 |
|------|------|
| **RL on CoT** | 用强化学习优化模型生成"思考链"的质量 |
| **蒸馏** | 让大模型的推理链教小模型怎么思考 |
| **Test-time Compute** | 推理时分配更多算力做"深度思考" |

**代表模型：** DeepSeek-R1、OpenAI o4-mini/o4、Claude 4 Opus（extended thinking）

---

## 阶段六：Agent 原生模型（2026）

### 从"文本生成器"到"自主工作者"

最新一代模型的核心能力不再是"生成更好的文本"，而是**能做事情**：

| 能力 | 说明 |
|------|------|
| **原生 Tool Use** | 不需要复杂的 prompt engineering，模型自动判断何时调用工具 |
| **代码执行** | 写代码 → 运行 → 看结果 → 调试（Claude Code、OpenAI Codex） |
| **MCP 协议** | Anthropic 推出的 Model Context Protocol，标准化工具接口 |
| **Subagent** | 自动派遣子 Agent 处理独立子任务，管理上下文 |
| **自主循环** | 设定目标 → Agent 自主规划 → 执行 → 观察 → 调整 |

### 现代 AI Agent 架构

```
┌──────────────────────────────────────────┐
│               User Prompt                 │
└──────────────────┬───────────────────────┘
                   ▼
┌──────────────────────────────────────────┐
│            Orchestrator Agent             │
│  分析任务 → 规划步骤 → 分配子任务           │
└───────┬──────────┬──────────┬────────────┘
        ▼          ▼          ▼
   ┌────────┐ ┌────────┐ ┌────────┐
   │ Search │ │ Code   │ │ Browser│
   │ Agent  │ │ Agent  │ │ Agent  │
   └───┬────┘ └───┬────┘ └───┬────┘
       ▼          ▼          ▼
   ┌──────────────────────────────────────┐
   │     MCP Servers / Tools / APIs       │
   │  文件系统 · 数据库 · 浏览器 · Shell   │
   └──────────────────────────────────────┘
```

---

## 当前格局总结

| 维度 | 代表 | 关键特征 |
|------|------|---------|
| **闭源旗舰** | Claude 5, GPT-5.x, Gemini 3.1 | 最强综合能力，Agent 原生 |
| **开源主力** | Llama 4, Qwen3, DeepSeek-V3 | MoE 架构，性价比高 |
| **推理专家** | DeepSeek-R1, o4-mini | RL on CoT，数理逻辑强 |
| **端侧小模型** | Gemma 3, Phi-4, Qwen3-small | 1B-7B，手机/PC 可跑 |
| **Agent 工具** | Claude Code, Codex, Gemini CLI | 代码执行 + 子 Agent + MCP |

---

## 关键 Takeaway

1. **Decoder-Only 一统天下** — 不是因为它"更好"，而是因为它"更通用"（能理解也能生成）
2. **规模不是一切** — MoE + 推理增强让"小激活参数"也能达到"大总参数"的效果
3. **RLHF 让模型可用** — 没有对齐的模型再强也没法用
4. **推理是 2025 最大突破** — "先想再说"大幅提升复杂任务表现
5. **Agent 是终局方向** — 模型不再只是聊天，而是能做事的自主系统
6. **MCP 是基础设施** — 标准化工具接口让 Agent 生态可组合

---

## 延伸阅读

- [BERT 快速入门](../Python/NLP/BERT/快速入门.md) — 理解 Encoder-Only 时代的代表作
- [大语言模型基础](./大语言模型基础.md) — LLM 核心概念（Token、Attention、RAG、Agent）
- [Agentic Engineering Patterns](./agentic-engineering-patterns.md) — Simon Willison 的 Agent 工程实战指南
- [Prompt Engineering](./Prompt%20Engineering.md) — 提示词设计原则

---

> 📅 最后更新：2026-07-12
