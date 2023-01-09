# Python 正则表达式

**RegEx 或正则表达式是形成搜索模式的字符序列。**

**RegEx 可用于检查字符串是否包含指定的搜索模式。**

## RegEx 模块

Python 提供名为 `re` 的内置包，可用于处理正则表达式。

导入 `re` 模块：

```python
import re
```

## RegEx 函数

`re` 模块提供了一组函数，允许我们检索字符串以进行匹配：

| 函数    | 描述                                              |
| :------ | :------------------------------------------------ |
| findall | 返回包含所有匹配项的列表                          |
| search  | 如果字符串中的任意位置存在匹配，则返回 Match 对象 |
| split   | 返回在每次匹配时拆分字符串的列表                  |
| sub     | 用字符串替换一个或多个匹配项                      |

## findall() 函数

`findall()` 函数返回包含所有匹配项的列表。

```python
str = "China is a great country"
x = re.findall("a", str)
print(x)# ['a', 'a', 'a']
```

## search() 函数

`search()` 函数搜索字符串中的匹配项，如果存在匹配则返回 Match 对象。

```python
x = re.search("a", str)
print(x)# <re.Match object; span=(4, 5), match='a'>
```

## Match 对象

Match 对象是包含有关搜索和结果信息的对象。

**注释：**如果没有匹配，则返回值 `None`，而不是 Match 对象。

Match 对象提供了用于取回有关搜索及结果信息的属性和方法：

- `span()` 返回的元组包含了匹配的开始和结束位置
- `.string` 返回传入函数的字符串
- `group()` 返回匹配的字符串部分

## split() 函数

`split()` 函数返回一个列表，其中字符串在每次匹配时被拆分

```python
x = re.split("\s", str)
print(x)# ['China', 'is', 'a', 'great', 'country']
```

您可以通过指定 `maxsplit` 参数来控制出现次数：

```python
x = re.split("\s", str, 1)
print(x)# ['China', 'is a great country']
```

## sub() 函数

`sub()` 函数把匹配替换为您选择的文本：

```python
x = re.sub("\s", "_", str)
print(x)# China_is_a_great_country
```