# [Koa](https://www.koajs.com.cn/)

Koa.js是一个非常流行和轻量的服务端框架，它完全使用async/await，所以对于现代化的异步编程非常友好，它的核心是一个精简的洋葱模型中间件执行器，自身只做了非常基本的一些封装，复杂的能力实现都交给社区中间件来实现。使用 koa 编写 web 应用，通过组合不同的 generator，可以免除重复繁琐的回调函数嵌套，并极大地提升错误处理的效率。koa 不在内核方法中绑定任何中间件，它仅仅提供了一个轻量优雅的函数库，使得编写 Web 应用变得得心应手。

<img title="" src="https://img2018.cnblogs.com/blog/1615279/201903/1615279-20190329154916498-1327576312.png" alt="" data-align="center">

洋葱模型就是Koa中间件的处理流程，中间件的生命周期大致有

- 前期处理
- 交给并等待其他中间件处理
- 后期处理

多个中间件处理，就形成了上面的洋葱模型，每个请求进之后都会执行一遍上面的流程，最开始的中间件最先执行、最后退出，和洋葱一层一层的结构非常相似

```bash
npm i koa
```

## Babel异步函数

在node < 7.6的版本中使用`async` 函数, 我们推荐使用[babel's require hook](http://babeljs.io/docs/usage/require/).

```js
require('babel-core/register');
// require the rest of the app that needs to be transpiled after the hook
const app = require('./app');
```

为了解析和转译异步函数，你应该至少有[transform-async-to-generator](http://babeljs.io/docs/plugins/transform-async-to-generator/) or [transform-async-to-module-method](http://babeljs.io/docs/plugins/transform-async-to-module-method/)这2个插件。例如，在你的`.babelrc`文件中，应该有如下代码

```js
{
  "plugins": ["transform-async-to-generator"]
}
```

也可以使用[env preset](http://babeljs.io/docs/plugins/preset-env/)并设置`"node": "current"`来替代.

## 应用

Koa 应用是一个包含一系列中间件 generator 函数的对象。 这些中间件函数基于 request 请求以一个类似于栈的结构组成并依次执行。 Koa 类似于其他中间件系统（比如 Ruby's Rack 、Connect 等）， 然而 Koa 的核心设计思路是为中间件层提供高级语法糖封装，以增强其互用性和健壮性，并使得编写中间件变得相当有趣。

Koa 包含了像 content-negotiation（内容协商）、cache freshness（缓存刷新）、proxy support（代理支持）和 redirection（重定向）等常用任务方法。 与提供庞大的函数支持不同，Koa只包含很小的一部分，因为Koa并不绑定任何中间件。

```js
const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000);
```

### 级联

Koa 的中间件通过一种更加传统的方式进行级联，摒弃了以往 node 频繁的回调函数造成的复杂代码逻辑。 然而，使用异步函数，我们可以实现"真正" 的中间件。与之不同，当执行到 yield next 语句时，Koa 暂停了该中间件，继续执行下一个符合请求的中间件('downstrem')，然后控制权再逐级返回给上层中间件('upstream')。

下面的例子在页面中返回 "Hello World"，然而当请求开始时，请求先经过 `x-response-time` 和 `logging` 中间件，并记录中间件执行起始时间。 然后将控制权交给 reponse 中间件。当一个中间件调用`next()`函数时，函数挂起并控件传递给定义的下一个中间件。在没有更多的中间件执行下游之后，堆栈将退出，并且每个中间件被恢复以执行其上游行为。

```js
const Koa = require('koa');
const app = new Koa();

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// logger

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

// response

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000);
```

### 配置

应用配置是 app 实例属性，目前支持的配置项如下：

- `app.env` 默认为 **NODE_ENV** or "development"
- `app.proxy` 如果为 true，则解析 "Host" 的 header 域，并支持 X-Forwarded-Host
- `app.subdomainOffset` 默认为2，表示 `.subdomains` 所忽略的字符偏移量。

### app.listen(...)

Koa 应用并非是一个 1-to-1 表征关系的 HTTP 服务器。 一个或多个Koa应用可以被挂载到一起组成一个包含单一 HTTP 服务器的大型应用群。

如下为一个绑定`3000`端口的简单 Koa 应用，其创建并返回了一个 HTTP 服务器，为 `Server#listen()` 传递指定参数（参数的详细文档请查看[nodejs.org](http://nodejs.org/api/http.html#http_server_listen_port_hostname_backlog_callback)）。

```js
const Koa = require('koa');
const app = new Koa();
app.listen(3000);
```

The `app.listen(...)` 实际上是以下代码的语法糖:

```js
const http = require('http');
const Koa = require('koa');
const app = new Koa();
http.createServer(app.callback()).listen(3000);
```

这意味着您可以同时支持 HTTPS 和 HTTPS，或者在多个端口监听同一个应用。

```js
const http = require('http');
const https = require('https');
const Koa = require('koa');
const app = new Koa();
http.createServer(app.callback()).listen(3000);
https.createServer(app.callback()).listen(3001);
```

## app.callback()

返回一个适合 `http.createServer()` 方法的回调函数用来处理请求。 您也可以使用这个回调函数将您的app挂载在 Connect/Express 应用上。

## app.use(function)

为应用添加指定的中间件，详情请看 [Middleware](https://github.com/koajs/koa/wiki#middleware)

## app.keys=

设置签名cookie密钥。

该密钥会被传递给[KeyGrip](https://github.com/jed/keygrip), 当然，您也可以自己生成 `KeyGrip`. 例如:

```js
app.keys = ['im a newer secret', 'i like turtle'];
app.keys = new KeyGrip(['im a newer secret', 'i like turtle'], 'sha256');
```

在进行cookie签名时，只有设置 `signed` 为 `true` 的时候，才会使用密钥进行加密：

```js
ctx.cookies.set('name', 'tobi', { signed: true });
```

## app.context

`app.context`是从中创建`ctx`的原型。 可以通过编辑`app.context`向`ctx`添加其他属性。当需要将`ctx`添加到整个应用程序中使用的属性或方法时，这将会非常有用。这可能会更加有效（不需要中间件）和/或更简单（更少的`require()`），而不必担心更多的依赖于ctx，这可以被看作是一种反向模式。

例如，从`ctx`中添加对数据库的引用：

```js
app.context.db = db();

app.use(async ctx => {
  console.log(ctx.db);
});
```

注:

- `ctx`上的很多属性是被限制的，在`app.context`只能通过使用`Object.defineProperty()`来编辑这些属性（不推荐）。可以在 [https://github.com/koajs/koa/issues/652](https://github.com/koajs/koa/issues/652)上查阅
- 已安装的APP沿用父级的`ctx`和配置。因此，安装的应用程序只是一组中间件。

## body解析

对于请求对象来说，它其实是一个可读流，如 `server-demo` 中的例子，当有请求到达时就会触发 `createServer` 的回调，此时能拿到的只有请求头，body的数据还没有开始接收，然后body的数据类型可能有很多种，比如JSON、FormData、Binary，如果要正确解析它们需要这样来处理

- 收集请求流中的数据

- 根据请求头中的 `Content-Type` 判断收集到的数据的类型

- 根据类型选择对应的处理方式尝试解码

`koa-body` 就是专门来处理这个问题的中间件，常见的数据类型都能支持，也可以用来处理文件上传

## 路由处理

`koa-router` 是一个Koa的路由中间件，使用非常广泛，它的用法和前面自己封装的router非常类似，具体可以参考示例代码。

> 在编写服务端代码的时候一个非常常用设计模式就是代码分层，路由的作用应该仅用来定义API接口、处理参数、封装返回值，具体的业务逻辑需要交给service层，这样service层就是可以复用的，因为路由层很难复用，所以不应该在路由里面去做细节的业务逻辑处理

## API风格

HTTP接口有很多的风格，比如知名度比较高的restful，不过在实际的应用环境中接口通常都比较复杂，完全遵循restful有时不是很方便，在我们的例子中简化了这些概念

- 对于只读类型的请求都采用 `GET` 方式，参数通过query传递，如各种查询操作

- 对于会产生副作用的请求都采用 `POST JSON` 的方式，如登录、修改、删除

我们的服务端通常只会输出JSON或者二进制文件，对于JSON类型的返回,通常都会约定好一个固定的格式，这样方便客户端去处理，如我们在例子中统一都采用下面的返回格式

```ts
interface ApiResp {

  code: number

  message: string

  data: any

}
```

- `code` 表示业务执行的状态码，它和http响应状态码没有直接关系，这里当 `code` 为 `0` 时 我们约定为业务执行成功的状态

- `message` 表示错误信息，用户给调用者的提示，只有当 `code` 不为 `0` 时服务端才会返回 `message`

- `data` 表示返回的实际有效的数据，`code` 为 `0` 时才会携带 `data`，但是有的请求不需要返回数据，只需要知道执行的状态，此时只需要返回 `code` 就可以了，比如删除数据成功时

## 参数检查

服务端程序和前端在数据的处理上面有很大不同，服务端因为运行在远程服务器而不是用户自己的电脑上，所以对待用户输入的数据需要非常谨慎，应该假定用户输入的所有数据都是不可信的，需要经过合法性校验才允许使用，比如配型是否匹配，参数是否有缺失等等，否则很容易造成程序异常，`Joi` 是一个非常流行的用于js数据模型校验的库，我们可以用它在路由中检查请求的参数类型是否匹配，然后再交给service去处理

## 日志输出

服务端一旦上线通常就需要长时间稳定运行，所以就不像本地调试那么方便发现问题了，为了对服务的运行情况有一个大概的了解，通常都会设计日志输出的功能，将请求处理的关键信息记录下来，方便排查问题，在Koa中要实现请求日志的记录非常简单，我们可以设计一个logger中间件，让Koa第一个去加载它，根据洋葱模型的机制，它就可以覆盖整个请求的处理过程

## 错误处理

默认情况下Koa会将所有错误信息输出到 stderr， 除非 `app.silent` 是 `true`.当`err.status`是`404`或者`err.expose`时，默认错误处理程序也不会输出错误。要执行自定义错误处理逻辑，如集中式日志记录，您可以添加一个"错误"事件侦听器：

```js
app.on('error', err => {
  log.error('server error', err)
});
```

如果错误发生在 请求/响应 环节，并且其不能够响应客户端时，`Contenxt` 实例也会被传递到 `error` 事件监听器的回调函数里。

```js
app.on('error', (err, ctx) => {
  log.error('server error', err, ctx)
});
```

当发生错误但仍能够响应客户端时（比如没有数据写到socket中），Koa会返回一个500错误(Internal Server Error)。 无论哪种情况，Koa都会生成一个应用级别的错误信息，以便实现日志记录等目的。
