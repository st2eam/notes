import{_ as s,c as a,o as i,a4 as l}from"./chunks/framework.BtCE5x9j.js";const g=JSON.parse('{"title":"安装","description":"","frontmatter":{},"headers":[],"relativePath":"Python/flask/快速上手.md","filePath":"Python/flask/快速上手.md"}'),e={name:"Python/flask/快速上手.md"},t=l(`<h1 id="安装" tabindex="-1">安装 <a class="header-anchor" href="#安装" aria-label="Permalink to &quot;安装&quot;">​</a></h1><h2 id="依赖" tabindex="-1">依赖 <a class="header-anchor" href="#依赖" aria-label="Permalink to &quot;依赖&quot;">​</a></h2><p>当安装 Flask 时，以下配套软件会被自动安装。</p><p>Werkzeug 用于实现 WSGI ，应用和服务之间的标准 Python 接口。</p><p>Jinja 用于渲染页面的模板语言。</p><p>MarkupSafe 与 Jinja 共用，在渲染页面时用于避免不可信的输入，防止注入攻击。</p><p>ItsDangerous 保证数据完整性的安全标志数据，用于保护 Flask 的 session cookie.</p><p>Click 是一个命令行应用的框架。用于提供 flask 命令，并允许添加自定义 管理命令。</p><h2 id="可选依赖" tabindex="-1">可选依赖 <a class="header-anchor" href="#可选依赖" aria-label="Permalink to &quot;可选依赖&quot;">​</a></h2><p>以下配套软件不会被自动安装。如果安装了，那么 Flask 会检测到这些软件。</p><p>Blinker 为 信号 提供支持。</p><p>SimpleJSON 是一个快速的 JSON 实现，兼容 Python’s json 模块。如果安装 了这个软件，那么会优先使用这个软件来进行 JSON 操作。</p><p>python-dotenv 当运行 flask 命令时为 通过 dotenv 设置环境变量 提供支持。</p><p>Watchdog 为开发服务器提供快速高效的重载。</p><h2 id="虚拟环境" tabindex="-1">虚拟环境 <a class="header-anchor" href="#虚拟环境" aria-label="Permalink to &quot;虚拟环境&quot;">​</a></h2><p>建议在开发环境和生产环境下都使用虚拟环境来管理项目的依赖。</p><p><strong>为什么要使用虚拟环境？</strong> 随着你的 Python 项目越来越多，你会发现不同的项目会需要 不同的版本的 Python 库。同一个 Python 库的不同版本可能不兼容。</p><p>虚拟环境可以为每一个项目安装独立的 Python 库，这样就可以隔离不同项目之间的 Python 库，也可以隔离项目与操作系统之间的 Python 库。</p><p>Python 3 内置了用于创建虚拟环境的 venv 模块。</p><h3 id="创建一个虚拟环境-windows下" tabindex="-1">创建一个虚拟环境（windows下） <a class="header-anchor" href="#创建一个虚拟环境-windows下" aria-label="Permalink to &quot;创建一个虚拟环境（windows下）&quot;">​</a></h3><p>创建一个项目文件夹，然后创建一个虚拟环境。创建完成后项目文件夹中会有一个 venv 文件夹：</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">py</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -3</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -m</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> venv</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> venv</span></span></code></pre></div><h3 id="激活虚拟环境" tabindex="-1">激活虚拟环境 <a class="header-anchor" href="#激活虚拟环境" aria-label="Permalink to &quot;激活虚拟环境&quot;">​</a></h3><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">venv\\Scripts\\activate</span></span></code></pre></div><p>激活后，你的终端提示符会显示虚拟环境的名称。</p><h2 id="安装-flask" tabindex="-1">安装 Flask <a class="header-anchor" href="#安装-flask" aria-label="Permalink to &quot;安装 Flask&quot;">​</a></h2><p>在已激活的虚拟环境中可以使用如下命令安装 Flask：</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pip</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Flask</span></span></code></pre></div><h1 id="快速上手" tabindex="-1">快速上手 <a class="header-anchor" href="#快速上手" aria-label="Permalink to &quot;快速上手&quot;">​</a></h1><h2 id="一个最小的应用" tabindex="-1">一个最小的应用 <a class="header-anchor" href="#一个最小的应用" aria-label="Permalink to &quot;一个最小的应用&quot;">​</a></h2><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> flask </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Flask</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">app </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Flask(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">__name__</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">@app.route</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;/&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">def</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> hello_world</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">():</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;Hello, World!&#39;</span></span></code></pre></div><p>那么，这些代码是什么意思呢？</p><p>首先我们导入了 Flask 类。 该类的实例将会成为我们的 WSGI 应用。</p><p>接着我们创建一个该类的实例。第一个参数是应用模块或者包的名称。如果你使用 一个单一模块（就像本例），那么应当使用 <code>__name__</code> ，因为名称会根据这个 模块是按应用方式使用还是作为一个模块导入而发生变化（可能是 <code>__main__</code> ， 也可能是实际导入的名称）。这个参数是必需的，这样 Flask 才能知道在哪里可以 找到模板和静态文件等东西。更多内容详见<a href="https://flask.net.cn/api.html#flask.Flask" target="_blank" rel="noreferrer">Flask 文档</a>。</p><p>然后我们使用 route() 装饰器来告诉 Flask 触发函数的 URL 。</p><p>函数名称被用于生成相关联的 URL 。函数最后返回需要在用户浏览器中显示的信息。</p><p>把它保存为 hello.py 或其他类似名称。请不要使用 flask.py 作为应用名称，这会与 Flask 本身发生冲突。</p><p>可以使用 flask 命令或者 python 的 -m 开关来运行这个应用。在 运行应用之前，需要在终端里导出 FLASK_APP 环境变量:</p><p>如果是在 Windows 下，那么导出环境变量的语法取决于使用的是哪种命令行解释器。</p><p>在 Command Prompt 下:</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">C:\\path\\to\\app&gt;set</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> FLASK_APP=hello.py</span></span></code></pre></div><p>在 PowerShell 下:</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">PS</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> C:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\p</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">ath</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\t</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">o</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\a</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">p</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">p</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $env</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">:FLASK_APP</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;hello.py&quot;</span></span></code></pre></div><p>然后使用</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">flask</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> run</span></span></code></pre></div><p>这样就启动了一个非常简单的内建的服务器。这个服务器用于测试应该是足够了，但是 用于生产可能是不够的。关于部署的有关内容参见《 部署方式 》。</p><p>现在在浏览器中打开 <a href="http://127.0.0.1:5000/" target="_blank" rel="noreferrer">http://127.0.0.1:5000/</a> ，应该可以看到 Hello World! 字样。</p><h2 id="调试模式" tabindex="-1">调试模式 <a class="header-anchor" href="#调试模式" aria-label="Permalink to &quot;调试模式&quot;">​</a></h2><p>虽然 flask 命令可以方便地启动一个本地开发服务器，但是每次应用代码 修改之后都需要手动重启服务器。这样不是很方便， Flask 可以做得更好。如果你打开 调试模式，那么服务器会在修改应用代码之后自动重启，并且当应用出错时还会提供一个 有用的调试器。</p><p>如果需要打开所有开发功能（包括调试模式），那么要在运行服务器之前导出 FLASK_ENV 环境变量并把其设置为 development:</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">set</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> FLASK_ENV=development</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">flask</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> run</span></span></code></pre></div><p>这样可以实现以下功能：</p><ol><li><p>激活调试器。</p></li><li><p>激活自动重载。</p></li><li><p>打开 Flask 应用的调试模式。</p></li></ol><p>还可以通过导出 FLASK_DEBUG=1 来单独控制调试模式的开关。</p>`,54),p=[t];function h(n,k,o,r,d,c){return i(),a("div",null,p)}const y=s(e,[["render",h]]);export{g as __pageData,y as default};
