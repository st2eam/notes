# Python 类和对象

Python 是一种面向对象的编程语言。

Python 中的几乎所有东西都是对象，拥有属性和方法。

类（Class）类似对象构造函数，或者是用于创建对象的“蓝图”。

## __init__() 函数

所有类都有一个名为 __init__() 的函数，每次使用类创建新对象时，都会*自动调用* __init__() 函数。

使用 __init__() 函数将值赋给对象属性，或者在创建对象时需要执行的其他操作：

```python
class Person:
  def __init__(self, name, age):
    self.name = name
    self.age = age

p1 = Person("Bill", 63)
```

## 对象方法

对象也可以包含方法。对象中的方法是属于该对象的函数。

```python
class Person:
  def __init__(self, name, age):
    self.name = name
    self.age = age

  def myfunc(self):
    print("Hello my name is " + self.name)

p1 = Person("Bill", 63)
p1.myfunc()
```

## self 参数

`self` 参数是对类的当前实例的引用，用于访问属于该类的变量。

它不必被命名为 `self`，您可以随意调用它，但它必须是**类中任意函数**的*首个参数*：

```python
class Person:
  def __init__(mysillyobject, name, age):
    mysillyobject.name = name
    mysillyobject.age = age

  def myfunc(abc):
    print("Hello my name is " + abc.name)

p1 = Person("Bill", 63)
p1.myfunc()
```

# Python 继承

继承允许我们定义继承另一个类的所有方法和属性的类。

*父类*是继承的类，也称为基类。

*子类*是从另一个类继承的类，也称为派生类。

## 创建子类

要创建从其他类继承功能的类，请在创建子类时将父类作为参数发送：

创建一个名为 Student 的类，它将从 Person 类继承属性和方法：

```python
class Student(Person):
  pass

s1 = Student("Musk", "56") 
s1.myfunc()
```

**注释：**如果您不想向该类添加任何其他属性或方法，请使用 `pass` 关键字。

## 添加 __init__() 函数

当您添加 __init__() 函数时，子类将不再继承父的 __init__() 函数。

**注释：**子的 __init__() 函数会覆盖对父的 __init__() 函数的继承。

如需保持父的 __init__() 函数的继承，请添加对父的 __init__() 函数的调用。

```python
class Student(Person):
  def __init__(self, fname, lname):
    Person.__init__(self, fname, lname)
```

Python 还有一个 `super()` 函数，它会使子类从其父继承所有方法和属性：

```python
class Student(Person):
  def __init__(self, fname, lname):
    super().__init__(fname, lname)
```

通过使用 `super()` 函数，您不必使用父元素的名称，它将自动从其父元素继承方法和属性。