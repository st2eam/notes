## Hooks

### useHref

`useHref`钩子返回一个URL，该URL可用于链接到给定的目标位置，甚至在React路由器之外。

### useInRouterContext

如果组件在的上下文中被渲染，那么`use In Router Context`钩子返回true，否则返回false。

### useLinkClickHandler

在react路由器dom中构建自定义链接时，`use Link Click Handler`钩子返回一个用于导航的Click事件处理程序。

### [useLinkPressHandler](https://reactrouter.com/docs/en/v6/hooks/use-link-press-handler#uselinkpresshandler)

跟`useLinkClickHandler`差不多

### useLocation

这个钩子返回当前`location`对象。如果您想在当前位置发生变化时执行一些副作用，这将非常有用。

```jsx
import * as React from 'react';
import { useLocation } from 'react-router-dom';

function App() {
  let location = useLocation();

  React.useEffect(() => {
    ga('send', 'pageview');
  }, [location]);

  return (
    // ...
  );
}
```

### useMatch

Returns match data about a route at the given path relative to the current location.

### useNavigate

`useNavigate` hook 返回一个函数可以让你使用编程式导航  

如果使用`replace: true`,navigation导航将替换历史堆栈中的当前条目，而不是添加新条目。

```js
import { useNavigate } from "react-router-dom";

function SignupForm() {
  let navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    await submitForm(event.target);
    navigate("../success", { replace: true });
  }

  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
}
```

The `navigate` function has two signatures:

1. 传递一个To值(与相同类型)，并带有一个可选的第二个{replace, state}参数或

2. 传递您想要进入历史堆栈的增量。例如，navigate(-1)等同于点击后退按钮。

### useNavigate

这个钩子返回当前的导航类型，或者用户是如何来到当前页面的；或者通过历史栈上的弹出、推送或替换动作。

### useOutlet

返回该路由层次结构的子路由的元素。这个钩子被\<Outlet\>内部地用来呈现子路由。

### useOutletContext

通常，父路由管理要与子路由共享的状态或其他值。如果您愿意，可以创建自己的[上下文提供程序](https://reactjs.org/docs/context.html)，但这是一种常见的情况，它内置于：`<Outlet />`

src/routes/dashboard.tsx

```js
import * as React from "react";
import type { User } from "./types";
import { Outlet, useOutletContext } from "react-router-dom";

type ContextType = { user: User | null };

export default function Dashboard() {
  const [user, setUser] = React.useState<User | null>(null);

  return (
    <div>
      <h1>Dashboard</h1>
      <Outlet context={{ user }} />
    </div>
  );
}

export function useUser() {
  return useOutletContext<ContextType>();
}
```

src/routes/dashboard/messages.tsx

```js
import { useUser } from "../dashboard";

export default function DashboardMessages() {
  const { user } = useUser();
  return (
    <div>
      <h2>Messages</h2>
      <p>Hello, {user.name}!</p>
    </div>
  );
}
```

### useParams

The `useParams` hook returns an object of key/value pairs of the dynamic params from the current URL that were matched by the `<Route path>`. Child routes inherit all params from their parent routes.

```jsx
import * as React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';

function ProfilePage() {
  // Get the userId param from the URL.
  let { userId } = useParams();
  // ...
}

function App() {
  return (
    <Routes>
      <Route path="users">
        <Route path=":userId" element={<ProfilePage />} />
        <Route path="me" element={...} />
      </Route>
    </Routes>
  );
}
```

### useResolvedPath

该钩子将给定to值中位置的路径名与当前位置的路径名进行解析。

这在从相对值建立链接时很有用。例如，看看NavLink的源代码，它在内部调用了`useResolvedPath`来解析被链接的页面的完整路径名。

### useRoutes

`useRoutes` hook 是一个和`<Routes>`等效的函数，但它使用JS对象而不是Route元素来定义你的路由，这些对象拥有和Route元素相同的属性，但是他们不需要JSX。

`useRoutes`的返回值是一个有效的React元素，你可以用它来渲染路由树，如果没有匹配，则为空。

```js
import * as React from "react";
import { useRoutes } from "react-router-dom";

function App() {
  let element = useRoutes([
    {
      path: "/",
      element: <Dashboard />,
      children: [
        {
          path: "messages",
          element: <DashboardMessages />,
        },
        { path: "tasks", element: <DashboardTasks /> },
      ],
    },
    { path: "team", element: <AboutPage /> },
  ]);

  return element;
}
```

### useSearchParams

`useSearchParams`钩子用于读取和修改URL中当前位置的查询字符串。与React自己的`useState`钩子一样，`useSearchParams`返回一个由两个值组成的数组：当前位置的[`search params`](https://developer.mozilla.org/en-US/docs/Web/API/URL/searchParams)和一个可用于更新它们的函数。

```jsx
import * as React from "react";
import { useSearchParams } from "react-router-dom";

function App() {
  let [searchParams, setSearchParams] = useSearchParams();

  function handleSubmit(event) {
    event.preventDefault();
    // The serialize function here would be responsible for
    // creating an object of { key: value } pairs from the
    // fields in the form that make up the query.
    let params = serializeFormQuery(event.target);
    setSearchParams(params);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>{/* ... */}</form>
    </div>
  );
}
```
