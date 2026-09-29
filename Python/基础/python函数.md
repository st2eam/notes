# Python 函数

## 创建函数以及调用

在 Python 中，使用 `def` 关键字定义函数：

```python
def my_function():
  print("Hello from a function")

my_function()
```
## 返回值

如需使函数返回值，请使用 `return` 语句：

```python
def my_function(country="China"):
    return ("I am from " + country)

print(my_function())
```
## 参数

信息可以作为参数传递给函数。

参数在函数名后的括号内指定。您可以根据需要添加任意数量的参数，只需用逗号分隔即可。当调用此函数时，我们传递一个名字，在函数内部使用它来打印全名：

```python
def my_function(country = "China"):
  print("I am from " + country)

my_function("Sweden")
my_function("India")
my_function()
```

如果我们调用了不带参数的函数，则使用默认值。


### 关键字参数

您还可以使用 key = value 语法发送参数，在 Python 文档中，“关键字参数”一词通常简称为 kwargs。参数的顺序无关紧要。

```python
def my_function(child3, child2, child1):
  print("The youngest child is " + child3)

my_function(child1 = "Phoebe", child2 = "Jennifer", child3 = "Rory")
```

### 任意参数

如果参数数目未知，请在参数名称前添加 *

这样，函数将接收一个参数元组，并可以相应地访问各项：

```python
def my_function(*countries):
    str1 = "The total number of countries is " + \
        str(len(countries)) + ", namely "
    for country in countries:
        str1 += country
        if countries.index(country) < len(countries)-2:
            str1 += ","
        elif countries.index(country) < len(countries)-1:
            str1 += " and "
        else:
            str1 += "."
    print(str1)

my_function()
my_function("China")
my_function("China", "Sweden")
my_function("China", "Sweden",  "Japan", "America")

# The total number of countries is 0.
# The total number of countries is 1, namely China.
# The total number of countries is 2, namely China and Sweden.
# The total number of countries is 4, namely China,Sweden,Japan and America.
```

## pass 语句

函数定义不能为空，但是如果您出于某种原因写了无内容的函数定义，请使用 pass 语句来避免错误。

```python
def myfunction():
    pass

# 报错
def myfunction():
    # do nothing
```

## 递归

```python
def Fibonacci(n):
    if (n == 0):
        return 0
    if (n == 1):
        return 1
    else:
        return (Fibonacci(n-1)+Fibonacci(n-2))
```

## Lambda

lambda 函数是一种小的匿名函数。

lambda 函数可接受任意数量的参数，但只能有一个表达式。

### 语法

```python
lambda arguments : expression
```

两个 lambda 函数：

```python
x = lambda a : a + 10 # 相当于 def x(a): return a + 10
print(x(2))

x = lambda a ,n : pow(a,n)   # def x(a, n): return pow(a, n)
print(x(2, 10))
```

### 应用场景

当您把 lambda 用作另一个函数内的匿名函数时，会更好地展现 lambda 的强大能力。

假设您有一个带一个参数的函数定义，并且该参数将乘以未知数字：

使用该函数定义来创建一个总是使所发送数字加倍的函数：

```python
def myfunc(n):
  return lambda a : a * n

mydoubler = myfunc(2)
mytripler = myfunc(3)

print(mydoubler(12)) # 24
print(mytripler(12)) # 36
```

