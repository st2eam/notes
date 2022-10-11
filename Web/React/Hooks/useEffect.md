## Effect Hook

如果你熟悉 React class 的生命周期函数，你可以把` useEffect Hook `看做 `componentDidMount`，`componentDidUpdate` 和 `componentWillUnmount` 这三个函数的组合。

### useEffect函数源码

```ts
export function useEffect(
  create: () => (() => void) | void,
  deps: Array<mixed> | void | null,
): void {
  const dispatcher = resolveDispatcher();
  return dispatcher.useEffect(create, deps);
}
```

### 为什么在组件内部调用 useEffect？

将 useEffect 放在组件内部让我们可以在 effect 中直接访问 count state 变量（或其他 props）。我们不需要特殊的 API 来读取它 —— 它已经保存在函数作用域中。Hook 使用了 JavaScript 的闭包机制，而不用在 JavaScript 已经提供了解决方案的情况下，还引入特定的 React API。

### useEffect基本用法

`useEffect(effect,[deps])`函数可以传入2个参数，第1个参数为我们定义的执行函数、第2个参数是依赖关系(可选参数)。若一个函数组件中定义了多个useEffect，那么他们实际执行顺序是按照在代码中定义的先后顺序来执行的。

```js
useEffect(() => {
    //此处编写 组件挂载之后和组件重新渲染之后执行的代码
    ...

    return () => {
        //此处编写 组件即将被卸载前执行的代码
        ...
    }
},[deps])
```

**说明：**

1. effect 函数主体内容中的代码，就是组件挂载之后和组件重新渲染之后你需要执行的代码；
2. effect 函数 return 出去的返回函数主体内容中的代码，就是组件即将被卸载前你需要执行的代码；
3. 第2个参数 [deps]，为可选参数，若有值则向React表明该useEffect是依赖哪些变量发生改变而触发的；

**`effect`补充说明**
1、若你不需要在组件卸载前执行任何代码，那么可以忽略不写 effect 中的 return相关代码；

**`[deps]`补充说明：**

1. 若缺省，则组件挂载、组件重新渲染、组件即将被卸载前，每一次都会触发该useEffect；

2. 若传值，则必须为数组，数组的内容是函数组件中通过useState自定义的变量或者是父组件传值过来的props中的变量，告诉React只有数组内的变量发生变化时才会触发useEffect；

3. 若传值，但是传的是空数组 []，则表示该useEffect里的内容仅会在“挂载完成后和组件即将被卸载前”执行一次；

### [useEffect 的执行时机](https://react.docschina.org/docs/hooks-reference.html#timing-of-effects)

```js
useEffect(()=>{})   =>  componentDidMount,componentDidUpdate
useEffect(()=>{},[])   =>  componentDidMount
useEffect(()=>()=>{})   =>  componentDidMount,componentWillUnMount
```

### [清除 effect](https://react.docschina.org/docs/hooks-reference.html#cleaning-up-an-effect)

通常，组件卸载时需要清除 effect 创建的诸如订阅或计时器 ID 等资源。要实现这一点，`useEffect` 函数需返回一个清除函数。以下就是一个创建订阅的例子：

```js
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    // 清除订阅
    subscription.unsubscribe();
  };});
```

为防止内存泄漏，清除函数会在组件卸载前执行。另外，如果组件多次渲染（通常如此），则在执行下一个 effect 之前，上一个 effect 就已被清除。在上述示例中，意味着组件的每一次更新都会创建新的订阅。若想避免每次更新都触发 effect 的执行，请参阅下一小节。

### 为什么要在 effect 中返回一个函数？

这是 effect 可选的清除机制。每个 effect 都可以返回一个清除函数。如此可以将添加和移除订阅的逻辑放在一起。它们都属于 effect 的一部分。

> 并不是必须为 effect 中返回的函数命名。这里我们将其命名为 cleanup 是为了表明此函数的目的，但其实也可以返回一个箭头函数或者给起一个别的名字。

### [effect 的条件执行](https://react.docschina.org/docs/hooks-reference.html#conditionally-firing-an-effect)

默认情况下，effect 会在每轮组件渲染完成后执行。这样的话，一旦 effect 的依赖发生变化，它就会被重新创建。

然而，在某些场景下这么做可能会矫枉过正。比如，在上一章节的订阅示例中，我们不需要在每次组件更新时都创建新的订阅，而是仅需要在 `source` prop 改变时重新创建。

要实现这一点，可以给 `useEffect` 传递第二个参数，它是 effect 所依赖的值数组。更新后的示例如下：

```js
useEffect(
  () => {
    const subscription = props.source.subscribe();
    return () => {
      subscription.unsubscribe();
    };
  },
  [props.source],);
```

此时，只有当 `props.source` 改变后才会重新创建订阅。

> 注意
>
> 如果你要使用此优化方式，请确保数组中包含了所有外部作用域中会发生变化且在 effect 中使用的变量，否则你的代码会引用到先前渲染中的旧变量。请参阅文档，了解更多关于[如何处理函数](https://react.docschina.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) 以及[数组频繁变化时的措施](https://react.docschina.org/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often) 的内容。
>
> 如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（`[]`）作为第二个参数。这就告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都不需要重复执行。这并不属于特殊情况 —— 它依然遵循输入数组的工作方式。
>
> 如果你传入了一个空数组（`[]`），effect 内部的 props 和 state 就会一直持有其初始值。尽管传入 `[]` 作为第二个参数有点类似于 `componentDidMount` 和 `componentWillUnmount` 的思维模式，但我们有 [更好的](https://react.docschina.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) [方式](https://react.docschina.org/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often) 来避免过于频繁的重复调用 effect。除此之外，请记得 React 会等待浏览器完成画面渲染之后才会延迟调用 `useEffect`，因此会使得处理额外操作很方便。
>
> 我们推荐启用 [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) 中的 [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) 规则。此规则会在添加错误依赖时发出警告并给出修复建议。

依赖项数组不会作为参数传给 effect 函数。虽然从概念上来说它表现为：所有 effect 函数中引用的值都应该出现在依赖项数组中。未来编译器会更加智能，届时自动创建数组将成为可能。

### 性能优化

举例：若一个组件中有一个自定义变量obj，obj有两个属性a、b，当a发生变化时，网页标题也跟着a发生变化。

1. 我们为了让a、b都可以发生变化，将在组件中创建2个按钮，点击之后分别可以修改a、b的值；  

2. 为了更加清楚看到每次渲染，我们在网页标题中 a 的后面再增加一个随机数字；

首先看以下代码：

```js
import React, { useState,useEffect} from 'react';
function Component() {
  const [obj,setObj] = useState({a:0,b:0});
  useEffect(() => {
    document.title = `${obj.a} - ${Math.floor(Math.random()*50)}`;
  }); //注意此时我们并未设置useEffect函数的第2个参数

  return <div>
    {JSON.stringify(obj)}
    <button onClick={() => {setObj({...obj,a:obj.a+1})}}>a+1</button> 
    <button onClick={() => {setObj({...obj,b:obj.b+1})}}>b+1</button>
  </div>
}
export default Component;
```

由于我们在网页标题中添加了随机数，因此实际运行你会发现即使修改b的值，也会引发网页标题重新“变更一次”。

理由显而易见，修改b的值也会触发组件重新渲染，进而触发useEffect中的代码。

正确的做法应该是我们给useEffect添加上第2个参数：[obj.a]，明确告诉React，只有当obj.a变更引发的重新渲染才执行本条useEffect。

```js
useEffect(() => {
   document.title = `${obj.a} - ${Math.floor(Math.random()*50)}`;
 },[obj.a]); //第2个参数为数组，该数组中可以包含多个变量
```

添加过[obj.a]之后，再次运行，无论obj.b或者其他数据变量引发的组件重新渲染，都不会执行该useEffect。

因此达到提高性能的目的。

### [来自官网使用 Effect 的提示](https://react.docschina.org/docs/hooks-effect.html#tips-for-using-effects)
