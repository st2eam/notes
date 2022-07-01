## 模板

模板是一种类型进行参数化的工具，通常有两种形式

**函数模板**

- 函数模板针对仅参数类型不同的函数

```cpp
template <typename type> return-type
func-name(parameter list)
{
    // 函数体
}
```

//例：

```cpp
template <typename T1,typename T2> 
auto add(T1 a, T2 b)
{
    return a+b;
}
```

**类模板**

- 类模板针对仅数据成员和函数成员类型不同的类

```cpp
template <typename type> class 类名
{
    // 类定义
};
```

- 模板的声明或定义只能在全局，命名空间或类范围内进行

- 实例化
  
  - 函数模板只是蓝图，本身不是不是类型、函数
  - 编译器扫描代码，遇到模版定义时，并不立即产生代码
  - 确定模板实参后，编译器生成实际函数代码

- 确定模板实参的方法
  
  - **显式实例化**
    
    强制某些函数实例化，可出现于程序中模板定义后的任何位置。
  
  - **隐式实例化**
    
    编译器查看函数调用，推断模版实参，实现隐式实例化。

#### 实例函数/实例类

由函数模板实例化得到的函数叫做“实例函数”，由类模板实例化得到的类叫做“实例类”

#### 默认类型模板参数

类模板的类型形参可以有默认值，函数模板的类型形参则不能

函数模板和类模板都可以为模板的非类型形参提供默认值

类模板的类型形参的默认值形式为

```cpp
template<typename T1,typename T2 = int> class Demo
{
  ...  
};
```

#### 友元模板函数

```
?
```

#### 多态的模板实现

- 虚函数多态，是动态绑定，运行时多态，使用继承、虚函数，基类指针实现透明的处理不同类型集合的方法
1. 能够优雅的处理一个包含有不同类型的集合

2. 可执行代码量通常比较小

3. 可以对代码进行完全编译；因此不需要发布源码
- 模板多态，是静多态

#### 模板特化和偏特化

- **模板特化**：是指对于模板参数是特定的类型，可以为编译器指定特定的实现
- **模板偏特化**：当有多个模板参数时，可以为部分模板参数指定特定的类型来进行特化
- 函数模板只支持全特化

```cpp
template<typename T1, typename T2>
class Test
{
public:
    Test(T1 i, T2 j) :a(i), b(j) { std::cout << "模板类" << std::endl; }
private:
    T1 a;
    T2 b;
};

template<>
class Test<int, char>
{
public:
    Test(int i, char j) :a(i), b(j) { std::cout << "全特化" << std::endl; }
private:
    int a;
    char b;
};

template <typename T2>
class Test<char, T2>
{
public:
    Test(char i, T2 j) :a(i), b(j) { std::cout << "偏特化" << std::endl; }
private:
    char a;
    T2 b;
};

//////////////////////////////////////////////////////////////////////////

//模板函数
template<typename T1, typename T2>
void fun(T1 a, T2 b)
{
    std::cout << "模板函数" << std::endl;
}

//全特化
template<>
void fun<int, char >(int a, char b)
{
    std::cout << "全特化" << std::endl;
}

//函数不存在偏特化：下面的代码是错误的
/*
template<typename T2>
void fun<char,T2>(char a, T2 b)
{
    cout<<"偏特化"<<endl;
}
*/
int main()
{
    Test<double, double> t1(0.1, 0.2);
    Test<int, char> t2(1, 'A');
    Test<char, bool> t3('A', true);

    return 0;

}
```

#### 模板元编程

- c++模板是一种新的编程范式
- 借助模板参数推理和模板特化
- 将运行期行为用编译期来模拟，最主要的两个点：
1. 用模板特化来模拟运行期的分支判断
2. 用模板参数递归匹配来模拟运行期的循环流程

```cpp
template<int a_1, int ...a_n>
struct MinValue {
    static const int value = a_1 > MinValue<a_n...>::value ? MinValue<a_n...>::value : a_1;
};

template<int a, int b>
struct MinValue<a, b> {
    static const int value = MinValue<a>::value < MinValue<b>::value ? MinValue<a>::value : MinValue<b>::value;
};

//这个版本是需要的
template<int a>
struct MinValue<a> {
    static const int value = a;
};

template<int a_1, int ...a_n>
struct MaxValue {
    static const int value = a_1 < MaxValue<a_n...>::value ? MaxValue<a_n...>::value : a_1;
};

template<int a, int b>
struct MaxValue<a, b> {
    static const int value = a > b ? a : b;
};

//这个版本不需要
// template<int a>
// struct MaxValue<a> {
//  static const int  value = a;
// };

int main()
{
    //编译期查找最大最小值
    const int maxResult = MaxValue<8, 5, 2, 10, 6, 1, 9>::value;
    const int minResult = MinValue<8, 5, 2, 10, 6, 1, 9>::value;
    std::cout << "MaxValue:" << maxResult << std::endl;
    std::cout << "MinValue:" << minResult << std::endl;
}
```

#### 泛型编程

声明与实现放在一起

#### 非泛型编程

声明与实现分离
