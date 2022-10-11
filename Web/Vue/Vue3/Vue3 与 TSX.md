
## Vue 3 Babel JSX 插件

[https://github.com/vuejs/babel-plugin-jsx](https://github.com/vuejs/babel-plugin-jsx)

### 安装插件

npm

```shell
npm install @vue/babel-plugin-jsx -D
```

yarn

```shell
yarn add @vue/babel-plugin-jsx -D
```

### 基本写法

TheWelcome是常规的Vue组件写法，内置emit：update以及slot

HomeView

```tsx
import TheWelcome from '../components/TheWelcome.vue'
import { defineComponent } from 'vue'

const HomeView = defineComponent({
  setup() {
    const update = (str: string) => {
      console.log(str)
    }
    return () => (
      <main>
        <TheWelcome onUpdate={update}>
          <h1 class="green">666</h1>
        </TheWelcome>
      </main>
    )
  },
})

export default HomeView
```

### Emit 与 TSX

在 Vue 模板中，我们会用 @ 去监听一个事件。在 React 的 TSX 中用 on 前缀来监听一个事件，如果是自定义事件，一般会定义一个新的函数。而在 Vue 中使用 emit 函数去发起一个事件。但是在 TSX 如何去监听呢。答案也是 on ，使用驼峰的形式进行调用。

```tsx
<TheWelcome onUpdate={update}/>
```

显然，onUpdate 这个 Props 是不存在的，我们也没有定义，但是在 Parent 中 emit 的事件为 update。就得到了这个 Props。

### Ref、Reactive 与 TSX

```tsx
import { defineComponent, reactive, ref } from 'vue'
const StudyView = defineComponent({
  setup() {
    const foo = ref(0)
    const state = reactive({
      bar: '1',
    })
    const increment = () => {
      foo.value++
      state.bar += '1'
    }
    return () => (
      <div>
        <button onClick={increment}>
          foo: {foo.value} && bar:{state.bar}
        </button>
      </div>
    )
  },
})

export default StudyView
```

与 vue 不一样的是 `ref` 的值需要使用 `.value` 来获取

### Render 与 TSX

官方文档给出的示例中，可以用以下方式来书写代码

```tsx
const vnode = <div>hello</div>
```

但是实际应用中，会出现路由改变但页面不渲染更新的问题

不追究问题本质的话可以使用以下两种方法来解决：

1.`defineComponent`以及`setup`编写组件代码

```tsx
import { defineComponent } from 'vue'
export default defineComponent({
  setup() {
    return () => <div>hello</div>
  },
})
```

2.`render()`

```tsx
const HomeView = {
  render() {
    return <div>Hello</div>
  },
}

export default HomeView

```

> 以上就是近几天在开发过程中遇到的全部问题了，但是肯定远远不止这些。
> 本文旨在于记录Vue3与TSX开发的探索，因为官方文档里基本啥也没写，（也许是我没有找到）不过实际上Vue开发中应该不会用到太多,那么就先告一段落了。
