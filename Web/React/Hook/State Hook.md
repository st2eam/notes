## State Hook

首先引入 React 中 useState 的 Hook

```js
import React, { useState } from 'react';
```

### [`useState`](https://react.docschina.org/docs/hooks-reference.html#usestate)

```js
const [state, setState] = useState(initialState);
```

返回一个 state，以及更新 state 的函数。

在初始渲染期间，返回的状态 (`state`) 与传入的第一个参数 (`initialState`) 值相同。

`setState` 函数用于更新 state。它接收一个新的 state 值并将组件的一次重新渲染加入队列。

```js
setState(newState);
```

在后续的重新渲染中，`useState` 返回的第一个值将始终是更新后最新的 state。

> 注意
> 
> React 会确保 `setState` 函数的标识是稳定的，并且不会在组件重新渲染时发生变化。这就是为什么可以安全地从 `useEffect` 或 `useCallback` 的依赖列表中省略 `setState`。

#### [函数式更新](https://react.docschina.org/docs/hooks-reference.html#functional-updates)

如果新的 state 需要通过使用先前的 state 计算得出，那么可以将函数传递给 `setState`。该函数将接收先前的 state，并返回一个更新后的值。下面的计数器组件示例展示了 `setState` 的两种用法：

```js
function Counter({initialCount}) {
  const \[count, setCount\] = useState(initialCount);
  return (
    <>
      Count: {count}
      <button onClick={() => setCount(initialCount)}>Reset</button>
      <button onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
      <button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
    </>
  );}
```

“+” 和 “-” 按钮采用函数式形式，因为被更新的 state 需要基于之前的 state。但是“重置”按钮则采用普通形式，因为它总是把 count 设置回初始值。

如果你的更新函数返回值与当前 state 完全相同，则随后的重渲染会被完全跳过。

> 注意
> 
> 与 class 组件中的 `setState` 方法不同，`useState` 不会自动合并更新对象。你可以用函数式的 `setState` 结合展开运算符来达到合并更新对象的效果。
> 
> ```
> setState(prevState => {
>   // 也可以使用 Object.assign
>   return {...prevState, ...updatedValues};});
> ```
> 
> `useReducer` 是另一种可选方案，它更适合用于管理包含多个子值的 state 对象。

#### [惰性初始 state](https://react.docschina.org/docs/hooks-reference.html#lazy-initial-state)

`initialState` 参数只会在组件的初始渲染中起作用，后续渲染时会被忽略。如果初始 state 需要通过复杂计算获得，则可以传入一个函数，在函数中计算并返回初始的 state，此函数只在初始渲染时被调用：

```js
const \[state, setState\] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;});
```

#### [跳过 state 更新](https://react.docschina.org/docs/hooks-reference.html#bailing-out-of-a-state-update)

调用 State Hook 的更新函数并传入当前的 state 时，React 将跳过子组件的渲染及 effect 的执行。（React 使用 [`Object.is` 比较算法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description) 来比较 state。）

需要注意的是，React 可能仍需要在跳过渲染前渲染该组件。不过由于 React 不会对组件树的“深层”节点进行不必要的渲染，所以大可不必担心。如果你在渲染期间执行了高开销的计算，则可以使用 `useMemo` 来进行优化。

## useState高级用法

### 恢复默认值

组件需求：实现一个计数器，有3个按钮，点击后分别实现：恢复默认值、点击+1、点击-1

实现代码：

```js
import React, { useState } from 'react';

function Component() {
  const initCount = 0;
  const [count, setCount] = useState(initCount);

  return <div>
    {count}
    <button onClick={() => {setCount(initCount)}}>init</button>
    <button onClick={() => {setCount(count+1)}}>+1</button>
    <button onClick={() => {setCount(count-1)}}>-1</button>
  </div>
}

export default Component;
```

代码分析：

1. 通过额外定义一个变量initCount=0，作为count的默认值；

2. 任何时候想恢复默认值，直接将initCount赋值给count；
   
   ### 解决数据异步
   
   ```js
   for(let i=0; i<3; i++){
   setCount(count+1);
   }
   ```
   
   通过for循环，执行了3次setCount(count+1)，那么你觉得count会 +3 吗？
   答案是：肯定不会

无论for循环执行几次，最终实际结果都将是仅仅执行一次 +1。

为什么？

类组件中setState赋值过程是异步的，同样在Hook中 setXxx 赋值也是异步的，比如上述代码中的setCount。

虽然执行了3次setCount(count+1)，可是每一次修改后的count并不是立即生效的。当第2次和第3次执行时获取到count的值和第1次获取到的count值是一样的，所以最终其实相当于仅执行了1次。

**解决办法：**

```js
for(let i=0; i<3; i++){
  setCount(prevData => prevData+1);
}
```

**代码分析：**

1. prevData为我们定义的一个形参，指当前count应该的值；
2. {return prevData+1} 中，将 prevData+1，并将运算结果return出去。
3. 最终将prevData赋值给count；

**补充说明：**
你可以将prevData修改成任意你喜欢的变量名称，比如prev，只需要确保和后面return里的一致即可。

### 数据类型为Objcet的修改方法

```js
const [person, setPerson] = useState({name:'puxiao',age:34});
```

若想将age的值修改为18，该怎么写？

**正确的做法：**

我们需要先将person拷贝一份，修改之后再进行赋值。

```js
let newData = {...person};
newData.age = 18;
setPerson(newData);
```

以上代码还有一种简写形式：

```js
setPerson({...person,age:18}); //解构赋值
```

代码分析：

1. 先通过...person，将原有person做一次解构，得到一份复制品(浅拷贝)；
2. 修改age的值；
3. 将修改过后的新数据，通过setPerson赋值给person；

### 数据类型为Array的修改方法

和数据类型为Object相似，都是需要通过先拷贝一次，修改后再整体赋值。

### 性能优化

通过 setSth  设置新值，但是如果新值和当前值完全一样，那么会引发React重新渲染吗？

通过React官方文档可以知道，当使用 setSth 赋值时，Hook会使用Object.is()来对比当前值和新值，结果为true则不渲染，结果为false就会重新渲染。
