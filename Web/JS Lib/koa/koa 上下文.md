# Context(上下文)

Koa Context 将 node 的 `request` 和 `response` 对象封装在一个单独的对象里面，其为编写 web 应用和 API 提供了很多有用的方法。 这些操作在 HTTP 服务器开发中经常使用，因此其被添加在上下文这一层，而不是更高层框架中，因此将迫使中间件需要重新实现这些常用方法。

`context` 在每个 request 请求中被创建，在中间件中作为接收器(receiver)来引用，或者通过 `this` 标识符来引用：

```js
app.use(async ctx => {
  ctx; // is the Context
  ctx.request; // is a koa Request
  ctx.response; // is a koa Response
});
```

许多 context 的访问器和方法为了便于访问和调用，简单的委托给他们的 `ctx.request` 和 `ctx.response` 所对应的等价方法， 比如说 `ctx.type` 和 `ctx.length` 代理了 `response` 对象中对应的方法，`ctx.path` 和 `ctx.method` 代理了 `request` 对象中对应的方法。

## API

`Context` 详细的方法和访问器。

### ctx.req

Node 的 `request` 对象。

### ctx.res

Node 的 `response` 对象。

Koa *不支持* 直接调用底层 res 进行响应处理。请避免使用以下 node 属性：

- `res.statusCode`
- `res.writeHead()`
- `res.write()`
- `res.end()`

### ctx.request

Koa 的 `Request` 对象。

### ctx.response

Koa 的 `Response` 对象。

### ctx.state

推荐的命名空间，用于通过中间件传递信息到前端视图

```js
ctx.state.user = await User.find(id);
```

### ctx.app

应用实例引用。

### ctx.cookies.get(name, [options])

获得 cookie 中名为 `name` 的值，`options` 为可选参数：

- `signed` 如果为 true，表示请求时 cookie 需要进行签名。

注意：Koa 使用了 Express 的 [cookies](https://github.com/jed/cookies) 模块，options 参数只是简单地直接进行传递。

### ctx.cookies.set(name, value, [options])

设置 cookie 中名为 `name` 的值，`options` 为可选参数：

- `maxAge` 一个数字，表示 Date.now()到期的毫秒数
- `signed` 是否要做签名
- `expires` cookie有效期
- `path`cookie 的路径，默认为 `/'`
- `domain` cookie 的域
- `secure` false 表示 cookie 通过 HTTP 协议发送，true 表示 cookie 通过 HTTPS 发送。
- `httpOnly` true 表示 cookie 只能通过 HTTP 协议发送
- `overwrite` 一个布尔值，表示是否覆盖以前设置的同名的Cookie（默认为false）。 如果为true，在设置此cookie时，将在同一请求中使用相同名称（不管路径或域）设置的所有Cookie将从Set-Cookie头部中过滤掉。

注意：Koa 使用了 Express 的 [cookies](https://github.com/jed/cookies) 模块，options 参数只是简单地直接进行传递。

### ctx.throw([status], [msg], [properties])

抛出包含 `.status` 属性的错误，默认为 `500`。该方法可以让 Koa 准确的响应处理状态。 Koa支持以下组合：

```js
ctx.throw(400);
ctx.throw(400, 'name required');
ctx.throw(400, 'name required', { user: user });
```

`this.throw('name required', 400)` 等价于：

```js
const err = new Error('name required');
err.status = 400;
err.expose = true;
throw err;
```

注意：这些用户级错误被标记为 `err.expose`，其意味着这些消息被准确描述为对客户端的响应，而并非使用在您不想泄露失败细节的场景中。

您可以选择传递一个属性对象，该对象被合并到错误中，这对装饰机器友好错误非常有用，并且这些错误会被报给上层请求。

```js
ctx.throw(401, 'access_denied', { user: user });
```

koa用 [http-errors](https://github.com/jshttp/http-errors)来创建错误。

### ctx.assert(value, [status], [msg], [properties])

当`!value`时， Helper 方法抛出一个类似`.throw()`的错误。 类似node's [assert()](http://nodejs.org/api/assert.html) 方法。

```js
ctx.assert(ctx.state.user, 401, 'User not found. Please login!');
```

koa 使用 [http-assert](https://github.com/jshttp/http-assert) 来断言。

### ctx.respond

为了避免使用 Koa 的内置响应处理功能，您可以直接赋值 `this.repond = false;`。如果您不想让 Koa 来帮助您处理 reponse，而是直接操作原生 `res` 对象，那么请使用这种方法。

注意： 这种方式是不被 Koa 支持的。其可能会破坏 Koa 中间件和 Koa 本身的一些功能。其只作为一种 hack 的方式，并只对那些想要在 Koa 方法和中间件中使用传统 `fn(req, res)` 方法的人来说会带来便利。

## Request aliases

以下访问器和别名与 [Request](https://www.koajs.com.cn/#request) 等价：

- `ctx.header`
- `ctx.headers`
- `ctx.method`
- `ctx.method=`
- `ctx.url`
- `ctx.url=`
- `ctx.originalUrl`
- `ctx.origin`
- `ctx.href`
- `ctx.path`
- `ctx.path=`
- `ctx.query`
- `ctx.query=`
- `ctx.querystring`
- `ctx.querystring=`
- `ctx.host`
- `ctx.hostname`
- `ctx.fresh`
- `ctx.stale`
- `ctx.socket`
- `ctx.protocol`
- `ctx.secure`
- `ctx.ip`
- `ctx.ips`
- `ctx.subdomains`
- `ctx.is()`
- `ctx.accepts()`
- `ctx.acceptsEncodings()`
- `ctx.acceptsCharsets()`
- `ctx.acceptsLanguages()`
- `ctx.get()`

## Response aliases

以下访问器和别名与 [Response](https://www.koajs.com.cn/#response) 等价：

- `ctx.body`
- `ctx.body=`
- `ctx.status`
- `ctx.status=`
- `ctx.message`
- `ctx.message=`
- `ctx.length=`
- `ctx.length`
- `ctx.type=`
- `ctx.type`
- `ctx.headerSent`
- `ctx.redirect()`
- `ctx.attachment()`
- `ctx.set()`
- `ctx.append()`
- `ctx.remove()`
- `ctx.lastModified=`
- `ctx.etag=`
