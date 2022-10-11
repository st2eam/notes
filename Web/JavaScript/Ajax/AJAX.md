## 什么是 AJAX？

AJAX = Asynchronous JavaScript And XML.

AJAX 仅仅组合了：

- 浏览器内建的 XMLHttpRequest 对象（从 web 服务器请求数据）
- JavaScript 和 HTML DOM（显示或使用数据）

### AJAX如何工作

- 网页中发生一个事件（页面加载、按钮点击）
- 由 JavaScript 创建 XMLHttpRequest 对象
- XMLHttpRequest 对象向 web 服务器发送请求
- 服务器处理该请求
- 服务器将响应发送回网页
- 由 JavaScript 读取响应
- 由 JavaScript 执行正确的动作（比如更新页面）

### Ajax 的核心是 XMLHttpRequest 对象

`XMLHttpRequest` 对象用于同幕后服务器交换数据。这意味着可以更新网页的部分，而不需要重新加载整个页面。

```js
variable = new XMLHttpRequest();
```

老版本的 Internet Explorer（IE5 和 IE6）使用 ActiveX 对象：

```js
variable = new ActiveXObject("Microsoft.XMLHTTP");
```

用下面这个

```js
var xhttp;
if (window.XMLHttpRequest) {
    xhttp = new XMLHttpRequest();
    } else {
    // code for IE6, IE5
     xhttp = new ActiveXObject("Microsoft.XMLHTTP");
}
```

### 跨域访问

出于安全原因，现代浏览器不允许跨域访问。

这意味着尝试加载的网页和 XML 文件都必须位于相同服务器上。

如果您希望在自己的页面上使用你的文件，那么您所加载的 XML 文件必须位于您自己的服务器上。
