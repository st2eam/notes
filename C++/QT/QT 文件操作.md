## QT文件操作

- QIODevice：所有 I/O 设备类的父类，提供了字节块读写的通用操作以及基本接口；
- QFileDevice：Qt5新增加的类，提供了有关文件操作的通用实现。
- QFlie：访问本地文件或者嵌入资源；
- QTemporaryFile：创建和访问本地文件系统的临时文件；
- QBuffer：读写QbyteArray, 内存文件；
- QProcess：运行外部程序，处理进程间通讯；
- QAbstractSocket：所有套接字类的父类；
- QTcpSocket：TCP协议网络数据传输；
- QUdpSocket：传输 UDP 报文；
- QSslSocket：使用 SSL/TLS 传输数据；
  ![image](https://note.youdao.com/yws/res/6528/4D20E4C4ABA547EEB9F18E40D2FC800B)

#### 文本文件的读写

QFile提供了从文件中读取和写入数据的能力和有关文件的各种操作，比如打开、关闭、刷新、复制等。

```
QFile file("test.txt");  
QTextStream aStream(&file);
```

打开：```file.open();```  
关闭：```file.close()```  
判断文件是否存在:```QFile::exists(fileName)```  
拷贝文件：```file.copy(newFileName)```  
移除文件：```QFile::remove(fileName)```  
读取文件:  
```file.readLine()```  
```file.readAll() ```    
```aStream.readLine()```  
```aStream.readAll()```  
获取文件大小：```file.size()```  

QDataStream类提供了二进制数据到QIODevice的串行化。
数据流是一个编码信息的二进制流，它与主机的操作系统、CPU或字节顺序100％的没有关系。

QDataStream类实现了基本类型的串行化，比如char、short、int、char*等等。更加复杂的类型的串行化是通过把数据分解为简单单元来实现的。 

```
QFile file("file.dat");
file.open(QIODevice::WriteOnly);
QDataStream out(&file);
out << QString("the answer is");
file.close();
```

Qt为文件和目录操作提供了一些类，用于文件目录的操作：

- QCoreApplication:用于提取应用程序路径、程序名等文件信息；
- QFileInfo：用于提取文件的名称和位置信息包括路径、文件名、后缀等；
- QDir:用于提取目录或文件信息，获取一个目录下的文件或目录列表，创建或删除目录和文件、文件重命名等操作；
- QTemporaryFile:创建临时文件；
- QFileSystemWatcher:文件和目录监听类，监听目录下的文件的添加、删除、修改等变化；
- QSetting:配置文件的读写，注册表的读写,ini

**配置文件和注册表的读写**

```
//创建配置文件
QSettings iniFile("./test.ini", QSettings::IniFormat);
//iniFile.setIniCodec(QTextCodec::codecForName("utf-8")); //在此添加设置，即可读写ini文件中的中文
//写入数据
iniFile.setValue("/setting/value1", 1);
iniFile.setValue("/setting/value2", 2);
iniFile.beginGroup("setting"); //切换到setting组之下
iniFile.setValue("value3", 3);
iniFile.endGroup(); //关闭分组定位,注意如果需切换分组，必须保证关闭。不然切换无效

//注册表操作：
QSettings settings("HKEY_CURRENT_USER\\SOFTWARE\\Kingsoft\\WPSCloud\\usercenter", QSettings::NativeFormat);
int value = settings.value("AutoSync", 0).toInt();
qDebug() << value;

settings.setValue("TestSettings", "This is a test");
```

**QTextStream与QFile结合读取文件**

```
    if (file.open(QIODevice::ReadOnly))
    {
        QTextStream aStream(&file); //用文本流读取文件
        aStream.setAutoDetectUnicode(true); //自动检测Unicode,才能正常显示文档内的汉字
        QString str = aStream.readAll();
        qDebug() << str;

        file.close();
    }

    //QTextStream与QFile结合读取文件 只读一行
    if (file.open(QIODevice::ReadOnly))
    {
        QTextStream aStream(&file); //用文本流读取文件
        aStream.setAutoDetectUnicode(true); //自动检测Unicode,才能正常显示文档内的汉字
        QString str = aStream.readLine();
        qDebug() << str;

        file.close();
    }

    //循环多行读取：
    if (file.open(QIODevice::ReadOnly))
    {
        QTextStream aStream(&file); //用文本流读取文件
        aStream.setAutoDetectUnicode(true); //自动检测Unicode,才能正常显示文档内的汉字

        while (!aStream.atEnd())
        {
            QString str = aStream.readLine();
            qDebug() << str;
        }
        file.close();
    }
```

**读写二进制文件**

```
void readWriteBinary()
{
    QFile file("binary.dat");
    if (file.open(QIODevice::WriteOnly))
    {
        QDataStream out(&file);
        out << QString("wps");
        file.close();
    }

    if (file.open(QIODevice::ReadOnly))
    {
        QDataStream in(&file);
        QString str;
        in >> str;
        file.close();
        qDebug() << str;
    }
}
```

**文件监听**

```
    connect(&myWatcher, SIGNAL(directoryChanged(QString)), this, SLOT(showMessage(QString)));
    connect(&myWatcher, SIGNAL(fileChanged(QString)), this, SLOT(showMessage(QString)));

    // 显示出当前目录下的所有.h文件
    QDir myDir(QDir::currentPath());
    myDir.setNameFilters(QStringList{ "*.txt","*.dat" });
    ui->textBrowser->append(tr("监视的目录：") + myDir.absolutePath());
    myWatcher.addPath(myDir.absolutePath());
    ui->textBrowser->append(myDir.absolutePath() + tr("目录下的*.txt,*.dat文件有："));
    for (int i = 0; i < myDir.entryList().size(); i++)
    {
        ui->textBrowser->append(myDir.entryList()[i]);
    }
}

// 显示文件或目录改变信息
void MainWindow::showMessage(const QString& path)
{

    QDir dir(QDir::currentPath());
    QString str;
    // 如果是目录发生了改变
    if (path == dir.absolutePath())
    {
        str = dir.dirName() + tr(" 目录发生改变: ");
        for (int i = 0; i < dir.entryList().size(); i++)
        {
            str += (dir.entryList()[i]);
            str += '\n';
        }
    }
    // 如果是文件发生了改变
    else
    {
        str = path + tr(" 文件发生改变");
    }
    kmy->WriteLogTxtFile(str);
    kmy->WriteLogBinaryFile(str);
    ui->textBrowser->clear();
    kmy->ReadLogTxtFile();
    kmy->ReadLogBinaryFile();
}
```

**日志读取**

```
void LogMessageOutput(QtMsgType type, const QMessageLogContext &context, const QString &msg);


qInstallMessageHandler(LogMessageOutput);
```

```
void LogMessageOutput(QtMsgType type, const QMessageLogContext &context, const QString &msg)
{
    QByteArray localMsg = msg.toLocal8Bit();
    QString str;
    switch (type) {
    case QtDebugMsg:
        //fprintf(stderr, "Debug: %s (%s:%u, %s)\n", localMsg.constData(), context.file, context.line, context.function);
        str = QString("Debug: %1 (%2:%3,%4)").arg(localMsg.constData()).arg(context.file).arg(context.line).arg(context.function);
        break;
    case QtInfoMsg:
        //fprintf(stderr, "Info: %s (%s:%u, %s)\n", localMsg.constData(), context.file, context.line, context.function);
        str = QString("Info: %1 (%2:%3,%4)").arg(localMsg.constData()).arg(context.file).arg(context.line).arg(context.function);
        break;
    case QtWarningMsg:
        //fprintf(stderr, "Warning: %s (%s:%u, %s)\n", localMsg.constData(), context.file, context.line, context.function);
        str = QString("Warning: %1 (%2:%3,%4)").arg(localMsg.constData()).arg(context.file).arg(context.line).arg(context.function);
        break;
    case QtCriticalMsg:
        //fprintf(stderr, "Critical: %s (%s:%u, %s)\n", localMsg.constData(), context.file, context.line, context.function);
        str = QString("Critical: %1 (%2:%3,%4)").arg(localMsg.constData()).arg(context.file).arg(context.line).arg(context.function);
        break;
    case QtFatalMsg:
        //fprintf(stderr, "Fatal: %s (%s:%u, %s)\n", localMsg.constData(), context.file, context.line, context.function);
        str = QString("Fatal: %1 (%2:%3,%4)").arg(localMsg.constData()).arg(context.file).arg(context.line).arg(context.function);
        abort();
    }
    kmy->WriteLogTxtFile(str);
    kmy->WriteLogBinaryFile(str);
//    kmy->ReadLogTxtFile();
//    kmy->ReadLogBinaryFile();
}
```
