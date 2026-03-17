# AI 应用开发

## 技术栈概览

| 层级 | 工具/框架 | 用途 |
|------|----------|------|
| 模型 API | OpenAI、Anthropic、Google | 底层大模型能力 |
| 开发框架 | LangChain、LlamaIndex、Vercel AI SDK | 封装和编排 |
| 向量数据库 | Pinecone、Chroma、Qdrant、pgvector | 语义检索 |
| 部署 | Vercel、AWS Lambda、Docker | 服务托管 |
| 监控 | LangSmith、Helicone、Datadog | 可观测性 |

## LLM API 调用

### 基本调用（Python）

```python
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "你是一个有帮助的助手。"},
        {"role": "user", "content": "解释什么是 RESTful API"},
    ],
    temperature=0.7,
    max_tokens=1000,
)

print(response.choices[0].message.content)
```

### 流式输出

```python
stream = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "写一首诗"}],
    stream=True,
)

for chunk in stream:
    content = chunk.choices[0].delta.content
    if content:
        print(content, end="", flush=True)
```

### Structured Output（结构化输出）

```python
from pydantic import BaseModel

class MovieReview(BaseModel):
    title: str
    rating: float
    summary: str
    pros: list[str]
    cons: list[str]

response = client.beta.chat.completions.parse(
    model="gpt-4o",
    messages=[{"role": "user", "content": "评价电影《星际穿越》"}],
    response_format=MovieReview,
)

review = response.choices[0].message.parsed
```

## Function Calling（工具调用）

让 LLM 决定何时调用外部函数：

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "获取指定城市的天气",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {"type": "string", "description": "城市名称"},
                },
                "required": ["city"],
            },
        },
    }
]

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "北京今天天气怎么样？"}],
    tools=tools,
)
```

## RAG 实现流程

### 1. 文档处理

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    separators=["\n\n", "\n", "。", "，", " "],
)

chunks = splitter.split_text(document_text)
```

### 2. 向量化存储

```python
import chromadb
from openai import OpenAI

client = OpenAI()
chroma = chromadb.PersistentClient(path="./chroma_db")
collection = chroma.get_or_create_collection("docs")

for i, chunk in enumerate(chunks):
    embedding = client.embeddings.create(
        input=chunk, model="text-embedding-3-small"
    ).data[0].embedding

    collection.add(
        ids=[f"chunk_{i}"],
        documents=[chunk],
        embeddings=[embedding],
    )
```

### 3. 检索生成

```python
def ask(question: str) -> str:
    q_embedding = client.embeddings.create(
        input=question, model="text-embedding-3-small"
    ).data[0].embedding

    results = collection.query(query_embeddings=[q_embedding], n_results=3)
    context = "\n\n".join(results["documents"][0])

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": f"根据以下资料回答问题：\n\n{context}"},
            {"role": "user", "content": question},
        ],
    )
    return response.choices[0].message.content
```

## 常见问题与优化

### 幻觉（Hallucination）

模型生成不存在的信息。应对方式：

- 使用 RAG 提供事实依据
- 要求模型标注信息来源
- 设置 `temperature=0` 减少随机性
- 增加 "如果不确定请说不知道" 指令

### Token 优化

- 精简 system prompt，去掉冗余描述
- 对长文档做摘要后再输入
- 使用更小的模型处理简单任务
- 缓存常用查询的结果

### 延迟优化

- 使用流式输出提升感知速度
- 并行调用多个独立的 LLM 请求
- 选择适合任务复杂度的模型（简单任务用小模型）
- 部署在离用户近的区域
