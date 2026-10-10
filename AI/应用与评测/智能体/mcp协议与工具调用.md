---
originalPath: AI/应用与评测/智能体/mcp协议与工具调用.md
primaryCategory: AI/应用与评测/智能体
categories:
  - path: AI/应用与评测/智能体
    reason: 正文讨论 MCP 接入和工具循环。
  - path: 计算机与软件/基础/安全与权限
    reason: 正文解释工具授权与访问边界。
classificationStatus: confirmed
relations:
  - target: AI/应用与评测/智能体/agentic-engineering-patterns.md
    type: citation
    status: confirmed
    reason: 衔接工具循环。
    evidence: MCP 可接入其中的工具层
  - target: AI/应用与评测/质量评测/应用评测.md
    type: citation
    status: confirmed
    reason: 采用应用评测方法。
    evidence: 分别记录工具选择、参数、权限、时延和最终任务成功率
  - target: 计算机与软件/基础/安全与权限/index.md
    type: citation
    status: confirmed
    reason: 引用权限主题入口。
    evidence: 权限主题见
  - target: 计算机与软件/工程化/测试与持续集成/测试与CI.md
    type: citation
    status: confirmed
    reason: 采用可重复验收。
    evidence: 建立无权限、错误参数、超时和重复写入的回归检查
tags: []
---
# MCP 协议与工具调用

> 目标：理解协议接入和工具循环的分工。核对日期：2026-10-11；协议版本相关细节以实际 SDK 为准。

---

## 1. 角色与能力

MCP（Model Context Protocol）把 AI 应用与外部能力连接起来。它规定消息交换方式，应用仍要决定上下文、模型和执行策略。Host 是承载用户交互与模型调用的应用；客户端是 host 内负责访问某个服务器的组件；服务器是提供能力的程序，可以运行在本机或远端。[官方架构说明](https://modelcontextprotocol.io/docs/learn/architecture)

| 概念 | 作用 | 知识库例子 |
|------|------|------------|
| Host | 管理模型、客户端和权限 | 本地编码助手 |
| 客户端 | 发送请求并把结果交给 host | 笔记服务连接组件 |
| 服务器 | 暴露资源、工具、提示词 | 提供笔记检索的进程 |
| 资源 | 以 URI 标识的上下文数据 | 一篇笔记、数据库结构 |
| 工具 | 带参数约束的可执行操作 | 检索笔记、写入草稿 |
| 提示词 | 可复用的参数化交互模板 | 按指定主题整理资料 |

资源通常由应用选择，工具通常由模型提出调用，提示词通常由用户选择。模型提出调用后，实际执行仍由应用控制。服务器不必同时提供三类能力。[服务器概念](https://modelcontextprotocol.io/docs/learn/server-concepts)

## 2. 协议接入过程

MCP 使用 JSON-RPC 2.0，ID 匹配响应。stdio 通过子进程标准流通信，Streamable HTTP 适合远端。本地服务 stdout 留给协议，诊断走 stderr。[官方架构说明](https://modelcontextprotocol.io/docs/learn/architecture)

版本相关：2026-07-28 文档使用 server/discover；旧版本常见初始化握手，接入时固定 SDK 和协议版本，避免混用。[官方架构说明](https://modelcontextprotocol.io/docs/learn/architecture)

通过 tools/list 发现工具，再用 tools/call 执行；资源和提示词各有发现与读取接口。schema 约束参数形状，业务权限仍需服务器检查。[服务器概念](https://modelcontextprotocol.io/docs/learn/server-concepts)

## 3. 从 tool calling 到工具循环

[[AI/应用与评测/智能体/agentic-engineering-patterns|Agentic 工程模式实践指南]]说明 Agent 在循环中使用工具实现目标。MCP 可接入其中的工具层，tool calling 则是模型提出结构化调用的机制；普通函数也可以接入同一个循环。

~~~text
用户目标 → 模型提出工具名与参数 → host 校验与审批
        → 客户端调用服务器 → 返回结果 → 模型继续或结束
~~~

检索例子：模型生成 query；host 校验；服务器返回路径；模型阅读原文回答。结果必须按调用 ID 匹配，只有调用描述而没有实际执行时，任务并未完成。

## 4. 失败处理与安全

区分协议失败、工具业务失败和任务失败：连接断开、参数被拒、查无结果分别需要重连、修正参数、换查询。读操作可有限重试；写操作超时后先查询状态，使用幂等键或去重记录，避免重复写入。设置总轮数、耗时、输出大小与费用上限，并把停止原因交给用户。

权限主题见[[计算机与软件/基础/安全与权限/index|安全与权限入口]]。工具返回文本可能含提示注入，host 应把它当作外部数据；工具名称或“只读”描述不能替代授权检查。远端工具写入的数据库不受本地文件沙箱自动保护，具体边界见[[AI/应用与评测/智能体/agent编排与工具沙箱|Agent 编排与工具沙箱]]。

## 5. 验证与速查

按[[AI/应用与评测/质量评测/应用评测|应用评测]]分别记录工具选择、参数、权限、时延和最终任务成功率；用[[计算机与软件/工程化/测试与持续集成/测试与CI|测试与 CI]]建立无权限、错误参数、超时和重复写入的回归检查。

- 发现成功不代表调用成功；调用成功不代表需求完成。
- 保留调用 ID、脱敏参数、错误类别与耗时，避免把凭据写入轨迹。
- 接入新服务器先验证最小读操作，再检查写入审批与失败恢复。
