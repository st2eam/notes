## useCallback

他的作用是“勾住”组件属性中某些处理函数，创建这些函数对应在react原型链上的变量引用。

```js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

返回一个 [memoized](https://en.wikipedia.org/wiki/Memoization) 回调函数。

把内联回调函数及依赖项数组作为参数传入 `useCallback`，它将返回该回调函数的 `memoized `版本，该回调函数仅在某个依赖项改变时才会更新。

当你把回调函数传递给经过优化的并使用引用相等性去避免非必要渲染（例如 `shouldComponentUpdate`）的子组件时，它将非常有用。

`useCallback(fn, deps)` 相当于 `useMemo(() => fn, deps)`。

### memoized函数

`memoized`函数实现原理：使用一组参数初次调用函数时，缓存参数和计算结果，当再次使用相同的参数调用该函数时，直接返回相应的缓存结果。

### useCallback使用示例

若我们有一个自定组件`<Button>`，代码如下

```jsx
import React from 'react'
function Button({label,clickHandler}) {
    //为了方便我们查看该子组件是否被重新渲染，这里增加一行console.log代码
    console.log(`rendering ... ${label}`);
    return <button onClick={clickHandler}>{label}</button>;
}
export default React.memo(Button); //使用React.memo()包裹住要导出的组件
```

现在，我们要实现一个组件，功能如下：  
1、组件内部有2个变量age，salary  
2、有2个自定义组件Button，点击之后分别可以修改age，salary值

若我们不使用useCallback，代码示例如下：

```jsx
import React,{useState,useCallback,useEffect} from 'react';
import Button from './button';

function Mybutton() {
  const [age,setAge] = useState(34);
  const [salary,setSalary] = useState(7000);

  useEffect(() => {
    document.title = `Hooks - ${Math.floor(Math.random()*100)}`;
  });

  const clickHandler01 = () => {
    setAge(age+1);
  };

  const clickHandler02 = () => {
    setSalary(salary+1);
  };

  return (
    <div>
        {age} - {salary}
        <Button label='Btn01' clickHandler={clickHandler01}></Button>
        <Button label='Btn02' clickHandler={clickHandler02}></Button>
    </div>
  )
}
```

实际运行中你会发现，无论点击哪个按钮，都会收到：  

```
rendering ... Btn01  
rendering ... Btn02
```

你只是点击操作了其中一个按钮，另外一个按钮也要跟着重新渲染一次，试想一下如果该组件中有100个子组件都要跟着重新渲染，那真的是性能浪费。

我们再看一下如果使用useCallback，代码示例如下：

```jsx
import React,{useState,useCallback,useEffect} from 'react';
import Button from './button';

function Mybutton() {
  const [age,setAge] = useState(34);
  const [salary,setSalary] = useState(7000);

  useEffect(() => {
    document.title = `Hooks - ${Math.floor(Math.random()*100)}`;
  });

  //使用useCallback()包裹住原来的处理函数
  const clickHandler01 = useCallback(() => {
    setAge(age+1);
  },[age]);

  //使用useCallback()包裹住原来的处理函数
  const clickHandler02 = useCallback(() => {
    setSalary(salary+1);
  },[salary]);

  return (
    <div>
        {age} - {salary}
        <Button label='Bt01' clickHandler={clickHandler01}></Button>
        <Button label='Bt02' clickHandler={clickHandler02}></Button>
    </div>
  )
}
```

修改后的代码，实际运行就会发现，当点击某个按钮时，仅仅是当前按钮重新做了一次渲染，另外一个按钮则没有重新渲染，而是直接使用上一次渲染结果。

使用useCallback减少子组件没有必要的渲染目的达成。

useCallback用法很简单，就是包裹住原本的处理函数。关键点在于你要理解useCallback背后的机理，才能知道在什么情况下可以使用useCallback。否则很容易滥用 useCallback，反而造成性能的浪费。
