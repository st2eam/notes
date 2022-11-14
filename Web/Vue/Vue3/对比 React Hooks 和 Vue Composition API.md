## Hooks 概述

[React 的心智模型]([GitHub - reactjs/react-basic: A description of the conceptual model of React without implementation burden.](https://github.com/reactjs/react-basic))

> 心智模式又叫心智模型,是指深植我们心中关于我们自己、别人、组织及周围世界每个层面的假设、形象和故事。并深受习惯思维、定势思维、已有知识的局限。也通常指人们一种习以为常、理所当然的认知。

**Hooks** 是一项新功能提案，可让您在不编写类的情况下使用 state(状态) 和其他 React 功能。

React Hook 底层是基于链表实现，调用的条件是每次组件被 render 的时候都会顺序执行所有的 Hooks

Hook 的出现是划时代的，通过 function 抽离的方式，实现了复杂逻辑的内部封装：

- 逻辑代码的复用
- 减小了代码体积
- 没有 this 的烦恼

对于 Vue 提出的新的书写 Vue 组件的 API：Composition API RFC，作用也是类似，所以我们也可以像 React 一样叫做 Vue Hooks

- 该 API 受到 React Hooks 的启发
- 但有一些有趣的差异，规避了一些 React 的问题
## 什么是组合式API

组合式 API (Composition API) 是一系列 API 的集合，使我们可以使用函数而不是声明选项的方式书写 Vue 组件。它是一个概括性的术语，涵盖了以下方面的 API：

- [响应式 API](https://cn.vuejs.org/api/reactivity-core.html)：例如 `ref()` 和 `reactive()`，使我们可以直接创建响应式状态、计算属性和侦听器。
- [生命周期钩子](https://cn.vuejs.org/api/composition-api-lifecycle.html)：例如 `onMounted()` 和 `onUnmounted()`，使我们可以在组件各个生命周期阶段添加逻辑。
- [依赖注入](https://cn.vuejs.org/api/composition-api-dependency-injection.html)：例如 `provide()` 和 `inject()`，使我们可以在使用响应式 API 时，利用 Vue 的依赖注入系统。

**动机与实现**：现在与同一个逻辑关注点相关的代码被归为了一组，我们无需再为了一个逻辑关注点在不同的选项块间来回滚动切换。组合式 API 的效果用下面这张图片就可以清楚地表示出来：

![img](https://user-images.githubusercontent.com/499550/62783026-810e6180-ba89-11e9-8774-e7771c8095d6.png)

## [对比 React Hooks 和 Vue Composition API](https://cn.vuejs.org/guide/extras/composition-api-faq.html#comparison-with-react-hooks)（官方解释）

组合式 API 提供了和 React Hooks 相同级别的逻辑组织能力，但它们之间有着一些重要的区别。

React Hooks 在组件每次更新时都会重新调用。这就产生了一些即使是经验丰富的 React 开发者也会感到困惑的问题。这也带来了一些性能问题，并且相当影响开发体验。例如：

- **Hooks 有严格的调用顺序**，并不可以写在条件分支中。
- React 组件中定义的变量会被一个钩子函数闭包捕获，若开发者传递了错误的依赖数组，它会变得“过期”。这导致了 React 开发者非常依赖 ESLint 规则以确保传递了正确的依赖，然而，这些规则往往不够智能，保持正确的代价过高，在一些边缘情况时会遇到令人头疼的、不必要的报错信息。
- 昂贵的计算需要使用 `useMemo`，这也需要传入正确的依赖数组。
- 在默认情况下，**传递给子组件的事件处理函数会导致子组件进行不必要的更新**。子组件默认更新，并需要显式的调用 `useCallback` 作优化。这个优化同样需要正确的依赖数组，并且几乎在任何时候都需要。忽视这一点会导致默认情况下对应用进行过度渲染，并可能在不知不觉中导致性能问题。
- 要解决变量闭包导致的问题，再结合并发功能，使得很难推理出一段钩子代码是什么时候运行的，并且很不好处理需要在多次渲染间保持引用 (通过 `useRef`) 的可变状态。

相比起来，Vue 的组合式 API：

- **仅调用 `setup()` 或 `<script setup>` 的代码一次**。这使得代码更符合日常 JavaScript 的直觉，不需要担心闭包变量的问题。组合式 API 也并不限制调用顺序，还可以有条件地进行调用。
- Vue 的响应性系统运行时会自动收集计算属性和侦听器的依赖，因此**无需手动声明依赖**。
- **无需手动缓存回调函数来避免不必要的组件更新**。Vue 细粒度的响应性系统能够确保在绝大部分情况下组件仅执行必要的更新。对 Vue 开发者来说几乎不怎么需要对子组件更新进行手动优化。

我们承认 React Hooks 的创造性，它是组合式 API 的一个主要灵感来源。然而，它的设计也确实存在上面提到的问题，而 Vue 的响应性模型恰好提供了一种解决这些问题的方法。

## 总结

很多时候，我们不得不去考虑一些本来不该我们考虑、而应该是框架层面解决的问题。

仔细寻思一下，其实所有问题的根源，是 React 函数时组件机制所限：每次组件渲染，组件里的所有代码都会被重新调用一次。而 Vue 的组合式Api 和 React hooks 如此类似，但是它之所以没有这么多烦恼，主要是因为它的 setup 只会在整个组件的生命周期内执行一次。

在对比了 Vue 组合式 API 与 React Hooks 之后，我们发现它们并不是像看上去那样变得逐渐相似，恰恰相反，它们进一步把自己的特点推向了极致。

## 参考链接

[组合式 API 常见问答 | Vue.js (vuejs.org)](https://cn.vuejs.org/guide/extras/composition-api-faq.html)

[Vue Composition API 和 React Hooks 对比 - 掘金 (juejin.cn)](https://juejin.cn/post/6847902223918170126)

[GitHub - reactjs/react-basic：A description of the conceptual model of React without implementation burden.](https://github.com/reactjs/react-basic)
