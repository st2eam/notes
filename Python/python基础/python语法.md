## Python 缩进

缩进指的是代码行开头的空格。

在其他编程语言中，代码缩进仅出于可读性的考虑，而 Python 中的缩进非常重要。

Python 使用缩进来指示代码块。空格数取决于程序员，但至少需要一个。您必须在同一代码块中使用相同数量的空格，否则 Python 会出错。

## Python 变量

在 Python 中，Python 没有声明变量的命令，变量是在为其赋值时创建的：

Python 中的变量：

```python
x = 6
y = "Hello, World!"
```

## Python 注释

Python 拥有对文档内代码进行注释的功能。

注释以 ＃ 开头，Python 将其余部分作为注释呈现：

```python
#This is a comment.
print("Hello, World!")
```

## 多行注释

Python 实际上没有多行注释的语法。

要添加多行注释，您可以为每行插入一个 `＃`：

```python
#This is a comment
#written in
#more than just one line
print("Hello, World!")
```

或者，以不完全符合预期的方式，您可以使用多行字符串。

由于 Python 将忽略未分配给变量的字符串文字，因此您可以在代码中添加多行字符串（三引号），并在其中添加注释：

```python
"""
This is a comment
written in 
more than just one line
"""
print("Hello, World!")
```

只要字符串未分配给变量，Python 就会读取代码，然后忽略它，这样您就已经完成了多行注释。