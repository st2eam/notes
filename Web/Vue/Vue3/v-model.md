
## 基本用法

在前端处理表单时，我们常常需要将表单输入框的内容同步给 JavaScript 中相应的变量。手动连接值绑定和更改事件监听器可能会很麻烦：

```html
<input
  :value="text"
  @input="event => text = event.target.value">
```

v-model 指令帮我们简化了这一步骤：

```html
<input v-model="text">
```

它会根据所使用的元素自动使用对应的 DOM 属性和事件组合：

- 文本类型的 `<input>` 和 `<textarea>` 元素会绑定 `value` property 并侦听 `input` 事件；
- `<input type="checkbox">` 和 `<input type="radio">` 会绑定 `checked` property 并侦听 `change` 事件；
- `<select>` 会绑定 `value` property 并侦听 `change` 事件。

> v-model 会忽略任何表单元素上初始的 `value`、`checked` 或 `selected` attribute。它将始终将当前绑定的 JavaScript 状态视为数据的正确来源。

## 修饰符

### .lazy
添加 lazy 修饰符来改为在每次 change 事件后更新数据

```html
<!-- 在 "change" 事件后同步更新而不是 "input" -->
<input v-model.lazy="msg" />
```

### .number

如果你想让用户输入自动转换为数字，你可以在 v-model 后添加 .number 修饰符来管理输入：

```html
<input v-model.number="age" />
```

### .trim

如果你想要默认自动去除用户输入内容中两端的空格，你可以在 v-model 后添加 .trim 修饰符：

```html
<input v-model.trim="msg" />
```

## 组件中使用

v-model 可以在组件上使用以实现双向绑定。

从 Vue 3.4 开始，推荐的实现方式是使用 `defineModel()` 宏

```html
<!-- Child.vue -->
<script setup>
const model = defineModel()

function update() {
  model.value++
}
</script>

<template>
  <div>parent bound v-model is: {{ model }}</div>
</template>
```

父组件可以用 v-model 绑定一个值：

```html
<!-- Parent.vue -->
<Child v-model="count" />
```

`defineModel()` 返回的值是一个 ref。它可以像其他 ref 一样被访问以及修改，不过它能起到在父组件和当前变量之间的双向绑定的作用：

- 它的 `.value` 和父组件的 `v-model` 的值同步；
- 当它被子组件变更了，会触发父组件绑定的值一起更新。

配置项

```js
// 使 v-model 必填
const model = defineModel({ required: true })

// 提供一个默认值
const model = defineModel({ default: 0 })
```

### 多个 v-model 绑定

```html
<UserName
  v-model:first-name="first"
  v-model:last-name="last"
/>
```

```html
<script setup>
const firstName = defineModel('firstName')
const lastName = defineModel('lastName')
</script>

<template>
  <input type="text" v-model="firstName" />
  <input type="text" v-model="lastName" />
</template>
```

### 底层机制

`defineModel` 是一个便利宏。 编译器将其展开为以下内容：

- 一个名为 `modelValue` 的 `prop`，本地 `ref` 的值与其同步；
- 一个名为 `update:modelValue` 的事件，当本地 `ref` 的值发生变更时触发。

在 3.4 版本之前，你一般会按照如下的方式来实现上述相同的子组件：

```html
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="props.modelValue"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>
```

> 如你所见，这显得冗长得多。然而，这样写有助于理解其底层机制。

因为 `defineModel` 声明了一个 prop，你可以通过给 `defineModel` 传递选项，来声明底层 prop 的选项：

### v-model 的参数

组件上的 v-model 也可以接受一个参数：

```html
<MyComponent v-model:title="bookTitle" />
```

在子组件中，我们可以通过将字符串作为第一个参数传递给 defineModel() 来支持相应的参数：

```html
<!-- MyComponent.vue -->
<script setup>
const title = defineModel('title')
</script>

<template>
  <input type="text" v-model="title" />
</template>
```

如果需要额外的 prop 选项，应该在 model 名称之后传递：

```js
const title = defineModel('title', { required: true })
```

### 处理 v-model 修饰符

通过像这样解构 `defineModel()` 的返回值，可以在子组件中访问添加到组件 v-model 的修饰符：

```html
<script setup>
const [model, modifiers] = defineModel()

console.log(modifiers) // { capitalize: true }
</script>

<template>
  <input type="text" v-model="model" />
</template>
```

为了能够基于修饰符选择性地调节值的读取和写入方式，我们可以给 defineModel() 传入 get 和 set 这两个选项。

这两个选项在从模型引用中读取或设置值时会接收到当前的值，并且它们都应该返回一个经过处理的新值。

```html
<script setup>
const [model, modifiers] = defineModel({
  set(value) {
    if (modifiers.capitalize) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
    return value
  }
})
</script>

<template>
  <input type="text" v-model="model" />
</template>
```
