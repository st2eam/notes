---
originalPath: Web/React/Hooks/Hook.md
primaryCategory: 计算机/前端/React
categories:
  - path: 计算机/前端/React
    reason: >-
      核心学习对象为“Hook”，正文依据：“Hook 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state
      以及其他的 React 特性。 Hook 是一些可以让你在函数组件里“钩入” React state 及生命周期等特性的函数。Hook 不能在
      class 组件中使用 —— 这使得你不使用 class 也能使用 React”；据其实体与学习对象归入计算机/前端/React。
classificationStatus: confirmed
relations:
  - target: 计算机/前端/React/react-router/V6/Hooks.md
    type: similar
    label: 正文概念对照
    reason: >-
      原笔记明确讨论“Hooks”：Hooks解决方式：函数组件和普通JS函数非常相似，在普通JS函数中定义的变量、方法都可以不使用“.”，而直接使用该变量或函数，因此你不再需要去关心“”了。；目标笔记专门说明该概念，具体接口与适用条件仍需区分。
    evidence: >-
      源笔记正文：Hooks解决方式：函数组件和普通JS函数非常相似，在普通JS函数中定义的变量、方法都可以不使用“.”，而直接使用该变量或函数，因此你不再需要去关心“”了。；目标笔记：useHref钩子返回一个URL，该URL可用于链接到给定的目标位置，甚至在React路由器之外。
      如果组件在的上下文中被渲染，那么use In Router Context钩子返回true，否则返回false。
    status: inferred
tags:
  - 实体/React
---
## Hook简介

Hook 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。

Hook 是一些可以让你在函数组件里“钩入” React state 及生命周期等特性的函数。Hook 不能在 class 组件中使用 —— 这使得你不使用 class 也能使用 React

## Hook 是

- 完全可选的。 你无需重写任何已有代码就可以在一些组件中尝试 Hook。但是如果你不想，你不必现在就去学习或使用 Hook。
- 100% 向后兼容的。 Hook 不包含任何破坏性改动。

没有计划从 React 中移除 class。

你可以在本页底部的章节读到更多关于 Hook 的渐进策略。

Hook 不会影响你对 React 概念的理解。 恰恰相反，Hook 为已知的 React 概念提供了更直接的 API：props， state，context，refs 以及生命周期。稍后我们将看到，Hook 还提供了一种更强大的方式来组合他们。

## 为什么要用Hooks？

### 先说一下类组件的一些缺点

- 缺点一：复杂且不容易理解的“this”
- 缺点二：组件数据状态逻辑不能重用、组件之间传值过程复杂
- 缺点三：复杂场景下代码难以组织在一起

### Hooks是如何解决上述类组件的缺点？

#### 类组件缺点一：复杂且不容易理解的“`this`”

Hooks解决方式：函数组件和普通JS函数非常相似，在普通JS函数中定义的变量、方法都可以不使用“`this`.”，而直接使用该变量或函数，因此你不再需要去关心“`this`”了。  

#### 类组件缺点二：组件数据状态逻辑不能重用

Hooks解决方式：  
通过**自定义Hook**，可以数据状态逻辑从组件中抽离出去，这样同一个Hook可以被多个组件使用，解决组件数据状态逻辑并不能重用的问题。  

#### 类组件缺点三：组件之间传值过程复杂、缺点三：复杂场景下代码难以组织在一起

Hooks解决方式：  
通过React内置的`useState()`函数，可以将不同数据分别从"`this.state`"中独立拆分出去。降低数据复杂度和可维护性，同时解决类组件缺点三中“内部state数据只能是整体，无法被拆分更细”的问题。

通过React内置的`useEffect()`函数，将`componentDidMount`、`componentDidUpdate`、`componentWillUncount` 3个生命周期函数通过Hook(钩子)关联成1个处理函数，解决事件订阅分散在多个生命周期函数的问题。

**最为关键的是，hook还能实现一些类组件根本不能实现的功能，比如全局共享数据，代替Redux。**

## Hook 规则

Hook 本质就是 JavaScript 函数，但是在使用它时需要遵循两条规则。我们提供了一个 [linter](https://www.npmjs.com/package/eslint-plugin-react-hooks) 插件来强制执行这些规则：

### 只在最顶层使用 Hook

不要在循环，条件或嵌套函数中调用 Hook， 确保总是在你的 React 函数的最顶层调用他们。
遵守这条规则，你就能确保 Hook 在每一次渲染中都按照同样的顺序被调用。这让 React 能够在多次的 `useState` 和 `useEffect` 调用之间保持 hook 状态的正确。(如果你对此感到好奇，我们在下面会有更深入的解释。)

### 只在 React 函数中调用 Hook

不要在普通的 JavaScript 函数中调用 Hook。你可以：

- ✅ 在 React 的函数组件中调用 Hook
- ✅ 在自定义 Hook 中调用其他 Hook

遵循此规则，确保组件的状态逻辑在代码中清晰可见。

## 渐进策略

**总结：没有计划从 React 中移除 class。**

最重要的是，Hook 和现有代码可以同时工作，你可以渐进式地使用他们。
