import{_ as s,c as n,o as a,a4 as p}from"./chunks/framework.COET-Ywn.js";const m=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"C++/QT/QT 文件操作.md","filePath":"C++/QT/QT 文件操作.md"}'),e={name:"C++/QT/QT 文件操作.md"},t=p(`<h2 id="qt文件操作" tabindex="-1">QT文件操作 <a class="header-anchor" href="#qt文件操作" aria-label="Permalink to &quot;QT文件操作&quot;">​</a></h2><ul><li>QIODevice：所有 I/O 设备类的父类，提供了字节块读写的通用操作以及基本接口；</li><li>QFileDevice：Qt5新增加的类，提供了有关文件操作的通用实现。</li><li>QFlie：访问本地文件或者嵌入资源；</li><li>QTemporaryFile：创建和访问本地文件系统的临时文件；</li><li>QBuffer：读写QbyteArray, 内存文件；</li><li>QProcess：运行外部程序，处理进程间通讯；</li><li>QAbstractSocket：所有套接字类的父类；</li><li>QTcpSocket：TCP协议网络数据传输；</li><li>QUdpSocket：传输 UDP 报文；</li><li>QSslSocket：使用 SSL/TLS 传输数据； <img src="https://note.youdao.com/yws/res/6528/4D20E4C4ABA547EEB9F18E40D2FC800B" alt="image"></li></ul><h4 id="文本文件的读写" tabindex="-1">文本文件的读写 <a class="header-anchor" href="#文本文件的读写" aria-label="Permalink to &quot;文本文件的读写&quot;">​</a></h4><p>QFile提供了从文件中读取和写入数据的能力和有关文件的各种操作，比如打开、关闭、刷新、复制等。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>QFile file(&quot;test.txt&quot;);  </span></span>
<span class="line"><span>QTextStream aStream(&amp;file);</span></span></code></pre></div><p>打开：<code>file.open();</code><br> 关闭：<code>file.close()</code><br> 判断文件是否存在:<code>QFile::exists(fileName)</code><br> 拷贝文件：<code>file.copy(newFileName)</code><br> 移除文件：<code>QFile::remove(fileName)</code><br> 读取文件:<br><code>file.readLine()</code><br><code>file.readAll() </code><br><code>aStream.readLine()</code><br><code>aStream.readAll()</code><br> 获取文件大小：<code>file.size()</code></p><p>QDataStream类提供了二进制数据到QIODevice的串行化。 数据流是一个编码信息的二进制流，它与主机的操作系统、CPU或字节顺序100％的没有关系。</p><p>QDataStream类实现了基本类型的串行化，比如char、short、int、char*等等。更加复杂的类型的串行化是通过把数据分解为简单单元来实现的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>QFile file(&quot;file.dat&quot;);</span></span>
<span class="line"><span>file.open(QIODevice::WriteOnly);</span></span>
<span class="line"><span>QDataStream out(&amp;file);</span></span>
<span class="line"><span>out &lt;&lt; QString(&quot;the answer is&quot;);</span></span>
<span class="line"><span>file.close();</span></span></code></pre></div><p>Qt为文件和目录操作提供了一些类，用于文件目录的操作：</p><ul><li>QCoreApplication:用于提取应用程序路径、程序名等文件信息；</li><li>QFileInfo：用于提取文件的名称和位置信息包括路径、文件名、后缀等；</li><li>QDir:用于提取目录或文件信息，获取一个目录下的文件或目录列表，创建或删除目录和文件、文件重命名等操作；</li><li>QTemporaryFile:创建临时文件；</li><li>QFileSystemWatcher:文件和目录监听类，监听目录下的文件的添加、删除、修改等变化；</li><li>QSetting:配置文件的读写，注册表的读写,ini</li></ul><p><strong>配置文件和注册表的读写</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>//创建配置文件</span></span>
<span class="line"><span>QSettings iniFile(&quot;./test.ini&quot;, QSettings::IniFormat);</span></span>
<span class="line"><span>//iniFile.setIniCodec(QTextCodec::codecForName(&quot;utf-8&quot;)); //在此添加设置，即可读写ini文件中的中文</span></span>
<span class="line"><span>//写入数据</span></span>
<span class="line"><span>iniFile.setValue(&quot;/setting/value1&quot;, 1);</span></span>
<span class="line"><span>iniFile.setValue(&quot;/setting/value2&quot;, 2);</span></span>
<span class="line"><span>iniFile.beginGroup(&quot;setting&quot;); //切换到setting组之下</span></span>
<span class="line"><span>iniFile.setValue(&quot;value3&quot;, 3);</span></span>
<span class="line"><span>iniFile.endGroup(); //关闭分组定位,注意如果需切换分组，必须保证关闭。不然切换无效</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//注册表操作：</span></span>
<span class="line"><span>QSettings settings(&quot;HKEY_CURRENT_USER\\\\SOFTWARE\\\\Kingsoft\\\\WPSCloud\\\\usercenter&quot;, QSettings::NativeFormat);</span></span>
<span class="line"><span>int value = settings.value(&quot;AutoSync&quot;, 0).toInt();</span></span>
<span class="line"><span>qDebug() &lt;&lt; value;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>settings.setValue(&quot;TestSettings&quot;, &quot;This is a test&quot;);</span></span></code></pre></div><p><strong>QTextStream与QFile结合读取文件</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>    if (file.open(QIODevice::ReadOnly))</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        QTextStream aStream(&amp;file); //用文本流读取文件</span></span>
<span class="line"><span>        aStream.setAutoDetectUnicode(true); //自动检测Unicode,才能正常显示文档内的汉字</span></span>
<span class="line"><span>        QString str = aStream.readAll();</span></span>
<span class="line"><span>        qDebug() &lt;&lt; str;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        file.close();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //QTextStream与QFile结合读取文件 只读一行</span></span>
<span class="line"><span>    if (file.open(QIODevice::ReadOnly))</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        QTextStream aStream(&amp;file); //用文本流读取文件</span></span>
<span class="line"><span>        aStream.setAutoDetectUnicode(true); //自动检测Unicode,才能正常显示文档内的汉字</span></span>
<span class="line"><span>        QString str = aStream.readLine();</span></span>
<span class="line"><span>        qDebug() &lt;&lt; str;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        file.close();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //循环多行读取：</span></span>
<span class="line"><span>    if (file.open(QIODevice::ReadOnly))</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        QTextStream aStream(&amp;file); //用文本流读取文件</span></span>
<span class="line"><span>        aStream.setAutoDetectUnicode(true); //自动检测Unicode,才能正常显示文档内的汉字</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        while (!aStream.atEnd())</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            QString str = aStream.readLine();</span></span>
<span class="line"><span>            qDebug() &lt;&lt; str;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        file.close();</span></span>
<span class="line"><span>    }</span></span></code></pre></div><p><strong>读写二进制文件</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>void readWriteBinary()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    QFile file(&quot;binary.dat&quot;);</span></span>
<span class="line"><span>    if (file.open(QIODevice::WriteOnly))</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        QDataStream out(&amp;file);</span></span>
<span class="line"><span>        out &lt;&lt; QString(&quot;wps&quot;);</span></span>
<span class="line"><span>        file.close();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (file.open(QIODevice::ReadOnly))</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        QDataStream in(&amp;file);</span></span>
<span class="line"><span>        QString str;</span></span>
<span class="line"><span>        in &gt;&gt; str;</span></span>
<span class="line"><span>        file.close();</span></span>
<span class="line"><span>        qDebug() &lt;&lt; str;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>文件监听</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>    connect(&amp;myWatcher, SIGNAL(directoryChanged(QString)), this, SLOT(showMessage(QString)));</span></span>
<span class="line"><span>    connect(&amp;myWatcher, SIGNAL(fileChanged(QString)), this, SLOT(showMessage(QString)));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 显示出当前目录下的所有.h文件</span></span>
<span class="line"><span>    QDir myDir(QDir::currentPath());</span></span>
<span class="line"><span>    myDir.setNameFilters(QStringList{ &quot;*.txt&quot;,&quot;*.dat&quot; });</span></span>
<span class="line"><span>    ui-&gt;textBrowser-&gt;append(tr(&quot;监视的目录：&quot;) + myDir.absolutePath());</span></span>
<span class="line"><span>    myWatcher.addPath(myDir.absolutePath());</span></span>
<span class="line"><span>    ui-&gt;textBrowser-&gt;append(myDir.absolutePath() + tr(&quot;目录下的*.txt,*.dat文件有：&quot;));</span></span>
<span class="line"><span>    for (int i = 0; i &lt; myDir.entryList().size(); i++)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        ui-&gt;textBrowser-&gt;append(myDir.entryList()[i]);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 显示文件或目录改变信息</span></span>
<span class="line"><span>void MainWindow::showMessage(const QString&amp; path)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    QDir dir(QDir::currentPath());</span></span>
<span class="line"><span>    QString str;</span></span>
<span class="line"><span>    // 如果是目录发生了改变</span></span>
<span class="line"><span>    if (path == dir.absolutePath())</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        str = dir.dirName() + tr(&quot; 目录发生改变: &quot;);</span></span>
<span class="line"><span>        for (int i = 0; i &lt; dir.entryList().size(); i++)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            str += (dir.entryList()[i]);</span></span>
<span class="line"><span>            str += &#39;\\n&#39;;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 如果是文件发生了改变</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        str = path + tr(&quot; 文件发生改变&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    kmy-&gt;WriteLogTxtFile(str);</span></span>
<span class="line"><span>    kmy-&gt;WriteLogBinaryFile(str);</span></span>
<span class="line"><span>    ui-&gt;textBrowser-&gt;clear();</span></span>
<span class="line"><span>    kmy-&gt;ReadLogTxtFile();</span></span>
<span class="line"><span>    kmy-&gt;ReadLogBinaryFile();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>日志读取</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>void LogMessageOutput(QtMsgType type, const QMessageLogContext &amp;context, const QString &amp;msg);</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>qInstallMessageHandler(LogMessageOutput);</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>void LogMessageOutput(QtMsgType type, const QMessageLogContext &amp;context, const QString &amp;msg)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    QByteArray localMsg = msg.toLocal8Bit();</span></span>
<span class="line"><span>    QString str;</span></span>
<span class="line"><span>    switch (type) {</span></span>
<span class="line"><span>    case QtDebugMsg:</span></span>
<span class="line"><span>        //fprintf(stderr, &quot;Debug: %s (%s:%u, %s)\\n&quot;, localMsg.constData(), context.file, context.line, context.function);</span></span>
<span class="line"><span>        str = QString(&quot;Debug: %1 (%2:%3,%4)&quot;).arg(localMsg.constData()).arg(context.file).arg(context.line).arg(context.function);</span></span>
<span class="line"><span>        break;</span></span>
<span class="line"><span>    case QtInfoMsg:</span></span>
<span class="line"><span>        //fprintf(stderr, &quot;Info: %s (%s:%u, %s)\\n&quot;, localMsg.constData(), context.file, context.line, context.function);</span></span>
<span class="line"><span>        str = QString(&quot;Info: %1 (%2:%3,%4)&quot;).arg(localMsg.constData()).arg(context.file).arg(context.line).arg(context.function);</span></span>
<span class="line"><span>        break;</span></span>
<span class="line"><span>    case QtWarningMsg:</span></span>
<span class="line"><span>        //fprintf(stderr, &quot;Warning: %s (%s:%u, %s)\\n&quot;, localMsg.constData(), context.file, context.line, context.function);</span></span>
<span class="line"><span>        str = QString(&quot;Warning: %1 (%2:%3,%4)&quot;).arg(localMsg.constData()).arg(context.file).arg(context.line).arg(context.function);</span></span>
<span class="line"><span>        break;</span></span>
<span class="line"><span>    case QtCriticalMsg:</span></span>
<span class="line"><span>        //fprintf(stderr, &quot;Critical: %s (%s:%u, %s)\\n&quot;, localMsg.constData(), context.file, context.line, context.function);</span></span>
<span class="line"><span>        str = QString(&quot;Critical: %1 (%2:%3,%4)&quot;).arg(localMsg.constData()).arg(context.file).arg(context.line).arg(context.function);</span></span>
<span class="line"><span>        break;</span></span>
<span class="line"><span>    case QtFatalMsg:</span></span>
<span class="line"><span>        //fprintf(stderr, &quot;Fatal: %s (%s:%u, %s)\\n&quot;, localMsg.constData(), context.file, context.line, context.function);</span></span>
<span class="line"><span>        str = QString(&quot;Fatal: %1 (%2:%3,%4)&quot;).arg(localMsg.constData()).arg(context.file).arg(context.line).arg(context.function);</span></span>
<span class="line"><span>        abort();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    kmy-&gt;WriteLogTxtFile(str);</span></span>
<span class="line"><span>    kmy-&gt;WriteLogBinaryFile(str);</span></span>
<span class="line"><span>//    kmy-&gt;ReadLogTxtFile();</span></span>
<span class="line"><span>//    kmy-&gt;ReadLogBinaryFile();</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,22),l=[t];function i(c,o,r,g,u,d){return a(),n("div",null,l)}const Q=s(e,[["render",i]]);export{m as __pageData,Q as default};
