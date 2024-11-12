import{_ as i,c as s,a2 as t,o as e}from"./chunks/framework.BW-ZVgUE.js";const n="/notes/assets/lifecycle.CSwo9YF7.png",u=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"Web/Vue/Vue3/生命周期.md","filePath":"Web/Vue/Vue3/生命周期.md"}'),h={name:"Web/Vue/Vue3/生命周期.md"};function l(p,a,k,o,d,r){return e(),s("div",null,a[0]||(a[0]=[t('<h2 id="生命周期钩子" tabindex="-1">生命周期钩子 <a class="header-anchor" href="#生命周期钩子" aria-label="Permalink to &quot;生命周期钩子&quot;">​</a></h2><p><a href="https://cn.vuejs.org/api/composition-api-lifecycle.html" target="_blank" rel="noreferrer">https://cn.vuejs.org/api/composition-api-lifecycle.html</a></p><h2 id="onbeforemount" tabindex="-1">onBeforeMount() <a class="header-anchor" href="#onbeforemount" aria-label="Permalink to &quot;onBeforeMount()&quot;">​</a></h2><p>注册一个钩子，在组件被挂载之前被调用。</p><h3 id="类型" tabindex="-1">类型 <a class="header-anchor" href="#类型" aria-label="Permalink to &quot;类型&quot;">​</a></h3><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> onBeforeMount</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">callback</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> () </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> void</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> void</span></span></code></pre></div><h3 id="详细信息" tabindex="-1">详细信息 <a class="header-anchor" href="#详细信息" aria-label="Permalink to &quot;详细信息&quot;">​</a></h3><p>当这个钩子被调用时，组件已经完成了其响应式状态的设置，但还没有创建 DOM 节点。它即将首次执行 DOM 渲染过程。</p><p>这个钩子在服务器端渲染期间不会被调用。</p><h2 id="onmounted" tabindex="-1">onMounted() <a class="header-anchor" href="#onmounted" aria-label="Permalink to &quot;onMounted()&quot;">​</a></h2><p>注册一个回调函数，在组件挂载完成后执行。</p><h3 id="类型-1" tabindex="-1">类型 <a class="header-anchor" href="#类型-1" aria-label="Permalink to &quot;类型&quot;">​</a></h3><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> onMounted</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">callback</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> () </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> void</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> void</span></span></code></pre></div><h3 id="详细信息-1" tabindex="-1">详细信息 <a class="header-anchor" href="#详细信息-1" aria-label="Permalink to &quot;详细信息&quot;">​</a></h3><p>组件在以下情况下被视为已挂载：</p><ul><li><p>其所有同步子组件都已经被挂载 (不包含异步组件或 <code>&lt;Suspense&gt;</code> 树内的组件)。</p></li><li><p>其自身的 DOM 树已经创建完成并插入了父容器中。注意仅当根容器在文档中时，才可以保证组件 DOM 树也在文档中。</p></li></ul><p>这个钩子通常用于执行需要访问组件所渲染的 DOM 树相关的副作用，或是在服务端渲染应用中用于确保 DOM 相关代码仅在客户端执行。</p><p>这个钩子在服务器端渲染期间不会被调用。</p><h2 id="onbeforeupdate" tabindex="-1">onBeforeUpdate() <a class="header-anchor" href="#onbeforeupdate" aria-label="Permalink to &quot;onBeforeUpdate()&quot;">​</a></h2><p>注册一个钩子，在组件即将因为响应式状态变更而更新其 DOM 树之前调用。</p><h3 id="类型-2" tabindex="-1">类型 <a class="header-anchor" href="#类型-2" aria-label="Permalink to &quot;类型&quot;">​</a></h3><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> onBeforeUpdate</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">callback</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> () </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> void</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> void</span></span></code></pre></div><h3 id="详细信息-2" tabindex="-1">详细信息 <a class="header-anchor" href="#详细信息-2" aria-label="Permalink to &quot;详细信息&quot;">​</a></h3><p>这个钩子可以用来在 Vue 更新 DOM 之前访问 DOM 状态。在这个钩子中更改状态也是安全的。</p><p>这个钩子在服务器端渲染期间不会被调用。</p><h2 id="onupdated" tabindex="-1">onUpdated() <a class="header-anchor" href="#onupdated" aria-label="Permalink to &quot;onUpdated()&quot;">​</a></h2><p>注册一个回调函数，在组件因为响应式状态变更而更新其 DOM 树之后调用。</p><h3 id="类型-3" tabindex="-1">类型 <a class="header-anchor" href="#类型-3" aria-label="Permalink to &quot;类型&quot;">​</a></h3><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> onUpdated</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">callback</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> () </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> void</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> void</span></span></code></pre></div><h3 id="详细信息-3" tabindex="-1">详细信息 <a class="header-anchor" href="#详细信息-3" aria-label="Permalink to &quot;详细信息&quot;">​</a></h3><p>父组件的更新钩子将在其子组件的更新钩子之后调用。</p><p>这个钩子会在组件的任意 DOM 更新后被调用，这些更新可能是由不同的状态变更导致的，因为多个状态变更可以在同一个渲染周期中批量执行（考虑到性能因素）。</p><p>如果你需要在某个特定的状态更改后访问更新后的 DOM，请使用 nextTick() 作为替代。</p><h2 id="onunmounted" tabindex="-1">onUnmounted() <a class="header-anchor" href="#onunmounted" aria-label="Permalink to &quot;onUnmounted()&quot;">​</a></h2><p>注册一个回调函数，在组件实例被卸载之后调用。</p><h3 id="类型-4" tabindex="-1">类型 <a class="header-anchor" href="#类型-4" aria-label="Permalink to &quot;类型&quot;">​</a></h3><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> onUpdated</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">callback</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> () </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> void</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> void</span></span></code></pre></div><h3 id="详细信息-4" tabindex="-1">详细信息 <a class="header-anchor" href="#详细信息-4" aria-label="Permalink to &quot;详细信息&quot;">​</a></h3><p>一个组件在以下情况下被视为已卸载：</p><ul><li><p>其所有子组件都已经被卸载。</p></li><li><p>所有相关的响应式作用 (渲染作用以及 setup() 时创建的计算属性和侦听器) 都已经停止。</p></li></ul><p>可以在这个钩子中手动清理一些副作用，例如计时器、DOM 事件监听器或者与服务器的连接。</p><p>这个钩子在服务器端渲染期间不会被调用。</p><h2 id="onbeforeunmount" tabindex="-1">onBeforeUnmount() <a class="header-anchor" href="#onbeforeunmount" aria-label="Permalink to &quot;onBeforeUnmount()&quot;">​</a></h2><p>注册一个钩子，在组件实例被卸载之前调用。</p><h3 id="类型-5" tabindex="-1">类型 <a class="header-anchor" href="#类型-5" aria-label="Permalink to &quot;类型&quot;">​</a></h3><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> onBeforeUnmount</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">callback</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> () </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> void</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> void</span></span></code></pre></div><h3 id="详细信息-5" tabindex="-1">详细信息 <a class="header-anchor" href="#详细信息-5" aria-label="Permalink to &quot;详细信息&quot;">​</a></h3><p>当这个钩子被调用时，组件实例依然还保有全部的功能。</p><p>这个钩子在服务器端渲染期间不会被调用。</p><h2 id="生命周期图示" tabindex="-1">生命周期图示 <a class="header-anchor" href="#生命周期图示" aria-label="Permalink to &quot;生命周期图示&quot;">​</a></h2><p><img src="'+n+'" alt="生命周期图示"></p>',51)]))}const g=i(h,[["render",l]]);export{u as __pageData,g as default};
