import{_ as a,c as s,o as i,a4 as e}from"./chunks/framework.B-C7vMfR.js";const E=JSON.parse('{"title":"Node.js 回调函数","description":"","frontmatter":{},"headers":[],"relativePath":"Web/JavaScript/Node.js/Node.js 回调函数.md","filePath":"Web/JavaScript/Node.js/Node.js 回调函数.md"}'),t={name:"Web/JavaScript/Node.js/Node.js 回调函数.md"},p=e(`<h1 id="node-js-回调函数" tabindex="-1">Node.js 回调函数 <a class="header-anchor" href="#node-js-回调函数" aria-label="Permalink to &quot;Node.js 回调函数&quot;">​</a></h1><p>在 JavaScript 中，函数即对象。我们可以将对象作为参数传递给函数吗？答案是“可以”。</p><p>所以，我们可以将函数作为参数传递给其他函数，在外部函数中调用它。听起来有点复杂？我们看一下下面的例子：</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">callback</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {  </span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    callback</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>print( ) 函数将另一个函数作为参数，并在函数体内部调用它。在 JavaScript 里，我们叫它“回调”。所以，被传递给另一个函数作为参数的函数叫作回调函数。</p><p>例如，我们可以一边读取文件，一边执行其他命令，在文件读取完成后，我们将文件内容作为回调函数的参数返回。这样在执行代码时就没有阻塞或等待文件 I/O 操作。这就大大提高了 Node.js 的性能，可以处理大量的并发请求。</p><h3 id="为什么需要回调函数" tabindex="-1"><strong>为什么需要回调函数？</strong> <a class="header-anchor" href="#为什么需要回调函数" aria-label="Permalink to &quot;**为什么需要回调函数？**&quot;">​</a></h3><p>JavaScript 按从上到下的顺序运行代码。但是，在有些情况下，必须在某些情况发生之后，代码才能运行（或者说必须运行），这就不是按顺序运行了。这是异步编程。</p><p>回调函数确保：函数在某个任务完成之前不运行，在任务完成之 后立即运行。它帮助我们编写异步 JavaScript代码，避免问题和错误。</p><p>在 JavaScript 里创建回调函数的方法是将它作为参数传递给另一个函数，然后当某个任务完成之后，立即调用它。</p>`,10),n=[p];function o(r,l,c,d,h,k){return i(),s("div",null,n)}const g=a(t,[["render",o]]);export{E as __pageData,g as default};
