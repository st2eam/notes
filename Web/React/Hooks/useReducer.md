## useReducer基础用法

`useReducer`的作用是“勾住”某些自定义数据对应的`dispatch`所引发的数据更改事件。useReducer可以替代useState，实现更为复杂逻辑的数据修改。

### useReducer是来解决什么问题的？

答：useReducer是useState的升级版(实际上应该是原始版)，可以实现复杂逻辑修改，而不是像useState那样只是直接赋值修改。

**补充说明：**  
1、在React源码中，实际上useState就是由useReducer实现的，所以useReducer准确来说是useState的原始版。  
2、无论哪一个Hook函数，本质上都是通过事件驱动来实现视图层更新的。

### useReducer源码

```js
export function useReducer<S, I, A>(
  reducer: (S, A) => S,
  initialArg: I,
  init?: I => S,
): [S, Dispatch<A>] {
  const dispatcher = resolveDispatcher();
  return dispatcher.useReducer(reducer, initialArg, init);
}
```

## useReducer基本用法

`useReducer(reducer,initialValue)`函数通常传入2个参数，第1个参数为我们定义的一个“由dispatch引发的数据修改处理函数”，第2个参数为自定义数据的默认值，useReducer函数会返回自定义变量的引用和该自定义变量对应的“dispatch”。

请注意，当你看到了dispatch，肯定想到了原生JS中的EventEmitter，事实上React Hook帮我们做了底层的事件驱动处理，我们拿到的dispatch以及“事件处理函数”reducer，都时被React Hook 封装过后的，并不是真正的抛出和事件处理函数。

但是为了更容易让你理解，本文依然会在讲解useReducer时使用到“事件抛出、事件处理函数”等文字。

如果你了解事件驱动，使用过EventEmitter，或者你使用过Redux，那么你会很容易理解useReducer的用法。

#### 代码形式

```jsx
import React, { useReducer } from 'react'; //引入useReducer

//定义好“事件处理函数” reducer
function reducer(state, action) {
  switch (action) {
    case 'xx':
        return xxxx;
    case 'xx':
        return xxxx;
    default:
        return xxxx;
  }
}

function Component(){
  //声明一个变量xxx，以及对应修改xxx的dispatch
  //将事件处理函数reducer和默认值initialValue作为参数传递给useReducer
  const [xxx, dispatch] = useReducer(reducer, initialValue); 

  //若想获取xxx的值，直接使用xxx即可

  //若想修改xxx的值，通过dispatch来修改
  dispatch('xx');
}
```

请注意，上述代码中的action只是最基础的字符串形式，事实上action可以是多属性的object，这样可以自定义更多属性和更多参数值

例如 action 可以是 {type:'xx',param:xxx}

#### 拆解说明

1. 具体讲解已在上面示例代码中做了多项注释，此处不再重复；

**'reducer'补充说明**

1. reducer英文单词本身意思是“减速器、还原剂”，但是本文中一直把reducer称呼为“事件处理函数”，但事实上reducer确实扮演一个事件处理函数。  

2. 千万不要把useReducer中的 reducer 和 原生JS中的Array.prototype.reduce()弄混淆，他们两个只是刚好都使用了这个reduce单词而已，两者本身没有任何内在关联。

**'xxx'补充说明**

假设我们定义的变量名为xxx，那么只能通过dispatch来修改xxx，不要尝试通过 xxx = newValue 这种形式直接修改变量的值，React 不允许这样做。

**'dispatch'补充说明**

再次强调，dispacth并不是真正的Event.dispatch，但是你完全可以把它当成Event.dispatch来理解，只不过useReducer中的dispacth(xxx)函数抛出内容不是event，而是一个包含修改信息的对象，该对象不仅可以是字符串，还可以是复杂对象。

**'initialValue'补充说明**

`initialValue`是我们自定义变量的默认值，该值可以是简单类型(number、string)，也可以是复杂类型(object、array)。  
推荐建议：即使该值是简单类型，也建议单独定义出来而不是直接将值写在useReducer函数中，因为单独定义可以让我们更加清晰读懂数据结构，尤其是initialValue为复杂类型时。

```jsx
import React, { useReducer } from 'react';

function reducer(state,action){
  switch(action){
    case 'add':
        return state + 1;
    case 'sub':
        return state - 1;
    case 'mul':
        return state * 2;
    default:
        console.log('what?');
        return state;
  }
}

function CountComponent() {
  const [count, dispatch] = useReducer(reducer,0);

  return <div>
    {count}
    <button onClick={() => {dispatch('add')}} >add</button>
    <button onClick={() => {dispatch('sub')}} >sub</button>
    <button onClick={() => {dispatch('mul')}} >mul</button>
  </div>;
}

export default CountComponent;
```

## useReducer高级用法

### 使用useReducer来管理复杂类型的数据

举例，若某组件内通过ajax请求数据，获取最新一条站内短信文字，需要组件显示整个ajax过程及结果：  

1. 当ajax开始请求时，界面显示“loading...”；  

2. 当ajax请求发生错误时，界面显示“wrong!”;  

3. 当ajax请求成功获取数据时，界面显示获取到的数据内容；

如果我们使用useState来实现上述功能，伪代码如下：

```jsx
function Component() {
  const [loading,setLoading] = useState(true); //是否ajax请求中，默认为true
  const [result,setResult] = useState(''); //请求数据内容，默认为''
  const [error,setError] = useState(false); //请求是否发生错误，默认为false

  {
      //ajax请求成功
      setLoading(false);
      setResult('You have a good news!');//请注意，这是一行伪代码，只是为了演示，并不是真正ajax获取的结果
      setError(false);

      //ajax请求错误
      setLoading(false);
      setError(true);
  }

  return <div>
    {loading ? 'loading...' : result}
    {error ? 'wrong!' : null}
  </div>
}
```

如果我们使用`useReducer`来实现，则可将上述3个变量都放在我们定义的变量state中，伪代码如下：

```jsx
const initralData = {loading: true,result: '',error: false};

const reducer = (state, action) => {
  switch (action.type) {
    case 'succes':
        return {loading:false,result:action.res,error:false}
    case 'error':
        return {loading:false,error:true}
  }
}

function Component() {
  const [state, dispatch] = useReducer(reducer, initralData);

  {
      //ajax请求成功
      dispatch({type:'succes',res:'You have a good news!'});

      //ajax请求错误
      dispatch({type:'error'});
  }

  return <div>
    {state.loading ? 'loading...' : state.result}
    {state.error ? 'wrong!' : null}
  </div>
}
```

你可能会有疑问？  

1. 为什么看上去使用useReducer后代码变得更多？  
   答：因为使用useReducer，我们将修改数据拆分为2个部分，即“抛出修改事件和事件修改处理函数”。虽然代码增多了，但是逻辑更加清晰。

2. 为什么不使用useState，同时把它对应的变量也做成一个obj，就像useReducer的initralData那种？  
   答：单纯从1次ajax请求很难看出使用useState或useReducer的差异，但是试想一下多次且ajax返回值在结构类型上容易发生变更，那么使用useReducer这种更加利于代码阅读、功能扩展。

### 使用useContext和useReducer实现操作全局共享数据

#### 实现原理

用 useContext 实现“获取全局数据”  
用 useReducer 实现“修改全局数据”

#### 实现思路

1、用`React.createContext()`定义一个全局数据对象；  
2、在父组件中用 `useReducer` 定义全局变量xx和负责抛出修改事件的`dispatch`；  
3、在父组件之外，定义负责具体修改全局变量的处理函数`reducer`，根据修改xx事件类型和参数，执行修改xx的值；  
4、在父组件中用`<XxxContext.Provider value={{xx,dispath}}>`标签把 全局共享数据和负责抛出修改xx的dispatch 暴露给子组件；  
5、在子组件中用 `useContext`获取全局变量；  
6、在子组件中用 `xxContext.dispatch` 去抛出修改xx的事件，携带修改事件类型和参数；

global-context.ts

```jsx
import React from "react";
const GlobalContext = React.createContext({ age: 0, dispatch: () => { } });
export default GlobalContext
```

AppComponent.tsx

```jsx
//定义好“事件处理函数” reducer
function reducer(state, action) {
  switch (action) {
    case "add":
      return state + 1;
    case "sub":
      return state - 1;
    default:
      return 0;
  }
}

function AppComponent() {
  const [count, dispatch] = useReducer(reducer, 22);
  //如果不添加value，那么子组件获取到的共享数据value值是React.createContext(defaultValues)中的默认值defaultValues
  return <div>
    <GlobalContext.Provider value={{ count, dispatch }}>
      <ComponentA />
      <ComponentB />
      <ComponentC />
    </GlobalContext.Provider>
  </div >
}
```

ComponentA.tsx

```jsx
import { useContext } from 'react';
import GlobalContext from '../global-context.ts';
export default function ComponentA() {
  const countContext = useContext(GlobalContext);
  return <div>
    <h1>ComponentA - count={countContext.count}</h1
    <button onClick={() => { countContext.dispatch("add") }}>add</button>
    <button onClick={() => { countContext.dispatch("sub") }}>sub</button>
  </div>
}
```

### 为什么不使用Redux？

这个问题以前提出过，现在可以明确回答：因为我自己使用 useReducer + useContext 自己可以轻松实现，干嘛还要用Redux。  再见 Redux。
