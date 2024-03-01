## 信号与槽

> 信号与槽机制是Qt的一个主要特征，是Qt与其它工具包最不相同的部分。通过反馈的方式动态地或松散地将事件和状态变化联系起来。

Qt工作的原理:事件驱动，信号槽机制。

> 回调(callback)。

是一个函数指针，当一个事件发生时被
调用，任何函数都可以被安排作为回调。

- 没有类型安全
- 总是以直接调用方式工作

> 信号和槽的方式更加动态

- 一个更通用的机制
- 更容易互连两个已存在的类
- 相关类之间涉及更少的知识共享

> Qt采用信号和槽实现对象部件之间的通信。

- 能携带任意数量和任意类型的参数,取代原始的回调和消息映射机制
- 面向对象，独立于标准C/C++，必须借助QT工具moc（Meta Object Compiler），C++预处理程序，为高层次事件处理自动生成所需要附加代码
- 必须把事件和相关代码联系起来，才能对事件做出响应。才能使不同类型的对象之间能够进行通信

#### 信号

- 当信号被发射时，QT代码将回调与其相连接的槽函数

- 信号将由元对象处理moc自动翻译成C++代码

- 信号的声明不在.cpp文件中，而在头文件中

```cpp
  Q_OBJECT
  ......
  signals:
  void mySignal();
  void mySignal(int x);
  void mySignalParam(int x,int y); 
```

#### 槽

- 槽函数是普通的C++成员函数，可以被正常调用

- 槽函数可以有返回值，也可以没有。

- 槽函数的访问权限三种：public slots、private slots和protected slots。槽函数的存取权限决定了谁能够与其相关联。

- 普通的 C++ 成员函数一样，槽函数也分为三种类型，即 public slots、private slots 和 protected slots。
  
  - public slots：在这个区内声明的槽意味着任何对象都可将信号与之相连接。这对于组件编程非常有用，你可以创建彼此互不了解的对象，将它们的信号与槽进行连接以便信息能够正确的传递。
  - protected slots：在这个区内声明的槽意味着当前类及其子类可以将信号与之相连接。这适用于那些槽，它们是类实现的一部分，但是其界面接口却面向外部。
  - private slots：在这个区内声明的槽意味着只有类自己可以将信号与之相连接。这适用于联系非常紧密的类。

- 槽也能够声明为虚函数，这也是非常有用的。

- 头文件中中声明

```cpp
  Q_OBJECT
  ......
  public slots:
  void mySlot();
  void mySlot(int x);
  void mySignalParam(int x,int y);
```

#### 连接方式

原型：

```cpp
QMetaObject::Connection QObject::connect(const QObject * sender, const char * signal, const QObject * receiver, const char * method, Qt::ConnectionType type = Qt::AutoConnection); 
```

槽函数执行方式分为：自动、直接、队列、阻塞队列等等。

```cpp
Qt::AutoConnection：

Qt::DirectConnection

Qt::QueuedConnection：

Qt::BlockingQueuedConnection：

Qt::UniqueConnection
```

> 可参考：Assist : Qt::ConnectionType

#### 连接

信号与槽关联

```cpp
QObject::connect( sender, SIGNAL(signal),receiver, SLOT(method) );
```

信号与信号相连

```cpp
QObject::connect( sender, SIGNAL(signal), receiver, SIGNAL(signal) );
```

同一个信号连接到多个槽

```cpp
QObject::connect( sender, SIGNAL(signal),receiver, SLOT(method1) );
QObject::connect( sender, SIGNAL(signal),receiver, SLOT(method2) );
......
```

多个信号连接到同一个槽

```cpp
QObject::connect( sender, SIGNAL(signal1),receiver, SLOT(method) );
QObject::connect( sender, SIGNAL(signal2),receiver, SLOT(method) );
......
```

Qt5: 新语法：

```cpp
connect(sender,  &Sender::valueChanged,  receiver,  &Receiver::updateValue);
```

### TEST

mainwindow.h

```cpp
#ifndef MAINWINDOW_H
#define MAINWINDOW_H
#include <QLabel>
#include <QVBoxLayout>
#include <QLineEdit>
#include <QPushButton>
#include <QMainWindow>

QT_BEGIN_NAMESPACE
namespace Ui { class MainWindow; }
QT_END_NAMESPACE

class MainWindow : public QMainWindow
{
    Q_OBJECT
signals:
    void clicked();
public slots:
   void ToCalculate();
public:
    MainWindow(QWidget *parent = nullptr);
    ~MainWindow();


private:
    QPushButton *pushButton;
    QLineEdit *lineEdit;
    QLineEdit *lineEdit_2;
    QLineEdit *lineEdit_3;
    QVBoxLayout *layout;
    Ui::MainWindow *ui;
};
#endif // MAINWINDOW_H
```

mainwindow.cpp

```cpp
#include "mainwindow.h"
#include "ui_mainwindow.h"

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    lineEdit = new QLineEdit();
    lineEdit_2 = new QLineEdit();
    lineEdit_3 = new QLineEdit();
    pushButton = new QPushButton("计算");
    layout = new QVBoxLayout();
    layout->addWidget(lineEdit);
    layout->addWidget(lineEdit_2);
    layout->addWidget(lineEdit_3);
    layout->addWidget(pushButton);

    QWidget *centerWindow = new QWidget;
    this->setCentralWidget(centerWindow);
    centerWindow->setLayout(layout);
    connect(pushButton, SIGNAL(clicked()),this, SLOT(ToCalculate()) );
}

MainWindow::~MainWindow()
{
    delete ui;
}

void MainWindow::ToCalculate()
{
    int a = lineEdit->text().toInt();
    int b = lineEdit_2->text().toInt();
    lineEdit_3->setText(QString::number(a+b));
}
```

#### 发送信号

- signal一般是在事件处理时候Qt发出，如果需要程序自己触发信号，则使用emit。
  使用语法如下：
  ```emit signal```

- 如果不需要连接信号槽的时候，可以取消连接。

- 函数原型（有多个版本，函数重载）：

```cpp
  bool QObject::disconnect(const QObject * sender, const char * signal, const QObject *receiver,const char * method);
```

- 取消一个连接不是很常用，因为Qt会在一个对象被删除后自动取消这个对象所包含的所有连接

#### Q_Object宏

- 只有继承了QObject类的类，才具有信号槽的能力。凡是QObject类（不管是直接子类还是间接子类），都应该在第一行代码写上Q_OBJECT。不管是不是使用信号槽，都应该添加这个宏。这个宏的展开将为我们的类提供信号槽机制、国际化机制以及 Qt 提供的不基于 C++ RTTI 的反射能力。

- moc 只处理头文件中的标记了Q_OBJECT的类声明

```cpp
  #define Q_OBJECT \ 
    public: \ 
        Q_OBJECT_CHECK \ 
        static const QMetaObject staticMetaObject; \ 
        Q_OBJECT_GETSTATICMETAOBJECT \ 
        virtual const QMetaObject *metaObject() const; \ 
        virtual void *qt_metacast(const char *); \ 
        QT_TR_FUNCTIONS \ 
        virtual int qt_metacall(QMetaObject::Call, int, void **); \ 
    private: 
  Q_DECL_HIDDEN_STATIC_METACALL static void qt_static_metacall(QObject *, QMetaObject::Call, int, void **); 
```
