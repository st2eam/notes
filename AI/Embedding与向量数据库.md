# Embedding 与向量数据库

## 什么是 Embedding

Embedding 是将离散数据（文本、图片等）映射到连续向量空间的过程。语义相近的内容在向量空间中距离更近。

```
"猫" → [0.12, -0.34, 0.56, ...]
"狗" → [0.15, -0.31, 0.52, ...]   // 与"猫"距离近
"汽车" → [-0.67, 0.89, -0.12, ...]  // 与"猫"距离远
```

## 常用 Embedding 模型

| 模型 | 维度 | 特点 |
|------|------|------|
| OpenAI text-embedding-3-small | 1536 | 性价比高 |
| OpenAI text-embedding-3-large | 3072 | 精度更高 |
| BGE-M3 | 1024 | 开源，多语言支持好 |
| Cohere embed-v3 | 1024 | 多语言，支持多种搜索类型 |

## 相似度计算

### 余弦相似度

$$
\cos(\theta) = \frac{A \cdot B}{\|A\| \|B\|}
$$

值域 `[-1, 1]`，越接近 1 表示越相似。

### 欧几里得距离

$$
d(A, B) = \sqrt{\sum_{i=1}^{n}(a_i - b_i)^2}
$$

值越小表示越相似。

## 向量数据库

专门存储和检索高维向量的数据库：

| 数据库 | 类型 | 特点 |
|--------|------|------|
| Pinecone | 云服务 | 全托管，开箱即用 |
| Milvus | 开源 | 高性能，支持大规模数据 |
| Chroma | 开源 | 轻量，适合原型开发 |
| Qdrant | 开源 | Rust 实现，性能优秀 |
| pgvector | 扩展 | PostgreSQL 扩展，无需额外服务 |

## 基本使用流程

```python
from openai import OpenAI
import chromadb

client = OpenAI()
chroma = chromadb.Client()
collection = chroma.create_collection("notes")

def embed(text: str) -> list[float]:
    resp = client.embeddings.create(input=text, model="text-embedding-3-small")
    return resp.data[0].embedding

collection.add(
    documents=["React 是一个 UI 库", "Vue 是渐进式框架"],
    ids=["doc1", "doc2"],
    embeddings=[embed("React 是一个 UI 库"), embed("Vue 是渐进式框架")],
)

results = collection.query(query_embeddings=[embed("前端框架")], n_results=2)
```
