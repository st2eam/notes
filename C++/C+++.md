## 面向对象编程思想

#### 设计思路

面向对象的程序设计的思路和人们日常生活中处理问题的思路是相似的。在自然世界和社会生活中，一个复杂的事物总是由许多部分组成的。任何一个事物都可以看成一个对象（object）。对象可大可小，是构成系统的基本单位。  

#### 对象的两个要素

任何一个对象都应当具有这两个要素，即属性（attribute）和行为（behavior），它能根据外界给的信息进行相应的操作。一个对象往往是由一组属性和一组行为构成的。一般来说，凡是具备属性和行为这两种要素的，都可以作为对象。

#### 抽象

抽象是对具体的对象（问题）进行概括，提取出一类对象的公共属性/行为。

- 数据抽象：描述某类对象的属性或状态
- 函数抽象：描述某类对象的共有的行为特征或具有的功能

抽象的结果：形成类的定义

#### 封装

在抽象出的数据成员、函数成员基础上提取出对外接口，定义访问权限。以达到简化外部使用的目的。使用者不必了解具体的实现细节，而只需要通过外部接口，来访问类的成员。

## 面向对象三要素

- 封装（Encapsulation)
  - 将数据和方法（数据上的操作）捆绑，定义新的类型
  - 接口与实现分离，隐藏实现细节
- 继承（Inherit）
  - 子类对基类进行特化（扩展、覆盖、重定义）
  - 达到复用代码的目的
- 多态（Polymorphism）
  - 允许不同类的对象对同一消息做出响应，即同一消息可以根据发送对象的不同而采用多种不同的行为方式

## 关系

- is-a一般是泛化关系
  - 继承：表示类与类之间的继承关系
  - 实现：表示一个类实现接口的功能
- use-a为依赖关系
  - 表示两个相互独立的对象，当一个对象负责构造另一个对象的实例，或者依赖另一个对象的服务
- has-a一般是聚合关系
  - 两个对象有不同的生命周期
- contain-a为组合关系
  - 体现了严格的部分与整体的关系，生命周期相同

## C 和 C++的兼容及差异

#### const变量

- 只读
  - 初始化后不可改变(必须初始化)
- 语法
  - const int var;
  - int const var;
  - 修饰指针时const位置不同语义不同
    - const int* p;//指针可修改，指向对象不可修改
    - int const* p;//指针不可修改，指向内容可修改
- 与C的差异
  - 与#define的区别
  - C也有，略有差异

#### 强制类型转换

- C语言形式:(类型)(表达式):(int)var

- C++新增形式:类型名(表达式):int(var)
  
#### 内存申请

  | 高地址 | 栈区(向下增长)↓ |
  |:---:|:---------:|
  | ↑   | 堆区(向上增长)↑ |
  | ↑   | 静态区(全局区)  |
  | ↑   | 常量区       |
  | 低地址 | 代码区       |

**内存分区模型**

C++程序在执行时，将内存大方向划分为**4个区域**

- 代码区：存放函数体的二进制代码，由操作系统进行管理的
- 全局区：存放全局变量和静态变量以及常量
- 栈区：由编译器自动分配释放, 存放函数的参数值,局部变量等
- 堆区：由程序员分配和释放,若程序员不释放,程序结束时由操作系统回收

**内存四区意义：**

不同区域存放的数据，赋予不同的生命周期, 给我们更大的灵活编程

#### 堆内存申请/释放

C语言: malloc / free

C++: new / delete

```cpp
    for (int i = 0;; i++)
    {
        char* block = new char[1024 * 1024];
        cout << "已申请" << i + 1 << "M内存" << endl;
    }
```

## 指针

```cpp
int  var = 20;   // 实际变量的声明
int  *ip;        // 指针变量的声明

ip = &var;       // 在指针变量中存储 var 的地址
```

## 引用

```cpp
// 声明简单的变量
int    i;
double d;

// 声明引用变量
int&    r = i;
double& s = d;
```

- 变量别名
- 函数参数传递方式
  - 值传递
  - 地址传递
  - 引用传递

```cpp
void passParamByValue(std::string param)
{
    param = "changed param";
}

void passParamByRef(std::string& param)
{
    param = "changed param";
}
```

- 注意事项
  - 必须初始化
  - 初始化后不能引用另一个对象

## 内联函数

- 语法
  
  - inline void func();

- 原理
  
  - 在编译时将所调用函数的代码直接嵌入到主调函数中，减少函数调用开销

- 提示
  
  - 应仅用来修饰简单函数
    
## 函数重载

- 函数起名字存在痛点

- 函数名相同，参数类型/个数不同

- 注意事项
  
  - 不支持以返回值区分函数
  
  - 支持const修饰区分
    
## 函数模板

- 语法
  
  ```cpp
  template<typename T>
  T max(T a, T b)
  {
  return a > b ? a : b;
  }
  ```
  
## 函数默认参数

- 语法
  
  - ```void func(int param1, float param2 = 0.0f);```

- 注意事项
  
  - 默认值一般在声明中指定
  - 若给某一参数设置了默认值，那么其后所有参数都必须也设置默认值
  - 若给已经设置默认值的参数传递实际值，则该参数左边的所有参数，无论是否有默认值，都必须传递实际参数

## 作用域与命名空间

#### 作用域

- 作用域（scope）描述了一个名字在文件（编译单元）的多大范围内可见

- 解决名字冲突的痛点

- 局部域是包含在函数定义或者块（如括号包含的）中的程序文本部分

- 每个类定义都引入了一个独立的类域

- 用户主动添加的具有名字的最外层作用域
  
  #### 函数的作用域

- 可以是类，也可以是名字空间

- 但不能是局部的
  
  - lambda函数

#### 命名空间（namespace）

- 声明 （可嵌套可不连续）
  
  ```cpp
  namespace MySpace
  {
    ... ...
  }
  ```

- 使用
  
  - 提前声明：
  - using 名称::变量
  - using 名称::函数名

- 直接使用：
  
  - 名称::变量或函数名

## 链接性

- 链接性（linkage）描述了名称如何在各个单元中的共享
  - 外部链接
  - 内部链接
- 默认为外部链接
- 修饰符extern用在变量或者函数的声明前，用来说明“此变量/函数是在别处定义的，要在此处引用”
- extern声明不是定义，即不分配存储空间。
- static修饰后改为内部链接

## 输出流格式控制

C++ 中常用的输出流操纵算子如表所示，它们都是在头文件 iomanip 中定义的；要使用这些流操纵算子，必须包含该头文件。

> 注意：“流操纵算子”一栏中的星号*不是算子的一部分，星号表示在没有使用任何算子的情况下，就等效于使用了该算子

| <div style="width:100px">流操纵算子</div> | 作用                                                                                                                                                      |
|:------------------------------------ |:------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ==常用==                               |                                                                                                                                                         |
| *dec                                 | 以十进制形式输出整数                                                                                                                                              |
| hex                                  | 以十六进制形式输出整数                                                                                                                                             |
| oct                                  | 以八进制形式输出整数                                                                                                                                              |
| fixed                                | 以普通小数形式输出浮点数                                                                                                                                            |
| scientific                           | 以科学计数法形式输出浮点数                                                                                                                                           |
| left                                 | 左对齐，即在宽度不足时将填充字符添加到右边                                                                                                                                   |
| *right                               | 右对齐，即在宽度不足时将填充字符添加到左边                                                                                                                                   |
| setbase(b)                           | 设置输出整数时的进制，b=8、10 或 16                                                                                                                                  |
| setw(w)                              | 指定输出宽度为 w 个字符，或输人字符串时读入 w 个字符                                                                                                                           |
| setfill(c)                           | 在指定输出宽度的情况下，输出的宽度不足时用字符 c 填充（默认情况是用空格填充）                                                                                                                |
| setprecision(n)                      | 设置输出浮点数的精度为n。  在使用非fixed且非scientific方式输出的情况下，n即为有效数字最多的位数，如果有效数字位数超过n，则小数部分四舍五入，或自动变为科学计数法输出并保留一共n位有效数字。在使用 fixed 方式和 scientific 方式输出的情况下，n是小数点后面应保留的位数 |
| setiosflags(flag)                    | 将某个输出格式标志置为 1                                                                                                                                           |
| resetiosflags(flag)                  | 将某个输出格式标志置为 0                                                                                                                                           |
| ==不常用==                              |                                                                                                                                                         |
| boolapha                             | 把 true 和 false 输出为字符串                                                                                                                                   |
| *noboolalpha                         | 把 true 和 false 输出为 0、1                                                                                                                                  |
| showbase                             | 输出表示数值的进制的前缀                                                                                                                                            |
| *noshowbase                          | 不输出表示数值的进制.的前缀                                                                                                                                          |
| showpoint                            | 总是输出小数点                                                                                                                                                 |
| *noshowpoint                         | 只有当小数部分存在时才显示小数点                                                                                                                                        |
| showpos                              | 在非负数值中显示 +                                                                                                                                              |
| *noshowpos                           | 在非负数值中不显示 +                                                                                                                                             |
| *skipws                              | 输入时跳过空白字符                                                                                                                                               |
| noskipws                             | 输入时不跳过空白字符                                                                                                                                              |
| uppercase                            | 十六进制数中使用A~E。若输出前缀，则前缀输出 0X，科学计数法中输出 E                                                                                                                   |
| *nouppercase                         | 十六进制数中使用                                                                                                                                                |
| internal                             | 数值的符号（正负号）在指定宽度内左对齐，数值右对 齐，中间由填充字符填充。                                                                                                                   |

### 科学计数法表示

```cpp
cout << scientific << π << endl;
```

### 保留有效数字

```cpp
cout.precision(3);//保留几位就填几

//位数不足时
cout.precision(10);
cout << fixed << 3.1415926;//不足十位
```

### 保留两位小数

```cpp
#include <iomanip>  //不要忘了头文件

cout<<setiosflags(ios::fixed)<<setprecision(2);//保留几位就填几

//或者

printf("%.2lf", π);//不会影响之后输出
```

## C++ 编程范式

- 融合多种编程范式
- 以面向对象编程+泛型编程为主
- 支持函数式编程

## 泛型编程

- 目的
  - 实现C++的STL（Standard Template Library 标准模板库）
- 支持机制
  - 模板（Templates）的实质就是参数化类型，简而言之：把特定的类型信息抽象化，抽象成模板参数T。这样就可以编写出任意类型动作一致的类或方法，在使用时才指定实际类型
- 特性
  - 泛型一定程度上杜绝了类型转换

## 编程范式

- 面向过程编程(c)

- #### 面向对象编程(c++)
  
  - 重用性
    
    > 代码可复用，维护成本低
  
  - 灵活性
    
    > 基于可复用的模块进行重新组装、重构，以达到实现不同的功能
  
  - 扩展性
    
    > 对新增需求友好，模块可扩展

- 函数式编程(js)

- 泛型编程

## 使用编译器通常的流程

> .cpp→编译→.obj→链接→.exe

## 调试

> F5 运行

> F10 单步运行

> F11 单步运行会进入到函数内

- 断点
  - 普通断点
  - 数据断点
  - 断点条件

## 数字转string，string转数字de函数

数字转string 这些都可以

```cpp
to_string(int)

to_string(long)

to_string(long long)

to_string(float)

to_string(double)

to_string(long double)
```

string转数字

头文件：

```cpp
#include<cstdlib>

stoi(str)//int

stol(str)//long 

stoll(str)//long long
```

## MyString //继承string

```cpp
#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

template<typename T> 
class MyString : public string 
{
public:
    MyString(const char* str) :string(str) {}; // 用string()初始化构造函数
    MyString() :string() {};                   // 无参数构造函数，用string
    MyString(string str) :string(str) {};      // 类型转换构造函数

    MyString operator () (int i, int j)//截取
    {
        return substr(i, j);
    }
    MyString operator - (const MyString str)//减去相同字符
    {
        MyString temp = *this;
        for (int i = 0; i < temp.size(); i++)
        {
            for (int j = 0; j < str.size(); j++)
            {
                if (temp[i] == str[j])
                {
                    temp.erase(i,i);
                }
            }
        }
        return temp;
    }
    MyString reverse()//反转
    {
        MyString temp;
        temp.resize(this->size());
        for (int i = 0; i < this->size(); i++)
        {
            temp[i] = this->at(this->size() - 1 - i);
        }
        return temp;
    }
    int toInt()//toInt
    {
        int intStr = atoi(this->c_str());
        return intStr;
    }
};
int main()
{
    MyString<string> str = "0123456789";
    MyString<string> str_2 = str.reverse();
    MyString<string> str_3 = "123";
    cout << (str_2 - str_3).toInt();
    return 0;
}
```

## 计算栅格路径数

假设存在一个m*n的栅格，编写函数计算从左下角（坐标：0, 0）走右上角（坐标：m,n）的路径有多少种。只能沿栅格线走，且不能反向走，既只能向上或向右走。

```cpp
#include<iostream>
using namespace std;
int move(int m, int n)
{
    if (m < 0 || n < 0)return 0;
    else (m == 0 || n == 0)return 1;
    else return move(m - 1, n) + move(m, n - 1);
}
int main()
{
    int m, n;
    cin >> m >> n;
    cout << move(m, n) << endl;
    return 0;
}
```

## 选择排序

```cpp
template<typename T>
void selection_sort(std::vector<T>& arr) {
        for (int i = 0; i < arr.size() - 1; i++) {
                int min = i;
                for (int j = i + 1; j < arr.size(); j++)
                        if (arr[j] < arr[min])
                                min = j;
                Swap(arr[i], arr[min]);
        }
}
```

## 快速排序

```cpp
#include<iostream>
using namespace std;

template <class T>
void Swap(T &t1, T &t2)
{
    T temp;
    temp = t1;
    t1 = t2;
    t2 = temp;
}
//快速排序
template <class T>
void quick_sort(T s[], int left, int right)
{
    if (left < right)
    {
        Swap(s[left], s[(left + right) / 2]); //将中间的这个数和第一个数交换
        T i = left, j = right, x = s[left];
        while (i < j)
        {
            while (i < j && s[j] >= x) // 从右向左找第一个小于x的数
                j--;
            if (i < j)
                s[i++] = s[j];

            while (i < j && s[i] < x) // 从左向右找第一个大于等于x的数
                i++;
            if (i < j)
                s[j--] = s[i];
        }
        s[i] = x;

        quick_sort(s, left, i - 1); // 递归调用 
        quick_sort(s, i + 1, right);
    }
}

int main()
{
    char aa[10] = {'a','v','c','d','t','z','q','i','b','x' };
    int n = sizeof(aa);//不同类型记得改
    quick_sort(aa,0,n-1);
    for (int i = 0; i < 10; i++)
        cout << aa[i] << " ";
}
```

快速排序2

```cpp
#include<iostream>
using namespace std;

template <typename T>
void Swap(T& t1, T& t2)
{
    T temp;
    temp = t1;
    t1 = t2;
    t2 = temp;
}
//快速排序
template <typename T>
void quick_sort(T s[], int left, int right)
{
    if (left < right)
    {
        int i = left, j = right, p = left;
        while (i < j)//当i = j时退出循环
        {
            //从右往左找到比p小的数
            for (; i < j && s[j] >= s[p]; j--) {}Swap(s[p], s[j]); p = j;
            //从左往右找到比p大或相等的数
            for (; i < j && s[i] < s[p]; i++) {}Swap(s[p], s[i]); p = i;
        }
        quick_sort(s, left, i - 1); // 递归调用 
        quick_sort(s, i + 1, right);
    }
}

int main()
{
    //int array[10] = { 49,54,60,23,31,13,26,49,52,97 };
    //char array[10] = { 'e','v', 'h', 'o', 'c', 'z', 'h', 'l', 'f', 'a', };
    string array[10] = { "床前", "明月光", "疑是", "地上霜", "举头", "望", "明月", "低头", "思", "故乡" };
    int n = sizeof(array) / sizeof(array[0]);
    quick_sort(array, 0, n - 1);
    for (int i = 0; i < n; i++)
        cout << array[i] << " ";
    return 0;
}
```

## 引用计数的智能指针的实现

SmartPoint.h

```cpp
﻿#pragma once
#include <iostream>
//#include <objbase.h>
using namespace std;
#pragma once
// 引用计数操作器
template<typename T> struct IUnknown
{   
    // 增加引用计数
    virtual void AddRef()=0;
    // 减少引用计数
    virtual void Release()=0;
    // 返回一个引用计数器
    static int* CreateCounter(T* reference)
    {
        return new int(0);
    }
    // 删除引用函数
    static void DeleteReference(int* counter, void* reference)
    {
        delete counter;// 删除计数器
        delete (T*)reference;// 删除资源
    }
};


// 智能指针类
template<typename T> class KComPtr :public IUnknown<T>
{
public:
    // 增加引用计数
    void AddRef()
    {
        if (counter)
        {
            ++(*counter);
        }
    }
    // 减少引用计数，如果资源不再被引用则删除资源
    void Release()
    {
        if (counter)
        {
            if (--(*counter) == 0)
            {
                originalDestructor(counter, originalReference);
                counter = 0;
                reference = 0;
                originalReference = 0;
                originalDestructor = 0;
            }
        }
    }
    // 返回当前计数器
    int* Counter() const
    {
        return counter;
    }

    // 获取资源的直接指针
    T* getResources() const
    {
        return reference;
    }
    // 重载->操作符
    T* operator->()const
    {
        return reference;
    }
    // 重载*操作符
    T& operator*() const {
        return *reference;
    }

    // 构造一个空的智能指针
    KComPtr()
        : counter(0)
        , reference(0)
        , originalReference(0)
        , originalDestructor(0)
    {}
    // 用一个普通指针构造智能指针
    KComPtr(T* pointer)
        : counter(0)
        , reference(0)
        , originalReference(0)
        , originalDestructor(0)
    {
        if (pointer)
        {
            counter = IUnknown<T>::CreateCounter(pointer);  // 创建新的计数器
            reference = pointer;                            // 获取当前资源的引用
            originalReference = pointer;                    // 将原始资源置为当前资源
            originalDestructor = IUnknown<T>::DeleteReference;// 连接删除器
            AddRef();// 引用计数增加
        }
    };
    // 用另一个同类型的智能指针进行拷贝构造，不创建新资源
    KComPtr(const KComPtr<T>& pointer)
        : counter(pointer.counter)
        , reference(pointer.reference)
        , originalReference(pointer.originalReference)
        , originalDestructor(pointer.originalDestructor)
    {
        AddRef();// 引用计数增加
    }
    // 用其他类型的智能指针进行转型拷贝构造，不创建新资源
    // 将原始类型U转换为当前智能指针的类型T，但是原始资源与原始删除器不变
    template<typename U> KComPtr(const KComPtr<U>& pointer)
        : counter(0)
        , reference(0)
        , originalReference(0)
        , originalDestructor(0)
    {
        T* converted = pointer.get();
        if (converted)
        {
            counter = pointer.Counter();
            reference = converted;
            originalReference = pointer.originalReference;
            originalDestructor = pointer.originalDestructor;
            AddRef();
        }
    }
    // 析构当前的智能指针，减少引用计数
    ~KComPtr()
    {
        Release();
    }
    // 将一个普通指针的值赋给智能指针
    // 构造失败则将智能指针置为空
    KComPtr<T>& operator=(T* pointer)
    {
        Release();// 原本的资源引用减少
        if (pointer)
        {
            counter = IUnknown<T>::CreateCounter(pointer);
            reference = pointer;
            originalReference = pointer;
            originalDestructor = &IUnknown<T>::DeleteReference;
            AddRef();
        }
        else
        {
            counter = 0;
            reference = 0;
            originalReference = 0;
            originalDestructor = 0;
        }
        return *this;
    }
    // 将另一个智能指针的值赋给自身
    KComPtr<T>& operator=(const KComPtr<T>& pointer)
    {
        if (this != &pointer)// 判断是否自赋值
        {
            Release();
            counter = pointer.counter;
            reference = pointer.reference;
            originalReference = pointer.originalReference;
            originalDestructor = pointer.originalDestructor;
            AddRef();
        }
        return *this;
    }
    // 将一个不同类型的智能指针赋给自身
    // 智能指针之前引用的资源取消，并引用新的智能指针的资源
    // 转型失败的话返回空智能指针
    template<typename U> KComPtr<T>& operator=(const KComPtr<U>& pointer)
    {
        T* converted = pointer.get();
        Release();
        if (converted)
        {
            counter = pointer.counter;
            reference = converted;
            originalReference = pointer.originalReference;
            originalDestructor = pointer.originalDestructor;
            AddRef();
        }
        else
        {
            counter = 0;
            reference = 0;
            originalReference = 0;
            originalDestructor = 0;
        }
        return *this;
    }

    // 重载比较操作符，用于比较智能指针与普通指针是否指向相同资源
    bool operator ==(const T* pointer)const { return reference == pointer; }
    bool operator !=(const T* pointer)const { return reference != pointer; }
    bool operator > (const T* pointer)const { return reference > pointer; }
    bool operator >=(const T* pointer)const { return reference >= pointer; }
    bool operator < (const T* pointer)const { return reference < pointer; }
    bool operator <=(const T* pointer)const { return reference <= pointer; }

    // 重载比较操作符，用于比较两个智能指针是否指向相同资源
    bool operator ==(const KComPtr<T>& pointer)const { return reference == pointer.reference; }
    bool operator !=(const KComPtr<T>& pointer)const { return reference != pointer.reference; }
    bool operator > (const KComPtr<T>& pointer)const { return reference > pointer.reference; }
    bool operator >=(const KComPtr<T>& pointer)const { return reference >= pointer.reference; }
    bool operator < (const KComPtr<T>& pointer)const { return reference < pointer.reference; }
    bool operator <=(const KComPtr<T>& pointer)const { return reference <= pointer.reference; }

    // 智能指针指向非空时有true的布尔值
    operator bool()const { return reference != 0; }

private:
    template<typename X> friend class KComPtr;

    // 删除器
    typedef void (*Destructor)(int*, void*);

    // 引用计数器
    int* counter;

    // 引用资源，在拷贝过程中可能改变类型
    T* reference;

    // 原始引用资源，保持资源第一次创建时的指针
    void* originalReference;

    // 原始资源删除函数，在最后一个引用被析构时调用，删除资源
    Destructor originalDestructor;
};
```

main.cpp

```cpp
#include "SmartPoint.h"
#include <thread>
using namespace std;

class Base {
public:
    Base() { cout << "构造了一个基类" << endl; }
    ~Base() { cout << "基类被析构" << endl; }
};

class Derived : public Base   
{
public:
    Derived() { cout << "构造了一个派生类" << endl; }
    ~Derived() { cout << "派生类被析构" << endl; }
};
int main()
{
    KComPtr<Base> BasePoint_1 = new Base();
    KComPtr<Base> BasePoint_2 (new Base());
    KComPtr<Base> BasePoint_3 = new Derived();
    Base* p = BasePoint_1.getResources();
    KComPtr<Base> BasePoint_4 = BasePoint_1;
    cout<< "BasePoint.Counter_1:" << *BasePoint_1.Counter() << endl
        << "BasePoint.Counter_2:" << *BasePoint_2.Counter() << endl
        << "BasePoint.Counter_3:" << *BasePoint_3.Counter() << endl
        << "BasePoint.Counter_4:" << *BasePoint_4.Counter() << endl;
    if (BasePoint_1 == p) cout << "相等" << endl;
    if (BasePoint_1 == BasePoint_4) cout << "相等" << endl;
    return 0;
}
```

#### [git](http://www.ruanyifeng.com/blog/2014/06/git_remote.html)

<hr></hr>
版权声明：本文为stream的原创文章，遵循CC 4.0 BY - SA版权协议，转载请附上原文出处链接及本声明。

原文链接：http://note.youdao.com/noteshare?id=4c54753e7c3a8ccda0e023eb97a7cbc3
