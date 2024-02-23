## 透传 attribute 是什么

“透传 attribute”指的是传递给一个组件，却没有被该组件声明为 props 或 emits 的 `attribute` 或者 `v-on` 事件监听器。最常见的例子就是 `class`、`style` 和 `id`。

一个父组件使用了这个组件，并且传入了 `class`：

```vue
<OneComponent class="cpn" />
```

最后渲染出的 DOM 结果是：

```vue
<div class="cpn">One Component</div>
```

这里，`<OneComponent>` 并没有将 `class` 声明为一个它所接受的 `prop`，所以 `class` 被视作透传 `attribute`，自动透传到了 `<OneComponent>` 的根元素上。

如果一个子组件的根元素已经有了 `class` 或 `style` attribute，它会和从父组件上继承的值合并。

```vue
<!-- <OneComponent> 的模板 -->
<div class="btn">One Component</div>
```

则最后渲染出的 DOM 结果会变成：

```vue
<div class="btn cpn">One Component</div>
```

## v-on 监听器继承

同样的规则也适用于 `v-on` 事件监听器：

```vue
<OneBtn @click="onClick" />
```

同样的，如果原生 button 元素自身也通过 `v-on` 绑定了一个事件监听器，则这个监听器和从父组件继承的监听器都会被触发。

## 深层组件继承

如果把`<OneBtn/>`改写成再调用一层`<BaseBtn/>`：

```vue
<script lang='ts' setup>
import BaseBtn from './BaseBtn.vue';
const onClick = () => {
    console.log("one btn")
}
</script>
<template>
    <BaseBtn @click="onClick">
        <slot></slot>
    </BaseBtn>
</template>
```

此时 `<OneBtn>` 接收的透传 attribute 会直接继续传给 `<BaseBtn>`。

调用顺序为：

```js
base btn    BaseBtn.vue:8 
one btn     OneBtn.vue:4 
About       About.vue:3 
```

- 透传的 attribute 不会包含 `<OneBtn>` 上声明过的 props 或是针对 emits 声明事件的 v-on 侦听函数，换句话说，声明过的 props 和侦听函数被 `<OneBtn>`“消费”了。

- 透传的 attribute 若符合声明，也可以作为 props 传入 `<BaseBtn>`。

## 禁用 Attributes 继承

如果你不想要一个组件自动地继承 attribute，你可以在组件选项中设置 `inheritAttrs: false`。

通过设置 `inheritAttrs` 选项为 `false`，你可以完全控制透传进来的 attribute 被如何使用。

这些透传进来的 attribute 可以在模板的表达式中直接用 `$attrs` 访问到。

```vue
<span>Fallthrough attribute: {{ $attrs }}</span>
```

这个 `$attrs` 对象包含了除组件所声明的 `props` 和 `emits` 之外的所有其他 attribute，例如 `class`，`style`，`v-on` 监听器等等。

> 需要注意：
>
>- 和 props 有所不同，透传 attributes 在 JavaScript 中保留了它们原始的大小写，所以像 foo-bar 这样的一个 attribute 需要通过 `$attrs['foo-bar']` 来访问。
>
>- 像 `@click` 这样的一个 `v-on` 事件监听器将在此对象下被暴露为一个函数 `$attrs.onClick`。

### `$attrs` 设置在子节点

有时候我们可能为了样式，需要在 `<button>` 元素外包装一层 `<div>`，但是又想要所有像 `class` 和 `v-on` 监听器这样的透传 attribute 都应用在内部的 `<button>` 上而不是外层的 `<div>` 上。我们可以通过设定 `inheritAttrs: false` 和使用 `v-bind="$attrs"` 来实现：

```vue
<div class="btn-wrapper">
  <button class="btn" v-bind="$attrs">click me</button>
</div>
```

## 多根节点的 Attributes 继承

和单根节点组件有所不同，有着多个根节点的组件没有自动 `attribute` 透传行为。如果 `$attrs` 没有被显式绑定，将会抛出一个运行时警告。

```html
<header>...</header>
<main>...</main>
<footer>...</footer>
```

如果 $attrs 被显式绑定，则不会有警告：

```html
<header>...</header>
<main v-bind="$attrs">...</main>
<footer>...</footer>
```

## 在 JavaScript 中访问透传 Attributes

如果需要，你可以在 `<script setup>` 中使用 `useAttrs()` API 来访问一个组件的所有透传 attribute：

```vue
<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>
```

如果没有使用 `<script setup>`，attrs 会作为 `setup()` 上下文对象的一个属性暴露：

```vue
export default {
  setup(props, ctx) {
    // 透传 attribute 被暴露为 ctx.attrs
    console.log(ctx.attrs)
  }
}
```

需要注意的是，虽然这里的 `attrs` 对象总是反映为最新的透传 attribute，但它并不是响应式的

你不能通过侦听器去监听它的变化。如果你需要响应性，可以使用 `prop`。

或者你也可以使用 `onUpdated()` 使得在每次更新时结合最新的 `attrs` 执行副作用。