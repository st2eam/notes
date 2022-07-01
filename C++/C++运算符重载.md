## 覆盖(override)与重载(overload)

- **成员函数覆盖**是指派生类重新定义基类的虚函数

- **成员函数重载**是指函数名相同，参数不同（数量、类型、次序）

- **成员函数隐藏**（重定义）
1. 不在同一个作用域内（分别位于基类与继承类中）
2. 函数名字相同
3. 返回值可以不同
4. 参数不同。此时，无论有无```virtual```关键字，基类的函数将被隐藏
5. 参数相同，但是基类函数没有```virtual```关键字。此时，基类的函数被隐藏
   
   ## 运算符重载
   
   一般格式如下
   
   ```cpp
   <返回类型说明符> operator <运算符符号> (<参数表>)
   {
    <函数体>
   }
   ```
   
   不可重载：
   
   | Operator       |          |
   |:--------------:| -------- |
   | ```.```        | 类属关系运算符  |
   | ```.*```       | 成员指针运算符  |
   | ```::```       | 作用域运算符   |
   | ```#```        | 编译预处理符号  |
   | ```?:```       | 三目条件运算符  |
   | ```sizeof()``` | 取数据类型的长度 |
- 重载运算符限制在c++语言中已有的运算符范围内的允许重载的运算符之中，**不能创建新的运算符**
- 运算符重载的实质是函数重载，遵循函数重载的选择原则
- 重载之后**不能改变运算符的优先级和结合性**，也不能够改变运算符操作数的个数及语法结构
- 运算符重载不能改变该运算符用于内部类型对象的含义
- 运算符重载是针对新类型数据的实际需要对原有运算符进行的适当的改造，**重载的功能应当与原有功能相类似**
- 重载运算符的函数不能有默认的参数，否则就改变了运算符的参数个数
- 重载的运算符只能是用户自定义类型

| <div style="width:60px">表达式</div> | 作为成员函数                     | 作为非成员函数          | 示例                                                                               |
|:---------------------------------:| -------------------------- | ---------------- | -------------------------------------------------------------------------------- |
| @a                                | ```(a).operator@ ()```     | operator@ (a)    | ```    !std::cin ```调用``` std::cin.operator!()```                                |
| a@b                               | ```(a).operator@ (b)```    | operator@ (a, b) | ```    std::cout << 42 ```调用``` std::cout.operator<<(42)```                      |
| a=b                               | ```(a).operator= (b)```    | 不能是非成员           | ```    std::string s; s = "abc"; ```调用``` s.operator=("abc")```                  |
| a(b...)                           | ```(a).operator()(b...)``` | 不能是非成员           | ```    std::random_device r; auto n = r(); ```调用``` r.operator()()```            |
| a[b]                              | ```(a).operator[](b)```    | 不能是非成员           | ```    std::map<int, int> m; m[1] = 2; ```调用``` m.operator[](1)```               |
| a->                               | ```(a).operator->()```     | 不能是非成员           | ```    auto p = std::make_unique<S>(); p->bar() ```调用``` p.operator->()```       |
| a@                                | ```(a).operator@ (0)```    | operator@ (a, 0) | ```    std::vector<int>::iterator i = v.begin(); i++ ```调用``` i.operator++(0)``` |

此表中，@ 是表示所有匹配运算符的占位符：@a 为所有前缀运算符，a@ 为除 -> 以外的所有后缀运算符，a@b 为除 = 以外的所有其他运算符

## 类型转换重载

double类型转换重载

```cpp
operator double();
```

bool类型转换重载

```cpp
operator bool();
```

## 成员函数运算符重载

语法格式

```cpp
class 类名
{
    返回类型 operator 运算符 (参数表);
}
```

## 友元运算符重载

在类的内部，定义友元运算符重载函数的格式如下：

```cpp
class xx
{
    friend <返回类型说明符> operator <运算符符号> (形参表)
    {
        <函数体>
    }
}
```

## 实例

#### - 一元运算符重载

```cpp
    Vec2D operator -()
    {
        return Vec2D(-x, -y);
    }
```

#### []运算符重载

```cpp
    int& operator[](int i)
    {
        if (i > SIZE)
        {
            cout << "索引超过最大值" << endl;
            // 返回第一个元素
            return arr[0];
        }
        return arr[i];
    }
```

#### ++ 和 -- 运算符重载

```cpp
    //重载前缀递增运算符++
    Time operator ++()
    {
        second++;
        if (second > 59)
        {
            second -= 60;
            minute++;
        }
        if (minute > 59)
        {
            minute -= 60;
            hour++;
        }
        if (hour > 23)
        {
            hour -= 24;
        }
        return *this;
    }
    //重载后缀递增运算符++
    Time operator ++(int)
    {
        Time T = *this;
        second++;
        if (second > 59)
        {
            second -= 60;
            minute++;
        }
        if (minute > 59)
        {
            minute -= 60;
            hour++;
        }
        if (hour > 23)
        {
            hour -= 24;
        }
        return T;
    }
```

#### 输入输出运算符重载

```cpp
    friend ostream& operator<<(ostream& output,const Time& T)
    {
        output << T.hour <<":"<< T.minute << ":" << T.second;
        return output;
    }

    friend istream& operator>>(istream& input, Time&T)
    {
        input >> T.hour >> T.minute >> T.second;
        return input;
    }
```

#### 赋值运算符重载

```cpp
    void operator=(const Time& T)
    {
        hour = T.hour;
        minute = T.minute;
        second = T.second;
    }
```
