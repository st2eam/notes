## Context

在一个典型的 React 应用中，数据是通过 props 属性自上而下（由父及子）进行传递的，但此种用法对于某些类型的属性而言是极其繁琐的（例如：地区偏好，UI 主题），这些属性是应用程序中许多组件都需要的。Context 提供了一种在组件之间共享此类值的方式，而不必显式地通过组件树的逐层传递 props。自定义Hook在不同的组件之间共享逻辑，`Context` 在不同的组件之间共享状态。

## useContext基本用法

`useContext(context)`函数可以传入1个参数，该参数为共享数据对象的实例，`useContext`函数会返回该共享对象实例的value值。

#### 代码形式：

```jsx
import GlobalContext from './global-context'; //引入共享数据对象

function Component(){
  const global = useContext(GlobalContext); //在函数组件中声明一个变量来代表该共享数据对象的value值

  //若想获取共享数据对象中的属性xxx的值，直接使用global.xxx即可
  return <div>
    {global.xxx}
  </div>
}
```

#### 拆解说明：

1. 子组件(函数组件)需要先引入共享数据对象GlobalContext；  

2. 内部定义一个常量global，用来接收useContext函数返回GlobalContext的value值；  

3. 函数组件在return时，可以不使用`<GlobalCount.Customer>`标签，而是直接使用global.xx来获取共享数据；  

4. 请注意，这里执行的依然是单向数据流，只可以获取global.xx，不可以直接更改global.xx;

#### '引入GlobalContext'补充说明

示例中是通过import方式引入的，如果直接把GlobalContext定义在该组件内部，那不是就不用import了吗？  

答：是的，你可以这么做。只不过定义在外部单独的模块中，各个组件都可以引用。

#### 'global'补充说明

为了代码语义化，上述代码中使用到了global这个单词，但是请注意，该单词和原生JS中global(全局变量)无任何关联。实际项目中你可以使用任意具有语义的相关单词。比如定义用户共享数据你可以定义为UserContext、新闻共享数据你可以定义为NewsContext等。

### useContext使用示例

若某React组件一共由3层组件嵌套而成，从外到里分别是`AppComponent`、`MiddleComponent`、`ChildComponent`。`AppComponent`需要传递数据给`ChildComponent`。

若使用useContext来实现，代码示例如下：

```jsx
//global-context.js
import React from 'react';
const GlobalContext = React.createContext(); 
//请注意，这里还可以给React.createContext()传入一个默认值
//例如：const GlobalContext = React.createContext({name:'Yang',age:18})
//假如<GlobalContext.Provider>中没有设置value的值，就会使用上面定义的默认值
export default GlobalContext;
```

```jsx
//component.js
import React, { useContext } from 'react';
import GlobalContext from './global-context';

function AppComponent() {
  //标签<GlobalContext.Provider>中向下传递数据，必须使用value这个属性，且数据必须是键值对类型的object
  //如果不添加value，那么子组件获取到的共享数据value值是React.createContext(defaultValues)中的默认值defaultValues
  return <div>
    <GlobalContext.Provider value={{name:'react',age:34}}>
        <MiddleComponent />
    </GlobalContext.Provider>
  </div>
}

function MiddleComponent(){
  //MiddleComponent 不需要做任何 “属性数据传递接力”，因此降低该组件数据传递复杂性，提高组件可复用性
  return <div>
    <ChildComponent />
  </div>
}

function ChildComponent(){
  const global = useContext(GlobalContext); //获取共享数据对象的value值
  //忘掉<GlobalContext.Consumer>标签，直接用global获取需要的值
  return <div>
    {global.name} - {global.age}
  </div>
}

export default AppComponent;
```

假如`ChildComponent`不使用`useContext`，而是使用`<GlobalContext.Consumer>`标签，那么代码相应修改为：

```jsx
function ChildComponent(){
  return <GlobalContext.Consumer>
    {
        global => {
            return <div>{global.name} - {global.age}</div>
        }
    }
  </GlobalContext.Consumer>
}
```

使用`useContext`可以大大降低获取数据代码复杂性。

请注意：`useContext`只是简化了获取共享数据value的代码，但是对于`<XxxContext.Provider>`的使用没有做任何改变，如果组件需要设置2个`XxxContext`，那么依然需要进行`<XxxContext.Provider>`嵌套。

## Context高级用法

### 同时传递多个共享数据值给1个子组件

实现以下组件需求：  

1、有2个共享数据对象 `UserContext`、`NewsContext`；  

2、父组件为`AppComponent`、子组件为`ChildComponent`；  

3、父组件需要同时将`UserContext`、`NewsContext`的数据同时传递给子组件；

实现代码：

```jsx
import React,{ useContext } from 'react'

const UserContext = React.createContext();
const NewsContext = React.createContext();

function AppComponent() {
  return (
    <UserContext.Provider value={{name:'React'}}>
        <NewsContext.Provider value={{title:'Hello React Hook.'}}>
            <ChildComponent />
        </NewsContext.Provider>
    </UserContext.Provider>
  )
}

function ChildComponent(){
  const user = useContext(UserContext);
  const news = useContext(NewsContext);
  return <div>
    {user.name} - {news.title}
  </div>
}

export default AppComponent;
```

代码分析：  
1、父组件同时要实现传递2个共享数据对象value值，需要使用`<XxxContext.Provider value={obj}>`标签进行2次嵌套。  

2、子组件使用了`useContext`，他可以自由随意使用父组件传递过来的共享数据value，并不需要多次嵌套获取。

### 同时将1个共享数据值传递给多个子组件

使用`<XxxContext.Provider></XxxContext.Provider>`标签将多个子组件包裹起来，即可实现。

```jsx
<XxxContext.Provider value={{name:'puxiao'}}>
    <ComponentA />
    <ComponentB />
    <ComponentC />
</XxxContext.Provider>
```

3个子组件`<ComponentA />`、`<ComponentB />`、`<ComponentC />`都可使用useContext获取共享数据值。

### 为什么不使用Redux？

在Hook出现以前，React主要负责视图层的渲染，并不负责组件数据状态管理，所以才有了第三方Redux模块，专门来负责React的数据管理。

但是自从有了Hook后，使用 React Hook 进行函数组件开发，实现数据状态管理变得切实可行。只要根据实际项目需求，使用`useContext`以及下一章节要学习的`useReducer`，一定程度上是可以满足常见需求的。

毕竟使用`Redux`会增大项目复杂度，此外还要花费学习`Redux`成本。

具体需求具体分析，不必过分追求`Redux`。
