## useMemo

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

返回一个 [memoized](https://en.wikipedia.org/wiki/Memoization) 值。

把“创建”函数和依赖项数组作为参数传入 `useMemo`，它仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算。

传入 `useMemo` 的函数会在渲染期间执行。请不要在这个函数内部执行不应该在渲染期间内执行的操作，诸如副作用这类的操作属于 `useEffect` 的适用范畴，而不是 `useMemo`。

如果没有提供依赖项数组，`useMemo` 在每次渲染时都会计算新的值。

你可以把 `useMemo` 作为**性能优化**的手段，但不要把它当成语义上的保证。将来，React 可能会选择“遗忘”以前的一些 memoized 值，并在下次渲染时重新计算它们，比如为离屏组件释放内存。先编写在没有 `useMemo` 的情况下也可以执行的代码 —— 之后再在你的代码中添加 `useMemo`，以达到优化性能的目的。

##### 代码形式

```js
const xxxValue = useMemo(() => {
    let result = xxxxx;
    //经过复杂的计算后
    return result;
}, [xx]);
```

##### 拆解说明

1. 使用`useMemo()`将计算函数包裹住，将计算函数中使用到的数据变量作为作为第2个参数。  

2. 计算函数体内，把计算结果以 return 形式返回出去。  

3. xxxValue 为该函数返回值在react原型链上的引用。

## 与useCallback的联系

作用：性能优化，减少没有必要的重复渲染组件

不同之处：

`useCallback`返回的是一个函数（组件）

`useMemo`返回的是一个函数的值

## useMemo使用示例

**举例：** 若某React组件内部有2个number类型的变量num，random，有2个button，点击之后分别可以修改num，random的值。 与此同时，该组件中还要求显示出num范围内的所有质数个数总和。

补充说明：加入random纯粹是为了引发组件重新渲染，方便我们查看到useMemo是否启了作用。

**需求分析：**  
1、显示出num范围内的所有质数个数总和，这个就是本组件中的“复杂的计算”。  
2、只要num的值未发生变化，质数总数是固定的，那么我们应该避免每次重新渲染时都需要计算一遍。  
3、useMemo函数，就是帮我们解决这个问题。

使用useMemo，代码示例如下：

```jsx
import React,{useState,useMemo} from 'react'

function UseMemo() {
  const [num,setNum] = useState(2022);
  const [random,setRandom] = useState(0);

  //通过useMemo将函数内的计算结果(返回值)保存到react底层原型链上
  //totalPrimes为react底层原型链上该函数计算结果的引用
  const totalPrimes = useMemo(() => {
    console.log('render....'); //这里添加一个console.log，方便验证在重新渲染时是否重新执行了一遍计算

    let total = 0; //声明质数总和对应的变量

    //以下为计算num范围内所有质数个数总和的计算代码，不需要认真阅读，只需要知道这是一段“比较复杂的计算代码”即可
    for(let i = 1; i<=num; i++){
        let boo = true;
        for(let j = 2; j<i; j++){
            if(i % j === 0){
                boo = false;
                break;
            }
        }
        if(boo && i!==1){
            total ++;
        }
    }
    //复杂的计算代码到此结束

    return total;//将质数总和作为返回值return出去
  }, [num]);

  const clickHandler01 = () => {
    setNum(num+1);
  }

  const clickHandler02 = () => {
    setRandom(Math.floor(Math.random()*100)); //修改random的值导致整个组件重新渲染
  }

  return (
    <div>
        {num} - {totalPrimes} - {random}
        <button onClick={clickHandler01}>num + 1</button>
        <button onClick={clickHandler02}>random</button>
    </div>
  )
}

export default UseMemo;
```

实际运行就会发现：  
1、点击修改random的值会引发组件重新渲染，但是{totalPrimes}对应的计算函数却不需要重新计算一遍。  
2、点击修改num的值，{totalPrimes}对应的计算函数肯定会重新执行一遍，因为num是该计算函数的依赖。
