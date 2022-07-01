# react-router-dom Tutorial

version 6.3

## Introduction

React Router是React的一个功能齐全的客户端和服务器端路由库，是一个用于构建用户界面的JavaScript库。
React路由可以运行在任何React运行的地方：

- 在web上，
- 在服务器上使用node.js，
- 在React Native上。

React Router兼容 React >= 16.8.

在此之后，您可以深入研究其他文档以获得更深入的理解。

在构建一个小的记账应用程序时，我们将涉及:

- 配置路由
- 导航与链接
- 创建具有活动样式的链接
- 使用嵌套路由进行布局
- 以编程方式导航
- 使用URL参数进行数据加载
- 使用URL搜索参数
- 通过组合创造你自己的行为
- 服务器渲染

## Installation

### Using a bundler

Feel free to use your bundler of choice like [Create React App] or [Vite].

```sh
# create react app
npx create-react-app router-tutorial
# vite
npm init vite@latest router-tutorial --template react
```

Then install React Router dependencies:

```sh
cd router-tutorial
npm install react-router-dom@6
```

Finally, start your app:

```sh
# probably this
npm start
# or this
npm run dev
```

## Connect the URL

首先，我们想要把你的应用连接到浏览器的URL:导入`BrowserRouter`并在你的整个应用中渲染它。

```tsx
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
const root = ReactDOM.createRoot(
  document.getElementById("root")
);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

你的应用程序中没有任何变化，但现在我们准备好修改URL了。

## Add Some Links

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

## Add Some Routes

添加两个新文件

```tsx
export default function Expenses() {
  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Expenses</h2>
    </main>
  );
}
```

```tsx
export default function Invoices() {
  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Invoices</h2>
    </main>
  );
}
```

最后，让我们教React Router如何通过在' `main.jsx` '或'`index.js`'中创建第一个"`Route Config`"来在不同的url中渲染我们的应用。

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
      <Route path="invoices" element={<Invoices />} />
    </Routes>
  </BrowserRouter>
);
```

注意在 `"/"` 它渲染的是 `<App>`. 在 `"/invoices"` 它渲染的是 `<Invoices>`. Nice work!

## Nested Routes

你可能已经注意到，当点击链接时，“App”中的布局消失了。重复共享布局是件令人头疼的事。我们已经了解到，大多数UI都是一系列嵌套的布局，几乎总是映射到URL的片段，所以这个想法被嵌入到React Router中。

让我们通过做两件事来实现一些自动的、持久的布局处理:

1. 将路由嵌套到App路由中

2. 呈现一个出口

首先让我们嵌套路由。`Expenses`是`Invoices`的兄弟，他们都是`app`路由的子组件

```jsx
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
      <Route path="/" element={<App />}>
        <Route path="expenses" element={<Expenses />} />
        <Route path="invoices" element={<Invoices />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
```

当路由有子路径时，它会做两件事:

1. 它嵌入了url (' "/" + "expenses" '和' "/" + "invoice " ')

2. 当子路由匹配时，它会为共享布局嵌套UI组件:

然而，在(2)生效之前，我们需要在`App.jsx` "parent" route中渲染一个"`Outlet.jsx`"

```jsx
import { Outlet, Link } from "react-router-dom";
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
      <Outlet />
    </div>
  );
}
```

现在再点击一下。 当两个子路由(`<Invoices>` and `<Expenses>`)交换时，父路由(`App.js`)仍然存在! !

正如我们稍后将看到的，这在路由层次的任何级别都可以工作，而且非常强大。

## Listing the Invoices

通常情况下，你会从某个服务器获取数据，但在本教程中，让我们编写一些伪代码，这样我们就可以专注于路由。

在' src/data.js '创建一个文件，并复制/粘贴到那里:

```js
let invoices = [
  {
    name: "Santa Monica",
    number: 1995,
    amount: "$10,800",
    due: "12/05/1995",
  },
  {
    name: "Stankonia",
    number: 2000,
    amount: "$8,000",
    due: "10/31/2000",
  },
  {
    name: "Ocean Avenue",
    number: 2003,
    amount: "$9,500",
    due: "07/22/2003",
  },
  {
    name: "Tubthumper",
    number: 1997,
    amount: "$14,000",
    due: "09/01/1997",
  },
  {
    name: "Wide Open Spaces",
    number: 1998,
    amount: "$4,600",
    due: "01/27/1998",
  },
];
export function getInvoices() {
  return invoices;
}
```

现在我们可以在`invoice`路由中使用它。让我们也添加一些样式来获得侧边栏导航布局。随意复制粘贴它们，但是要特别注意`<Link>`的`to`参数：

```js
import { Link } from "react-router-dom";
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
          <Link
            style={{ display: "block", margin: "1rem 0" }}
            to={`/invoices/${invoice.number}`}
            key={invoice.number}
          >
            {invoice.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
```

Cool! Now click an invoice link and see what happens.

😨😨😨

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

Alright, back to the individual invoice URLs. Let's add a route for a specific invoice. We just visited some URLs like `"/invoices/1998"` and `"/invoices/2005"`, let's make a new component at `src/routes/invoice.jsx` to render at those URLs:

```js
export default function Invoice() {
  return <h2>Invoice #???</h2>;
}
```

We'd like to render the invoice number instead of `"???"`. Normally in React you'd pass this as a prop: `<Invoice invoiceId="123" />`, but you don't control that information because it comes from the URL.

Let's define a route that will match these kinds of URLs and enable us to get the invoice number from it.

Create a new `<Route>` _inside_ of the "invoices" route like this:

```js
<Routes>
  <Route path="/" element={<App />}>
    <Route path="expenses" element={<Expenses />} />
    <Route path="invoices" element={<Invoices />}>
      <Route path=":invoiceId" element={<Invoice />} />
    </Route>
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

A couple things to note:

- We just created a route that matches urls like "/invoices/2005" and "/invoices/1998". The `:invoiceId` part of the path is a "URL param", meaning it can match any value as long as the pattern is the same.
- The `<Route>` adds a second layer of route nesting when it matches: `<App><Invoices><Invoice /></Invoices></App>`. Because the `<Route>` is nested the UI will be nested too.

Alright, 现在点击一个`invoice` 的链接, 注意URL改变了，但是新的`invoice` 组件还没有显示出来. Do you know why?

Alright!我们需要添加一个outlet到父布局路由

```tsx
import { Link, Outlet } from "react-router-dom";
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
          <Link
            style={{ display: "block", margin: "1rem 0" }}
            to={`/invoices/${invoice.number}`}
            key={invoice.number}
          >
            {invoice.name}
          </Link>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}
```

okey 至此结束。 再次打开`invoice`组件 and 让我们从URL中获取`:invoiceId`参数:

```ts
import { useParams } from "react-router-dom";
export default function Invoice() {
  let params = useParams();
  return <h2>Invoice: {params.invoiceId}</h2>;
}
```

Note that the key of the param on the `params` object is the same as the dynamic segment in the route path:

```
:invoiceId -> params.invoiceId
```

让我们使用这些信息来构建一个更有趣的invoice页面。打开`src/data.js`，添加一个新函数来按number查找invoices:

```js
// ...
export function getInvoices() {
  return invoices;
}
export function getInvoice(number) {
  return invoices.find(
    (invoice) => invoice.number === number
  );
}
```

现在回到 `invoice.jsx` 我们使用参数来查找一张invoice以展示更多的信息:

```js
import { useParams } from "react-router-dom";
import { getInvoice } from "../data";
export default function Invoice() {
  let params = useParams();
  let invoice = getInvoice(parseInt(params.invoiceId, 10));
  return (
    <main style={{ padding: "1rem" }}>
      <h2>Total Due: {invoice.amount}</h2>
      <p>
        {invoice.name}: {invoice.number}
      </p>
      <p>Due Date: {invoice.due}</p>
    </main>
  );
}
```

Note that we used `parseInt` around the param. It's very common for your data lookups to use a `number` type, but URL params are always `string`.

## Index Routes

Index routes are possibly the most difficult concept in React Router for people to understand. So if you've struggled before, we hope this can clarify it for you.

现在你可能正在看其中一张发票。点击应用全局导航中的“Invoices”链接。注意，主内容区域变成空白!我们可以用“index”路由来解决这个问题。

```jsx
<Routes>
  <Route path="/" element={<App />}>
    <Route path="expenses" element={<Expenses />} />
    <Route path="invoices" element={<Invoices />}>
      <Route
        index
        element={
          <main style={{ padding: "1rem" }}>
            <p>Select an invoice</p>
          </main>
        }
      />
      <Route path=":invoiceId" element={<Invoice />} />
    </Route>
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

Sweet! 现在 Index 路由填补了空白!

Notice it has the `index` prop instead of a `path`. That's because the index route shares the path of the parent. That's the whole point--it doesn't have a path.

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
