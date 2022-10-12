# 模块（Modules）

在[模块化编程](https://en.wikipedia.org/wiki/Modular_programming)中，开发者将程序分解为功能离散的 chunk，并称之为 **模块**。

每个模块都拥有小于完整程序的体积，使得验证、调试及测试变得轻而易举。 精心编写的 **模块** 提供了可靠的抽象和封装界限，使得应用程序中每个模块都具备了条理清晰的设计和明确的目的。

Node.js 从一开始就支持模块化编程。 然而，web 的 *模块化* 正在缓慢支持中。 在 web 界存在多种支持 JavaScript 模块化的工具，这些工具各有优势和限制。 Webpack 从这些系统中汲取了经验和教训，并将 *模块* 的概念应用到项目的任何文件中。

## 何为 webpack 模块

与 [Node.js 模块](https://nodejs.org/api/modules.html)相比，webpack *模块* 能以各种方式表达它们的依赖关系。下面是一些示例：

- [ES2015 `import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) 语句
- [CommonJS](http://www.commonjs.org/specs/modules/1.0/) `require()` 语句
- [AMD](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) `define` 和 `require` 语句
- css/sass/less 文件中的 [`@import` 语句](https://developer.mozilla.org/en-US/docs/Web/CSS/@import)。
- stylesheet `url(...)` 或者 HTML `<img src=...>` 文件中的图片链接。

## 支持的模块类型

Webpack 天生支持如下模块类型：

- [ECMAScript 模块](https://webpack.docschina.org/guides/ecma-script-modules)
- CommonJS 模块
- AMD 模块
- [Assets](https://webpack.docschina.org/guides/asset-modules)
- WebAssembly 模块

通过 **loader** 可以使 webpack 支持多种语言和预处理器语法编写的模块。**loader** 向 webpack 描述了如何处理非原生*模块*，并将相关**依赖**引入到你的 **bundles**中。 webpack 社区已经为各种流行的语言和预处理器创建了 *loader*，其中包括：

- [CoffeeScript](http://coffeescript.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [ESNext (Babel)](https://babeljs.io/)
- [Sass](http://sass-lang.com/)
- [Less](http://lesscss.org/)
- [Stylus](http://stylus-lang.com/)
- [Elm](https://elm-lang.org/)

当然还有更多！总得来说，webpack 提供了可定制，强大且丰富的 API，允许在 **任何技术栈** 中使用，同时支持在开发、测试和生产环境的工作流中做到 **无侵入性**。

关于 loader 的相关信息，请参考 [**loader 列表**](https://webpack.docschina.org/loaders) 或 [**自定义 loader**](https://webpack.docschina.org/api/loaders)。

## Further Reading

- [JavaScript Module Systems Showdown](https://auth0.com/blog/javascript-module-systems-showdown/)
