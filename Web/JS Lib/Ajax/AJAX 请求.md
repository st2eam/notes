## XMLHttpRequest 对象方法

<table>
  <tbody>
    <tr>
      <th>方法</th>
      <th>描述</th>
    </tr>
    <tr>
      <td><code>new XMLHttpRequest()</code></td>
      <td>创建新的 XMLHttpRequest 对象</td>
    </tr>
    <tr>
      <td><code>abort()</code></td>
      <td>取消当前请求</td>
    </tr>
    <tr>
      <td><code>getAllResponseHeaders()</code></td>
      <td>返回头部信息</td>
    </tr>
    <tr>
      <td><code>getResponseHeader()</code></td>
      <td>返回特定的头部信息</td>
    </tr>
    <tr>
      <td><code>open(<i>method</i>, <i>url</i>, <i>async</i>, <i>user</i>, <i>psw</i>)</code></td>
      <td>
        <p>规定请求</p>
        <ul>
          <li>method：请求类型 GET 或 POST</li>
          <li>url：文件位置</li>
          <li>async：true（异步）或 false（同步）</li>
          <li>user：可选的用户名称</li>
          <li>psw：可选的密码</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><code>send()</code></td>
      <td>将请求发送到服务器，用于 GET 请求</td>
    </tr>
    <tr>
      <td><code>send(<i>string</i>)</code></td>
      <td>将请求发送到服务器，用于 POST 请求</td>
    </tr>
    <tr>
      <td><code>setRequestHeader()</code></td>
      <td>向要发送的报头添加标签 / 值对</td>
    </tr>
  </tbody>
</table>
### 向服务器发送请求
如需向服务器发送请求，我们使用 `XMLHttpRequest` 对象的 `open()` 和 `send()` 方法：

```js
//GET：
xhttp.open("GET", "ajax_info.txt", true);
xhttp.send();
```

### GET 还是 POST？

GET 比 POST 更简单更快，可用于大多数情况下。

不过，请在以下情况始终使用 POST：

缓存文件不是选项（更新服务器上的文件或数据库）
向服务器发送大量数据（POST 无大小限制）
发送用户输入（可包含未知字符），POST 比 GET 更强大更安全

#### GET 请求

在上面的例子中，您可能会获得一个缓存的结果。为了避免此情况，请向 URL 添加一个唯一的 ID：

```js
xhttp.open("GET", "demo_get.asp?t=" + Math.random(), true);
xhttp.send();
```

如果您需要用 GET 方法来发送信息，请向 URL 添加这些信息：

```js
xhttp.open("GET", "demo_get2.asp?fname=Bill&lname=Gates", true);
xhttp.send();
```

#### POST请求

```js
xhttp.open("POST", "demo_post.asp", true);
xhttp.send();
```

如需像 HTML 表单那样 POST 数据，请通过 setRequestHeader() 添加一个 HTTP 头部。请在 send() 方法中规定您需要发送的数据：

```js
xhttp.open("POST", "ajax_test.asp", true);
xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xhttp.send("fname=Bill&lname=Gates");
```

### url - 服务器上的文件

open() 方法的 url 参数，是服务器上文件的地址：

```js
xhttp.open("GET", "ajax_test.asp", true);
```

该文件可以是任何类型的文件，如 .txt 和 .xml，或服务器脚本文件，如 .asp 和 .php（它们可以在发送回响应之前在服务器执行操作）。

### async - ture 还是 false？

发送异步请求对 web 开发人员来说是一个巨大的进步。服务器上执行的许多任务都非常耗时。在 AJAX 之前，此操作可能会导致应用程序挂起或停止。

通过异步发送，JavaScript 不必等待服务器响应，而是可以：

- 在等待服务器响应时执行其他脚本
- 当响应就绪时处理响应

### 同步请求

如需执行同步的请求,请把async设置为false.

有时 async = false 用于快速测试。你也会在更老的 JavaScript 代码中看到同步请求。

由于代码将等待服务器完成，所以不需要 onreadystatechange 函数

```js
xhttp.open("GET", "ajax_info.txt", false);
xhttp.send();
document.getElementById("demo").innerHTML = xhttp.responseText;
```

### 拦截请求

```js
    const originOpen = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function (_, url) {
        if (url === "https://ynuf.aliapp.org/service/um.json") {
            this.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    const res = {"result":{"code":100,"msg":"success","success":true},"success":true};
                    // 当前 xhr 对象上定义 responseText
                    Object.defineProperty(this, "responseText", {
                        writable: true,
                    });
                    this.responseText = res;
                }
            });
        }
        originOpen.apply(this, arguments);
    };
```