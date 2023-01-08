## Python 集合（数组）

Python 编程语言中有四种集合数据类型：

- **列表（List）**是一种有序和可更改的集合。允许重复的成员。
- **元组（Tuple）**是一种有序且不可更改的集合。允许重复的成员。
- **集合（Set）**是一个无序和无索引的集合。没有重复的成员。
- **词典（Dictionary）**是一个无序，可变和有索引的集合。没有重复的成员。

## 列表（List）

列表是一个有序且可更改的集合。在 Python 中，列表用方括号编写。

创建列表：

```python
thislist = ["apple", "banana", "cherry"]
```

### list() 构造函数

也可以使用 `list()` 构造函数创建一个新列表。

```python
thislist = list(("apple", "banana", "cherry")) # 请注意双括号
```
### 访问项目

您可以通过引用索引号来访问列表项：

```python
thislist = ["apple", "banana", "cherry"]
print(thislist[1])# 打印列表的第二项
print(thislist[-1])# 打印列表的最后一项
```

### 索引范围

您可以通过指定范围的起点和终点来指定索引范围。

指定范围后，返回值将是包含指定项目的新列表。

```python
thislist = ["apple", "banana", "cherry", "orange", "kiwi", "melon", "mango"]
print(thislist[2:5])# 返回第三、第四、第五项
print(thislist[-4:-1])# 返回从索引 -4（包括）到索引 -1（排除）的项目
```

### 检查项目是否存在

如需确定列表中是否存在指定的项，请使用 `in` 关键字：

```python
if "apple" in thislist:
  print("Yes, 'apple' is in the fruits list")
```

### 列表长度

如需确定列表中有多少项，请使用 `len()` 方法

打印列表中的项目数：

```python
print(len(thislist))
```

### 添加项目

如需将项目添加到列表的末尾，请使用 `append()` 方法

```python
thislist.append("orange")
```

要在指定的索引处添加项目，请使用 `insert()` 方法

```python
thislist.insert(1, "orange")
```

### 删除项目

`remove()` 方法删除指定的项目

```python
thislist.remove("banana")
```

`pop()` 方法删除指定的索引（如果未指定索引，则删除最后一项）

```python
thislist.pop()
```

`del` 关键字删除指定的索引

```python
del thislist[0]
```

`del` 关键字也能完整地删除列表

```python
thislist = ["apple", "banana", "cherry"]
del thislist
```

`clear()` 方法清空列表

```python
thislist.clear()
```

### 复制列表

使用`=`来复制列表，但是`list2` 将只是对 `list1` 的引用，`list1` 中所做的更改也将自动在 `list2` 中进行。

```python
list2 = list1
```

使用 `copy()` 方法来复制列表

```python
mylist = thislist.copy()
```

制作副本的另一种方法是使用内建的方法 `list()`

```python
mylist = list(thislist)
```

### 合并两个列表

最简单的方法之一是使用 + 运算符。

```python
list1 = ["a", "b" , "c"]
list2 = [1, 2, 3]

list3 = list1 + list2
```

使用 extend() 方法将 list2 添加到 list1 的末尾

```python
list1.extend(list2)
```

### 其他列表方法

Python 有一组可以在列表上使用的内建方法。

| 方法                                                         | 描述                                                 |
| :----------------------------------------------------------- | :--------------------------------------------------- |
| [append()](https://www.w3school.com.cn/python/ref_list_append.asp) | 在列表的末尾添加一个元素                             |
| [clear()](https://www.w3school.com.cn/python/ref_list_clear.asp) | 删除列表中的所有元素                                 |
| [copy()](https://www.w3school.com.cn/python/ref_list_copy.asp) | 返回列表的副本                                       |
| [count()](https://www.w3school.com.cn/python/ref_list_count.asp) | 返回具有指定值的元素数量。                           |
| [extend()](https://www.w3school.com.cn/python/ref_list_extend.asp) | 将列表元素（或任何可迭代的元素）添加到当前列表的末尾 |
| [index()](https://www.w3school.com.cn/python/ref_list_index.asp) | 返回具有指定值的第一个元素的索引                     |
| [insert()](https://www.w3school.com.cn/python/ref_list_insert.asp) | 在指定位置添加元素                                   |
| [pop()](https://www.w3school.com.cn/python/ref_list_pop.asp) | 删除指定位置的元素                                   |
| [remove()](https://www.w3school.com.cn/python/ref_list_remove.asp) | 删除具有指定值的项目                                 |
| [reverse()](https://www.w3school.com.cn/python/ref_list_reverse.asp) | 颠倒列表的顺序                                       |
| [sort()](https://www.w3school.com.cn/python/ref_list_sort.asp) | 对列表进行排序                                       |

## 元组（Tuple）

元组是有序且不可更改的集合。在 Python 中，元组是用圆括号编写的。

创建元组：

```python
thistuple = ("apple", "banana", "cherry")
```

### tuple() 构造函数

也可以使用 `tuple()` 构造函数来创建元组。

```python
thistuple = tuple(("apple", "banana", "cherry")) # 请注意双括号
```

### 访问元组项目

您可以通过引用方括号内的索引号来访问元组项目：

```python
print(thistuple[1])# 打印元组中的第二个项目
print(thistuple[-1])# 打印元组的最后一个项目
```

### 索引范围

与列表相似，可以使用相同的方法来获取指定范围的起点和终点来指定索引范围内的内容

```python
thistuple = ("apple", "banana", "cherry", "orange", "kiwi", "melon", "mango")
print(thistuple[2:5])# ('cherry', 'orange', 'kiwi')
print(thistuple[-4:-1])# ('orange', 'kiwi', 'melon')
```

### 更改元组值

创建元组后，您将无法更改其值。元组是不可变的，或者也称为恒定的。

但是有一种解决方法。您可以将元组转换为列表，更改列表，然后将列表转换回元组。

```python
x = ("apple", "banana", "cherry")
y = list(x)
y[1] = "kiwi"
x = tuple(y)

print(x)
```

### 创建只有一个项目的元组

如需创建仅包含一个项目的元组，您必须在该项目后添加一个逗号，否则 Python 无法将变量识别为元组。

```python
thistuple = ("apple",)
print(type(thistuple))# <class 'tuple'>

#不是元组
thistuple = ("apple")
print(type(thistuple))# <class 'str'>
```

### 删除元组

**注释：**您无法删除元组中的项目。

元组是不可更改的，因此您无法从中删除项目，但您可以完全删除元组

```python
del thistuple
```

### 合并两个元组

如需连接两个或多个元组，您可以使用 + 运算符：

```python
tuple1 = ("a", "b" , "c")
tuple2 = (1, 2, 3)

tuple3 = tuple1 + tuple2
print(tuple3)
```

### 元组方法

Python 提供两个可以在元组上使用的内建方法。

| 方法                                                         | 描述                                       |
| :----------------------------------------------------------- | :----------------------------------------- |
| [count()](https://www.w3school.com.cn/python/ref_tuple_count.asp) | 返回元组中指定值出现的次数。               |
| [index()](https://www.w3school.com.cn/python/ref_tuple_index.asp) | 在元组中搜索指定的值并返回它被找到的位置。 |

## 集合（Set）

集合是无序和无索引的集合。在 Python 中，集合用花括号编写。

创建集合：

```python
thisset = {"apple", "banana", "cherry"}
```

### set() 构造函数

也可以使用 `set()` 构造函数来创建集合。

```python
thisset = set(("apple", "banana", "cherry")) # 请留意这个双括号
```

**注释：**集合是无序的，因此您无法确定项目的显示顺序。

### 访问项目

您无法通过引用索引来访问 set 中的项目，因为 set 是无序的，项目没有索引。

但是您可以使用 `for` 循环遍历 set 项目，或者使用 `in` 关键字查询集合中是否存在指定值。

遍历集合，并打印值：

```python
thisset = {"apple", "banana", "cherry"}

for x in thisset:
  print(x)
```

### 更改项目

集合一旦创建，您就无法更改项目，但是您可以添加新项目。

### 添加项目

要将一个项添加到集合，请使用 `add()` 方法。

要向集合中添加多个项目，请使用 `update()` 方法。

```python
thisset.add("orange")
thisset.update(["orange", "mango", "grapes"])
```

### 删除项目

要删除集合中的项目，请使用 `remove()` 或 `discard()` 方法。

```python
thisset.remove("banana")
thisset.discard("banana")
```

**注释：**如果要删除的项目不存在，则 `remove()` 将引发错误。如果要删除的项目不存在，则 `discard()` 不会引发错误。

您还可以使用 `pop()` 方法删除项目，但此方法将删除最后一项。集合是无序的，因此在使用 `pop()` 方法时，您不会知道删除的是哪个项目。

`pop()` 方法的返回值是被删除的项目。

```python
x = thisset.pop()
print(x)
print(thisset)
```

`clear()` 方法清空集合：

```python
thisset.clear()
```

`del` 彻底删除集合：

```python
del thisset
```

### 合并两个集合

在 Python 中，有几种方法可以连接两个或多个集合。

您可以使用 union() 方法返回包含两个集合中所有项目的新集合，也可以使用 update() 方法将一个集合中的所有项目插入另一个集合中：

union() 方法返回一个新集合，其中包含两个集合中的所有项目：

```python
set1 = {"a", "b" , "c"}
set2 = {1, 2, 3}

set3 = set1.union(set2)
```

update() 方法将 set2 中的项目插入 set1 中：

```python
set1.update(set2)
```

**注释：**union() 和 update() 都将排除任何重复项。

### Set 方法

Python 拥有一套能够在集合（set）上使用的内建方法。

| 方法                                                         | 描述                                         |
| :----------------------------------------------------------- | :------------------------------------------- |
| [add()](https://www.w3school.com.cn/python/ref_set_add.asp)  | 向集合添加元素。                             |
| [clear()](https://www.w3school.com.cn/python/ref_set_clear.asp) | 删除集合中的所有元素。                       |
| [copy()](https://www.w3school.com.cn/python/ref_set_copy.asp) | 返回集合的副本。                             |
| [difference()](https://www.w3school.com.cn/python/ref_set_difference.asp) | 返回包含两个或更多集合之间差异的集合。       |
| [difference_update()](https://www.w3school.com.cn/python/ref_set_difference_update.asp) | 删除此集合中也包含在另一个指定集合中的项目。 |
| [discard()](https://www.w3school.com.cn/python/ref_set_discard.asp) | 删除指定项目。                               |
| [intersection()](https://www.w3school.com.cn/python/ref_set_intersection.asp) | 返回为两个其他集合的交集的集合。             |
| [intersection_update()](https://www.w3school.com.cn/python/ref_set_intersection_update.asp) | 删除此集合中不存在于其他指定集合中的项目。   |
| [isdisjoint()](https://www.w3school.com.cn/python/ref_set_isdisjoint.asp) | 返回两个集合是否有交集。                     |
| [issubset()](https://www.w3school.com.cn/python/ref_set_issubset.asp) | 返回另一个集合是否包含此集合。               |
| [issuperset()](https://www.w3school.com.cn/python/ref_set_issuperset.asp) | 返回此集合是否包含另一个集合。               |
| [pop()](https://www.w3school.com.cn/python/ref_set_pop.asp)  | 从集合中删除一个元素。                       |
| [remove()](https://www.w3school.com.cn/python/ref_set_remove.asp) | 删除指定元素。                               |
| [symmetric_difference()](https://www.w3school.com.cn/python/ref_set_symmetric_difference.asp) | 返回具有两组集合的对称差集的集合。           |
| [symmetric_difference_update()](https://www.w3school.com.cn/python/ref_set_symmetric_difference_update.asp) | 插入此集合和另一个集合的对称差集。           |
| [union()](https://www.w3school.com.cn/python/ref_set_union.asp) | 返回包含集合并集的集合。                     |
| [update()](https://www.w3school.com.cn/python/ref_set_update.asp) | 用此集合和其他集合的并集来更新集合。         |

## 字典（Dictionary）

字典是一个无序、可变和有索引的集合。在 Python 中，字典用花括号编写，拥有键和值。

创建字典：

```python
thisdict =	{
  "brand": "Porsche",
  "model": "911",
  "year": 1963
}
```

### dict() 构造函数

也可以使用 `dict()` 构造函数创建新的字典：

```python
thisdict = dict(brand="Porsche", model="911", year=1963)
# 请注意，关键字不是字符串字面量
# 请注意，使用了等号而不是冒号来赋值
print(thisdict)
```

### 访问项目

您可以通过在方括号内引用其键名来访问字典的项目：

获取 "model" 键的值：

```python
x = thisdict["model"]
```

还有一个名为 `get()` 的方法会给你相同的结果：

```python
x = thisdict.get("model")
```

您还可以使用 `values()` 函数返回字典的值：

```python
thisdict.values()# dict_values(['Porsche', '911', 1963])
```

通过使用 items() 函数获取所有键和值：

```python
thisdict.items()# dict_items([('brand', 'Porsche'), ('model', '911'), ('year', 1963)])
```

### 更改值

您可以通过引用其键名来更改特定项的值：

```python
thisdict["year"] = 2022
```

您还可以使用 `values()` 函数返回字典的值

### 检查键是否存在

要确定字典中是否存在指定的键，请使用 `in` 关键字

```python
if "model" in thisdict:
  print("Yes, 'model' is one of the keys in the thisdict dictionary")
```

### 字典长度

要确定字典有多少项目（键值对），请使用 `len()` 方法。

### 添加项目

通过使用新的索引键并为其赋值，可以将项目添加到字典中：

```python
thisdict["color"] = "red"
```

### 删除项目

有几种方法可以从字典中删除项目

`pop() `方法删除具有指定键名的项：

```python
thisdict.pop("model")
```

`popitem()` 方法删除最后插入的项目（在 3.7 之前的版本中，删除随机项目）

```python
thisdict.popitem()
```

`del` 关键字删除具有指定键名的项目:

```python
del thisdict["model"]
```

`del` 关键字也可以完全删除字典：

```python
del thisdict
```

`clear()` 关键字清空字典:

```python
thisdict.clear()
```

### 复制字典

使用`=`来复制字典，但是`dict2` 只是对 `dict1` 的引用，而 `dict1` 中的更改也将自动在 `dict2` 中进行。

```python
mydict = thisdict
```

使用 `copy()` 方法来复制字典

```python
mydict = thisdict.copy()
```

制作副本的另一种方法是使用内建方法 `dict()`。

```python
mydict = dict(thisdict)
```

### 嵌套字典

字典也可以包含许多字典，这被称为嵌套字典。

创建三个字典，然后创建一个包含其他三个字典的字典：

```python
child1 = {
  "name" : "Phoebe Adele",
  "year" : 2002
}
child2 = {
  "name" : "Jennifer Katharine",
  "year" : 1996
}
child3 = {
  "name" : "Rory John",
  "year" : 1999
}

myfamily = {
  "child1" : child1,
  "child2" : child2,
  "child3" : child3
}
```

### 字典方法

Python 提供一组可以在字典上使用的内建方法。

| 方法                                                         | 描述                                                   |
| :----------------------------------------------------------- | :----------------------------------------------------- |
| [clear()](https://www.w3school.com.cn/python/ref_dictionary_clear.asp) | 删除字典中的所有元素                                   |
| [copy()](https://www.w3school.com.cn/python/ref_dictionary_copy.asp) | 返回字典的副本                                         |
| [fromkeys()](https://www.w3school.com.cn/python/ref_dictionary_fromkeys.asp) | 返回拥有指定键和值的字典                               |
| [get()](https://www.w3school.com.cn/python/ref_dictionary_get.asp) | 返回指定键的值                                         |
| [items()](https://www.w3school.com.cn/python/ref_dictionary_items.asp) | 返回包含每个键值对的元组的列表                         |
| [keys()](https://www.w3school.com.cn/python/ref_dictionary_keys.asp) | 返回包含字典键的列表                                   |
| [pop()](https://www.w3school.com.cn/python/ref_dictionary_pop.asp) | 删除拥有指定键的元素                                   |
| [popitem()](https://www.w3school.com.cn/python/ref_dictionary_popitem.asp) | 删除最后插入的键值对                                   |
| [setdefault()](https://www.w3school.com.cn/python/ref_dictionary_setdefault.asp) | 返回指定键的值。如果该键不存在，则插入具有指定值的键。 |
| [update()](https://www.w3school.com.cn/python/ref_dictionary_update.asp) | 使用指定的键值对字典进行更新                           |
| [values()](https://www.w3school.com.cn/python/ref_dictionary_values.asp) | 返回字典中所有值的列表                                 |
