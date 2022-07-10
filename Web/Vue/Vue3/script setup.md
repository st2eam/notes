## \<script setup\>

\<script setup\>是在单文件组件 (SFC) 中使用组合式 API 的编译时语法糖。相比于普通的\<script\>语法，它具有更多优势：

- 更少的样板内容，更简洁的代码。
- 能够使用纯 Typescript 声明 props 和抛出事件。
- 更好的运行时性能 (其模板会被编译成与其同一作用域的渲染函数，没有任何的中间代理)。
- 更好的 IDE 类型推断性能 (减少语言服务器从代码中抽离类型的工作)。

### setup语法和普通语法的区别

- setup 包含的生命周期

- onBeforeMount——挂载开始前调用

- onMounted——挂载后调用

- onBeforeUpdate——当响应数据改变，且重新渲染前调用

- onUpdated——重新渲染后调用

- onBeforeUnmount——Vue实例销毁前调用

- onUnmounted——实例销毁后调用

- onActivated——当keep-alive组件被激活时调用

- onDeactivated——当keep-alive组件取消激活时调用

- onErrorCaptured——从子组件中捕获错误时调用

- setup使用ref对数据进行响应式绑定

```js
const loading = ref(true);
```

- setup中的data()

```js
const state = reactive({
 PostData: [] as IArticle[],
});
```

- setup中的props

```js
props: {
 Article: {
 type: Object as () => IArticle,
 required: true,
 },
 },
 setup(props) {
 return { props };
 },
```

- setup中的watch

大同小异

```js
watch(data, (newValue, oldValue) => {
 console.log(newValue,oldValue);
});
```

- setup中的computed

```js
const rank_img = computed(() => {
 return props.rank < 6
 ? require("../assets/images/rank-top" + props.rank + ".png")
 : "";
});
```
