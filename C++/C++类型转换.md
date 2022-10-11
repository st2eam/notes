## 隐式类型转换

- 编译器自动完成
- 转换场景
  - 初始化
  - 变量赋值
  - 计算表达式
- 转换规则
  - 尽量类型向上升级
  - 尽量避免数据丢失

```
graph BT

A(bool) -->B(char)
B(char) -->C(short int)
C(short int) -->D(int)
D(int) -->E(unsigned int)
E(unsigned int) -->F(long)
F(long) -->G(unsigned)
G(unsigned) -->H(long long)
H(long long) -->I(float)
I(float) -->J(double)
J(double) --> K(long double) 
```

## 显式类型转换

#### C风格类型转换

```float f = (float)3 / 4;```

```float f = float(3) / 4;```（C++新写法）

- 语义较多，能力太强

- 容易误用，不推荐
  
## 更安全的类型转换
  
#### 静态类型转换

- 基本数据类型间转换

- 基类及子类间转换

- 编译时进行类型检查

```cpp
static_cast<目标类型>(源类型)
```

源类型和目标类型只要有一个方向可以隐式转换，那么两个方向都可以做静态类型转换，如果不能则报错

#### 动态类型转换

- 向下转换
  - 基类指针转换为子类指针
  - 主要用于多态场景
- 运行时类型检查
  - 基类指针不指向子类对象时转为空指针
  - 底层实现基于虚表指针，无虚函数类不能使用dynamic_cast
- static_cast
  - 也可以做向下转换
  - 不具备运行时类型检查
  - 存在风险
- 也可用于引用，和指针用法类似

```cpp
dynamic_cast<目标类型>(源类型)
```

将基类类型参数转换为派生类类型，源类型和目标类型必须同是引用或指针，且目标类型和源类型之间存在继承关系，否则报错

#### 去常类型转换

- const指针或引用转为非const
- 存在非法场景（未定义行为）
- 使用场景较少

```cpp
const_cast<目标类型>(源类型)
```

源类型和目标类型必须同是引用或指针，且目标类型和源类型之间只有常属性的区别，否则报错

```cpp
    int* p1 = NULL;
    const int* p2 = NULL;

    //const不是基本的数据类型
    p1 = const_cast<int*>(p2);
    p2 = const_cast<const int*>(p1);//用来加const和去const
```

#### 重解释类型转换

- 不同类型指针之间、指针与整型间强转
- 编译器不对指向对象的类型做任何检查
- 谨慎使用

```cpp
reinterpret_cast<目标类型>(源类型)
```

源类型和目标类型必须同是指针，或者一个指针一个整数，否则报错

```cpp
    int* p = NULL;
    char* p2 = NULL;
    p = reinterpret_cast<int*>(p2);
    p2 = reinterpret_cast<int*>(p);

    int c = 0;
    c = reinterpret_cast<int>(p2);
```

## 类型转换函数

- 类可以提供自定义的类型转换函数
- 类似操作符重载
- 可以用explicit修饰，避免隐式转换
- 一般使用const修饰

## Upcasting and Downcasting (向上/向下转型)

- upcasting : Assigning a pointer of a derived class type to a pointer of its base  class type (将派生类类型指针赋值给基类类型指针)

- downcasting : Assigning a pointer of a base class type to a pointer of its  derived class type. (将基类类型指针赋值给派生类类型指针)

上转可不适用dynamic_cast而隐式转换

```cpp
GeometricObject *g = new Circle(1); 
Circle *c = new Circle(2);
g = c; //Correct
```

下转必须显式执行

```cpp
c = dynamic_cast<Circle *>(g);
```
