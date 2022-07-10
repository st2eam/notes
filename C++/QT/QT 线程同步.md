## 线程同步

#### 原子访问

所谓原子访问，指的是一个线程在访问某个资源的同时能够保证没有其他线程会在同一时刻访问同一资源。

示例：

```
long g_x=0;
DWORD WINAPI ThreadFun1(PVOID pvParam)
{
    g_x++;
    return 0;
}

DWORD WINAPI ThreadFun2(PVOID pvParam)
{
    g_x++;
    return 0;
}
```

两个线程运行完 g_x是等于2吗？

正确做法： 使用原子函数改进

```
long g_x=0;
DWORD WINAPI ThreadSafeFun1(PVOID pvParam)
{
    InterlockedExchangeAdd(&g_x,1);
    return 0;
}
DWORD WINAPI ThreadSafeFun2(PVOID pvParam)
{
    InterlockedExchangeAdd(&g_x,1);
    return 0;
}
```

代码示例

```
/*
 *  原子操作
 */

#include <Windows.h>
#include <iostream>

long g_x = 0;
long g_thread_safe_x = 0;
const int g_loop = 100000;

DWORD WINAPI ThreadFun1(PVOID pvParam)
{
    for (int i = 0; i < g_loop; i++) {
        g_x++;
    }
    return 0;
}


DWORD WINAPI ThreadFun2(PVOID pvParam)
{
    for (int i = 0; i < g_loop; i++) {
        g_x++;
    }
    return 0;
}

//线程安全函数
DWORD WINAPI ThreadSafeFun1(PVOID pvParam)
{
    for (int i = 0; i < g_loop; i++) {
        InterlockedExchangeAdd(&g_thread_safe_x, 1);
    }
    return 0;
}


DWORD WINAPI ThreadSafeFun2(PVOID pvParam)
{
    for (int i = 0; i < g_loop; i++) {
        InterlockedExchangeAdd(&g_thread_safe_x, 1);
    }
    return 0;
}

int main()
{
    //创建线程
    HANDLE hThread1 = CreateThread(NULL, 0, ThreadFun1, NULL, 0, NULL);
    HANDLE hThread2 = CreateThread(NULL, 0, ThreadFun2, NULL, 0, NULL);

    HANDLE hSafeThread1 = CreateThread(NULL, 0, ThreadSafeFun1, NULL, 0, NULL);
    HANDLE hSafeThread2 = CreateThread(NULL, 0, ThreadSafeFun2, NULL, 0, NULL);

    //等待线程运行结束
    WaitForSingleObject(hThread1, INFINITE);
    WaitForSingleObject(hThread2, INFINITE);

    WaitForSingleObject(hSafeThread1, INFINITE);
    WaitForSingleObject(hSafeThread1, INFINITE);

    //打印结果
    std::cout << "g_x = " << g_x << std::endl;
    std::cout << "g_thread_safe_x = " << g_thread_safe_x << std::endl;

    //关闭句柄
    CloseHandle(hThread1);
    CloseHandle(hThread2);

    CloseHandle(hSafeThread1);
    CloseHandle(hSafeThread2);

    return 0;
}
```

#### 关键代码段

关键段(Critical Section)是一小段代码，它在执行之前需要独占一些共享资源的访问权。这里的原子方式是代码除了当前线程之外，没有其他任何线程会同时访问该资源。当然系统仍然可以暂停当前线程去调度其他线程。但是在当前线程离开关键段之前，系统是不会去调度任何想要访问统一资源的其他线程的。

关键代码段的使用：

```
CRITICAL_SECTION g_cs;

EnterCriticalSection(&g_cs);
//... 处理公共资源代码
LeaveCriticalSection(&g_cs);
```

代码示例

```
/**
 * @brief 关键代码段
 */

#include <Windows.h>
#include <iostream>

DWORD g_cnt1 = 0;
DWORD g_cnt2 = 0;
CRITICAL_SECTION g_cs;
const int g_loop = 100000;

DWORD WINAPI FirstThread(PVOID pvParam)
{
    for (int i = 0; i < g_loop; i++) {
        g_cnt1++;
        EnterCriticalSection(&g_cs);
        g_cnt2++;
        LeaveCriticalSection(&g_cs);
    }
    return 0;
}

DWORD WINAPI SecondThread(PVOID pvParam)
{
    for (int i = 0; i < g_loop; i++) {
        g_cnt1++;
        EnterCriticalSection(&g_cs);

        g_cnt2++;
        LeaveCriticalSection(&g_cs);
    }
    return 0;
}

int main()
{
    //初始化cs
    InitializeCriticalSection(&g_cs);

    //创建线程
    HANDLE hThread1 = CreateThread(NULL, 0, FirstThread, NULL, 0, NULL);
    HANDLE hThread2 = CreateThread(NULL, 0, SecondThread, NULL, 0, NULL);

    //等待线程运行结束
    WaitForSingleObject(hThread1, INFINITE);
    WaitForSingleObject(hThread2, INFINITE);

    //打印结果
    std::cout << "g_cnt1 = " << g_cnt1 << ", g_cnt2 = " << g_cnt2 << std::endl;

    //关闭句柄
    CloseHandle(hThread1);
    CloseHandle(hThread2);

    //清除cs
    DeleteCriticalSection(&g_cs);

    return 0;
}
```

#### 关键段与旋转锁

 当一个线程试图进入一个关键段，但这个关键段正被另一个线程占用的时候，函数会立即把调用线程切换到等待状态。这意味着线程必须从用户模式切换到内核模式（大于1000个CPU周期），这个切换的开销非常大。在配有多处理器的机器上，当前占用资源的线程可能在另一个处理器上运行，而且可能很快就会结束对资源的访问。事实上，在需要等待的线程完全切换到内核模式之前，占用资源的线程可能就已经释放了资源。如果发生这种情况的话，那么会浪费大量的cpu时间。

 为了提高关键段的性能，Microsoft把旋转锁合并到了关键段中，因此，当调用EnterCriticalSection的时候，它会用一个旋转锁不断的循环，尝试在一段时间内获得对象的资源的访问权。只有当尝试失败的时候，线程才会切换到内核模式并进入等待状态。

使用旋转锁之前必须调用 InitializeCriticalSectionAndSpinCount 来初始化。在单处理器上，旋转次数始终为0。

```
BOOL InitializeCriticalSectionAndSpinCount(
    PCRITICAL_SECTION pcs,//关键段结构的地址    
    DWORD dwSpinCount//旋转锁循环的次数
);
```

## 用内核对象进行线程同步

#### 常见内核对象：

访问令牌、事件对象、文件对象、文件映射对象、IO完成端口对象、作业、邮件槽、互斥量、匿名管道、命名管道、进程、线程、信号量

#### 事件内核对象

所有内核对象里面事件内核对象是最简单的一个，它包括一个使用计数，还有两个布尔值。一个布尔值用来表示事件是手动重置事件还是自动重置事件，另一个布尔值表示当前是否处于触发状态。

当一个手动重置事件被触发的时候，所有等待该事件的线程都能变成调度状态。而一个自动重置事件被触发的时候，等待该事件的线程里面只有一个会变成调度状态。

创建一个事件的函数原型如下：

```
HANDLE WINAPI CreateEvent(
  __in_opt  LPSECURITY_ATTRIBUTES lpEventAttributes,//安全描述符
  __in      BOOL bManualReset,//TRUE-手动重置，FALSE-自动重置
  __in      BOOL bInitialState,//TRUE-事件是触发状态，FALSE-事件是未触发状态
  __in_opt  LPCTSTR lpName//事件名字
);
```

一旦事件已经创建，就可以直接控制它的状态

将事件改为触发状态

```
BOOL SetEvent(HANDLE hEvent);
```

将该事件改为未触发状态

```
BOOL ResetEvent(HANDLE hEvent);
```

使得事件变为触发状态，然后立即又变为未触发状态，通知一次

```
BOOL PulseEvent(HANDLE hEvent);
```

代码示例

```
/**
 * @brief 事件内核对象
 */

#include <Windows.h>
#include <iostream>

HANDLE hEvent;//全局事件

DWORD WINAPI ThreadFun1(LPVOID pvParam)
{
    std::cout << "ThreadFun1 waiting ..." << std::endl;
    //等待事情触发
    WaitForSingleObject(hEvent, INFINITE);    
    //do something


    SetEvent(hEvent);

    std::cout << "ThreadFun1 done" << std::endl;

    return 0;
}

DWORD WINAPI ThreadFun2(LPVOID pvParam)
{
    std::cout << "ThreadFun2 waiting ..." << std::endl;
    //等待事情触发
    WaitForSingleObject(hEvent, INFINITE);    
    //do something


    SetEvent(hEvent);
    std::cout << "ThreadFun2 done" << std::endl;

    return 0;
}

int main(int argc, char* argv[])
{
    //创建事件内核对象  (手动设置，未触发状态)
    hEvent = CreateEvent(NULL, TRUE, FALSE, NULL);

    //创建线程
    HANDLE hThread[2];
    hThread[0] = CreateThread(NULL, 0, ThreadFun1, 0, 0, NULL);
    hThread[1] = CreateThread(NULL, 0, ThreadFun2, 0, 0, NULL);

    Sleep(3000);

    //设置为触发状态
    SetEvent(hEvent);

    //等待线程结束
    WaitForMultipleObjects(2, hThread, TRUE, INFINITE);

    //关闭事件句柄
    CloseHandle(hEvent);

    //关闭线程句柄
    for (int i = 0; i < 2; ++i) {
        CloseHandle(hThread[i]);
    }

    return 0;
}
```

#### WaitForSingleObject和WaitForMultipleObjects函数

在多线程的情况下，有时候我们会希望等待某一线程完成了再继续做其他事情，要实现这个目的，可以使用Windows API函数WaitForSingleObject，或者WaitForMultipleObjects。这两个函数都会等待Object被标为有信号(signaled)时才返回的。

那么，信号是什么呢？假设这里存在一个文件和两个线程，我们规定这个文件同一时刻只能被一个线程所访问打开，那么我们的线程该如何知道这个文件现在有没有被别的线程访问呢？我们可以让线程等在一个死循环里，这个循环之一在尝试打开访问这个文件，直到能够打开为止；这样做虽然可以实现目的，但是死循环会占用大量的内存，所以windows就设置了信号量。

信号量的作用简单理解就是一个标志位，在我们上述的问题中，这个文件就有一个信号量，初始时我们设信号量为FALSE，而只有当信号量为FALSE时线程才可以打开访问这个文件。那么，当第一个线程到达，信号量为FALSE，线程打开文件进行访问，并将信号量置为TRUE；在第一个线程在访问文件时，第二个线程到来，此时信号量仍未TRUE，所以第二个线程等待，这个等待的过程就是WaitForSingleObject。WaitForSingleObject在等待的过程中会进入一个非常高效的沉睡等待状态，只占用极少的CPU时间片。

1. **函数原型**  
   DWORD WaitForSingleObject( HANDLE hHandle, DWORDdwMilliseconds);
   有两个参数，分别是THandle和Timeout(毫秒单位)。
   如果想要等待一条线程，那么你需要指定线程的Handle，以及相应的Timeout时间。当然，如果你想无限等待下去，Timeout参数可以指定系统常量INFINITE。

2. **使用对象**  
   它可以等待如下几种类型的对象：
   Event，Mutex，Semaphore，Process，Thread 

3. **返回类型**  
   有三种返回类型：
   WAIT_OBJECT_0, 表示等待的对象有信号（对线程来说，表示执行结束）；
   WAIT_TIMEOUT, 表示等待指定时间内，对象一直没有信号（线程没执行完）；
   WAIT_ABANDONED 表示对象有信号，但还是不能执行 一般是因为未获取到锁或其他原因

#### 信号量内核对象

信号量内核对象用来对资源进行计数。与其他所有内核对象相同，它们也包含一个使用计数，另外还包括两个32位值：一个最大资源计数和一个当前资源计数。最大资源计数表示信号量可以控制的最大资源数量，当前资源计数表示信号量当前可用资源的数量。

    信号量的规则如下：

    ①如果当前资源计数大于0，那么信号量处于触发状态

    ②如果当前资源计数等于0，那么信号量处于未触发状态

    ③系统绝对不会让当前资源计数变为负数

    ④当前资源计数绝对不会大于最大资源计数

**创建一个信号量内核对象**

```
HANDLE CreateSemaphore(
　LPSECURITY_ATTRIBUTES lpSemaphoreAttributes, // 安全属性指针
　LONG lInitialCount, // 初始计数
　LONG lMaximumCount, // 最大计数
　LPCTSTR lpName // 对象名指针
);
```

**打开在其他进程中创建的信号量**

```
HANDLE OpenSemaphore(
　DWORD dwDesiredAccess, // 访问标志
　BOOL bInheritHandle, // 继承标志
　LPCTSTR lpName // 信号量名
);
```

**在线程离开对共享资源的处理时，释放信号量**

```
BOOL ReleaseSemaphore(
　HANDLE hSemaphore, // 信号量句柄
　LONG lReleaseCount, // 计数递增数量
　LPLONG lpPreviousCount // 先前计数
);
```

代码示例

```
/**
 * @brief 信号量内核对象
 */

#include <Windows.h>
#include <iostream>

 //全局信号量对象句柄
HANDLE hSemaphore;

DWORD WINAPI ThreadFun1(LPVOID pvParam)
{
    //等待事情触发
    WaitForSingleObject(hSemaphore, INFINITE);
    std::cout << "ThreadFun1 active and sleep 3s " << std::endl;
    Sleep(3000);
    // 释放信号量计数
    ReleaseSemaphore(hSemaphore, 1, NULL);
    std::cout << "ThreadFun1 done and release" << std::endl;

    return 0;
}

DWORD WINAPI ThreadFun2(LPVOID pvParam)
{
    //等待事情触发
    WaitForSingleObject(hSemaphore, INFINITE);
    std::cout << "ThreadFun2 active and sleep 5s " << std::endl;
    Sleep(5000);
    // 释放信号量计数
    ReleaseSemaphore(hSemaphore, 1, NULL);
    std::cout << "ThreadFun2 done and release" << std::endl;

    return 0;
}

DWORD WINAPI ThreadFun3(LPVOID pvParam)
{
    //等待事情触发
    WaitForSingleObject(hSemaphore, INFINITE);
    std::cout << "ThreadFun3 active and sleep 7s " << std::endl;
    Sleep(7000);
    // 释放信号量计数
    ReleaseSemaphore(hSemaphore, 1, NULL);
    std::cout << "ThreadFun3 done and release" << std::endl;

    return 0;
}

DWORD WINAPI ThreadFun4(LPVOID pvParam)
{
    //等待事情触发
    WaitForSingleObject(hSemaphore, INFINITE);
    std::cout << "ThreadFun4 active and sleep 9s " << std::endl;
    Sleep(9000);
    // 释放信号量计数
    ReleaseSemaphore(hSemaphore, 1, NULL);
    std::cout << "ThreadFun4 done and release" << std::endl;

    return 0;
}

int main(int argc, char* argv[])
{
    // 创建信号量对象(最大资源为2， 当前可用资源为2)
    hSemaphore = CreateSemaphore(NULL, 2, 2, NULL);

    //创建线程
    HANDLE hThread[4];
    hThread[0] = CreateThread(NULL, 0, ThreadFun1, 0, 0, NULL);
    hThread[1] = CreateThread(NULL, 0, ThreadFun2, 0, 0, NULL);
    hThread[2] = CreateThread(NULL, 0, ThreadFun3, 0, 0, NULL);
    hThread[3] = CreateThread(NULL, 0, ThreadFun4, 0, 0, NULL);

    //等待线程结束
    WaitForMultipleObjects(4, hThread, TRUE, INFINITE);

    //关闭事件句柄
    CloseHandle(hSemaphore);

    //关闭线程句柄
    for (int i = 0; i < 4; ++i) {
        CloseHandle(hThread[i]);
    }

    return 0;
}
```

#### 互斥量内核对象

 互斥量内核对象用来确保一个线程独占对一个资源的访问。互斥量包含了一个使用计数、线程ID和一个递归计数。互斥量和关键段的行为完全相同。但是互斥量是内核对象，而关键段是用户模式下的同步对象。

线程ID用来标识当前占用这个互斥量的是系统中的哪个线程，递归计数表示这个线程占用该互斥量的次数。互斥量有很多用途，它们是使用最为频繁的内核对象之一。它们一般用来对多个线程访问的同一块内存进行保护。互斥量可以确保正在访问内存块的任何线程独占对内存块的访问权，这样就维护了数据的完整性。互斥量只能用于互斥，不能用于同步。

互斥量的使用规则：

- 如果线程ID为0 （无效线程ID），那么该互斥量不为任何线程所占用，它处于触发状态。可以理解为：无人使用，即触发。
- 如果线程ID为非零值，那么有一个线程已经占用了该互斥量，他处于未触发状态。
- 与所有其他内核对象不同，操作系统对互斥量进行了特殊处理，允许他们违反一些常规的规则。

**创建互斥量**

```
HANDLECreateMutex(
  LPSECURITY_ATTRIBUTES lpMutexAttributes,
  BOOL bInitialOwner,     
  LPCTSTR lpName
);
```

第一个参数表示安全控制，一般直接传入NULL。

第二个参数用来确定互斥量的初始拥有者。
如果传入TRUE表示互斥量对象内部会记录创建它的线程的线程ID号并将递归计数设置为1，由于该线程ID非零，所以互斥量处于未触发状态。
如果传入FALSE，那么互斥量对象内部的线程ID号将设置为NULL，递归计数设置为0，这意味互斥量不为任何线程占用，处于触发状态。

第三个参数用来设置互斥量的名称，在多个进程中的线程就是通过名称来确保它们访问的是同一个互斥量。

**打开互斥量**

```
HANDLEOpenMutex(
 DWORD dwDesiredAccess,//访问权限
 BOOL bInheritHandle,//继承标志
 LPCTSTR lpName //名称
);
```

**触发互斥量**

```
BOOL ReleaseMutex (HANDLE hMutex)
```

访问互斥资源前应该要调用等待函数，结束访问时就要调用ReleaseMutex()来表示自己已经结束访问，其它线程可以开始访问了

**清理互斥量**

```
BOOL CloseHandle(HANDLE hObject);
```

代码实例

```
/**
 * @brief 互斥锁内核对象
 */

#include <Windows.h>
#include <iostream>

#define  THREAD_NUM 10

HANDLE hMutex;//全局互斥锁句柄
int g_x = 0;

DWORD WINAPI ThreadFun(LPVOID pvParam)
{
    //等待事情触发
    DWORD threadid = GetCurrentThreadId();
    WaitForSingleObject(hMutex, INFINITE);
    std::cout << "Thread enter: " << threadid << std::endl;
    Sleep(2000);
    g_x++;
    std::cout << "Thread leave: g_x= " << g_x << "thread id:" << threadid << std::endl;  //执行ReleaseMutex后，离开互斥资源
                                                 //是否互斥锁对象
    ReleaseMutex(hMutex);
    return 0;
}

int main(int argc, char* argv[])
{
    //创建互斥锁内核对象  (处于触发状态)
    hMutex = CreateMutex(NULL, FALSE, NULL);

    //创建线程
    HANDLE hThread[THREAD_NUM];
    for (int i = 0; i < THREAD_NUM; i++) {
        hThread[i] = CreateThread(NULL, 0, ThreadFun, (PVOID)&i, 0, NULL);
    }

    //等待线程结束
    WaitForMultipleObjects(THREAD_NUM, hThread, TRUE, INFINITE);

    //关闭事件句柄
    CloseHandle(hMutex);

    //关闭线程句柄
    for (int i = 0; i < THREAD_NUM; ++i) {
        CloseHandle(hThread[i]);
    }

    return 0;
}
```

由于互斥量是内核对象，因此使用CloseHandle()就可以（这一点所有内核对象都一样）

#### 其它内核对象

- 进程
- 线程

## Qt线程同步

#### QMutex、QMutexLocker

QMutex类提供了一个保护一段临界区代码的方法，他每次只允许一个线程访问这段临界区代码。QMutex::lock()函数用来锁住互斥量，如果互斥量处于解锁状态，当前线程就会立即抓住并锁定它；否则当前线程就会被阻塞，直到持有这个互斥量的线程对其解锁。线程调用lock()函数后就会持有这个互斥量直到调用unlock()操作为止。QMutex还提供了一个tryLock()函数，如果互斥量已被锁定，就立即返回。

Qt提供了QMutexLocker类何以简化互斥量的处理，它在构造函数中接受一个QMutex对象作为参数并将其锁定，在析构函数中解锁这个互斥量。

示例1：

```
QMutex mutex; 
mutex.lock();
... 临界区代码
mutex.unlock();//容易忘记或者走到其它分支
```

示例2：

```
QMutex   mutex; 
{
    QMutexLocker locker(&mutex);
    ... 临界区代码
}
```

代码实例

```
#include <QCoreApplication>
#include <QDebug>
#include <QMutex>
#include <QMutexLocker>
#include <QThread>

int g_x = 0;
int g_loop = 100000;
QMutex g_mutex;


void threadFunc1(){
    g_mutex.lock();     //QMutexLocker locker(&g_mutex);
    for(int i = 0; i < g_loop; i++){
        g_x++;
    }
    g_mutex.unlock();
}

void threadFunc2(){
    g_mutex.lock();
    for(int i = 0; i < g_loop; i++){
        g_x++;
    }
    g_mutex.unlock();
}

typedef void (*ThreadBodyFunc)();

class Mythread : public QThread
{
public:
    explicit Mythread(ThreadBodyFunc func, QObject *parent = nullptr)
        : QThread(parent), m_func(func)
    {

    }

protected:
    void run() override
    {
        if(m_func){
            m_func();
        }
    }

private:
    ThreadBodyFunc m_func;

};

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    //创建线程
    Mythread thread1(threadFunc1, &a);
    Mythread thread2(threadFunc1, &a);

    //启动线程
    thread1.start();
    thread2.start();

    //等待线程结束
    thread1.wait();
    thread2.wait();

    qDebug() << "g_x = " << g_x;

    return a.exec();
}
```

#### QSemphore

Qt中的信号量是由QSemaphore类提供的，信号量可以理解为互斥量功能的扩展，互斥量只能锁定一次而信号量可以获取多次，它可以用来保护一定数量的同种资源。

acquire(n)函数用于获取n个资源，当没有足够的资源时调用者将被阻塞直到有足够的可用资源。release(n)函数用于释放n个资源。

QSemaphore类还提供了一个tryAcquire(n)函数，在没有足够的资源是该函数会立即返回。
一个典型的信号量应用程序是在两个线程间传递一定数量的数据(DataSize)，而这两个线程使用一定大小(BufferSize)的共享循环缓存(生产者-消费者模型)

临界区资源

```
QSemaphore freeSpace(BufferSize);  
QSemaphore usedSpace(0);
```

生产者：

```
freeSpace.acquire();
...生产
usedSpace.release();
```

消费者：

```
usedSpace.acquire();
...消费
freeSpace.release();
```

代码示例

```
#include <QCoreApplication>
#include <QSemaphore>
#include <QThread>
#include <QMutex>
#include <QDebug>

const int DataSize = 1000;
const int BufferSize = 100;
char buffer[BufferSize];

QSemaphore freeSpace(BufferSize);
QSemaphore usedSpace(0);

class Producer : public QThread
{
protected:
    void run()
    {
        for (int i = 0; i < DataSize; ++i)
        {
            freeSpace.acquire();
            buffer[i % BufferSize] = "MING"[uint(rand()) % 4];
            qDebug() << "Produce: " << buffer[i % BufferSize];
            usedSpace.release();
        }
    }
};

class Consumer : public QThread
{
protected:
    void run()
    {
        for (int i = 0; i < DataSize; ++i)
        {
            usedSpace.acquire();
            qDebug() << "Consume: " << buffer[i % BufferSize];
            freeSpace.release();
        }
    }
};

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    Producer producer;
    Consumer consumer;

    producer.start();
    consumer.start();

    producer.wait();
    consumer.wait();

    return a.exec();
}
```

#### QCoditionVariable

对生产者和消费者问题的另一个解决方法是使用QWaitCondition,它允许线程在一定条件下唤醒其他线程。其中wakeOne()函数在条件满足时随机唤醒一个等待线程，而wakeAll()函数则在条件满足时唤醒所有等待线程。

当调用这一句waitcondition.wait(&mutex) 在等待触发条件的时候，此时的mutex已经被设置为unlocked状态。当条件满足wait语句朝下执行的时候

下面重写生产者和消费者实例，以QMutex为等待条件，QWaitCondition允许一个线程在一定条件下唤醒其他线程。

```
#include <QCoreApplication>
#include <QWaitCondition>
#include <QThread>
#include <QMutex>
#include <QDebug>

const int DataSize = 100;
const int BufferSize = 1;
char buffer[BufferSize];

QWaitCondition bufferIsNotFull;
QWaitCondition bufferIsNotEmpty;
QMutex mutex;
int usedSpace;

class Producer : public QThread
{
protected:
    void run()
    {
        for (int i = 0; i < DataSize; ++i)
        {
            mutex.lock();
            while (usedSpace == BufferSize)
            {
                bufferIsNotFull.wait(&mutex);
            }
            qDebug() <<"Produce: " << i+1;
            ++usedSpace;
            bufferIsNotEmpty.wakeAll();
            mutex.unlock();
        }
    }
};

class Consumer : public QThread
{
protected:
    void run()
    {
        for (int i = 0; i < DataSize; ++i)
        {
            mutex.lock();
            while (usedSpace == 0)
            {
                bufferIsNotEmpty.wait(&mutex);
            }
            qDebug() <<"Consume: " << i+1;
            --usedSpace;
            bufferIsNotFull.wakeAll();
            mutex.unlock();
        }
    }
};

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    Producer producer;
    Consumer consumer;

    producer.start();
    consumer.start();

    producer.wait();
    consumer.wait();

    return a.exec();
}
```

#### 无锁编程

最快的同步方式是不同步

无锁编程
