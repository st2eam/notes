# 入口起点(entry points)

## 单个入口语法

用法：`entry: string | [string]`

webpack.config.js

```js
module.exports = {
  entry: {
    main: './path/to/my/entry/file.js',
  },
};
```

entry 属性的单个入口语法，可以简写成以下形式：

```js
module.exports = {
  entry: './path/to/my/entry/file.js',
};
```

我们也可以将一个文件路径数组传递给 entry 属性，这将创建一个所谓的 "multi-main entry"。在你想要一次注入多个依赖文件，并且将它们的依赖关系绘制在一个 "chunk" 中时，这种方式就很有用。

```js
module.exports = {
  entry: ['./src/file_1.js', './src/file_2.js'],
  output: {
    filename: 'bundle.js',
  },
};
```

当你希望通过一个入口（例如一个库）为应用程序或工具快速设置 webpack 配置时，单一入口的语法方式是不错的选择。然而，使用这种语法方式来扩展或调整配置的灵活性不大。

## 对象语法

用法：`entry: { <entryChunkName> string | [string] } | {}`

```js
module.exports = {
  entry: {
    app: './src/app.js',
    adminApp: './src/adminApp.js',
  },
};
```

对象语法会比较繁琐。然而，这是应用程序中定义入口的最可扩展的方式。

>Tip  
>
>- “webpack 配置的可扩展” 是指，这些配置可以重复使用，并且可以与其他配置组合使用。这是一种流行的技术，用于将关注点从环境(environment)、构建目标(build target)、运行时(runtime)中分离。然后使用专门的工具（如 webpack-merge）将它们合并起来。
>- 当你通过插件生成入口时，你可以传递空对象 {} 给 entry。

### 描述入口的对象

用于描述入口的对象。你可以使用如下属性：

- dependOn: 当前入口所依赖的入口。它们必须在该入口被加载前被加载。

- filename: 指定要输出的文件名称。

- import: 启动时需加载的模块。

- library: 指定 library 选项，为当前 entry 构建一个 library。

- runtime: 运行时 chunk 的名字。如果设置了，就会创建一个新的运行时 chunk。在 webpack 5.43.0 之后可将其设为 false 以避免一个新的运行时 chunk。

- publicPath: 当该入口的输出文件在浏览器中被引用时，为它们指定一个公共 URL 地址。

webpack.config.js

```js
module.exports = {
  entry: {
    a2: 'dependingfile.js',
    b2: {
      dependOn: 'a2',
      import: './src/app.js',
    },
  },
};
```

runtime 和 dependOn 不应在同一个入口上同时使用，所以如下配置无效，并且会抛出错误：

```js
module.exports = {
  entry: {
    a2: './a',
    b2: {
      runtime: 'x2',
      dependOn: 'a2',
      import: './b',
    },
  },
};
```

确保 runtime 不能指向已存在的入口名称，例如下面配置会抛出一个错误：

```js
module.exports = {
  entry: {
    a1: './a',
    b1: {
      runtime: 'a1',
      import: './b',
    },
  },
};
```

另外, dependOn 不能是循环引用的.

## 常见场景

以下列出一些入口配置和它们的实际用例：

### 分离 app(应用程序) 和 vendor(第三方库) 入口

webpack.config.js

```js
module.exports = {
  entry: {
    main: './src/app.js',
    vendor: './src/vendor.js',
  },
};
```

webpack.prod.js

```js
module.exports = {
  output: {
    filename: '[name].[contenthash].bundle.js',
  },
};
```

webpack.dev.js

```js
module.exports = {
  output: {
    filename: '[name].bundle.js',
  },
};
```

**这是什么？** 这是告诉 webpack 我们想要配置 2 个单独的入口点（例如上面的示例）。

**为什么？** 这样你就可以在 vendor.js 中存入未做修改的必要 library 或文件（例如 Bootstrap, jQuery, 图片等），然后将它们打包在一起成为单独的 chunk。内容哈希保持不变，这使浏览器可以独立地缓存它们，从而减少了加载时间。

### 多页面应用程序

webpack.config.js

```js
module.exports = {
  entry: {
    pageOne: './src/pageOne/index.js',
    pageTwo: './src/pageTwo/index.js',
    pageThree: './src/pageThree/index.js',
  },
};
```

**这是什么？** 我们告诉 webpack 需要三个独立分离的依赖图（如上面的示例）。

**为什么？** 在多页面应用程序中，server 会拉取一个新的 HTML 文档给你的客户端。页面重新加载此新文档，并且资源被重新下载。然而，这给了我们特殊的机会去做很多事，例如使用 optimization.splitChunks 为页面间共享的应用程序代码创建 bundle。由于入口起点数量的增多，多页应用能够复用多个入口起点之间的大量代码/模块，从而可以极大地从这些技术中受益。
