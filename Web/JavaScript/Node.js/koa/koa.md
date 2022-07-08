# [Koa](https://www.koajs.com.cn/)

koa 是由 Express 原班人马打造的，致力于成为一个更小、更富有表现力、更健壮的 Web 框架。使用 koa 编写 web 应用，通过组合不同的 generator，可以免除重复繁琐的回调函数嵌套，并极大地提升错误处理的效率。koa 不在内核方法中绑定任何中间件，它仅仅提供了一个轻量优雅的函数库，使得编写 Web 应用变得得心应手。

```bash
npm i koa
```

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
