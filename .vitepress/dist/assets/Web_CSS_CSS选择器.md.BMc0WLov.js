import{_ as s,c as i,o as a,a4 as h}from"./chunks/framework.BtCE5x9j.js";const g=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"Web/CSS/CSS选择器.md","filePath":"Web/CSS/CSS选择器.md"}'),n={name:"Web/CSS/CSS选择器.md"},t=h(`<h2 id="css选择器" tabindex="-1">CSS选择器 <a class="header-anchor" href="#css选择器" aria-label="Permalink to &quot;CSS选择器&quot;">​</a></h2><h3 id="css-元素选择器" tabindex="-1">CSS 元素选择器 <a class="header-anchor" href="#css-元素选择器" aria-label="Permalink to &quot;CSS 元素选择器&quot;">​</a></h3><p>元素选择器根据元素名称来选择 HTML 元素。</p><div class="language-css vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">p</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  text-align</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">center</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">red</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h3 id="css-id-选择器" tabindex="-1">CSS id 选择器(#) <a class="header-anchor" href="#css-id-选择器" aria-label="Permalink to &quot;CSS id 选择器(#)&quot;">​</a></h3><p>id 选择器使用 HTML 元素的 id 属性来选择特定元素。</p><div class="language-css vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">#para1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  text-align</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">center</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">red</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h3 id="css-类选择器" tabindex="-1">CSS 类选择器(.) <a class="header-anchor" href="#css-类选择器" aria-label="Permalink to &quot;CSS 类选择器(.)&quot;">​</a></h3><p>类选择器选择有特定 class 属性的 HTML 元素。</p><div class="language-css vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">.center</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  text-align</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">center</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">red</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h3 id="css-通用选择器" tabindex="-1">CSS 通用选择器(*) <a class="header-anchor" href="#css-通用选择器" aria-label="Permalink to &quot;CSS 通用选择器(*)&quot;">​</a></h3><p>通用选择器（*）选择页面上的所有的 HTML 元素。</p><div class="language-css vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  text-align</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">center</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">blue</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h3 id="css-分组选择器" tabindex="-1">CSS 分组选择器 <a class="header-anchor" href="#css-分组选择器" aria-label="Permalink to &quot;CSS 分组选择器&quot;">​</a></h3><p>分组选择器选取所有具有相同样式定义的 HTML 元素。</p><div class="language-css vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">h1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">h2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">p</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  text-align</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">center</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">red</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h2 id="css-组合器" tabindex="-1">CSS 组合器 <a class="header-anchor" href="#css-组合器" aria-label="Permalink to &quot;CSS 组合器&quot;">​</a></h2><h3 id="后代选择器-空格" tabindex="-1">后代选择器(空格) <a class="header-anchor" href="#后代选择器-空格" aria-label="Permalink to &quot;后代选择器(空格)&quot;">​</a></h3><p>后代选择器匹配属于指定元素后代的所有元素。</p><h3 id="子选择器" tabindex="-1">子选择器(&gt;) <a class="header-anchor" href="#子选择器" aria-label="Permalink to &quot;子选择器(&gt;)&quot;">​</a></h3><p>子选择器匹配属于指定元素子元素的所有元素。</p><h3 id="相邻兄弟选择器" tabindex="-1">相邻兄弟选择器(+) <a class="header-anchor" href="#相邻兄弟选择器" aria-label="Permalink to &quot;相邻兄弟选择器(+)&quot;">​</a></h3><p>相邻兄弟选择器匹配所有作为指定元素的相邻同级的元素。</p><p>兄弟（同级）元素必须具有相同的父元素，“相邻”的意思是“紧随其后”。</p><h3 id="通用兄弟选择器" tabindex="-1">通用兄弟选择器(~) <a class="header-anchor" href="#通用兄弟选择器" aria-label="Permalink to &quot;通用兄弟选择器(~)&quot;">​</a></h3><p>通用兄弟选择器匹配属于指定元素的同级元素的所有元素。</p><h2 id="css-伪类" tabindex="-1"><a href="https://www.w3school.com.cn/css/css_pseudo_classes.asp" target="_blank" rel="noreferrer">CSS 伪类</a> <a class="header-anchor" href="#css-伪类" aria-label="Permalink to &quot;[CSS 伪类](https://www.w3school.com.cn/css/css_pseudo_classes.asp)&quot;">​</a></h2><h2 id="css-伪元素" tabindex="-1"><a href="https://www.w3school.com.cn/css/css_pseudo_elements.asp" target="_blank" rel="noreferrer">CSS 伪元素</a> <a class="header-anchor" href="#css-伪元素" aria-label="Permalink to &quot;[CSS 伪元素](https://www.w3school.com.cn/css/css_pseudo_elements.asp)&quot;">​</a></h2><h2 id="css-特异性" tabindex="-1">CSS 特异性 <a class="header-anchor" href="#css-特异性" aria-label="Permalink to &quot;CSS 特异性&quot;">​</a></h2><h4 id="特异性层次" tabindex="-1">特异性层次 <a class="header-anchor" href="#特异性层次" aria-label="Permalink to &quot;特异性层次&quot;">​</a></h4><p>每个选择器在特异性层次结构中都有其位置。以下四种类别定义了选择器的特异性级别：</p><p><strong>行内样式</strong> - 行内（内联）样式直接附加到要设置样式的元素。实例：<code>&lt;h1 style=&quot;color: #ffffff;&quot;&gt;</code>。</p><p><strong>ID</strong> - ID 是页面元素的唯一标识符，例如 #navbar。</p><p><strong>类、属性和伪类</strong> - 此类别包括 .classes、[attributes] 和伪类，例如：:hover、:focus 等。</p><p><strong>元素和伪元素</strong> - 此类别包括元素名称和伪元素，比如 h1、div、:before 和 :after。</p><h4 id="如何计算特异性" tabindex="-1">如何计算特异性？ <a class="header-anchor" href="#如何计算特异性" aria-label="Permalink to &quot;如何计算特异性？&quot;">​</a></h4><p>从 0 开始，为 style 属性添加 1000，为每个 ID 添加 100，为每个属性、类或伪类添加 10，为每个元素名称或伪元素添加 1。</p><h5 id="特异性规则-1" tabindex="-1">特异性规则 1 <a class="header-anchor" href="#特异性规则-1" aria-label="Permalink to &quot;特异性规则 1&quot;">​</a></h5><p>在特异性相同的情况下：最新的规则很重要 - 如果将同一规则两次写入外部样式表，那么样式表中后面的规将更靠近要设置样式的元素，因此会被应用：</p><p>实例</p><div class="language-css vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">h1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">background-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">yellow</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;}</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">h1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">background-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">red</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;}</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/*应用*/</span></span></code></pre></div><h5 id="特异性规则-2" tabindex="-1">特异性规则 2 <a class="header-anchor" href="#特异性规则-2" aria-label="Permalink to &quot;特异性规则 2&quot;">​</a></h5><p>ID 选择器比属性选择器拥有更高的特异性 - 请看以下三行代码：</p><p>实例</p><div class="language-css vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">#a</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">background-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">green</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;}</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/*应用*/</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">#a</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">background-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">yellow</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;}</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">id</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">a</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">] {</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">background-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">blue</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;}</span></span></code></pre></div><h5 id="特异性规则-3" tabindex="-1">特异性规则 3 <a class="header-anchor" href="#特异性规则-3" aria-label="Permalink to &quot;特异性规则 3&quot;">​</a></h5><p>上下文选择器比单一元素选择器更具体 - 嵌入式样式表更靠近要设置样式的元素。所以在以下情况下：</p><p>实例 来自外部 CSS 文件：</p><div class="language-css vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">#content</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;"> h1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">background-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">red</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;}</span></span></code></pre></div><p>在 HTML 文件中：</p><div class="language-html vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">style</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">#content</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;"> h1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  background-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">yellow</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">style</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><p>将适用后一条规则。</p><h5 id="特异性规则-4" tabindex="-1">特异性规则 4 <a class="header-anchor" href="#特异性规则-4" aria-label="Permalink to &quot;特异性规则 4&quot;">​</a></h5><p>类选择器会击败任意数量的元素选择器 - 类选择器（诸如 .intro 会击败 h1、p、div 等）：</p><p>实例</p><div class="language-css vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">.intro</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">background-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">yellow</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;}</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/*应用*/</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">h1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">background-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">red</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;}</span></span></code></pre></div><h3 id="选择器参考手册" tabindex="-1"><a href="https://www.w3school.com.cn/cssref/css_selectors.asp" target="_blank" rel="noreferrer">选择器参考手册</a> <a class="header-anchor" href="#选择器参考手册" aria-label="Permalink to &quot;[选择器参考手册](https://www.w3school.com.cn/cssref/css_selectors.asp)&quot;">​</a></h3>`,57),l=[t];function e(p,k,r,d,c,E){return a(),i("div",null,l)}const y=s(n,[["render",e]]);export{g as __pageData,y as default};
