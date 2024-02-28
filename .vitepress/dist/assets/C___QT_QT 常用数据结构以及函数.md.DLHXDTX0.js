import{_ as s,c as n,o as a,a4 as t}from"./chunks/framework.BtCE5x9j.js";const h=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"C++/QT/QT 常用数据结构以及函数.md","filePath":"C++/QT/QT 常用数据结构以及函数.md"}'),p={name:"C++/QT/QT 常用数据结构以及函数.md"},l=t(`<h2 id="qt中的常用数据结构及函数" tabindex="-1">QT中的常用数据结构及函数 <a class="header-anchor" href="#qt中的常用数据结构及函数" aria-label="Permalink to &quot;QT中的常用数据结构及函数&quot;">​</a></h2><ol><li><p>QString</p></li><li><p>QVariant</p></li><li><p>QStringList</p></li><li><p>QVector</p></li><li><p>QStack</p></li><li><p>QQueue</p></li><li><p>QList</p></li><li><p>QMap</p></li></ol><h3 id="一、qstring" tabindex="-1">一、QString <a class="header-anchor" href="#一、qstring" aria-label="Permalink to &quot;一、QString&quot;">​</a></h3><p>QString 是qt中关于String的封装类，用于处理字符串。</p><div class="language-qml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">qml</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>void testQString(){</span></span>
<span class="line"><span>   QString str1=&quot;hello&quot;;</span></span>
<span class="line"><span>   qDebug()&lt;&lt;str1;</span></span>
<span class="line"><span>   str1.append(&quot;word&quot;);</span></span>
<span class="line"><span>   qDebug()&lt;&lt;str1;//&quot;hello word&quot;</span></span>
<span class="line"><span>   qDebug()&lt;&lt;str1.indexOf(&quot;word&quot;);//5</span></span>
<span class="line"><span>   QString str2=&quot;Hello&quot;;</span></span>
<span class="line"><span>   qDebug()&lt;&lt;str2;</span></span>
<span class="line"><span>   str2.fill(&#39;x&#39;);//&quot;xxxxx&quot;</span></span>
<span class="line"><span>   qDebug()&lt;&lt;str2;</span></span>
<span class="line"><span>   str2.fill(&#39;x&#39;,2);//&quot;xx&quot;</span></span>
<span class="line"><span>   qDebug()&lt;&lt;str2;</span></span>
<span class="line"><span>   qDebug()&lt;&lt;QString().isEmpty();//true</span></span>
<span class="line"><span>   qDebug()&lt;&lt;QString(&quot;&quot;).isEmpty();//true</span></span>
<span class="line"><span>   qDebug()&lt;&lt;QString(&quot; &quot;).isEmpty();//false</span></span>
<span class="line"><span>   qDebug()&lt;&lt;QString(&quot;abc&quot;).isEmpty();//false</span></span>
<span class="line"><span>   qDebug()&lt;&lt;QString().isNull();//true</span></span>
<span class="line"><span>   qDebug()&lt;&lt;QString(&quot;&quot;).isNull();//false</span></span>
<span class="line"><span>   qDebug()&lt;&lt;QString(&quot; adc&quot;).isNull();//false</span></span>
<span class="line"><span>   QString str3=&quot;Hello&quot;;</span></span>
<span class="line"><span>   qDebug()&lt;&lt;str3;</span></span>
<span class="line"><span>   qDebug()&lt;&lt;str3.left(3);//&quot;hel&quot;</span></span>
<span class="line"><span>   qDebug()&lt;&lt;str3.mid(2,2);//&quot;ll&quot;</span></span>
<span class="line"><span>   qDebug()&lt;&lt;str3.mid(2);//&quot;llo&quot;</span></span>
<span class="line"><span>   qDebug()&lt;&lt;str3.right(4);//&quot;ello&quot;</span></span>
<span class="line"><span>   QString str4=&quot;hello word&quot;;</span></span>
<span class="line"><span>   qDebug()&lt;&lt;str4;//&quot;hello word&quot;</span></span>
<span class="line"><span>   str4.remove(5,6);</span></span>
<span class="line"><span>   qDebug()&lt;&lt;str4;//&quot;hello&quot;</span></span>
<span class="line"><span>   QString str5=&quot;hello word&quot;;</span></span>
<span class="line"><span>   str5.insert(5,QString(&quot;word&quot;));</span></span>
<span class="line"><span>   qDebug()&lt;&lt;str5;//&quot;hello wordword&quot;</span></span>
<span class="line"><span>   QString str6=&quot;hello word&quot;;</span></span>
<span class="line"><span>   QString re=&quot;you&quot;;</span></span>
<span class="line"><span>   str6.replace(&quot;word&quot;,re);</span></span>
<span class="line"><span>   qDebug()&lt;&lt;str6;//&quot;hello you&quot;</span></span>
<span class="line"><span>   QString path=&quot;/user/local/bin/mapp&quot;;</span></span>
<span class="line"><span>   qDebug()&lt;&lt;path;//&quot;/user/local/bin/mapp&quot;</span></span>
<span class="line"><span>   QStringList list=path.split(&#39;/&#39;,QString::SkipEmptyParts);</span></span>
<span class="line"><span>   qDebug()&lt;&lt;list;//(&quot;user,&quot;local&quot;,&quot;bin&quot;,&quot;mapp&quot;)</span></span>
<span class="line"><span>   QString str7=&quot;hello word&quot;;</span></span>
<span class="line"><span>   qDebug()&lt;&lt;str7.startsWith(&quot;hello&quot;);//true</span></span>
<span class="line"><span>   qDebug()&lt;&lt;str7.endsWith(&quot;word&quot;);//true</span></span>
<span class="line"><span>   qDebug()&lt;&lt;QString(&quot;hello %1,helo you %2 &quot;).arg(&quot;word&quot;).arg(&quot;hmf&quot;);//hello word,hello you hmf</span></span>
<span class="line"><span>   qDebug()&lt;&lt;QString::localeAwareCompare(&quot;xxx&quot;,&quot;XXX&quot;);//-1</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="二、qvariant" tabindex="-1">二、QVariant <a class="header-anchor" href="#二、qvariant" aria-label="Permalink to &quot;二、QVariant&quot;">​</a></h3><p>QVariant 是万能变量，可以存取各种变量。</p><div class="language-qml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">qml</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>void testQVariant(){</span></span>
<span class="line"><span>   QVariant var;</span></span>
<span class="line"><span>   var.setValue(QString(&quot;hello word&quot;));</span></span>
<span class="line"><span>   qDebug()&lt;&lt;var;//QVariant(QString, &quot;hello word&quot;)</span></span>
<span class="line"><span>   QString data=var.toString();</span></span>
<span class="line"><span>   qDebug()&lt;&lt;data;//&quot;hello word&quot;</span></span>
<span class="line"><span>   // var.clear();</span></span>
<span class="line"><span>   var.setValue(100);</span></span>
<span class="line"><span>   qDebug()&lt;&lt;var;//QVariant(int, 100)</span></span>
<span class="line"><span>   int d=var.toInt();</span></span>
<span class="line"><span>   qDebug()&lt;&lt;d;//100</span></span>
<span class="line"><span>   myStruct a;</span></span>
<span class="line"><span>   a.set_a(10);</span></span>
<span class="line"><span>   var=QVariant::fromValue(a);</span></span>
<span class="line"><span>   qDebug()&lt;&lt;var;//QVariant(myStruct, )</span></span>
<span class="line"><span>   qDebug()&lt;&lt;var.value&lt;myStruct&gt;().geta();//10</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="三、qstringlist" tabindex="-1">三、QStringList <a class="header-anchor" href="#三、qstringlist" aria-label="Permalink to &quot;三、QStringList&quot;">​</a></h3><p>QStringList 是存储QString类型的列表。</p><div class="language-qml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">qml</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>void testQStringList(){</span></span>
<span class="line"><span>   QStringList stL;</span></span>
<span class="line"><span>   stL&lt;&lt;&quot;str1&quot;&lt;&lt;&quot;str2&quot;&lt;&lt;&quot;str3&quot;&lt;&lt;&quot;str4&quot;;</span></span>
<span class="line"><span>   qDebug()&lt;&lt;stL;//(&quot;str1&quot;, &quot;str2&quot;, &quot;str3&quot;, &quot;str4&quot;)</span></span>
<span class="line"><span>   QString str1=stL.join(&quot;/&quot;);</span></span>
<span class="line"><span>   qDebug()&lt;&lt;str1;//&quot;str1/str2/str3/str4&quot;</span></span>
<span class="line"><span>   qDebug()&lt;&lt;stL.contains(&quot;str1&quot;);//true</span></span>
<span class="line"><span>   qDebug()&lt;&lt;stL.indexOf(&quot;str2&quot;);//1</span></span>
<span class="line"><span>   stL.append(&quot;str3&quot;);</span></span>
<span class="line"><span>   stL.append(&quot;str4&quot;);</span></span>
<span class="line"><span>   qDebug()&lt;&lt;stL;//(&quot;str1&quot;, &quot;str2&quot;, &quot;str3&quot;, &quot;str4&quot;, &quot;str3&quot;, &quot;str4&quot;)</span></span>
<span class="line"><span>   stL.removeDuplicates();</span></span>
<span class="line"><span>   qDebug()&lt;&lt;stL;//(&quot;str1&quot;, &quot;str2&quot;, &quot;str3&quot;, &quot;str4&quot;)</span></span>
<span class="line"><span>   //遍历方法1</span></span>
<span class="line"><span>   for (int i=0;i&lt;stL.size();i++){</span></span>
<span class="line"><span>   qDebug()&lt;&lt;stL.at(i);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   //遍历方法2</span></span>
<span class="line"><span>   QStringList::Iterator itr;</span></span>
<span class="line"><span>   for(itr=stL.begin();itr!=stL.end();++itr){</span></span>
<span class="line"><span>   qDebug()&lt;&lt;*itr;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="四、qvector" tabindex="-1">四、QVector <a class="header-anchor" href="#四、qvector" aria-label="Permalink to &quot;四、QVector&quot;">​</a></h3><p>QVector 数组的模板类，本质是动态数组，存储方式是一片连续的内存空间。</p><div class="language-qml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">qml</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>void testQVector(){</span></span>
<span class="line"><span>   QVector&lt;QString&gt; tV;</span></span>
<span class="line"><span>   tV.append(&quot;Str1&quot;);</span></span>
<span class="line"><span>   tV.append(&quot;str2&quot;);</span></span>
<span class="line"><span>   tV.append(&quot;str3&quot;);</span></span>
<span class="line"><span>   tV.append(&quot;str4&quot;);</span></span>
<span class="line"><span>   qDebug()&lt;&lt;tV;//QVector(&quot;Str1&quot;, &quot;str2&quot;, &quot;str3&quot;, &quot;str4&quot;)</span></span>
<span class="line"><span>   tV.prepend(&quot;str0&quot;);</span></span>
<span class="line"><span>   qDebug()&lt;&lt;tV;//QVector(&quot;str0&quot;, &quot;Str1&quot;, &quot;str2&quot;, &quot;str3&quot;, &quot;str4&quot;)</span></span>
<span class="line"><span>   tV.push_back(&quot;str5&quot;);</span></span>
<span class="line"><span>   qDebug()&lt;&lt;tV;//QVector(&quot;str0&quot;, &quot;Str1&quot;, &quot;str2&quot;, &quot;str3&quot;, &quot;str4&quot;, &quot;str5&quot;)</span></span>
<span class="line"><span>   tV.push_front(&quot;str00&quot;);</span></span>
<span class="line"><span>   qDebug()&lt;&lt;tV;//QVector(&quot;str00&quot;, &quot;str0&quot;, &quot;Str1&quot;, &quot;str2&quot;, &quot;str3&quot;, &quot;str4&quot;, &quot;str5&quot;)</span></span>
<span class="line"><span>   for(int i=0;i&lt;tV.size();i++){</span></span>
<span class="line"><span>   qDebug()&lt;&lt;tV.at(i);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   QVector&lt;QString&gt;::Iterator itr;</span></span>
<span class="line"><span>   for(itr=tV.begin();itr!=tV.end();itr++){</span></span>
<span class="line"><span>   qDebug()&lt;&lt;*itr;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   qDebug()&lt;&lt;tV.isEmpty();//false</span></span>
<span class="line"><span>   qDebug()&lt;&lt;tV.at(0);//&quot;str00&quot;</span></span>
<span class="line"><span>   qDebug()&lt;&lt;tV.value(3);//&quot;str2&quot;</span></span>
<span class="line"><span>   qDebug()&lt;&lt;tV.size();//7</span></span>
<span class="line"><span>   tV.pop_back();</span></span>
<span class="line"><span>   qDebug()&lt;&lt;tV;//QVector(&quot;str00&quot;, &quot;str0&quot;, &quot;Str1&quot;, &quot;str2&quot;, &quot;str3&quot;, &quot;str4&quot;)</span></span>
<span class="line"><span>   tV.pop_front();</span></span>
<span class="line"><span>   qDebug()&lt;&lt;tV;//QVector(&quot;str0&quot;, &quot;Str1&quot;, &quot;str2&quot;, &quot;str3&quot;, &quot;str4&quot;)</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="五、qstack" tabindex="-1">五、QStack <a class="header-anchor" href="#五、qstack" aria-label="Permalink to &quot;五、QStack&quot;">​</a></h3><p>QStack为qt中的栈模板类，继承于QVector，具有后进先出的特性。</p><div class="language-qml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">qml</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>void testQStack(){</span></span>
<span class="line"><span>   QStack&lt;QString&gt; stack;</span></span>
<span class="line"><span>   stack.push(&quot;str1&quot;);</span></span>
<span class="line"><span>   stack.push(&quot;str2&quot;);</span></span>
<span class="line"><span>   stack.push(&quot;str3&quot;);</span></span>
<span class="line"><span>   stack.push(&quot;str4&quot;);</span></span>
<span class="line"><span>   qDebug()&lt;&lt;stack;//QVector(&quot;str1&quot;, &quot;str2&quot;, &quot;str3&quot;, &quot;str4&quot;)</span></span>
<span class="line"><span>   qDebug()&lt;&lt;stack.pop();//&quot;str4&quot;</span></span>
<span class="line"><span>   qDebug()&lt;&lt;stack;//QVector(&quot;str1&quot;, &quot;str2&quot;, &quot;str3&quot;)</span></span>
<span class="line"><span>   qDebug()&lt;&lt;stack.top();//&quot;str3&quot;</span></span>
<span class="line"><span>   qDebug()&lt;&lt;stack;//QVector(&quot;str1&quot;, &quot;str2&quot;, &quot;str3&quot;)</span></span>
<span class="line"><span>   qDebug()&lt;&lt;stack.isEmpty();//false</span></span>
<span class="line"><span>   qDebug()&lt;&lt;stack.size();//3</span></span>
<span class="line"><span>   while(!stack.isEmpty())</span></span>
<span class="line"><span>   {</span></span>
<span class="line"><span>   qDebug()&lt;&lt;stack.pop();</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>&#39;&#39;&#39;</span></span></code></pre></div><h3 id="六、qqueue" tabindex="-1">六、QQueue <a class="header-anchor" href="#六、qqueue" aria-label="Permalink to &quot;六、QQueue&quot;">​</a></h3><p>QQueue 是qt中的队列的模板类，同样继承自QVector,具有先进先出的特性。</p><div class="language-qml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">qml</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>&#39;&#39;&#39;</span></span>
<span class="line"><span>void testQueue()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>   QQueue&lt;QString&gt; qq;</span></span>
<span class="line"><span>   qq.enqueue(&quot;str1&quot;);</span></span>
<span class="line"><span>   qq.enqueue(&quot;str2&quot;);</span></span>
<span class="line"><span>   qq.enqueue(&quot;str3&quot;);</span></span>
<span class="line"><span>   qq.enqueue(&quot;str4&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  qDebug()&lt;&lt;qq;//(&quot;str1&quot;, &quot;str2&quot;, &quot;str3&quot;, &quot;str4&quot;)</span></span>
<span class="line"><span>   qDebug()&lt;&lt;qq.head();//&quot;str1&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  qDebug()&lt;&lt;qq.dequeue();//&quot;str1&quot;</span></span>
<span class="line"><span>   qDebug()&lt;&lt;qq;//(&quot;str2&quot;, &quot;str3&quot;, &quot;str4&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  qDebug()&lt;&lt;qq.isEmpty();//false</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  qDebug()&lt;&lt;qq.size();//3</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="七、qlist" tabindex="-1">七、QList <a class="header-anchor" href="#七、qlist" aria-label="Permalink to &quot;七、QList&quot;">​</a></h3><p>QList是qt中的链表的实现，同时可以按位置索引和快速插入删除数据。</p><div class="language-qml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">qml</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>void testList(){</span></span>
<span class="line"><span>   QList&lt;QString&gt; ql;</span></span>
<span class="line"><span>   ql.append(&quot;str&quot;);</span></span>
<span class="line"><span>   ql.append(&quot;str1&quot;);</span></span>
<span class="line"><span>   ql.append(&quot;str2&quot;);</span></span>
<span class="line"><span>   ql.append(&quot;str3&quot;);</span></span>
<span class="line"><span>   ql.append(&quot;str4&quot;);</span></span>
<span class="line"><span>   ql.append(&quot;str5&quot;);</span></span>
<span class="line"><span>   qDebug()&lt;&lt;ql;//(&quot;str&quot;, &quot;str1&quot;, &quot;str2&quot;, &quot;str3&quot;, &quot;str4&quot;, &quot;str5&quot;)</span></span>
<span class="line"><span>   for(int i=0;i&lt;ql.size();i++){</span></span>
<span class="line"><span>   qDebug()&lt;&lt;ql.at(i);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   QList&lt;QString&gt;::Iterator itr;</span></span>
<span class="line"><span>   for(itr=ql.begin();itr!=ql.end();itr++){</span></span>
<span class="line"><span>   qDebug()&lt;&lt;*itr;</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   ql.pop_back();</span></span>
<span class="line"><span>   qDebug()&lt;&lt;ql;//(&quot;str&quot;, &quot;str1&quot;, &quot;str2&quot;, &quot;str3&quot;, &quot;str4&quot;)</span></span>
<span class="line"><span>   ql.pop_front();</span></span>
<span class="line"><span>   qDebug()&lt;&lt;ql;//(&quot;str1&quot;, &quot;str2&quot;, &quot;str3&quot;, &quot;str4&quot;)</span></span>
<span class="line"><span>   qDebug()&lt;&lt;ql.size();//4</span></span>
<span class="line"><span>   qDebug()&lt;&lt;ql.isEmpty();//false</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="八、qmap" tabindex="-1">八、QMap <a class="header-anchor" href="#八、qmap" aria-label="Permalink to &quot;八、QMap&quot;">​</a></h3><p>QMap 是qt中映射的模板类。就是字典。</p><div class="language-qml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">qml</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>void testMap()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>   QMap&lt;QString,int&gt; map;</span></span>
<span class="line"><span>   map[&quot;one&quot;]=1;</span></span>
<span class="line"><span>   map.insert(&quot;two&quot;,2);</span></span>
<span class="line"><span>   map[&quot;three&quot;]=3;</span></span>
<span class="line"><span>   map[&quot;four&quot;]=4;</span></span>
<span class="line"><span>   map[&quot;five&quot;]=5;</span></span>
<span class="line"><span>   qDebug()&lt;&lt;map;//QMap((&quot;five&quot;, 5)(&quot;four&quot;, 4)(&quot;one&quot;, 1)(&quot;three&quot;, 3)(&quot;two&quot;, 2))</span></span>
<span class="line"><span>   qDebug()&lt;&lt;map.value(&quot;one&quot;);//1</span></span>
<span class="line"><span>   qDebug()&lt;&lt;map[&quot;two&quot;];//2</span></span>
<span class="line"><span>   qDebug()&lt;&lt;map.contains(&quot;two&quot;);//true</span></span>
<span class="line"><span>   qDebug()&lt;&lt;map.keys();//(&quot;five&quot;, &quot;four&quot;, &quot;one&quot;, &quot;three&quot;, &quot;two&quot;)</span></span>
<span class="line"><span>   qDebug()&lt;&lt;map.values();//(5, 4, 1, 3, 2)</span></span>
<span class="line"><span>   //数据遍历</span></span>
<span class="line"><span>   QMapIterator&lt;QString ,int&gt; itr(map);</span></span>
<span class="line"><span>   while(itr.hasNext()){</span></span>
<span class="line"><span>   itr.next();</span></span>
<span class="line"><span>   qDebug()&lt;&lt;itr.key()&lt;&lt;itr.value();</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,26),e=[l];function o(u,q,i,r,c,g){return a(),n("div",null,e)}const b=s(p,[["render",o]]);export{h as __pageData,b as default};
