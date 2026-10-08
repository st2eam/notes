---
originalPath: AI/RAG与检索质量.md
primaryCategory: 人工智能/应用与评测/知识检索
categories:
  - path: 人工智能/应用与评测/知识检索
    reason: >-
      核心学习对象为“RAG 与检索质量”，正文依据：“前置：Embedding 与向量数据库、SQL
      与数据建模。目标：解释检索链路，比较关键词和语义检索，设计可验证的引用。最后核对：2026-09-29。
      RAG（检索增强生成）把“找到证据”和“根据证据回答”接起来。若没有找到正确材料，生成阶段再流畅也无法弥补证据缺口。”；据其实体与学习对象归入人工智能/应用与评测/知识检索。
  - path: 计算机与软件/数据/信息检索
    reason: 正文完整描述文档切分、权限过滤、关键词／语义检索和重排，是信息检索链路的应用。
classificationStatus: confirmed
relations: []
tags: []
---
# RAG 与检索质量

> 前置：[Embedding 与向量数据库](/%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD/%E5%BA%94%E7%94%A8%E4%B8%8E%E8%AF%84%E6%B5%8B/%E7%9F%A5%E8%AF%86%E6%A3%80%E7%B4%A2/Embedding%E4%B8%8E%E5%90%91%E9%87%8F%E6%95%B0%E6%8D%AE%E5%BA%93.md)、[SQL 与数据建模](/%E8%AE%A1%E7%AE%97%E6%9C%BA%E4%B8%8E%E8%BD%AF%E4%BB%B6/%E6%95%B0%E6%8D%AE/%E5%85%B3%E7%B3%BB%E6%95%B0%E6%8D%AE%E5%BA%93/SQL%E4%B8%8E%E6%95%B0%E6%8D%AE%E5%BB%BA%E6%A8%A1.md)。目标：解释检索链路，比较关键词和语义检索，设计可验证的引用。最后核对：2026-09-29。

RAG（检索增强生成）把“找到证据”和“根据证据回答”接起来。若没有找到正确材料，生成阶段再流畅也无法弥补证据缺口。

## 先设计检索单位

一条被索引的记录至少保留：文档 ID、标题、来源路径、所属权限、正文片段、位置和版本。切分过小会丢掉上下文，过大则容易混入无关内容；根据问答任务和原文结构测试不同切分方式。数据更新或删除时，要同步更新索引，防止引用旧版本。

~~~text
文档 → 清洗与切分 → 权限元数据 → 建索引
问题 → 权限过滤 → 关键词/语义候选 → 重排 → 证据片段 → 回答与引用
~~~

关键词检索适合专有名词、路径和精确术语；向量检索有助于找措辞不同但语义接近的内容。混合检索可以合并两类候选，再用重排步骤决定送给模型的片段。不同方法的原始分数通常不在同一尺度，合并前要做校准或使用排序融合。

<RetrievalLab />

下面的**可运行 Python 3 示例**只演示有可比尺度时的加权排序，不是真正的 BM25 或 Embedding：

~~~python
docs = [
    {"title": "认证", "keyword": 0.98, "semantic": 0.70},
    {"title": "工具安全", "keyword": 0.20, "semantic": 0.88},
]
keyword_weight = 0.5
ranked = sorted(
    docs,
    key=lambda doc: keyword_weight * doc["keyword"]
    + (1 - keyword_weight) * doc["semantic"],
    reverse=True,
)
assert ranked[0]["title"] == "认证"
~~~

## 引用与评测

检索结果必须携带稳定的源 ID 或链接。答案里的每一条关键事实要能映射回具体片段；找不到证据时应说明资料不足。可用“期望来源是否进入前 K 条”评测检索召回，用人工或规则检查引用是否真的支持结论。生成质量和检索质量分开测，才能知道该改哪一步。

下一步：[应用评测](/%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD/%E5%BA%94%E7%94%A8%E4%B8%8E%E8%AF%84%E6%B5%8B/%E8%B4%A8%E9%87%8F%E8%AF%84%E6%B5%8B/%E5%BA%94%E7%94%A8%E8%AF%84%E6%B5%8B.md)。参考：[OpenAI Retrieval 指南](https://developers.openai.com/api/docs/guides/retrieval)、[Anthropic Contextual Retrieval](https://www.anthropic.com/engineering/contextual-retrieval)。不同产品的索引能力与参数会变化，评测指标应以自己的数据集为准。
