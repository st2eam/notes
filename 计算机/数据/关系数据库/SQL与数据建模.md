---
originalPath: Web/数据/SQL与数据建模.md
primaryCategory: 计算机/数据/关系数据库
categories:
  - path: 计算机/数据/关系数据库
    reason: >-
      核心学习对象为“SQL 与数据建模”，正文依据：“前置：能读 Python 代码。目标：设计两张关联表，解释
      JOIN、事务和索引的用途。最后核对：2026-09-29。 AI
      应用也要保存用户、文档、权限和评测结果。先把实体和关系定义清楚，再决定是否需要向量索引。关系数据库适合有明确约束、关联查询和事务要求的数据。”；据其实体与学习对象归入计算机/数据/关系数据库。
classificationStatus: confirmed
relations: []
tags: []
---
# SQL 与数据建模

> 前置：能读 Python 代码。目标：设计两张关联表，解释 JOIN、事务和索引的用途。最后核对：2026-09-29。

AI 应用也要保存用户、文档、权限和评测结果。先把实体和关系定义清楚，再决定是否需要向量索引。关系数据库适合有明确约束、关联查询和事务要求的数据。

## 从需求到表

以“用户提交笔记，系统记录检索结果”为例：用户表存身份，笔记表存作者与内容，评测表存问题与期望来源。每张表确定主键；跨表关系用外键表达。把作者姓名直接复制进每条笔记，会在改名时产生不一致。

| 概念 | 作用 | 常见错误 |
|------|------|----------|
| 主键 | 唯一标识一行 | 用会变动的显示名称做主键 |
| 外键 | 约束引用关系 | 删除作者后留下无主笔记 |
| 唯一约束 | 拒绝重复业务标识 | 只在前端检查重名 |
| 索引 | 加速特定查询 | 给每列都加索引，拖慢写入 |

## JOIN 会留下什么

INNER JOIN 只保留左右表匹配的行；LEFT JOIN 保留左表所有行，右表不匹配处显示 NULL。下面的第三笔订单故意引用不存在的用户，只用于展示脏数据如何影响查询。生产表应按业务规则启用外键约束。

<SqlJoinLab />

下面是**可运行的 Python 3 标准库示例**；保存为 join_demo.py 后运行 python3 join_demo.py：

~~~python
import sqlite3

db = sqlite3.connect(":memory:")
db.executescript("""
CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE orders (id INTEGER PRIMARY KEY, user_id INTEGER, amount INTEGER);
INSERT INTO users VALUES (1, '林'), (2, '周'), (3, '陈');
INSERT INTO orders VALUES (101, 1, 80), (102, 1, 35), (103, 4, 50);
""")
rows = db.execute("""
SELECT users.name, orders.id, orders.amount
FROM users LEFT JOIN orders ON orders.user_id = users.id
ORDER BY users.id, orders.id
""").fetchall()
assert rows == [('林', 101, 80), ('林', 102, 35), ('周', None, None), ('陈', None, None)]
print(rows)
~~~

传入用户输入时，用参数绑定，例如 db.execute("SELECT * FROM users WHERE id = ?", (user_id,))。拼接 SQL 字符串会带来注入风险。

## 事务、索引与查询计划

一次“创建笔记并写入检索元数据”要么全部成功，要么全部回滚，这就是事务的原子性。提交前不要把部分成功当作完成。常按 user_id 查笔记时，可考虑在该列建索引；索引提高某些读取速度，但增加空间和写入成本。用 EXPLAIN 或 EXPLAIN QUERY PLAN 观察执行计划，再根据真实查询和数据量决定是否建索引。

延伸：[MongoDB 与文档数据](/%E8%AE%A1%E7%AE%97%E6%9C%BA%E4%B8%8E%E8%BD%AF%E4%BB%B6/%E6%95%B0%E6%8D%AE/MongoDB/MongoDB.md)、RAG 与检索质量。参考：[PostgreSQL 官方教程](https://www.postgresql.org/docs/current/tutorial.html)、[Python sqlite3 文档](https://docs.python.org/3/library/sqlite3.html)。
