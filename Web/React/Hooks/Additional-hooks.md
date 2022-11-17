## [Hook API 索引 – React (reactjs.org)](https://zh-hans.reactjs.org/docs/hooks-reference.html#additional-hooks)

### `useImperativeHandle`

```js
useImperativeHandle(ref, createHandle, [deps])// 第一个参数暴露哪个ref;第二个参数暴露什么信息*
```

`useImperativeHandle` 可以让你在使用 `ref` 时自定义暴露给父组件的实例值。在大多数情况下，应当避免使用 ref 这样的命令式代码。`useImperativeHandle` 应当与 [`forwardRef`](https://zh-hans.reactjs.org/docs/react-api.html#reactforwardref) 一起使用：

```jsx
import { forwardRef, useImperativeHandle, useRef } from 'react'

const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null)
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus()
    }
  }))
  return <input ref={inputRef} />
})

export default FancyInput

```

在本例中，渲染 `<FancyInput ref={inputRef} />` 的父组件可以调用 `inputRef.current.focus()`。

### `useLayoutEffect`

其函数签名与 `useEffect` 相同，但它会在所有的 DOM 变更之后同步调用 effect。可以使用它来读取 DOM 布局并同步触发重渲染。在浏览器执行绘制之前，`useLayoutEffect` 内部的更新计划将被同步刷新。

尽可能使用标准的 `useEffect` 以避免阻塞视觉更新。

### `useDebugValue`

```js
useDebugValue(value)
```

`useDebugValue` 可用于在 React 开发者工具中显示自定义 hook 的标签。

例如，[“自定义 Hook”](https://zh-hans.reactjs.org/docs/hooks-custom.html) 章节中描述的名为 `useFriendStatus` 的自定义 Hook：

```js
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  // 在开发者工具中的这个 Hook 旁边显示标签  // e.g. "FriendStatus: Online"  useDebugValue(isOnline ? 'Online' : 'Offline');
  return isOnline;
}
```

#### 延迟格式化 debug 值

在某些情况下，格式化值的显示可能是一项开销很大的操作。除非需要检查 Hook，否则没有必要这么做。

因此，`useDebugValue` 接受一个格式化函数作为可选的第二个参数。该函数只有在 Hook 被检查时才会被调用。它接受 debug 值作为参数，并且会返回一个格式化的显示值。

例如，一个返回 `Date` 值的自定义 Hook 可以通过格式化函数来避免不必要的 `toDateString` 函数调用：

```js
useDebugValue(date, date => date.toDateString());
```

### `useDeferredValue`

```js
const deferredValue = useDeferredValue(value);
```

`useDeferredValue` 接受一个值，并返回该值的新副本，该副本将推迟到更紧急地更新之后。如果当前渲染是一个紧急更新的结果，比如用户输入，React 将返回之前的值，然后在紧急渲染完成后渲染新的值。

该 hook 与使用防抖和节流去延迟更新的用户空间 hooks 类似。使用 `useDeferredValue` 的好处是，React 将在其他工作完成（而不是等待任意时间）后立即进行更新，并且像 [`startTransition`](https://zh-hans.reactjs.org/docs/react-api.html#starttransition) 一样，延迟值可以暂停，而不会触发现有内容的意外降级。

#### Memoizing deferred children

`useDeferredValue` 仅延迟你传递给它的值。如果你想要在紧急更新期间防止子组件重新渲染，则还必须使用 React.memo 或 React.useMemo 记忆该子组件：

```jsx
function Typeahead() {
  const query = useSearchQuery('');
  const deferredQuery = useDeferredValue(query);

  // Memoizing 告诉 React 仅当 deferredQuery 改变，
  // 而不是 query 改变的时候才重新渲染
  const suggestions = useMemo(() =>
    <SearchSuggestions query={deferredQuery} />,
    [deferredQuery]
  );

  return (
    <>
      <SearchInput query={query} />
      <Suspense fallback="Loading results...">
        {suggestions}
      </Suspense>
    </>
  );
}
```

记忆该子组件告诉 React 它仅当 `deferredQuery` 改变而不是 `query` 改变的时候才需要去重新渲染。这个限制不是 `useDeferredValue` 独有的，它和使用防抖或节流的 hooks 使用的相同模式。

### `useTransition`

```js
const [isPending, startTransition] = useTransition();
```

返回一个状态值表示过渡任务的等待状态，以及一个启动该过渡任务的函数。

`startTransition` 允许你通过标记更新将提供的回调函数作为一个过渡任务：

```js
startTransition(() => {
  setCount(count + 1);
})
```

`isPending` 指示过渡任务何时活跃以显示一个等待状态：

```jsx
function App() {
  const [isPending, startTransition] = useTransition();
  const [count, setCount] = useState(0);
  
  function handleClick() {
    startTransition(() => {
      setCount(c => c + 1);
    })
  }

  return (
    <div>
      {isPending && <Spinner />}
      <button onClick={handleClick}>{count}</button>
    </div>
  );
}
```

> 注意：
>
> 过渡任务中触发的更新会让更紧急地更新先进行，比如点击。
>
> 过渡任务中的更新将不会展示由于再次挂起而导致降级的内容。这个机制允许用户在 React 渲染更新的时候继续与当前内容进行交互。

### `useTransition`

```js
const [isPending, startTransition] = useTransition();
```

返回一个状态值表示过渡任务的等待状态，以及一个启动该过渡任务的函数。

`startTransition` 允许你通过标记更新将提供的回调函数作为一个过渡任务：

```js
startTransition(() => {
  setCount(count + 1);
})
```

`isPending` 指示过渡任务何时活跃以显示一个等待状态：

```jsx
function App() {
  const [isPending, startTransition] = useTransition();
  const [count, setCount] = useState(0);
  
  function handleClick() {
    startTransition(() => {
      setCount(c => c + 1);
    })
  }

  return (
    <div>
      {isPending && <Spinner />}
      <button onClick={handleClick}>{count}</button>
    </div>
  );
}
```

> 注意：
>
> 过渡任务中触发的更新会让更紧急地更新先进行，比如点击。
>
> 过渡任务中的更新将不会展示由于再次挂起而导致降级的内容。这个机制允许用户在 React 渲染更新的时候继续与当前内容进行交互。

### `useId`

```js
const id = useId();
```

`useId` 是一个用于生成横跨服务端和客户端的稳定的唯一 ID 的同时避免 hydration 不匹配的 hook。

> Note
>
> `useId` is **not** for generating [keys in a list](https://zh-hans.reactjs.org/docs/lists-and-keys.html#keys). Keys should be generated from your data.

For a basic example, pass the `id` directly to the elements that need it: 一个最简单的例子，直接传递 `id` 给需要它的元素：

```jsx
function Checkbox() {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>Do you like React?</label>
      <input id={id} type="checkbox" name="react"/>
    </>
  );
};
```

对于同一组件中的多个 ID，使用相同的 `id` 并添加后缀：

```jsx
function NameFields() {
  const id = useId();
  return (
    <div>
      <label htmlFor={id + '-firstName'}>First Name</label>
      <div>
        <input id={id + '-firstName'} type="text" />
      </div>
      <label htmlFor={id + '-lastName'}>Last Name</label>
      <div>
        <input id={id + '-lastName'} type="text" />
      </div>
    </div>
  );
}
```

> 注意：
>
> `useId` 生成一个包含 `:` 的字符串 token。这有助于确保 token 是唯一的，但在 CSS 选择器或 `querySelectorAll` 等 API 中不受支持。
>
> `useId` 支持 `identifierPrefix` 以防止在多个根应用的程序中发生冲突。 要进行配置，请参阅 [`hydrateRoot`](https://zh-hans.reactjs.org/docs/react-dom-client.html#hydrateroot) 和 [`ReactDOMServer`](https://zh-hans.reactjs.org/docs/react-dom-server.html) 的选项。