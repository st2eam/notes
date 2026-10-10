---
originalPath: AI/应用与评测/智能体/codex-cli工作流.md
primaryCategory: AI/应用与评测/智能体
categories:
  - path: AI/应用与评测/智能体
    reason: 正文讨论本地 Codex 执行与验收。
  - path: 计算机/基础/安全与权限
    reason: 正文解释工具授权与访问边界。
classificationStatus: confirmed
relations:
  - target: AI/应用与评测/智能体/agentic-engineering-patterns.md
    type: citation
    status: confirmed
    reason: 衔接工具循环。
    evidence: 强调循环中的执行与验证
  - target: AI/应用与评测/质量评测/应用评测.md
    type: citation
    status: confirmed
    reason: 采用应用评测方法。
    evidence: 保存相同任务集上的成功率、轨迹和费用
  - target: 计算机/基础/安全与权限/index.md
    type: citation
    status: confirmed
    reason: 引用权限主题入口。
    evidence: 沙箱和审批分开检查
  - target: 计算机/工程化/测试与持续集成/测试与CI.md
    type: citation
    status: confirmed
    reason: 采用可重复验收。
    evidence: 把验收命令固定下来
tags: []
---
# Codex CLI 本地工作流

> 目标：把本地任务变成可重复执行、可审查的流程。文档核对日期：2026-10-11。本机 PATH 未发现 codex，以下 CLI 示例依据官方文档，未在本机执行模型任务。

---

## 1. 执行前固定上下文

先检查仓库根目录、Git 差异与 AGENTS.md，写清目标、允许修改的路径和验收命令。[[AI/应用与评测/智能体/agentic-engineering-patterns|Agentic 工程模式实践指南]]强调循环中的执行与验证；CLI 只是启动这一过程的入口。

记录 codex --version、exec --help 与 exec resume --help。编辑器工具参数未必是 CLI 参数，模型可用性以账号为准。

## 2. 非交互执行与输出

codex exec 可从脚本运行任务。显式指定工作目录和沙箱，减少依赖隐含配置。下面是 PowerShell 示例；日志目录需要预先可写。[非交互模式](https://learn.chatgpt.com/docs/non-interactive-mode)

~~~powershell
Set-Location 'D:\code\notes'
New-Item -ItemType Directory -Force '.agent-logs' | Out-Null
codex exec --sandbox read-only --json -o .agent-logs/summary.md "检查智能体笔记链接并报告证据" > .agent-logs/events.jsonl 2> .agent-logs/stderr.log
$agentExitCode = $LASTEXITCODE
if ($agentExitCode -ne 0) { throw "Agent 执行失败：$agentExitCode" }
~~~

普通模式把进展写到 stderr、最终回答写到 stdout；--json 把 stdout 变成逐行 JSON 事件流，-o 单独保存最终回答。父脚本写日志与 Agent 沙箱内写文件是不同动作。读取 JSONL 要逐行解析并容忍未知事件；不要按终端装饰文本判断成功。[非交互模式](https://learn.chatgpt.com/docs/non-interactive-mode)

长提示通过 stdin 输入，避免引号出错。保留退出码、事件与摘要，发布前脱敏；摘要声称通过仍需验收证据。

## 3. 模型、推理与权限

--model 覆盖本次模型，ID 以账号可用列表为准。复杂任务用固定样本比较质量、耗时和成本。[CLI 参数参考](https://learn.chatgpt.com/docs/developer-commands?surface=cli)

官方示例使用 --config model_reasoning_effort=...。待核实：本机支持的 low、medium、high 等等级、默认值、模型组合与配置优先级。[修复循环示例](https://developers.openai.com/cookbook/examples/codex/build_iterative_repair_loops_with_codex)

read-only 用于调查，workspace-write 用于限定工作区内实现，danger-full-access 仅用于已有外部隔离的受控环境。沙箱和审批分开检查；无人值守任务遇到越权应停止并报告，不能依赖交互确认。具体设计参见[[AI/应用与评测/智能体/agent编排与工具沙箱|Agent 编排与工具沙箱]]与[[计算机/基础/安全与权限/index|安全与权限入口]]。[CLI 参数参考](https://learn.chatgpt.com/docs/developer-commands?surface=cli)

## 4. 恢复会话与本次经验

~~~powershell
codex exec resume --last "继续检查未完成的链接并运行验收"
codex exec resume SESSION_ID "根据验收失败修正笔记"
~~~

恢复指定 ID 比自动选最近会话更适合多任务脚本。恢复历史不会回滚文件或重建依赖，继续前要检查当前 Git 差异和权限。待核实：本机 resume 对模型、沙箱覆盖参数的支持，以及会话保存位置与保留策略。[非交互模式](https://learn.chatgpt.com/docs/non-interactive-mode)

本次整理在 Windows 本地工具环境中遇到两类真实问题：命令工具报 helper_unknown_error，尚未启动命令；另一次 git fetch 因 FETCH_HEAD 写权限失败。按仓库同步规则通过受审查的权限请求执行 fetch 后成功，远端无新提交；已有 Go 笔记与 .claude 改动被保留。这些是宿主环境观察，不能据此断言 codex exec 存在相同故障。

诊断应依次区分进程启动、文件权限、网络、认证和模型运行。只重试有依据的一层；模型任务启动失败时，不应捏造测试通过或扩大访问范围。

## 5. 验收与速查

用[[计算机/工程化/测试与持续集成/测试与CI|测试与 CI]]把验收命令固定下来，再按[[AI/应用与评测/质量评测/应用评测|应用评测]]保存相同任务集上的成功率、轨迹和费用。完成条件是产物与检查一致，退出码只是其中一项。

- 开始前记录版本、工作目录、权限和本地差异。
- 恢复前确认会话 ID 与文件状态，避免继续错误任务。
- 结束后审查差异、运行验收，并报告未完成项。
