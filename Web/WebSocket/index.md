# WebSocket

WebSocket 是 HTML5 开始提供的一种在单个 TCP 连接上进行全双工通讯的协议。

WebSocket 使得客户端和服务器之间的数据交换变得更加简单，允许服务端主动向客户端推送数据。在 WebSocket API 中，浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接，并进行双向数据传输。

在 WebSocket API 中，浏览器和服务器只需要做一个握手的动作，然后，浏览器和服务器之间就形成了一条快速通道。两者之间就直接可以数据互相传送。

相比于传统的轮询方式，HTML5 定义的 WebSocket 协议，能更好的节省服务器资源和带宽，并且能够更实时地进行通讯。

![https://www.runoob.com/wp-content/uploads/2016/03/ws.png](https://www.runoob.com/wp-content/uploads/2016/03/ws.png)

浏览器通过 JavaScript 向服务器发出建立 WebSocket 连接的请求，连接建立以后，客户端和服务器端就可以通过 TCP 连接直接交换数据。

当你获取 Web Socket 连接后，你可以通过 send() 方法来向服务器发送数据，并通过 onmessage 事件来接收服务器返回的数据。

## 特点

它的最大特点就是，服务器可以主动向客户端推送信息，客户端也可以主动向服务器发送信息，是真正的双向平等对话，属于服务器推送技术的一种。

其他特点包括：

1. 建立在 TCP 协议之上，服务器端的实现比较容易。

2. 与 HTTP 协议有着良好的兼容性。默认端口也是80和443，并且握手阶段采用 HTTP 协议，因此不容易屏蔽，能通过各种 HTTP 代理服务器。

3. 数据格式比较轻量，性能开销小，通信高效。

4. 可以发送文本，也可以发送二进制数据。

5. 没有同源限制，客户端可以与任意服务器通信。

6. 协议标识符是ws（如果加密，则为wss），服务器网址就是 URL。

## 构造函数

```js
const ws = new WebSocket('ws://localhost:8080');
```

执行上面语句之后，客户端就会与服务器进行连接。

## 常量

| **Constant**           | **Value** |
| :--------------------- | :-------- |
| `WebSocket.CONNECTING` | `0`       |
| `WebSocket.OPEN`       | `1`       |
| `WebSocket.CLOSING`    | `2`       |
| `WebSocket.CLOSED`     | `3`       |

## 方法

### webSocket.onopen

实例对象的`onopen`属性，用于指定连接成功后的回调函数。

```js
ws.onopen = function () {
  ws.send('Hello Server!');
}
```

如果要指定多个回调函数，可以使用addEventListener`方法。

```js
ws.addEventListener('open', function (event) {
  ws.send('Hello Server!');
});
```

### webSocket.onclose

实例对象的`onclose`属性，用于指定连接关闭后的回调函数。

```js
ws.onclose = function(event) {
  var code = event.code;
  var reason = event.reason;
  var wasClean = event.wasClean;
  // handle close event
};

ws.addEventListener("close", function(event) {
  var code = event.code;
  var reason = event.reason;
  var wasClean = event.wasClean;
  // handle close event
});
```

### webSocket.onmessage

实例对象的`onmessage`属性，用于指定收到服务器数据后的回调函数。

```js
ws.onmessage = function(event) {
  var data = event.data;
  // 处理数据
};

ws.addEventListener("message", function(event) {
  var data = event.data;
  // 处理数据
});
```

注意，服务器数据可能是文本，也可能是二进制数据（`blob`对象或`Arraybuffer`对象）。

```js
ws.onmessage = function(event){
  if(typeOf event.data === String) {
    console.log("Received data string");
  }
   
  if(event.data instanceof ArrayBuffer){
    var buffer = event.data;
    console.log("Received arraybuffer");
  }
}
```

除了动态判断收到的数据类型，也可以使用`binaryType`属性，显式指定收到的二进制数据类型。

```js
// 收到的是 blob 数据
ws.binaryType = "blob";
ws.onmessage = function(e) {
  console.log(e.data.size);
};

// 收到的是 ArrayBuffer 数据
ws.binaryType = "arraybuffer";
ws.onmessage = function(e) {
  console.log(e.data.byteLength);
};
```

### webSocket.send()

实例对象的`send()`方法用于向服务器发送数据。

发送文本的例子。

```js
ws.send('your message');
```

发送 Blob 对象的例子。

```js
var file = document
  .querySelector('input[type="file"]')
  .files[0];
ws.send(file);
```

发送 ArrayBuffer 对象的例子。

```js
// Sending canvas ImageData as ArrayBuffer
var img = canvas_context.getImageData(0, 0, 400, 320);
var binary = new Uint8Array(img.data.length);
for (var i = 0; i < img.data.length; i++) {
  binary[i] = img.data[i];
}
ws.send(binary.buffer);
```

### webSocket.bufferedAmount

实例对象的`bufferedAmount`属性，表示还有多少字节的二进制数据没有发送出去。它可以用来判断发送是否结束。

```js
var data = new ArrayBuffer(10000000);
socket.send(data);

if (socket.bufferedAmount === 0) {
  // 发送完毕
} else {
  // 发送还没结束
}
```

### webSocket.onerror

实例对象的`onerror`属性，用于指定报错时的回调函数。

```js
socket.onerror = function(event) {
  // handle error event
};

socket.addEventListener("error", function(event) {
  // handle error event
});
```
