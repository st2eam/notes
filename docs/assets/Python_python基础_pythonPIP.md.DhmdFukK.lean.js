import{_ as t,c as e,a2 as s,o as i}from"./chunks/framework.BW-ZVgUE.js";const k=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"Python/python基础/pythonPIP.md","filePath":"Python/python基础/pythonPIP.md"}'),n={name:"Python/python基础/pythonPIP.md"};function p(h,a,l,o,r,d){return i(),e("div",null,a[0]||(a[0]=[s('<h2 id="什么是-pip" tabindex="-1">什么是 PIP？ <a class="header-anchor" href="#什么是-pip" aria-label="Permalink to &quot;什么是 PIP？&quot;">​</a></h2><p>PIP 是 Python 包或模块的包管理器，pip之于python，就像npm之于node。pip与npm类似，也有对于python包的查找、下载、安装、卸载的功能。</p><p>**注释：**如果您使用的是 Python 3.4 或更高版本，则默认情况下会包含 PIP。</p><h2 id="查找包" tabindex="-1">查找包 <a class="header-anchor" href="#查找包" aria-label="Permalink to &quot;查找包&quot;">​</a></h2><p>在 <a href="https://pypi.org/%EF%BC%8C%E6%82%A8%E5%8F%AF%E4%BB%A5%E6%89%BE%E5%88%B0%E6%9B%B4%E5%A4%9A%E7%9A%84%E5%8C%85%E3%80%82" target="_blank" rel="noreferrer">https://pypi.org/，您可以找到更多的包。</a></p><h2 id="导出当前环境包" tabindex="-1">导出当前环境包 <a class="header-anchor" href="#导出当前环境包" aria-label="Permalink to &quot;导出当前环境包&quot;">​</a></h2><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pip</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> freeze</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &gt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">requirements.txt</span></span></code></pre></div><p>同时也可以把这个环境文件给别人，别人可以照着这个文件进行安装一个与你的环境一模一样的python编译环境变量安装另一个编译环境的<a href="https://so.csdn.net/so/search?q=%E7%AC%AC%E4%B8%89%E6%96%B9%E5%BA%93&amp;spm=1001.2101.3001.7020" target="_blank" rel="noreferrer">第三方库</a>：<code>pip install -r requirements.txt</code></p><h2 id="卸载所有的python包" tabindex="-1">卸载所有的python包 <a class="header-anchor" href="#卸载所有的python包" aria-label="Permalink to &quot;卸载所有的python包&quot;">​</a></h2><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pip</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> uninstall</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -r</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> modules.txt</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -y</span></span></code></pre></div>',10)]))}const y=t(n,[["render",p]]);export{k as __pageData,y as default};
