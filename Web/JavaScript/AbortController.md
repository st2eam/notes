# AbortController

AbortController 接口表示一个控制器对象，允许你根据需要中止一个或多个 Web 请求。

## 构造函数

```js
new AbortController()
```

创建一个新的 AbortController 对象实例。

## 属性
`AbortController.signal` 只读

返回一个 AbortSignal 对象实例，可以用它与一个 DOM 请求进行通信或者中止该请求。

## 方法

`AbortController.abort()`

中止一个尚未完成的 Web（网络）请求。这能够中止 fetch 请求及任何响应体的消费和流。

## 示例

首先通过 `AbortController()` 构造函数来创建一个 `controller` 实例，然后通过 `AbortController.signal` 属性获取到它的关联对象 `AbortSignal` 的引用。

当 `fetch` 请求初始化时，我们将 `AbortSignal` 作为一个选项传递进入请求的选项对象中（下面的 `{signal}`）。这将 `signal` 和 `controller` 与 `fetch` 请求相关联，并且允许我们通过调用 `AbortController.abort()` 去中止它，如下面的第二个事件监听器。

```js
const controller = new AbortController();
const signal = controller.signal;

const url = "video.mp4";
const downloadBtn = document.querySelector(".download");
const abortBtn = document.querySelector(".abort");

downloadBtn.addEventListener("click", fetchVideo);

abortBtn.addEventListener("click", () => {
  controller.abort();
  console.log("Download aborted");
});

function fetchVideo() {
  fetch(url, { signal })
    .then((response) => {
      console.log("Download complete", response);
    })
    .catch((err) => {
      console.error(`Download error: ${err.message}`);
    });
}
```