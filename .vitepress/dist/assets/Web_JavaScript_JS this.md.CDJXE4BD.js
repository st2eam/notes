import{_ as s,c as i,o as a,a4 as t}from"./chunks/framework.BtCE5x9j.js";const g=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"Web/JavaScript/JS this.md","filePath":"Web/JavaScript/JS this.md"}'),h={name:"Web/JavaScript/JS this.md"},n=t(`<h3 id="方法中的-this" tabindex="-1">方法中的 this <a class="header-anchor" href="#方法中的-this" aria-label="Permalink to &quot;方法中的 this&quot;">​</a></h3><p>在对象方法中，this 指的是此方法的“拥有者”。</p><h3 id="单独的-this" tabindex="-1">单独的 this <a class="header-anchor" href="#单独的-this" aria-label="Permalink to &quot;单独的 this&quot;">​</a></h3><p>在单独使用时，拥有者是全局对象，因此 this 指的是全局对象。</p><p>在浏览器窗口中，全局对象是 [object Window]</p><h3 id="函数中的-this-默认" tabindex="-1">函数中的 this（默认） <a class="header-anchor" href="#函数中的-this-默认" aria-label="Permalink to &quot;函数中的 this（默认）&quot;">​</a></h3><p>在 JavaScript 函数中，函数的拥有者默认绑定 this。</p><h3 id="函数中的-this-严格模式" tabindex="-1">函数中的 this（严格模式） <a class="header-anchor" href="#函数中的-this-严格模式" aria-label="Permalink to &quot;函数中的 this（严格模式）&quot;">​</a></h3><p>JavaScript 严格模式不允许默认绑定。</p><p>因此，在函数中使用时，在严格模式下，this 是未定义的（undefined）。</p><h3 id="事件处理程序中的-this" tabindex="-1">事件处理程序中的 this <a class="header-anchor" href="#事件处理程序中的-this" aria-label="Permalink to &quot;事件处理程序中的 this&quot;">​</a></h3><p>在 HTML 事件处理程序中，this 指的是接收此事件的 HTML 元素</p><div class="language-html vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">button</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> onclick</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">this</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">style</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">display</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;none&#39;&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  点击来删除按钮</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">button</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><h3 id="对象方法绑定" tabindex="-1">对象方法绑定 <a class="header-anchor" href="#对象方法绑定" aria-label="Permalink to &quot;对象方法绑定&quot;">​</a></h3><p>this 是 person 对象（person 对象是该函数的“拥有者”）</p><p>显式函数绑定 call() 和 apply() 方法是预定义的 JavaScript 方法。</p><p>它们都可以用于将另一个对象作为参数调用对象方法。</p><p>您可以在本教程后面阅读有关 call() 和 apply() 的更多内容。</p><p>在下面的例子中，当使用 person2 作为参数调用 person1.fullName 时，this 将引用 person2，即使它是 person1 的方法：</p><p>实例</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> person1 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  fullName</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.firstName </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot; &quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> +</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.lastName;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> person2 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  firstName:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Bill&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  lastName: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Gates&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">person1.fullName.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">call</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(person2);  </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 会返回 &quot;Bill Gates&quot;</span></span></code></pre></div>`,21),l=[n];function p(e,k,r,E,d,o){return a(),i("div",null,l)}const y=s(h,[["render",p]]);export{g as __pageData,y as default};
