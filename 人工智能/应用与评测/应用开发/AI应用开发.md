---
originalPath: AI/AI应用开发.md
primaryCategory: 人工智能/应用与评测/应用开发
categories:
  - path: 人工智能/应用与评测/应用开发
    reason: >-
      核心学习对象为“AI
      应用开发：从模型调用到可靠流程”，正文依据：“前置：大语言模型基础、HTTP、认证与授权。目标：设计一次完整请求的数据流，并说明结构化输出、流式响应、工具与错误处理。最后核对：2026-09-29。
      一项 AI
      功能包含的环节通常比“调用模型”多：验证身份、读取获准资料、组织任务、调用模型或工具、校验结果、记录质量。模型提供候选内容，应用负责边界与最终交付。”；据其实体与学习对象归入人工智能/应用与评测/应用开发。
  - path: 计算机与软件/后端/接口与流程
    reason: 正文给出从身份校验、检索、模型工具循环到校验返回的请求数据流，属于后端接口与流程设计。
classificationStatus: confirmed
relations: []
tags: []
---
# AI 应用开发：从模型调用到可靠流程

> 前置：[大语言模型基础](/%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD/%E6%A8%A1%E5%9E%8B%E5%8E%9F%E7%90%86/%E5%A4%A7%E8%AF%AD%E8%A8%80%E6%A8%A1%E5%9E%8B/%E5%A4%A7%E8%AF%AD%E8%A8%80%E6%A8%A1%E5%9E%8B%E5%9F%BA%E7%A1%80.md)、[HTTP、认证与授权](/%E8%AE%A1%E7%AE%97%E6%9C%BA%E4%B8%8E%E8%BD%AF%E4%BB%B6/%E5%9F%BA%E7%A1%80/%E7%BD%91%E7%BB%9C/%E8%AE%A4%E8%AF%81%E4%B8%8E%E6%8E%88%E6%9D%83.md)。目标：设计一次完整请求的数据流，并说明结构化输出、流式响应、工具与错误处理。最后核对：2026-09-29。

一项 AI 功能包含的环节通常比“调用模型”多：验证身份、读取获准资料、组织任务、调用模型或工具、校验结果、记录质量。模型提供候选内容，应用负责边界与最终交付。

## 一条请求的数据流

~~~text
用户请求 → 身份与输入校验 → 检索有权限的资料 → 构造任务
        → 模型/工具循环 → 输出结构校验 → 引用核验 → 返回结果
                                      ↘ 记录耗时、费用、错误类型
~~~

先用简单流程验证任务能否成功。只有在固定任务集上看到收益，才增加多步 Agent 或额外框架。

## 结构化输出与流式响应

结构化输出将答案约束为字段，例如 answer、source_ids、uncertainty。模式检查只保证形状，业务还要检查引用编号确实来自本次检索。流式输出让用户较早看到内容，但结束前仍需处理最终校验、取消、断线、超时和不完整结果。

下面是**可运行 Python 3 示例**，演示应用侧的引用白名单校验：

~~~python
def validate_sources(candidate: dict, allowed_ids: set[str]) -> dict:
    if not isinstance(candidate.get("answer"), str):
        raise ValueError("答案字段缺失")
    sources = candidate.get("source_ids")
    if not isinstance(sources, list) or not all(isinstance(x, str) for x in sources):
        raise ValueError("来源字段无效")
    if not set(sources).issubset(allowed_ids):
        raise PermissionError("引用了未提供的来源")
    return candidate

assert validate_sources(
    {"answer": "见笔记", "source_ids": ["doc-1"]}, {"doc-1"}
)["answer"] == "见笔记"
~~~

模型请求部分使用**厂商无关伪代码，不能直接运行**：

~~~python
evidence = retrieve(question, allowed_for=user)
draft = model.generate(
    input=question,
    evidence=evidence,
    output_schema={"answer": "string", "source_ids": "list[string]"},
)
result = validate_sources(draft, {item.id for item in evidence})
return result
~~~

## 工具、检索与失败处理

工具调用由模型提出、应用执行。执行前验证工具名、参数、用户权限和副作用；将结果作为数据返回给模型。RAG 要分别检查召回和最终回答，引用必须指向真实片段。常见失败包括空检索、格式不合法、超时、限流、重复调用和权限拒绝；为每种失败提供可理解的反馈，写入操作考虑幂等与人工确认。

## 质量与成本

用固定任务集比较方案，记录正确性、引用支持度、时延、错误率和费用。流式输出改善感知等待，但不等于总耗时降低。更小的模型、更短的证据和缓存可能降低成本，但需要确认质量没有下降。模型与接口版本经常变化，选型以当前官方文档和本应用评测为准。

继续读[RAG 与检索质量](/%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD/%E5%BA%94%E7%94%A8%E4%B8%8E%E8%AF%84%E6%B5%8B/%E7%9F%A5%E8%AF%86%E6%A3%80%E7%B4%A2/RAG%E4%B8%8E%E6%A3%80%E7%B4%A2%E8%B4%A8%E9%87%8F.md)、[应用评测](/%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD/%E5%BA%94%E7%94%A8%E4%B8%8E%E8%AF%84%E6%B5%8B/%E8%B4%A8%E9%87%8F%E8%AF%84%E6%B5%8B/%E5%BA%94%E7%94%A8%E8%AF%84%E6%B5%8B.md)、[Agent 工具与安全](/%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD/%E5%BA%94%E7%94%A8%E4%B8%8E%E8%AF%84%E6%B5%8B/%E6%99%BA%E8%83%BD%E4%BD%93/Agent%E5%B7%A5%E5%85%B7%E4%B8%8E%E5%AE%89%E5%85%A8.md)。参考：[Anthropic 构建有效 Agent](https://www.anthropic.com/engineering/building-effective-agents)、[OpenAI Agents 指南](https://developers.openai.com/api/docs/guides/agents)。
