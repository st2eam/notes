## QT中的常用数据结构及函数

1. QString

2. QVariant

3. QStringList

4. QVector

5. QStack

6. QQueue

7. QList

8. QMap

### 一、QString

QString 是qt中关于String的封装类，用于处理字符串。

```qml
void testQString(){
   QString str1="hello";
   qDebug()<<str1;
   str1.append("word");
   qDebug()<<str1;//"hello word"
   qDebug()<<str1.indexOf("word");//5
   QString str2="Hello";
   qDebug()<<str2;
   str2.fill('x');//"xxxxx"
   qDebug()<<str2;
   str2.fill('x',2);//"xx"
   qDebug()<<str2;
   qDebug()<<QString().isEmpty();//true
   qDebug()<<QString("").isEmpty();//true
   qDebug()<<QString(" ").isEmpty();//false
   qDebug()<<QString("abc").isEmpty();//false
   qDebug()<<QString().isNull();//true
   qDebug()<<QString("").isNull();//false
   qDebug()<<QString(" adc").isNull();//false
   QString str3="Hello";
   qDebug()<<str3;
   qDebug()<<str3.left(3);//"hel"
   qDebug()<<str3.mid(2,2);//"ll"
   qDebug()<<str3.mid(2);//"llo"
   qDebug()<<str3.right(4);//"ello"
   QString str4="hello word";
   qDebug()<<str4;//"hello word"
   str4.remove(5,6);
   qDebug()<<str4;//"hello"
   QString str5="hello word";
   str5.insert(5,QString("word"));
   qDebug()<<str5;//"hello wordword"
   QString str6="hello word";
   QString re="you";
   str6.replace("word",re);
   qDebug()<<str6;//"hello you"
   QString path="/user/local/bin/mapp";
   qDebug()<<path;//"/user/local/bin/mapp"
   QStringList list=path.split('/',QString::SkipEmptyParts);
   qDebug()<<list;//("user,"local","bin","mapp")
   QString str7="hello word";
   qDebug()<<str7.startsWith("hello");//true
   qDebug()<<str7.endsWith("word");//true
   qDebug()<<QString("hello %1,helo you %2 ").arg("word").arg("hmf");//hello word,hello you hmf
   qDebug()<<QString::localeAwareCompare("xxx","XXX");//-1
}
```

### 二、QVariant

QVariant 是万能变量，可以存取各种变量。

```qml
void testQVariant(){
   QVariant var;
   var.setValue(QString("hello word"));
   qDebug()<<var;//QVariant(QString, "hello word")
   QString data=var.toString();
   qDebug()<<data;//"hello word"
   // var.clear();
   var.setValue(100);
   qDebug()<<var;//QVariant(int, 100)
   int d=var.toInt();
   qDebug()<<d;//100
   myStruct a;
   a.set_a(10);
   var=QVariant::fromValue(a);
   qDebug()<<var;//QVariant(myStruct, )
   qDebug()<<var.value<myStruct>().geta();//10
}
```

### 三、QStringList

QStringList 是存储QString类型的列表。

```qml
void testQStringList(){
   QStringList stL;
   stL<<"str1"<<"str2"<<"str3"<<"str4";
   qDebug()<<stL;//("str1", "str2", "str3", "str4")
   QString str1=stL.join("/");
   qDebug()<<str1;//"str1/str2/str3/str4"
   qDebug()<<stL.contains("str1");//true
   qDebug()<<stL.indexOf("str2");//1
   stL.append("str3");
   stL.append("str4");
   qDebug()<<stL;//("str1", "str2", "str3", "str4", "str3", "str4")
   stL.removeDuplicates();
   qDebug()<<stL;//("str1", "str2", "str3", "str4")
   //遍历方法1
   for (int i=0;i<stL.size();i++){
   qDebug()<<stL.at(i);
   }
   //遍历方法2
   QStringList::Iterator itr;
   for(itr=stL.begin();itr!=stL.end();++itr){
   qDebug()<<*itr;
   }
}
```

### 四、QVector

QVector 数组的模板类，本质是动态数组，存储方式是一片连续的内存空间。

```qml
void testQVector(){
   QVector<QString> tV;
   tV.append("Str1");
   tV.append("str2");
   tV.append("str3");
   tV.append("str4");
   qDebug()<<tV;//QVector("Str1", "str2", "str3", "str4")
   tV.prepend("str0");
   qDebug()<<tV;//QVector("str0", "Str1", "str2", "str3", "str4")
   tV.push_back("str5");
   qDebug()<<tV;//QVector("str0", "Str1", "str2", "str3", "str4", "str5")
   tV.push_front("str00");
   qDebug()<<tV;//QVector("str00", "str0", "Str1", "str2", "str3", "str4", "str5")
   for(int i=0;i<tV.size();i++){
   qDebug()<<tV.at(i);
   }
   QVector<QString>::Iterator itr;
   for(itr=tV.begin();itr!=tV.end();itr++){
   qDebug()<<*itr;
   }
   qDebug()<<tV.isEmpty();//false
   qDebug()<<tV.at(0);//"str00"
   qDebug()<<tV.value(3);//"str2"
   qDebug()<<tV.size();//7
   tV.pop_back();
   qDebug()<<tV;//QVector("str00", "str0", "Str1", "str2", "str3", "str4")
   tV.pop_front();
   qDebug()<<tV;//QVector("str0", "Str1", "str2", "str3", "str4")
}
```

### 五、QStack

QStack为qt中的栈模板类，继承于QVector，具有后进先出的特性。

```qml
void testQStack(){
   QStack<QString> stack;
   stack.push("str1");
   stack.push("str2");
   stack.push("str3");
   stack.push("str4");
   qDebug()<<stack;//QVector("str1", "str2", "str3", "str4")
   qDebug()<<stack.pop();//"str4"
   qDebug()<<stack;//QVector("str1", "str2", "str3")
   qDebug()<<stack.top();//"str3"
   qDebug()<<stack;//QVector("str1", "str2", "str3")
   qDebug()<<stack.isEmpty();//false
   qDebug()<<stack.size();//3
   while(!stack.isEmpty())
   {
   qDebug()<<stack.pop();
   }
}
'''
```

### 六、QQueue

QQueue 是qt中的队列的模板类，同样继承自QVector,具有先进先出的特性。

```qml
'''
void testQueue()
{
   QQueue<QString> qq;
   qq.enqueue("str1");
   qq.enqueue("str2");
   qq.enqueue("str3");
   qq.enqueue("str4");

  qDebug()<<qq;//("str1", "str2", "str3", "str4")
   qDebug()<<qq.head();//"str1"

  qDebug()<<qq.dequeue();//"str1"
   qDebug()<<qq;//("str2", "str3", "str4")

  qDebug()<<qq.isEmpty();//false

  qDebug()<<qq.size();//3
}
```

### 七、QList

QList是qt中的链表的实现，同时可以按位置索引和快速插入删除数据。

```qml
void testList(){
   QList<QString> ql;
   ql.append("str");
   ql.append("str1");
   ql.append("str2");
   ql.append("str3");
   ql.append("str4");
   ql.append("str5");
   qDebug()<<ql;//("str", "str1", "str2", "str3", "str4", "str5")
   for(int i=0;i<ql.size();i++){
   qDebug()<<ql.at(i);
   }
   QList<QString>::Iterator itr;
   for(itr=ql.begin();itr!=ql.end();itr++){
   qDebug()<<*itr;
   }
   ql.pop_back();
   qDebug()<<ql;//("str", "str1", "str2", "str3", "str4")
   ql.pop_front();
   qDebug()<<ql;//("str1", "str2", "str3", "str4")
   qDebug()<<ql.size();//4
   qDebug()<<ql.isEmpty();//false
}
```

### 八、QMap

QMap 是qt中映射的模板类。就是字典。

```qml
void testMap()
{
   QMap<QString,int> map;
   map["one"]=1;
   map.insert("two",2);
   map["three"]=3;
   map["four"]=4;
   map["five"]=5;
   qDebug()<<map;//QMap(("five", 5)("four", 4)("one", 1)("three", 3)("two", 2))
   qDebug()<<map.value("one");//1
   qDebug()<<map["two"];//2
   qDebug()<<map.contains("two");//true
   qDebug()<<map.keys();//("five", "four", "one", "three", "two")
   qDebug()<<map.values();//(5, 4, 1, 3, 2)
   //数据遍历
   QMapIterator<QString ,int> itr(map);
   while(itr.hasNext()){
   itr.next();
   qDebug()<<itr.key()<<itr.value();
   }
}
```
