import{_ as s,c as a,o as n,a4 as p}from"./chunks/framework.B-C7vMfR.js";const _=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"C++/QT/QT 国际化.md","filePath":"C++/QT/QT 国际化.md"}'),t={name:"C++/QT/QT 国际化.md"},e=p(`<h2 id="国际化" tabindex="-1">国际化 <a class="header-anchor" href="#国际化" aria-label="Permalink to &quot;国际化&quot;">​</a></h2><p>Qt中的国际化的方法有很多，常用的有使用QTextCodec类和使用tr()函数。前者将编码名称写到代码里面，除非你使用Unicode编码，否则国际化依然是一个问题；后者就不会有这个问题，并且这也是Qt推荐的做法。因此，我们主要来说使用tr()函数的方法进行应用程序的国际化。</p><p>翻译一个含有tr() 调用的的Qt应用程序就是一个由三步构成的过程：</p><p>1、运行lupdate、从应用程序的源代码中提取所有用户可见的字符串。</p><p>2、使用Qt Linguist 翻译该应用程序。</p><p>3、运行lresase，生成二进制的.qm 文件，应用程序可以使用QT&#39;ranslator加载这个文件。</p><hr><p>首先，我们需要在pro文件中增加一行</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>TRANSLATIONS += myapp.ts</span></span></code></pre></div><p>Qt Linguist，你可以在开始菜单的Qt项下面的Tools中找到。用它可以打开我们的ts文件，然后进行我们的翻译工作</p><p>完全翻译完成后保存文件，然后在文件菜单下有个“发布”。点击这个按钮，工程目录下会有一个myapp.qm文件，这就是我们翻译得到的文件。Qt的qm文件实际上是二进制格式的，因此它经过了高度的优化，体积很小。</p><p>下面我们要修改main()函数，使之加载这个qm文件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>int main(int argc, char *argv[])</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    QApplication a(argc, argv);</span></span>
<span class="line"><span>    QTranslator qtTranslator;</span></span>
<span class="line"><span>    qtTranslator.load(&quot;translate.qm&quot;, a.applicationDirPath());</span></span>
<span class="line"><span>    a.installTranslator(&amp;qtTranslator);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    MainWindow w;</span></span>
<span class="line"><span>    w.show();</span></span>
<span class="line"><span>    return a.exec();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这是由于我们使用load()函数加载qm文件时使用的是相对路径，这样直接load(“myapp.qm”)，其实会在当前编译后的exe所在目录下寻找这个qm文件，所以，只要我们把qm文件同exe放在同一目录下。</p><hr><p>在代码中，我们使用tr()将需要翻译的字符串标记出来。lupdate工具就是提取出tr()函数中的相关字符串。tr()函数是QObject类的一个static函数，其签名如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>static QString tr(const char *sourceText, const char *comment = 0, int n = -1);</span></span></code></pre></div><p>实际上tr()函数是接受3个参数的。第一个参数是我们需要翻译的文字，如果使用qm文件有对应的字符串，则使用对应的字符串进行替换，否则将显示sourceText参数指定的字符串。第二个参数是一个注释，用于解释前面的sourceText的含义。</p><p>最后一个参数n用于指定字符串是否为复数。我们知道，很多语言，比如英语，很多名词的单复数形式是不相同的，为了解决这个问题，Qt在tr()函数中提供了一个参数n</p><p>由于在Qt程序中，QCoreApplication是一个单例类，因此，Qt提供了一个宏qApp，用于很方便的访问QCoreApplication的这个单例。所以，在其他文件中，我们也可以直接调用qApp.translate()来替换tr()</p><p>如果你想要翻译函数外部的字符串，你需要使用两个宏QT_TR_NOOP()和QT_TRANSLATE_NOOP()。前者是用来翻译一个字符串，后者可以翻译多个字符串。它们的使用方法如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>QString FriendlyConversation::greeting(int type)</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>         static const char *greeting_strings[] = {</span></span>
<span class="line"><span>                 QT_TR_NOOP(&quot;Hello&quot;),</span></span>
<span class="line"><span>                 QT_TR_NOOP(&quot;Goodbye&quot;)</span></span>
<span class="line"><span>         };</span></span>
<span class="line"><span>         return tr(greeting_strings[type]);</span></span>
<span class="line"><span> }</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>static const char *greeting_strings[] = {</span></span>
<span class="line"><span>         QT_TRANSLATE_NOOP(&quot;FriendlyConversation&quot;, &quot;Hello&quot;),</span></span>
<span class="line"><span>         QT_TRANSLATE_NOOP(&quot;FriendlyConversation&quot;, &quot;Goodbye&quot;)</span></span>
<span class="line"><span> };</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>QString FriendlyConversation::greeting(int type)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return tr(greeting_strings[type]);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>QString global_greeting(int type)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return qApp-&gt;translate(&quot;FriendlyConversation&quot;,</span></span>
<span class="line"><span>                           greeting_strings[type]);</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,24),i=[e];function l(o,c,r,d,g,u){return n(),a("div",null,i)}const T=s(t,[["render",l]]);export{_ as __pageData,T as default};
