# react-router-dom Tutorial

- [Doc for version 6.3](https://reactrouter.com/docs/en/v6)

## Introduction

React Router是React的一个功能齐全的客户端和服务器端路由库，是一个用于构建用户界面的JavaScript库。
React路由可以运行在任何React运行的地方：

- 在web上，
- 在服务器上使用node.js，
- 在React Native上。

React Router兼容 React >= 16.8.

## 配置导航

打开' `src/App.js` '，导入' `Link` '并添加一些全局导航。

```tsx
import { Link } from "react-router-dom";
export default function App() {
  return (
    <div>
      <h1>Bookkeeper</h1>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <Link to="/invoices">Invoices</Link> |{" "}
        <Link to="/expenses">Expenses</Link>
      </nav>
    </div>
  );
}
```

React Router现在可以控制URL!

当URL改变时，我们还没有任何呈现的路由，但是Link改变了URL而没有导致整个页面重新加载。

## 配置路由

```tsx
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import App from "./App";
import Expenses from "./routes/expenses";
import Invoices from "./routes/invoices";
const root = ReactDOM.createRoot(
  document.getElementById("root")
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="expenses" element={<Expenses />} />
      <Route path="invoices" element={<Invoices />}>
        <Route path=":invoiceId" element={<Invoice />} />
        <Route path="sent" element={<SentInvoices />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
```

注意在 `"/"` 它渲染的是 `<App>`. 在 `"/invoices"` 它渲染的是 `<Invoices>`。

## 嵌套路由

这是React Router最强大的功能之一，因此您不必弄乱复杂的布局代码。您的绝大多数布局都与URL的片段相关联，React Router完全接受了这一点。

```jsx
function App() {
  return (
    <Routes>
      <Route path="invoices" element={<Invoices />}>
        <Route path=":invoiceId" element={<Invoice />} />
        <Route path="sent" element={<SentInvoices />} />
      </Route>
    </Routes>
  );
}
```

此路由配置定义了三个路由路径：

- `"/invoices"`
- `"/invoices/sent"`
- `"/invoices/:invoiceId"`

When the URL is the component tree will be:`"/invoices/sent"`

```jsx
<App>
  <Invoices>
    <SentInvoices />
  </Invoices>
</App>
```

When the URL is , the component tree will be:`"/invoices/123"`

```jsx
<App>
  <Invoices>
    <Invoice />
  </Invoices>
</App>
```

请注意,内部组件随 URL （ and ） 更改。父路由（）负责确保匹配的子路由是用`<Outlet>`渲染的。

**完整例子**

```jsx
import { Routes, Route, Outlet } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="invoices" element={<Invoices />}>
        <Route path=":invoiceId" element={<Invoice />} />
        <Route path="sent" element={<SentInvoices />} />
      </Route>
    </Routes>
  );
}

function Invoices() {
  return (
    <div>
      <h1>Invoices</h1>
      <Outlet />
    </div>
  );
}

function Invoice() {
  let { invoiceId } = useParams();
  return <h1>Invoice {invoiceId}</h1>;
}

function SentInvoices() {
  return <h1>Sent Invoices</h1>;
}
```

## Adding a "No Match" Route（404）

That didn't go as you might have expected. If you click those links the page goes blank! That's because none of the routes we've defined match a URL like the ones we're linking to: `"/invoices/123"`.

Before we move on, it's good practice to always handle this "no match" case. Go back to your route config and add this:

```js
<Routes>
  <Route path="/" element={<App />}>
    <Route path="expenses" element={<Expenses />} />
    <Route path="invoices" element={<Invoices />} />
    <Route
      path="*"
      element={
        <main style={{ padding: "1rem" }}>
          <p>There's nothing here!</p>
        </main>
      }
    />
  </Route>
</Routes>
```

The `"*"` has special meaning here. It will match only when no other routes do.

## Reading URL Params

```jsx
import { Routes, Route, useParams } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route
        path="invoices/:invoiceId"
        element={<Invoice />}
      />
    </Routes>
  );
}

function Invoice() {
  let params = useParams();
  return <h1>Invoice {params.invoiceId}</h1>;
}
```

请注意，路径段和参数的键匹配。`:invoiceId`=>`params.invoiceId`  

一个非常常见的用例是在组件呈现时获取数据：

```jsx
function Invoice() {
  let { invoiceId } = useParams();
  let invoice = useFakeFetch(`/api/invoices/${invoiceId}`);
  return invoice ? (
    <div>
      <h1>{invoice.customerName}</h1>
    </div>
  ) : (
    <Loading />
  );
}
```

## Index Routes

可以将索引路由视为“默认子路由”。当父路由具有多个子路由，但 URL 位于父路由的路径处时，您可能希望将某些内容呈现到`<Outlet>`中。

```jsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="invoices" element={<Invoices />} />
        <Route path="activity" element={<Activity />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  return (
    <div>
      <GlobalNav />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
```

在“/”处它只是一个空白页面，因为那里没有要呈现的子路由。为此，我们可以添加一个索引路由：`<main>`

```jsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Activity />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="activity" element={<Activity />} />
      </Route>
    </Routes>
  );
}
```

您可以在路由层次结构的任何级别拥有索引路由，该路由将在父级匹配时呈现，但其他子级都不匹配。

Maybe you're still scratching your head. There are a few ways we try to answer the question "what is an index route?". Hopefully one of these sticks for you:

- 索引路由呈现在父路由出口的父路由路径上。

- 当父路由匹配但其他子路由都不匹配时，索引路由才会匹配。

- 索引路由是父路由的默认子路由。

- 当用户还没有点击导航列表中的某个条目时，就会呈现索引路由。

## Active Links

It's very common, especially in navigation lists, to display the link as the active link the user is looking at. Let's add this treatment to our invoices list by swapping out `Link` for `NavLink`.

```jsx
import { NavLink, Outlet } from "react-router-dom";
import { getInvoices } from "../data";
export default function Invoices() {
  let invoices = getInvoices();
  return (
    <div style={{ display: "flex" }}>
      <nav
        style={{
          borderRight: "solid 1px",
          padding: "1rem",
        }}
      >
        {invoices.map((invoice) => (
          <NavLink
            style={({ isActive }) => {
              return {
                display: "block",
                margin: "1rem 0",
                color: isActive ? "red" : "",
              };
            }}
            to={`/invoices/${invoice.number}`}
            key={invoice.number}
          >
            {invoice.name}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}
```

We did three things there:

1. 我们把Link换成了NavLink。

2. 我们将简单对象的样式改为返回对象的函数。

3. 我们通过查看NavLink传递给我们的样式函数的isActive值来改变链接的颜色。

你可以在NavLink上对className做同样的事情:

```jsx
// normal string
<NavLink className="red" />
// function
<NavLink className={({ isActive }) => isActive ? "red" : "blue"} />
```

## Search Params

Search params are like URL params but they sit in a different position in the URL. Instead of being in the normal URL segments separated by `/`, they are at the end after a `?`. You've seen them across the web like `"/login?success=1"` or `"/shoes?brand=nike&sort=asc&sortby=price"`.

使用`useSearchParams`, React Router可以很容易地读取和操作搜索参数。它的工作原理很像`React.useState()`，但它在URL搜索参数中存储和设置状态，而不是在内存中。

让我们通过在 invoices nav list中添加一个小过滤器来看看它的实际效果。

```jsx
import {
  NavLink,
  Outlet,
  useSearchParams,
} from "react-router-dom";
import { getInvoices } from "../data";
export default function Invoices() {
  let invoices = getInvoices();
  let [searchParams, setSearchParams] = useSearchParams();
  return (
    <div style={{ display: "flex" }}>
      <nav
        style={{
          borderRight: "solid 1px",
          padding: "1rem",
        }}
      >
        <input
          value={searchParams.get("filter") || ""}
          onChange={(event) => {
            let filter = event.target.value;
            if (filter) {
              setSearchParams({ filter });
            } else {
              setSearchParams({});
            }
          }}
        />
        {invoices
          .filter((invoice) => {
            let filter = searchParams.get("filter");
            if (!filter) return true;
            let name = invoice.name.toLowerCase();
            return name.startsWith(filter.toLowerCase());
          })
          .map((invoice) => (
            <NavLink
              style={({ isActive }) => ({
                display: "block",
                margin: "1rem 0",
                color: isActive ? "red" : "",
              })}
              to={`/invoices/${invoice.number}`}
              key={invoice.number}
            >
              {invoice.name}
            </NavLink>
          ))}
      </nav>
      <Outlet />
    </div>
  );
}
```

当用户输入时

- `setSearchParams()` 将 `?filter=...` 在URL中搜索参数并重新渲染路由器.
- `useSearchParams` 现在返回一个 [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) 和 `"filter"` 作为其值之一。
- 我们将输入的值设置为过滤器搜索参数中的任何值 (it's just like `useState` but in the URLSearchParams instead!)
- 我们根据筛选器搜索参数筛选list of invoices。

## Custom Behavior

If you filter the list and then click a link, you'll notice that the list is no longer filtered and the search param is cleared from the `<input>` and the URL. You might want this, you might not! Maybe you want to keep the list filtered and keep the param in the URL.

We can persist the query string when we click a link by adding it to the link's href. We'll do that by composing `NavLink` and `useLocation` from React Router into our own `QueryNavLink` (maybe there's a better name, but that's what we're going with today).

```js
import { useLocation, NavLink } from "react-router-dom";
function QueryNavLink({ to, ...props }) {
  let location = useLocation();
  return <NavLink to={to + location.search} {...props} />;
}
```

You can put that code anywhere you want in your app and then replace your `NavLink` in `src/routes/invoices.jsx` with `QueryNavLink` and you're done.

Like `useSearchParams`, `useLocation` returns a location that tells us information about the URL. A location looks something like this:

```js
{
  pathname: "/invoices",
  search: "?filter=sa",
  hash: "",
  state: null,
  key: "ae4cz2j"
}
```

With that information, the task in `QueryNavLink` is pretty simple: add the `location.search` onto the `to` prop. You might be thinking, "Geez, seems like this should be a built-in component of React Router or something?". Well, let's look at another example.

What if you had links like this on an ecommerce site.

```jsx
<Link to="/shoes?brand=nike">Nike</Link>
<Link to="/shoes?brand=vans">Vans</Link>
```

And then you wanted to style them as "active" when the url search params match the brand? You could make a component that does exactly that pretty quickly with stuff you've learned in this tutorial:

```jsx
function BrandLink({ brand, ...props }) {
  let [params] = useSearchParams();
  let isActive = params.getAll("brand").includes(brand);
  return (
    <Link
      style={{ color: isActive ? "red" : "" }}
      to={`/shoes?brand=${brand}`}
      {...props}
    />
  );
}
```

That's going to be active for `"/shoes?brand=nike"` as well as `"/shoes?brand=nike&brand=vans"`. Maybe you want it to be active when there's only one brand selected:

```js
let brands = params.getAll("brand");
let isActive =
  brands.includes(brand) && brands.length === 1;
// ...
```

Or maybe you want the links to be _additive_ (clicking Nike and then Vans adds both brands to the search params) instead of replacing the brand:

```jsx
function BrandLink({ brand, ...props }) {
  let [params] = useSearchParams();
  let isActive = params.getAll("brand").includes(brand);
  if (!isActive) {
    params.append("brand", brand);
  }
  return (
    <Link
      style={{ color: isActive ? "red" : "" }}
      to={`/shoes?${params.toString()}`}
      {...props}
    />
  );
}
```

Or maybe you want it to add the brand if it's not there already and remove it if it's clicked again!

```jsx
function BrandLink({ brand, ...props }) {
  let [params] = useSearchParams();
  let isActive = params.getAll("brand").includes(brand);
  if (!isActive) {
    params.append("brand", brand);
  } else {
    params = new URLSearchParams(
      Array.from(params).filter(
        ([key, value]) => key !== "brand" || value !== brand
      )
    );
  }
  return (
    <Link
      style={{ color: isActive ? "red" : "" }}
      to={`/shoes?${params.toString()}`}
      {...props}
    />
  );
}
```

As you can see, even in this fairly simple example there are a lot of valid behaviors you might want. React Router doesn't try to solve every use-case we've ever heard of directly. Instead, we give you the components and hooks to compose whatever behavior you need.

## Navigating Programmatically

Okay, back to our app. Hang in there, you're almost done!

Most of the time the URL changes is in response to the user clicking a link. But sometimes you, the programmer, want to change the URL. A very common use case is after a data update like creating or deleting a record.

Let's add a button that marks the invoice as paid and then navigates to the index route.

First you can copy and paste this function that deletes an invoice from our fake data store:

```js
export function deleteInvoice(number) {
  invoices = invoices.filter(
    (invoice) => invoice.number !== number
  );
}
```

Now let's add the delete button, call our new function, and navigate to the index route:

```js
import {
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { getInvoice, deleteInvoice } from "../data";
export default function Invoice() {
  let navigate = useNavigate();
  let location = useLocation();
  let params = useParams();
  let invoice = getInvoice(parseInt(params.invoiceId, 10));
  return (
    <main style={{ padding: "1rem" }}>
      <h2>Total Due: {invoice.amount}</h2>
      <p>
        {invoice.name}: {invoice.number}
      </p>
      <p>Due Date: {invoice.due}</p>
      <p>
        <button
          onClick={() => {
            deleteInvoice(invoice.number);
            navigate("/invoices" + location.search);
          }}
        >
          Delete
        </button>
      </p>
    </main>
  );
}
```

注意，我们再次使用 `useLocation`来持久化查询字符串来添加 `location.search` 指向导航链接.
