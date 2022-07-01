## Less

[https://less.bootcss.com/](https://less.bootcss.com/)

Less 是一种 CSS 的预处理语言，它在 CSS 的基础上增加了一些编程语言的特性，可以提升我们编写 CSS 的效率，减少很多重复性的代码，最终编译成纯净的 CSS 代码执行。Less 是 CSS 的超集，就像我们使用的 TS 和 JS 的关系，我们也可以把 Less 完全当作 CSS 来使用。

同样流行的 CSS 预处理器还有 SCSS、Stylus，大家的基本功能都比较类似，Less 因为简单易用，可以满足绝大多数的使用场景，所以我们先来学习一下它。

### 安装

我们可以通过 `npm` 来将 `less` 编译器安装为一个命令

```bash
npm i less -g
```

然后我们可以通过 `lessc` 命令来编译 `less` 文件了

```bash
lessc test.less
```

上面的命令会直接打印编译之后的结果，如果要输出到文件，可以加上输出文件名

```bash
lessc test.less test.css
```

### 变量（Variables）

```less
@witth: 10px;
@height: @witth + 10px;
@color: #f00;

.header {
  width: @witth;
  height: @height;
  height: @color;
}
```

> 现在 CSS 支持原生变量了，而且是动态的，有些时候使用原生变量会是一种更好的选择，如果需要考虑兼容性，可以使用 Less 的变量

### 混合（Mixins）

`Mixin` 是一种将一组属性从一个规则集混入到另一个规则集的方法。假设我们定义了一个类如下

```less
.bordered {
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}
```

如果我们想要在其他类中混入这些属性，只需要像函数一样调用他们即可：

```less
.menu a {
  color: #111;
  .bordered();
}

.post a {
  color: red;
  .bordered();
}
```

`.bordered` 所包含的属性就同时出现在 `.menu a` 和 `.post a` 中了

### 嵌套（Nesting）

Less 提供了嵌套代替层叠或者与层叠结合使用的能力，假如我们有下面的 CSS 代码

```less
#header {
  color: black;
}
#header .navigation {
  font-size: 12px;
}
#header .logo {
  width: 300px;
}
```

如果使用 Less，我们可以这样来写

```less
#header {
  color: black;
  .navigation {
    font-size: 12px;
  }
  .logo {
    width: 300px;
  }
}
```

还可以和伪类或者子元素选择器，如

```less
#header {
  color: black;

  &:hover {
    color: red;
  }

  & > span {
    font-weight: bold;
  }
}
```

> 过深的嵌套只会让代码难以维护，建议嵌套不要超过三层，如果出现要嵌套超过三层的情况，应该考虑如何优化选择器的设计。

### 导入（Importing）

导入可以让我们将另外一个 Less 文件导入进来，例如我们可以把变量样式都定义在一个单独的 Less 模块中，其他文件都来引用它，通常我们用这种方式来控制主题样式，当我们需要修改主题的时候，只需要修改变量文件中的值，然后重新编译即可。

`vars.less`

```less
@primaryColor: #f00;
@textColor: #666;
```

`theme.less`

```less
@import "vars";

#header {
  background-color: @primaryColor;
  color: @textColor;
}
```

### Vue 结合 less

使用 vue cli 创建的项目无需额外配置，只需下载合适版本的 less 以及 less-loader 即可使用 less。

```bash
npm i -D less less-loader@6
```

```less
<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.a {
  .b {
    color: red;
  }
}
</style>
```

## CSS Modules

借助于 webpack，我们可以把 CSS 也当成模块来拆分引用了，但是模块化的一个核心是作用域隔离，CSS 并没有真正的模块化机制，这意味着我们写在不同文件中的 CSS 代码中的类会对整个 HTML 页面起作用，随着我们应用中组件的增多，很容易会出现类名冲突引发样式混乱。通常我们解决这种问题需要靠命名的约定，每个模块用自己的前缀然后加上嵌套等方式，如：

```less
.button {
}
.button-default {
}
```

```less
.modal {
}
.modal-header {
}
```

但是这样也不安全，需要大家都自觉遵守。

现在 `css-loader` 提供了一种叫做 `CSS Modules` 的方案，可以帮我们自动生成唯一的类名，不会和其他模块的命名出现冲突

要使用 CSS Modules 一般有几个步骤，需要在 webpack 中进行简单的配置，但在使用 vue cli 生成的项目，默认支持 Css Modules，无需进行其他的配置。

```vue
<template>
  <div :class="$style.hello">hello world!</div>
</template>
<style module>
.hello {
  color: red;
}
</style>
```

CSS Modules 会转换所有的类名和 ID 名，如果有些名字我们不想让它转换，可以使用 `:global()`，如：

```less
:global(#app) {
  background-color: #f4f4f4;
}
```
