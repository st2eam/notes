## while 循环

如果使用 `while` 循环，只要条件为真，我们就可以执行一组语句。

### else 语句

通过使用 else 语句，当条件不再成立时，我们可以运行一次代码块：

```python
i = 1
while i < 6:
  print(i)
  i += 1
else:
  print("i is no longer less than 6")
```

## for 循环

`for` 循环用于迭代序列（即列表，元组，字典，集合或字符串）。

这与其他编程语言中的 `for` 关键字不太相似，而是更像其他面向对象编程语言中的迭代器方法。

### for 循环中的 Else

for 循环中的 `else` 关键字指定循环结束时要执行的代码块

打印 0 到 9 的所有数字，并在循环结束时打印一条消息：

```python
for x in range(10):
  print(x)
else:
  print("Finally finished!")
```

### range() 函数

如需循环一组代码指定的次数，我们可以使用 `range()` 函数，`range()` 函数返回一个数字序列，默认情况下从 0 开始，并递增 1（默认地），并以指定的数字结束。

```python
for x in range(10):
  print(x)
```

## break 语句

如果使用 `break` 语句，即使 while 条件为真，我们也可以停止循环

## continue 语句

如果使用 `continue` 语句，我们可以停止当前的迭代，并继续下一个

**提示：**`for` 循环不需要预先设置索引变量，`while` 循环需要准备好相关的变量。

