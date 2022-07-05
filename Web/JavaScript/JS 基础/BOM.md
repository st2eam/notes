# 浏览器对象模型(BOM)

## Window

所有浏览器都支持 `window` 对象。它代表浏览器的窗口。

### 窗口尺寸

后两行是对于Internet Explorer 8, 7, 6, 5

```js
var w = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

var h = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight; 
```

### 其他窗口方法

- window.open() - 打开新窗口
- window.close() - 关闭当前窗口
- window.moveTo() -移动当前窗口
- window.resizeTo() -重新调整当前窗口

## Window Screen

`window.screen` 对象包含用户屏幕的信息。

- screen.width - 宽度
- screen.height - 高度
- screen.availWidth - 可用宽度
- screen.availHeight - 可用高度
- screen.colorDepth - 色深
- screen.pixelDepth - 像素深度

`screen.availHeight` 属性返回访问者屏幕的高度，以像素计，减去诸如窗口工具条之类的界面特征

`screen.colorDepth` 属性返回用于显示一种颜色的比特数。

`screen.pixelDepth` 属性返回屏幕的像素深度。

对于现代计算机，颜色深度和像素深度是相等的。

## Location

- window.location.href - 返回当前页面的 href (URL)
- window.location.hostname - 返回 web 主机的域名
- window.location.pathname - 返回当前页面的路径或文件名
- window.location.protocol - 返回使用的 web 协议（http: 或 https:）
- window.location.assign - 加载新文档

## History

- history.back() - 等同于在浏览器点击后退按钮
- history.forward() - 等同于在浏览器中点击前进按钮

## Navigator

- navigator.cookieEnabled - cookie 是否启用
- navigator.appName - 属性返回浏览器的应用程序名称
- navigator.appCodeName - 属性返回浏览器的应用程序代码名称
- navigator.product - 属性返回浏览器引擎的产品名称
- navigator.appVersion - 属性返回有关浏览器的版本信息
- navigator.userAgent - 属性返回由浏览器发送到服务器的用户代理报头（user-agent header）
- navigator.platform - 属性返回浏览器平台（操作系统）
- navigator.language - 属性返回浏览器语言
- navigator.onLine - 属性返回 bool，
- navigator.javaEnabled() - 方法返回 bool

## JavaScript 弹出框

```js
alert("我是一个警告框！");

confirm("sometext");//返回bool

prompt("sometext","defaultText");//返回输入的值
```

## Cookies

### 设置 cookie 的函数

```js
function setCookie(cookiename, cookievalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cookiename + "=" + cookievalue + ";" + expires + ";path=/";
} 
```

### 获取 cookie 值的函数

```js
function getCookie(cookiename) {
    var name = cookiename + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
         }
         if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
         }
     }
    return "";
} 
```

- 把 cookie 作为参数（cookiename）。

- 创建变量（name）与要搜索的文本（cookiename”=”）。

- 解码 cookie 字符串，处理带有特殊字符的 cookie，例如 “$”。

- 用分号把 document.cookie 拆分到名为 ca（decodedCookie.split(';')）的数组中。

- 遍历 ca 数组（i = 0; i < ca.length; i++），然后读出每个值 c = ca[i]。

- 如果找到 cookie（c.indexOf(name) == 0），则返回该 cookie 的值（c.substring(name.length, c.length）。

- 如果未找到 cookie，则返回 ""。

### 检查 cookie 值的函数

```js
function checkCookie() {
    var username = getCookie("username");
    if (username != "") {
        alert("Welcome again " + username);
    } else {
        username = prompt("Please enter your name:", "");
        if (username != "" && username != null) {
            setCookie("username", username, 365);
        }
    }
} 
```

### 删除cookie

删除 cookie 非常简单。

删除 cookie 时不必指定 cookie 值：

直接把 expires 参数设置为过去的日期即可

```js
function deleteCookie(cookiename){
    document.cookie = cookiename+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
```
