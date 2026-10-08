---
originalPath: AI/Embedding与向量数据库.md
primaryCategory: 人工智能/应用与评测/知识检索
categories:
  - path: 人工智能/应用与评测/知识检索
    reason: >-
      核心学习对象为“Embedding
      与向量数据库”，正文依据：“前置：机器学习数学基础中的向量与相似度。目标：解释向量表示、余弦相似度、向量索引及元数据过滤。最后核对：2026-09-29。
      Embedding
      把文本等对象映射成数值向量，使应用能按向量距离寻找候选内容。相似度表示“在该模型的向量空间里接近”，不能证明内容真实、可访问或适合回答当前问题。”；据其实体与学习对象归入人工智能/应用与评测/知识检索。
  - path: 数学与统计/机器学习数学
    reason: 正文解释点积、向量长度及余弦相似度，同时介绍向量索引与元数据过滤，分别构成数学和数据检索的交叉内容。
  - path: 计算机与软件/数据/向量检索
    reason: 正文解释点积、向量长度及余弦相似度，同时介绍向量索引与元数据过滤，分别构成数学和数据检索的交叉内容。
classificationStatus: confirmed
relations:
  - target: 人工智能/自然语言处理/词向量/word2vec.md
    type: similar
    label: 主题对照
    reason: 共同讨论将语言映射为向量；前者面向检索索引，后者介绍 CBOW 与 Skip-gram 的词向量训练。
    evidence: >-
      源笔记：前置：机器学习数学基础中的向量与相似度。目标：解释向量表示、余弦相似度、向量索引及元数据过滤。最后核对：2026-09-29。
      Embedding
      把文本等对象映射成数值向量，使应用能按向量距离寻找候选内容。相似度表示“在该模型的向量空间里接近”，不能证明内容真实、可访问或适合回答当前问题。；目标笔记：Word2Vec是一种用于生成词向量的技术，它可以将单词映射到向量空间中的位置，使得相似的单词在向量空间中的距离也相似。Word2Vec模型由Google在2013年发布，它是一种基于神经网络的模型，可以通过大量的文本数据来训练。
      Word2Vec模型有两种不同的架构：连续词袋模型（CBOW）和Skip-gram模型。CBOW模型尝试根据上下文单词的平均值来预测当前单词，而Skip-gram模型则
    status: inferred
tags: []
---
# Embedding 与向量数据库

> 前置：[机器学习数学基础](/%E6%95%B0%E5%AD%A6%E4%B8%8E%E7%BB%9F%E8%AE%A1/%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0%E6%95%B0%E5%AD%A6/%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0%E6%95%B0%E5%AD%A6%E5%9F%BA%E7%A1%80.md)中的向量与相似度。目标：解释向量表示、余弦相似度、向量索引及元数据过滤。最后核对：2026-09-29。

Embedding 把文本等对象映射成数值向量，使应用能按向量距离寻找候选内容。相似度表示“在该模型的向量空间里接近”，不能证明内容真实、可访问或适合回答当前问题。

## 余弦相似度

余弦相似度把两个向量的点积除以各自长度的乘积，比较它们的方向；零向量没有可定义的方向，下面的教学函数约定返回 0。分数高只表示当前向量表示接近，仍要检查来源与权限。

~~~python
from math import sqrt

def cosine(a, b):
    if len(a) != len(b):
        raise ValueError("向量维度不一致")
    dot = sum(x * y for x, y in zip(a, b))
    size = sqrt(sum(x * x for x in a) * sum(y * y for y in b))
    return dot / size if size else 0.0

assert cosine([1, 0], [0, 1]) == 0.0
assert cosine([2, 0], [1, 0]) == 1.0
~~~

这是**可运行 Python 3 示例**。实际检索会对大量向量建索引，以减少逐条计算成本；索引算法通常在速度、内存和召回率之间取舍。

## 建索引时保存什么

每个片段除了向量，还应保存文档 ID、来源路径、版本、标题、位置和访问权限。入库、更新、删除要同步处理，避免返回过期资料。检索时必须先执行权限过滤，不能把所有候选传给模型后才让模型“忽略”私有内容。

常见向量存储形态包括数据库扩展、专用向量数据库和托管服务。选型看现有数据库、数据量、过滤能力、更新频率和运维成本；维度与价格属于特定模型的版本信息，使用时查看官方文档。

## 向量检索的边界

专有名词、代码符号和文件路径往往需要关键词检索；语义相近的长问法适合向量召回。两者可并行取候选、去重并重排。检索是否有效，要在真实问题集上看“期望来源进入前 K 条”的比例，而不能只看相似度分数。

下一步：[RAG 与检索质量](/%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD/%E5%BA%94%E7%94%A8%E4%B8%8E%E8%AF%84%E6%B5%8B/%E7%9F%A5%E8%AF%86%E6%A3%80%E7%B4%A2/RAG%E4%B8%8E%E6%A3%80%E7%B4%A2%E8%B4%A8%E9%87%8F.md)、[AI 应用开发](/%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD/%E5%BA%94%E7%94%A8%E4%B8%8E%E8%AF%84%E6%B5%8B/%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91/AI%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91.md)。参考：[OpenAI Retrieval 指南](https://developers.openai.com/api/docs/guides/retrieval)、[Anthropic Contextual Retrieval](https://www.anthropic.com/engineering/contextual-retrieval)。
