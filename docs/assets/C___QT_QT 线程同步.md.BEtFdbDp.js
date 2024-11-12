import{_ as s,c as a,a2 as p,o as e}from"./chunks/framework.BW-ZVgUE.js";const h=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"C++/QT/QT 线程同步.md","filePath":"C++/QT/QT 线程同步.md"}'),l={name:"C++/QT/QT 线程同步.md"};function i(t,n,c,r,o,d){return e(),a("div",null,n[0]||(n[0]=[p(`<h2 id="线程同步" tabindex="-1">线程同步 <a class="header-anchor" href="#线程同步" aria-label="Permalink to &quot;线程同步&quot;">​</a></h2><h4 id="原子访问" tabindex="-1">原子访问 <a class="header-anchor" href="#原子访问" aria-label="Permalink to &quot;原子访问&quot;">​</a></h4><p>所谓原子访问，指的是一个线程在访问某个资源的同时能够保证没有其他线程会在同一时刻访问同一资源。</p><p>示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>long g_x=0;</span></span>
<span class="line"><span>DWORD WINAPI ThreadFun1(PVOID pvParam)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    g_x++;</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DWORD WINAPI ThreadFun2(PVOID pvParam)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    g_x++;</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>两个线程运行完 g_x是等于2吗？</p><p>正确做法： 使用原子函数改进</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>long g_x=0;</span></span>
<span class="line"><span>DWORD WINAPI ThreadSafeFun1(PVOID pvParam)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    InterlockedExchangeAdd(&amp;g_x,1);</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>DWORD WINAPI ThreadSafeFun2(PVOID pvParam)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    InterlockedExchangeAdd(&amp;g_x,1);</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>代码示例</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span> *  原子操作</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#include &lt;Windows.h&gt;</span></span>
<span class="line"><span>#include &lt;iostream&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>long g_x = 0;</span></span>
<span class="line"><span>long g_thread_safe_x = 0;</span></span>
<span class="line"><span>const int g_loop = 100000;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DWORD WINAPI ThreadFun1(PVOID pvParam)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    for (int i = 0; i &lt; g_loop; i++) {</span></span>
<span class="line"><span>        g_x++;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>DWORD WINAPI ThreadFun2(PVOID pvParam)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    for (int i = 0; i &lt; g_loop; i++) {</span></span>
<span class="line"><span>        g_x++;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//线程安全函数</span></span>
<span class="line"><span>DWORD WINAPI ThreadSafeFun1(PVOID pvParam)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    for (int i = 0; i &lt; g_loop; i++) {</span></span>
<span class="line"><span>        InterlockedExchangeAdd(&amp;g_thread_safe_x, 1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>DWORD WINAPI ThreadSafeFun2(PVOID pvParam)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    for (int i = 0; i &lt; g_loop; i++) {</span></span>
<span class="line"><span>        InterlockedExchangeAdd(&amp;g_thread_safe_x, 1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //创建线程</span></span>
<span class="line"><span>    HANDLE hThread1 = CreateThread(NULL, 0, ThreadFun1, NULL, 0, NULL);</span></span>
<span class="line"><span>    HANDLE hThread2 = CreateThread(NULL, 0, ThreadFun2, NULL, 0, NULL);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    HANDLE hSafeThread1 = CreateThread(NULL, 0, ThreadSafeFun1, NULL, 0, NULL);</span></span>
<span class="line"><span>    HANDLE hSafeThread2 = CreateThread(NULL, 0, ThreadSafeFun2, NULL, 0, NULL);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //等待线程运行结束</span></span>
<span class="line"><span>    WaitForSingleObject(hThread1, INFINITE);</span></span>
<span class="line"><span>    WaitForSingleObject(hThread2, INFINITE);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    WaitForSingleObject(hSafeThread1, INFINITE);</span></span>
<span class="line"><span>    WaitForSingleObject(hSafeThread1, INFINITE);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //打印结果</span></span>
<span class="line"><span>    std::cout &lt;&lt; &quot;g_x = &quot; &lt;&lt; g_x &lt;&lt; std::endl;</span></span>
<span class="line"><span>    std::cout &lt;&lt; &quot;g_thread_safe_x = &quot; &lt;&lt; g_thread_safe_x &lt;&lt; std::endl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //关闭句柄</span></span>
<span class="line"><span>    CloseHandle(hThread1);</span></span>
<span class="line"><span>    CloseHandle(hThread2);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    CloseHandle(hSafeThread1);</span></span>
<span class="line"><span>    CloseHandle(hSafeThread2);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="关键代码段" tabindex="-1">关键代码段 <a class="header-anchor" href="#关键代码段" aria-label="Permalink to &quot;关键代码段&quot;">​</a></h4><p>关键段(Critical Section)是一小段代码，它在执行之前需要独占一些共享资源的访问权。这里的原子方式是代码除了当前线程之外，没有其他任何线程会同时访问该资源。当然系统仍然可以暂停当前线程去调度其他线程。但是在当前线程离开关键段之前，系统是不会去调度任何想要访问统一资源的其他线程的。</p><p>关键代码段的使用：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CRITICAL_SECTION g_cs;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>EnterCriticalSection(&amp;g_cs);</span></span>
<span class="line"><span>//... 处理公共资源代码</span></span>
<span class="line"><span>LeaveCriticalSection(&amp;g_cs);</span></span></code></pre></div><p>代码示例</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * @brief 关键代码段</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#include &lt;Windows.h&gt;</span></span>
<span class="line"><span>#include &lt;iostream&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DWORD g_cnt1 = 0;</span></span>
<span class="line"><span>DWORD g_cnt2 = 0;</span></span>
<span class="line"><span>CRITICAL_SECTION g_cs;</span></span>
<span class="line"><span>const int g_loop = 100000;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DWORD WINAPI FirstThread(PVOID pvParam)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    for (int i = 0; i &lt; g_loop; i++) {</span></span>
<span class="line"><span>        g_cnt1++;</span></span>
<span class="line"><span>        EnterCriticalSection(&amp;g_cs);</span></span>
<span class="line"><span>        g_cnt2++;</span></span>
<span class="line"><span>        LeaveCriticalSection(&amp;g_cs);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DWORD WINAPI SecondThread(PVOID pvParam)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    for (int i = 0; i &lt; g_loop; i++) {</span></span>
<span class="line"><span>        g_cnt1++;</span></span>
<span class="line"><span>        EnterCriticalSection(&amp;g_cs);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        g_cnt2++;</span></span>
<span class="line"><span>        LeaveCriticalSection(&amp;g_cs);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //初始化cs</span></span>
<span class="line"><span>    InitializeCriticalSection(&amp;g_cs);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //创建线程</span></span>
<span class="line"><span>    HANDLE hThread1 = CreateThread(NULL, 0, FirstThread, NULL, 0, NULL);</span></span>
<span class="line"><span>    HANDLE hThread2 = CreateThread(NULL, 0, SecondThread, NULL, 0, NULL);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //等待线程运行结束</span></span>
<span class="line"><span>    WaitForSingleObject(hThread1, INFINITE);</span></span>
<span class="line"><span>    WaitForSingleObject(hThread2, INFINITE);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //打印结果</span></span>
<span class="line"><span>    std::cout &lt;&lt; &quot;g_cnt1 = &quot; &lt;&lt; g_cnt1 &lt;&lt; &quot;, g_cnt2 = &quot; &lt;&lt; g_cnt2 &lt;&lt; std::endl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //关闭句柄</span></span>
<span class="line"><span>    CloseHandle(hThread1);</span></span>
<span class="line"><span>    CloseHandle(hThread2);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //清除cs</span></span>
<span class="line"><span>    DeleteCriticalSection(&amp;g_cs);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="关键段与旋转锁" tabindex="-1">关键段与旋转锁 <a class="header-anchor" href="#关键段与旋转锁" aria-label="Permalink to &quot;关键段与旋转锁&quot;">​</a></h4><p>当一个线程试图进入一个关键段，但这个关键段正被另一个线程占用的时候，函数会立即把调用线程切换到等待状态。这意味着线程必须从用户模式切换到内核模式（大于1000个CPU周期），这个切换的开销非常大。在配有多处理器的机器上，当前占用资源的线程可能在另一个处理器上运行，而且可能很快就会结束对资源的访问。事实上，在需要等待的线程完全切换到内核模式之前，占用资源的线程可能就已经释放了资源。如果发生这种情况的话，那么会浪费大量的cpu时间。</p><p>为了提高关键段的性能，Microsoft把旋转锁合并到了关键段中，因此，当调用EnterCriticalSection的时候，它会用一个旋转锁不断的循环，尝试在一段时间内获得对象的资源的访问权。只有当尝试失败的时候，线程才会切换到内核模式并进入等待状态。</p><p>使用旋转锁之前必须调用 InitializeCriticalSectionAndSpinCount 来初始化。在单处理器上，旋转次数始终为0。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>BOOL InitializeCriticalSectionAndSpinCount(</span></span>
<span class="line"><span>    PCRITICAL_SECTION pcs,//关键段结构的地址    </span></span>
<span class="line"><span>    DWORD dwSpinCount//旋转锁循环的次数</span></span>
<span class="line"><span>);</span></span></code></pre></div><h2 id="用内核对象进行线程同步" tabindex="-1">用内核对象进行线程同步 <a class="header-anchor" href="#用内核对象进行线程同步" aria-label="Permalink to &quot;用内核对象进行线程同步&quot;">​</a></h2><h4 id="常见内核对象" tabindex="-1">常见内核对象： <a class="header-anchor" href="#常见内核对象" aria-label="Permalink to &quot;常见内核对象：&quot;">​</a></h4><p>访问令牌、事件对象、文件对象、文件映射对象、IO完成端口对象、作业、邮件槽、互斥量、匿名管道、命名管道、进程、线程、信号量</p><h4 id="事件内核对象" tabindex="-1">事件内核对象 <a class="header-anchor" href="#事件内核对象" aria-label="Permalink to &quot;事件内核对象&quot;">​</a></h4><p>所有内核对象里面事件内核对象是最简单的一个，它包括一个使用计数，还有两个布尔值。一个布尔值用来表示事件是手动重置事件还是自动重置事件，另一个布尔值表示当前是否处于触发状态。</p><p>当一个手动重置事件被触发的时候，所有等待该事件的线程都能变成调度状态。而一个自动重置事件被触发的时候，等待该事件的线程里面只有一个会变成调度状态。</p><p>创建一个事件的函数原型如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>HANDLE WINAPI CreateEvent(</span></span>
<span class="line"><span>  __in_opt  LPSECURITY_ATTRIBUTES lpEventAttributes,//安全描述符</span></span>
<span class="line"><span>  __in      BOOL bManualReset,//TRUE-手动重置，FALSE-自动重置</span></span>
<span class="line"><span>  __in      BOOL bInitialState,//TRUE-事件是触发状态，FALSE-事件是未触发状态</span></span>
<span class="line"><span>  __in_opt  LPCTSTR lpName//事件名字</span></span>
<span class="line"><span>);</span></span></code></pre></div><p>一旦事件已经创建，就可以直接控制它的状态</p><p>将事件改为触发状态</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>BOOL SetEvent(HANDLE hEvent);</span></span></code></pre></div><p>将该事件改为未触发状态</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>BOOL ResetEvent(HANDLE hEvent);</span></span></code></pre></div><p>使得事件变为触发状态，然后立即又变为未触发状态，通知一次</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>BOOL PulseEvent(HANDLE hEvent);</span></span></code></pre></div><p>代码示例</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * @brief 事件内核对象</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#include &lt;Windows.h&gt;</span></span>
<span class="line"><span>#include &lt;iostream&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>HANDLE hEvent;//全局事件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DWORD WINAPI ThreadFun1(LPVOID pvParam)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    std::cout &lt;&lt; &quot;ThreadFun1 waiting ...&quot; &lt;&lt; std::endl;</span></span>
<span class="line"><span>    //等待事情触发</span></span>
<span class="line"><span>    WaitForSingleObject(hEvent, INFINITE);    </span></span>
<span class="line"><span>    //do something</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>    SetEvent(hEvent);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    std::cout &lt;&lt; &quot;ThreadFun1 done&quot; &lt;&lt; std::endl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DWORD WINAPI ThreadFun2(LPVOID pvParam)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    std::cout &lt;&lt; &quot;ThreadFun2 waiting ...&quot; &lt;&lt; std::endl;</span></span>
<span class="line"><span>    //等待事情触发</span></span>
<span class="line"><span>    WaitForSingleObject(hEvent, INFINITE);    </span></span>
<span class="line"><span>    //do something</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>    SetEvent(hEvent);</span></span>
<span class="line"><span>    std::cout &lt;&lt; &quot;ThreadFun2 done&quot; &lt;&lt; std::endl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main(int argc, char* argv[])</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //创建事件内核对象  (手动设置，未触发状态)</span></span>
<span class="line"><span>    hEvent = CreateEvent(NULL, TRUE, FALSE, NULL);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //创建线程</span></span>
<span class="line"><span>    HANDLE hThread[2];</span></span>
<span class="line"><span>    hThread[0] = CreateThread(NULL, 0, ThreadFun1, 0, 0, NULL);</span></span>
<span class="line"><span>    hThread[1] = CreateThread(NULL, 0, ThreadFun2, 0, 0, NULL);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Sleep(3000);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //设置为触发状态</span></span>
<span class="line"><span>    SetEvent(hEvent);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //等待线程结束</span></span>
<span class="line"><span>    WaitForMultipleObjects(2, hThread, TRUE, INFINITE);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //关闭事件句柄</span></span>
<span class="line"><span>    CloseHandle(hEvent);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //关闭线程句柄</span></span>
<span class="line"><span>    for (int i = 0; i &lt; 2; ++i) {</span></span>
<span class="line"><span>        CloseHandle(hThread[i]);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="waitforsingleobject和waitformultipleobjects函数" tabindex="-1">WaitForSingleObject和WaitForMultipleObjects函数 <a class="header-anchor" href="#waitforsingleobject和waitformultipleobjects函数" aria-label="Permalink to &quot;WaitForSingleObject和WaitForMultipleObjects函数&quot;">​</a></h4><p>在多线程的情况下，有时候我们会希望等待某一线程完成了再继续做其他事情，要实现这个目的，可以使用Windows API函数WaitForSingleObject，或者WaitForMultipleObjects。这两个函数都会等待Object被标为有信号(signaled)时才返回的。</p><p>那么，信号是什么呢？假设这里存在一个文件和两个线程，我们规定这个文件同一时刻只能被一个线程所访问打开，那么我们的线程该如何知道这个文件现在有没有被别的线程访问呢？我们可以让线程等在一个死循环里，这个循环之一在尝试打开访问这个文件，直到能够打开为止；这样做虽然可以实现目的，但是死循环会占用大量的内存，所以windows就设置了信号量。</p><p>信号量的作用简单理解就是一个标志位，在我们上述的问题中，这个文件就有一个信号量，初始时我们设信号量为FALSE，而只有当信号量为FALSE时线程才可以打开访问这个文件。那么，当第一个线程到达，信号量为FALSE，线程打开文件进行访问，并将信号量置为TRUE；在第一个线程在访问文件时，第二个线程到来，此时信号量仍未TRUE，所以第二个线程等待，这个等待的过程就是WaitForSingleObject。WaitForSingleObject在等待的过程中会进入一个非常高效的沉睡等待状态，只占用极少的CPU时间片。</p><ol><li><p><strong>函数原型</strong><br> DWORD WaitForSingleObject( HANDLE hHandle, DWORDdwMilliseconds); 有两个参数，分别是THandle和Timeout(毫秒单位)。 如果想要等待一条线程，那么你需要指定线程的Handle，以及相应的Timeout时间。当然，如果你想无限等待下去，Timeout参数可以指定系统常量INFINITE。</p></li><li><p><strong>使用对象</strong><br> 它可以等待如下几种类型的对象： Event，Mutex，Semaphore，Process，Thread</p></li><li><p><strong>返回类型</strong><br> 有三种返回类型： WAIT_OBJECT_0, 表示等待的对象有信号（对线程来说，表示执行结束）； WAIT_TIMEOUT, 表示等待指定时间内，对象一直没有信号（线程没执行完）； WAIT_ABANDONED 表示对象有信号，但还是不能执行 一般是因为未获取到锁或其他原因</p></li></ol><h4 id="信号量内核对象" tabindex="-1">信号量内核对象 <a class="header-anchor" href="#信号量内核对象" aria-label="Permalink to &quot;信号量内核对象&quot;">​</a></h4><p>信号量内核对象用来对资源进行计数。与其他所有内核对象相同，它们也包含一个使用计数，另外还包括两个32位值：一个最大资源计数和一个当前资源计数。最大资源计数表示信号量可以控制的最大资源数量，当前资源计数表示信号量当前可用资源的数量。</p><p>信号量的规则如下：</p><p>①如果当前资源计数大于0，那么信号量处于触发状态</p><p>②如果当前资源计数等于0，那么信号量处于未触发状态</p><p>③系统绝对不会让当前资源计数变为负数</p><p>④当前资源计数绝对不会大于最大资源计数</p><p><strong>创建一个信号量内核对象</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>HANDLE CreateSemaphore(</span></span>
<span class="line"><span>　LPSECURITY_ATTRIBUTES lpSemaphoreAttributes, // 安全属性指针</span></span>
<span class="line"><span>　LONG lInitialCount, // 初始计数</span></span>
<span class="line"><span>　LONG lMaximumCount, // 最大计数</span></span>
<span class="line"><span>　LPCTSTR lpName // 对象名指针</span></span>
<span class="line"><span>);</span></span></code></pre></div><p><strong>打开在其他进程中创建的信号量</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>HANDLE OpenSemaphore(</span></span>
<span class="line"><span>　DWORD dwDesiredAccess, // 访问标志</span></span>
<span class="line"><span>　BOOL bInheritHandle, // 继承标志</span></span>
<span class="line"><span>　LPCTSTR lpName // 信号量名</span></span>
<span class="line"><span>);</span></span></code></pre></div><p><strong>在线程离开对共享资源的处理时，释放信号量</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>BOOL ReleaseSemaphore(</span></span>
<span class="line"><span>　HANDLE hSemaphore, // 信号量句柄</span></span>
<span class="line"><span>　LONG lReleaseCount, // 计数递增数量</span></span>
<span class="line"><span>　LPLONG lpPreviousCount // 先前计数</span></span>
<span class="line"><span>);</span></span></code></pre></div><p>代码示例</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * @brief 信号量内核对象</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#include &lt;Windows.h&gt;</span></span>
<span class="line"><span>#include &lt;iostream&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span> //全局信号量对象句柄</span></span>
<span class="line"><span>HANDLE hSemaphore;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DWORD WINAPI ThreadFun1(LPVOID pvParam)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //等待事情触发</span></span>
<span class="line"><span>    WaitForSingleObject(hSemaphore, INFINITE);</span></span>
<span class="line"><span>    std::cout &lt;&lt; &quot;ThreadFun1 active and sleep 3s &quot; &lt;&lt; std::endl;</span></span>
<span class="line"><span>    Sleep(3000);</span></span>
<span class="line"><span>    // 释放信号量计数</span></span>
<span class="line"><span>    ReleaseSemaphore(hSemaphore, 1, NULL);</span></span>
<span class="line"><span>    std::cout &lt;&lt; &quot;ThreadFun1 done and release&quot; &lt;&lt; std::endl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DWORD WINAPI ThreadFun2(LPVOID pvParam)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //等待事情触发</span></span>
<span class="line"><span>    WaitForSingleObject(hSemaphore, INFINITE);</span></span>
<span class="line"><span>    std::cout &lt;&lt; &quot;ThreadFun2 active and sleep 5s &quot; &lt;&lt; std::endl;</span></span>
<span class="line"><span>    Sleep(5000);</span></span>
<span class="line"><span>    // 释放信号量计数</span></span>
<span class="line"><span>    ReleaseSemaphore(hSemaphore, 1, NULL);</span></span>
<span class="line"><span>    std::cout &lt;&lt; &quot;ThreadFun2 done and release&quot; &lt;&lt; std::endl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DWORD WINAPI ThreadFun3(LPVOID pvParam)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //等待事情触发</span></span>
<span class="line"><span>    WaitForSingleObject(hSemaphore, INFINITE);</span></span>
<span class="line"><span>    std::cout &lt;&lt; &quot;ThreadFun3 active and sleep 7s &quot; &lt;&lt; std::endl;</span></span>
<span class="line"><span>    Sleep(7000);</span></span>
<span class="line"><span>    // 释放信号量计数</span></span>
<span class="line"><span>    ReleaseSemaphore(hSemaphore, 1, NULL);</span></span>
<span class="line"><span>    std::cout &lt;&lt; &quot;ThreadFun3 done and release&quot; &lt;&lt; std::endl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DWORD WINAPI ThreadFun4(LPVOID pvParam)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //等待事情触发</span></span>
<span class="line"><span>    WaitForSingleObject(hSemaphore, INFINITE);</span></span>
<span class="line"><span>    std::cout &lt;&lt; &quot;ThreadFun4 active and sleep 9s &quot; &lt;&lt; std::endl;</span></span>
<span class="line"><span>    Sleep(9000);</span></span>
<span class="line"><span>    // 释放信号量计数</span></span>
<span class="line"><span>    ReleaseSemaphore(hSemaphore, 1, NULL);</span></span>
<span class="line"><span>    std::cout &lt;&lt; &quot;ThreadFun4 done and release&quot; &lt;&lt; std::endl;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main(int argc, char* argv[])</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // 创建信号量对象(最大资源为2， 当前可用资源为2)</span></span>
<span class="line"><span>    hSemaphore = CreateSemaphore(NULL, 2, 2, NULL);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //创建线程</span></span>
<span class="line"><span>    HANDLE hThread[4];</span></span>
<span class="line"><span>    hThread[0] = CreateThread(NULL, 0, ThreadFun1, 0, 0, NULL);</span></span>
<span class="line"><span>    hThread[1] = CreateThread(NULL, 0, ThreadFun2, 0, 0, NULL);</span></span>
<span class="line"><span>    hThread[2] = CreateThread(NULL, 0, ThreadFun3, 0, 0, NULL);</span></span>
<span class="line"><span>    hThread[3] = CreateThread(NULL, 0, ThreadFun4, 0, 0, NULL);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //等待线程结束</span></span>
<span class="line"><span>    WaitForMultipleObjects(4, hThread, TRUE, INFINITE);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //关闭事件句柄</span></span>
<span class="line"><span>    CloseHandle(hSemaphore);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //关闭线程句柄</span></span>
<span class="line"><span>    for (int i = 0; i &lt; 4; ++i) {</span></span>
<span class="line"><span>        CloseHandle(hThread[i]);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="互斥量内核对象" tabindex="-1">互斥量内核对象 <a class="header-anchor" href="#互斥量内核对象" aria-label="Permalink to &quot;互斥量内核对象&quot;">​</a></h4><p>互斥量内核对象用来确保一个线程独占对一个资源的访问。互斥量包含了一个使用计数、线程ID和一个递归计数。互斥量和关键段的行为完全相同。但是互斥量是内核对象，而关键段是用户模式下的同步对象。</p><p>线程ID用来标识当前占用这个互斥量的是系统中的哪个线程，递归计数表示这个线程占用该互斥量的次数。互斥量有很多用途，它们是使用最为频繁的内核对象之一。它们一般用来对多个线程访问的同一块内存进行保护。互斥量可以确保正在访问内存块的任何线程独占对内存块的访问权，这样就维护了数据的完整性。互斥量只能用于互斥，不能用于同步。</p><p>互斥量的使用规则：</p><ul><li>如果线程ID为0 （无效线程ID），那么该互斥量不为任何线程所占用，它处于触发状态。可以理解为：无人使用，即触发。</li><li>如果线程ID为非零值，那么有一个线程已经占用了该互斥量，他处于未触发状态。</li><li>与所有其他内核对象不同，操作系统对互斥量进行了特殊处理，允许他们违反一些常规的规则。</li></ul><p><strong>创建互斥量</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>HANDLECreateMutex(</span></span>
<span class="line"><span>  LPSECURITY_ATTRIBUTES lpMutexAttributes,</span></span>
<span class="line"><span>  BOOL bInitialOwner,     </span></span>
<span class="line"><span>  LPCTSTR lpName</span></span>
<span class="line"><span>);</span></span></code></pre></div><p>第一个参数表示安全控制，一般直接传入NULL。</p><p>第二个参数用来确定互斥量的初始拥有者。 如果传入TRUE表示互斥量对象内部会记录创建它的线程的线程ID号并将递归计数设置为1，由于该线程ID非零，所以互斥量处于未触发状态。 如果传入FALSE，那么互斥量对象内部的线程ID号将设置为NULL，递归计数设置为0，这意味互斥量不为任何线程占用，处于触发状态。</p><p>第三个参数用来设置互斥量的名称，在多个进程中的线程就是通过名称来确保它们访问的是同一个互斥量。</p><p><strong>打开互斥量</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>HANDLEOpenMutex(</span></span>
<span class="line"><span> DWORD dwDesiredAccess,//访问权限</span></span>
<span class="line"><span> BOOL bInheritHandle,//继承标志</span></span>
<span class="line"><span> LPCTSTR lpName //名称</span></span>
<span class="line"><span>);</span></span></code></pre></div><p><strong>触发互斥量</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>BOOL ReleaseMutex (HANDLE hMutex)</span></span></code></pre></div><p>访问互斥资源前应该要调用等待函数，结束访问时就要调用ReleaseMutex()来表示自己已经结束访问，其它线程可以开始访问了</p><p><strong>清理互斥量</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>BOOL CloseHandle(HANDLE hObject);</span></span></code></pre></div><p>代码实例</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * @brief 互斥锁内核对象</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#include &lt;Windows.h&gt;</span></span>
<span class="line"><span>#include &lt;iostream&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#define  THREAD_NUM 10</span></span>
<span class="line"><span></span></span>
<span class="line"><span>HANDLE hMutex;//全局互斥锁句柄</span></span>
<span class="line"><span>int g_x = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>DWORD WINAPI ThreadFun(LPVOID pvParam)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //等待事情触发</span></span>
<span class="line"><span>    DWORD threadid = GetCurrentThreadId();</span></span>
<span class="line"><span>    WaitForSingleObject(hMutex, INFINITE);</span></span>
<span class="line"><span>    std::cout &lt;&lt; &quot;Thread enter: &quot; &lt;&lt; threadid &lt;&lt; std::endl;</span></span>
<span class="line"><span>    Sleep(2000);</span></span>
<span class="line"><span>    g_x++;</span></span>
<span class="line"><span>    std::cout &lt;&lt; &quot;Thread leave: g_x= &quot; &lt;&lt; g_x &lt;&lt; &quot;thread id:&quot; &lt;&lt; threadid &lt;&lt; std::endl;  //执行ReleaseMutex后，离开互斥资源</span></span>
<span class="line"><span>                                                 //是否互斥锁对象</span></span>
<span class="line"><span>    ReleaseMutex(hMutex);</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main(int argc, char* argv[])</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    //创建互斥锁内核对象  (处于触发状态)</span></span>
<span class="line"><span>    hMutex = CreateMutex(NULL, FALSE, NULL);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //创建线程</span></span>
<span class="line"><span>    HANDLE hThread[THREAD_NUM];</span></span>
<span class="line"><span>    for (int i = 0; i &lt; THREAD_NUM; i++) {</span></span>
<span class="line"><span>        hThread[i] = CreateThread(NULL, 0, ThreadFun, (PVOID)&amp;i, 0, NULL);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //等待线程结束</span></span>
<span class="line"><span>    WaitForMultipleObjects(THREAD_NUM, hThread, TRUE, INFINITE);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //关闭事件句柄</span></span>
<span class="line"><span>    CloseHandle(hMutex);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //关闭线程句柄</span></span>
<span class="line"><span>    for (int i = 0; i &lt; THREAD_NUM; ++i) {</span></span>
<span class="line"><span>        CloseHandle(hThread[i]);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>由于互斥量是内核对象，因此使用CloseHandle()就可以（这一点所有内核对象都一样）</p><h4 id="其它内核对象" tabindex="-1">其它内核对象 <a class="header-anchor" href="#其它内核对象" aria-label="Permalink to &quot;其它内核对象&quot;">​</a></h4><ul><li>进程</li><li>线程</li></ul><h2 id="qt线程同步" tabindex="-1">Qt线程同步 <a class="header-anchor" href="#qt线程同步" aria-label="Permalink to &quot;Qt线程同步&quot;">​</a></h2><h4 id="qmutex、qmutexlocker" tabindex="-1">QMutex、QMutexLocker <a class="header-anchor" href="#qmutex、qmutexlocker" aria-label="Permalink to &quot;QMutex、QMutexLocker&quot;">​</a></h4><p>QMutex类提供了一个保护一段临界区代码的方法，他每次只允许一个线程访问这段临界区代码。QMutex::lock()函数用来锁住互斥量，如果互斥量处于解锁状态，当前线程就会立即抓住并锁定它；否则当前线程就会被阻塞，直到持有这个互斥量的线程对其解锁。线程调用lock()函数后就会持有这个互斥量直到调用unlock()操作为止。QMutex还提供了一个tryLock()函数，如果互斥量已被锁定，就立即返回。</p><p>Qt提供了QMutexLocker类何以简化互斥量的处理，它在构造函数中接受一个QMutex对象作为参数并将其锁定，在析构函数中解锁这个互斥量。</p><p>示例1：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>QMutex mutex; </span></span>
<span class="line"><span>mutex.lock();</span></span>
<span class="line"><span>... 临界区代码</span></span>
<span class="line"><span>mutex.unlock();//容易忘记或者走到其它分支</span></span></code></pre></div><p>示例2：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>QMutex   mutex; </span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    QMutexLocker locker(&amp;mutex);</span></span>
<span class="line"><span>    ... 临界区代码</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>代码实例</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &lt;QCoreApplication&gt;</span></span>
<span class="line"><span>#include &lt;QDebug&gt;</span></span>
<span class="line"><span>#include &lt;QMutex&gt;</span></span>
<span class="line"><span>#include &lt;QMutexLocker&gt;</span></span>
<span class="line"><span>#include &lt;QThread&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int g_x = 0;</span></span>
<span class="line"><span>int g_loop = 100000;</span></span>
<span class="line"><span>QMutex g_mutex;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>void threadFunc1(){</span></span>
<span class="line"><span>    g_mutex.lock();     //QMutexLocker locker(&amp;g_mutex);</span></span>
<span class="line"><span>    for(int i = 0; i &lt; g_loop; i++){</span></span>
<span class="line"><span>        g_x++;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    g_mutex.unlock();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void threadFunc2(){</span></span>
<span class="line"><span>    g_mutex.lock();</span></span>
<span class="line"><span>    for(int i = 0; i &lt; g_loop; i++){</span></span>
<span class="line"><span>        g_x++;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    g_mutex.unlock();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>typedef void (*ThreadBodyFunc)();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Mythread : public QThread</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    explicit Mythread(ThreadBodyFunc func, QObject *parent = nullptr)</span></span>
<span class="line"><span>        : QThread(parent), m_func(func)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>protected:</span></span>
<span class="line"><span>    void run() override</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        if(m_func){</span></span>
<span class="line"><span>            m_func();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    ThreadBodyFunc m_func;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main(int argc, char *argv[])</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    QCoreApplication a(argc, argv);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //创建线程</span></span>
<span class="line"><span>    Mythread thread1(threadFunc1, &amp;a);</span></span>
<span class="line"><span>    Mythread thread2(threadFunc1, &amp;a);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //启动线程</span></span>
<span class="line"><span>    thread1.start();</span></span>
<span class="line"><span>    thread2.start();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //等待线程结束</span></span>
<span class="line"><span>    thread1.wait();</span></span>
<span class="line"><span>    thread2.wait();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    qDebug() &lt;&lt; &quot;g_x = &quot; &lt;&lt; g_x;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return a.exec();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="qsemphore" tabindex="-1">QSemphore <a class="header-anchor" href="#qsemphore" aria-label="Permalink to &quot;QSemphore&quot;">​</a></h4><p>Qt中的信号量是由QSemaphore类提供的，信号量可以理解为互斥量功能的扩展，互斥量只能锁定一次而信号量可以获取多次，它可以用来保护一定数量的同种资源。</p><p>acquire(n)函数用于获取n个资源，当没有足够的资源时调用者将被阻塞直到有足够的可用资源。release(n)函数用于释放n个资源。</p><p>QSemaphore类还提供了一个tryAcquire(n)函数，在没有足够的资源是该函数会立即返回。 一个典型的信号量应用程序是在两个线程间传递一定数量的数据(DataSize)，而这两个线程使用一定大小(BufferSize)的共享循环缓存(生产者-消费者模型)</p><p>临界区资源</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>QSemaphore freeSpace(BufferSize);  </span></span>
<span class="line"><span>QSemaphore usedSpace(0);</span></span></code></pre></div><p>生产者：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>freeSpace.acquire();</span></span>
<span class="line"><span>...生产</span></span>
<span class="line"><span>usedSpace.release();</span></span></code></pre></div><p>消费者：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>usedSpace.acquire();</span></span>
<span class="line"><span>...消费</span></span>
<span class="line"><span>freeSpace.release();</span></span></code></pre></div><p>代码示例</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &lt;QCoreApplication&gt;</span></span>
<span class="line"><span>#include &lt;QSemaphore&gt;</span></span>
<span class="line"><span>#include &lt;QThread&gt;</span></span>
<span class="line"><span>#include &lt;QMutex&gt;</span></span>
<span class="line"><span>#include &lt;QDebug&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const int DataSize = 1000;</span></span>
<span class="line"><span>const int BufferSize = 100;</span></span>
<span class="line"><span>char buffer[BufferSize];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>QSemaphore freeSpace(BufferSize);</span></span>
<span class="line"><span>QSemaphore usedSpace(0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Producer : public QThread</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>protected:</span></span>
<span class="line"><span>    void run()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        for (int i = 0; i &lt; DataSize; ++i)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            freeSpace.acquire();</span></span>
<span class="line"><span>            buffer[i % BufferSize] = &quot;MING&quot;[uint(rand()) % 4];</span></span>
<span class="line"><span>            qDebug() &lt;&lt; &quot;Produce: &quot; &lt;&lt; buffer[i % BufferSize];</span></span>
<span class="line"><span>            usedSpace.release();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Consumer : public QThread</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>protected:</span></span>
<span class="line"><span>    void run()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        for (int i = 0; i &lt; DataSize; ++i)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            usedSpace.acquire();</span></span>
<span class="line"><span>            qDebug() &lt;&lt; &quot;Consume: &quot; &lt;&lt; buffer[i % BufferSize];</span></span>
<span class="line"><span>            freeSpace.release();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main(int argc, char *argv[])</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    QCoreApplication a(argc, argv);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Producer producer;</span></span>
<span class="line"><span>    Consumer consumer;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    producer.start();</span></span>
<span class="line"><span>    consumer.start();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    producer.wait();</span></span>
<span class="line"><span>    consumer.wait();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return a.exec();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="qcoditionvariable" tabindex="-1">QCoditionVariable <a class="header-anchor" href="#qcoditionvariable" aria-label="Permalink to &quot;QCoditionVariable&quot;">​</a></h4><p>对生产者和消费者问题的另一个解决方法是使用QWaitCondition,它允许线程在一定条件下唤醒其他线程。其中wakeOne()函数在条件满足时随机唤醒一个等待线程，而wakeAll()函数则在条件满足时唤醒所有等待线程。</p><p>当调用这一句waitcondition.wait(&amp;mutex) 在等待触发条件的时候，此时的mutex已经被设置为unlocked状态。当条件满足wait语句朝下执行的时候</p><p>下面重写生产者和消费者实例，以QMutex为等待条件，QWaitCondition允许一个线程在一定条件下唤醒其他线程。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &lt;QCoreApplication&gt;</span></span>
<span class="line"><span>#include &lt;QWaitCondition&gt;</span></span>
<span class="line"><span>#include &lt;QThread&gt;</span></span>
<span class="line"><span>#include &lt;QMutex&gt;</span></span>
<span class="line"><span>#include &lt;QDebug&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const int DataSize = 100;</span></span>
<span class="line"><span>const int BufferSize = 1;</span></span>
<span class="line"><span>char buffer[BufferSize];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>QWaitCondition bufferIsNotFull;</span></span>
<span class="line"><span>QWaitCondition bufferIsNotEmpty;</span></span>
<span class="line"><span>QMutex mutex;</span></span>
<span class="line"><span>int usedSpace;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Producer : public QThread</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>protected:</span></span>
<span class="line"><span>    void run()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        for (int i = 0; i &lt; DataSize; ++i)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            mutex.lock();</span></span>
<span class="line"><span>            while (usedSpace == BufferSize)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                bufferIsNotFull.wait(&amp;mutex);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            qDebug() &lt;&lt;&quot;Produce: &quot; &lt;&lt; i+1;</span></span>
<span class="line"><span>            ++usedSpace;</span></span>
<span class="line"><span>            bufferIsNotEmpty.wakeAll();</span></span>
<span class="line"><span>            mutex.unlock();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Consumer : public QThread</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>protected:</span></span>
<span class="line"><span>    void run()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        for (int i = 0; i &lt; DataSize; ++i)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            mutex.lock();</span></span>
<span class="line"><span>            while (usedSpace == 0)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                bufferIsNotEmpty.wait(&amp;mutex);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            qDebug() &lt;&lt;&quot;Consume: &quot; &lt;&lt; i+1;</span></span>
<span class="line"><span>            --usedSpace;</span></span>
<span class="line"><span>            bufferIsNotFull.wakeAll();</span></span>
<span class="line"><span>            mutex.unlock();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main(int argc, char *argv[])</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    QCoreApplication a(argc, argv);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Producer producer;</span></span>
<span class="line"><span>    Consumer consumer;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    producer.start();</span></span>
<span class="line"><span>    consumer.start();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    producer.wait();</span></span>
<span class="line"><span>    consumer.wait();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return a.exec();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="无锁编程" tabindex="-1">无锁编程 <a class="header-anchor" href="#无锁编程" aria-label="Permalink to &quot;无锁编程&quot;">​</a></h4><p>最快的同步方式是不同步</p><p>无锁编程</p>`,110)]))}const g=s(l,[["render",i]]);export{h as __pageData,g as default};
