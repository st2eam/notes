### XMLHttpRequest 对象属性

<table>
  <tbody>
    <tr>
      <th>属性</th>
      <th>描述</th>
    </tr>
    <tr>
      <td><code>onreadystatechange</code></td>
      <td>定义当 readyState 属性发生变化时被调用的函数</td>
    </tr>
    <tr>
      <td><code>readyState</code></td>
      <td>
        <p>保存 XMLHttpRequest 的状态。</p>
        <ul>
          <li>0：请求未初始化</li>
          <li>1：服务器连接已建立</li>
          <li>2：请求已收到</li>
          <li>3：正在处理请求</li>
          <li>4：请求已完成且响应已就绪</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><code>responseText</code></td>
      <td>以字符串返回响应数据</td>
    </tr>
    <tr>
      <td><code>responseXML</code></td>
      <td>以 XML 数据返回响应数据</td>
    </tr>
    <tr>
      <td><code>status</code></td>
      <td>
        <p>返回请求的状态号</p>
        <ul>
          <li>200: "OK"</li>
          <li>403: "Forbidden"</li>
          <li>404: "Not Found"</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><code>statusText</code></td>
      <td>返回状态文本（比如 "OK" 或 "Not Found"）</td>
    </tr>
  </tbody>
</table>

### onreadystatechange 属性

通过 XMLHttpRequest 对象，您可以定义当请求接收到应答时所执行的函数。

这个函数是在 XMLHttpResponse 对象的 onreadystatechange 属性中定义的

每当 readyState 发生变化时就会调用 onreadystatechange 函数。

当 readyState 为 4，status 为 200 时，响应就绪：

```js
function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("demo").innerHTML =
            this.responseText;
       }
    };
    xhttp.open("GET", "ajax_info.txt", true);
    xhttp.send(); 
} 
```

### 使用回调函数

回调函数是一种作为参数被传递到另一个函数的函数。

如果您的网站中有多个 AJAX 任务，那么您应该创建一个执行 XMLHttpRequest 对象的函数，以及一个供每个 AJAX 任务的回调函数。

该函数应当包含 URL 以及当响应就绪时调用的函数。

```js
loadDoc("url-1", myFunction1);

loadDoc("url-2", myFunction2);
```

### responseXML 属性

XML HttpRequest 对象有一个內建的 XML 解析器。

ResponseXML 属性以 XML DOM 对象返回服务器响应。

使用此属性，您可以把响应解析为 XML DOM 对象：

```js
var xhttp, xmlDoc, txt, x, i;
xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    xmlDoc = this.responseXML;
    txt = "";
    x = xmlDoc.getElementsByTagName("ARTIST");
    for (i = 0; i < x.length; i++) {
      txt = txt + x[i].childNodes[0].nodeValue + "<br>";
    }
    document.getElementById("demo").innerHTML = txt;
  }
};
xhttp.open("GET", "/demo/music_list.xml", true);
xhttp.send();
```

### 获取JSON对象

```js
var url = "data/task.json";
var request = new XMLHttpRequest();
request.open("get", url);
request.send(null);
request.onload = function () {
if (request.status == 200) {
  var json = JSON.parse(request.responseText);
}
```

### getAllResponseHeaders() 方法

`getAllResponseHeaders()` 方法返回所有来自服务器响应的头部信息。

```html
<!DOCTYPE html>
<html>
<body>

<h1>XMLHttpRequest 对象</h1>

<p>getAllResponseHeaders() 函数返回资源的所有头信息，如长度，服务器类型，内容类型，最后修改等：</p>

<p id="demo"></p>

<script>
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    document.getElementById("demo").innerHTML =
    this.getAllResponseHeaders();
  }
};
xhttp.open("GET", "/demo/js/ajax_info.txt", true);
xhttp.send();
</script>

</body>
</html>
```

### getResponseHeader() 方法

`getResponseHeader()` 方法返回来自服务器响应的特定头部信息。

```js
this.getResponseHeader("Last-Modified");
```
