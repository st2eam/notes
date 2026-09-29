## 智能指针

### 指针的痛点

- 忘记delete，内存泄漏
- 野指针访问，行为未定义（内存访问异常）
- 多次delete，行为未定义

### [unique_ptr](http://c.biancheng.net/view/7909.html)

- 同一时刻只能有一个 unique_ptr 指向给对象
- unique_ptr 指针的生命周期从创建时开始，直到离开作用域。离开作用域时，若其指向对象，则其所指对象销毁
- unique_ptr 的使用能够包括：

1. 为动态申请的内存提供异常安全
2. 将动态申请内存的所有权传递给某个函数
3. 从某个函数返回动态申请内存的所有权
4. 在容器中保存指针
5. 所有auto_ptr具有的功能

```cpp
#include <iostream>
#include <memory>

int main() {
    {
        std::unique_ptr<int> uptr(new int(10));  //绑定动态对象
        //std::unique_ptr<int> uptr2 = uptr;  //不能賦值
        //std::unique_ptr<int> uptr2(uptr);  //不能拷貝
        std::unique_ptr<int> uptr2 = std::move(uptr); //轉換所有權
        uptr2.release(); //释放所有权
    }
    //超過uptr的作用域，內存釋放
}
```

### [shared_ptr](http://c.biancheng.net/view/7898.html)

- shared_ptr (共享资源的只能指针)被用来表示共享的拥有权。也就是说两段代码都需要访问一些数据，而他们又都没有独占该数据的所有权(从某种意义上来说就是该段代码负责销毁该对象)
- shared_ptr 是一种计数指针。当引用计数变为0时，shared_ptr所指向的对象就会被删除。
- 在给shared_ptr分配内存时建议使用 make_shared 函数，这样最安全

```cpp
#include <iostream>
#include <memory>

int main() {
    {
        int a = 10;
        std::shared_ptr<int> ptra = std::make_shared<int>(a);
        std::shared_ptr<int> ptra2(ptra); //copy
        std::cout << ptra.use_count() << std::endl;

        int b = 20;
        int *pb = &a;
        //std::shared_ptr<int> ptrb = pb;  //error
        std::shared_ptr<int> ptrb = std::make_shared<int>(b);
        ptra2 = ptrb; //assign
        pb = ptrb.get(); //获取原始指针

        std::cout << ptra.use_count() << std::endl;
        std::cout << ptrb.use_count() << std::endl;
    }
}
```

### [weak-ptr](http://c.biancheng.net/view/7918.html)

- 弱指针(weak pointer) ，指向一个已经用shared_ptr进行管理的对象
- 只有当对象存在的时候，才需要对其进行访问
- 可能被其他人删除释放，且在最后一次使用之后调用其析构函数(通常用于释放那些不具名的内存(anon-memory)资源
- weak_ptr可以保存一个“弱引用”，引用一个已经用shared_ptr管理的对象。为了访问这个对象一个weak_ptr可以通过shared_ptr的构造函数或者是weak_ptr的成员函数lock()转化为一个shared_ptr。当最后一个指向这个对象的shared_ptr退出其生命周期并且这个对象被释放之后,将无法从指向这个对象的weak_ptr获得一个shared_ptr指针,shared_ptr的构造函数会抛出异常，而weak_ptr::lock也会返回一个空指针。

```cpp
#include <iostream>
#include <memory>

int main() {
    {
        std::shared_ptr<int> sh_ptr = std::make_shared<int>(10);
        std::cout << sh_ptr.use_count() << std::endl;

        std::weak_ptr<int> wp(sh_ptr);
        std::cout << wp.use_count() << std::endl;

        if(!wp.expired()){
            std::shared_ptr<int> sh_ptr2 = wp.lock(); //get another shared_ptr
            *sh_ptr = 100;
            std::cout << wp.use_count() << std::endl;
        }
    }
    //delete memory
}
```

### 智能指针的痛点

- 使用场景复杂
- 原生指针、智能指针混用的坑
- 无法杜绝原生指针的使用
  - 历史代码
  - 跨模块使用方式
- 其他原因
- 总结：没有在语言级别解决问题

### 指针使用

```cpp
    //unique_ptr ---管理独占对象
    unique_ptr<int> foo(new int(5));
    cout << foo << endl;
    foo.reset(new int(6));
    cout << foo << endl;
    auto foo1 = make_unique<int>(*foo);
    cout << foo1 << endl;
    foo.release();
    cout << foo << endl;
    cout << endl;
    //shared_ptr ---管理的对象可以共享
    shared_ptr<int> foo2(new int(6));
    cout << "foo2.use_count(): \t"<<foo2.use_count() << endl;
    shared_ptr<int> foo3(foo2);
    cout << "foo2.use_count(): \t" << foo2.use_count() << endl;
    auto foo4 = make_shared<int>(5);
    cout << "foo4.unique(): \t\t" << foo4.unique() << endl;
    foo4 = move(foo2);
    cout << "foo2.use_count(): \t" << foo2.use_count() << endl;
    cout << "foo4.use_count(): \t" << foo4.use_count() << endl;
    cout << "foo4.unique(): \t\t" << foo4.unique() << endl;
    foo4.~shared_ptr();
    cout << "foo4.use_count(): \t" << foo4.use_count() << endl;
    cout << "foo3.use_count(): \t" << foo3.use_count() << endl;
    foo3.~shared_ptr();
    cout << "foo4.use_count(): \t" << foo4.use_count() << endl;
    cout << "foo3.use_count(): \t" << foo3.use_count() << endl;
    cout << endl;
    //weak_ptr ---指向一个已经用shared_ptr进行管理的对象
    shared_ptr<int> foo5(new int(6));
    cout << "foo5.use_count(): \t" << foo5.use_count() << endl;
    weak_ptr<int> foo6(foo5);
    cout << "foo5.use_count(): \t" << foo5.use_count() << endl;
    cout << "foo6.use_count(): \t" << foo6.use_count() << endl;
    auto foo7(foo5);
    cout << "foo5\t\t\t" << foo5 << endl;
    cout << "foo6.lock()\t\t" << foo6.lock() << endl;
    cout << "foo6.use_count(): \t" << foo6.use_count() << endl;
    foo5.reset();
    cout << "foo6.expired()\t\t" << foo6.expired() << endl;
    cout << "foo6.lock()\t\t" << foo6.lock() << endl;
    cout << "foo6.use_count(): \t" << foo6.use_count() << endl;
    foo7.reset();
    cout << "foo6.expired()\t\t" << foo6.expired() << endl;
    cout << "foo6.lock()\t\t" << foo6.lock() << endl;
    cout << "foo6.use_count(): \t" << foo6.use_count() << endl;
```

运行结果：

```cpp
00E44CB8
00E44CE8
00E44CB8
00000000

foo2.use_count():       1
foo2.use_count():       2
foo4.unique():          1
foo2.use_count():       0
foo4.use_count():       2
foo4.unique():          0
foo4.use_count():       1
foo3.use_count():       1
foo4.use_count():       -572662307
foo3.use_count():       -572662307

foo5.use_count():       1
foo5.use_count():       1
foo6.use_count():       1
foo5                    00E44D18
foo6.lock()             00E44D18
foo6.use_count():       2
foo6.expired()          0
foo6.lock()             00E44D18
foo6.use_count():       1
foo6.expired()          1
foo6.lock()             00000000
foo6.use_count():       0
```

### 手写shared_ptr

可能有些不完善

```cpp
#include <iostream>
using namespace std;

template <class T>
void Swap(T& t1, T& t2)
{
    T temp;
    temp = t1;
    t1 = t2;
    t2 = temp;
}
class Shared_count {
public:
    Shared_count()
    {
        count = 0;
    }
    void add_count() // 增加计数
    {
        count++;
    }
    void reduce_count() // 减少计数
    {
        count--;
    }
    int get_count() const // 获取当前计数
    {
        return count;
    }
    operator int()
    {
        return count;
    }
private:
    int count;
};

template<typename T>
class Shared_ptr {
public:
    Shared_ptr(T* pointer = nullptr) noexcept //用普通指针构造智能指针
    {
        this->ptr = pointer;
        count = new Shared_count();
        if (pointer)
        {
            count->add_count();
        }
    }
    Shared_ptr(const Shared_ptr<T>& pointer)//用智能指针构造智能指针
    {
        this->ptr = pointer.ptr;
        this->count = pointer.count;
        count->add_count();
    }
    ~Shared_ptr() noexcept  // ptr不为空且此时共享计数减为0的时候,再去删除
    {
        count->reduce_count();
        if (ptr && !count->get_count()) 
        {
            delete ptr;
            delete count;
        }
    }

    // 重载->操作符
    T* operator->()const
    {
        return ptr;
    }
    // 重载*操作符
    T& operator*() const 
    {
        return ptr;
    }
    T* get()
    {
        return ptr;
    }
    operator bool()
    {
        if (ptr != nullptr)
            return true;
        else
            return false;
    }
    void swap(Shared_ptr& sp)
    {
        Swap(this->ptr,sp.ptr);
        Swap(this->count, sp.count);
    }
    bool unique()const
    {
        if (count->get_count())
            return false;
        else
            return true;
    }
    void reset(T* pointer = nullptr)
    {
        this->ptr = pointer;
        count = new Shared_count();
        if (pointer)
        {
            count->add_count();
        }
    }
    int use_count()
    {
        return count->get_count();
    }
    Shared_ptr& operator=(const Shared_ptr<T>& pointer)
    {
        if (this != &pointer)// 判断是否自赋值
        {
            this->count = pointer.count;
            this->ptr = pointer.ptr;
            count->add_count();
        }
        return *this;
    }
    friend ostream& operator<<(ostream& output, const Shared_ptr& S)
    {
        output << ptr;
        return ptr;
    }

private:
    T* ptr;
    Shared_count* count;
};
```
