# C++ STL

## [STL](http://c.biancheng.net/stl/)

> Standard Template Library

| <div style="width:110px">类别</div> | 解释                             |
|:---------------------------------:| ------------------------------ |
| 容器(containers)                    | 特殊的数据结构，实现了数组链表队列等等，实质是模板类     |
| 迭代器(iterators)                    | 一种复杂的指针，可以通过其读写容器中的对象，实质是运算符重载 |
| 空间配置器(allocator)                  | 容器的空间配置管理的模板类                  |
| 配接器(adapters)                     | 用来修饰容器、仿函数、迭代器接口               |
| 算法(algorithms)                    | 读写容器对象的逻辑算法：排序，便利，查找，等等实质是模板函数 |
| 仿函数(functors)                     | 类似函数，通过重载()运算符来模拟函数行为的类        |

> ### STL 容器种类和功能

| <div style="width:80px">类别</div> | 解释                                                                                                                                                      |
|:--------------------------------:| ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 序列容器                             | 主要包括 vector 向量容器、list 列表容器以及 deque 双端队列容器。之所以被称为序列容器，是因为元素在容器中的位置同元素的值无关，即容器不是排序的。将元素插入容器时，指定在什么位置，元素就会位于什么位置。                                          |
| 排序容器                             | 包括 set 集合容器、multiset多重集合容器、map映射容器以及 multimap 多重映射容器。排序容器中的元素默认是由小到大排序好的，即便是插入元素，元素也会插入到适当位置。所以关联容器在查找时具有非常好的性能。                                        |
| 哈希容器                             | C++ 11 新加入 4 种关联式容器，分别是 unordered_set 哈希集合、unordered_multiset 哈希多重集合、unordered_map 哈希映射以及 unordered_multimap 哈希多重映射。和排序容器不同，哈希容器中的元素是未排序的，元素的位置由哈希函数确定。 |

> ### 迭代器

迭代器和 C++ 的指针非常类似，它可以是需要的任意类型，通过迭代器可以指向容器中的某个元素，如果需要，还可以对该元素进行读/写操作。

常用的迭代器按功能强弱分为输入迭代器、输出迭代器、前向迭代器、双向迭代器、随机访问迭代器 5 种。

> 输入迭代器和输出迭代器比较特殊，它们不是把数组或容器当做操作对象，而是把输入流/输出流作为操作对象。

**前向迭代器（forward iterator）**
假设 p 是一个前向迭代器，则 p 支持 ++p，p++，*p 操作，还可以被复制或赋值，可以用 == 和 != 运算符进行比较。此外，两个正向迭代器可以互相赋值。

**双向迭代器（bidirectional iterator）**
双向迭代器具有正向迭代器的全部功能，除此之外，假设 p 是一个双向迭代器，则还可以进行 --p 或者 p-- 操作（即一次向后移动一个位置）。

**随机访问迭代器（random access iterator）**
随机访问迭代器具有双向迭代器的全部功能。除此之外，假设 p 是一个随机访问迭代器，i 是一个整型变量或常量，则 p 还支持以下操作：

- p+=i：使得 p 往后移动 i 个元素。
- p-=i：使得 p 往前移动 i 个元素。
- p+i：返回 p 后面第 i 个元素的迭代器。
- p-i：返回 p 前面第 i 个元素的迭代器。
- p[i]：返回 p 后面第 i 个元素的引用。

### C++ 11 标准中不同容器指定使用的迭代器类型

| 容器                                                                              | 对应的迭代器类型 | 应用                                                         |
| ------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------- |
| array                                                                           | 随机访问迭代器  |                                                            |
| stack                                                                           | 不支持迭代器   | 后进先出容器                                                     |
| queue                                                                           | 不支持迭代器   | 先进先出容器                                                     |
| vector                                                                          | 随机访问迭代器  | 直接访问任意元素，快速插入、删除尾部元素                                       |
| deque                                                                           | 随机访问迭代器  | 直接访问任意元素，快速插入、删除头部和尾部元素                                    |
| list                                                                            | 双向迭代器    | 快速插入、删除任意位置元素                                              |
| set / multiset                                                                  | 双向迭代器    | 快速查询元素，无重复关键字/允许重复关键字                                      |
| map / multimap                                                                  | 双向迭代器    | Key/value pair mapping(键值对映射)。不允许重复关键字/允许重复关键字，使用关键字快速查询元素 |
| forward_list                                                                    | 前向迭代器    |                                                            |
| unordered_map / unordered_multimap                                              | 前向迭代器    |                                                            |
| unordered_set / unordered_multiset                                              | 前向迭代器    |                                                            |
| ![image](https://note.youdao.com/yws/res/3889/50598C2D2C5C47C9800867B2CE18C0CF) |          |                                                            |
| ![image](https://note.youdao.com/yws/res/3892/0654CF1BD526481582EDF6AADD54A9D4) |          |                                                            |
| ![image](https://note.youdao.com/yws/res/3890/64D553D54FA34DA493045C2F9E4DC1BB) |          |                                                            |
| ![image](https://note.youdao.com/yws/res/3891/AC928157174A4B4BBB8D5540F9B5FBF3) |          |                                                            |

### 迭代器的定义方式

尽管不同容器对应着不同类别的迭代器，但这些迭代器有着较为统一的定义方式
|迭代器定义方式|具体格式|
|--------|--------|
|正向迭代器    |容器类名::iterator  迭代器名;|
|常量正向迭代器    |容器类名::const_iterator  迭代器名;|
|反向迭代器    |容器类名::reverse_iterator  迭代器名;|
|常量反向迭代器    |容器类名::const_reverse_iterator  迭代器名;|

### 排序后迭代器访问list

```cpp
    List->sort();
    for (list<int>::iterator iter = List->begin(); iter != List->end(); iter++)
    {
        cout << *iter << " ";
    }
    cout << endl;
```

### 一级容器的通用函数

| <div style="width:120px">Functions</div> | Description                       |
| ---------------------------------------- | --------------------------------- |
| c1.swap(c2)                              | 交换两个容器c1和c2的内容                    |
| c1.max_size()                            | 返回一个容器可以容纳的最大元素数量                 |
| c.clear()                                | 删除容器中的所有元素                        |
| c.begin()                                | 返回容器首元素的迭代器                       |
| c.end()                                  | 返回容器尾元素之后位置的迭代器                   |
| c.rbegin()                               | 返回容器为元素的迭代器，用于逆序遍历                |
| c.rend()                                 | 返回容器首元素之前位置的迭代器，用于逆序遍历            |
| c.erase(beg, end)                        | 删除容器中从beg到end-1之间的元素。beg和end都是迭代器 |

### 顺序容器通用函数

| <div style="width:120px">Functions</div> | Description              |
| ---------------------------------------- | ------------------------ |
| assign(n, elem)                          | 将指定元素的n份拷贝加入(赋值)到容器中     |
| assign(beg,end)                          | 将迭代器[beg,end)间的元素赋值给当前容器 |
| push_back(elem)                          | 将元素附加到容器                 |
| pop_back()                               | 删除容器尾元素                  |
| front()                                  | 返回容器首元素                  |
| back()                                   | 返回容器尾元素                  |
| insert(position,elem)                    | 将元素插入到容器指定位置             |

### 关联容器通用函数

| <div style="width:140px">Functions</div> | Description                       |
| ---------------------------------------- | --------------------------------- |
| find(key)                                | 搜索容器中具有key的元素，返回指向该元素的迭代器         |
| lower_bound(key)                         | 搜索容器中具有key的第一个元素，返回指向该元素的迭代器      |
| upper_bound(key)                         | 搜索容器中具有key的最后一个元素，返回指向此元素之后位置的迭代器 |
| count(key)                               | 返回容器中具有key的元素的数目                  |

### 迭代器支持的运算符

| 类别                      | 运算符    |
| ----------------------- | ------ |
| All iterators           | ++p    |
| All iterators           | p++    |
| Input iterators         | *p     |
| Input iterators         | p1==p2 |
| Input iterators         | p1!=p2 |
| Output iterators        | *p     |
| Bidirectionl iterators  | --p    |
| Bidirectionl iterators  | p--    |
| Random access iterators | p+=i   |
| Random access iterators | p-=i   |
| Random access iterators | p+i    |
| Random access iterators | p-i    |
| Random access iterators | p1<p2  |
| Random access iterators | p1<=p2 |
| Random access iterators | p1>p2  |
| Random access iterators | p1>=p2 |
| Random access iterators | p[i]   |

```
graph TB

A(Input iterators) -->C(Forward iterators)
B(Output iterators) -->C(Forward iterators)
C(Forward iterators)-->D(Bidirectional iterators)
D(Bidirectional iterators)-->E(Random access  iterators)
```

自定义迭代器

```cpp
    class Iterator {  //自定义迭代器
    private:
        T* it;  //一个T类型指针
    public:
        Iterator() 
        {
            it = nullptr; 
        }
        Iterator(T* m_it) 
        { 
            it = m_it; 
        }
        ~Iterator() 
        { 
            it = nullptr;
        }
        Iterator operator = (const Iterator m_it) 
        {
            it = m_it.it;
            return *this;
        }
        void operator ++ ()
        { 
            it = it + 1; 
        }
        bool operator == (const Iterator m_it) 
        {
            return it == m_it.it;
        }
        bool operator != (const Iterator m_it) 
        {
            return it != m_it.it;
        }
        T operator * () 
        { 
            return *it; 
        }
    };
    Iterator begin() {
        return Iterator(KMdata[0][0]);
    }
    Iterator end() {
        return Iterator(KMdata[this->getRows()][this->getCols()]);
    }
```

### priority_queue

- 优先队列元素按其优先级(priority) 读取，默认使用 < 运算符来比较元素
- 默认基于vector实现。也可基于
  deque，但不能用list

```cpp
priority_queue<float> q;
q.push(22.22);
q.push(66.66);
q.push(44.44);
cout << q.top();

output:66.66
```

### //遍历 vector 容器

```cpp
#include <iostream>
#include <vector>
using namespace std;
int main()
{
    vector<int> v{1,2,3,4,5,6,7,8,9,10}; //v被初始化成有10个元素

    cout << endl << i = 0; i < v.size(); ++i)
    cout << v[i] <<" ";
    //创建一个正向迭代器，当然，vector也支持其他 3 种定义迭代器的方式

    cout << endl << "第二种遍历方法：" << endl;
    vector<int>::iterator i;
    //用 != 比较两个迭代器
    for (i = v.begin(); i != v.end(); ++i)
        cout << *i << " ";

    cout << endl << "第三种遍历方法：" << endl;
    for (i = v.begin(); i < v.end(); ++i) //用 < 比较两个迭代器
    cout << *i << " ";

    cout << endl << "第四种遍历方法：" << endl;
    i = v.begin();
    while (i < v.end()) 
    {
        cout << *i << " ";
        i += 2; // 随机访问迭代器支持 "+= 整数"  的操作
    }
}
```

## STL的精华——萃取（trait）

> 当函数，类或者一些封装的通用算法中的某些部分会因为数据类型不同而导致处理或逻辑不同（而我们又不希望因为数据类型的差异而修改算法本身的封装时），traits会是一种很好的解决方案。

函数参数列表接受两个迭代器，累加两个迭代器之间的数据，假定迭代器指向的数据类型是T，迭代器类型为Iter。

声明如下：

```cpp
template <typename Iter, typename T>
T sum(Iter begin, Iter end)
{
    T result {};
    while (begin != end) {
        result += *begin++;
    }
    return result;
}

int main( )
{
    vector<int> vi { 1, 2, 3, 4 };
    vector<string> vs { "ha", "sa", "ki" };

    int s = sum<vector<int>::iterator, int>(vi.begin(), vi.end());
    string s2 = sum<vector<string>::iterator, string>(vs.begin(), vs.end());
    return 0;
}
```

### 什么是萃取，为什么要萃取

有没有办法只用一个类型参数，就实现上面的函数？

```cpp
template <typename Iter>
typename Iter::value_type sum(Iter begin, Iter end)
{
    typename Iter::value_type result {};
    while (begin != end) {
        result += *begin++;
    }
    return result;
}
```

value_type就是属于迭代器的一个特性，迭代器可以随时随地获取到自己的特性，这个就是萃取。

```cpp
template<class Category, class T, class Distance = ptrdiff_t,
class Pointer = T*, class Reference = T&>
struct iterator
{
    typedef Category    iterator_category;
    typedef T            value_type;
    typedef Distance    difference_type;
    typedef Pointer        pointer;
    typedef Reference    reference;
};

template<class Iterator>
struct iterator_traits
{
    typedef typename Iterator::iterator_category    iterator_category;
    typedef typename Iterator::value_type            value_type;
    typedef typename Iterator::difference_type        difference_type;
    typedef typename Iterator::pointer                pointer;
    typedef typename Iterator::reference             reference;
};
```

迭代器类别、指向的数据类型都是萃取出来的特性。

## 无处不在的特化——为了提高性能无所不用其极

以下就对以数组指针作为迭代器实现的类型做了偏特化，指定迭代器类别为随机迭代器，这样就可以对这些数组指针使用专属于随机迭代器的方法。

```cpp
template<class T>
struct iterator_traits<T*>
{
    typedef random_access_iterator_tag     iterator_category;
    typedef T                             value_type;
    typedef ptrdiff_t                     difference_type;
    typedef T*                            pointer;
    typedef T&                             reference;
};
template<class T>
struct iterator_traits<const T*>
{
    typedef random_access_iterator_tag     iterator_category;
    typedef T                             value_type;
    typedef ptrdiff_t                     difference_type;
    typedef const T*                    pointer;
    typedef const T&                     reference;
};
```

对于不同的数据类型，copy的实现也是大不相同的，对于POD（Plain Old Data，普通旧数据，如int，char，double），memcpy就是最高效的copy方式，对于类对象可能要通过拷贝构造函数才能完整复制一个对象。那怎么针对不同的数据类型采用不同的方式拷贝方式呢？答案依然是特化。

```cpp
template<class InputIterator, class OutputIterator>
OutputIterator __copy(InputIterator first, InputIterator last, OutputIterator result, _true_type){
    auto dist = distance(first, last);
    memcpy(result, first, sizeof(*first) * dist);
    advance(result, dist);
    return result;
}
template<class InputIterator, class OutputIterator>
OutputIterator __copy(InputIterator first, InputIterator last, OutputIterator result, _false_type){
    while (first != last){
        *result = *first;
        ++result;
        ++first;
    }
    return result;
}
template<class InputIterator, class OutputIterator, class T>
OutputIterator _copy(InputIterator first, InputIterator last, OutputIterator result, T*){
    typedef typename TinySTL::_type_traits<T>::is_POD_type is_pod;
    return __copy(first, last, result, is_pod());
}
template <class InputIterator, class OutputIterator>
OutputIterator copy(InputIterator first, InputIterator last, OutputIterator result){
    return _copy(first, last, result, value_type(first));
}
template<>
inline char *copy(char *first, char *last, char *result){
    auto dist = last - first;
    memcpy(result, first, sizeof(*first) * dist);
    return result + dist;
}
template<>
inline wchar_t *copy(wchar_t *first, wchar_t *last, wchar_t *result){
    auto dist = last - first;
    memcpy(result, first, sizeof(*first) * dist);
    return result + dist;
}
```

### 内存拷贝函数memcpy

原型：void\*memcpy(void\*dest, const void*src,unsigned int count);

功能：由src所指内存区域复制count个字节到dest所指内存区域。  

说明：src和dest所指内存区域不能重叠，函数返回指向dest的指针。

## [参考STL源码](https://github.com/zouxiaohang/TinySTL.git)

这是一个简易版的STL实现，适用于初学者研究STL的设计思想。
