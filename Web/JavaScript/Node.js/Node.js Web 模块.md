## 什么是 Web 服务器？

Web服务器一般指网站服务器，是指驻留于因特网上某种类型计算机的程序，Web服务器的基本功能就是提供Web信息浏览服务。它只需支持HTTP协议、HTML文档格式及URL，与客户端的网络浏览器配合。

大多数 web 服务器都支持服务端的脚本语言（php、python、ruby）等，并通过脚本语言从数据库获取数据，将结果返回给客户端浏览器。

目前最主流的三个Web服务器是Apache、Nginx、IIS。

## Web 应用架构

- **Client** - 客户端，一般指浏览器，浏览器可以通过 HTTP 协议向服务器请求数据。

- **Server** - 服务端，一般指 Web 服务器，可以接收客户端请求，并向客户端发送响应数据。

- **Business** - 业务层， 通过 Web 服务器处理应用程序，如与数据库交互，逻辑运算，调用外部程序等。

- **Data** - 数据层，一般由数据库组成。

## http

http模块提供了创建http服务端和客户端的能力，http提供的API是比较底层的，它只进行流处理和消息解析。

```js
var http = require('http');
```

### server

通过http模块创建一个服务端是非常简单的

```js
var http = require("http");
http
  .createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("<h1>Node.js</h1>");
    res.end("<p>Hello World</p>");
  })
  .listen(3000);
console.log("HTTP server is listening at port 3000.");
```

用 Node.js 实现的最简单的 HTTP 服务器就这样诞生了。这个程序调用了 Node.js 提供的 http 模块，对所有 HTTP 请求答复同样的内容并监听 3000 端口。在终端中运行这个脚本时，我们会发现它并不像 Hello World 一样结束后立即退出，而是一直等待，直到按下 `Ctrl + C` 才会结束。这是因为 listen 函数中创建了事件监听器，使得 Node.js 进程不会退出事件循环。

`createServer` 后面是一个回调函数，每次有新的请求到达就会触发该函数的调用，其中 `req` 是Node.js解析的请求对象，它是一个可读流，里面包含了请求头信息、请求体数据流等，`res` 是返回对象，它是一个可写流，可以用来设定返回状态码、响应头，也可以往返回流里面写入数据。

`createServer` 创建的服务端功能比较基础，我们需要自己去实现路由、body的解析等功能，所以在实际开发中我们通常会使用一些框架，它们封装了更强大的功能，开发起来更方便.  

详细版本

```js
var http = require('http');
var fs = require('fs');
var url = require('url');
 
 
// 创建服务器
http.createServer( function (request, response) {  
   // 解析请求，包括文件名
   var pathname = url.parse(request.url).pathname;
   
   // 输出请求的文件名
   console.log("Request for " + pathname + " received.");
   
   // 从文件系统中读取请求的文件内容
   fs.readFile(pathname.substr(1), function (err, data) {
      if (err) {
         console.log(err);
         // HTTP 状态码: 404 : NOT FOUND
         // Content Type: text/html
         response.writeHead(404, {'Content-Type': 'text/html'});
      }else{             
         // HTTP 状态码: 200 : OK
         // Content Type: text/html
         response.writeHead(200, {'Content-Type': 'text/html'});    
         
         // 响应文件内容
         response.write(data.toString());        
      }
      //  发送响应数据
      response.end();
   });   
}).listen(8080);
 
// 控制台会输出以下信息
console.log('Server running at http://127.0.0.1:8080/');
```

### client

同服务端一样，http提供的客户端功能也比较底层，这里我们推荐一个官方新推出的库 `undici`，[https://undici.nodejs.org/](https://undici.nodejs.org/)

```js
var http = require('http');
 
// 用于请求的选项
var options = {
   host: 'localhost',
   port: '8080',
   path: '/index.html'  
};
 
// 处理响应的回调函数
var callback = function(response){
   // 不断更新数据
   var body = '';
   response.on('data', function(data) {
      body += data;
   });
   
   response.on('end', function() {
      // 数据接收完成
      console.log(body);
   });
}
// 向服务端发送请求
var req = http.request(options, callback);
req.end();
```


