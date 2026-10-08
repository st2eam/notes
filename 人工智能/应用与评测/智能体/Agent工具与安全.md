---
originalPath: AI/Agent工具与安全.md
primaryCategory: 人工智能/应用与评测/智能体
categories:
  - path: 人工智能/应用与评测/智能体
    reason: >-
      核心学习对象为“Agent 工具与安全”，正文依据：“前置：AI
      应用开发、认证与授权。目标：设计最小工具接口，区分数据与指令，确定何时需要人工确认。最后核对：2026-09-29。 Agent
      常被描述为“模型在循环中选择工具并观察结果”。真正执行工具的仍是应用程序：它必须验证参数、权限和副作用。模型建议调用工具，不等于获得调用权限。”；据其实体与学习对象归入人工智能/应用与评测/智能体。
  - path: 计算机与软件/基础/安全与权限
    reason: 正文明确要求服务端验证身份、权限、参数与副作用，主题同时属于安全与授权边界。
classificationStatus: confirmed
relations:
  - target: 计算机与软件/数据/对象存储/访问控制RAM.md
    type: similar
    label: 主题对照
    reason: 共同讨论身份、权限和最小授权；前者约束工具执行，后者约束云资源访问。
    evidence: >-
      源笔记：前置：AI 应用开发、认证与授权。目标：设计最小工具接口，区分数据与指令，确定何时需要人工确认。最后核对：2026-09-29。 Agent
      常被描述为“模型在循环中选择工具并观察结果”。真正执行工具的仍是应用程序：它必须验证参数、权限和副作用。模型建议调用工具，不等于获得调用权限。；目标笔记：访问控制RAM（Resource
      Access Management）是阿里云提供的管理用户身份与资源访问权限的服务。
      RAM允许在一个阿里云账号下创建并管理多个身份，并允许给单个身份或一组身份分配不同的权限，从而实现不同用户拥有不同资源访问权限的目的。RAM的功能特性如下：
    status: inferred
tags: []
---
# Agent 工具与安全

> 前置：[AI 应用开发](/%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD/%E5%BA%94%E7%94%A8%E4%B8%8E%E8%AF%84%E6%B5%8B/%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91/AI%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91.md)、[认证与授权](/%E8%AE%A1%E7%AE%97%E6%9C%BA%E4%B8%8E%E8%BD%AF%E4%BB%B6/%E5%9F%BA%E7%A1%80/%E7%BD%91%E7%BB%9C/%E8%AE%A4%E8%AF%81%E4%B8%8E%E6%8E%88%E6%9D%83.md)。目标：设计最小工具接口，区分数据与指令，确定何时需要人工确认。最后核对：2026-09-29。

Agent 常被描述为“模型在循环中选择工具并观察结果”。真正执行工具的仍是应用程序：它必须验证参数、权限和副作用。模型建议调用工具，不等于获得调用权限。

## 工具调用的数据流

~~~text
用户任务 → 模型提出工具名与参数 → 服务端校验身份/权限/参数
      → 执行工具 → 返回结果 → 模型继续或结束
~~~

工具应有清晰名称、输入模式、允许的作用范围和错误响应。读取与写入分开授权；写入、发送和删除等动作在执行前核对目标与影响。长任务需要超时、取消、幂等性或去重标识，防止重试造成重复操作。

下面是**Python 风格的厂商无关伪代码，不能直接运行**：

~~~python
request = model.propose_tool(user_task, available_tools)
if request.name not in allowed_tools_for(user):
    return deny("tool not allowed")
args = validate_schema(request.arguments)
if request.has_side_effect:
    require_human_confirmation(user, request.name, args)
result = execute_tool(request.name, args, as_user=user)
return model.continue_with(result)
~~~

权限校验可以先写成独立、可测试的程序。下面的完整例子只判断是否允许调用，不执行任何工具：

~~~python
from dataclasses import dataclass


@dataclass(frozen=True)
class ToolRequest:
    name: str
    resource: str
    source: str  # "user" 或 "retrieved_page"


def decide(request: ToolRequest, permissions: dict[str, set[str]]) -> str:
    if request.source != "user":
        return "拒绝：外部内容不能提出工具调用"
    if request.resource not in permissions.get(request.name, set()):
        return "拒绝：工具或资源未获授权"
    if request.name in {"delete_note", "send_message"}:
        return "待确认：核对目标与副作用"
    return "允许"


permissions = {"read_note": {"note-1"}, "delete_note": {"note-1"}}
assert decide(ToolRequest("read_note", "note-1", "user"), permissions) == "允许"
assert decide(ToolRequest("delete_note", "note-1", "user"), permissions).startswith("待确认")
assert decide(ToolRequest("delete_note", "note-1", "retrieved_page"), permissions).startswith("拒绝")
assert decide(ToolRequest("read_note", "note-2", "user"), permissions).startswith("拒绝")
~~~

这个例子只演示策略边界。实际服务还需要可信的用户身份、服务端持久化的授权记录、参数验证和审计日志；不能相信调用者自己提交的 `source` 字段。

MCP 等协议可以统一工具和数据的接入方式，但协议连接成功不代表访问控制已经完成。服务端仍应验证每次调用的用户身份和权限。

## 低信任内容不能发号施令

网页、检索片段、仓库文件和工具返回值是任务数据。它们可能包含“忽略之前指令”或“调用写入工具”之类的文本，这属于提示注入。把外部文本隔离为引用内容，权限判断放在模型之外，敏感工具按最小权限开放。

<ToolSafetyLab />

真实防护还需服务端鉴权、密钥隔离、输出校验、操作日志，以及对异常调用的监控。实验台只展示一条简化决策规则。

参考：[Anthropic 构建有效 Agent](https://www.anthropic.com/engineering/building-effective-agents)、[MCP 官方文档](https://modelcontextprotocol.io/)、[OWASP LLM 应用风险](https://genai.owasp.org/llm-top-10/)。
