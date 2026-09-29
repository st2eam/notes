# AI 应用开发：从模型调用到可靠流程

> 前置：[大语言模型基础](./大语言模型基础.md)、[HTTP、认证与授权](../Web/JavaScript/Network/认证与授权.md)。目标：设计一次完整请求的数据流，并说明结构化输出、流式响应、工具与错误处理。最后核对：2026-09-29。

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

继续读[RAG 与检索质量](./RAG与检索质量.md)、[应用评测](./应用评测.md)、[Agent 工具与安全](./Agent工具与安全.md)。参考：[Anthropic 构建有效 Agent](https://www.anthropic.com/engineering/building-effective-agents)、[OpenAI Agents 指南](https://developers.openai.com/api/docs/guides/agents)。
