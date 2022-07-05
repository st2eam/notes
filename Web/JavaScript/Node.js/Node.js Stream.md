# Node.js Stream

Stream 是一个抽象接口，Node 中有很多对象实现了这个接口。例如，对http 服务器发起请求的request 对象就是一个 Stream，还有stdout（标准输出）。

Node.js，Stream 有四种流类型：

- **Readable** - 可读操作，比如文件读取流、HTTP请求流。

- **Writable** - 可写操作，比如文件写入流、HTTP返回流。

- **Duplex** - 可读可写操作.

- **Transform** - 操作被写入数据，然后读出结果。

所有的 Stream 对象都是 EventEmitter 的实例。常用的事件有：

- **data** - 当有数据可读时触发。

- **end** - 没有更多的数据可读时触发。

- **error** - 在接收和写入过程中发生错误时触发。

- **finish** - 所有数据已被写入到底层系统时触发。

Node.js中有很多流对象，最常见的比如文件读写流，HTTP请求、响应流等等，stream是Node.js中IO的精髓，通常用来处理大规模的流式数据。

让我们来看这样一个场景，假如我们通过Node.js创建了一个HTTP服务，用户可以通过这个服务下载服务器上的文件，你可能会使用前面讲到的 `fs.readFile` 来读取整个文件，然后将数据写入到HTTP返回流中。对于一些小文件这样做可能没有太大的问题，但是如果用户要下载的是一个超大的文件，这就会带来一些严重问题：

- 直接读取整个文件会占用很多内存
- 如果用户的带宽很小，被写入到HTTP返回流中的数据需要很长时间才能被读取完，没有被读取的数据会一直缓冲在服务器内存中
- 如果很多用户同时来下载，服务器内存很快就会被耗尽

如果使用stream则会是这样的流程：

- 创建一个文件读取流，开辟一块固定的内存缓冲区（比如64KB），读取文件内容填充缓冲区，等待数据被消费
- 将缓冲区的数据写入HTTP返回流，缓冲区的数据被读取完毕之后，继续读取文件数据填充缓冲区
- 重复前面的流程直到文件传输完毕

这样一来我们就不需要担心内存耗尽的问题了，因为stream只会占用缓冲区的内存大小。

## 从流中读取数据

创建 一个index.html 文件，内容如下：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
  </body>
</html>
```

创建 main.js 文件, 代码如下：

```js
var fs = require("fs");
var data = "";

// 创建可读流
var readerStream = fs.createReadStream("index.html");

// 设置编码为 utf8。
readerStream.setEncoding("UTF8");

// 处理流事件 --> data, end, and error
readerStream.on("data", function (chunk) {
  //chunk一次读完文件所有内容
  data += chunk;
});

readerStream.on("end", function () {
  console.log(data);
});

readerStream.on("error", function (err) {
  console.log(err.stack);
});

console.log("程序执行完毕");
```

以上代码执行结果如下：

```html
程序执行完毕
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
  </body>
</html>
```

## 写入流

创建 main.js 文件, 代码如下：

```js
var fs = require("fs");
var data = "abcdefghijklmnopqrstuvwxyz";

// 创建一个可以写入的流，写入到文件 output.txt 中
var writerStream = fs.createWriteStream("output.txt");

// 使用 utf8 编码写入数据
writerStream.write(data, "UTF8");

// 标记文件末尾
writerStream.end();

// 处理流事件 --> finish、error
writerStream.on("finish", function () {
  console.log("写入完成。");
});

writerStream.on("error", function (err) {
  console.log(err.stack);
});

console.log("程序执行完毕");
```

以上程序会将 data 变量的数据写入到 output.txt文件中。

## 管道流

管道提供了一个输出流到输入流的机制。通常我们用于从一个流中获取数据并将数据传递到另外一个流中。

```js
var fs = require("fs");

// 创建一个可读流
var readerStream = fs.createReadStream('input.txt');

// 创建一个可写流
var writerStream = fs.createWriteStream('output.txt');

// 管道读写操作
// 读取 input.txt 文件内容，并将内容写入到 output.txt 文件中
readerStream.pipe(writerStream);

console.log("程序执行完毕");
```

## 链式流

链式是通过连接输出流到另外一个流并创建多个流操作链的机制。链式流一般用于管道操作。

接下来我们就是用管道和链式来压缩和解压文件。

创建 compress.js 文件, 代码如下：

```js
var fs = require("fs");
var zlib = require('zlib');

// 压缩 input.txt 文件为 input.txt.gz
fs.createReadStream('input.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('input.txt.gz'));

console.log("文件压缩完成。");
```

接下来，让我们来解压该文件，创建 decompress.js 文件，代码如下：

```js
var fs = require("fs");
var zlib = require('zlib');

// 解压 input.txt.gz 文件为 input.txt
fs.createReadStream('input.txt.gz')
  .pipe(zlib.createGunzip())
  .pipe(fs.createWriteStream('input.txt'));

console.log("文件解压完成。");
```
