## Modules

[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules)

ES6之前JavaScript并没有官方的模块化方案，随着网页应用的规模不断扩大，我们需要把js代码拆分到不同的文件，进行多人协作开发，但这样带来很多的问题，比如不同js文件之间很容易出现命名冲突，为了解决这类问题，通常需要借助于匿名函数来创建私有作用域，现在ES6提供了官方的模块化机制。

模块机制有以下特点，与面向对象的概念类似：

- 每个模块都有自己的作用域，外部模块不能直接访问
- 模块可以导出变量或方法给外部模块访问，导出的方法可以访问自身模块的内部成员
- 模块可以导入其他模块导出的方法或变量

下面我们来定义几个简单模块体验一下

`scripts/user.js`

```js
// 该模块只导出一个默认成员
export default class User {
  constructor() {
    this.name = ''
  }

  setName(name) {
    if (name.length >= 2) this.name = name
  }
}
```

`scripts/store.js`

```js
// 导入user模块的默认导出成员
import User from './user.js'

// _users是模块内部私有成员，不会和其他模块出现命名冲突
let _users = []

// 导出addUser方法
export function addUser(name) {
  let user = new User()
  user.setName(name)
  _users.push(user)
}

// 导出getUserCount方法
export function getUserCount() {
  return _users.length
}
```

`scripts/main.js`

```js
// 通过相对路径导入其他模块，有多个导出方法，可以使用*导出到一个命名空间store
import * as store from './store.js'
// 或者使用下面解构的写法
// import { addUser, getUserCount } from './store.js'

// _name和_users都是模块内部私有成员
let _name = 'Tom'
let _users = 0

// 调用store模块导出的方法addUser
store.addUser(_name)
// 调用store模块导出的方法getUserCount
_users = store.getUserCount()
console.log(_users)
```

然后我们在html中通过 `script` 标签引入入口模块 `scripts/main.js`

```html
<script src="scripts/main.js" type="module"></script>
```

注意，这里需要添加 `type="module"` 来声明该文件是一个模块化JS脚本，通过上面的例子我们可以看到，我么只需要加载一个入口模块 `scripts/main.js`，其他的依赖会形成树状的依赖关系依次加载。

**模块化是JavaScript规模化的基础。**

现代浏览器已经能够很好的支持原生模块了，但是为了兼容性和加载效率，我们在实际项目中通常还是会借助于打包工具如 `webpack`，将多个模块打包成一个文件。
