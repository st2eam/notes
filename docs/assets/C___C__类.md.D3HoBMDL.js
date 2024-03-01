import{_ as i,c as a,o as s,a4 as l}from"./chunks/framework.B-C7vMfR.js";const g=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"C++/C++类.md","filePath":"C++/C++类.md"}'),t={name:"C++/C++类.md"},e=l(`<h2 id="类的声明" tabindex="-1">类的声明 <a class="header-anchor" href="#类的声明" aria-label="Permalink to &quot;类的声明&quot;">​</a></h2><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 类名</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    private:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        私有的数据和成员函数;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    public:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        公用的数据和成员函数;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    protected:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        保护的数据和成员函数;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>探讨<code>public/private</code>给我们带来了什么好处？</p><ol><li>类的内部数据得到保护</li><li>类的使用方法更加明确，不易出错</li><li>类的实现细节更容易修改</li><li>内部数据修改有了统一入口，更容易调试</li></ol><h4 id="默认生成的函数" tabindex="-1">默认生成的函数 <a class="header-anchor" href="#默认生成的函数" aria-label="Permalink to &quot;默认生成的函数&quot;">​</a></h4><ul><li>默认构造函数</li><li>默认析构函数</li><li>拷贝构造函数</li><li>赋值操作符</li><li>地址运算符</li></ul><h4 id="构造函数-constructor" tabindex="-1">构造函数（Constructor） <a class="header-anchor" href="#构造函数-constructor" aria-label="Permalink to &quot;构造函数（Constructor）&quot;">​</a></h4><ul><li><p>类声明</p><ul><li>类名（类型 形参，类型 形参，...）</li></ul></li><li><p>定义对象</p><ul><li>类名 对象（实参，实参，...）</li></ul></li><li><p>特殊的成员函数</p><ul><li><p>对象创建时自动执行，无需用户调用且不能被调用（其实可以）</p></li><li><p>与类名同名</p></li><li><p>可传入参数，无返回值</p></li><li><p>可重载</p></li><li><p>如果用户不定义，则编译器自动生成一个</p></li></ul></li></ul><h4 id="构造函数初始化列表" tabindex="-1">构造函数初始化列表 <a class="header-anchor" href="#构造函数初始化列表" aria-label="Permalink to &quot;构造函数初始化列表&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>    class_name(int v1,const int&amp; v2):var(v1),var2(v2)</span></span></code></pre></div><h4 id="拷贝构造函数" tabindex="-1">拷贝构造函数 <a class="header-anchor" href="#拷贝构造函数" aria-label="Permalink to &quot;拷贝构造函数&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>classname (const classname &amp;obj) {</span></span>
<span class="line"><span>   // 构造函数的主体</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>以下两种方式会调用拷贝构造函数:</p><ol><li><p>classname A(B);</p></li><li><p>classnaem A=B;</p></li></ol><h4 id="析构函数-destructor" tabindex="-1">析构函数（Destructor） <a class="header-anchor" href="#析构函数-destructor" aria-label="Permalink to &quot;析构函数（Destructor）&quot;">​</a></h4><ul><li><p>声明</p><ul><li>~类名（）</li></ul></li><li><p>特殊的成员函数</p><ul><li>对象生命周期即将结束时自动被调用，释放资源或是执行清理工作</li><li>类名前加一个“~“</li><li>没有返回值，也没有函数参数</li><li>可以显示调用析构函数（慎用）</li></ul></li><li><p>Can destructors be virtual in C++</p></li></ul><h4 id="构造和析构函数链" tabindex="-1">构造和析构函数链 <a class="header-anchor" href="#构造和析构函数链" aria-label="Permalink to &quot;构造和析构函数链&quot;">​</a></h4><ul><li><p>构造函数链</p><ul><li>构造类实例会沿着继承链调用所有的基类ctor</li><li>调用顺序: base first, derive next</li></ul></li><li><p>析构函数链</p><ul><li>dtor与ctor正好相反</li><li>调用顺序: derive first, base next</li></ul></li></ul><h4 id="this指针" tabindex="-1">this指针 <a class="header-anchor" href="#this指针" aria-label="Permalink to &quot;this指针&quot;">​</a></h4><p>在 C++ 中，每一个对象都能通过 this 指针来访问自己的地址。this 指针是所有成员函数的隐含参数。因此，在成员函数内部，它可以用来指向调用对象。</p><ul><li>指向对象自身首地址</li><li>引用整个对象<code>*this</code></li><li>仅能在类内部使用</li></ul><h4 id="static成员" tabindex="-1">static成员 <a class="header-anchor" href="#static成员" aria-label="Permalink to &quot;static成员&quot;">​</a></h4><ul><li>修饰类成员 <ul><li>成员函数</li><li>成员变量</li></ul></li><li>调用方式 <ul><li>类名::静态成员名</li></ul></li><li>特殊性 <ul><li>this指针无效</li><li>不能访问类成员</li></ul></li></ul><h4 id="const成员函数" tabindex="-1">const成员函数 <a class="header-anchor" href="#const成员函数" aria-label="Permalink to &quot;const成员函数&quot;">​</a></h4><ul><li><p>不可修改对象</p></li><li><p>声明</p><ul><li>数据类型 函数名 （参数列表）const；</li></ul></li><li><p>只要成员函数不修改对象就应声明为const</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>char *getData() const;</span></span></code></pre></div><p>函数的功能很简单，仅仅是为了获取成员变量的值，没有任何修改成员变量的企图，所以加了 const 限制，这是一种保险的做法，同时也使得语义更加明显。</p></li></ul><h4 id="inheritance→get-basic" tabindex="-1">inheritance→get_basic() <a class="header-anchor" href="#inheritance→get-basic" aria-label="Permalink to &quot;inheritance→get_basic()&quot;">​</a></h4><div class="language-c++ vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c++</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Superior</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> :</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> basic</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    basic</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> get_basic</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        return</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span></code></pre></div><h2 id="友元" tabindex="-1">友元 <a class="header-anchor" href="#友元" aria-label="Permalink to &quot;友元&quot;">​</a></h2><ul><li>不受权限控制，访问私有成员</li><li>三种友元 <ul><li>友元函数</li><li>友元类</li><li>友元成员函数</li></ul></li><li>注意 <ul><li>友员也破环了类的隐藏与封装</li><li>友元关系不能被继承</li><li>友元关系是单向的，不具有交换性</li><li>友元关系不具有传递性</li></ul></li></ul>`,29),n=[e];function p(h,c,r,o,d,u){return s(),a("div",null,n)}const b=i(t,[["render",p]]);export{g as __pageData,b as default};
