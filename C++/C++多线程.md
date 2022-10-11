## 睡眠排序法

```cpp
// Created on Apple Pencil.

#include <iostream>
#include <Windows.h>
#include <thread>
using namespace std;
#define max(a,b)  a>b? a:b;

void sleepsort(int i)
{
    Sleep(i*100);
    cout << i << ",";
}
int main() {

    int item[] = { 10,1,3,4,9,4,2,5,3,20};
    int Max = item[0];
    for (int i = 0; i < sizeof(item) >> 2; i++)
    {
        Max = max(Max, item[i]);
    }
    for (int i = 0; i < 10; i++)
    {
        thread test(sleepsort,item[i]);
        test.detach();
    }
    Sleep(Max*110);
    return 0;
}
```

## C++多线程

- 创建一个线程，不做处理会调用abort函数终止程序
- ```join()```函数加入，汇合线程,阻塞主线程,等待子线程执行结束，才会回到主线程中
- 一个线程只能join一次
- ```detach()```函数 分离，打破依赖关系,把子线程驻留后台
- 当线程detach之后，就不能再join了
- ```joinable()```判断当前进程是否可以做join或者detach过程，可以则返回true，不可以则返回false
  
#### 多线程的创建

```cpp
#include <iostream>
#include <thread>
#include<Windows.h>
using namespace std;

//线程处理函数
void print_1()
{
    Sleep(1000);
    cout << "--子线程1运行--" << endl;
}
void print_2()
{
    Sleep(1000);
    cout << "--子线程2运行--" << endl;
}
void print_3()
{
    Sleep(5000);
    cout << "--子线程3运行--" << endl;
}

class thr
{
public:

    void operator ()()
    {
        Sleep(1000);
        cout << "--子线程thr运行--" << endl;
    }
};
int main()
{

    //创建线程
    thread test(print_1);

    test.join();

    thread test_2(print_2);
    test_2.join();

    thread test_3(print_3);
    test_3.detach();

    thr th;
    thread test_4(th);
    test_4.join();

    auto lambdathread = []
    {
        Sleep(1000);
        cout << "--lambda线程运行--" << endl;
    };
    thread test_5(lambdathread);
    test_5.join();

    Sleep(1000);
    if (test_3.joinable())
    {
        test_3.detach();
    }
    else {
        cout << "子线程3已被处理" << endl;
    }
    Sleep(1000);
    cout << "--主线程运行--" << endl;
    return 0;
}
}
```

vector容器装载线程

```cpp
#include <iostream>
#include <Windows.h>
#include <vector>
#include <thread>
#include <mutex>
using namespace std;

void myprint(int i)
{
    cout <<"--thread_num:"<< i <<endl;
}
int main() 
{
    cout << "--主线程执行--" << endl;
    vector <thread> mythreads;

    for (int i = 0; i < 10; i++)
    {
        mythreads.push_back(thread(myprint, i));
        //mythreads[i].join();
    }

    for (auto tp = mythreads.begin(); tp != mythreads.end(); ++tp)
    {
        //cout << tp->get_id() << endl;
        tp->join();
    }
    cout << "--主线程结束--" << endl;
    return 0;
}
```

### 互斥量mutex

- 互斥量是个类对象，理解成一把锁，多个线程尝试用lock()成员函数来加锁这个锁，只有一个线程能够锁定成功，成功的标志是lock()函数返回
- 如果没锁成功，那么流程会卡在lock()这里不断地尝试去锁
- 互斥量使用时要注意，保护数据要合适，少了没达到保护效果，多了影响效率

#### 互斥量的用法

- 步骤：先lock(),操作共享数据，再unlock();
- lock()和unlock()要一对一成对使用，每调用一次lock()必然调用一个unlock()
- std::lock_guard类模板：忘记unlock不要紧，guard帮你unlock()
- 智能指针(unique_ptr<>)：你忘记释放内存不要紧，ta也帮你释放
- std::lock_guard 可以取代lock()和unlock(),就是使用了lock_guard之后，不能使用lock()和unlock()之中任何一个

> 原理：

- lock_guard构造函数里执行了mutex::lock()
- lock_guard析构函数里执行了mutex::unlock()

```cpp
std::lock_guard<std::mutex> my_guard(my_mutex);
```

```cpp
// Created on Apple Pencil.

#include <iostream>
#include <Windows.h>
#include <vector>
#include <thread>
#include <list>
#include <mutex>
using namespace std;

list <int> DataQueue;

class mythread {
public:
    void indata()
    {
        for (int i = 0; i < 10000; i++)
        {
            cout << __FUNCTION__"执行，插入数据" <<i<< endl;
            lock_guard<mutex> myguard(mymutex);
            //mymutex.lock();
            DataQueue.push_back(i);
            //mymutex.unlock();
        }
    }
    void outdata()
    {
        for (int i = 0; i < 10000; i++)
        {
            if (!DataQueue.empty())
            {
                cout << __FUNCTION__"执行，读出数据" << i << endl;
                mymutex.lock();
                int command = DataQueue.front();
                DataQueue.pop_front();
                mymutex.unlock();
            }
            else
            {
                cout << __FUNCTION__"继续执行，但消息队列为空" << i << endl;
            }
        }
    }
private:
    mutex mymutex;//创建了一个互斥量
};
int main() 
{
    mythread mt;
    thread myindata(&mythread::indata,&mt);
    thread myoutdata(&mythread::outdata, &mt);
    myindata.join();
    myoutdata.join();
    cout << "--主线程结束--" << endl;
    return 0;
}
```

## 死锁

- 死锁前提条件是要有两把锁（两个互斥量）
- 现有两个线程A、B，两把锁1、2

1. 线程A执行的时候，线程先锁1.lock()成功,然后去执行2.lock()[未锁]
2. 出现了上下文切换
3. 线程B执行了，但是这个线程先锁2.lock()了，因为此时2.lock还没有被锁，所以2.lock()成功，线程B要去执行1.lock()
4. 此时此刻，死锁产生了
5. 线程A因为拿不到2.lock(),流程走不下去，所以1.不能unlock()
6. 线程B因为拿不到1.lock(),流程走不下去，所以2.不能unlock()

### 死锁的一般解决方案

只要保证这两个互斥量上锁的顺序一致就不会死锁

### std::lock()函数模板

`std::lock(my_mutex1,my_mutex2);`

- 一次锁住两个或以上的互斥量
- 不存在因为多个线程中因为锁的顺序问题产生的死锁
- 如果互斥量中有一个没锁住，它就在那等着，等到所有的互斥量都锁柱，它才会继续往下走(返回)
- 要么两个互斥量都锁柱，要么都没锁柱。如果只锁了一个，另外一个没锁成功，则它立即把已经锁住的解锁

### std::adopt_lock

- std::adopt_lock是个结构体对象,起标记作用，表示这个互斥量已经lock(),不需要在std::lock_guard<std::mutex>里面对对象进行再次lock()了;

```cpp
std::lock_guard<mutex> my_guard1(my_mutex1,std::adopt_lock);
std::lock_guard<mutex> my_guard2(my_mutex2,std::adopt_lock);
```

### Read_Write

> 读者写者是一个非常著名的同步问题。读者写者问题描述非常简单，有一个写者很多读者，多个读者可以同时读文件，但写者在写文件时不允许有读者在读文件，同样有读者在读文件时写者也不去能写文件。

```cpp
#include<iostream>
#include<Windows.h>
#include<queue>
#include<list>
#include<mutex>
#include<thread>
using namespace std;

mutex Write_mutex;
list<char> buffer_area;
queue<int> Read_queue;//读者队列

void Write()
    {
    while (1)
        {
            if (Read_queue.empty())//如果读者队列为空，写者才能开始写
*            {
*                cout << "写者写文件" << endl;
                Write_mutex.lock();//写者写的时候上锁，读者不能读
                buffer_area.push_back('#');
                Write_mutex.unlock();//写完解锁
            }
        }
    }
void Read(int k)
    {
    while (1)
        {
            cout << "读者" << k << "读文件" << buffer_area.size() << endl;
            int *q = new int(1);
            Read_queue.push(*q);//加入读者队列
            Write_mutex.lock();//读者读时上锁
            Write_mutex.unlock();//读完解锁
            delete q;
            Read_queue.pop();//读完退出读者队列
        }
    }

int main()
{
    //可以添加读者
    thread myReader1(Read,1);//读者1
    thread myReader2(Read,2);//读者2
    thread myReader3(Read,3);//读者3
    thread myWriter(Write);

    myWriter.detach();
    myReader1.detach();
    myReader2.detach();
    myReader3.detach();
    Sleep(1000);
    return 0;
}
```
