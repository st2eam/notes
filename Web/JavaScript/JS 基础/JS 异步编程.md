## 异步编程

异步编程模型是JavaScript的精髓，分我们来简单了解一下它的基本原理。[V2.0](#异步编程)  [V1.0](#v1)

## 事件循环

[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/EventLoop](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/EventLoop)

JavaScript有一个基于**事件循环**的并发模型，事件循环负责执行代码、收集和处理事件以及执行队列中的子任务，这个模型与其他一些常见语言中的模型截然不同，比如C或者Java。

一个JavaScript运行时包含了一个待处理消息的消息队列，每一个消息都关联着一个用以处理这个消息的回调函数。从事件循环期间的某个时刻，运行时会从最先进入队列的消息开始处理队列中的消息，被处理的消息会被移除队列，并作为输入参数来调用之前关联的回调函数。函数的处理会一直进行到栈再次为空为止，然后事件循环将会处理队列中的下一个消息。

之所以被称为**事件循环**，是因为它经常按照类似如下的方式来实现：

```js
while (queue.waitForMessage()) {
  queue.processNextMessage()
}
```

`queue.waitForMessage()` 会同步地等待消息到达（如果当前没有任何消息等待被处理）

每一个消息完整地执行后，其他消息才会被执行，这为程序的分析提供了一些优秀的特性，例如当一个函数被执行时，它不会被抢占，只有在运行完毕之后才会去运行其他代码，才能修改这个函数操作的数据。这个模型的另一个缺点在于当一个消息需要太长时间处理完毕时，js就无法处理其他任务比如浏览器用户的交互，此时浏览器一般会弹出“脚本运行时间过长”的对话框，一个良好的编程习惯是缩短单个消息的处理时间。

从上面的描述我们可以得知，JavaScript中的调用会被推入消息队列等待事件循环来处理，`setTimeout` 可以让我们实现延迟的效果，它接受两个参数，待加入队列的消息和一个时间值，这个时间代表了消息被实际加入到队列的最小延迟时间。如果队列中没有其他消息并且栈为空，在这段延迟事件过去之后，消息会被马上处理，但是，如果有其他消息，`setTimeout` 消息必须等待其他消息处理完，因此第二个参数仅仅表示最小的延迟时间，而并非准确的等待时间，看下面的例子：

```js
let start = Date.now()
console.log('start')

setTimeout(() => {
  console.log(Date.now() - start)
}, 500)

while(true) {
  if (Date.now() - start >= 2000) {
    console.log('looped for 2 seconds')
    break
  }
}
```

通过下面的例子来体验 `setTimeout` 的执行机制

```js
console.log('1.这是开始')

setTimeout(() => {
  console.log('2.这是来自第一个回调的消息');
})

console.log('3.这是一条消息')

setTimeout(() => {
  console.log('4.这是来自第二个回调的消息')
}, 0)

console.log('5.这是结束')
```

JavaScript的事件循环模型与许多其他语言不同的一个非常有趣的特性是，它永不阻塞。处理 I/O 通常通过事件和回调来执行，所以当一个应用正等待一个数据库查询返回或者一个网络请求返回时，它仍然可以处理其它事情，比如用户输入。这种特点也带来一些麻烦，那就是正常的代码执行顺序被打乱，如果后续的代码需要依赖异步请求的结果，那只能将逻辑放到回调函数中，如果有多层依赖，那么就会出现回调嵌套，造成回调地狱，类似下面的代码，我们伪造一个用来异步计算面积的方法：

```js
console.log(1)
asyncArea(data_1, result_1 => {
  console.log(2)
  asyncArea(result_1, result_2 => {
    console.log(3)
    asyncArea(result_2, result_3 => {
      console.log(4)
      console.log(result_3)
    })
  })
})
console.log(5)
```

### Promise

`Promise` 就是用来解决异步回调问题而出现的解决方案。它代表了一个异步操作的最终完成或者失败，本质上 `Promise` 是一个函数返回的对象，我们可以在它上面绑定回调函数，这样我们就不需要在一开始把回调函数作为参数传入这个函数了。它让你能够把异步操作最终的成功返回值或者失败原因和相应的处理程序关联起来。 这样使得异步方法可以像同步方法那样返回值：异步方法并不会立即返回最终的值，而是会返回一个 promise，以便在未来某个时候把值交给使用者。

一个 `Promise` 必然处于以下几种状态之一：

- 待定（pending）: 初始状态，既没有被兑现，也没有被拒绝。
- 已兑现（fulfilled）: 意味着操作成功完成。
- 已拒绝（rejected）: 意味着操作失败。

下面我们用 `Promise` 和 `setTimeout` 来封装之前演示用的异步请求面积的方法

```js
function asyncArea(length) {
  return new Promise((resolve, reject) => {
    // 模拟异步请求
    setTimeout(() => {
      if (length > 0) resolve(length * length)
      else reject(new Error(`invalid length: ${length}`))
    }, 500)
  })
}
```

上面这个方法接受一个数字类型的参数 `length`，通过 `setTimeout` 来模拟异步请求，500ms后，如果 `length`大于等于0，则 `resolve` 返回 `length` 的平方，否则 `reject` 返回错误信息，通过下面的例子我们来看一下具体的调用方法。

```js
// 正常调用
asyncArea(1).then(result => {
  console.log(result)
}).catch(error => {
  console.trace(error)
})
// 触发异常
asyncArea(-1).then(result => {
  console.log(result)
}).catch(error => {
  console.trace(error)
})
// 链式调用
let start = Date.now()
asyncArea(1)
  // 返回了一个新的Promise，可以在下一个then中获取，result === 1
  .then(result => asyncArea(result + 1))
  // result === 4
  .then(result => asyncArea(result + 1))
  .then(result => {
    // 前一个then返回的新Promise，result === 25
    console.log(result)
    // 耗时是三个请求的累加
    console.log(`cost ${Date.now() - start}ms`)
  })
```

通过上面的例子我们可以看到，前面回调嵌套的问题，通过 `Promise` 的链式调用写法得到很大的缓解。
上面的链式调用适用于需要串行计算的场景，下一步的请求需要依赖上一步的结果，总的耗时是每个请求的累加。有时候我们的多个异步请求是没有相互依赖的，此时如果串行计算的话会增加无谓的耗时，`Promise` 有一个 `all` 方法，可以批量并行执行异步请求，等所有的请求都结束后再统一返回，可以简单认为总的耗时时间是所有请求中耗时最大的那一个。

```js
let start = Date.now()
Promise.all([
  asyncArea(1),
  asyncArea(2),
  asyncArea(3),
  asyncArea(4),
  asyncArea(5)
]).then(result => {
  console.log(result)
  console.log(`cost ${Date.now() - start}ms`)
})
```

### async/await

`Promise` 通过 `then` 来进行异步请求虽然改善了回调的问题，但还是不够优雅，好在现在我们可以通过 `async/await` 语法，使用串行的语法进行异步调用，下面我们来改写一下上面的例子：

```js
async function test_1() {
  let start = Date.now()
  let result_1 = await asyncArea(1)
  let result_2 = await asyncArea(result_1 + 1)
  let result_3 = await asyncArea(result_2 + 1)
  console.log('test_1', result_3)
  console.log(`cost ${Date.now() - start}ms`)
}

test_1()

async function test_2() {
  let start = Date.now()
  let result = await Promise.all([
    asyncArea(1),
    asyncArea(2),
    asyncArea(3),
    asyncArea(4),
    asyncArea(5)
  ])
  console.log('test_2', result)
  console.log(`cost ${Date.now() - start}ms`)
}

test_2()
```

使用 `async/await` 改写之后，我们的异步请求更加优雅，变得更接近符合我们习惯的串行代码，它有以下特点需要注意。

- `await` 只能出现在 `async` 修饰的函数中，普通函数中无效
- `async` 函数隐式返回一个 `Promise` 对象，最后 `return` 的返回值，相当于 `Promise` 中 `resolve` 的值，所以可以认为 `async` 函数是 `Promise` 的语法糖
- `await` 后面的函数请求需要返回 `Promise`，因为 `async` 返回的也是 `Promise`，所以也可以 `await` 一个 `async` 函数
- `await` 需要等待后面的 `Promise` 返回结果（`resolve`）之后，才会继续执行后面的代码
- `async` 会将一个普通函数变成异步函数，类似 `setTimeout` 的效果，下面我们来对比一下差异

```js
async function test() {
  let result = await Promise.all([
    asyncArea(1),
    asyncArea(2),
    asyncArea(3),
    asyncArea(4),
    asyncArea(5)
  ])
  return result
}

async function run() {
  console.log(1)
  // async函数返回的是一个Promise，可以直接用then来获取结果
  test().then(result => console.log(2, result))
  console.log(3)
  // await后面可以跟一个async函数
  let result = await test()
  console.log(4)
}

run()
```

### async异常捕获

我们推荐在异步请求中尽可能都使用 `async/await`，`await` 等待的 `Promise` 如果 `reject` 了一个错误的话，可以被 `try/catch` 捕获到，看下面的例子：

```js
async function run() {
  try {
    // await异步请求抛出错误，会被catch住
    let result = await asyncArea(-1)
    console.log(result)
  } catch (error) {
    console.log(error.message)
  }
  try {
    // 没有await的异步请求，异常无法被catch
    asyncArea(-1)
  } catch (error) {
    console.log(error.message)
  }
  try {
    // 没有await的异步请求，通过Promise的catch也可以捕获异常，不会继续抛出
    asyncArea(-1).catch(error => {
      console.log(1, error.message)
    })
  } catch (error) {
    console.log(2, error.message)
  }
}

run()
```

## v1

## JavaScript回调

回调是作为参数传递给另一个函数的函数。

使用回调，您可以通过回调调用计算器函数（myCalculator），并在计算完成后让计算器函数运行回调：

实例

```js
function myDisplayer(some) {
  console.log(some);
}

function myCalculator(num1, num2, myCallback) {
  let sum = num1 + num2;
  myCallback(sum);
}

myCalculator(5, 5, myDisplayer);
```

回调真正闪光之处是异步函数，其中一个函数必须等待另一个函数（例如等待文件加载）。

### 等待超时

在使用 JavaScript 函数 setTimeout() 时，可以指定超时时执行的回调函数：

实例

```js
setTimeout(myFunction, 3000);

function myFunction() {
  document.getElementById("demo").innerHTML = "I love You !!";
}
```

### 等待间隔

在使用 JavaScript 函数 `setInterval()` 时，可以指定每个间隔执行的回调函数

```js
setInterval(myFunction, 1000);

function myFunction() {
  let d = new Date();
  document.getElementById("demo").innerHTML=
  d.getHours() + ":" +
  d.getMinutes() + ":" +
  d.getSeconds();
}
```

## JS Promise

- "Producing code（生产代码）" 是需要一些时间的代码

- "Consuming code（消费代码）" 是必须等待结果的代码

- Promise 是一个 JavaScript 对象，它链接生成代码和消费代码

### Promise 语法

```js
let myPromise = new Promise(function(myResolve, myReject) {
// "Producing Code"（可能需要一些时间）

  myResolve(); // 成功时
  myReject();  // 出错时
});

// "Consuming Code" （必须等待一个兑现的承诺）
myPromise.then(
  function(value) { /* 成功时的代码 */ },
  function(error) { /* 出错时的代码 */ }
);
```

### Promise 对象属性

JavaScript Promise 对象可以是：

- Pending
- Fulfilled
- Rejected

Promise 对象支持两个属性：state 和 result。

- 当 Promise 对象 "pending"（工作）时，结果是 undefined。

- 当 Promise 对象 "fulfilled(工作完成)" 时，结果是一个值。

- 当 Promise 对象是 "rejected" 时，结果是一个错误对象。

`Promise` 有一个 `all` 方法，可以批量并行执行异步请求，等所有的请求都结束后再统一返回，可以简单认为总的耗时时间是所有请求中耗时最大的那一个。

```js
let start = Date.now()
Promise.all([
  asyncArea(1),
  asyncArea(2),
  asyncArea(3),
  asyncArea(4),
  asyncArea(5)
]).then(result => {
  console.log(result)
  console.log(`cost ${Date.now() - start}ms`)
})
```

等待超时

```js
let myPromise = new Promise(function(myResolve, myReject) {
  setTimeout(function() { myResolve("I love You !!"); }, 3000);
});

myPromise.then(function(value) {
  document.getElementById("demo").innerHTML = value;
});
```

等待文件

```js
let myPromise = new Promise(function(myResolve, myReject) {
  let req = new XMLHttpRequest();
  req.open('GET', "demo.html");
  req.onload = function() {
    if (req.status == 200) {
      myResolve(req.response);
    } else {
      myReject("File not Found");
    }
  };
  req.send();
});

myPromise.then(
  function(value) {myDisplayer(value);},
  function(error) {myDisplayer(error);}
);
```

### Async 语法

函数前的关键字 async 使函数返回 promise

```js
async function myFunction() {
  return "Hello";
}
```

等同于

```js
async function myFunction() {
  return Promise.resolve("Hello");
}
```

实例

```js
async function myFunction() {
  return "Hello";
}
myFunction().then(
  function(value) {myDisplayer(value);},
  function(error) {myDisplayer(error);}
);
```

### Await 语法

函数前的关键字 `await` 使函数等待 `promise`：

```js
let value = await promise;
```

`await` 关键字只能在 `async` 函数中使用。

基础语法

```js
async function myDisplay() {
  let myPromise = new Promise(function (myResolve, myReject) {
    myResolve("I love You !!");
  });
  console.log(await myPromise);
}

myDisplay();
```

等待超时

```js
async function myDisplay() {
  let myPromise = new Promise(function(myResolve, myReject) {
    setTimeout(function() { myResolve("I love You !!"); }, 3000);
  });
  document.getElementById("demo").innerHTML = await myPromise;
}
```

等待文件

```js
async function getFile() {
  let myPromise = new Promise(function(myResolve, myReject) {
    let req = new XMLHttpRequest();
    req.open('GET', "mycar.html");
    req.onload = function() {
      if (req.status == 200) {myResolve(req.response);}
      else {myResolve("File not Found");}
    };
    req.send();
  });
  document.getElementById("demo").innerHTML = await myPromise;
}
```
