import{_ as s,c as i,o as a,a4 as e}from"./chunks/framework.B-C7vMfR.js";const g=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"Web/Vue/Vue3/对比 React Hooks 和 Vue Composition API.md","filePath":"Web/Vue/Vue3/对比 React Hooks 和 Vue Composition API.md"}'),t={name:"Web/Vue/Vue3/对比 React Hooks 和 Vue Composition API.md"},l=e(`<h2 id="hooks-概述" tabindex="-1">Hooks 概述 <a class="header-anchor" href="#hooks-概述" aria-label="Permalink to &quot;Hooks 概述&quot;">​</a></h2><p><a href="https://github.com/reactjs/react-basic" target="_blank" rel="noreferrer">React 的心智模型</a></p><blockquote><p>心智模式又叫心智模型,是指深植我们心中关于我们自己、别人、组织及周围世界每个层面的假设、形象和故事。并深受习惯思维、定势思维、已有知识的局限。也通常指人们一种习以为常、理所当然的认知。</p></blockquote><p><strong>Hooks</strong> 是一项新功能提案，可让您在不编写类的情况下使用 state(状态) 和其他 React 功能。</p><p>React Hook 底层是基于链表实现，调用的条件是每次组件被 render 的时候都会顺序执行所有的 Hooks</p><p>Hook 的出现是划时代的，通过 function 抽离的方式，实现了复杂逻辑的内部封装：</p><ul><li>逻辑代码的复用</li><li>减小了代码体积</li><li>没有 this 的烦恼</li></ul><p>对于 Vue 提出的新的书写 Vue 组件的 API：Composition API RFC，作用也是类似，所以我们也可以像 React 一样叫做 Vue Hooks</p><ul><li>该 API 受到 React Hooks 的启发</li><li>但有一些有趣的差异，规避了一些 React 的问题</li></ul><h2 id="什么是组合式api" tabindex="-1">什么是组合式API <a class="header-anchor" href="#什么是组合式api" aria-label="Permalink to &quot;什么是组合式API&quot;">​</a></h2><p>组合式 API (Composition API) 是一系列 API 的集合，使我们可以使用函数而不是声明选项的方式书写 Vue 组件。它是一个概括性的术语，涵盖了以下方面的 API：</p><ul><li><a href="https://cn.vuejs.org/api/reactivity-core.html" target="_blank" rel="noreferrer">响应式 API</a>：例如 <code>ref()</code> 和 <code>reactive()</code>，使我们可以直接创建响应式状态、计算属性和侦听器。</li><li><a href="https://cn.vuejs.org/api/composition-api-lifecycle.html" target="_blank" rel="noreferrer">生命周期钩子</a>：例如 <code>onMounted()</code> 和 <code>onUnmounted()</code>，使我们可以在组件各个生命周期阶段添加逻辑。</li><li><a href="https://cn.vuejs.org/api/composition-api-dependency-injection.html" target="_blank" rel="noreferrer">依赖注入</a>：例如 <code>provide()</code> 和 <code>inject()</code>，使我们可以在使用响应式 API 时，利用 Vue 的依赖注入系统。</li></ul><p><strong>动机与实现</strong>：现在与同一个逻辑关注点相关的代码被归为了一组，我们无需再为了一个逻辑关注点在不同的选项块间来回滚动切换。组合式 API 的效果用下面这张图片就可以清楚地表示出来：</p><p><img src="https://user-images.githubusercontent.com/499550/62783026-810e6180-ba89-11e9-8774-e7771c8095d6.png" alt="img"></p><h2 id="react-hooks-的心智负担" tabindex="-1">React Hooks 的心智负担 <a class="header-anchor" href="#react-hooks-的心智负担" aria-label="Permalink to &quot;React Hooks 的心智负担&quot;">​</a></h2><p>React Hooks 开发经常提及的一些问题我列举几个：</p><ol><li><p>我该使用单个 state 变量还是多个 state 变量？</p></li><li><p>deps 依赖过多，导致 Hooks 难以维护？</p></li><li><p>该不该使用 useMemo？</p></li></ol><p>然后基于这些问题的最佳实践，人们又总结出：</p><ol><li><p>将完全不相关的 state 拆分为多组 state。</p></li><li><p>如果某些 state 是相互关联的，或者需要一起发生改变，就可以把它们合并为一组 state。</p></li><li><p>依赖数组依赖的值最好不要超过 3 个，否则会导致代码会难以维护。</p></li><li><p>如果发现依赖数组依赖的值过多，我们应该采取一些方法来减少它。</p></li><li><ol><li>去掉不必要的依赖。</li><li>将 Hook 拆分为更小的单元，每个 Hook 依赖于各自的依赖数组。</li><li>通过合并相关的 state，将多个依赖值聚合为一个。</li><li>通过 setState 回调函数获取最新的 state，以减少外部依赖。</li><li>通过 ref 来读取可变变量的值，不过需要注意控制修改它的途径。</li></ol></li><li><p>应该使用 useMemo 的场景：</p></li><li><ol><li>保持引用相等</li><li>成本很高的计算</li></ol></li><li><p>无需使用 useMemo 的场景：</p></li><li><ol><li>如果返回的值是原始值： string, boolean, null, undefined, number, symbol（不包括动态声明的 Symbol），一般不需要使用 useMemo。</li><li>仅在组件内部用到的 object、array、函数等（没有作为 props 传递给子组件），且没有用到其他 Hook 的依赖数组中，一般不需要使用 useMemo。</li></ol></li><li><p>Hooks、Render Props 和高阶组件都有各自的使用场景，具体使用哪一种要看实际情况。</p></li><li><p>若 Hook 类型相同，且依赖数组一致时，应该合并成一个 Hook。</p></li><li><p>自定义 Hooks 的返回值可以使用 Tuple 类型，更易于在外部重命名。如果返回的值过多，则不建议使用。</p></li><li><p>ref 不要直接暴露给外部使用，而是提供一个修改值的方法。</p></li><li><p>在使用 useMemo 或者 useCallback 时，可以借助 ref 或者 setState callback，确保返回的函数只创建一次。也就是说，函数不会根据依赖数组的变化而二次创建。</p></li></ol><h2 id="vue-composition-api-是否美好" tabindex="-1">Vue Composition API 是否美好 <a class="header-anchor" href="#vue-composition-api-是否美好" aria-label="Permalink to &quot;Vue Composition API 是否美好&quot;">​</a></h2><p>Vue 一直被人所称道的就是其开发简便，这也是隐式依赖跟踪带来的便利。然而成也萧何败也萧何，Vue 诟病的一点就是闭包对象的不可预测性，例如 this。</p><p>在 Vue Composition API 中，我发现官方对 Ref 和 Reactive 给出了最佳实践。可能这里就有所谓的幻灭存在，就像当年很多人不听 React 官方最佳实践，在 componentWillMount 里获取数据一样。</p><p>Ref vs. Reactive 章节中有如下的对比：</p><div class="language-typescript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// style 1: separate variables</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">let</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> x </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">let</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> y </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> updatePosition</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">e</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  x </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> e.pageX</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  y </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> e.pageY</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// --- compared to ---</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// style 2: single object</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> pos</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  x: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  y: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> updatePosition</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">e</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  pos.x </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> e.pageX</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  pos.y </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> e.pageY</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>那么依赖跟踪的迷惑就此开始，因为当你对已经 reactive 的对象进行解构赋值或者赋给新值的时候，依赖跟踪就失效了。官方对这个的态度比较模糊：</p><blockquote><p><em>在现阶段，我们认为在 ref vs reactive 上实施最佳做法为时尚早。我们建议您从上面的两个选项中选择与您的心智模型相符的方式。我们将收集实开发场景下的用户真反馈，并最终提供有关此主题的更明确的指导。</em></p></blockquote><h2 id="对比-react-hooks-和-vue-composition-api-官方版本" tabindex="-1"><a href="https://cn.vuejs.org/guide/extras/composition-api-faq.html#comparison-with-react-hooks" target="_blank" rel="noreferrer">对比 React Hooks 和 Vue Composition API</a>（官方版本） <a class="header-anchor" href="#对比-react-hooks-和-vue-composition-api-官方版本" aria-label="Permalink to &quot;[对比 React Hooks 和 Vue Composition API](https://cn.vuejs.org/guide/extras/composition-api-faq.html#comparison-with-react-hooks)（官方版本）&quot;">​</a></h2><p>组合式 API 提供了和 React Hooks 相同级别的逻辑组织能力，但它们之间有着一些重要的区别。</p><p>React Hooks 在组件每次更新时都会重新调用。这就产生了一些即使是经验丰富的 React 开发者也会感到困惑的问题。这也带来了一些性能问题，并且相当影响开发体验。例如：</p><ul><li><strong>Hooks 有严格的调用顺序</strong>，并不可以写在条件分支中。</li><li>React 组件中定义的变量会被一个钩子函数闭包捕获，若开发者传递了错误的依赖数组，它会变得“过期”。这导致了 React 开发者非常依赖 ESLint 规则以确保传递了正确的依赖，然而，这些规则往往不够智能，保持正确的代价过高，在一些边缘情况时会遇到令人头疼的、不必要的报错信息。</li><li>昂贵的计算需要使用 <code>useMemo</code>，这也需要传入正确的依赖数组。</li><li>在默认情况下，<strong>传递给子组件的事件处理函数会导致子组件进行不必要的更新</strong>。子组件默认更新，并需要显式的调用 <code>useCallback</code> 作优化。这个优化同样需要正确的依赖数组，并且几乎在任何时候都需要。忽视这一点会导致默认情况下对应用进行过度渲染，并可能在不知不觉中导致性能问题。</li><li>要解决变量闭包导致的问题，再结合并发功能，使得很难推理出一段钩子代码是什么时候运行的，并且很不好处理需要在多次渲染间保持引用 (通过 <code>useRef</code>) 的可变状态。</li></ul><p>相比起来，Vue 的组合式 API：</p><ul><li><strong>仅调用 <code>setup()</code> 或 <code>&lt;script setup&gt;</code> 的代码一次</strong>。这使得代码更符合日常 JavaScript 的直觉，不需要担心闭包变量的问题。组合式 API 也并不限制调用顺序，还可以有条件地进行调用。</li><li>Vue 的响应性系统运行时会自动收集计算属性和侦听器的依赖，因此<strong>无需手动声明依赖</strong>。</li><li><strong>无需手动缓存回调函数来避免不必要的组件更新</strong>。Vue 细粒度的响应性系统能够确保在绝大部分情况下组件仅执行必要的更新。对 Vue 开发者来说几乎不怎么需要对子组件更新进行手动优化。</li></ul><p>我们承认 React Hooks 的创造性，它是组合式 API 的一个主要灵感来源。然而，它的设计也确实存在上面提到的问题，而 Vue 的响应性模型恰好提供了一种解决这些问题的方法。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>很多时候，我们不得不去考虑一些本来不该我们考虑、而应该是框架层面解决的问题。</p><p>仔细寻思一下，其实所有问题的根源，是 React 函数时组件机制所限：每次组件渲染，组件里的所有代码都会被重新调用一次。而 Vue 的组合式API 和 React hooks 如此类似，但是它之所以没有这么多烦恼，主要是因为它的 setup 只会在整个组件的生命周期内执行一次。</p><p>在对比了 Vue 组合式 API 与 React Hooks 之后，我们发现它们并不是像看上去那样变得逐渐相似，恰恰相反，它们进一步把自己的特点推向了极致。</p><h2 id="参考链接" tabindex="-1">参考链接 <a class="header-anchor" href="#参考链接" aria-label="Permalink to &quot;参考链接&quot;">​</a></h2><p><a href="https://cn.vuejs.org/guide/extras/composition-api-faq.html" target="_blank" rel="noreferrer">组合式 API 常见问答 | Vue.js (vuejs.org)</a></p><p><a href="https://juejin.cn/post/6847902223918170126" target="_blank" rel="noreferrer">Vue Composition API 和 React Hooks 对比 - 掘金 (juejin.cn)</a></p><p><a href="https://github.com/reactjs/react-basic" target="_blank" rel="noreferrer">GitHub - reactjs/react-basic：A description of the conceptual model of React without implementation burden.</a></p><p><a href="https://zhuanlan.zhihu.com/p/139548169" target="_blank" rel="noreferrer">对比 Vue Composition API 和 React Hooks - 知乎 (zhihu.com)</a></p>`,42),o=[l];function n(p,r,h,k,c,d){return a(),i("div",null,o)}const E=s(t,[["render",n]]);export{g as __pageData,E as default};
