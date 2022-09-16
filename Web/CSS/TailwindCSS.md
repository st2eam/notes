# 核心概念

## 功能类优先

在一组受约束的原始功能类的基础上构建复杂的组件。

### 可维护性问题

在使用功能优先的方式时，最大的可维护性问题是管理通用的可重复使用的功能类组合。

- 通过提取组件（通常做为模板片断或者组件），可以轻松解决此问题。

```html
<!-- PrimaryButton.vue -->
<template>
  <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    <slot/>
  </button>
</template>
```

- 也可以使用 Tailwind 的 @apply 功能创建抽象的 CSS 类。

```html
<!-- Using utilities -->
<button class="py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-green-500 hover:bg-green-700">
  Click me
</button>

<!-- Extracting classes using @apply -->
<button class="btn btn-green">
  Button
</button>

<style>
  .btn {
    @apply py-2 px-4 font-semibold rounded-lg shadow-md;
  }
  .btn-green {
    @apply text-white bg-green-500 hover:bg-green-700;
  }
</style>
```

## 响应式设计

使用响应式功能变体构建自适应的用户界面。

Tailwind 中的每个功能类都可以有条件的应用于不同的断点，这使得您可以轻松的构建复杂的响应式界面而不用离开 HTML。

根据常用的设备分辨率方案，默认内置了 5 个断点：

|断点前缀| 最小宽度 |CSS|
|---|---|---|
|sm| 640px |@media (min-width: 640px) { ... }|
|md| 768px| @media (min-width: 768px) { ... }|
|lg| 1024px |@media (min-width: 1024px) { ... }|
|xl| 1280px |@media (min-width: 1280px) { ... }|
|2xl| 1536px |@media (min-width: 1536px) { ... }|

要添加一个仅在特定断点生效的功能类，只需要在该功能类前加上断点名称，后面跟 : 字符。

```HTML
<!-- Width of 16 by default, 32 on medium screens, and 48 on large screens -->
<img class="w-16 md:w-32 lg:w-48" src="...">
```

### 自定义断点

您可以在 tailwind.config.js 文件中完全自定义您的断点：

```js
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'tablet': '640px',
      // => @media (min-width: 640px) { ... }

      'laptop': '1024px',
      // => @media (min-width: 1024px) { ... }

      'desktop': '1280px',
      // => @media (min-width: 1280px) { ... }
    },
  }
}
```

## 悬停、焦点和其它状态

使用功能类为处于悬停、焦点和其它状态的元素设置样式。

与处理响应式设计类似，通过为功能类添加适当的状态变体前缀，可以对处于 hover 、focus 和其它状态的元素设置样式。

### Group-hover

如果您需要当鼠标悬停在一个指定的父元素上时对其子元素设置样式，给父元素添加 group 类，并且为子元素的功能类添加 `group-hover:` 前缀。

```HTML
<div class="group border-indigo-500 hover:bg-white hover:shadow-lg hover:border-transparent ...">
  <p class="text-indigo-600 group-hover:text-gray-900 ...">New Project</p>
  <p class="text-indigo-500 group-hover:text-gray-500 ...">Create a new project from a variety of starting templates.</p>
</div>
```

### Group-focus

group-focus 变体的工作方式与 group-hover 一样。

> 但是默认情况下，所有核心插件都没有启用该 group-focus 变体。

您可以在 tailwind.config.js 文件中的 variants 部分控制是否为某个插件启用 group-focus 变体：

```js
// tailwind.config.js
module.exports = {
  // ...
  variants: {
    extend: {
      backgroundColor: ['group-focus'],
    }
  },
}
```

### Focus-within

添加focus-within:前缀，以便只在该元素或其任何后代有焦点时应用一个效果。

### Focus-visible

添加` focus-visible: `前缀，以便当一个元素具有焦点且仅在用户使用键盘时才应用功能类。

### Motion-safe

添加 `motion-safe:` 前缀以便仅在 prefers-reduced-motion 匹配 no-preference 时应用功能类。

例如：如果用户未在系统中开启 “Reduce motion”，则此按钮仅在鼠标悬停时发生动画效果。

> 默认情况下，所有核心插件都没有启用该 motion-safe 变体。

### Motion-reduce

添加 `motion-reduce:` 前缀以便仅在 prefers-reduced-motion 匹配 reduce 时应用功能类。

例如，默认情况下，此按钮将在鼠标悬停时产生动画，但是如果用户在系统中开启了 “Reduce motion”，则动画将被禁用。

### Disabled

添加 `disabled:` 前缀，以便当一个元素被禁用时才应用功能类。

> 默认情况下，所有核心插件都没有启用该 disabled 变体。

### Visited

添加 `visited:` 前缀，以便当一个链接被访问后才应用功能类。

> 默认情况下，所有核心插件都没有启用该 visited 变体。

### Checked

添加 `checked:` 前缀，以便当一个单选或复选框被选中时才应用功能类。

> 默认情况下，所有核心插件都没有启用该 checked 变体。

### First-child

```HTML
<div class="...">
  <div v-for="item in items" class="transform first:rotate-45 ...">
    {{ item }}
  </div>
</div>
```

需要特别注意的是，您应该将 `first:` 功能类添加到子元素上，而不是父元素。

> 默认情况下，所有核心插件都没有启用该 first-child 变体。

### Last-child

与 `first:` 类似，通过为功能类添加 `last:` 的前缀，可以对处于相应状态的元素设置样式。

### Odd-child

添加 `odd:` 前缀使得仅在元素是父级奇数子元素的时候才应用功能类。

> 默认情况下，所有核心插件都没有启用该 odd-child 变体。

### Even-child

添加 even: 前缀使得仅在元素是父级偶数子元素的时候才应用功能类。

> 默认情况下，所有核心插件都没有启用该 even-child 变体。

### 与响应式前缀结合使用

状态变体也是响应式的，意味着您可以执行诸如在不同断点处更改元素的悬停样式的操作。

要在指定断点应用一个状态变体，请在状态前缀之前添加响应式前缀：

```html
<button class="... hover:bg-green-500 sm:hover:bg-blue-500">
  <!-- ... -->
</button>
```

### 为自定义功能类生成变体

您可以通过使用 @variants 指令包裹住您自己的自定义 CSS 类来为他们生成状态变体：

```CSS
/* Input: */
@variants group-hover, hover, focus {
  .banana {
    color: yellow;
  }
}

/* Output: */
.banana {
  color: yellow;
}
.group:hover .group-hover\:banana {
  color: yellow;
}
.hover\:banana:hover {
  color: yellow;
}
.focus\:banana:focus {
  color: yellow;
}
```

查看 [@variants 指令文档](https://www.tailwindcss.cn/docs/functions-and-directives#variants) 了解更多信息。

### 创建自定义变体

您可以通过编写自定义变体插件为 Tailwind 默认不支持的任何状态创建自己的变体。

例如，这个简单的插件增加了对 required 伪类变体的支持：

```js
// tailwind.config.js
const plugin = require('tailwindcss/plugin')

module.exports = {
  plugins: [
    plugin(function({ addVariant, e }) {
      addVariant('required', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`required${separator}${className}`)}:required`
        })
      })
    })
  ]
}
```

点击 [变体插件文档](https://www.tailwindcss.cn/docs/plugins#adding-variants) 了解更多关于编写变体插件的信息。

## 深色模式

使用 Tailwind CSS 在深色模式下为您的网站设置样式。

为了使此操作尽可能简单，Tailwind 包含一个 dark 变体，当启用深色模式时，您可以为您的网站设置不同的样式：

```html
<div class="bg-white dark:bg-gray-800">
  <h1 class="text-gray-900 dark:text-white">Dark mode is here!</h1>
  <p class="text-gray-600 dark:text-gray-300">
    Lorem ipsum...
  </p>
</div>
```

请务必注意，出于文件大小的考虑，默认情况下，Tailwind 未开启深色模式变体。

要启用深色模式，请在 tailwind.config.js 文件中把 darkMode 选项设置为 media：

```js
// tailwind.config.js
module.exports = {
  darkMode: 'media',
  // ...
}
```

现在，只要用户的操作系统开启了深色模式，`dark:{class}`类将优先于无前缀的类。media 策略在底层使用 prefers-color-scheme 媒体功能，但是，如果您想支持手动切换深色模式，您也可以 使用 ‘class’ 策略 进行更多控制。

默认情况下，当 darkMode 启用时，只会为颜色相关的类生成 dark 变体，包括文本颜色、背景颜色、边框颜色、渐变色以及占位符颜色。

### 与其它变体结合使用

dark 变体可以与 响应式 变体和 状态 变体结合使用：

```html
<button class="lg:dark:hover:bg-white ...">
  <!-- ... -->
</button>
```

为了使其正常工作，您必须把响应式变体要在最前面，然后是 dark 变体，最后是状态变体。

### 手动切换深色模式

如果要支持手动切换深色模式而不是依赖于操作系统首选项，请使用 class 策略代替 media 策略：

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  // ...
}
```

现在，`dark:{class}` 类将不再根据 `prefers-color-scheme` 起作用，而是当在 HTML 树中出现 dark 类时起作用。

如何将 dark 类添加到 html 元素中取决于您，但是一种常见的方式是使用 JS 从某个地方（如 localStorage）读取首选项并相应的更新 DOM。

同样，你可以以你喜欢的方式来管理它，甚至将偏好存储在服务器端的数据库中，并在服务器上渲染该类--这完全取决于你。

### 特异性考虑

当使用 `class` 策略时，由于选择器包含一个额外的类，黑暗模式实用程序的特异性将高于常规实用程序。这意味着，在某些情况下，某些实用程序的组合在 `class` 模式下的行为可能与在 `media` 模式下的行为略有不同。 例如，考虑这个HTML。

```html
<div class="text-black text-opacity-50 dark:text-white">
  <!-- ... -->
</div>
```

在使用 `media` 策略时，`dark:text-white`与`text-black`和`text-opacity-50`具有相同的特性。因为`text-opacity-50`在生成的CSS中定义得比`dark:text-white`晚，所以白色文本将有50%的不透明度。

当使用 `class` 策略时，`dark:text-white`有更高的特异性，所以尽管它定义得更早，它实际上会覆盖`text-opacity-50`，并将不透明度重置为1。

因此，当使用 `class` 策略时，你需要在黑暗模式下重新指定不透明度。

```html
<div class="text-black text-opacity-50 dark:text-white dark:text-opacity-50">
  <!-- ... -->
</div>
```

## 函数与指令

Tailwind 向您的 CSS 的暴露的函数和指令的参考说明。

### @tailwind

使用 @tailwind 指令向您的 CSS 添加 Tailwind 的 base, components, utilities 和 screens 样式。

```CSS
/**
 * This injects Tailwind's base styles and any base styles registered by
 * plugins.
 */
@tailwind base;

/**
 * This injects Tailwind's component classes and any component classes
 * registered by plugins.
 */
@tailwind components;

/**
 * This injects Tailwind's utility classes and any utility classes registered
 * by plugins.
 */
@tailwind utilities;

/**
 * Use this directive to control where Tailwind injects the responsive
 * variations of each utility.
 *
 * If omitted, Tailwind will append these classes to the very end of
 * your stylesheet by default.
 */
@tailwind screens;
```

### @apply

使用 @apply 将任何现存的功能类内联到您的自定义 CSS 中。

当您在您的 HTML 里找到您想要提取到一个新组件的通用的功能模式时，这非常有用。

```css
.btn {
  @apply font-bold py-2 px-4 rounded;
}
.btn-blue {
  @apply bg-blue-500 hover:bg-blue-700 text-white;
}
```

注意，类是根据其在原始 CSS 中的位置而不是根据在 @apply 指令之后列出它们的顺序来应用的。这是为了确保使用 @apply 提取类列表时得到的行为与直接在 HTML 中列出的类的行为相匹配。您还可以将 @apply 声明与常规 CSS 声明混合使用。

```css
/* Input */
.btn {
  @apply py-2;
  @apply p-4;
  transform: translateY(-1px);
}

/* Output */
.btn {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding: 1rem;
  transform: translateY(-1px);
}
```

### @layer

使用 @layer 指令告诉 Tailwind 一组自定义样式应该属于哪个 “bucket”。可用的层有 base, components 和 utilities。

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  h1 {
    @apply text-2xl;
  }
  h2 {
    @apply text-xl;
  }
}

@layer components {
  .btn-blue {
    @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
  }
}

@layer utilities {
  @variants hover, focus {
    .filter-none {
      filter: none;
    }
    .filter-grayscale {
      filter: grayscale(100%);
    }
  }
}
```

Tailwind会自动将 @layer 指令中的所有 CSS 移至与相应 @tailwind 规则相同的位置，因此您不必担心以特定顺序编写 CSS 来避免特定性问题。

在 @layer 指令中包装的任何自定义 CSS 也会告诉 Tailwind 在清除该层时考虑那些样式。阅读 关于生产优化的文档 来了解更多详情。

### @variants

您可以通过在 @variants 指令中声明自己的功能类来生成他们的 responsive, hover, focus, active 及其它 变体。

```css
@variants focus, hover {
  .rotate-0 {
    transform: rotate(0deg);
  }
  .rotate-90 {
    transform: rotate(90deg);
  }
}
```

这将生成以下 CSS：

```css
.rotate-0 {
  transform: rotate(0deg);
}
.rotate-90 {
  transform: rotate(90deg);
}

.focus\:rotate-0:focus {
  transform: rotate(0deg);
}
.focus\:rotate-90:focus {
  transform: rotate(90deg);
}

.hover\:rotate-0:hover {
  transform: rotate(0deg);
}
.hover\:rotate-90:hover {
  transform: rotate(90deg);
}
```

注意，变体是按照您指定的顺序生成的。

该 `@variants` 规则支持您配置文件中 variants 部分支持的所有值，以及通过插件添加的 自定义变体。

### @responsive

您可以通过在 @responsive 指令中声明他们的定义来生成您自己的类的响应式变体。

```css
@responsive {
  .bg-gradient-brand {
    background-image: linear-gradient(blue, green);
  }
}
```

这是`@variants responsive { ... }` 的简写方式，同样起作用。

使用默认断点，这将生成以下类：

```css
.bg-gradient-brand {
  background-image: linear-gradient(blue, green);
}

/* ... */

@media (min-width: 640px) {
  .sm\:bg-gradient-brand {
    background-image: linear-gradient(blue, green);
  }
  /* ... */
}

@media  (min-width: 768px) {
  .md\:bg-gradient-brand {
    background-image: linear-gradient(blue, green);
  }
  /* ... */
}

@media (min-width: 1024px) {
  .lg\:bg-gradient-brand {
    background-image: linear-gradient(blue, green);
  }
  /* ... */
}

@media (min-width: 1280px) {
  .xl\:bg-gradient-brand {
    background-image: linear-gradient(blue, green);
  }
  /* ... */
}
```

响应式变体将在您的样式表的结尾被添加到 Tailwind 的已经存在的媒体查询中。这将确保那些带有响应式前缀的类优先级会高于同样 CSS 属性的非响应式的类。

### @screen

@screen 指令允许您创建通过名称引用断点的媒体查询，而不是在您的 CSS 中复制他们的值。

例如，假设有一个名为 sm 的 640px 的断点，您只需要写一些自定义的指向这个断点的 CSS。

而不是编写一个复制那些值的原始的媒体查询，如下所示：

```css
@media (min-width: 640px) {
  /* ... */
}
```

…您可以使用 @screen 指令，然后根据名称引用这个断点：

```css
@screen sm {
  /* ... */
}
```

### screen()

screen函数接受一个像`md`这样的屏幕名称，并生成相应的媒体特征表达。

```css
/* Input */
@media screen(sm) {
  /* ... */
}

/* Output */
@media (min-width: 640px) {
  /* ... */
}
```

当你将Tailwind与其他处理@screen指令较差的CSS工具一起使用时，这可能很有用。例如，postcss-nesting不理解@screen，但理解@media，所以在screen()函数旁边使用@media的行为更正确。

### theme()

使用 theme() 函数可以通过点符号来获取 Tailwind 配置的值。

当您想要引用一个您主题配置中的一部分声明的值时，这是一个 @apply 的有用的替代方式。

```css
.content-area {
  height: calc(100vh - theme('spacing.12'));
}
```

如果您想获取一个含有点的值（像间距比例中的 2.5），则可以使用方括号。

```css
.content-area {
  height: calc(100vh - theme('spacing[2.5]'));
}
```

因为 Tailwind 使用 嵌套对象语法 来定义其默认调色板，因此请确保使用点符号来访问嵌套的颜色。

```css
.btn-blue {
  background-color: theme('colors.blue.500');
}
```
