# Vue 基础

## 介绍

Vue (读音 /vjuː/，类似于 view) 是一套用于构建用户界面的渐进式框架。与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。Vue 的核心库只关注视图层，不仅易于上手，还便于与第三方库或既有项目整合。另一方面，当与现代化的工具链以及各种支持类库结合使用时，Vue 也完全能够为复杂的单页应用提供驱动。

## [风格指南](https://cn.vuejs.org/v2/style-guide/)

## 组件化思想

组件系统是现代 Web 开发中的一个重要概念，它允许我们使用小型、独立通常可复用的组件构建大型应用，几乎任意类型的应用界面都可以抽象为一个组件树。我们可以简单认为组件是 Web 页面中的一个独立的功能单元，它可以有自己的状态、DOM 结构、逻辑交互，组件最大的价值是可复用性，我们只需要将独立的功能代码封装成组件，需要使用的时候传递给它对应的数据就可以了，不需要再额外编写重复的功能代码。

## Vue 应用 & 组件实例

每个 Vue 应用都是通过用 Vue 函数创建一个新的 Vue 实例开始的：
```js
var vm = new Vue({
  // 选项
})
```
虽然没有完全遵循 [MVVM](https://zh.wikipedia.org/wiki/MVVM) 模型，但是 Vue 的设计也受到了它的启发。因此在文档中经常会使用 

vm (ViewModel 的缩写) 这个变量名表示 Vue 实例。
当创建一个 Vue 实例时，你可以传入一个选项对象。这篇教程主要描述的就是如何使用这些选项来创建你想要的行为。作为参考，你也可以在 API 文档中浏览完整的选项列表。

**所有的 Vue 组件都是 Vue 实例。**

## [实例生命周期钩子](https://cn.vuejs.org/v2/guide/instance.html#%E5%AE%9E%E4%BE%8B%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E9%92%A9%E5%AD%90)

每个 Vue 实例在被创建时都要经过一系列的初始化过程——例如，需要设置数据监听、编译模板、将实例挂载到 DOM 并在数据变化时更新 DOM 等。同时在这个过程中也会运行一些叫做生命周期钩子的函数，这给了用户在不同阶段添加自己的代码的机会。

比如 `created` 钩子可以用来在一个实例被创建之后执行代码：

```js
new Vue({
  data: {
    a: 1
  },
  created: function () {
    // `this` 指向 vm 实例
    console.log('a is: ' + this.a)
  }
})
// => "a is: 1"
```

也有一些其它的钩子，在实例生命周期的不同阶段被调用，如 `mounted`、`updated` 和 `destroyed`。生命周期钩子的 this 上下文指向调用它的 Vue 实例。

不要在选项 property 或回调上使用箭头函数，比如 `created: () => console.log(this.a)` 或 
`vm.$watch('a', newValue => this.myMethod())`。

**因为箭头函数并没有 this**，this 会作为变量一直向上级词法作用域查找，直至找到为止，经常导致 Uncaught TypeError: Cannot read property of undefined 或 Uncaught TypeError: this.myMethod is not a function 之类的错误。

## 生命周期图示

![https://v2.cn.vuejs.org/images/lifecycle.png](https://v2.cn.vuejs.org/images/lifecycle.png)