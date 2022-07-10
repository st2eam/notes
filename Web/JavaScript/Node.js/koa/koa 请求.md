# 请求(Request)

Koa `Request` 对象是对 node 的 request 进一步抽象和封装，提供了日常 HTTP 服务器开发中一些有用的功能。

## API

### request.header

请求头对象

### request.header=

设置请求头对象

### request.headers

请求头对象。等价于 `request.header`.

### request.headers=

设置请求头对象。 等价于`request.header=`.

### request.method

请求方法

### request.method=

设置请求方法, 在实现中间件时非常有用，比如 `methodOverride()`

### request.length

以数字的形式返回 request 的内容长度(Content-Length)，或者返回 `undefined`。

### request.url

获得请求url地址.

### request.url=

设置请求地址，用于重写url地址时

### request.originalUrl

获取请求原始地址

### request.origin

获取URL原始地址, 包含 `protocol` 和 `host`

```js
ctx.request.origin
// => http://example.com
```

### request.href

获取完整的请求URL, 包含 `protocol`, `host` 和 `url`

```js
ctx.request.href;
// => http://example.com/foo/bar?q=1
```

### request.path

获取请求路径名

### request.path=

设置请求路径名并保留当前查询字符串

### request.querystring

获取查询参数字符串(url中?后面的部分)，不包含`?`

### request.querystring=

设置原始查询字符串

### request.search

获取查询参数字符串，包含`?`

### request.search=

设置原始查询字符串

### request.host

获取 host (hostname:port)。 当 `app.proxy` 设置为 **true** 时，支持 `X-Forwarded-Host`

### request.hostname

获取 hostname。当 `app.proxy` 设置为 **true** 时，支持 `X-Forwarded-Host`。

如果主机是IPv6, Koa 将解析转换为 [WHATWG URL API](https://nodejs.org/dist/latest-v8.x/docs/api/url.html#url_the_whatwg_url_api), *注意* 这可能会影响性能

### request.URL

获取 WHATWG 解析的对象.

### request.type

获取请求 `Content-Type`，不包含像 "charset" 这样的参数。

```js
const ct = ctx.request.type;
// => "image/png"
```

### request.charset

获取请求 charset，没有则返回 `undefined`:

```js
ctx.request.charset;
// => "utf-8"
```

### request.query

将查询参数字符串进行解析并以对象的形式返回，如果没有查询参数字字符串则返回一个空对象。注意：该方法不支持嵌套解析。

例如 "color=blue&size=small":

```js
{
  color: 'blue',
  size: 'small'
}
```

### request.query=

根据给定的对象设置查询参数字符串。 注意：该方法*不* 支持嵌套对象。

```js
ctx.query = { next: '/login' };
```

### request.fresh

检查请求缓存是否 "fresh"(内容没有发生变化)。该方法用于在 `If-None-Match` / `ETag`, `If-Modified-Since` 和 `Last-Modified` 中进行缓存协调。当在 response headers 中设置一个或多个上述参数后，该方法应该被使用。

```js
// freshness check requires status 20x or 304
ctx.status = 200;
ctx.set('ETag', '123');

// cache is ok
if (ctx.fresh) {
  ctx.status = 304;
  return;
}

// cache is stale
// fetch new data
ctx.body = await db.find('something');
```

### request.stale

与 `req.fresh` 相反。

### request.protocol

返回请求协议，"https" 或者 "http"。 当 `app.proxy` 设置为 **true** 时，支持 `X-Forwarded-Host`。

### request.secure

简化版 `this.protocol == "https"`，用来检查请求是否通过 TLS 发送。

### request.ip

请求远程地址。 当 `app.proxy` 设置为 **true** 时，支持 `X-Forwarded-Host`。

### request.ips

当 `X-Forwarded-For` 存在并且 `app.proxy` 有效，将会返回一个有序（从 upstream 到 downstream）ip 数组。 否则返回一个空数组。

### request.subdomains

以数组形式返回子域名。

子域名是在host中逗号分隔的主域名前面的部分。默认情况下，应用的域名假设为host中最后两部分。其可通过设置 `app.subdomainOffset` 进行更改。

举例来说，如果域名是 "tobi.ferrets.example.com":

如果没有设置 `app.subdomainOffset`，其 subdomains 为 `["ferrets", "tobi"]`。 如果设置 `app.subdomainOffset` 为3，其 subdomains 为 `["tobi"]`。

### request.is(types...)

检查请求所包含的 "Content-Type" 是否为给定的 type 值。 如果没有 request body，返回 `undefined`。 如果没有 content type，或者匹配失败，返回 `false`。 否则返回匹配的 content-type。

```js
// With Content-Type: text/html; charset=utf-8
ctx.is('html'); // => 'html'
ctx.is('text/html'); // => 'text/html'
ctx.is('text/*', 'text/html'); // => 'text/html'

// When Content-Type is application/json
ctx.is('json', 'urlencoded'); // => 'json'
ctx.is('application/json'); // => 'application/json'
ctx.is('html', 'application/*'); // => 'application/json'

ctx.is('html'); // => false
```

比如说您希望保证只有图片发送给指定路由

```js
if (ctx.is('image/*')) {
  // process
} else {
  ctx.throw(415, 'images only!');
}
```

### Content Negotiation

Koa `request` 对象包含 content negotiation 功能（由 [accepts](http://github.com/expressjs/accepts) 和 [negotiator](https://github.com/federomero/negotiator) 提供）：

- `request.accepts(types)`
- `request.acceptsEncodings(types)`
- `request.acceptsCharsets(charsets)`
- `request.acceptsLanguages(langs)`

如果没有提供 types，将会返回**所有的**可接受类型。

如果提供多种 types，将会返回最佳匹配类型。如果没有匹配上，则返回 `false`，您应该给客户端返回 `406 "Not Acceptable"`。

为了防止缺少 accept headers 而导致可以接受任意类型，将会返回第一种类型。因此，您提供的类型顺序非常重要。

### request.accepts(types)

检查给定的类型 `types(s)` 是否可被接受，当为 true 时返回最佳匹配，否则返回 `false`。`type` 的值可以是一个或者多个 mime 类型字符串。 比如 "application/json" 扩展名为 "json"，或者数组 `["json", "html", "text/plain"]`。

```js
// Accept: text/html
ctx.accepts('html');
// => "html"

// Accept: text/*, application/json
ctx.accepts('html');
// => "html"
ctx.accepts('text/html');
// => "text/html"
ctx.accepts('json', 'text');
// => "json"
ctx.accepts('application/json');
// => "application/json"

// Accept: text/*, application/json
ctx.accepts('image/png');
ctx.accepts('png');
// => false

// Accept: text/*;q=.5, application/json
ctx.accepts(['html', 'json']);
ctx.accepts('html', 'json');
// => "json"

// No Accept header
ctx.accepts('html', 'json');
// => "html"
ctx.accepts('json', 'html');
// => "json"
```

`this.accepts()` 可以被调用多次，或者使用 switch:

```js
switch (ctx.accepts('json', 'html', 'text')) {
  case 'json': break;
  case 'html': break;
  case 'text': break;
  default: ctx.throw(406, 'json, html, or text only');
}
```

### request.acceptsEncodings(encodings)

检查 `encodings` 是否可以被接受，当为 `true` 时返回最佳匹配，否则返回 `false`。 注意：您应该在 encodings 中包含 `identity`。

```js
// Accept-Encoding: gzip
ctx.acceptsEncodings('gzip', 'deflate', 'identity');
// => "gzip"

ctx.acceptsEncodings(['gzip', 'deflate', 'identity']);
// => "gzip"
```

当没有传递参数时，返回包含所有可接受的 encodings 的数组：

```js
// Accept-Encoding: gzip, deflate
ctx.acceptsEncodings();
// => ["gzip", "deflate", "identity"]
```

注意：如果客户端直接发送 `identity;q=0` 时，`identity` encoding（表示no encoding） 可以不被接受。当这个方法返回`false`时，虽然这是一个边界情况，您仍然应该处理这种情况。

### request.acceptsCharsets(charsets)

检查 `charsets` 是否可以被接受，如果为 `true` 则返回最佳匹配， 否则返回 `false`。

```js
// Accept-Charset: utf-8, iso-8859-1;q=0.2, utf-7;q=0.5
ctx.acceptsCharsets('utf-8', 'utf-7');
// => "utf-8"

ctx.acceptsCharsets(['utf-7', 'utf-8']);
// => "utf-8"
```

当没有传递参数时， 返回包含所有可接受的 charsets 的数组：

```js
// Accept-Charset: utf-8, iso-8859-1;q=0.2, utf-7;q=0.5
ctx.acceptsCharsets();
// => ["utf-8", "utf-7", "iso-8859-1"]
```

### request.acceptsLanguages(langs)

检查 `langs` 是否可以被接受，如果为 `true` 则返回最佳匹配，否则返回 `false`。

```js
// Accept-Language: en;q=0.8, es, pt
ctx.acceptsLanguages('es', 'en');
// => "es"

ctx.acceptsLanguages(['en', 'es']);
// => "es"
```

当没有传递参数时，返回包含所有可接受的 langs 的数组：

```js
// Accept-Language: en;q=0.8, es, pt
ctx.acceptsLanguages();
// => ["es", "pt", "en"]
```

### request.idempotent

检查请求是否为幂等(idempotent)

### request.socket

返回请求的socket。

### request.get(field)

返回请求头
