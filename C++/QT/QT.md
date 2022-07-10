## pro文件说明

> QT += core gui<br>
> QT：指定使用类的模块

> greaterThan(QT_MAJOR_VERSION,4):QT += widgets

> TARGET = HelloQt<br>
> TARGET: 目标文名件

> TEMPLATE = app<br>
> TEMPLATE: 编译方法

> SOURCES += main.cpp\widget.cpp<br>
> SOURCES: 源文件

> HEADERS += widget.h<br>
> HEADERS: 头文件

> FORMS += widget.ui<br>
> FORMS: 指定ui文件

## QT开发框架

![image](https://note.youdao.com/yws/res/6520/D1484380935446F4916F074C562DB90C)

## QApplication类

- QApplication类管理GUI程序的控制流和主要设置，是基于QWidget的，为此特化了QGuiApplication的一些功能，处理QWidget特有的初始化和结束收尾工作.  
- 对于使用了Qt的任何GUI程序来说，不管何时何地有多少个Window，但只有一个QApplication对象，如果不是基于QWidget的程序，相应的则使用QGuiApplication，后者不依赖于Widget特有的库。   
- 有些程序是不使用GUI的，通过命令行参数执行不同的任务而不用手动设置，这时使用QCoreApplication就够了，避免初始化不必要的GUI资源。

#### QApplication的主要职责 (可以参考QAssitant帮助)

1. 使用用户的桌面设置进行初始化，这些设置如palette()、font()、doubleClickInterval()，然后跟踪这些属性的变化，如用户通过某种配置面板修改了全局桌面设置。 
2. 处理事件，从窗口系统接收事件并派发到相应的Widget，使用sendEvent()和postEvent()函数可以派发事件。 
3. 处理命令行参数，设置内部状态。 
4. 定义GUI外观，外观由QStyle对象包装，运行时通过setStyle()函数进行设置。 
5. 设置颜色分配规则，对应的函数为setColorSpec()。 
6. 本地化字符串，函数为translate()。 
7. 提供了一些有用的对象，如desktop()、clipboard()函数。 
8. 知道Widget及Window，相应的函数为widgetAt()、topLevelWidgets()、closeAllWindows()。 
9. 管理鼠标光标，函数为setOverrideCursor()。 

从上面可以看出，QApplication作了许多初始化工作，因此在任何其它的UI对象创建之前必须先创建QApplication对象，而且还可以通过命令行参数设置一些内部状态。

#### QApplication总结

**Qt消息循环**，就是从一个队列中不断取出消息，并响应消息的过程。窗体的鼠标、键盘、输入法、绘制，各种消息，都来自于Qt的消息循环。以Windows操作系统为例，Qt接管Windows原生窗口消息，并翻译成Qt的消息，派发给程序下的各个子对象、子QWidget等，通过接管层，可以很好屏蔽不同平台之间的差异性，开发人员不需要关心Windows或者X11的消息的差异性，只需要搞清楚各个QEvent之间是什么含义。

最开始的Qt消息循环开始于QCoreApplication::exec()。用户创建出一个QCoreApplication，或者说更多情况下是QApplication，执行QCoreApplication::exec()，一个应用程序便开始了。QCoreApplication会不断从操作系统获取消息，并且分发给QObject。

如果没有消息循环，那么Qt的信号和槽无法完全使用，有些函数也无法正确执行。举个例子，通过QueuedConnection连接的信号，其实是将一个事件压入了消息循环，如果没有QCoreApplication::exec()，那么这个消息循环将永远无法派发到指定的对象。

## QObject

QObject是所有Qt对象的基类，是Qt Object Model（对象模型）的核心。  
作用:

- 父子对象树机制-内存管理机制
- 信号和槽机制
- 定时器与事件过滤
- 翻译
- 其他，如线程等。

## QT内存管理

在C++中内存分为5个区，分别是堆、栈、自由存储区、全局/静态存储区和常量存储区  
**堆(heap)**：分配方式类似于链表；一般由程序员分配和释放，若程序员不释放，OS可能回收。分配方法：malloc、new ；释放方法：free delete

**栈(heap)**：编译器自动分配释放，存放函数参数值、局部变量的值。操作方式类似于：数据结构的栈。  进程的每个线程都有私有的栈

**全局/静态存储区（static）**：全局变量和静态变量的存储位置，由系统分配和释放。初始化的存放于.data，未初始化的在.bss。 默认初始化为0

**常量区（文字常量区）**：存放常量字符串，存放于.rodata， 程序结束后有系统释放。
程序代码区：存放函数体的二进制代码(.text)

- 堆栈 存放本地变量 即局部变量。在堆栈中，程序通过堆栈的基址和偏移量来访问本地变量

------

- 使用 new 和 delete时，内存在堆中分配。堆内存空间必须通过delete完全释放。只要不delete，分配在堆上的对象就可以一直存活下去
- 栈是系统自动分配管理的，局部变量就是来自于栈区，只要超过了作用域的栈区数据就会被自动回收

------

- 所有从QObject继承出来的子对象的内存管理都转移给了父对象
  - 使用new在堆上分配内存
  - 子对象可自动被父对象删除内存
  - 手动删除不会引起二次删除，子对象删除时会通知父对象
- 没有父对象的对象需要手工删除
  - 没有父对象的对象一般分配在栈区，这样可以有效避免内存泄漏
- QT没有自动回收站的机制，需要关注父子关系及其功能

------

- 在构造对象的时候指定父对象  
  ```QObject(QObject *parent = 0) ```
- QObject可以修改它所属的父对象  
  ```void QObject::setParent(QObject * parent)```
- 得到子对象  
  ```QObjectList & QObject::children()```
- 得到父对象  
  ```QObject *QObject::parent()```
- 手工删除有父对象的从QObject继承的子对象  
  ```void QObject::deleteLater()```

------

- 在Qt中，最基础和核心的类是：QObject，QObject内部有一个list，会保存children，还有一个指针保存parent，当自己析构时，会自己从parent列表中删除并且析构所有的children

------

#### 总结：

- 所有从QObject继承出来的子对象的内存管理都转移给了父对象
  - 使用new在堆上分配内存
  - 子对象可自动被父对象删除内存
  - 手动删除不会引起二次删除，子对象删除时会通知父对象
- 没有父对象的对象需要手工删除
  - 没有父对象的对象一般分配在栈区，这样可以有效避免内存泄漏
- 当一个QOBJECT正在接受事件队列时如果中途被你DELETE掉了，就是出现问题了，所以QT中建议大家不要直接DELETE掉一个 QOBJECT，如果一定要这样做，要使用QOBJECT的deleteLater()函数，它会让所有事件都发送完一切处理好后马上清除这片内存，而且就算调用多次的deletelater也不会有问题。
- QT不建议在一个QOBJECT 的父亲的范围之外持有对这个QOBJECT的指针，因为如果这样外面的指针很可能不会察觉这个QOBJECT被释放，会出现错误。
- QT中的智能指针封装为QPointer类，所有QOBJECT的子类都可以用这个智能指针来包装，很多用法与普通指针一样。

## 常见类

**Qt中最基本的类**

- QObject派生类
  - QWidget
  - QLayout
  - QThread
  - QTcpSocket
- 非QObject派生类
  - QString：处理字符串
  - QImage：加载与保存图像
  - QColor：处理色彩
  - ……

------

QObject类是所有能够处理signal，slot和事件的Qt对象的基类

- Qt 对象模型的核心
  - 绝大多数类的基类
  - 所有的QWidgets都是QObject
  - 提供对象树和对象的关系
  - QObject在整个QT的概念体系中处于一个非常重要的位置
  - 提供了信号-槽的通信机制
- 具有三个作用
  - 内存管理
  - Introspection(内省)
  - 事件处理

------

- QApplication类负责GUI应用程序的控制流和主要的设置，它包括主事件循环体，负责处理和调度所有来自窗口系统和其他资源的事件
- 处理应用程序的开始，结束以及会话管理
- QApplication是QObject类的子类

------

- 在非图形程序中，QCoreApplication类接管了QApplication类在GUI应用程序中的角色：它使得事件循环机制能够使用。如果你需要异步通讯的话，这将是非常有用的，或者不同的线程之间，或者通过网络套接字。
- QCoreApplication是QObject类的子类

------

- QWidget类继承了QObject类的属性
- QWidget类是所有用户接口对象的基类
  组件是用户界面的单元组成部分，接收鼠标， 键盘和从其它窗口系统来的事件
- QWidget类有很多成员函数，但一般不直接使用，而通过子类继承来使用其函数功能

------

## Qt窗口与对话框

Qt提供的默认基类只有QWidget、QMainWindow和QDialog三种

- **QMainWindow**是带有菜单栏和工具栏的主窗口类

- **QDialog** 是各种对话框的基类，而它们全部继承自 QWidget。不仅如此，

- **QWidget** 类是所有用户界面对象的基类，被称为基础窗口部件。

- QWidget 继承自 QObject 类和 QPaintDevice 类，其中QObject 类是所有支持 Qt 对象模型（Qt Object Model)的基类，QPaimDevice类是所有可以绘制的对象的基类。
  ![image](https://note.youdao.com/yws/res/6464/3FE07C5C91294019B25B3592A799A58F)
  
  #### QWidget
  
  基础窗口部件主要用于自定义窗口。  
  ```QWidget(QWidget *parent = 0, Qt::WindowFlags f = 0);```

其中参数 parent 指向父窗口，如果这个参数为 0，则窗口就成为一个顶级窗口  
    参数 f 是构造窗口的标志，主要用于控制窗口的类型和外观等，有以下常用值。  
1）```Qt::FramelessWindowHint```：没有边框的窗口。  
2）```Qt::WindowStaysOnTopHint```：总是最上面的窗口。  
3）```Qt::CustomizeWindowHint```：自定义窗口标题栏，以下标志必须与这个标志一起使用才有效，否则窗口将有默认的标题栏。  
4）```Qt::WindowTitleHint```：显示窗口标题栏。  
5）```Qt::WindowSystemMenuHint```：显示系统菜单。  
6）```Qt::WindowMinimizeButtonHint```：显示最小化按钮。  
7）```Qt::WindowMaximizeButtonHint```：显示最大化按钮。  
8）```Qt::WindowMinMaxbuttonHint```：显示最小化按钮和最大化按钮。  
9）```Qt::WindowCloseButtonHint```：显示关闭按钮。  

##### 独立窗口

窗口构造的时候如果有Qt::Window标志，那么它就是一个独立窗口，否则就是一个依附于其他独立窗口的窗口部件。顶级窗口一定是独立窗口，但独立窗口不一定是顶级的，它可以有父窗口，当父窗口被析构时它也会随之被析构。独立窗口一般有自己的外边框和标题栏，可以有移动、改变大小等操作。  

#### 对话框QDialog

独立对话框

- File Open, Save As,…
- Printer Dialog
- Font Selector
- Message Box
- Progress Dialog  
  …  

可定制对话框

- Tab Dialog
- Wizard

##### 文件对话框（QFileDialog）

获取文件名

```
QString MainWindow::getOpenFileName()
{
    QString filename = QFileDialog::getOpenFileName(
                this,
                "Open Document",
                QDir::currentPath(),
                "Document files(*.doc);;All files(*.*)");
    if(!filename.isNull())
    {
        //
    }
    return filename;
}
```

保存文件

```
QString MainWindow::getSaveFileName()
{
    QString filename = QFileDialog::getSaveFileName(
                this,
                "Save Document",
                QDir::currentPath(),
                "Documents(*.doc)");
}
```

获取路径

```
QString MainWindow::getExistingDirectory()
{
    QString dirname = QFileDialog::getExistingDirectory(
                this,
                "Select a Directory",
                QDir::currentPath());
    return dirname;
}
```

##### 消息对话框（QMessageBox）

- about()  

- aboutQt()  

- critical()  

- information()  

- question()  

- warning()  
  
  ```
  QMessageBox::XXX(
        this,
        "Application Name",
        "An XXX message.");
  ```

##### 输入对话框（QInputDialog）

文本输入框

```
bool ok;
QString text = QInputDialog::getText(
            this,
            "String",
            "Enter a city name:",
            QLineEdit::Normal,
            "Beijing",
            &ok);
if(ok && !text.isEmpty())
{
    //   ……
}
return text;
```

选项输入框

```
bool ok;
    QStringList items;
    items << "One" << "Two" << "Three";
    QString item = QInputDialog::getItem(
                this,
                "Item",
                "Pick an item:",
                items,
                0,
                false,
                &ok);

if(ok && !item.isEmpty())
{
    //   ……
}
return item;
```

自旋对话框

```
bool ok;
int value = QInputDialog::getInt
        (
            this,
            "Integer",
            "Enter an angle:",
            90,
            0,
            360,
            1,
            &ok);

return value;
```

##### 颜色对话框（QColorDialog）

```
QColor MainWindow::getColor()
{
    QColor color =
        QColorDialog::getColor(
            Qt::yellow,
            this);
    if(color.isValid())
    {
        // ……
    }
    return color;
}
```

##### 字体对话框（QFontDialog）

```
QFont MainWindow::getFont()
{
    bool ok;
    QFont font =QFontDialog::getFont(
        &ok,
        QFont("Arial",18),
        this,
        "Pick a font");
    if(ok)
    {
        //...
    }
    return font;
}
```

## 布局管理

布局管理器主要常用的三个类：

- **QHBoxLayout**
- **QVBoxLayout**
- **QGridLayout**

```
setContentsMargins(int left, int top, int right, int bottom)

setSpacing(int)

addStretch(int stretch = 0)
```

#### QSplitter

QSplitter 是一个可以包含一些其他窗口部件的窗口部件。在切分窗口（splitter)中的这些窗口部件会通过分隔条（splitter handle）而分隔开来。用户可以通过拖动这些切分条来改变切分窗口中子窗口部件的大小。

#### QScrollArea

QScrollArea类提供了一个可以滚动的视口和两个滚动条，使用方法，就是以我们想要添加滚动条的窗口部件为参数调用setWidget()。  
默认情况下，只有在视口的大小小于子窗口部件的大小时，才会把滚动条显示出来。但是通过设置滚动条策略，可以强制滚动条总是可见。

#### QStatckWidget

1. 所有组件垂直于屏幕的方向上被管理
2. 每次只有一个组件会显示在屏幕上
3. 只有最顶层的组件会被最终显示

**栈式布局管理器的特点**  

1. 组件大小一致且充满父组件的显示区
2. 不能直接嵌套其它布局管理器（可以依赖中间组件间接嵌套）
3. 能够自由切换需要显示的组件
4. 每次能且仅能显示一个组件

## 向导对话框

1. QWizard 用来实现软件的使用介绍指南是非常不错的;
2. QWizard是继承自QDialog的，而每一个向导页面是由QWizardPag（QWidget的一个子类）来执行的，采用addPage()来增加创建的QWizardPage。
3. QWizardPage可以添加标题，标题会显示在页的最左上方。setTitle()。还可以设置子标题，子标题跟着标题的下面的位置，起到说明的作用。setSubTitle()。
4. 可以用setPixmap来为向导提供图片，void QWizard::setPixmap ( WizardPixmap which, const QPixmap & pixmap )

------

- 向导有四种风格：ClassicStyle，ModernStyle，MacStyle，AeroStyle。(setWizardStyle设置)
- 枚举类WizardPixmap有四个值：
1. QWizard::WatermarkPixmap：ClassicStyle，ModernStyle页面的左侧设置图片
2. QWizard::LogoPixmap：ClassicStyle，ModernStyle 右侧设置图片
3. QWizard::BannerPixmap：ModernStyle设置的背景图片
4. QWizard::BackgroundPixmap：MacStyle设置背景图
- 在很多向导中，页的内容会被一些默认的值或者用户设置的值影响，QWizard提供一个叫“field”(叫它域吧)的机制。
- 它允许在向导页上注册一个域（例如一个QLineEdit），并可以在任何其他页中存取它的值。可以通过QWizardPage：：registerField()调用域。这个域也可以是托管的（mandatory）域（带星号“*”），托管的域必须填充才能进入到下一个页。

例如：
registerField("className*", classNameLineEdit);注册好了以后就可以用field(“**”)使用了。  

例如：
QString className=field("className").toString();域的内容是作为QVariant返回的

- 向导可以为自己添加按钮等控件用来指导向导页面的翻转移动，以及结束。

- Next或Finish按钮是否用一个方法是通过用户的输入，另一个方法是重新实现validateCurrentPage()或

- QWizardPage::validatePage()，通过它去批准是否生效还可以通过它去确认用户的输入是否符合要求

## QMainWindows

QMainWindow类提供了一个典型应用程序的主窗口框架，应用程序中的主窗口是与用户进行
长时间交互的顶层窗口

- QMainWindow内部封装了菜单栏、工具栏、中心组件、停靠组件、状态栏等。       

- QMainWindow常常被继承，因为这使的封装中央部件、菜单和工具以及窗口状态条变得容易，当用户点击菜单项或工具条按钮时，槽会被调用。基于主窗口的应用程序，默认已经有了自己的布局管理器
  
  #### 主窗口菜单
  
  主窗口菜单可以通过UI工具绘制出来，也可以通过QMenuBar和QMenu来定制。
  QMenu用于定制菜单的菜单项、下拉菜单及弹出菜单项，等等。可以有图标、文字信息、热键及提示信息。通过QMenu完全可以实现菜单的个性化定制。
  横向菜单栏QMenuBar，使用用于管理一组菜单。通过addMenu()向菜单栏添加菜单。
  
  #### 主窗口工具栏
  
  工具栏是应用程序中集成各种功能使用快捷方式的区域，不是应用程序必须存在的组件，工具栏的元素可以是各种窗口组件，但通常以图标按钮的方式存在。
  QT中提供了预定义的工具栏相关组件，工具栏QToolBar和快捷项QAction。

- QToolButton类实现了具有一个图标，一个3D框架和一个可选的标签的工具栏

- QToolButton通常在QToolBar内并排出现。一个程序可含有任意数量的工具栏并且用户可以自由移动它们

- 工具栏可以包括几乎所有部件，例如QComboBox和QSpinBox

#### 主窗口状态栏

```
QStatusBar     *sb = statusBar();
    QLabel*  status1 = new QLabel("Line: 1  Col: 1",this);
    QLabel*  status2 = new QLabel("Lines: 0  Length: 0",this);
    status1->setAlignment(Qt::AlignCenter);                    
    status2->setAlignment(Qt::AlignCenter);
    status1->setMinimumWidth(200);      //设置最小宽度,避免与旁边的信息紧靠在一起
    status2->setMinimumWidth(200);

    sb->addPermanentWidget(status1);
    sb->addPermanentWidget(status2);
```

#### 主窗口动作

下面代码实现了一个“Save”菜单项，一个“Save”工具栏按钮和一个“Save”快捷键，并且均有旁述帮助：

```
QAction *saveAct=new QAction("Save",saveIcon,"&Save",CTRL+Key_S,this);
connect(saveAct,SIGNAL(activated()),this,SLOT(save()));
saveAct->setWhatsThis("Saves the current file.");
saveAct->addTo(fileMenu);
saveAct->addTo(toolbar);
```

#### 主窗口停靠

停靠窗口（dock window）是指在一些可以停靠的QMainWindow中或是浮动为独立窗口。

QMainWindow提供了4个停靠窗口区域：分别在中央窗口部件的上部、中部、下部、左侧和右侧。

## MVC框架

> MVC（Model-View-Controller）框架：起源于smalltalk的一种与用户界面设计相关的设计模式，能有效的分离数据和用户界面。

![image](https://note.youdao.com/yws/res/6497/0092FAD9D17749D8BD21041F5C7C98CA)

- **Model** 处理数据逻辑和程序运行状态
- **View** 负责显示用户界面
- **Controller**通常负责处理用户交互的部分，从视图读取数据与用户输入，并向模型发送数据。
- 在Qt里面我们并没有Controller的概念，而是Delegate（委托），意义很明显：控制器委托模型来处理数据，模型委托控制器来做数据的交互。

------

Model是唯一和数据集打交道的组件，View不接触数据源，其所需要的数据可以从Model中取出，而Delegate正式负责协调Model和View上数据。这种将view和数据源隔离的方式有几点好处：

1. 在处理较大的数据集时每个组件各司其职，不至于降低性能。

2. 一个Model可以映射到多个View，这样可以以不同的方式查看数据同一份数据。

3. 如果底层数据源的存储改变了，我们只需要处理Model就可以了。

------

### 模型model（表示数据）

- 抽象基类QAbstractItemModel
- 列表的抽象基类QAbstractListModel、表格的抽象基类QAbstractTableModel
- QDirModel类是文件与目录的存储模型
- QStandardItemModel类
- QStringListModel类

| 类型                       | 功能           |
| ------------------------ | ------------ |
| QStringListModel         | 存储一个字符串列表    |
| QStandardItemModel       | 存储任意的分层次的数据  |
| QDirModel                | 封装本地文件系统     |
| QSqlQueryModel           | 封装一个SQL结果集   |
| QSqlTableModel           | 封装一个SQL表     |
| QSqlRclationalTableModel | 用外键封装一个SQL表  |
| QSortFilterProxyModel    | 排序和/或筛选另一个模型 |

------

##### MVC框架-自定义Model

在我们真正的完成自定义model之前，先来看看在Qt的model-view架构中的几个关键的概念。一个model中的每个数据元素都有一个model索引。这个索引指明这个数据位于model的位置，比如行、列等。这就是前面我们曾经说到过的QModelIndex。每个数据元素还要有一组属性值，称为角色(roles)。这个属性值并不是数据的内容，而是它的属性，比如说，这个数据是用来展示数据的，还是用于显示列头的？因此，这组属性值实际上是Qt的一个enum定义的，比较常见的有Qt::DisplayRole和Qt::EditRole，另外还有Qt::ToolTipRole, Qt::StatusTipRole, 和Qt::WhatsThisRole等。并且，还有一些属性是用来描述基本的展现属性的，比如Qt::FontRole, Qt::TextAlignmentRole, Qt::TextColorRole, Qt::BackgroundColorRole等

##### MVC框架-自定义Delegate

我们知道，在经典的 MVC 模型中，view用于向用户展示 model 的数据。但是，Qt提供的不是 MVC 三层架构，而是一个 model/view 设计。这种设计并没有包含一个完整而独立的组件用于管理用户的交互。一般来说，view仅仅是用作对model数据的展示和对用户输入的处理，而不应该去做其他的工作。在这种结构中，为了获得对用户输入控制的灵活性，这种交互工作交给了delegate，也就是“委托”，去完成。

简单来说，就像它们的名字一样，view 将用户输入委托给 delegate 处理，而自己不去处理这种输入，对这种控制委托的标准接口被定义在 QAbstractItemDelegate 类中。
elegate 可以用于渲染内容，这是通过 paint() 和 sizeHint() 函数来完成的。但是，对于一些简单的基于组件的delegate，可以通过继承 QItemDelegate 或者 QStyledItemDelegate 来实现。这样就可以避免要完全重写 QAbstractItemDelegate 中所需要的所有函数。对于一些相对比较通用的函数，在这两个类中已经有了一个默认的实现。

Qt提供的标准组件使用 QItemDelegate 提供编辑功能的支持。这种默认的实现被用在 QListView，QTableView 和 QTreeView 之中。view 实用的delegate可以通过 itemDelegate() 函数获得。setItemDelegate() 函数则可以为一个标准组件设置自定义的 delegate。

一个自定义的delegate也可以直接提供一个编辑器，而不是使用内置的编辑器工厂(editor item factory)。如果你需要这种功能，那么需要实现一下几个函数：
createEditor(): 返回修改数据的组件；
setEditorData(): 为editor提供编辑的原始数据；
updateEditorGeometry(): 保证editor显示在 item view 的合适位置以及大小；
setModelData(): 根据editor 的数据更新model的数据。

------

### 视图view（表示用户界面）

- 抽象基类 QAbstractItemView
- QListView—QListWidget\QUndoView
- QTableView—QTableWidget
- QTreeView—QTreeWidget
- QColumnView
- QHeaderView

实际上：QListWidget、QTableWidget、QTreeWidget已经包含数据，是模型与视图集成的类

### 代理delegate

> 自定义数据条目item的显示与编辑方式

- 抽象基类QAbstractItemDelegate
- QItemDelegate/QStyleItemDelegate
- 类QItemDelegate 由类QSqlRelationDelegate继承

#### (1)QTreeView

| Header       | #include<QTreeView> |
| ------------ | ------------------- |
| qmake        | QT+=widgets         |
| Inherits     | QAbstractItemView   |
| Inherited By | QTreeWidget         |

```
QFileSystemModel *model = new QFileSystemModel;
model->setRootPath(QDir::currentPath());
QTreeView *tree = new QTreeView(splitter ):
tree->setModel(model);
```

#### (2)QTableView

```
Widget::Widget (QWidget *parent)
    :QTableView(parent)
{
    QStandardItemModel* model = new QStandardItemModel(this);
    model->setItem(0,0,new QStandardItem("张三"));
    model->setItem(0,1,new QStandardItem("3"));
    model->setItem(0,2,new QStandardItem("男")) ;
    this->setModel(model) ;
}
```

```
Widget::Widget (QWidget *parent)
    :QTableView(parent)
{
    QStandardItemModel* model = new QStandardItemModel(this);
    //设置列字段名.
    model-> setColumnCount(3) ;
    model-> setHeaderData (0,Qt::Horizontal,"姓名");
    model-> setHeaderData(1,Qt::Horizontal, "年龄");
    model-> setHeaderData(2 ,Qt::Horizontal, "性别");
    //设置行字段名
    model-> setRowCount(3) ;
    model->setHeaderData(0,Qt::Vertical,"记录-");
    model->setHeaderData(1,Qt::Vertical,"记录二");
    model->setHeaderData(2,Qt::Vertical,"记录三");
    //设置-条数据
    model->setItem(0,0,new QStandardItem("张三"));
    model->setItem(0,1, new QStandardItem("3"));
    model->setItem(0,2,new QStandardItem("男"));
    this->setModel (model);
}
```
