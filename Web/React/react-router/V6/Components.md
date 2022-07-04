## 组件

### \<Link\>

```jsx
<Link to="/profile">Visit your profile</Link>
```

### \<NavLink\>

这是一个特殊的`<Link>`,可以通过`isActive`知道它是否被触发，

```jsx
<NavLink
  to="tasks"
  className={({ isActive }) =>
  isActive ? activeClassName : undefined
  }
>
  Tasks
</NavLink>
```

如果使用了prop，它将确保在匹配该组件的子路径时，该组件不被匹配为 "active"。例如，要渲染一个只在网站根部活动的链接，而不是任何其他的URL。可以使用`end`

```jsx
<NavLink to="/" end>
  Home
</NavLink>
```

### \<Navigate\>

元素在呈现时会更改当前位置。它是围绕 [`useNavigate`](https://reactrouter.com/docs/en/v6/hooks/use-navigate) 的组件包装器，并接受所有与 props 相同的参数。`<Navigate>`是拥有基于组件的钩子的版本

```jsx
<Navigate to="/dashboard" replace={true} />
```

### \<Outlet\>

应在父路由元素中使用 ，以呈现其子路由元素。这允许在呈现子路由时显示嵌套 UI。如果父路由完全匹配，则如果没有索引路由，它将呈现子索引路由，或者什么都不呈现。`<Outlet>`

```jsx
function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* This element will render either <DashboardMessages> when the URL is
          "/messages", <DashboardTasks> at "/tasks", or null if it is "/"
      */}
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}>
        <Route
          path="messages"
          element={<DashboardMessages />}
        />
        <Route path="tasks" element={<DashboardTasks />} />
      </Route>
    </Routes>
  );
}
```

### \<Routes\> and \<Route\>

\<Routes\>和\<Route\>是React Router中基于当前位置渲染的主要方法。你可以把Route想象成if语句;如果它的路径匹配当前的URL，它将渲染它的元素。

\<Route\>中有个默认为`false`的参数`caseSensitive`可以用来区分大小写

无论何时当location改变时，\<Routes\>浏览他所有的子元素\<Route\>，去找到最佳匹配的一个然后去渲染它的UI。\<Route\>元素可以嵌套以指示嵌套的 UI，这些 UI 也对应于嵌套的 URL 路径。父路由通过呈现`<Outlet>`来呈现其子路由。

```jsx
<Routes>
  <Route path="/" element={<Dashboard />}>
    <Route
      path="messages"
      element={<DashboardMessages />}
    />
    <Route path="tasks" element={<DashboardTasks />} />
  </Route>
  <Route path="about" element={<AboutPage />} />
</Routes>
```

> 如果你更喜欢用常规的JavaScript对象去替代JSX元素，可以使用`useRoutes`

`<Route element>`默认为一个 [`<Outlet>`](https://reactrouter.com/docs/en/v6/components/outlet),这意味着即使没有显式的`element` prop，路由始终渲染它的子路由。

例如在以下配置中，父路由默认呈现一个Outlet，因此子路由将在没有任何周围UI的情况下渲染。但是子路由的路径是`/users/：id`,因为它仍然是建立在父路由的基础之上。

```jsx
<Route path="users">
  <Route path=":id" element={<UserProfile />} />
</Route>
```
