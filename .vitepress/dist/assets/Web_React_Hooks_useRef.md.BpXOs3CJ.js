import{_ as s,c as i,o as a,a4 as e}from"./chunks/framework.BtCE5x9j.js";const g=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"Web/React/Hooks/useRef.md","filePath":"Web/React/Hooks/useRef.md"}'),t={name:"Web/React/Hooks/useRef.md"},n=e(`<h3 id="useref" tabindex="-1">useRef <a class="header-anchor" href="#useref" aria-label="Permalink to &quot;useRef&quot;">​</a></h3><p>“勾住”某些组件挂载完成或重新渲染完成后才拥有的某些对象，并返回该对象的引用。该引用在组件整个生命周期中都固定不变，该引用也不会随着组件重新渲染而失效。</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> refContainer</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> useRef</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(initialValue);</span></span></code></pre></div><ul><li><code>useRef</code> 返回一个可变的 ref 对象，其 <code>.current</code> 属性被初始化为传入的参数（<code>initialValue</code>）。</li><li>返回的 ref 对象在组件的整个生命周期内保持不变</li><li>当更新 current 值时并不会 re-render ，这是与 <code>useState</code> 不同的地方</li><li>更新 <code>useRef</code> 是 side effect (副作用)，所以一般写在 <code>useEffect</code> 或 event handler 里</li><li><code>useRef</code> 类似于类组件的 this</li></ul><h3 id="useref使用示例" tabindex="-1">useRef使用示例 <a class="header-anchor" href="#useref使用示例" aria-label="Permalink to &quot;useRef使用示例&quot;">​</a></h3><p>需求分析：</p><ol><li><p>我们可以很轻松使用<code>&lt;input &gt;</code>创建出这个输入框。</p></li><li><p>需要使用<code>useRef</code> “勾住”这个输入框，当它被挂载到网页后，通过操作原生html的方法，将焦点赋予该输入框上。</p></li></ol><p>完整代码如下：</p><div class="language-jsx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">jsx</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> TextInputWithFocusButton</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> inputEl</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> useRef</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">HTMLInputElement</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">null</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  const</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> onButtonClick</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> () </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // \`current\` 指向已挂载到 DOM 上的文本输入元素</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    inputEl.current.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">focus</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  };</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &lt;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">input</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ref</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{inputEl} </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">type</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;text&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">button</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> onClick</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{onButtonClick}&gt;Focus the input&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">button</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &lt;/&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  );</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>你应该熟悉 ref 这一种<a href="https://zh-hans.reactjs.org/docs/refs-and-the-dom.html" target="_blank" rel="noreferrer">访问 DOM</a> 的主要方式。如果你将 ref 对象以 <code>&lt;div ref={myRef} /&gt;</code> 形式传入组件，则无论该节点如何改变，React 都会将 ref 对象的 <code>.current</code> 属性设置为相应的 DOM 节点。</p><p>然而，<code>useRef()</code> 比 <code>ref</code> 属性更有用。它可以<a href="https://zh-hans.reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables" target="_blank" rel="noreferrer">很方便地保存任何可变值</a>，其类似于在 class 中使用实例字段的方式。</p><h3 id="为什么使用useref" tabindex="-1">为什么使用useRef <a class="header-anchor" href="#为什么使用useref" aria-label="Permalink to &quot;为什么使用useRef&quot;">​</a></h3><p>主动更新 useRef 变量的 .current 的值并不会触发组件重新渲染。</p><p>例如下面这个示例：</p><div class="language-tsx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">tsx</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { useRef } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;react&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> default</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> MyButton</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> countRef</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> useRef</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  const</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> handleClick</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> () </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    countRef.current </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> countRef.current </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  };</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">button</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> onClick</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{handleClick}&gt;Click me {countRef.current}&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">button</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>实际运行就会发现，在点击事件中我们修改了 <code>countRef.current</code> 的值，尽管该值确实发生了变化，可是并不会触发组件的重新渲染。</p><h3 id="useref与createref的区别" tabindex="-1">useRef与createRef的区别 <a class="header-anchor" href="#useref与createref的区别" aria-label="Permalink to &quot;useRef与createRef的区别&quot;">​</a></h3><p>在一个组件的正常的生命周期中可以大致分为3个阶段：</p><ol><li>从创建组件到挂载到DOM阶段。初始化props以及state, 根据state与props来构建DOM</li><li>组件依赖的props以及state状态发生变更，触发更新</li><li>销毁阶段</li></ol><p>第一个阶段，useRef与createRef没有差别</p><p>第二个阶段，createRef每次都会返回个新的引用；而useRef不会随着组件的更新而重新创建</p><p>第三个阶段，两者都会销毁</p><p><strong>小结：</strong> createRef 每次渲染都会返回一个新的引用，而 useRef 每次都会返回相同的引用</p><h3 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h3><ol><li><code>useRef</code>可以用来定义变量，这些变量更改之后不会引起页面重新渲染，比如分页获取数据时，存储页码。</li><li><code>useRef</code>也可以用来区分初始渲染还是更新</li><li>在DOM节点上定义ref属性，通过<code>.current</code>就可以获取到该DOM元素</li></ol>`,25),l=[n];function h(p,k,r,d,c,o){return a(),i("div",null,l)}const u=s(t,[["render",h]]);export{g as __pageData,u as default};
