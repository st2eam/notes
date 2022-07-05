# Node.js EventEmitter

Node.js 所有的异步 I/O 操作在完成时都会发送一个事件到事件队列。  

Node.js 里面的许多对象都会分发事件：一个 net.Server 对象会在每次有新连接时触发一个事件， 一个 `fs.readStream` 对象会在文件被打开的时候触发一个事件。 所有这些产生事件的对象都是 `events.EventEmitter` 的实例。

## EventEmitter 类

events 模块只提供了一个对象： `events.EventEmitter`。`EventEmitter `的核心就是事件触发与事件监听器功能的封装。

你可以通过`require("events");`来访问该模块

```js
// 引入 events 模块
var events = require('events');
// 创建 eventEmitter 对象
var eventEmitter = new events.EventEmitter();
```

### 方法

#### addListener(event, listener)

为指定事件添加一个监听器到监听器数组的尾部。

#### on(event, listener)

为指定事件注册一个监听器，接受一个字符串 event 和一个回调函数。

```js
server.on('connection', function (stream) {
  console.log('someone connected!');
});
```

#### once(event, listener)

为指定事件注册一个单次监听器，即 监听器最多只会触发一次，触发后立刻解除该监听器。

```js
server.once('connection', function (stream) {
 console.log('Ah, we have our first user!');
});
```

#### removeListener(event, listener)

移除指定事件的某个监听器，监听器必须是该事件已经注册过的监听器。

它接受两个参数，第一个是事件名称，第二个是回调函数名称。

```js
var callback = function(stream) {
 console.log('someone connected!');
};
server.on('connection', callback);
// ...
server.removeListener('connection', callback);
```

#### removeAllListeners([event])

移除所有事件的所有监听器， 如果指定事件，则移除指定事件的所有监听器。

#### setMaxListeners(n)

默认情况下， EventEmitters 如果你添加的监听器超过 10 个就会输出警告信息。 setMaxListeners 函数用于改变监听器的默认限制的数量。

#### listeners(event)

返回指定事件的监听器数组。

#### emit(event, [arg1], [arg2], [...])

发送信号，按监听器的顺序执行执行每个监听器，如果事件有注册监听返回 true，否则返回 false。

### 类方法

#### listenerCount(emitter, event)

返回指定事件的监听器数量。

### 事件

#### newListener

- **event** - 字符串，事件名称

- **listener** - 处理事件函数

该事件在添加新监听器时被触发。

#### removeListener

- **event** - 字符串，事件名称

- **listener** - 处理事件函数

从指定监听器数组中删除一个监听器。需要注意的是，此操作将会改变处于被删监听器之后的那些监听器的索引。
