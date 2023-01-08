## 内置数据类型

在编程中，数据类型是一个重要的概念。

变量可以存储不同类型的数据，并且不同类型可以执行不同的操作。

在这些类别中，Python 默认拥有以下内置数据类型：

| 文本类型：   | `str`                              |
| ------------ | ---------------------------------- |
| 数值类型：   | `int`, `float`, `complex`          |
| 序列类型：   | `list`, `tuple`, `range`           |
| 映射类型：   | `dict`                             |
| 集合类型：   | `set`, `frozenset`                 |
| 布尔类型：   | `bool`                             |
| 二进制类型： | `bytes`, `bytearray`, `memoryview` |

- 浮点数也可以是带有“e”的科学数字，表示 10 的幂。

```python
x = 27e4
y = 15E2
z = -49.8e100
```

- 复数用 "j" 作为虚部编写：

```python
x = 2+3j
y = 7j
z = -7j
```

- **布尔表示两值之一：True 或 False。**

## 获取数据类型

您可以使用 type() 函数获取任何对象的数据类型：

```python
x = 10
print(type(x))# <class 'int'>
```

## 设定特定的数据类型

如果希望指定数据类型，则您可以使用以下构造函数：

| 示例                                         | 数据类型   |
| :------------------------------------------- | :--------- |
| x = str("Hello World")                       | str        |
| x = int(29)                                  | int        |
| x = float(29.5)                              | float      |
| x = complex(1j)                              | complex    |
| x = list(("apple", "banana", "cherry"))      | list       |
| x = tuple(("apple", "banana", "cherry"))     | tuple      |
| x = range(6)                                 | range      |
| x = dict(name="Bill", age=36)                | dict       |
| x = set(("apple", "banana", "cherry"))       | set        |
| x = frozenset(("apple", "banana", "cherry")) | frozenset  |
| x = bool(5)                                  | bool       |
| x = bytes(5)                                 | bytes      |
| x = bytearray(5)                             | bytearray  |
| x = memoryview(bytes(5))                     | memoryview |

