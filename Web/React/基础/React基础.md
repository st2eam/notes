## 组件化思想

组件系统是现代Web开发中的一个重要概念，它允许我们使用小型、独立通常可复用的组件构建大型应用，几乎任意类型的应用界面都可以抽象为一个组件树。我们可以简单认为组件是Web页面中的一个独立的功能单元，它可以有自己的状态、DOM结构、逻辑交互，组件最大的价值是可复用性，我们只需要将独立的功能代码封装成组件，需要使用的时候传递给它对应的数据就可以了，不需要再额外编写重复的功能代码。

![image.png](https://note.youdao.com/yws/public/resource/c99ad8ee8977e056429a6768b07877cb/WEBbaceb42a0aef69c43c088dee6dd3541d/WEBRESOURCE777481a9d029021a740bb2d28ae32ba2?ynotemdtimestamp=1656646791141)

上图来自Vue文档，我们可以看到，左侧的页面结构经过拆分，可以用右侧的组件树来表示，上层的节点通常是一些布局用的组件，可复用度比较低，最底层的通常是一些最小的功能单元，可复用性比较高。

## React模块

React框架包含 `react`、`react-dom` 两个模块，其中 `react` 包含核心功能部分，不依赖具体平台，可用于浏览器、Node服务端渲染、移动App，组件的定义需要依赖该模块，`react-dom` 用于处理和浏览器渲染相关的功能，比如 `ReactDOM.render()` 可以将组件渲染到页面上，`ReactDOM.renderToString()` 可以输出html字符串给Node服务端渲染使用。

## 使用React

使用React的方法有很多种，主要有两种方式，都是基于类的组件

- 第一种，为了快速学习React相关概念和语法，我们采用JavaScript开发、script标签引入的方式，它的优点是无需构建工具，可以直接通过浏览器执行，但是这种方式只适用于构建一些简单的学习示例，因为我们使用了 `jsx` 语法，它并不能直接被浏览器识别，需要借助于 `babel` 来对它进行转换执行，所以效率十分低下，我们只用来学习JS环境下React的使用。

- 第二种，我们使用了 `TypeScript` 和原生 `Modules` 的方式来开发React应用，它的好处是无需复杂构建工具，只需要TS一次性编译，速度很快，可以用来做一些没有外部依赖的简单的应用，同时又能体验TS开发的便利。

对于复杂项目，我们会采用 `create-react-app` 工具来构建。

## 简单组件

一个简单的 `React` 组件采用类似下面的代码进行定义

```js
class HelloMessage extends React.Component {
  render() {
    return (
      <div>Hello {this.props.name}</div>
    )
  }
}
```

我们将每一个React组件定义为一个class，它继承自 `React.Component`，组件可以使用一个名为 `render()` 的方法，接收输入的数据并返回需要展示的内容。在上面的示例中这种类似于 `XML` 的写法被称为 `JSX`，被传入的数据在组件中通过 `this.props` 进行访问。

## 有状态组件

上面的简单组件只用来展示外部传入的数据（通过 `this.props` 访问），有些组件逻辑比较复杂，可能会有自己内部的状态数据（通过 `this.state` 访问）需要管理。当组件的状态数据改变时，组件会再次调用 `render()` 方法重新渲染对应的标记。

```js
class Counter extends React.Component {
  constructor() {
    super()
    this.state = {
      count: 0
    }
  }
  increase() {
    this.setState({
      count: this.state.count + 1
    })
  }
  render() {
    return (
      <div>
        <span>{this.state.count}</span>
        <button onClick={this.increase.bind(this)}>Increase</button>
      </div>
    )
  }
}
```

我们通过 `this.state` 定义了当前组件的内部状态，默认的状态数据为 `count: 0`，在 `render()` 函数中可以通过 `this.state.count` 来引用这个状态，我们给后面的 `button` 按钮绑定了一个 `click` 事件，当用户点击它之后，我们通过 `this.setState` 来改变 `count` 的值，让它每次加一，这会引起 `render()` 函数重新执行，React比较前后的内容变化，进行实际的DOM更新。

注意，直接改变 `this.state` 中的值并不能直接引发组件的重新渲染，需要调用 `this.setState` 才可以

## JSX语法

[https://react.docschina.org/docs/introducing-jsx.html](https://react.docschina.org/docs/introducing-jsx.html)

`JSX` 是React用来描述DOM结构的一种语法，它非常类似于原始的html写法，但是又有一些自己的规则。`TypeScript` 语言原生支持 `JSX`，两者配合可以让TS覆盖到界面部分类型检查，开发体验非常棒，JSX让我们可以完全使用JS来开发界面部分（HTML）和逻辑部分（JS），可以充分利用JS的灵活性。

`JSX` 本质上是一种语法糖，它并不是合法的 `JavaScript` 代码，所以需要将它转换成 `React` 中原始的创建DOM结构的API才能执行，比如下面的 `JSX` 代码

```js
render() {
  return (
    <div className="message">
      <h1>Hello</h1>
    </div>
  )
}
```

会被转换为实际可执行的JS代码，类似于原生的 `document.createElement`

```js
render() {
  return React.createElement(
    'div',
    { className: 'message' },
    React.createElement('h1', null, 'Hello')
  )
}
```

很明显使用JSX语法更简单明了，也更贴合我们的开发习惯。直接进行DOM操作是执行效率比较低的，React会在内存中维护一个虚拟DOM结构，`render()` 并不会直接更新DOM，如果状态的改变引起了 `render()` 重新计算，React会根据重新计算的虚拟DOM结构和之前的作比较，然后对发生改变的部分进行DOM更新，这样效率会更高。

我们也可以直接给一个变量赋值为 `JSX`，然后在 `render()` 中引用它

```js
let el = <h1>hello</h1>
```

这是一个非常有趣的写法，它既不是字符串也不是html，通过上面的例子我们可以得知，它等价于

```js
let el = React.createElement('h1', null, 'hello')
```

### 插值

插值是最基本的用法，它可以让我们在 `JSX` 中嵌入变量或者表达式，通过大括号来进行包裹，在前面的例子中我们已经体验过

```js
render() {
  let name = 'React'
  return <div>Hello {name}</div>
}
```

我们还可以在 `JSX` 的大括号内放置任何有效的 `JavaScript` 表达式，例如 `1 + 1`，`user.firstName`，`formatName(user)` 都是有效的表达式。

```js
function formatName(user) {
  return user.firstName + ' ' + user.lastName
}

const user = {
  firstName: 'Jack',
  lastName: 'Lee'
}

render() {
  return (
    <h1>Hello, {formatName(user)}</h1>
  )
}
```

### JSX也是一个表达式

因为在编译之后JSX表达式会被转为普通的JavaScript函数调用，所以我们可以在 `if`、`for` 循环中使用JSX，将JSX表达式赋值给变量，把JSX当作参数传递，或者从函数中返回JSX，当你需要比较复杂的逻辑来构造一个JSX表达式的时候，可以用这种方式：

```js
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}!</h1>
  }
  return <h1>Hello, Stranger.</h1>
}

render() {
  return (
    <div>{getGreeting(user)}</div>
  )
}
```

### 添加属性

添加属性与插值的写法类似，如：

```js
render() {
  return (
    <div tabIndex="0">
      <img src={user.avatarUrl} />
    </div>
  )
}
```

> 警告：JSX语法上更接近JavaScript，并非和HTML完全对应，所以React DOM使用 `camelCase`（小写驼峰命名）来定义属性的名称，而不使用HTML属性名称的约定。比如最常见的，JSX里面的 `class` 变成了 `className`

```js
render() {
  return <div className="message">Hello</div>
}
```

### 嵌入子元素

JSX表达式和HTML类似，标签可以嵌入子内容，如果一个标签没有内容，可以使用 `/>` 来闭合，如：

```js
render() {
  return <img src={user.avatarUrl} />
}
```

这一点和HTML不同，在HTML中你可以写一个不闭合的标签，但是在JSX中不可以

```html
<img src="logo.png">
```

### 条件渲染

React中的条件渲染和JavaScript一样，使用JS运算符或者条件运算符，可以让你对状态数据做出判断，来告诉React如何更新UI。通常我们可以选择两种方式来进行条件渲染，对于简单的条件，我们可以用与运算符 `&&` 或者三目运算，例如：

```js
constructor() {
  super()
  this.state = {
    finished: true,
    count: 0
  }
}

render() {
  return (
    <div>
      <p>status: {this.state.finished && <span>finished</span>}</p>
      <p>status: {this.state.finished ? <span>finished</span> : <span>not finished</span>}</p>
      <p>status: {this.state.count && <span>finished</span>}</p>
      <p>status: {this.state.count ? <span>finished</span> : <span>not finished</span>}</p>
    </div>
  )
}
```

需要注意的是，如果是使用与运算符 `&&` 来做条件渲染，前半段的表达式返回的一定要是 `boolean` 类型的值，也就是 `true` 或者 `false`，这一点和JS的逻辑判断并不一样，这里是基于React的一个特性，那就是不会渲染 `boolean` 类型的值，如果 `&&` 返回的是其他类型，比如数字 `0` 或者空字符串，则不会起到预期的效果。

对于一些复杂的条件判断，我们可以编写一个专门的函数来完成，例如：

```js
constructor() {
  super()
  this.state = {
    count: 0
  }
}

renderText() {
  if (this.state.count < 10) {
    return <span>小于10</span>
  }
  if (this.state.count < 20) {
    return <span>小于20</span>
  }
  return <span>大于等于20</span>
}

render() {
  return (
    <div>
      <p>count: {this.renderText()}</p>
    </div>
  )
}
```

有时候我们希望阻止组件的渲染，那么可以让 `render()` 返回 `null`

```js
constructor() {
  super()
  this.state = {
    ready: false
  }
}

render() {
  if (this.state.ready === false) return null
  return (
    <div>Ready!</div>
  )
}
```

### 列表渲染

在React中，我们可以使用数组的 `map` 方法来将一个数组数据转换为一个元素集合，来实现列表渲染

```js
constructor() {
  super()
  this.state = {
    rows: [1, 2, 3, 4, 5]
  }
}

render() {
  return (
    <ul>
      {this.state.rows.map(item => <li>{item}</li>)}
    </ul>
  )
}
```

运行上面的代码，我们会得到React的一条警告

```
Each child in a list should have a unique "key" prop.
```

这是因为当我们创建一个React列表的时候，需要给每一个列表元素添加一个 `key` 属性，这个 `key` 来帮助React识别哪些元素被改变了，比如添加或删除，因此你应当给数组中的每一个元素赋予一个确定的标识，如

```js
constructor() {
  super()
  this.state = {
    rows: ['a', 'b', 'c']
  }
}

render() {
  return (
    <ul>
      {this.state.rows.map(item => <li key={item}>{item}</li>)}
    </ul>
  )
}
```

一个元素的 `key` 最好是这个元素在列表中拥有的独一无二的值，上面这个例子直接使用数组项的值作为 `key`，如果数组中有重复的值，这样使用是不可以的，通常我们使用数据的 `id` 来作为元素的 `key`，当元素没有确定的 `id` 的时候，万不得已可以使用元素的索引 `index` 作为 `key`，如

```js
constructor() {
  super()
  this.state = {
    areas: [{id: 1, name: '内地'}, {id: 2, name: '港台'}, {id: 3, name: '欧美'}]
  }
}

render() {
  return (
    <ul>
      {this.state.areas.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  )
}
```

`key` 有几点规则需要注意

- `key` 只有放在就近的数组上下文中才有意义，`key` 应该放在最外层的列表项元素上面，而不应该放在列表项内部的元素上面
- `key` 只是在兄弟节点之间必须唯一，不同的列表之间不需要唯一，互不影响

### 事件处理

React元素的事件处理和DOM元素很类似，但是语法上有一些不同

- React事件的命名采用小驼峰模式（camelCase），而不是纯小写
- 使用JSX语法时你需要传入一个函数作为事件处理函数，而不是一个字符串

**传统HTML**

```html
<button onclick="onclick()">Click</button>
```

**React中有所不同**

```js
onBtnClick() {
  console.log('button clicked!')
}

render() {
  return <button onClick={this.onBtnClick.bind(this)}></button>
}
```

在React里面我们不需要使用 `addEventListener` 来给元素添加事件监听

我们还可以向事件处理函数传递参数，以前面列表渲染的例子为例

```js
constructor() {
  super()
  this.state = {
    areas: [{id: 1, name: '内地'}, {id: 2, name: '港台'}, {id: 3, name: '欧美'}]
  }
}

delItem(area) {
  let index = this.state.area.indexOf(area)
  this.state.area.splice(index, 1)
}

render() {
  return (
    <ul>
      {this.state.areas.map(item => (
        <li key={item.id}>{item.name} - <button onClick={() => this.delItem(item)}>删除</button></li>
      ))}
    </ul>
  )
}
```

### Fragments

在React中一个JSX表达式只能包含一个根节点，如果我们想要返回多个元素，需要用一个容器比如 `div` 来包裹，如

```js
render() {
  return (
    <div>
      <span>内地</span>
      <span>港台</span>
      <span>欧美</span>
    </div>
  )
}
```

这种规则大部分时候不会有什么问题，但是有时候外层的 `div` 可能会影响我们的一些样式，或者没必要额外嵌套一层在外面，这时候我们可以使用 `React.Fragment` 来返回一组元素，而不会在外面创建一个额外的容器，如

```js
render() {
  return (
    <React.Fragment>
      <span>内地</span>
      <span>港台</span>
      <span>欧美</span>
    </React.Fragment>
  )
}
```

通过这种写法，父组件在引用该组件的时候，只会渲染三个 `span` 标签，而不会在外层嵌套一个 `div`，它还有一种短语法，两者作用是一样的，使用一个空标签来包裹

```js
render() {
  return (
    <>
      <span>内地</span>
      <span>港台</span>
      <span>欧美</span>
    </>
  )
}
```

`Fragment` 可以用在列表渲染中作为列表项，也支持传入 `key` 属性，需要注意，短语法 `<></>` 不支持添加 `key`

```js
constructor() {
  this.state = {
    areas: [{id: 1, name: '内地'}, {id: 2, name: '港台'}, {id: 3, name: '欧美'}]
  }
}

render() {
  return (
    <div>
      {this.state.areas.map(area => (
        <React.Fragment key={area.id}>
          <span>{area.name}</span>
          <i>/</i>
        </React.Fragment>
      ))}
    </div>
  )
}
```

### ref

有时候我们需要在React应用中获得对DOM的直接访问，这时候可以使用 `ref`

```js
constructor() {
  super()
  this.myRef = React.createRef()
}

componentDidMount() {
  console.log(this.myRef)
}

render() {
  return <div ref={this.myRef} />
}
```

## Props

前面我们看到，React组件概念上类似于JavaScript函数，它接收任意的入参，即 `props`，然后根据传入的数据来渲染组件，`props` 传入的状态数据发生变化之后，会引起当前组件的重新渲染

```js
class Welcome extends React.Component {
  render() {
    return (
      <div>Hello {this.props.name}</div>
    )
  }
}

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      name: 'Tom'
    }
  }

  render() {
    return (
      <div>
        <Welcome name={this.state.name} />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
```

我们看一下这个例子发生了什么：

- 我们调用 `ReactDOM.render()` 函数，并且传入 `<App />` 作为参数，表示渲染 `App` 这个组件
- `App` 组件调用了 `Welcome` 组件，并将 `{ name: 'Tom' }` 作为 `props` 传入
- `Welcome` 组件将 `<div>Hello Tom</div>` 元素作为返回值

> **注意：JSX中引用其他组件的时候组件名必须以大写字母开头**
> 
> React会将小写字母开头的组件视为原生DOM标签，例如 `<div />` 代表HTML的div标签，而 `<Welcome />` 则代表一个组件，并且需要在作用域内使用 `Welcome`

关于 `props` 有一些重要的概念需要注意，子组件永远不要直接修改父组件传递过来的 `props`，需要保持只读的状态，`props` 只能由父组件进行修改，这样做的目的是为了保持数据流的单向性，也就是说状态数据应该只能从父组件往子组件流动，而不应该反过来，这样容易造成混乱。比如上面的例子，子组件 `Welcome` 接收父组件 `App` 传递过来的 `this.props.name` ，在父组件 `App` 中，这个 `name` 对应的是自己内部的状态 `this.state.name` ，如果我们要改变 `Welcome` 中接收到的 `name`，需要在 `App` 中通过 `setState` 来对 `name` 进行修改，这样来引起子组件中 `props` 的变化

## React + TypeScript

TypeScript原生支持JSX，可以自动帮我们把JSX表达式转换成原生JS，在React中使用TS也非常的简单，demo中已经有写好的例子，下面我们一步一步来看一下，如何借助于原生Modules和TS来开发一个React页面，而先不使用构建工具 `webpack`

### 创建工程

```shell
npx create-react-app my-app --template typescript
```

### 编写代码

- 首先在工程根目录创建 `index.html`，因为我们未使用构建工具，所以需要全局引入React和ReactDOM，这里可以直接引入CDN上的资源，如

```html
<script src="https://cdn.staticfile.org/react/17.0.2/umd/react.development.min.js"></script>
<script src="https://cdn.staticfile.org/react-dom/17.0.2/umd/react-dom.development.min.js"></script>
```

- 引入我们目标入口JS文件，记得加上 `module` 类型

```html
<script src="scripts/main.js" type="module"></script>
```

- 创建目录 `src` 用来存放我们的TS代码文件
- 添加代码文件 `src/main.tsx`，注意，如果要在TS中使用JSX语法，需要使用 `.tsx` 的文件后缀，而不是 `.ts`，使用TS来编写React组件，我们需要定义几个类型，最关键的就是关于 `state` 和 `props`，比如下面的示例

**Welcome.tsx**

```ts
interface Props {
  name: string
}

class Welcome extends React.Component<Props> {
  render() {
    return <div>Hello {this.props.name}</div>
  }
}
```

**main.tsx**

```ts
import Welcome from './Welcome.js'

interface State {
  name: string
}

class App extends React.Component<any, State> {
  state: State = {
    name: 'Tom'
  }

  render() {
    return (
      <div>
        <Welcome name={this.state.name} />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
```

`React.Component` 可以传入两个类型变量，第一个是 `props` 的类型， 第二个是 `state` 的类型

## 函数式组件

每次组件的更新其实都是函数的重新执行。

## 设计哲学

React应用是由一个一个的组件组成的组件树，通常我们可以按作用不同将组件分为两类

- 页面组件：这种组件一般是用来实现页面的整体布局框架和容器，通常不具备可复用性
- 功能组件：这种组件是一些独立的UI功能单元，通常具备比较强的可复用性，功能组件一般会被嵌入到页面组件中使用

当我们要开发一个React应用时，首先需要考虑的就是应该如何划分组件层级，也就是该将哪些部分划分到一个功能组件中，通常来说，一个功能组件应该只负责一个功能，如果他需要负责更多的功能，这时候就需要考虑是否将它拆分到更小的组件。但是也应该避免过度拆分组件，这样会增加代码的复杂度，反而给维护增加工作量。

确定好组件的划分之后，我们一般会先实现一个静态版本的组件，这个版本暂不包含各种动态的数据绑定或事件处理，只是先单纯的实现组件的UI布局。静态版本实现之后，我们要考虑该如何放置组件的状态，应该在组件内维护 `state` 还是应该通过父组件传入 `props`，确定好之后，我们再使用状态数据替换静态组件中需要填充的部分。
