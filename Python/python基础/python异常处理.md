# Python Try Except

**`try` 块允许您测试代码块以查找错误。**

**`except` 块允许您处理错误。**

**`finally` 块允许您执行代码，无论 try 和 except 块的结果如何。**

## 异常处理

当我们调用 Python 并发生错误或异常时，通常会停止并生成错误消息。

可以使用 `try` 语句处理这些异常：

try 块将生成异常，因为 x 未定义：

```python
try:
  print(x)
except:
  print("An exception occurred")
```

由于 try 块引发错误，因此会执行 except 块。

如果没有 try 块，程序将崩溃并引发错误。

### 多个异常

您可以根据需要定义任意数量的 exception 块，例如，假如您要为特殊类型的错误执行特殊代码块：

```python
mytuple = ("apple", "banana", "cherry")
myit = iter(mytuple)

while True:
    try:
        print(next(myit))
    except StopIteration:
        break
    except:
        print("Something else went wrong")

```

如果 try 块引发 `StopIteration`，则退出循环，如果是其他错误则打印另一条消息：

### Else

如果没有引发错误，那么您可以使用 `else` 关键字来定义要执行的代码块：

```python
try:
  print("Hello")
except:
  print("Something went wrong")
else:
  print("Nothing went wrong")
```

### Finally

如果指定了 `finally` 块，则无论 try 块是否引发错误，都会执行 finally 块。

```python
try:
  print(x)
except:
  print("Something went wrong")
finally:
  print("The 'try except' is finished")
```

这对于关闭对象并清理资源非常有用

### 引发异常

作为 Python 开发者，您可以选择在条件发生时抛出异常。

假如 x 小于 0，则引发异常并终止程序：

```python
x = -1

if x < 0:
  raise Exception("Sorry, no numbers below zero")
```

`raise` 关键字用于引发异常。
