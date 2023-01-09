## Python 中的 JSON

Python 有一个名为 `json` 的内置包，可用于处理 JSON 数据。

JSON 是用于存储和交换数据的语法。

JSON 是用 JavaScript 对象表示法（JavaScript object notation）编写的文本。

```python
import json
```

### 解析 JSON - 把 JSON 转换为 Python

若有 JSON 字符串，则可以使用 `json.loads()` 方法对其进行解析。

结果将是 Python 字典。

```python
import json

# 一些 JSON:
x = '{ "name":"Bill", "age":63, "city":"Seatle"}'

# 解析 x:
y = json.loads(x)

# 结果是 Python 字典：
print(type(y), y)
# <class 'dict'> {'name': 'Bill', 'age': 63, 'city': 'Seatle'}
```

### 把 Python 转换为 JSON

若有 Python 对象，则可以使用 `json.dumps()` 方法将其转换为 JSON 字符串。

把 Python 转换为 JSON：

```python
import json

# Python 对象（字典）：
x = {
    "name": "Bill",
    "age": 63,
    "city": "Seatle"
}

# 转换为 JSON：
y = json.dumps(x)

# 结果是 JSON 字符串：
print(type(y),y)
# <class 'str'> {"name": "Bill", "age": 63, "city": "Seatle"}
```

将 Python 对象转换为 JSON 字符串，并打印值：

```python
import json

print(json.dumps({"name": "Bill", "age": 63}))
print(json.dumps(["apple", "bananas"]))
print(json.dumps(("apple", "bananas")))
print(json.dumps("hello"))
print(json.dumps(24))
print(json.dumps(3.14))
print(json.dumps(True))
print(json.dumps(False))
print(json.dumps(None))

# {"name": "Bill", "age": 63}
# ["apple", "bananas"]
# ["apple", "bananas"]
# "hello"
# 42
# 31.76
# true
# false
# null
```

当 Python 转换为 JSON 时，Python 对象会被转换为 JSON（JavaScript）等效项：

| Python | JSON   |
| ------ | ------ |
| dict   | Object |
| list   | Array  |
| tuple  | Array  |
| str    | String |
| int    | Number |
| float  | Number |
| True   | true   |
| False  | false  |
| None   | null   |

### 格式化结果

上面的实例打印一个 JSON 字符串，但它不是很容易阅读，没有缩进和换行。

`json.dumps()` 方法提供了令结果更易读的参数：

使用 `indent` 参数定义缩进数：

```python
json.dumps(x, indent=2)
```

您还可以定义分隔符，默认值为`(", ", ": ")`，这意味着使用逗号和空格分隔每个对象，使用冒号和空格将键与值分开：

使用 `separators` 参数来更改默认分隔符：

```python
json.dumps(x, indent=2, separators=(" ", "= "))
```

## 对结果排序

`json.dumps()` 方法提供了对结果中的键进行排序的参数：

使用 `sort_keys` 参数来指定是否应对结果进行排序：

```python
json.dumps(x, indent=4, sort_keys=True)
```