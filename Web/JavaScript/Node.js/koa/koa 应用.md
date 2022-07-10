# [Koa](https://www.koajs.com.cn/)

koa 是由 Express 原班人马打造的，致力于成为一个更小、更富有表现力、更健壮的 Web 框架。使用 koa 编写 web 应用，通过组合不同的 generator，可以免除重复繁琐的回调函数嵌套，并极大地提升错误处理的效率。koa 不在内核方法中绑定任何中间件，它仅仅提供了一个轻量优雅的函数库，使得编写 Web 应用变得得心应手。

```bash
npm i koa
```

## Babel异步函数

在node < 7.6的版本中使用`async` 函数, 我们推荐使用[babel's require hook](http://babeljs.io/docs/usage/require/).

```
require('babel-core/register');
// require the rest of the app that needs to be transpiled after the hook
const app = require('./app');
```

为了解析和转译异步函数，你应该至少有[transform-async-to-generator](http://babeljs.io/docs/plugins/transform-async-to-generator/) or [transform-async-to-module-method](http://babeljs.io/docs/plugins/transform-async-to-module-method/)这2个插件。例如，在你的`.babelrc`文件中，应该有如下代码

```
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
