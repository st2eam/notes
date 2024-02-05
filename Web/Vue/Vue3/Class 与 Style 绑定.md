# Class 与 Style 绑定
Vue 专门为 class 和 style 的 v-bind 用法提供了特殊的功能增强。除了字符串外，表达式的值也可以是对象或数组。

## 绑定对象
```js
const isActive = ref(true)
const hasError = ref(false)

<div
  class="static"
  :class="{ active: isActive, 'text-danger': hasError }"
></div>

// <div class="static active"></div>
```

绑定的对象并不一定需要写成内联字面量的形式，也可以直接绑定一个对象：
```js
const classObject = reactive({
  active: true,
  'text-danger': false
})

<div :class="classObject"></div>
```

同样也可以绑定一个返回对象的计算属性。

```js
const isActive = ref(true)
const error = ref(null)

const classObject = computed(() => ({
  active: isActive.value && !error.value,
  'text-danger': error.value && error.value.type === 'fatal'
}))

<div :class="classObject"></div>
```

### 绑定数组

我们可以给 `:class` 绑定一个数组来渲染多个 CSS class：

```html
const activeClass = ref('active')
const errorClass = ref('text-danger')

<div :class="[activeClass, errorClass]"></div>
<div :class="[{ active: isActive }, errorClass]"></div>
```

### 在组件上使用

如果你的组件有多个根元素，你将需要指定哪个根元素来接收这个 class。你可以通过组件的 $attrs 属性来实现指定：

```html
<!-- MyComponent 模板使用 $attrs 时 -->
<p :class="$attrs.class">Hi!</p>
<span>This is a child component</span>
```

## 绑定内联样式

### 绑定对象

`:style` 支持绑定 JavaScript 对象值，尽管推荐使用 camelCase，但 `:style` 也支持 kebab-cased 形式的 CSS 属性 key (对应其 CSS 中的实际名称)

```html
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```

### 绑定数组

我们还可以给 `:style` 绑定一个包含多个样式对象的数组。这些对象会被合并后渲染到同一元素上：

```html
<div :style="[baseStyles, overridingStyles]"></div>
```

### 自动前缀

当你在 `:style` 中使用了需要浏览器特殊前缀的 CSS 属性时，Vue 会自动为他们加上相应的前缀。Vue 是在运行时检查该属性是否支持在当前浏览器中使用。如果浏览器不支持某个属性，那么将尝试加上各个浏览器特殊前缀，以找到哪一个是被支持的。