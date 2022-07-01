## React生命周期

React 一次状态更新，一共分为 2 个阶段、4 个生命周期。

**2 个阶段：**

1. render阶段：包含Diff算法，计算出状态变化
2. commit渲染阶段：ReactDom渲染器，将状态变化渲染在视图中

**4个生命周期：**

1. Mout(第一次挂载)
2. Update(更新)
3. Unmout(卸载)
4. Error(子项发生错误)

| 生命周期函数                    | 所属阶段     | 所属生命周期          |
| ------------------------- | -------- | --------------- |
| constructor               | Render阶段 | Mount           |
| componentWillReceiveProps | Render阶段 | Update          |
| getDerivedStateFromProps  | Render阶段 | 并存于Moun、Update  |
| getDerivedStateFromError  | Render阶段 | Error           |
| shouldComponentUpdate     | Render阶段 | Update          |
| componentWillMount        | Render阶段 | Mount           |
| componentWillUpdate       | Render阶段 | Update          |
| render                    | Render阶段 | 并存于Mount、Update |
| componentDidMount         | Commit阶段 | Mount           |
| getSnapshotBeforeUpdate   | Commit阶段 | Update          |
| componentDidUpdate        | Commit阶段 | Update          |
| componentWillUnmount      | Commit阶段 | Unmount         |
| componentDidCatch         | Commit阶段 | Error           |

**注意事情：**

`componentWillReceiveProps`、`componentWillMount`、`componentWillUpdate` 这 3 个生命周期函数正在逐步被 React 官方放弃使用，不推荐继续使用这 3 个生命周期函数。

与之对应的是 `getDerivedStateFromProps`、`getDerivedStateFromError` 这 2 个这是被推荐使用的。

关于各个生命周期函数详细介绍，可以参考 [React 官方文档](https://zh-hans.reactjs.org/docs/react-component.html#commonly-used-lifecycle-methods)

**补充说明：**

**目前并不是所有的生命周期函数都对应有 hook 函数。**
