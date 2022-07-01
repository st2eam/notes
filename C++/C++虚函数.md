## [虚函数表](https://cloud.tencent.com/developer/article/1599283) Virtual Table

对于一个类来说，**如果类中存在虚函数，那么该类的大小就会多4个字节，然而这4个字节就是一个指针的大小，这个指针指向虚函数表。** 所以，如果对象存在虚函数，那么编译器就会生成一个指向虚函数表的指针，所有的虚函数都存在于这个表中，**虚函数表就可以理解为一个数组，每个单元用来存放虚函数的地址。**

```cpp
#include <iostream>
#include <stdio.h>
using namespace std;

class Base {
public:
    virtual void a() { cout << "Base a()" << endl; }
    virtual void b() { cout << "Base b()" << endl; }
    virtual void c() { cout << "Base c()" << endl; }
};

class Derive : public Base {
public:
    virtual void b() { cout << "Derive b()" << endl; }
};

int main()
{
    cout << "----------Base-------------" << endl;
    Base* q = new Base;
    long* tmp1 = (long*)q;
    long* vptr1 = (long*)(*tmp1);
    for (int i = 0; i < 3; i++) {
        printf("vptr[%d] : %p\n", i, vptr1[i]);
    }

    Derive* p = new Derive;
    long* tmp = (long*)p;
    long* vptr = (long*)(*tmp);
    cout << "---------Derive------------" << endl;
    for (int i = 0; i < 3; i++) {
        printf("vptr[%d] : %p\n", i, vptr[i]);
    }
    return 0;
}
```

## 纯虚析构函数

如果基类并不需要回收清理什么，那么析构函数就可以是虚构函数

## 虚析构函数

- 一般的建议是作为基类的析构函数是虚函数

- 当指针指向的对象是基类类型时，delete销毁对象的时候并不会调用派生类的析构函数，这样就造成了对象销毁不完整
  
  >  总结一下虚析构函数的作用：

> （1）如果基类的析构函数不加virtual关键字
> 当基类的析构函数不声明成虚析构函数的时候，当派生类继承父类，基类的指针指向派生类时，delete掉基类的指针，只调动基类的析构函数，而不调动派生类的析构函数。

> （2）如果基类的析构函数加virtual关键字
> 当基类的析构函数声明成虚析构函数的时候，当派生类继承基类，基类的指针指向派生类时，delete掉基类的指针，先调动派生类的析构函数，再调动基类的析构函数。

> 原理分析

由于基类的析构函数为虚函数，所以派生类会在所有属性的前面形成虚表，而虚表内部存储的就是基类的虚函数。
当delete基类的指针时，由于派生类的析构函数与基类的析构函数构成多态，所以得先调动派生类的析构函数；之所以再调动基类的析构函数，是因为delete的机制所引起的,delete 基类指针所指的空间，要调用基类的析构函数。

## 虚继承

- 是指一个指定的基类，在继承体系结构中，将其成员数据实例共享给也从这个基类型直接或间接派生的其它类。

```cpp
class typename :virtual public inheritance{

}
```

## 纯虚函数

```cpp
virtual ReturnType Function(Argument List)=0;
```

## 抽象类

- 含有纯虚函数的类就是抽象类

- 抽象类没有完整的信息，只能是派生类的基类

- 抽象类不能有实例，不能有静态成员

- 派生类应该实现抽象类的所有方法

## 2021/04/24

```cpp
// CMakeProject1.h: 标准系统包含文件的包含文件
// 或项目特定的包含文件。
#pragma once

#include <iostream>
#include <string>

// TODO: 在此处引用程序需要的其他标头。
class Basic {
public:
    Basic(){
        int_data = 0;
        double_data = 0;
        std::cout << __FUNCTION__ << std::endl;
    }
    virtual ~Basic() {
        std::cout << __FUNCTION__ << std::endl;
    }
     virtual void Function() {
        std::cout << __FUNCTION__ << std::endl;
    }
     void Function_2() {
         std::cout << __FUNCTION__ << std::endl;
     }
private:
    int int_data;
    double double_data;
};

class Superior :virtual public Basic{
public:
    Superior() {
        std::cout << __FUNCTION__ << std::endl;
    }
    void Function() override{
        std::cout << __FUNCTION__ << std::endl;
    }
    void Function_2() {
        std::cout << __FUNCTION__ << std::endl;
    }
    Basic* get_basic()
    {
        return this;
    }
    ~Superior() {
        std::cout << __FUNCTION__ << std::endl;
    }
};

// CMakeProject1.cpp: 定义应用程序的入口点。

#include "CMakeProject1.h"
using namespace std;

int main()
{
    Superior* sup = new Superior;
    sup->get_basic()->Function();
    sup->Function();
    sup->get_basic()->Function_2();
    sup->Function();
    delete sup;
    cout << "--------------------" << endl;
    Basic* base = new Superior;
    base->Function();
    delete base;
    cout << "--------------------" << endl;
    Superior sup_2;
    Basic* base_2 = &sup_2;
    base_2->Function();
    base_2->Function_2();
    return 0;
}
```

#### 结果如下

```cpp
Basic::Basic
Superior::Superior
Superior::Function
Superior::Function
Basic::Function_2
Superior::Function
Superior::~Superior
Basic::~Basic
--------------------
Basic::Basic
Superior::Superior
Superior::Function
Superior::~Superior
Basic::~Basic
--------------------
Basic::Basic
Superior::Superior
Superior::Function
Basic::Function_2
Superior::~Superior
Basic::~Basic
```
