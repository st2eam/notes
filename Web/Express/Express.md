# 启动一个 Express 服务

在 `myApp.js` 文件的前两行中，你可以看到创建一个 Express 应用对象很简单。 这个对象有几种方法。 一个基础的方法是 `app.listen(port)`。 它处于运行状态时告诉服务器监听指定的端口。 出于测试的原因，需要应用在后台运行，所以在 `server.js` 中已经添加了这个方法。

让我们在服务端输出第一个字符串！ 在 Express 中，路由采用这种结构：`app.METHOD(PATH, HANDLER)`， METHOD 是 http 请求方法的小写形式， PATH 是服务器上的相对路径（它可以是一个字符串，甚至可以是正则表达式）， HANDLER 是匹配路由时 Express 调用的函数， 处理函数采用这种形式：`function(req, res) {...}`，其中 req 是请求对象，res 是响应对象， 例如：

```js
function(req, res) {
  res.send('Response String');
}
```

将会响应一个字符串“Response String”。

当 GET 请求 `/`（根路由 ）时，使用 `app.get()` 方法响应一个“Hello Express”字符串。 通过查看日志确保代码正常运行，如果使用 Replit 可以在预览中查看结果。

# 提供 HTML 文件服务

通过 `res.sendFile(path)` 方法给请求响应一个文件， 可以把它放到路由处理 `app.get('/', ...)` 中。 在后台，这个方法会根据你想发送的文件的类型，设置适当的消息头信息来告诉浏览器如何处理它， 然后读取并发送文件， 此方法需要文件的绝对路径。 建议使用 Node. js 的全局变量 `__dirname` 来计算出这个文件的绝对路径：

```js
absolutePath = __dirname + relativePath/file.ext
```

发送文件 `/views/index.html` 作为 `/` 的 GET 请求的响应。 如果实时查看应用，你会看到一个大的 HTML 标题（以及我们稍后将使用的表单……），目前它们还没有任何样式。

```js
let express = require('express');
let app = express();
app.get("/", (req, res) => { res.sendFile(__dirname + "/views/index.html");
});
 module.exports = app;
```

# 提供静态资源服务

HTML 服务器通常有一个或多个用户可以访问的目录。 你可以将应用程序所需的静态资源 (样式表、脚本、图片) 放在那里。

在 Express 中可以使用中间件 `express.static(path)` 来设置此功能，它的参数 `path` 就是包含静态资源文件的绝对路径。

如果你不知道什么是中间件……别担心，我们将在后面详细讨论。 其实，中间件就是一个拦截路由处理方法并在里面添加一些信息的函数。 使用 `app.use(path, middlewareFunction)` 方法来加载一个中间件， 它的第一个参数 `path` 是可选的， 如果没设置第一个参数，那么所有的请求都会经过这个中间件处理。

使用 `app.use()` 为路径 `/public` 的请求安装 `express.static()` 中间件， 静态资源的绝对路径是 `__dirname + /public`。

现在应用应该能提供 CSS 样式表， 请注意， `/public/style.css` 文件被项目模板的 `/views/index.html` 引用， 首页应该更好看了。

```js
let express = require('express');
let app = express();
app.get("/", (req, res) => { res.sendFile(__dirname + "/views/index.html");
});
let path = "/public"
let middle = express.static(__dirname+path)
app.use(path,middle)
module.exports = app;
```

# 在指定路由上提供 JSON 服务

HTML 服务器提供 HTML 服务，而 API 提供数据服务。 REST（REpresentational State Transfer）API 允许以简单的方式进行数据交换，对于客户端不必要知道服务器的细节。 客户只需要知道资源在哪里（URL），以及想执行的动作（动词）。 GET 动词常被用来获取无需修改的信息。 如今，网络上的移动数据首选格式是 JSON， 简而言之，JSON 是一种可以方便地用字符串表示 JavaScript 对象的方式，因此它很容易传输。

我们来创建一个简单的 API，创建一个路径为 `/json` 且返回数据是 JSON 格式的路由， 可以像之前那样用 `app.get()` 方法来做。 然后在路由处理部分使用 `res.json()` 方法，并传入一个对象作为参数， 这个方法会结束请求响应循环（request-response loop），然后返回数据。 原来，一个有效的 JavaScript 对象会转化为字符串，然后会设置适当的消息头来告诉浏览器：“这是一个 JSON 数据”，最后将数据返回给客户端。 一个有效的对象通常是这种结构：`{key: data}`， `data` 可以是数字、字符串、嵌套对象或数组， `data` 也可以是变量或者函数返回值，在这种情况下，它们先求值再转成字符串。

当向路由 `/json` 发送 GET 请求，将对象 `{"message": "Hello json"}` 以 JSON 格式返回给客户端， 浏览器访问 `your-app-url/json` 时，应该在屏幕上看到这个消息。

```js
let json = {"message": "Hello json"}
app.get("/json", (req, res) => { res.send(json)
});
```

# 使用 .env 文件

`.env` 文件是一个用于将环境变量传给应用程序的隐藏文件， 这是一个除了开发者之外没人可以访问的私密文件，它可以用来存储你想保密或者隐藏的数据， 例如，它可以存储第三方服务的 API 密钥或者数据库 URI， 也可以使用它来存储配置选项， 通过设置配置选项，你可以改变应用程序的行为，而无需重写一些代码。

在应用程序中可以通过 `process.env.VAR_NAME` 访问到环境变量。 `process.env` 对象是 Node 程序中的一个全局对象，可以给这个变量传字符串。 习惯上，变量名全部大写，单词之间用下划线分隔。 `.env` 是一个 shell 文件，因此不需要用给变量名和值加引号。 还有一点需要注意，当你给变量赋值时等号两侧不能有空格，例如：`VAR_NAME=value`。 通常来讲，每一个变量定义会独占一行。

**添加一个环境变量作为配置选项。**

在项目根目录创建一个 `.env` 文件，并存储变量 `MESSAGE_STYLE=uppercase`。

当向 `/json` 发 GET 请求时，如果 `process.env.MESSAGE_STYLE` 的值为 `uppercase`，那么上一次挑战中的路由处理程序返回的对象的消息则应该大写。 响应对象应该是 `{"message": "Hello json"}` or `{"message": "HELLO JSON"}`，取决于 `MESSAGE_STYLE` 的值。

**注意：** 如果你正在使用 Replit，你无法创建一个 `.env` 文件。 相反，使用内置的 SECRETS 标签添加变量。

如果你在本地工作，你将需要 `dotenv` 包。 它将环境变量从你的 `.env` 文件加载到 `process.env` 中。 使用 `npm install dotenv` 安装它。 然后，在 `myApp.js` 文件的顶部，使用 `require('dotenv').config()` 导入和加载变量。

```js
app.get("/json", (req, res) => { 
  if(process.env.MESSAGE_STYLE==="uppercase")json.message = json.message.toUpperCase()
  res.send(json)
});
```

# 实现一个根级的请求记录中间件

前面我们介绍了 `express.static()` 中间件函数， 现在是时候更详细地了解什么是中间件了。 中间件函数是一个接收 3 个参数的函数，这 3 个参数分别是：请求对象、响应对象和在应用的请求-响应循环中的下一个函数。 中间件函数执行一些可能对应用程序产生一些效果的代码，通常还会在请求对象或者响应对象里添加一些信息， 它们也可以在满足某些条件时通过发送响应来结束循环， 如果在它们完成时没有发送响应，那么就会开始执行堆栈中的下一个函数， `next()` 将触发调用第 3 个参数。

请看以下示例：

```js
function(req, res, next) {
  console.log("I'm a middleware...");
  next();
}
```

假设在某个路由上安装了这个中间件函数， 当一个请求与路由匹配时，它会显示字符串“I’m a middleware…”，然后它执行堆栈中的下一个函数。 在这个练习中，我们将构建根级中间件。 正如我们在挑战 4 中看到的，要在根层级安装中间件函数，我们可以使用 `app.use(<middleware-function>)` 方法。 在这种情况下，该函数将对所有请求执行，但也可以设置更具体的条件来执行， 例如，如果你希望某个函数只针对 POST 请求执行，可以使用 `app.post(<middleware-function>)` 方法。 所有的 HTTP 动词（GET、DELETE、PUT……）都存在类似的方法。

构建一个简单的日志记录器。 对于每个请求，它应该在控制台中打印一个采用以下格式的字符串：`method path - ip`， 例如：`GET /json - ::ffff:127.0.0.1`。 注意 `method` 和 `path` 之间有一个空格，并且 `path` 和 `ip` 中间的破折号的两边都有空格。 可以使用 `req.method`、`req.path` 和 `req.ip` 从请求对象中分别获取请求方法（http 动词）、路由相对路径和请求者的 ip 信息。 当你完成时，记得要调用 `next()`，否则服务器将一直处于挂起状态。 请确保“Logs”是打开的，观察一下当一些请求到达时会发生什么事情。

**注意：** Express 按照函数在代码中出现的顺序来执行， 中间件也是如此。 如果你想让中间件函数适用于所有路由，那么应该在路由之前配置好中间件。

```js
app.use((req, res, next) =>{
  var str = req.method + " " + req.path + " - " + req.ip;
  Console.log(str)
  // Call the next function in line:
  next();
});
```

# 通过链式调用中间件来创建时间服务

使用 `app.METHOD(path, middlewareFunction)` 可以在指定的路由挂载中间件， 也可以在路由定义中链式调用中间件。

请看以下示例：

```js
app.get('/user', function(req, res, next) {
  req.user = getTheUserSync();  // Hypothetical synchronous operation
  next();
}, function(req, res) {
  res.send(req.user);
});
```

此方法可用于将服务操作拆分为较小的单元， 这可以让应用拥有更好的结构，也便于在不同的位置上复用代码； 此方法还可用于对数据执行某些验证。 可以在每一个中间件堆栈中，阻止当前链的执行，并将控制权传递给专门设计用于处理错误的函数； 或者可以将控制权传递给下一个匹配的路由，以处理特殊情况。

在路由 `app.get('/now', ...)` 中链式调用中间件函数，并在最后处理。 在中间件函数中给请求对象中的 `req.time` 添加到当前时间， 可以使用 `new Date().toString()`， 在处理函数中，使用 `{time: req.time}` 结构的 JSON 对象来响应请求。

```js
app.get(
  "/now",
  (req, res, next) => {
    // adding a new property to req object
    // in the middleware function
    req.time = new Date().toString();
    next();
  },
  (req, res) => {
    // accessing the newly added property
    // in the main function
    res.send({time: req.time});
  }
);
```

# 从客户端获取输入的路由参数

在构建 API 时，要让用户告诉我们他们想从服务中获取什么。 举个例子，如果客户请求数据库中存储的用户信息，他们需要一种方法让我们知道他们对哪个用户感兴趣， 使用路由参数可以实现这个需求。 路由参数是由斜杠（/）分隔的 URL 命名段， 每一小段能捕获与其位置匹配的 URL 部分的值， 捕获的值能够在 `req.params` 对象中找到。

> 路由地址：`'/user/:userId/book/:bookId'`  
> 实际请求 `URL：'/user/546/book/6754'`  
> `req.params：{userId: '546', bookId: '6754'}`

在路由 `GET /:word/echo` 中构建一个响应服务， 响应一个采用 `{echo: word}` 结构的 JSON 对象。 可以在 `req.params.word` 中找到要重复的单词， 可以在浏览器的地址栏测试你的路由，访问一些匹配的路由，比如：`your-app-rootpath/freecodecamp/echo`。

```js
app.get("/:word/echo", (req, res) => {
  const { word } = req.params;
  res.json({
    echo: word
  });
});
```

# 从客户端获取输入的查询参数

从客户端获取输入的另一种常见方式是使用查询字符串对路由路径中的数据进行编码， 查询字符串使用标记（?）分隔，并且包含键值对 field=value， 每对键值使用连字号（&）分隔。 Express 能够从查询字符串中解析这些数据，并且把它放到 `req.query` 对象中。 有些字符（如百分号（%））不能在出现在 URL 中，它们在发送前必须以不同的格式进行编码。 如果使用 JavaScript 的 API，可以用特定的方法来编码/解码这些字符。

> 路由地址：`'/library'`  
> 实际请求 `URL：'/library?userId=546&bookId=6754'  `
> `req.query：{userId: '546', bookId: '6754'}`

构建一个 API 接口，使用路由挂载在 `GET /name` 上， 使用一个 JSON 文件来响应，它的结构是这样的：`{ name: 'firstname lastname'}`， 名字（first name）和姓氏（last name）参数应该编码在查询参数中，例如：`?first=firstname&last=lastname`。

```js
app.get("/name", (req, res) => {
  let firstName = req.query.first;
  let lastName = req.query.last;
  res.json({
    name: `${firstName} ${lastName}`
  });
});
```

# 从 POST 请求中获取数据

在路径 `/name` 挂载一个 POST 处理方法， 和前面一样， 我们已经在 html 首页准备了一份表单， 它将提交与练习 10 相同的数据（查询字符串）， 如果 body-parser 正确配置好了，那么就可以在 `req.body` 对象中找到请求的参数。 来看看一个常规的例子：

> 路由：`POST '/library'`  
> `URL编码的请求正文：userId=546&bookId=6754`  
> `req.body：{userId: '546', bookId: '6754'}`

响应和前面一样的 JSON 对象 `{name: 'firstname lastname'}`。 你可以使用首页应用提供的 html 表单，来测试你的 API 是否正常工作。

提示：除了 GET 和 POST，还有其他几种 http 方法。 按照惯例，http 动词和在服务端执行的某种操作之间有对应关系， 这种对应关系通常如下：

- POST（有时候是 PUT）- 使用请求发送信息，以创建新资源；

- GET - 读取不用修改的已存在的资源；

- PUT 或者 PATCH（有时候是 POST）- 发送数据，以更新资源；

- DELETE `=>` 删除一个资源。

还有其他两种方法常用于与服务进行交互。 除了 GET 之外，上面列出的所有方法都可以负载数据（即数据都能放到消息正文中）， 这些方法也可以使用 body-parser 中间件。

```js
app.post("/name", function(req, res) {
  // Handle the data in the request
  var string = req.body.first + " " + req.body.last;
  res.json({ name: string });
});
```
