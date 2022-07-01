目前位置我们所接触到的 React 中的状态都只在组件内部或者父子组件之间传递，但是有些特殊的状态我们需要在很多不同的组件中都能访问它，而且当这些状态发生变化的时候可以引起界面的刷新，比如我们可以把当前登录的用户信息放到全局状态中，其他组件可以直接引用。

如果想要实现全局状态的管理，我们可以借助于 React 提供的 `Context` 或者社区的 `Redux` ，`MobX` 也是一个非常流行的状态管理库，它使用非常简单，上手容易，我们来学习一下它的基本使用。

### 创建全局状态

我们首先要创建一个状态类，来管理我们的全局状态，如

```ts
import { makeAutoObservable } from "mobx";

class Store {
  username: string = "name";

  setUsername(name: string) {
    this.username = name;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new Store();
```

最后我们导出一个状态类的实例

### 绑定状态

如果想在某一个组件中绑定 store 中的状态，需要给类组件添加一个装饰器，然后就可以当成一个普通的状态来引用了

```ts
import * as React from "react";
import { observer } from "mobx-react";

import store from "../../store";

@observer
export default class Test extends React.Component {
  render() {
    return <div>Test: {store.username}</div>;
  }
}
```

通过 `import` 将全局状态导入，然后在代码中引用即可

### 修改状态

任何时候都应该避免直接修改 store 中的值，我们在 store 中定义一些方法，通过这些方法来对原始状态修改。这样做的好处是我们可以在方法中控制对状态修改的逻辑，避免引起混乱。

```ts
<button onClick={() => store.setUsername("Test")}>change</button>
```
