## lambda表达式

lambda表达式有如下优点：

- 声明式编程风格：就地匿名定义目标函数或函数对象，不需要额外写一个命名函数或者函数对象。以更直接的方式去写程序，好的可读性和可维护性。
- 简洁：不需要额外再写一个函数或者函数对象，避免了代码膨胀和功能分散，让开发者更加集中精力在手边的问题，同时也获取了更高的生产率。
- 在需要的时间和地点实现功能闭包，使程序更灵活。

#### lambda 表达式的概念和基本用法

  lambda 表达式定义了一个匿名函数，并且可以捕获一定范围内的变量。
  lambda 表达式的语法形式可简单归纳如下：

```cpp
[ 捕获列表 ] ( 参数表 ) 函数选项 -> 返回值类型 { 函数体 };

//简单例子 
auto f = [](int a) -> int { return a + 1; };
std::cout << f(1) << std::endl;  // 输出: 2
```

省略 lambda 表达式的返回值定义：

```cpp
auto f = [](int a){ return a + 1; };
```

:point_up_2: 这样编译器就会根据 return 语句自动推导出返回值类型。
需要注意

```cpp
auto x1 = [](int i){ return i; };  // OK: return type is int
auto x2 = [](){ return { 1, 2 }; };  // error: 无法推导出返回值类型
```

另外，lambda 表达式在没有参数列表时，参数列表是可以省略的。因此像下面的写法都是正确的：

```cpp
auto f1 = [](){ return 1; };
auto f2 = []{ return 1; };  // 省略空参数表
```

#### 使用 lambda 表达式捕获列表

lambda 表达式还可以通过捕获列表捕获一定范围内的变量：

- [] 不捕获任何变量。
- [&] 捕获外部作用域中所有变量，并作为引用在函数体中使用（按引用捕获）。
- [=] 捕获外部作用域中所有变量，并作为副本在函数体中使用（按值捕获）。
- [=，&foo] 按值捕获外部作用域中所有变量，并按引用捕获 foo 变量。
- [bar] 按值捕获 bar 变量，同时不捕获其他变量。
- [this] 捕获当前类中的this指针，让lambda表达式拥有和当前类成员函数同样的访问权限。如果已经使用了 & 或者 =，就默认添加此选项。捕获 this 的目的是可以在 lamda 中使用当前类的成员函数和成员变量。

lambda表达式的基本用法

```cpp
class XX
{
public:
    int i = 0;
    void func(int x, int y)
    {
        auto x1 = [] { return i; };                    // error，没有捕获外部变量
        auto x2 = [=] { return i + x + y; };           // OK，捕获所有外部变量
        auto x3 = [&] { return i + x + y; };           // OK，捕获所有外部变量
        auto x4 = [this] { return i; };                // OK，捕获this指针
        auto x5 = [this] { return i + x + y; };        // error，没有捕获x、y
        auto x6 = [this, x, y] { return i + x + y; };  // OK，捕获this指针、x、y
        auto x7 = [this] { return i++; };              // OK，捕获this指针，并修改成员的值
    }
};

int a = 0, b = 1;
auto f1 = [] { return a; };               // error，没有捕获外部变量
auto f2 = [&] { return a++; };            // OK，捕获所有外部变量，并对a执行自加运算
auto f3 = [=] { return a; };              // OK，捕获所有外部变量，并返回a
auto f4 = [=] { return a++; };            // error，a是以复制方式捕获的，无法修改
auto f5 = [a] { return a + b; };          // error，没有捕获变量b
auto f6 = [a, &b] { return a + (b++); };  // OK，捕获a和b的引用，并对b做自加运算
auto f7 = [=, &b] { return a + (b++); };  // OK，捕获所有外部变量和b的引用，并对b做自加运算
```

#### lambda 表达式的类型

lambda 表达式的类型在 C++11 中被称为“闭包类型（Closure       Type）”。它是一个特殊的，匿名的非 nunion 的类类型。

因此，我们可以认为它是一个带有 operator() 的类，即仿函数。

因此，我们可以使用 std::function 和 std::bind 来存储和操作 lambda 表达式：

```cpp
std::function<int(int)>  f1 = [](int a){ return a; };
std::function<int(void)> f2 = std::bind([](int a){ return a; }, 123);
```

另外，对于没有捕获任何变量的lambda表达式，还可以被转换成一个普通的函数指针：

```cpp
using func_t = int(*)(int);
func_t f = [](int a){ return a; };
f(123);
```

lambda 表达式可以说是就地定义仿函数闭包的“语法糖”。它的捕获列表捕获住的任何外部变量，最终均会变为闭包类型的成员变量。

而一个使用了成员变量的类的operator()，如果能直接被转换为普通的函数指针，那么 lambda 表达式本身的 this 指针就丢失掉了。而没有捕获任何外部变量的 lambda 表达式则不存在这个问题。

这里也可以很自然地解释为何按值捕获无法修改捕获的外部变量。因为按照 C++ 标准，lambda 表达式的operator()默认是const的

一个const成员函数是无法修改成员变量的值的。而 mutable 的作用，就在于取消 operator() 的 const。

需要注意的是，没有捕获变量的 lambda 表达式可以直接转换为函数指针，而捕获变量的 lambda 表达式则不能转换为函数指针。看看下面的代码：

```cpp
typedef void(*Ptr)(int*);
Ptr p = [](int* p){delete p;};  // 正确，没有状态的lambda（没有捕获）的lambda表达式可以直接转换为函数指针
Ptr p1 = [&](int* p){delete p;};  // 错误，有状态的lambda不能直接转换为函数指针
```

上面第二行代码能编译通过，而第三行代码不能编译通过，因为第三行的代码捕获了变量，不能直接转换为函数指针。
