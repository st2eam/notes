## QT样式表

QT样式表可以让你自定义任何一个QT控件的样式包括颜色、边框、背景等等（你想的到样式都可以），Qt样式表的概念、术语和语法与HTML的CSS样式表类似。

这里将所有内容分为了几部分：  

- The Style Sheet Syntax中介绍了Qt样式表的语法，就是一些使用规则；
- Qt Designer Integration中介绍了如何在设计器中使用Qt样式表；
- CustomizingQt Widgets Using Style Sheets中介绍了如何使用Qt样式表来定制部件样式；
- QtStyle Sheets Reference中罗列了Qt中所有可以使用样式表的部件；
- QtStyle Sheets Examples中列出了常用部件使用样式表的例子，这个是我们后面学习使用时的重要参考。

#### 样式规则

- **样式的规则1**：样式规则由选择器和声明组成。选择器指定哪些小部件受规则影响;声明指定应该在小部件上设置哪些属性。
- **样式的规则2**：可以为同一个声明指定多个选择器，使用逗号(，)分隔选择器。
- **样式的规则3**：声明多个属性。在{}里面，用 ; 分割
- **样式的规则4：选择器**

**4.1  通配选择器**

 \*  匹配所有的控件  

**4.2  类型选择器**  
类名 { 属性: 值; }  
QPushBuutton{ }

**4.3 属性选择器**

   QPushButton[flat="false"]

   匹配所有flat属性是false的QPushButton实例，注意该属性可以是自定义的属性，不一定非要是类本身具有的属性  
**4.4  类选择器**
格式
.类名 { 属性: 值; }

.QPushButton 
匹配所有QPushButton的实例，但是并不匹配其子类。这是与CSS中的类选择器不一样的地方，注意前面有一个点号
.RedButton { background: magenta; }  
**4.5  ID 选择器**  
格式
#id{ 属性: 值; }

这里的 id 指的是 objectName, 每个 QObject 类及其派生类都有的一个属性, “#” + objectName

 #myButton
 匹配所有id为myButton的控件实例，这里的id实际上就是objectName指定的值
#openButton, #closeButton { background: magenta; }

**4.6  后代选择器**  
选择器 1 选择器 2{ 属性: 值; }  
这个选择器表示: 在选择器 1 匹配的所有对象中, 找到选择器 2 所匹配的所有后代对象, 并 给它们设置样式. 

**4.7 子选择器**

选择器 1 >选择器 2 { 属性: 值; }  
子元素选择器表示找到指定选择器所匹配的对象中的所有特定直接子元素然后设置属性,
即找到选择器 1 匹配到的对象中的被选择器 2 匹配到的直接子元素然后设置属性  

QFrame> QPushButton
所有QFrame容器下面的QPushButton，其中要求QPushButton的直接父容器是QFrame,注意和后代选择器的区别

```
QFrame {background: gray;}
    QFrame > QPushButton {
        border: 2px solid magenta;
        border-radius: 10px;
        background: white;
        padding: 2px 15px; }
```

**4.8 伪类选择器**

类型选择器:状态{ 属性: 值; }  
类选择器:状态{ 属性: 值; }  
选择器:状态  
作为选择器，支持 ! 操作符，表示 非。  

```
QPushButton:hover { color: white }
QCheckBox:checked { color: white }
QCheckBox:!checked { color: red }
```

##### QSS伪状态与子控件伪状态列表

```
:checked                        /*button部件被选中*/ 
:unchecked                      /*button部件未被选中*/ 
:disabled                       /*部件被禁用*/ 
:enabled                        /*部件被启用*/ 
:focus                          /*部件获得焦点*/ 
:hover                          /*鼠标位于部件上*/ 
:indeterminate                  /*checkbox或radiobutton被部分选中*/ 
:off                            /*部件可以切换，且处于off状态*/ 
:on                             /*部件可以切换，且处于on状态*/ 
:pressed                        /*部件被鼠标按下*/ 
```

##### 子部件列表

```
::down-arrow         /*combo box或spin box的下拉箭头*/ 
::drop-down          /*combo box的下拉箭头*/ 

::indicator      /*checkbox、radio button或可选择group box的指示器*/ 
::item               /*menu、menu bar或status bar的子项目*/ 
::menu-indicator     /*push button的菜单指示器*/ 
::title              /*group box的标题*/ 

::down-button        /*spin box的向下按钮*/
::up-arrow           /*spin box的向上箭头*/ 
::up-button          /*spin box的向上按钮*/
```

#### 添加和读取QSS文件

1. QT添加资源文件.qrc  

2. 添加完前缀，同样在添加里选中添加文件，然后选中准备好的文件(图片、.qss文件等资源)  

3. 构建后，在代码处读取.qss文件，就可以给ui加皮肤了
   
   ```
   void MainWindow::setQtStyleSheet()
   {
    QFile file(":/Calculator.qss");
    file.open(QFile::ReadOnly);
    QString styleSheet = QLatin1String(file.readAll());
    QMainWindow::setStyleSheet(styleSheet);
    file.close();
   }
   ```
