import{_ as n,c as s,o as a,a4 as p}from"./chunks/framework.BtaI5osv.js";const b=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"C++/QT/QT 信号与槽.md","filePath":"C++/QT/QT 信号与槽.md"}'),e={name:"C++/QT/QT 信号与槽.md"},l=p(`<h2 id="信号与槽" tabindex="-1">信号与槽 <a class="header-anchor" href="#信号与槽" aria-label="Permalink to &quot;信号与槽&quot;">​</a></h2><blockquote><h5 id="信号与槽机制是qt的一个主要特征-是qt与其它工具包最不相同的部分。通过反馈的方式动态地或松散地将事件和状态变化联系起来。" tabindex="-1">信号与槽机制是Qt的一个主要特征，是Qt与其它工具包最不相同的部分。通过反馈的方式动态地或松散地将事件和状态变化联系起来。 <a class="header-anchor" href="#信号与槽机制是qt的一个主要特征-是qt与其它工具包最不相同的部分。通过反馈的方式动态地或松散地将事件和状态变化联系起来。" aria-label="Permalink to &quot;信号与槽机制是Qt的一个主要特征，是Qt与其它工具包最不相同的部分。通过反馈的方式动态地或松散地将事件和状态变化联系起来。&quot;">​</a></h5></blockquote><p>Qt工作的原理:事件驱动，信号槽机制。</p><blockquote><p>回调(callback)。</p></blockquote><p>是一个函数指针，当一个事件发生时被 调用，任何函数都可以被安排作为回调。</p><ul><li>没有类型安全</li><li>总是以直接调用方式工作</li></ul><blockquote><p>信号和槽的方式更加动态</p></blockquote><ul><li>一个更通用的机制</li><li>更容易互连两个已存在的类</li><li>相关类之间涉及更少的知识共享</li></ul><blockquote><p>Qt采用信号和槽实现对象部件之间的通信。</p></blockquote><ul><li>能携带任意数量和任意类型的参数,取代原始的回调和消息映射机制</li><li>面向对象，独立于标准C/C++，必须借助QT工具moc（Meta Object Compiler），C++预处理程序，为高层次事件处理自动生成所需要附加代码</li><li>必须把事件和相关代码联系起来，才能对事件做出响应。才能使不同类型的对象之间能够进行通信</li></ul><h4 id="信号" tabindex="-1">信号 <a class="header-anchor" href="#信号" aria-label="Permalink to &quot;信号&quot;">​</a></h4><ul><li><p>当信号被发射时，QT代码将回调与其相连接的槽函数</p></li><li><p>信号将由元对象处理moc自动翻译成C++代码</p></li><li><p>信号的声明不在.cpp文件中，而在头文件中</p></li></ul><div class="language-qml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">qml</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>  Q_OBJECT</span></span>
<span class="line"><span>  ......</span></span>
<span class="line"><span>  signals:</span></span>
<span class="line"><span>  void mySignal();</span></span>
<span class="line"><span>  void mySignal(int x);</span></span>
<span class="line"><span>  void mySignalParam(int x,int y);</span></span></code></pre></div><h4 id="槽" tabindex="-1">槽 <a class="header-anchor" href="#槽" aria-label="Permalink to &quot;槽&quot;">​</a></h4><ul><li><p>槽函数是普通的C++成员函数，可以被正常调用</p></li><li><p>槽函数可以有返回值，也可以没有。</p></li><li><p>槽函数的访问权限三种：public slots、private slots和protected slots。槽函数的存取权限决定了谁能够与其相关联。</p></li><li><p>普通的 C++ 成员函数一样，槽函数也分为三种类型，即 public slots、private slots 和 protected slots。</p><ul><li>public slots：在这个区内声明的槽意味着任何对象都可将信号与之相连接。这对于组件编程非常有用，你可以创建彼此互不了解的对象，将它们的信号与槽进行连接以便信息能够正确的传递。</li><li>protected slots：在这个区内声明的槽意味着当前类及其子类可以将信号与之相连接。这适用于那些槽，它们是类实现的一部分，但是其界面接口却面向外部。</li><li>private slots：在这个区内声明的槽意味着只有类自己可以将信号与之相连接。这适用于联系非常紧密的类。</li></ul></li><li><p>槽也能够声明为虚函数，这也是非常有用的。</p></li><li><p>头文件中中声明</p></li></ul><div class="language-qml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">qml</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>  Q_OBJECT</span></span>
<span class="line"><span>  ......</span></span>
<span class="line"><span>  public slots:</span></span>
<span class="line"><span>  void mySlot();</span></span>
<span class="line"><span>  void mySlot(int x);</span></span>
<span class="line"><span>  void mySignalParam(int x,int y);</span></span></code></pre></div><h4 id="连接方式" tabindex="-1">连接方式 <a class="header-anchor" href="#连接方式" aria-label="Permalink to &quot;连接方式&quot;">​</a></h4><p>原型：</p><div class="language-qml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">qml</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>QMetaObject::Connection QObject::connect(const QObject * sender, const char * signal, const QObject * receiver, const char * method, Qt::ConnectionType type = Qt::AutoConnection);</span></span></code></pre></div><p>槽函数执行方式分为：自动、直接、队列、阻塞队列等等。</p><div class="language-qml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">qml</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>Qt::AutoConnection：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Qt::DirectConnection</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Qt::QueuedConnection：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Qt::BlockingQueuedConnection：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Qt::UniqueConnection</span></span></code></pre></div><blockquote><p>可参考：Assist : Qt::ConnectionType</p></blockquote><h4 id="连接" tabindex="-1">连接 <a class="header-anchor" href="#连接" aria-label="Permalink to &quot;连接&quot;">​</a></h4><p>信号与槽关联</p><div class="language-qml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">qml</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>QObject::connect( sender, SIGNAL(signal),receiver, SLOT(method) );</span></span></code></pre></div><p>信号与信号相连</p><div class="language-qml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">qml</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>QObject::connect( sender, SIGNAL(signal), receiver, SIGNAL(signal) );</span></span></code></pre></div><p>同一个信号连接到多个槽</p><div class="language-qml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">qml</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>QObject::connect( sender, SIGNAL(signal),receiver, SLOT(method1) );</span></span>
<span class="line"><span>QObject::connect( sender, SIGNAL(signal),receiver, SLOT(method2) );</span></span>
<span class="line"><span>......</span></span></code></pre></div><p>多个信号连接到同一个槽</p><div class="language-qml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">qml</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>QObject::connect( sender, SIGNAL(signal1),receiver, SLOT(method) );</span></span>
<span class="line"><span>QObject::connect( sender, SIGNAL(signal2),receiver, SLOT(method) );</span></span>
<span class="line"><span>......</span></span></code></pre></div><p>Qt5: 新语法：</p><div class="language-qml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">qml</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>connect(sender,  &amp;Sender::valueChanged,  receiver,  &amp;Receiver::updateValue);</span></span></code></pre></div><h3 id="test" tabindex="-1">TEST <a class="header-anchor" href="#test" aria-label="Permalink to &quot;TEST&quot;">​</a></h3><p>mainwindow.h</p><div class="language-qml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">qml</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>#ifndef MAINWINDOW_H</span></span>
<span class="line"><span>#define MAINWINDOW_H</span></span>
<span class="line"><span>#include &lt;QLabel&gt;</span></span>
<span class="line"><span>#include &lt;QVBoxLayout&gt;</span></span>
<span class="line"><span>#include &lt;QLineEdit&gt;</span></span>
<span class="line"><span>#include &lt;QPushButton&gt;</span></span>
<span class="line"><span>#include &lt;QMainWindow&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>QT_BEGIN_NAMESPACE</span></span>
<span class="line"><span>namespace Ui { class MainWindow; }</span></span>
<span class="line"><span>QT_END_NAMESPACE</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class MainWindow : public QMainWindow</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    Q_OBJECT</span></span>
<span class="line"><span>signals:</span></span>
<span class="line"><span>    void clicked();</span></span>
<span class="line"><span>public slots:</span></span>
<span class="line"><span>   void ToCalculate();</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    MainWindow(QWidget *parent = nullptr);</span></span>
<span class="line"><span>    ~MainWindow();</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    QPushButton *pushButton;</span></span>
<span class="line"><span>    QLineEdit *lineEdit;</span></span>
<span class="line"><span>    QLineEdit *lineEdit_2;</span></span>
<span class="line"><span>    QLineEdit *lineEdit_3;</span></span>
<span class="line"><span>    QVBoxLayout *layout;</span></span>
<span class="line"><span>    Ui::MainWindow *ui;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>#endif // MAINWINDOW_H</span></span></code></pre></div><p>mainwindow.cpp</p><div class="language-qml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">qml</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>#include &quot;mainwindow.h&quot;</span></span>
<span class="line"><span>#include &quot;ui_mainwindow.h&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>MainWindow::MainWindow(QWidget *parent)</span></span>
<span class="line"><span>    : QMainWindow(parent)</span></span>
<span class="line"><span>    , ui(new Ui::MainWindow)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    ui-&gt;setupUi(this);</span></span>
<span class="line"><span>    lineEdit = new QLineEdit();</span></span>
<span class="line"><span>    lineEdit_2 = new QLineEdit();</span></span>
<span class="line"><span>    lineEdit_3 = new QLineEdit();</span></span>
<span class="line"><span>    pushButton = new QPushButton(&quot;计算&quot;);</span></span>
<span class="line"><span>    layout = new QVBoxLayout();</span></span>
<span class="line"><span>    layout-&gt;addWidget(lineEdit);</span></span>
<span class="line"><span>    layout-&gt;addWidget(lineEdit_2);</span></span>
<span class="line"><span>    layout-&gt;addWidget(lineEdit_3);</span></span>
<span class="line"><span>    layout-&gt;addWidget(pushButton);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    QWidget *centerWindow = new QWidget;</span></span>
<span class="line"><span>    this-&gt;setCentralWidget(centerWindow);</span></span>
<span class="line"><span>    centerWindow-&gt;setLayout(layout);</span></span>
<span class="line"><span>    connect(pushButton, SIGNAL(clicked()),this, SLOT(ToCalculate()) );</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>MainWindow::~MainWindow()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    delete ui;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void MainWindow::ToCalculate()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    int a = lineEdit-&gt;text().toInt();</span></span>
<span class="line"><span>    int b = lineEdit_2-&gt;text().toInt();</span></span>
<span class="line"><span>    lineEdit_3-&gt;setText(QString::number(a+b));</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="发送信号" tabindex="-1">发送信号 <a class="header-anchor" href="#发送信号" aria-label="Permalink to &quot;发送信号&quot;">​</a></h4><ul><li><p>signal一般是在事件处理时候Qt发出，如果需要程序自己触发信号，则使用emit。 使用语法如下： <code>emit signal</code></p></li><li><p>如果不需要连接信号槽的时候，可以取消连接。</p></li><li><p>函数原型（有多个版本，函数重载）：</p></li></ul><div class="language-qml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">qml</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>  bool QObject::disconnect(const QObject * sender, const char * signal, const QObject *receiver,const char * method);</span></span></code></pre></div><ul><li>取消一个连接不是很常用，因为Qt会在一个对象被删除后自动取消这个对象所包含的所有连接</li></ul><h4 id="q-object宏" tabindex="-1">Q_Object宏 <a class="header-anchor" href="#q-object宏" aria-label="Permalink to &quot;Q_Object宏&quot;">​</a></h4><ul><li><p>只有继承了QObject类的类，才具有信号槽的能力。凡是QObject类（不管是直接子类还是间接子类），都应该在第一行代码写上Q_OBJECT。不管是不是使用信号槽，都应该添加这个宏。这个宏的展开将为我们的类提供信号槽机制、国际化机制以及 Qt 提供的不基于 C++ RTTI 的反射能力。</p></li><li><p>moc 只处理头文件中的标记了Q_OBJECT的类声明</p></li></ul><div class="language-qml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">qml</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>  #define Q_OBJECT \\ </span></span>
<span class="line"><span>    public: \\ </span></span>
<span class="line"><span>        Q_OBJECT_CHECK \\ </span></span>
<span class="line"><span>        static const QMetaObject staticMetaObject; \\ </span></span>
<span class="line"><span>        Q_OBJECT_GETSTATICMETAOBJECT \\ </span></span>
<span class="line"><span>        virtual const QMetaObject *metaObject() const; \\ </span></span>
<span class="line"><span>        virtual void *qt_metacast(const char *); \\ </span></span>
<span class="line"><span>        QT_TR_FUNCTIONS \\ </span></span>
<span class="line"><span>        virtual int qt_metacall(QMetaObject::Call, int, void **); \\ </span></span>
<span class="line"><span>    private: </span></span>
<span class="line"><span>  Q_DECL_HIDDEN_STATIC_METACALL static void qt_static_metacall(QObject *, QMetaObject::Call, int, void **);</span></span></code></pre></div>`,45),i=[l];function t(c,o,d,u,h,r){return a(),s("div",null,i)}const m=n(e,[["render",t]]);export{b as __pageData,m as default};
