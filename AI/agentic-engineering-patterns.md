# Agentic 工程模式实践指南（最终版）

> 基于 Simon Willison 的 [Agentic Engineering Patterns](https://simonwillison.net/guides/agentic-engineering-patterns/) 深度学习整理
>
> 生成日期：2026-07-12

---

## 目录

1. [什么是 Agentic 工程？](#1-什么是-agentic-工程)
2. [核心原则](#2-核心原则)
3. [与 Coding Agent 协作](#3-与-coding-agent-协作)
4. [测试与质量保证](#4-测试与质量保证)
5. [理解代码](#5-理解代码)
6. [实战案例：Prompt 拆解](#6-实战案例prompt-拆解)
7. [实用 Prompt 模板](#7-实用-prompt-模板)
8. [速查清单](#8-速查清单)
9. [参考资源](#9-参考资源)
10. [核心要点](#10-核心要点)

---

## 1. 什么是 Agentic 工程？

**Agentic 工程** = 使用 Coding Agent 辅助开发软件的实践。

### 关键概念

| 概念 | 定义 |
|------|------|
| **Agent** | 在循环中调用工具以实现目标的软件 — *"Agents run tools in a loop to achieve a goal"* |
| **Coding Agent** | 能**编写并执行代码**的 Agent（Claude Code、OpenAI Codex、Gemini CLI 等） |
| **核心能力** | **代码执行** — 没有执行能力，LLM 输出的价值极其有限。有了执行能力，Agent 可以持续迭代直到代码真正工作 |

### 与 Vibe Coding 的区别

| | Vibe Coding | Agentic 工程 |
|------|-------------|-------------|
| **提出者** | Andrej Karpathy（2025.2） | Simon Willison |
| **做法** | 提示 LLM 写代码，"忘记代码的存在" | 系统性地使用 Agent，审查、测试、迭代 |
| **产出** | 原型级、未审查 | **生产级** — 有审查、有测试、有质量保证 |
| **态度** | "无所谓，让 AI 搞" | "我是司机，AI 是引擎" |

### 人类的角色

> 写代码从来不是软件工程师的唯一活动。真正的技艺在于**弄清楚该写什么代码**。

任何软件问题都有数十种潜在解决方案，各有权衡。我们的工作是：
- 导航这些选项，找到最适合当前场景的
- 为 Agent 提供工具、以正确的粒度描述问题
- 验证并迭代结果，直到确信代码健壮且可信

> **LLM 不会从错误中学习，但 Coding Agent 可以**——前提是我们刻意更新指令和工具体系来吸收每次的经验教训。

---

## 2. 核心原则

### 2.1 写代码现在很便宜了

**范式转变：** 代码曾经昂贵（几百行干净代码 = 一天工作量），Coding Agent 让"敲代码"几乎免费。

#### 宏观 vs 微观

| 层面 | 过去 | 现在 |
|------|------|------|
| **宏观** | 大量时间规划、估算，确保昂贵的编码时间高效使用 | 功能不再需要"赚回开发成本"才值得做 |
| **微观** | "重构函数多花一小时值不值？"→ 权衡 | 直接让 Agent 去做，几分钟后检查结果 |

并行 Agent 让这个变化更难评估——一个工程师可以同时在多个地方实现、重构、测试、写文档。

#### ⚠️ 好代码仍然有成本

"好代码"的九条标准：

1. ✅ **能工作** — 没有 bug
2. ✅ **我们知道它能工作** — 有验证手段
3. ✅ **解决了正确的问题**
4. ✅ **优雅处理错误** — 不只考虑 happy path
5. ✅ **简单、最小化** — 人类和机器都能理解、未来都能维护
6. ✅ **有测试保护** — 测试证明现在能工作，并作为回归套件防止未来悄悄坏掉
7. ✅ **有适当文档** — 反映系统当前状态
8. ✅ **设计支持未来变更** — YAGNI（不需要的别加），但不让未来改动异常困难
9. ✅ **满足所有 "ility"** — 可访问性、可测试性、可靠性、安全性、可维护性、可观察性、可扩展性、可用性

#### 🎯 实践建议

> 每当直觉说"不值得花时间做那个"时，**发一个 prompt 试试**。最坏的结果不过是几分钟后发现不值得那些 token。

---

### 2.2 囤积你会做的事情

**核心思想：** 你掌握的每一种技术能力，都是未来 Agent 的燃料。

#### 囤积什么？为什么？

- 理论上可能 ≠ 实际见过能跑的代码
- 知道"这个问题能用 X 技术解决" + 有可运行的示例代码 = **Agent 可以直接复用**
- 每多一个解决方案，就多一个 Agent 的输入素材

#### 如何囤积？

| 方式 | 说明 | 示例 |
|------|------|------|
| **博客 / TIL** | 记录你解决过的问题 | simonwillison.net、til.simonwillison.net |
| **GitHub 仓库** | 收集 proof-of-concept 代码 | Simon 有 1000+ 个仓库 |
| **HTML 工具集** | 单页 HTML+JS+CSS 解决特定问题 | tools.simonwillison.net（200+ 工具） |
| **研究仓库** | Agent 研究问题后返回的代码 + 报告 | simonw/research |

#### 👑 杀手级 Prompt 模式：组合已有方案

让 Agent 把两个或多个已有示例组合成新工具。这是 Simon 最推崇的模式：

```
这段代码展示了如何将 PDF 转为图片：[代码片段]
这段代码展示了如何 OCR 图片：[代码片段]
用这些例子组合一个单页 HTML 工具，支持拖拽 PDF、逐页转 JPEG、运行 OCR、显示结果。
```

**实际案例：** Simon 把 Tesseract.js（OCR）+ PDF.js（PDF 渲染）组合成了浏览器端 PDF OCR 工具，一个 prompt 搞定。

#### Agent 时代的进阶用法

```bash
# 从工具库获取源码并组合
curl 获取 https://tools.simonwillison.net/ocr 和 gemini-bbox 的源码，构建一个新工具...

# 参考已有项目的做法
给 ~/dev/ecosystem/datasette-oauth 添加 mock HTTP 测试，参考 ~/dev/ecosystem/llm-mistral 的方式

# 克隆仓库让 Agent 学习
克隆 simonw/research 到 /tmp，找 Rust 编译为 WebAssembly 的例子，用它构建一个 demo
```

> **关键洞察：** Coding Agent 意味着我们只需要**搞清楚一次**某个技巧。只要用可运行的代码示例记录下来，Agent 就能在未来无限次复用。

---

### 2.3 AI 应该帮我们产出更好的代码

**核心观点：** 如果用 Agent 导致代码质量下降，那是你的**选择问题**，不是必然结果。我们可以选择产出更好的代码。

#### 避免产生技术债

常见的技术债（都是"概念简单但耗时"的改动）——这正是 Agent 的理想应用场景：

| 技术债类型 | 传统困境 | Agent 做法 |
|-----------|---------|-----------|
| API 设计不覆盖新场景 | 修几十个地方太慢 → 加重复 API | 开分支让 Agent 后台批量改 |
| 命名选错了 | 全改太累 → 只在 UI 层修 | Agent 全局搜索替换 |
| 重复但略有不同的功能 | 需要合并重构 | Agent 分析差异并统一 |
| 文件膨胀到几千行 | 需要拆分模块 | Agent 按职责拆分 |

**做法：**

```
启动一个 Agent，告诉它改什么，让它在分支/工作区后台运行。
```

推荐使用异步 Agent（不打断本地工作流）：
- Gemini Jules
- OpenAI Codex Web
- Claude Code Web

**评估流程：** PR 出来 → 好就合并 → 差不多就再提示 → 差就丢掉。

> 这些改进的成本已经低到可以对"小代码异味"**零容忍**。

#### 让 Agent 帮你探索更多选项

```
Redis 适合作为预期数千并发用户的动态 feed 的选择吗？
```

Agent 从一个 prompt 构建**模拟系统 + 负载测试** → 低成本验证技术选型。成本低到可以**同时测试多种方案**，选最合适的。

#### 拥抱复合工程循环（Compound Engineering）

Every 公司（Dan Shipper / Kieran Klaassen）的做法：

```
每个编码项目结束 → 回顾（compound step）→ 把有效做法文档化
                                          ↓
                            文档成为未来 Agent 运行的输入
                                          ↓
                              小改进复合累积 → 质量持续提升
```

> 过去：质量 vs 速度只能二选一。现在：Agent 让我们可以**两者兼得**。

---

### 2.4 反模式：要避免的事

#### ❌ 把未审查的代码甩给协作者

**绝对不要提交你没审查过的 PR。** 别人也可以自己 prompt Agent——你提供的价值在哪里？

一个好的 Agentic PR 应该满足：

| 标准 | 说明 |
|------|------|
| ✅ 代码能用 | **你**有信心它能工作 |
| ✅ 变更足够小 | 便于高效审查（几个小 PR > 一个大 PR） |
| ✅ 包含上下文 | 高层目标、相关 issue 链接 |
| ✅ 描述已审查 | Agent 写的 PR 描述**你也要审** |
| ✅ 有测试证据 | 手动测试笔记、截图、视频、实现选择说明 |

---

## 3. 与 Coding Agent 协作

### 3.1 Coding Agent 的工作原理

```
┌─────────────────────────────────────────────────┐
│                  Coding Agent                    │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │   LLM    │  │ System   │  │    Tools     │  │
│  │ (模型)   │←→│ Prompt   │  │ (Bash, etc.) │  │
│  └──────────┘  └──────────┘  └──────────────┘  │
│       ↕                            ↕            │
│  ┌──────────────────────────────────────────┐   │
│  │            工具循环 (Loop)               │   │
│  │  Prompt → LLM → 调用工具 → 结果 → LLM   │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

#### 核心组件

| 组件 | 说明 |
|------|------|
| **LLM** | 核心模型（GPT-5、Claude Opus、Gemini 等），本质是"句子补全引擎" |
| **Token** | LLM 处理的基本单位，不是文字而是整数序列。按 token 计费和限制长度 |
| **Chat 模板** | 用模拟对话格式包装 prompt（`user:` / `assistant:` 交替） |
| **Token 缓存** | 近期处理过的 token 前缀可复用计算，降低费用 |
| **工具调用** | Agent 的定义特征 — LLM 输出 `<tool>xxx</tool>`，Agent 执行并回传结果 |
| **System Prompt** | 隐藏指令，定义行为、可用工具、基本规则（可达数百行） |
| **推理 (Reasoning)** | 模型在回复前"思考"，花更多 token 换更好结果。对复杂编程问题价值巨大 |
| **Vision** | 多模态模型可直接接受图像作为输入 token |

#### LLM 的无状态性

每次 LLM 调用从零开始 → 要维持对话必须**重放整个历史** → 对话越长越贵 → Subagent 是解决方案。

#### 工具调用机制（核心理解）

```
system: 如果需要天气信息，以 <tool>get_weather(city)</tool> 结束
user: 旧金山天气？
assistant: <tool>get_weather("San Francisco")</tool>
→ Agent 执行工具 → 得到 "61°F, 局部多云"
user: <tool-result>61°F, 局部多云</tool-result>
assistant: 旧金山目前 61°F（约 16°C），局部多云...
```

> **核心公式：LLM + System Prompt + Tools → 在循环中运行 = Coding Agent**

---

### 3.2 使用 Git 与 Coding Agent 协作

Git 是 Agentic 工程的关键基础设施——记录变更历史、允许调查和撤销错误。

#### 基础 Prompt

| Prompt | 作用 |
|--------|------|
| `Start a new Git repo here` | 初始化仓库 |
| `Commit these changes` | 创建提交 |
| `Add username/repo as a github remote` | 配置 GitHub 远程 |
| `Review changes made today` | 查看最近变更 — **启动新 session 的最佳方式** |
| `Integrate latest changes from main` | 合并主分支最新代码 |
| `Discuss options for integrating changes from main` | 让 Agent 解释合并策略的利弊 |
| `Sort out this git mess for me` | 🔥 **万能 prompt** — 解决合并冲突等各种混乱 |
| `Find and recover my code that does...` | 通过 reflog 找回丢失的代码 |
| `Use git bisect to find when this bug was introduced` | 二分查找定位 bug 引入点 |

#### 高级：重写历史

Git 历史不是固定记录，而是**刻意编写的项目进展故事**。Agent 对此极其精通：

| Prompt | 作用 |
|--------|------|
| `Undo last commit` | 撤销上次提交 |
| `Remove uv.lock from that last commit` | 从提交中移除单个文件 |
| `Combine last three commits with a better commit message` | 合并提交 + 改写消息 |
| `Start a new repo at /tmp/xxx and build a library there with lib/xxx.py - build a similar commit history` | 从旧仓库提取代码到新仓库，保留历史 |

> Agent 在 commit message 上的品味通常很好，甚至经常比你自己写的更好。

---

### 3.3 子 Agent (Subagents)

**为什么需要？** LLM 有上下文限制（~1M token，200K 以下质量更好）。主 Agent 的上下文是最宝贵的资源。Subagent 用**全新上下文窗口**处理子任务，不消耗主 Agent token。

#### 三种模式

**1. 探索型（Explore）**

Claude Code 的标准做法 — 每次新任务先派遣子 Agent 搜索代码库，返回摘要。主 Agent 不需要逐个文件阅读。

```
Agent 自动构造 prompt → 派遣子 Agent 搜索 → 返回结构化摘要 → 主 Agent 开始工作
```

**2. 并行型（Parallel）**

```
用子 Agent 找到并更新所有受此变更影响的模板
```

多个子 Agent 同时运行（可用更快更便宜的模型如 Claude Haiku），显著提速。适合编辑多个独立文件的场景。

**3. 专家型（Specialist）**

| 角色 | 职责 | 适用场景 |
|------|------|---------|
| **代码审查 Agent** | 审查代码，找 bug、功能缺口、设计弱点 | PR 提交前 |
| **测试运行 Agent** | 运行测试套件，隐藏详细输出，只报告失败 | 测试输出特别冗长时 |
| **调试 Agent** | 专门推理 bug 根因，隔离复现步骤 | 复杂 bug 难以定位时 |

> ⚠️ 不要过度切分 — Subagent 仍有开销，需要权衡。

#### 支持 Subagent 的工具

OpenAI Codex / Claude Code / Gemini CLI / Cursor / VS Code Copilot

---

## 4. 测试与质量保证

### 4.1 红/绿 TDD

**"Use red/green TDD" — 四个词包含大量工程纪律。**

#### 流程

```
🔴 红色阶段：先写测试 → 确认测试失败（这步不能跳过！）
🟢 绿色阶段：写实现代码 → 确认测试通过
```

#### 为什么特别适合 Agent？

- Agent 可能写出不工作的代码 → **测试保护**
- Agent 可能写出多余的代码 → **测试定义了需求边界**
- 随着项目增长 → **回归测试越来越重要**

#### ⚠️ 关键：必须先确认测试失败

跳过红色阶段 → 风险是测试本身已经通过了（写了一个不测任何东西的测试），没有真正验证新实现。

#### Prompt 示例

```
构建一个 Python 函数从 markdown 字符串提取标题。使用红/绿 TDD。
```

---

### 4.2 先运行测试

**"First run the tests" — 另一个四词魔法咒语。**

每次启动新 Agent session 时的第一步：

```
First run the tests
```

或更具体：

```
Run "uv run pytest"
```

| 效果 | 说明 |
|------|------|
| 告诉 Agent 有测试套件 | 迫使它学会如何运行测试，后续会自动运行 |
| 了解项目规模 | 测试数量暗示项目复杂度和结构 |
| 建立测试心态 | Agent 后续更倾向于为新改动扩展测试 |

---

### 4.3 Agent 手动测试

> 代码通过测试 ≠ 功能正常。自动化测试无法替代手动测试。Simon 坚持："我喜欢亲眼看到功能运行再发布。"

**如果 Agent 发现手动测试中的问题 → 用 red/green TDD 修复 → 确保新 case 被永久自动化测试覆盖。**

#### 按项目类型选择测试方式

| 项目类型 | 测试方式 | Prompt |
|---------|---------|--------|
| Python 库 | `python -c` | `Try that new function on some edge cases using python -c` |
| JSON API | `curl` | `Run a dev server and explore that new JSON API using curl` |
| Web UI | Playwright / Rodney | `Test that with Playwright` |
| 任何类型 | 临时文件 | `Write code in /tmp to try edge cases and then compile and run` |

> "explore" 这个词会让 Agent 自动尝试 API 的多个方面，快速覆盖大量场景。

#### 浏览器自动化工具

| 工具 | 说明 |
|------|------|
| **Playwright** | 微软开源，最强大，支持多语言绑定和多浏览器引擎 |
| **agent-browser (Vercel)** | 专门为 Coding Agent 设计的 Playwright CLI 封装 |
| **Rodney** | Simon 自研，Chrome DevTools Protocol 直接控制 Chrome |

#### 一条 prompt 实现大量手动测试

```
启动开发服务器，然后用 `uvx rodney --help` 测试新主页，
看截图确认菜单位置正确
```

**三个隐藏技巧：**

1. `uvx rodney --help` → 自动安装 Rodney 并获取使用说明
2. Rodney 的 `--help` 输出**专为 Agent 设计**，包含所有必要信息
3. `"look at screenshots"` → 提示 Agent 使用 vision 能力评估页面视觉效果

#### 用 Showboat 记录测试过程

```
运行 `uvx showboat --help`，然后创建 notes/api-demo.md showboat 文档，
用它测试和记录那个新 API
```

Showboat 命令：
- `note` → 添加 Markdown 注释（Agent 自己的观察）
- `exec` → 执行命令并**记录命令本身和输出**（防止 Agent 作弊/幻觉）
- `image` → 添加图片（配合 Rodney 截图）

---

## 5. 理解代码

### 5.1 线性代码走查（Linear Walkthroughs）

当面对不熟悉的代码——可能是别人的、自己忘了的、或 vibe code 出来的——让 Agent 生成结构化走读文档。

#### 示例 Prompt

```
阅读源码，然后规划一个线性走查，详细解释代码如何工作

然后运行 "uvx showboat --help" 学习 showboat - 用 showboat 创建 walkthrough.md 文件，
用 showboat note 写注释，用 showboat exec 加 sed/grep/cat 包含你讨论的代码片段
```

**关键：** `用 sed/grep/cat 提取代码` → 防止 Agent 手动复制代码导致的幻觉或错误。

#### 价值

- 快速理解新代码库
- 即使是 40 分钟 vibe coding 的项目，也能成为学习新生态系统的机会
- 产出可复用的文档

---

### 5.2 交互式解释（Interactive Explanations）

当代码变成无法理解的"黑箱"时 → **认知债务（Cognitive Debt）**。解决方案：让 Agent 构建**交互式动画解释**。

#### Simon 的 Word Cloud 案例

```
1. 让 Agent 用 Rust 构建词云 CLI 工具（异步研究项目）
2. 线性走读理解 Rust 代码结构
3. 仍不理解"阿基米德螺旋放置"算法
4. 让 Agent 构建 animated-word-cloud.html：
   - 接受粘贴文本（持久化在 URL #fragment 中）
   - 动画展示词云构建算法
   - 包含暂停/速度调节/逐帧步进滑块
   - 任何阶段可下载为 PNG
```

**效果：** 通过观察动画中每个词尝试放置、碰撞检测、螺旋外扩的过程，算法的直觉一下子就建立了。

> 好的 Coding Agent 可以**按需生成可视化解释**——无论是解释自己的代码还是别人的代码。动画和交互界面比文字描述有效得多。

---

## 6. 实战案例：Prompt 拆解

### 案例 1：GIF 优化工具（WebAssembly + Gifsicle）

完整 prompt：

```
gif-optimizer.html
Compile gifsicle to WASM, then build a web page that lets you open or drag-drop
an animated GIF onto it and it then shows you that GIF compressed using gifsicle
with a number of different settings, each preview with the size and a download
button. Also include controls for the gifsicle options for manual use - each
preview has a "tweak these settings" link which sets those manual settings to
the ones used for that preview so the user can customize them further.
Run "uvx rodney --help" and use that tool to test your work - use this GIF for
testing: https://static.simonwillison.net/static/2026/animated-word-cloud-demo.gif
```

#### 逐行拆解

| Prompt 片段 | 技巧分析 |
|------------|---------|
| `gif-optimizer.html` | **文件名即指令** — Agent 通过 `ls` 理解仓库结构，知道这是新工具 |
| `Compile gifsicle to WASM` | 信任 Agent 的**试错能力** — WASM 编译极其复杂，但 Agent 擅长暴力破解编译错误（人类在第五个晦涩的编译器错误后就放弃了） |
| `open or drag-drop an animated GIF` | 描述一个精致的 UI — 手动写拖放+预览很费时，prompt 几乎免费 |
| `number of different settings, each preview with size and download` | 不指定具体设置 — **信任 Agent 的品味**，不行再改 |
| `"tweak these settings" link` | 复杂的 UI 交互 — 用自然语言描述就是几秒钟的事 |
| `Run "uvx rodney --help" and use that tool to test` | **给 Agent 验证机制** — 让它自己测试自己的工作 |
| `use this GIF for testing` | 提供具体的测试数据 — 减少歧义 |

---

### 案例 2：为 Newsletter 工具添加新内容类型

```
Clone simonw/simonwillisonblog from github to /tmp for reference
Update blog-to-newsletter.html to include beats that have descriptions -
similar to how the Atom everything feed on the blog works
Run it with python -m http.server and use `uvx rodney --help` to test it -
compare what shows up in the newsletter with what's on the homepage of
https://simonwillison.net
```

#### 逐行拆解

| Prompt 片段 | 技巧分析 |
|------------|---------|
| `Clone X to /tmp for reference` | **参考而不污染** — Agent 可以研究参考代码，但 `/tmp` 确保不会被意外提交 |
| `beats that have descriptions` | 业务逻辑的精简表达 — 一句话描述了过滤条件 |
| `similar to how the Atom feed works` | **用已有功能定义新需求** — 不需要描述具体逻辑，Agent 自己看代码学习 |
| `python -m http.server` | 肌肉记忆 — 避免静态文件直接打开导致的数据获取问题 |
| `use uvx rodney --help` | 同样的验证模式 — **让 Agent 自己验证自己** |
| `compare what shows up... with the homepage` | 双重校验 — Agent 对比两个来源确认正确性 |

> 结果：一次 prompt 就得到了正确的 PR — 在 SQL 查询中加了 UNION 子句，完美实现了需求。

---

## 7. 实用 Prompt 模板

### 7.1 原型开发（Artifacts / Canvas）

Claude Project 自定义指令：

```
不要在 artifact 中使用 React - 始终使用原生 HTML 和 vanilla JavaScript 和 CSS，
最小依赖。

CSS 用两个空格缩进，以这段开头：
<style>
* { box-sizing: border-box; }

输入框和 textarea 字体大小 16px。字体优先 Helvetica。
JavaScript 用两个空格缩进，以这段开头：
<script type="module">
// 第一层代码不缩进

标题用 Sentence case。
```

### 7.2 校对

```
你是即将发布的文章的校对员。
1. 找出拼写错误和打字错误
2. 找出语法错误
3. 注意重复用词（如 "有趣的是 X... 有趣的是 Y..."）
4. 发现逻辑错误或事实错误
5. 标记可以加强的薄弱论点
6. 确保没有空的或占位链接
```

### 7.3 Alt 文本

```
为用户粘贴的任何图片写 alt text。Alt text 始终放在 fenced code block 中，
在一行内呈现，方便 Markdown 图片使用。图片上的所有文字必须完整包含（截图等）。
简短的图片性质描述放在前面。
```

### 7.4 播客精华

```
你会收到一个播客节目的文字稿。找出最有趣的引言 —
最能体现整体主题的，以及引入惊人想法或表达特别清晰、有趣、犀利的。
只回答这些引言 — 长引言没问题。
```

---

## 8. 速查清单

### 🚀 开始新 Agent 会话时

- [ ] `First run the tests` — 让 Agent 了解项目
- [ ] `Review changes made today` — 加载最近上下文
- [ ] 确认 Agent 了解项目结构

### 📝 写代码时

- [ ] 使用 `Use red/green TDD` 确保质量
- [ ] 用子 Agent 处理探索和并行任务
- [ ] 让 Agent 手动测试（`python -c`、`curl`、Playwright）

### 🔍 代码审查时

- [ ] 自己先审查，**不要把未审查的代码甩给别人**
- [ ] PR 要小、有上下文、有测试证据
- [ ] Agent 写的 PR 描述也要审查

### 🔧 重构时

- [ ] 用异步 Agent 后台运行（Gemini Jules / OpenAI Codex Web / Claude Code Web）
- [ ] PR 出来 → 好就合并 → 差不多再提示 → 差就丢掉
- [ ] 对"小代码异味"零容忍

### 📚 理解代码时

- [ ] 用线性走查 + Showboat 生成文档
- [ ] 让 Agent 用 shell 命令提取代码（避免幻觉）
- [ ] 需要直觉理解时 → 让 Agent 构建交互式动画

### 🔄 持续改进时

- [ ] 每个项目结束做回顾（Compound Step）
- [ ] 把有效的做法文档化 → 成为未来 Agent 运行的输入
- [ ] 保持囤积：每个搞清楚的技巧都留下可运行的代码示例

### 💡 心态转变

| 旧习惯 | → | 新习惯 |
|--------|---|--------|
| "不值得花时间做" | → | **试试发个 prompt** |
| "这个技巧以后可能用不到" | → | **囤积它 — Agent 会帮你复用** |
| "重构太麻烦了" | → | **Agent 可以后台做** |
| "技术选型不确定" | → | **Agent 可以构建原型验证** |
| "这个 PR 太大了" | → | **让 Agent 帮你拆分成几个小 PR** |
| "我不懂这段代码" | → | **让 Agent 构建交互式动画解释** |

---

## 9. 参考资源

| 资源 | 链接 |
|------|------|
| 原始指南 | https://simonwillison.net/guides/agentic-engineering-patterns/ |
| Simon Willison 博客 | https://simonwillison.net |
| TIL 博客 | https://til.simonwillison.net |
| HTML 工具集 | https://tools.simonwillison.net |
| 研究仓库 | https://github.com/simonw/research |
| Showboat（文档记录工具） | https://github.com/simonw/showboat |
| Rodney（浏览器自动化） | https://github.com/simonw/rodney |

---

## 10. 核心要点

1. **Agent 在循环中运行工具来实现目标** — 理解这个定义是理解一切的基础
2. **代码便宜了，好代码不便宜** — 人类的价值在于判断、审查、验证
3. **囤积解决方案** — 每个搞清楚的技巧 = Agent 未来可复用的燃料
4. **"值得花时间吗？"→ 先发 prompt 试试** — 成本低到没理由不做
5. **测试是绝对不可协商的** — TDD + Agentic Manual Testing 双管齐下
6. **审查你自己的 AI 代码** — 把未审查的 PR 甩给别人是最大的反模式
7. **拥抱复合工程** — 每次项目结束把有效做法文档化，小改进持续累积
8. **Subagent 管理上下文** — 最宝贵的资源是主 Agent 的 context window
9. **构建解释，而不只是代码** — 交互式动画帮你消灭"认知债务"
10. **永远不要假设 AI 写的代码能运行** — 运行它、测试它、亲眼看到它

---

> 📅 生成日期：2026-07-12
>
> 💡 这份指南本身也是"正在进行的作品"——Simon Willison 也在持续更新原始指南。建议定期回顾原文获取最新洞察。
