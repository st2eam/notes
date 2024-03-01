import{_ as a,c as t,o as n,a4 as i,m as s}from"./chunks/framework.B-C7vMfR.js";const u=JSON.parse('{"title":"[转] 构建面向未来的前端架构","description":"","frontmatter":{},"headers":[],"relativePath":"Web/React/高级/构建面向未来的前端架构.md","filePath":"Web/React/高级/构建面向未来的前端架构.md"}'),e={name:"Web/React/高级/构建面向未来的前端架构.md"},p=i(`<h1 id="转-构建面向未来的前端架构" tabindex="-1">[转] 构建面向未来的前端架构 <a class="header-anchor" href="#转-构建面向未来的前端架构" aria-label="Permalink to &quot;[转] 构建面向未来的前端架构&quot;">​</a></h1><h2 id="常见的心智模式" tabindex="-1">常见的心智模式 <a class="header-anchor" href="#常见的心智模式" aria-label="Permalink to &quot;常见的心智模式&quot;">​</a></h2><blockquote><p><strong>心智模型</strong>，是对事物的思考方式，在很大程度上影响了我们的决定。</p></blockquote><p>在大型的代码库中，正是通过不断做出的各种决定导致了代码的整体结构。</p><p>当我们进行多人员协作时，最重要的就是<strong>统一思想</strong>，这样才可以劲往一处使。如若不然，每个人都有附带自己的思考去做同一件事，在一些问题上就会南辕北辙。</p><p>这就是为什么在团队协作的时候，需要制定一些符合团体<strong>代码风格</strong>或者借助<a href="https://link.juejin.cn?target=https%3A%2F%2Fprettier.io%2F" title="https://prettier.io/" target="_blank" rel="noreferrer">prettier</a>这样的工具进行格式制约。作为一个整体，我们有一个共同的<strong>心智模式</strong>，即统一思想，集中力量办一件事。</p><p>如果你曾经接手过<strong>号称</strong>当时由于<em>时间紧，任务重</em>而快速迭代开发的项目的时候，同时在开发的时候没有统一的代码组织方案，随着时间的推迟(不用很久，一个月足矣)，所维护的代码就是各种问题，代码结构越来越乱，变量横飞，回调<strong>贯穿</strong>整颗元素树，运行时性能越来越差。</p><ul><li>悄悄的说一句，这不就是💩⛰吗!</li><li>弱弱的问一下，你擅长雕花吗！</li><li>同情的讲一下，你背的东西多吗！</li></ul><p>如果，你想改变这种情况，那接下来的内容，你值得拥有。你会了解到如下内容：</p><ul><li>在使用像<code>React</code>这样的<strong>基于组件</strong>的框架开发前端应用程序时，最常见的心智模型是什么？</li><li>它们是如何影响我们的组件结构的？</li><li>它们中隐含着哪些权衡，我们可以将其明确化？</li></ul><hr><h2 id="组件思维" tabindex="-1">组件思维 <a class="header-anchor" href="#组件思维" aria-label="Permalink to &quot;组件思维&quot;">​</a></h2><blockquote><p><code>React</code> 是最流行的<strong>基于组件</strong>的前端框架。</p></blockquote><p>在<code>React</code>官网文档中有一篇<a href="https://link.juejin.cn?target=https%3A%2F%2Freactjs.org%2Fdocs%2Fthinking-in-react.html" title="https://reactjs.org/docs/thinking-in-react.html" target="_blank" rel="noreferrer">Thinking in react</a>，它阐述了在以 <strong>React方式</strong>构建前端应用程序时如何思考的心智模型。</p><p>它所阐述的主要原则，指导你在构建一个组件时需要考虑哪些方面。</p><ul><li><p><strong>组件的责任是什么</strong>？好的组件API设计自然遵循{单一责任原则|Single Responsibility Principle}，这对{组合模式|Composition Patterns}很重要。我们很容易把简单的东西混为一谈。随着需求的新增和变更，<strong>保持简单的东西往往是相当困难的</strong>。</p></li><li><p>什么是其<strong>状态的最小，但完整</strong>的表示？我们的想法是，从<strong>最小但完整</strong>的状态开始，你可以从中推导出变化。这很灵活，很简单，而且可以避免常见的数据同步错误，比如更新一个状态而不更新另一个。</p></li><li><p><strong>状态应该住在哪里</strong>？<strong>状态管理</strong>是一个广泛的话题，如果想了解可以参考<a href="https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FkIRJDnGgSWEVJRCxUg1MAw" title="https://mp.weixin.qq.com/s/kIRJDnGgSWEVJRCxUg1MAw" target="_blank" rel="noreferrer">React-全局状态管理的群魔乱舞</a>，我们不在这里进行过多的赘述。但一般来说，如果一个状态可以被变成一个组件的本地状态，优先将其设置为组件本地<code>state</code>。<strong>组件内部对全局状态的依赖越多，它们的可重用性就越低</strong>。提出这个问题对于确定哪些组件应该依赖哪些状态是很有用的。</p></li></ul><blockquote><p><strong>一个组件最好只做一件事</strong>。如果它最终成长起来，它应该被分解成更小的子组件。</p></blockquote><p>这里原则是简单的、经过实践检验的，而且它们对驯服复杂性很有效。它们构成了创建组件时最常见的心智模型的基础。</p><p><strong>但简单并不意味着容易</strong>。在实践中，在有多个团队和开发人员的大型项目中，这一点说起来容易做起来难。</p><p>这就引出了我们要探讨的两个问题。</p><ul><li>是什么情况阻碍了这些简单原则的应用？</li><li>我们怎样才能尽可能地减轻这些情况？</li></ul><p>下面我们将看到为什么随着时间的推移，<strong>保持简单性</strong>在实践中并不总是那么直接。</p><blockquote><p>成功的项目往往来自于<strong>对基本原则的坚持</strong>，而且是持续的坚持。并且不犯太多代价高昂的错误。</p></blockquote><hr><h2 id="自上而下-top-down-与-自下而上-bottom-up" tabindex="-1">自上而下|Top down 与 自下而上|Bottom up <a class="header-anchor" href="#自上而下-top-down-与-自下而上-bottom-up" aria-label="Permalink to &quot;自上而下|Top down 与 自下而上|Bottom up&quot;">​</a></h2><p>组件是<code>React</code>等现代框架的<strong>核心抽象单位</strong>。有两种主要的方式来考虑创建它们。</p><blockquote><p>你可以<strong>自上而下</strong>或<strong>自下而上</strong>地构建。</p><ul><li>在比较简单的项目中，<strong>自上而下</strong>比较容易</li><li>而在比较大的项目中，<strong>自下而上</strong>比较容易</li></ul></blockquote><hr><h2 id="自上而下的构建组件" tabindex="-1">自上而下的构建组件 <a class="header-anchor" href="#自上而下的构建组件" aria-label="Permalink to &quot;自上而下的构建组件&quot;">​</a></h2><p>上面总结隐含着一种<strong>权衡</strong></p><ul><li>对较简单的项目采取自上而下的方法</li><li>对大型项目采取<em>较慢的、可扩展的</em>自下而上的方法</li></ul><p><strong>自上而下通常是最直观和最直接的方法</strong>。这也是从事功能开发的开发人员在构建组件时最常见的心智模式。</p><p><strong>自上而下的方法是什么样子的？</strong> 当开始页面结构设计时，常见的建议是：“在用户界面周围画上方框，这些将成为你的组件”。</p><p>这构成了我们最终创建的<em>顶层组件</em>的基础。采用这种方法，我们通常以创建一个<em>粗略的组件</em>来开始构建页面。</p><p>假设，我们现在接到了一个<strong>用户管理系统</strong>的需求。从页面设计的角度，我们来看看需要哪些组件。</p><p>在设计中，它有一个<em>侧边栏导航</em>。我们在侧边栏周围画一个方框，意味着要创建一个<code>&lt;SideNavigation /&gt;</code>组件。</p><p>按照这种自上而下的方法，我们可以规划它需要什么<code>props</code>，以及它如何渲染。假设我们从后端获得导航的列表数据。按照自上而下的模式，我们可以构建一个类似下面的伪代码的初始设计。</p><div class="language-jsx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">jsx</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//从某个地方调用接口获得列表数据</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//然后转换为一个列表，传递给导航组件</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> navItems</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        { label: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;首页&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, to: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;/home&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        { label: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;信息展示&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, to: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;/dashboards&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        { label: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;页面设置&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, to: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;/settings&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    ]</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    ...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">SideNavigation</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> items</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{navItems} /&gt;</span></span></code></pre></div><p>到目前为止，使用自上而下的方法相当直接和直观。我们的目的是<strong>使事情变得简单和可重复使用</strong>，消费者只需要传入他们想要呈现的数据信息，剩余的事情都由<code>SideNavigation</code>为他们代劳。</p><p>还有一些需要注意的事情，在自上而下的模式中是常见的。</p><ol><li><p>我们从最初确定的<strong>顶层边界</strong>开始设计，通过<em>画方框</em>的方式来敲定我们需要的组件。</p></li><li><p>它是一个<strong>单一的抽象</strong>，处理所有与侧面导航栏有关的事情。</p></li><li><p>它的API通常是 <strong>自上而下</strong>的，即消费者通过顶部传递它需要工作的数据，它负责处理框架渲染的所有相关事宜。<br> 很多时候，我们的组件直接从后端获取数据，所以这也符合将数据 <strong>向下</strong>传递到组件中进行渲染的模式。</p></li></ol><p>对于较小的项目，这种方法能够简单快速的构建页面。<strong>但是</strong>，针对大型项目来讲，这种自上而下的数据流向就会出现问题。</p><hr><h3 id="自上而下模式的弊端" tabindex="-1">自上而下模式的弊端 <a class="header-anchor" href="#自上而下模式的弊端" aria-label="Permalink to &quot;自上而下模式的弊端&quot;">​</a></h3><p><strong>自上而下的思维模式</strong>倾向于一开始就把自己固定在一个特定的抽象逻辑上，以解决眼前的问题。它是直观的。它常常被认为是构建组件的<strong>最直接的方法</strong>。</p><p>这里有一个比较常见的场景。在一个正在快速迭代的项目中。你已经通过<em>画方框</em>的方式来界定出你组件的范围并将其交付到页面中。但是，新需求出现了，需要你针对导航组件进行修改。</p><p>这时，事情就会迅速开始变得棘手。如果处理不当的话，无形中会构建出许多，代码臃肿，职责范围过于单一的<strong>野组件</strong>。</p><p>在其对现有组件的抽象思路和<code>API</code>有一个简单了解前提下，需求继任者在需求变更的<em>裹挟</em>下，在开始<code>coding</code>之前，它可能会有如下的心理路程。</p><ul><li><p>思考这是否是<strong>正确的抽象</strong>。如果不是，在处理新需求的过程中，就可以通过<em>代码重构</em>对其进行改造处理。</p></li><li><p>增加一个额外的属性。在一个简单的条件后面添加新的功能(<code>React</code>中的条件渲染)，只需要判定特定的属性，来处理新增需求的变更。它的好处就是，快。没错，就是快。</p></li></ul><blockquote><p>现有的抽象原则产生了强大的影响。它的存在证明了它是正确和必要的。</p><p>代码封装代表着所付出的努力，而我们非常热衷于去保护这种<strong>既有</strong>的努力成果。<br><strong>不幸的是</strong>，可悲的事实是，代码越复杂，越难以理解，也就是说，在代码中倾注的付出越多，我们就更愿意去维护现有逻辑。 -- <strong>沉没成本谬论</strong></p></blockquote><p><em>沉没成本谬论</em>之所以存在，是因为我们天生对避免损失比较敏感。</p><p>在规模的加持下，每次较小的决定都会导致我们的组件变得更加复杂。当组件变的臃肿&amp;复杂的时候，我们已经违背了<code>React</code>中构建组件的基本原则之一 -- 简单性(一个组件最好只做一件事)</p><p>让我们把这种常见的情况应用到我们简单的导航组件上。</p><p>第一个需求变更出现了。需要处理导航项，使其具有图标、不同大小的文本，并使其中的一些项能够<em>外链</em>到非本系统。</p><p>在实践中，UI拥有大量的<strong>视觉状态</strong>。我们还想拥有像分隔符、一些默认被选中状态等东西。</p><p>所以我们现在的类型可能看起来像这样，<code>type</code>对应于它是一个链接还是一个普通的导航项。</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{ id, to, label, icon, size, type, separator, isSelected }</span></span></code></pre></div><p>然后在<code>&lt;SideNavigation /&gt;</code>里面，我们将不得不检查<code>type</code>属性，并根据它来渲染导航项。</p><blockquote><p>这里的问题是，具有这样的API的自上而下的组件，必须通过<strong>增加API来响应需求的变化</strong>，并根据传入的内容在内部进行逻辑的<strong>分叉处理</strong>。</p></blockquote><p>因为我们把导航项的列表作为一个数组传递给侧边栏组件，对于这些<em>新的要求</em>，我们需要在这些对象上添加一些<em>额外的属性</em>，以区分新类型的导航项和它们的各种状态。</p><p><strong>冰冻三尺非一日之寒</strong></p><p>几周后，有人要求提供一个新的功能，要求在点击一个导航项目，并过渡到该项目下的子导航，并有一个返回按钮回到主导航列表。并且还希望管理员能够通过拖放来重新排列导航项。</p><p>需求的不断变更，事情变得愈发不可控制。</p><p>一开始是一个相对简单的组件，有一个简单的API，但在几个快速迭代的过程中，很快就会发展成其他东西。</p><p>基于此时的现状，下一个需要使用或改编这个组件的开发者或团队要面对的是<strong>一个需要复杂配置的单体组件，而且很可能根本没有相关使用文档</strong>。</p><p>我们最初的意图是 <strong>只要把列表传下去，剩下的就由组件来处理</strong>，但在这一点上，我们的意图又起了<strong>反作用</strong>，这个组件既慢又有风险，难以修改。</p><p>在这一点上，一个常见的情况是考虑扔掉一切，<strong>从头开始重写这个组件</strong>。</p><hr><h3 id="单体组件-monolithic-components-的健康增长" tabindex="-1">{单体组件|Monolithic Components}的健康增长 <a class="header-anchor" href="#单体组件-monolithic-components-的健康增长" aria-label="Permalink to &quot;{单体组件|Monolithic Components}的健康增长&quot;">​</a></h3><blockquote><p>除了第一次，一切都应该自上而下地构建</p></blockquote><p>正如我们所看到的，<strong>单体组件是那些试图做太多事情的组件</strong>。它们通过<code>props</code>接收过多的数据或配置选项，管理过多的状态，并输出过多的用户界面。</p><p>它们通常从简单的组件开始，通过需求的不断变更和新增，随着时间的推移，最终做了太多的事情。</p><p><strong>一开始只是一个简单的组件，在几个迭代过程并追加新功能后，就会变成一个单体组件</strong>。</p><p>当这种情况发生在多个组件上时，并且多人同时在同一个代码库中开发，代码很快就会变得更难改变，页面也会变的更慢。</p><p>以下是单体组件可能导致<em>性能问题</em>或者<em>代码臃肿</em>的原因。</p><h4 id="过早的抽象化" tabindex="-1">过早的抽象化 <a class="header-anchor" href="#过早的抽象化" aria-label="Permalink to &quot;过早的抽象化&quot;">​</a></h4><p><strong>这是另外一个导致单体组件出现的原因</strong>。 这与作为软件开发者早期被灌输的一些常见<em>开发模式</em>有关。特别是对 {DRY|Don’t Repeat Yourself}的原则。</p><p>事实上，<code>DRY</code>在早期就已经深入人心，而我们在组成组件的地方看到了<em>少量的重复</em>。我们很容易想到 &quot;这东西重复得很厉害，如果能把它抽象成一个单一的组件就好了&quot;，于是我们就<strong>匆忙地进行了过早的抽象</strong>。</p><p>一切都是权衡的结果，但<strong>从没有抽象中恢复过来比从错误的抽象中恢复过来要容易得多</strong>。 我们会在下面继续介绍，这里做一个剧透，<strong>从一个自下而上的模型开始，我们可以有机地达成这些抽象，使我们能够避免过早地创建它们</strong>。</p><h4 id="阻碍跨团队的代码重用" tabindex="-1">阻碍跨团队的代码重用 <a class="header-anchor" href="#阻碍跨团队的代码重用" aria-label="Permalink to &quot;阻碍跨团队的代码重用&quot;">​</a></h4><p>你经常会发现另一个团队已经实施了或正在进行与你的团队所需要的东西类似的工作。</p><p>在大多数情况下，它可以做你想要的90%的事情，但你想要一些轻微的变化。或者你只是想重新使用它的某一部分功能，而不需要把整个东西都搬过来。</p><p>如果它是一个&quot;全有或全无&quot;的单体组件，那么就很难复用现有的逻辑。与重构或者直接修改别人组件或者库的方式相比，在你自己的组件中重新实现相关逻辑或者利用<em>条件</em>判断来进行逻辑复用，显的更加安全。 但是，如果此处变更涉及多个组件，那就需要对多个组件进行相同的处理。</p><h4 id="增加包的大小" tabindex="-1">增加包的大小 <a class="header-anchor" href="#增加包的大小" aria-label="Permalink to &quot;增加包的大小&quot;">​</a></h4><p>我们怎样才能只允许在<strong>正确的时间</strong>加载、解析和运行需要的代码？</p><p>有一些组件是更重要的，要先给用户看。对于大型应用来说，一个关键的性能策略是根据优先级在页面渲染阶段通过异步操作加载代码。</p><p>同时，我们还可以在进行刷新操作时候，对用于实际看到的组件进行<strong>服务端渲染</strong>处理。</p><p><strong>单体组件</strong>阻止了这些努力的发生，因为你<em>必须把所有的东西作为一个大块的组件来加载</em>。</p><p>如果独立的组件的话，这些组件就可被优化，并且只在用户<strong>真正需要</strong>的时候加载。<strong>消费者只需支付他们实际使用的性能价格</strong>。</p><h4 id="运行时性能不佳" tabindex="-1">运行时性能不佳 <a class="header-anchor" href="#运行时性能不佳" aria-label="Permalink to &quot;运行时性能不佳&quot;">​</a></h4><p>像<code>React</code>这样的框架，有一个简单的<code>state-&gt;UI</code>的功能模型，是令人难以置信的生产力。但是，为了查看虚拟DOM中的变化而进行的<strong>调和操作</strong>在页面规模比较大的情况下是很昂贵的。<strong>单体组件很难保证在状态发生变化时只重新渲染最少的东西</strong>。</p><p>在像<code>React</code>这样的拥有虚拟DOM的框架中，要实现更好的渲染性能，最简单的方法之一就是</p><blockquote><p>将根据<strong>状态变化的进行归类</strong>，同属一类的组件变化，无论是渲染时机还是代码存放位置，都进行统一处理，对于不隶属于同类变更的组件进行隔离处理。</p></blockquote><p>因此，当状态发生变化时，你只需重新渲染严格意义上需要的部分。</p><p>在单体组件和一般的自上而下的方法中，找到这种分割是很困难的，容易出错，而且常常导致过度使用<code>memo()</code>。</p><hr><h2 id="自下而上的构建组件" tabindex="-1">自下而上的构建组件 <a class="header-anchor" href="#自下而上的构建组件" aria-label="Permalink to &quot;自下而上的构建组件&quot;">​</a></h2><p>与自上而下的方法相比，自下而上的方法往往不那么直观，而且最初可能会比较慢。</p><p>当你试图需求快速迭代时，这是一个不直观的方法，因为在实践中不是每个组件都需要可重用。</p><p>然而，创建API可以重用的组件，即使它们不是重用的，通常会导致更多的可读、可测试、可改变和可删除的组件结构。</p><p>关于事情应该被分解到什么程度，没有一个正确的答案。管理这个问题的关键是使用{单一责任原则|Single Responsibility Principle}作为指导准则。</p><p><strong>自下而上的心智模式与自上而下有什么不同</strong>？</p><p>回到原来的示例。采用自下而上的方法，我们仍然有可能创建一个顶层的<code>&lt;SideNavigation /&gt;</code>，但我们如何建立它才是最重要的。</p><p>我们确定了顶层的<code>&lt;SideNavigation /&gt;</code>，但不同的是我们的工作并不是从这里开始。</p><p>它开始于对构成<code>&lt;SideNavigation /&gt;</code>整体功能的所有底层元素信息的收录工作，并构建那些可以被组合在一起的小块。这样一来，它在开始时就显的不那么重要了。</p><p><strong>总的复杂性分布在许多较小的单一{责任组件|Responsibility Components}中，而不是一个单一的单体组件</strong>。</p><p>自下而上的方法是什么样子的？</p><p>让我们回到导航的例子。下面是一个简单情况下可能出现的例子。</p><div class="language-jsx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">jsx</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">SideNavigation</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        &lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">NavItem</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> to</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;/home&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;首页&lt;/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">NavItem</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        &lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">NavItem</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> to</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;/settings&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;设置页面&lt;/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">NavItem</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">SideNavigation</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><p>在简单的情况下，没有什么了不起。支持嵌套组的API会是什么样子？</p><div class="language-jsx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">jsx</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">SideNavigation</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        &lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Section</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            &lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">NavItem</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> to</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;/home&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;首页&lt;/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">NavItem</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            &lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">NavItem</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> to</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;/projects&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;项目&lt;/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">NavItem</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            &lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Separator</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            &lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">NavItem</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> to</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;/settings&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;设置页面&lt;/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">NavItem</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            &lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">LinkItem</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> to</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;/foo&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;Foo&lt;/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">NavItem</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        &lt;/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Section</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        &lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">NestedGroup</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            &lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">NestedSection</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> title</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;项目目录&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                &lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">NavItem</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> to</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;/project-1&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;项目 1&lt;/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">NavItem</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                &lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">NavItem</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> to</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;/project-2&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;项目 2&lt;/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">NavItem</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                &lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">NavItem</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> to</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;/project-3&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;项目 3&lt;/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">NavItem</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                &lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">LinkItem</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> to</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;/foo.com&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;介绍文档&lt;/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">LinkItem</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            &lt;/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">NestedSection</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        &lt;/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">NestedGroup</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">SideNavigation</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><p>自下而上的方法的最终结果是直观的。它需要更多的前期努力，因为更简单的API的复杂性被封装在各个组件中。但这也使得它成为一种能够进行页面自由组装的优势。</p><p>与我们自上而下的方法相比，好处很多。</p><ol><li>使用该组件的不同团队只需对他们<strong>实际导入和使用的组件</strong>进行维护</li><li>可以很容易地用<strong>代码分割</strong>和<strong>异步加载</strong>那些对用户来说不是优先显示的元素</li><li><strong>渲染性能更好，更容易管理</strong>，因为只有因更新而改变的子树需要重新渲染</li><li>从代码结构的角度来看，它也更具有<strong>可扩展性</strong>，因为每个组件都可以被单独处理和优化。</li></ol><p>自下而上<em>最初比较慢</em>，但从长远来看会更快，因为它的扩展性更强。你可以更容易地避免仓促的抽象，这是防止单体组件泛滥的最好方法。</p><p>假设我们在组装现有的页面，在采用自下而上的构建方式下，时间和精力往往耗费在<strong>零件组装</strong>上。但是从后期的可维护性来讲，这是一个值得做的事。</p><p>自下而上方法的力量在于，你的页面构建以<strong>我可以将哪些简单的基础原件组合在一起以实现我想要的东西</strong>为前提，而不是一开始就考虑到某个特定的抽象。</p><blockquote><p>敏捷软件开发最重要的经验之一是<strong>迭代的价值</strong></p></blockquote><p><strong>自下而上的方法可以让你在长期内更好地进行迭代</strong>。</p><hr><h2 id="避免单体组件的策略" tabindex="-1">避免单体组件的策略 <a class="header-anchor" href="#避免单体组件的策略" aria-label="Permalink to &quot;避免单体组件的策略&quot;">​</a></h2><h3 id="平衡单一责任与dry的关系" tabindex="-1">平衡单一责任与DRY的关系 <a class="header-anchor" href="#平衡单一责任与dry的关系" aria-label="Permalink to &quot;平衡单一责任与DRY的关系&quot;">​</a></h3><p>自下而上的思考往往意味着接受{组合模式|Composition Patterns}。这就势必会导致在代码结构上重复。</p><p><code>DRY</code>是我们作为开发者学习的第一件事，而且将<strong>代码DRY化</strong>是一件令人心情愉悦的事情。但是，<strong>在使所有的东西都成为DRY之前，等待并看看是否需要它往往是更好的选择</strong>。</p><p>但这种方法可以让你随着项目的发展和需求的变化而能够轻松驾驭复杂的逻辑，并能够进行有意义的抽象处理。</p>`,125),l=s("h3",{"控制反转|Inversion":"",of:"",Control:"",id:"",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#","aria-label":'Permalink to "{控制反转|Inversion of Control}"'},"​")],-1),h=i(`<p>理解这一原则的一个简单例子是<code>callback</code>和<code>promise</code>之间的区别。</p><p>对于<code>callback</code>，你不一定知道这个函数会去哪里，会被调用多少次，或者用什么调用。</p><p><code>promise</code>将控制权转回给消费者，所以你可以开始组成你的逻辑，假装<code>value</code>已经在那里了。</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//可能不知道onLoaded会对我们传递给它的回调做什么</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  onLoaded</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">((</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">stuff</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">      doSomething</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(stuff);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  })</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 组件留在我们身边，开始组成逻辑，就像值已经在那里了</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  onLoaded.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">then</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">stuff</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">      doSomething</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(stuff);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  })</span></span></code></pre></div><p>在<code>React</code>的技术背景下，我们可以看到这是通过组件API设计实现的。</p><p>我们可以通过<code>children</code>暴露<code>slot</code>(槽)，或者通过<code>renderProps</code>来保持消费者对内容的控制权。</p><p>有时，人们对这方面的控制权反感，因为人们觉得消费者必须做更多的工作。但控制反转可以避免需要过多的牵扯以后的各种情况，也赋予了消费者控制逻辑的灵活性。</p><div class="language-jsx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">jsx</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 以 &quot;自上而下 &quot;的方式处理一个简单的按钮API</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Button</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> isLoading</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{loading} /&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//通过控制反转</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 给予消费者进行自我逻辑的拼接处理</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Button</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> before</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{loading </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">LoadingSpinner</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> /&gt; </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> null</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">} /&gt;</span></span></code></pre></div><p>第二个例子既能更灵活地应对不断变化的需求，又能更有效地执行，因为<code>&lt;LoadingSpinner /&gt;</code>不再需要成为<code>Button</code>组件内的一个<strong>依赖项</strong>。</p><p>你可以在这里看到自上而下与自下而上的微妙差别。在第一个例子中，我们传递数据并让组件处理它。在第二个例子中，我们必须做更多的工作，但最终它是一个更灵活、更有性能的方法。</p><p>同样有趣的是，<code>&lt;Button /&gt;</code> 本身可以由更小的基础单元组成。有时，一个特定的抽象概念下面有许多不同行为的子元素，这些元素可以被显性化。</p><p>例如，我们可以把它进一步<strong>分解</strong>成即适用于按钮和或者像<code>Link</code>组件这样的东西，它们可以组合成像<code>LinkButton</code>这样的东西。</p><h3 id="组件扩展" tabindex="-1">组件扩展 <a class="header-anchor" href="#组件扩展" aria-label="Permalink to &quot;组件扩展&quot;">​</a></h3><p>即使在使用组合模式自下而上地构建页面时。你仍然希望输出具有可消耗API的专门组件，但由较小的基础单元构建而成。为了灵活起见，你也可以从你的组件中<strong>公开</strong>那些构成专门组件的较小的模块。</p><p>理想情况下，你的组件只做一件事。因此，在预制抽象的情况下，消费者根据它们需要实现的操作，用他们自己的功能对其进行<strong>包装扩展</strong>。另外，他们也可以只用一些构成现有抽象的基础单元来构建他们所需要的东西。</p><h3 id="利用storybook驱动的发展" tabindex="-1">利用storybook驱动的发展 <a class="header-anchor" href="#利用storybook驱动的发展" aria-label="Permalink to &quot;利用storybook驱动的发展&quot;">​</a></h3><p>通常有大量的离散状态最终会在我们的组件中得到管理。组件状态库变得越来越流行是有原因的。</p><p>当我们用storybook孤立地构建我们的UI组件时，我们可以采用他们思维背后的模型，并为组件可能处于的每一种状态新增描述信息。</p><p>像这样提前做可以避免你在开发中对一些实现细节进行遗忘。</p><p>下面是一些比较常见措施，如何建立 {<a href="https://link.juejin.cn?target=https%3A%2F%2Foverreacted.io%2Fzh-hans%2Fwriting-resilient-components%2F" title="https://overreacted.io/zh-hans/writing-resilient-components/" target="_blank" rel="noreferrer">弹性组件</a>|Resilient Components} 。</p><h4 id="根据组件的实际作用为其命名" tabindex="-1">根据组件的实际作用为其命名 <a class="header-anchor" href="#根据组件的实际作用为其命名" aria-label="Permalink to &quot;根据组件的实际作用为其命名&quot;">​</a></h4><p>这又回到了单一责任原则。在名称有意义的情况下，<strong>不要害怕长的名字</strong>。</p><p>也很容易把一个组件的名字命名得比它实际做的事情稍微通用一些。当组件被命名为比它们实际做的事情更通用时，它向其他开发者表明，它是处理与X有关的一切的抽象。</p><p>因此，当新的需求出现时，它自然而然地成为进行改变的出发点。</p><h4 id="避免包含实施细节的props名称" tabindex="-1">避免包含实施细节的<code>props</code>名称 <a class="header-anchor" href="#避免包含实施细节的props名称" aria-label="Permalink to &quot;避免包含实施细节的\`props\`名称&quot;">​</a></h4><p>尤其是UI风格的 <strong>叶子</strong>组件。尽量避免添加像<code>isSomething</code>这样的<code>props</code>，因为有些东西是与内部状态或特定领域相关的。然后让该组件在该<code>props</code>被传入时做一些不同的事情。</p><p>如果你需要这样做，如果<code>props</code>的名字能反映出它的那个组件的上下文中的实际作用，那就更清楚了。</p><p>举个例子，如果<code>isSomething</code>props最终控制的是<code>padding</code>之类的东西，那么<code>props</code>名称就应该反映出这一点，而不是让组件知道一些看似无关的东西。</p><h4 id="谨慎对待通过props进行的配置" tabindex="-1">谨慎对待通过props进行的配置 <a class="header-anchor" href="#谨慎对待通过props进行的配置" aria-label="Permalink to &quot;谨慎对待通过props进行的配置&quot;">​</a></h4><p>这又回到了控制反转上。</p><p>像<code>&lt;SideNavigation navItems={items}/&gt;</code>这样的组件，如果你知道你只有一种类型的子组件（而且你知道这肯定不会改变！），就可以很好地解决这个问题，因为它们也可以安全地被<strong>类型化</strong>。</p><p>但正如我们所看到的，这种模式很难在不同的团队和需求快速迭代开发人员之间进行推广。</p><p>因为你经常会想要扩展组件，使其拥有不同的，或额外的子类型。这意味着你会在这些配置选项中添加更多的东西，或者<code>props</code>，并添加<strong>分叉逻辑</strong>。</p><p>与其让消费者安排和传递对象，一个更灵活的方法是把内部的子组件也导出，让消费者组成和传递组件。</p><h3 id="避免在渲染方法中定义组件" tabindex="-1">避免在渲染方法中定义组件 <a class="header-anchor" href="#避免在渲染方法中定义组件" aria-label="Permalink to &quot;避免在渲染方法中定义组件&quot;">​</a></h3><p>有时候，在一个组件中拥有 <strong>辅助</strong>组件是很常见的。这些组件最终会在每次渲染时被重新加载，并可能导致一些奇怪的错误。</p><p>此外，有多个内部的<code>renderX</code>、<code>renderY</code>方法往往是一种不好的举措。这些通常是一个组件变得单一化的标志，这些都是需要被进行分解处理的点。</p><hr><h2 id="分解单体组件" tabindex="-1">分解单体组件 <a class="header-anchor" href="#分解单体组件" aria-label="Permalink to &quot;分解单体组件&quot;">​</a></h2><p>如果可能的话，要经常和尽早地进行重构。识别可能发生变化的组件并积极分解它们是一个很好的策略。</p><p>当你发现组件变得过于复杂的情况下，通常有两个选择。</p><ol><li>重写逻辑并逐步迁移到新的组件上</li><li>渐进式地分解组件逻辑</li></ol><p>在<code>React</code>这样的框架中，<strong>组件实际上只是伪装的函数</strong>。针对组件的重构，也就是针对函数逻辑的分发和梳理。</p><p>下面是一些比较常见的方式可供参考。(后期，我们可以单写一篇关于组件重构的文章)</p><ul><li><a href="https://link.juejin.cn?target=https%3A%2F%2Frefactoring.com%2Fcatalog%2FremoveFlagArgument.html" title="https://refactoring.com/catalog/removeFlagArgument.html" target="_blank" rel="noreferrer">Remove Flag Argument</a></li><li><a href="https://link.juejin.cn?target=https%3A%2F%2Frefactoring.com%2Fcatalog%2FreplaceConditionalWithPolymorphism.html" title="https://refactoring.com/catalog/replaceConditionalWithPolymorphism.html" target="_blank" rel="noreferrer">Replace Conditional with Polymorphism</a></li><li><a href="https://link.juejin.cn?target=https%3A%2F%2Frefactoring.com%2Fcatalog%2FpullUpField.html" title="https://refactoring.com/catalog/pullUpField.html" target="_blank" rel="noreferrer">Pull Up Field</a></li><li><a href="https://link.juejin.cn?target=https%3A%2F%2Frefactoring.com%2Fcatalog%2FrenameVariable.html" title="https://refactoring.com/catalog/renameVariable.html" target="_blank" rel="noreferrer">Rename Variable</a></li><li><a href="https://link.juejin.cn?target=https%3A%2F%2Frefactoring.com%2Fcatalog%2FinlineFunction.html" title="https://refactoring.com/catalog/inlineFunction.html" target="_blank" rel="noreferrer">Inline Function</a></li></ul><hr><h2 id="内容回顾" tabindex="-1">内容回顾 <a class="header-anchor" href="#内容回顾" aria-label="Permalink to &quot;内容回顾&quot;">​</a></h2><p>断断续续，我们讲了很多概念和思路，让我们在最后做一个简短的梳理。</p><h4 id="心智模型影响着我们在设计和构建前端组件时做出的许多微观决定" tabindex="-1">心智模型影响着我们在设计和构建前端组件时做出的许多微观决定 <a class="header-anchor" href="#心智模型影响着我们在设计和构建前端组件时做出的许多微观决定" aria-label="Permalink to &quot;心智模型影响着我们在设计和构建前端组件时做出的许多微观决定&quot;">​</a></h4><p>将这些明确化是有用的，因为它们积累得相当快。这些决定的积累最终决定了我们后续工作的方向，在遇到新的需求时，心智模型决定着，我们是对现有工作进行减枝处理还是分叉处理，又或者采用新的架构，对其进行优化扩展。</p><h4 id="在构建组件时-自上而下和自下而上的做法会导致项目的最终结果不同" tabindex="-1">在构建组件时，自上而下和自下而上的做法会导致项目的最终结果不同 <a class="header-anchor" href="#在构建组件时-自上而下和自下而上的做法会导致项目的最终结果不同" aria-label="Permalink to &quot;在构建组件时，自上而下和自下而上的做法会导致项目的最终结果不同&quot;">​</a></h4><p>在构建组件时，一个自上而下的心智模型通常是最直观的。当涉及到分解用户界面时，最常见的模型是在功能区域周围画上方框，然后成为你的组件。这种功能分解的过程是自上而下的，通常会直接导致创建具有特定抽象性的专门组件。需求会改变。而在几个迭代过程中，这些组件很容易迅速变成单体组件。</p><h4 id="自上而下的设计和构建会导致单一的组件" tabindex="-1">自上而下的设计和构建会导致单一的组件 <a class="header-anchor" href="#自上而下的设计和构建会导致单一的组件" aria-label="Permalink to &quot;自上而下的设计和构建会导致单一的组件&quot;">​</a></h4><p>一个充满单体组件的代码库会导致一个缓慢的、对变化没有弹性的前端架构。单体组件之所以不好，是因为。</p><ul><li>需求变更和维护成本很高</li><li>需求变更是有风险的</li><li>很难跨团队利用现有的工作</li><li>性能很差</li><li>在采用面向未来的技术和架构时，它们会无形中新增阻力，而这些技术和架构对于扩展前端应用很重要，比如有效的<strong>代码拆分</strong>、跨团队的代码重用、加载阶段、渲染性能等。</li></ul><h4 id="避免创建单体组件" tabindex="-1">避免创建单体组件 <a class="header-anchor" href="#避免创建单体组件" aria-label="Permalink to &quot;避免创建单体组件&quot;">​</a></h4><p><code>React</code> 在设计组件时更有效地采用了自下而上的模式。这更有效地让你<strong>避免过早的抽象</strong>。这样，我们就可以在合适的时候进行抽象。这样的构建方式为组件<strong>组合模式</strong>的实现提供了更多的可能性。</p><hr><h2 id="后记" tabindex="-1">后记 <a class="header-anchor" href="#后记" aria-label="Permalink to &quot;后记&quot;">​</a></h2><p><strong>分享是一种态度</strong>。</p><p>作者：前端小魔女<br> 链接：<a href="https://juejin.cn/post/7127559810324627463" target="_blank" rel="noreferrer">https://juejin.cn/post/7127559810324627463</a><br> 来源：稀土掘金<br> 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。</p>`,61),o=[p,l,h];function r(k,g,d,c,E,F){return n(),t("div",null,o)}const m=a(e,[["render",r]]);export{u as __pageData,m as default};
