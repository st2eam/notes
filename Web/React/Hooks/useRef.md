### useRef

“勾住”某些组件挂载完成或重新渲染完成后才拥有的某些对象，并返回该对象的引用。该引用在组件整个生命周期中都固定不变，该引用也不会随着组件重新渲染而失效。

```js
const refContainer = useRef(initialValue);
```

- `useRef` 返回一个可变的 ref 对象，其 `.current` 属性被初始化为传入的参数（`initialValue`）。
- 返回的 ref 对象在组件的整个生命周期内保持不变
- 当更新 current 值时并不会 re-render ，这是与 `useState` 不同的地方
- 更新 `useRef` 是 side effect (副作用)，所以一般写在 `useEffect` 或 event handler 里
- `useRef` 类似于类组件的 this

### useRef使用示例

需求分析：  

1. 我们可以很轻松使用`<input >`创建出这个输入框。  

2. 需要使用`useRef` “勾住”这个输入框，当它被挂载到网页后，通过操作原生html的方法，将焦点赋予该输入框上。

完整代码如下：

```jsx
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` 指向已挂载到 DOM 上的文本输入元素
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

你应该熟悉 ref 这一种[访问 DOM](https://zh-hans.reactjs.org/docs/refs-and-the-dom.html) 的主要方式。如果你将 ref 对象以 `<div ref={myRef} />` 形式传入组件，则无论该节点如何改变，React 都会将 ref 对象的 `.current` 属性设置为相应的 DOM 节点。

然而，`useRef()` 比 `ref` 属性更有用。它可以[很方便地保存任何可变值](https://zh-hans.reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables)，其类似于在 class 中使用实例字段的方式。

### 为什么使用useRef

主动更新 useRef 变量的 .current 的值并不会触发组件重新渲染。

例如下面这个示例：

```tsx
import { useRef } from "react";

export default function MyButton() {
  const countRef = useRef(0)

  const handleClick = () => {
    countRef.current = countRef.current + 1
  };

  return <button onClick={handleClick}>Click me {countRef.current}</button>;
}
```

实际运行就会发现，在点击事件中我们修改了 `countRef.current` 的值，尽管该值确实发生了变化，可是并不会触发组件的重新渲染。

### useRef与createRef的区别

在一个组件的正常的生命周期中可以大致分为3个阶段：

1. 从创建组件到挂载到DOM阶段。初始化props以及state, 根据state与props来构建DOM
2. 组件依赖的props以及state状态发生变更，触发更新
3. 销毁阶段

第一个阶段，useRef与createRef没有差别

第二个阶段，createRef每次都会返回个新的引用；而useRef不会随着组件的更新而重新创建

第三个阶段，两者都会销毁

**小结：** createRef 每次渲染都会返回一个新的引用，而 useRef 每次都会返回相同的引用

### 总结

1. `useRef`可以用来定义变量，这些变量更改之后不会引起页面重新渲染，比如分页获取数据时，存储页码。
2. `useRef`也可以用来区分初始渲染还是更新
3. 在DOM节点上定义ref属性，通过`.current`就可以获取到该DOM元素
