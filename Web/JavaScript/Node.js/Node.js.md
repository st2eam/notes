# Node.js基础

[Node.js v18.4.0 Documentation](https://nodejs.org/dist/latest/docs/api/)

简单的说 Node.js 就是运行在服务端的 JavaScript。

Node.js 是一个基于 Chrome JavaScript 运行时建立的一个平台。

Node.js 是一个事件驱动 I/O 服务端 JavaScript 环境，基于 Google 的 V8 引擎，V8 引擎执行 Javascript 的速度非常快，性能非常好。

### Node 的特点

作为后端JavaScript的运行平台，Node保留了前端浏览器JavaScript中那些熟悉的接口，没有改写语言本身的任何特性，依旧基于作用域和原型链，区别在于它将前端中广泛运用的思想迁移到了服务器端。

### 使用 supervisor

我们在开发过程中总是希望修改后立即看到效果，而不是每次都要终止进程并重启。
supervisor 可以帮助你实现这个功能，它会监视你对代码的改动，并自动重启 Node.js。
使用方法很简单，首先使用 npm 安装 supervisor：

```bash
npm install -g supervisor
```

然后supervisor 命令启动 app.js

```bash
supervisor app.js 
```

supervisor 这个小工具可以解决开发中的调试问题。

## 使用TypeScript

使用TS来编写Node.js程序的关键是安装对应的类型提示模块，我们首先通过 `npm init` 初始化一个空的npm工程，然后通过下面的命令来安装类型依赖

```bash
npm i @types/node --save-dev
```

`@types/node` 就是Node.js的类型提示模块，安装之后TS就可以识别Node.js中的API和数据类型了。然后我们需要创建一个 `tsconfig.json` 文件，用来告诉TS如何编译我们的代码，最关键的一个选项是将模块类型转换为 `commonjs`，如下是一个非常基本的配置选项。

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "esnext",
    "skipLibCheck": true,
    "sourceMap": true,
    "outDir": "dist"
  },
  "include": [
    "src/**/*"
  ]
}
```

因为历史原因，Node.js最早是支持 `CommonJS` 模块规范的，后来随着 `ES Modules` 的发展Node.js也提供了支持，但是目前两者的兼容还存在很多问题，为了更好的兼容性，我们建议目前还是转换成 `CommonJS` 模块来执行，当然，TS会帮我们自动完成这个工作，我们还是直接使用 `ES Modules` 即可。

完成上面的配置后，我们可以把TS源代码放在 `src` 目录中，通过执行 `tsc` 命令即可编译输出JS文件到 `dist` 目录。
