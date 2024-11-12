import{_ as i,c as a,a2 as n,o as t}from"./chunks/framework.BW-ZVgUE.js";const o=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"Web/JavaScript/JS Decorator.md","filePath":"Web/JavaScript/JS Decorator.md"}'),l={name:"Web/JavaScript/JS Decorator.md"};function e(h,s,p,k,d,r){return t(),a("div",null,s[0]||(s[0]=[n(`<h2 id="什么是装饰器" tabindex="-1">什么是装饰器？ <a class="header-anchor" href="#什么是装饰器" aria-label="Permalink to &quot;什么是装饰器？&quot;">​</a></h2><p>装饰器以其最简单的形式只是将一段代码与另一段代码包装在一起的一种方式-实际上就是“修饰”它。您可能以前已经听说过这个概念，即功能组合或高阶功能。</p><h2 id="如何使用javascript装饰器" tabindex="-1">如何使用JavaScript装饰器 <a class="header-anchor" href="#如何使用javascript装饰器" aria-label="Permalink to &quot;如何使用JavaScript装饰器&quot;">​</a></h2><p>装饰器在JavaScript中使用一种特殊的语法，在装饰器中将前缀一个<code>@</code>符号并放置在装饰代码的最前面。</p><h2 id="装饰器的种类" tabindex="-1">装饰器的种类 <a class="header-anchor" href="#装饰器的种类" aria-label="Permalink to &quot;装饰器的种类&quot;">​</a></h2><p>装饰器可以用来装饰四种类型的值。</p><ul><li>类</li><li>类的属性（public, private, and static）</li><li>类的方法（public, private, and static）</li><li>属性存取器（accessor）（public, private, and static）</li></ul><h3 id="装饰器-api" tabindex="-1">装饰器 API <a class="header-anchor" href="#装饰器-api" aria-label="Permalink to &quot;装饰器 API&quot;">​</a></h3><p>装饰器是一个函数，API 的类型描述如下（TypeScript 写法）。</p><div class="language-typescript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">type</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Decorator</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">value</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Input</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">context</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  kind</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  name</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> string</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> |</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> symbol</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  access</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    get</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> unknown</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    set</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">value</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> unknown</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> void</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  };</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  private</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> boolean</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  static</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> boolean</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  addInitializer</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">initializer</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> () </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> void</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> void</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Output</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> |</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> void</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div><p>装饰器函数调用时，会接收到两个参数。</p><ul><li><code>value</code>：被装饰的值，某些情况下可能是<code>undefined</code>（装饰属性时）。</li><li><code>context</code>：一个对象，包含了被装饰的值的上下文信息。</li></ul><p>另外，<code>input</code>和<code>output</code>表示输入的值和输出的值，每种装饰器都不一样，放在后面介绍。所有装饰器都可以不返回任何值。</p><p><code>context</code>对象的属性如下。</p><ul><li><code>kind</code>：字符串，表示装饰类型，可能取值有<code>class</code>、<code>method</code>、<code>getter</code>、<code>setter</code>、<code>field</code>、<code>accessor</code>。</li><li><code>name</code>：被装饰的值的名称: The name of the value, or in the case of private elements the description of it (e.g. the readable name).</li><li><code>access</code>：对象，包含访问这个值的方法，即存值器和取值器。</li><li><code>static</code>: 布尔值，该值是否为静态元素。</li><li><code>private</code>：布尔值，该值是否为私有元素。</li><li><code>addInitializer</code>：函数，允许用户增加初始化逻辑。</li></ul><p>装饰器的执行步骤如下。</p><ol><li>计算各个装饰器的值，按照从左到右，从上到下的顺序。</li><li>调用方法装饰器。</li><li>调用类装饰器。</li></ol><h3 id="类的装饰" tabindex="-1">类的装饰 <a class="header-anchor" href="#类的装饰" aria-label="Permalink to &quot;类的装饰&quot;">​</a></h3><p>装饰器可以用来装饰整个类。</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@testable</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> MyTestableClass</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  // ...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> testable</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">target</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  target.isTestable </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">MyTestableClass.isTestable </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// true</span></span></code></pre></div>`,20)]))}const E=i(l,[["render",e]]);export{o as __pageData,E as default};