# Response

Koa `Response` 对象是对 node 的 response 进一步抽象和封装，提供了日常 HTTP 服务器开发中一些有用的功能。

## API

### response.header

Response header 对象。

### response.headers

Response header 对象。等价于 `response.header`.

### response.socket

Request socket.

### response.status

获取响应状态。 默认情况下，`response.status`设置为404，而不像node's `res.statusCode`默认为200。

### response.status=

通过数字设置响应状态:

- 100 "continue"
- 101 "switching protocols"
- 102 "processing"
- 200 "ok"
- 201 "created"
- 202 "accepted"
- 203 "non-authoritative information"
- 204 "no content"
- 205 "reset content"
- 206 "partial content"
- 207 "multi-status"
- 208 "already reported"
- 226 "im used"
- 300 "multiple choices"
- 301 "moved permanently"
- 302 "found"
- 303 "see other"
- 304 "not modified"
- 305 "use proxy"
- 307 "temporary redirect"
- 308 "permanent redirect"
- 400 "bad request"
- 401 "unauthorized"
- 402 "payment required"
- 403 "forbidden"
- 404 "not found"
- 405 "method not allowed"
- 406 "not acceptable"
- 407 "proxy authentication required"
- 408 "request timeout"
- 409 "conflict"
- 410 "gone"
- 411 "length required"
- 412 "precondition failed"
- 413 "payload too large"
- 414 "uri too long"
- 415 "unsupported media type"
- 416 "range not satisfiable"
- 417 "expectation failed"
- 418 "I'm a teapot"
- 422 "unprocessable entity"
- 423 "locked"
- 424 "failed dependency"
- 426 "upgrade required"
- 428 "precondition required"
- 429 "too many requests"
- 431 "request header fields too large"
- 500 "internal server error"
- 501 "not implemented"
- 502 "bad gateway"
- 503 "service unavailable"
- 504 "gateway timeout"
- 505 "http version not supported"
- 506 "variant also negotiates"
- 507 "insufficient storage"
- 508 "loop detected"
- 510 "not extended"
- 511 "network authentication required"

**注意**：不用担心记不住这些字符串，如果您设置错误，会有异常抛出，并列出该状态码表来帮助您进行更正。

### response.message

获取响应状态消息。默认情况下, `response.message`关联`response.status`。

### response.message=

将响应状态消息设置为给定值。

### response.length=

将响应Content-Length设置为给定值。

### response.length

如果 Content-Length 作为数值存在，或者可以通过 `ctx.body` 来进行计算，则返回相应数值，否则返回 `undefined`。

### response.body

获取响应体。

### response.body=

设置响应体为如下值:

- `string` written
- `Buffer` written
- `Stream` piped
- `Object` || `Array` json-stringified
- `null` no content response

如果 `res.status` 没有赋值，Koa会自动设置为 `200` 或 `204`。

#### String

Content-Type 默认为 text/html 或者 text/plain，两种默认 charset 均为 utf-8。 Content-Length 同时会被设置。

#### Buffer

Content-Type 默认为 application/octet-stream，Content-Length同时被设置。

#### Stream

Content-Type 默认为 application/octet-stream。

当stream被设置为响应体时， `.onerror`将作为监听器自动添加到错误事件中以捕获任何错误。此外，每当请求被关闭（甚至更早）时，stream都将被销毁。如果不想要这两个功能，请不要直接将stream设置为响应体。例如，当将响应体设置为代理中的HTTP stream时，会破坏底层连接。

请查阅: [fix: should not destroy streams by dead-horse · Pull Request #612 · koajs/koa · GitHub](https://github.com/koajs/koa/pull/612)来获取更多信息。

以下是stream error处理的示例，并且不会自动销毁stream：

```js
const PassThrough = require('stream').PassThrough;

app.use(async ctx => {
  ctx.body = someHTTPStream.on('error', ctx.onerror).pipe(PassThrough());
});
```

#### Object

Content-Type默认为application/json。 这包括普通对象`{ foo: 'bar' }`和数组['foo', 'bar']。

### response.get(field)

获取 response header 中字段值，field 不区分大小写。

```js
const etag = ctx.response.get('ETag');
```

### response.set(field, value)

设置 response header 字段 `field` 的值为 `value`。

```js
ctx.set('Cache-Control', 'no-cache');
```

### response.append(field, value)

添加额外的字段`field` 的值为 `val`

```js
ctx.append('Link', '<http://127.0.0.1/>');
```

### response.set(fields)

使用对象同时设置 response header 中多个字段的值。

```js
ctx.set({
  'Etag': '1234',
  'Last-Modified': date
});
```

### response.remove(field)

移除 response header 中字段 `filed`。

### response.type

获取 response `Content-Type`，不包含像"charset"这样的参数。

```js
const ct = ctx.type;
// => "image/png"
```

### response.type=

通过 mime 类型的字符串或者文件扩展名设置 response `Content-Type`

```js
ctx.type = 'text/plain; charset=utf-8';
ctx.type = 'image/png';
ctx.type = '.png';
ctx.type = 'png';
```

注意：当为你选择一个合适的`charset`时，例如`response.type = 'html'`将默认为"utf-8"。 如果需要覆盖`charset`，请使用`ctx.set('Content-Type', 'text/html')`直接设置响应头字段值。

### response.is(types...)

跟`ctx.request.is()`非常类似。用来检查响应类型是否是所提供的类型之一。这对于创建操作响应的中间件特别有用。

例如，这是一个中间件，它可以缩小除stream以外的所有HTML响应。

```js
const minify = require('html-minifier');

app.use(async (ctx, next) => {
  await next();

  if (!ctx.response.is('html')) return;

  let body = ctx.body;
  if (!body || body.pipe) return;

  if (Buffer.isBuffer(body)) body = body.toString();
  ctx.body = minify(body);
});
```

### response.redirect(url, [alt])

执行 [302] 重定向到对应 `url`。

字符串 "back" 是一个特殊参数，其提供了 Referrer 支持。当没有Referrer时，使用 `alt` 或者 `/` 代替。

```js
ctx.redirect('back');
ctx.redirect('back', '/index.html');
ctx.redirect('/login');
ctx.redirect('http://google.com');
```

如果想要修改默认的 [302] 状态，直接在重定向之前或者之后执行即可。如果要修改 body，需要在重定向之前执行。

```js
ctx.status = 301;
ctx.redirect('/cart');
ctx.body = 'Redirecting to shopping cart';
```

### response.attachment([filename])

设置 "attachment" 的 `Content-Disposition`，用于给客户端发送信号来提示下载。filename 为可选参数，用于指定下载文件名。

### response.headerSent

检查 response header 是否已经发送，用于在发生错误时检查客户端是否被通知。

### response.lastModified

如果存在 `Last-Modified`，则以 `Date` 的形式返回。

### response.lastModified=

以 UTC 格式设置 `Last-Modified`。您可以使用 `Date` 或 date 字符串来进行设置。

```js
ctx.response.lastModified = new Date();
```

### response.etag=

设置 包含 `"`s 的 ETag。注意没有对应的 `res.etag` 来获取其值。

```js
ctx.response.etag = crypto.createHash('md5').update(ctx.body).digest('hex');
```

### response.vary(field)

不同于`field`.

### response.flushHeaders()

刷新任何设置的响应头，并开始响应体。
