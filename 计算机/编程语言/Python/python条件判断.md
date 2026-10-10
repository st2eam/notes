---
originalPath: Python/基础/python条件判断.md
primaryCategory: 计算机/编程语言/Python
categories:
  - path: 计算机/编程语言/Python
    reason: 核心学习对象为“python条件判断”，正文依据：“可用于判断的运算符 名称”；据其实体与学习对象归入计算机/编程语言/Python。
classificationStatus: confirmed
relations: []
tags:
  - 实体/Python
---
## Python 条件和 If 语句

| 可用于判断的运算符 | 名称       | 实例       |
| :----------------- | :--------- | :--------- |
| ==                 | 等于       | x == y     |
| !=                 | 不等于     | x != y     |
| >                  | 大于       | x > y      |
| <                  | 小于       | x < y      |
| >=                 | 大于或等于 | x >= y     |
| <=                 | 小于或等于 | x <= y     |
| in                 | in         | x in y     |
| not in             | not in     | x not in y |

|   逻辑运算符   | 解释 |
| ---- | ---- |
| and | 与 |
| or | 或 |
| not | 非 |

| 语句 |         |
| ---- | ------- |
| if   |         |
| elif | else if |
| else |         |

### 简写 If ... Else

如果只有两条语句要执行，一条用于 if，另一条用于 else，则可以将它们全部放在同一行

```python
print("A") if a > b else print("B")
```

### pass 语句

if 语句不能为空，但是如果您处于某种原因写了无内容的 if 语句，请使用 pass 语句来避免错误

```python
if b > a:
  pass
```
