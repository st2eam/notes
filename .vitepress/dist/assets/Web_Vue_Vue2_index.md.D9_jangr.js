import{_ as s,c as a,o as i,a4 as e}from"./chunks/framework.BtCE5x9j.js";const u=JSON.parse('{"title":"Vue 基础","description":"","frontmatter":{},"headers":[],"relativePath":"Web/Vue/Vue2/index.md","filePath":"Web/Vue/Vue2/index.md"}'),t={name:"Web/Vue/Vue2/index.md"},n=e(`<h1 id="vue-基础" tabindex="-1">Vue 基础 <a class="header-anchor" href="#vue-基础" aria-label="Permalink to &quot;Vue 基础&quot;">​</a></h1><h2 id="介绍" tabindex="-1">介绍 <a class="header-anchor" href="#介绍" aria-label="Permalink to &quot;介绍&quot;">​</a></h2><p>Vue (读音 /vjuː/，类似于 view) 是一套用于构建用户界面的渐进式框架。与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。Vue 的核心库只关注视图层，不仅易于上手，还便于与第三方库或既有项目整合。另一方面，当与现代化的工具链以及各种支持类库结合使用时，Vue 也完全能够为复杂的单页应用提供驱动。</p><h2 id="风格指南" tabindex="-1"><a href="https://cn.vuejs.org/v2/style-guide/" target="_blank" rel="noreferrer">风格指南</a> <a class="header-anchor" href="#风格指南" aria-label="Permalink to &quot;[风格指南](https://cn.vuejs.org/v2/style-guide/)&quot;">​</a></h2><h2 id="组件化思想" tabindex="-1">组件化思想 <a class="header-anchor" href="#组件化思想" aria-label="Permalink to &quot;组件化思想&quot;">​</a></h2><p>组件系统是现代 Web 开发中的一个重要概念，它允许我们使用小型、独立通常可复用的组件构建大型应用，几乎任意类型的应用界面都可以抽象为一个组件树。我们可以简单认为组件是 Web 页面中的一个独立的功能单元，它可以有自己的状态、DOM 结构、逻辑交互，组件最大的价值是可复用性，我们只需要将独立的功能代码封装成组件，需要使用的时候传递给它对应的数据就可以了，不需要再额外编写重复的功能代码。</p><h2 id="vue-应用-组件实例" tabindex="-1">Vue 应用 &amp; 组件实例 <a class="header-anchor" href="#vue-应用-组件实例" aria-label="Permalink to &quot;Vue 应用 &amp; 组件实例&quot;">​</a></h2><p>每个 Vue 应用都是通过用 Vue 函数创建一个新的 Vue 实例开始的：</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> vm </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Vue</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  // 选项</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span></code></pre></div><p>虽然没有完全遵循 <a href="https://zh.wikipedia.org/wiki/MVVM" target="_blank" rel="noreferrer">MVVM</a> 模型，但是 Vue 的设计也受到了它的启发。因此在文档中经常会使用</p><p>vm (ViewModel 的缩写) 这个变量名表示 Vue 实例。 当创建一个 Vue 实例时，你可以传入一个选项对象。这篇教程主要描述的就是如何使用这些选项来创建你想要的行为。作为参考，你也可以在 API 文档中浏览完整的选项列表。</p><p><strong>所有的 Vue 组件都是 Vue 实例。</strong></p><h2 id="实例生命周期钩子" tabindex="-1"><a href="https://cn.vuejs.org/v2/guide/instance.html#%E5%AE%9E%E4%BE%8B%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E9%92%A9%E5%AD%90" target="_blank" rel="noreferrer">实例生命周期钩子</a> <a class="header-anchor" href="#实例生命周期钩子" aria-label="Permalink to &quot;[实例生命周期钩子](https://cn.vuejs.org/v2/guide/instance.html#%E5%AE%9E%E4%BE%8B%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E9%92%A9%E5%AD%90)&quot;">​</a></h2><p>每个 Vue 实例在被创建时都要经过一系列的初始化过程——例如，需要设置数据监听、编译模板、将实例挂载到 DOM 并在数据变化时更新 DOM 等。同时在这个过程中也会运行一些叫做生命周期钩子的函数，这给了用户在不同阶段添加自己的代码的机会。</p><p>比如 <code>created</code> 钩子可以用来在一个实例被创建之后执行代码：</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Vue</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  data: {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    a: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  },</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  created</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> () {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // \`this\` 指向 vm 实例</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;a is: &#39;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> +</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.a)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// =&gt; &quot;a is: 1&quot;</span></span></code></pre></div><p>也有一些其它的钩子，在实例生命周期的不同阶段被调用，如 <code>mounted</code>、<code>updated</code> 和 <code>destroyed</code>。生命周期钩子的 this 上下文指向调用它的 Vue 实例。</p><p>不要在选项 property 或回调上使用箭头函数，比如 <code>created: () =&gt; console.log(this.a)</code> 或 <code>vm.$watch(&#39;a&#39;, newValue =&gt; this.myMethod())</code>。</p><p><strong>因为箭头函数并没有 this</strong>，this 会作为变量一直向上级词法作用域查找，直至找到为止，经常导致 Uncaught TypeError: Cannot read property of undefined 或 Uncaught TypeError: this.myMethod is not a function 之类的错误。</p><h2 id="生命周期图示" tabindex="-1">生命周期图示 <a class="header-anchor" href="#生命周期图示" aria-label="Permalink to &quot;生命周期图示&quot;">​</a></h2><p><img src="https://v2.cn.vuejs.org/images/lifecycle.png" alt="https://v2.cn.vuejs.org/images/lifecycle.png"></p>`,21),h=[n];function l(p,r,d,o,k,c){return i(),a("div",null,h)}const g=s(t,[["render",l]]);export{u as __pageData,g as default};
