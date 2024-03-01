import{_ as a,c as t,o as e,a4 as s}from"./chunks/framework.B-C7vMfR.js";const R=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"Web/React/基础/React哲学.md","filePath":"Web/React/基础/React哲学.md"}'),o={name:"Web/React/基础/React哲学.md"},r=s('<h2 id="react-哲学" tabindex="-1">React 哲学 <a class="header-anchor" href="#react-哲学" aria-label="Permalink to &quot;React 哲学&quot;">​</a></h2><p>我们认为，React 是用 JavaScript 构建快速响应的大型 Web 应用程序的首选方式。它在 Facebook 和 Instagram 上表现优秀。</p><p>React 最棒的部分之一是引导我们思考如何构建一个应用。在这篇文档中，我们将会通过 React 构建一个可搜索的产品数据表格来更深刻地领会 React 哲学。</p><h3 id="第一步-将设计好的-ui-划分为组件层级" tabindex="-1">第一步：将设计好的 UI 划分为组件层级 <a class="header-anchor" href="#第一步-将设计好的-ui-划分为组件层级" aria-label="Permalink to &quot;第一步：将设计好的 UI 划分为组件层级&quot;">​</a></h3><p>但你如何确定应该将哪些部分划分到一个组件中呢？你可以将组件当作一种函数或者是对象来考虑，根据<strong>单一功能原则</strong>来判定组件的范围。也就是说，一个组件原则上只能负责一个功能。如果它需要负责更多的功能，这时候就应该考虑将它拆分成更小的组件。</p><h3 id="第二步-用-react-创建一个静态版本" tabindex="-1">第二步：用 React 创建一个静态版本 <a class="header-anchor" href="#第二步-用-react-创建一个静态版本" aria-label="Permalink to &quot;第二步：用 React 创建一个静态版本&quot;">​</a></h3><p>现在我们已经确定了组件层级，可以编写对应的应用了。最容易的方式，是先用已有的数据模型渲染一个不包含交互功能的 UI。最好将渲染 UI 和添加交互这两个过程分开。这是因为，编写一个应用的静态版本时，往往要编写大量代码，而不需要考虑太多交互细节；添加交互功能时则要考虑大量细节，而不需要编写太多代码。所以，将这两个过程分开进行更为合适。我们会在接下来的代码中体会到其中的区别。</p><p>你可以自上而下或者自下而上构建应用：自上而下意味着首先编写层级较高的组件，自下而上意味着从最基本的组件开始编写。当你的应用比较简单时，使用自上而下的方式更方便；对于较为大型的项目来说，自下而上地构建，并同时为低层组件编写测试是更加简单的方式。</p><p>React 单向数据流（也叫单向绑定）的思想使得组件模块化，易于快速开发。</p><h3 id="第三步-确定-ui-state-的最小-且完整-表示" tabindex="-1">第三步：确定 UI state 的最小（且完整）表示 <a class="header-anchor" href="#第三步-确定-ui-state-的最小-且完整-表示" aria-label="Permalink to &quot;第三步：确定 UI state 的最小（且完整）表示&quot;">​</a></h3><p>想要使你的 UI 具备交互功能，需要有触发基础数据模型改变的能力。React 通过实现 state 来完成这个任务。</p><p>为了正确地构建应用，你首先需要找出应用所需的 state 的最小表示，并根据需要计算出其他所有数据。其中的关键正是<code>DRY: Don’t Repeat Yourself</code>。只保留应用所需的可变 state 的最小集合，其他数据均由它们计算产生。</p><p>通过问自己以下三个问题，你可以逐个检查相应数据是否属于 state：</p><ol><li>该数据是否是由父组件通过 props 传递而来的？如果是，那它应该不是 state。</li><li>该数据是否随时间的推移而保持不变？如果是，那它应该也不是 state。</li><li>你能否根据其他 state 或 props 计算出该数据的值？如果是，那它也不是 state。</li></ol><h3 id="第四步-确定-state-放置的位置" tabindex="-1">第四步：确定 state 放置的位置 <a class="header-anchor" href="#第四步-确定-state-放置的位置" aria-label="Permalink to &quot;第四步：确定 state 放置的位置&quot;">​</a></h3><p>我们已经确定了应用所需的 state 的最小集合。接下来，我们需要确定哪个组件能够改变这些 state，或者说拥有这些 state。</p><p>注意：React 中的数据流是单向的，并顺着组件层级从上往下传递。哪个组件应该拥有某个 state 这件事，对初学者来说往往是最难理解的部分。尽管这可能在一开始不是那么清晰，但你可以尝试通过以下步骤来判断：</p><p>对于应用中的每一个 state：</p><ol><li>找到根据这个 state 进行渲染的所有组件。</li><li>找到他们的共同所有者（common owner）组件（在组件层级上高于所有需要该 state 的组件）。</li><li>该共同所有者组件或者比它层级更高的组件应该拥有该 state。</li><li>如果你找不到一个合适的位置来存放该 state，就可以直接创建一个新的组件来存放该 state，并将这一新组件置于高于共同所有者组件层级的位置。</li></ol><h3 id="第五步-添加反向数据流" tabindex="-1">第五步：添加反向数据流 <a class="header-anchor" href="#第五步-添加反向数据流" aria-label="Permalink to &quot;第五步：添加反向数据流&quot;">​</a></h3><p>到目前为止，我们已经借助自上而下传递的 props 和 state 渲染了一个应用。现在，我们将尝试让数据反向传递：处于较低层级的表单组件更新较高层级的 FilterableProductTable 中的 state。</p><p>React 通过一种比传统的<strong>双向绑定</strong>略微繁琐的方法来实现反向数据传递。尽管如此，但这种需要显式声明的方法更有助于人们理解程序的运作方式。</p><h3 id="这就是全部了" tabindex="-1">这就是全部了 <a class="header-anchor" href="#这就是全部了" aria-label="Permalink to &quot;这就是全部了&quot;">​</a></h3><p>希望这篇文档能够帮助你建立起构建 React 组件和应用的一般概念。尽管你可能需要编写更多的代码，但是别忘了：比起写，代码更多地是给人看的。我们一起构建的这个模块化示例应用的代码就很易于阅读。当你开始构建更大的组件库时，你会意识到这种代码模块化和清晰度的重要性。并且随着代码重用程度的加深，你的代码行数也会显著地减少。😃</p>',24),c=[r];function i(l,p,n,h,d,_){return e(),t("div",null,c)}const b=a(o,[["render",i]]);export{R as __pageData,b as default};
