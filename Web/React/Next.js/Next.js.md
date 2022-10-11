## Next.js

为了解决 SEO 的问题，顺带首屏渲染的问题,Vue 的 Nuxt.js，React 的 Next.js 等 SSR 框架应运而生。

服务端渲染（SSR），服务端直接返回了 HTML，浏览器显示即可，无需等待 JavaScript 完成下载且执行才显示内容，不仅渲染速度大大加快，更利于搜索引擎的爬取，右键查看源码可以看到密密麻麻的 HTML 标签。

快速刷新（Fast Refresh）是 Next.js 的一项功能，当你编辑 React 组件时，可以为你提供即时的反馈。 默认情况下，快速刷新（Fast Refresh）功能在所有 Next.js **9.4 或更新版本** 的应用程序中是开启的。启用 Next.js 的快速刷新（Fast Refresh）后， 大多数编辑器应该在一秒钟内就可以感知到了，**并且不会丢失组件的 状态**。

#### 优点

- 更快的首屏加载速度
- 更友好的 SEO

#### 缺点

- 增加了维护成本
- 项目部署比单页面应用复杂

## Quick Start

使用 TypeScript 开发项目，可以通过 `--typescript` 参数创建 TypeScript 项目：

```bash
npx create-next-app@latest --typescript
# or
yarn create next-app --typescript
```

到目前为止，我们得到了：

- 自动编译和打包（利用 webpack 和 babel）
- [React 快速刷新](https://www.nextjs.cn/blog/next-9-4#fast-refresh)
- [`./pages/`](https://www.nextjs.cn/docs/basic-features/pages) 中的 [静态生成和服务器端渲染](https://www.nextjs.cn/docs/basic-features/data-fetching)
- [静态文件服务](https://www.nextjs.cn/docs/basic-features/static-file-serving)。`./public/` 被映射到 `/`

## 页面（Pages）

在 Next.js 中，无需配置路由，默认是采用文件系统映射的路由模式，一个 **page（页面）** 就是一个从 `.js`、`jsx`、`.ts` 或 `.tsx` 文件导出（export）的 React 组件 ，这些文件存放在 `pages` 目录下。每个 page（页面）都使用其文件名作为路由（route）。

### 具有动态路由的页面

Next.js 支持具有动态路由的 pages（页面）。例如，如果你创建了一个命名为 `pages/posts/[id].js` 的文件，那么就可以通过 `posts/1`、`posts/2` 等类似的路径进行访问。

预定义的 API 路由优先于动态 API 路由

- pages/post/create.js， 将匹配 /post/create
- pages/post/[pid].js`，将匹配 /post/1,但不匹配 /post/create

## 预渲染

默认情况下，Next.js 将 **预渲染** 每个 page（页面）。这意味着 Next.js 会预先为每个页面生成 HTML 文件，而不是由客户端 JavaScript 来完成。预渲染可以带来更好的性能和 SEO 效果。

每个生成的 HTML 文件都与该页面所需的最少 JavaScript 代码相关联。当浏览器加载一个 page（页面）时，其 JavaScript 代码将运行并使页面完全具有交互性。（此过程称为 *水合（hydration）*。）

### 两种形式的预渲染

Next.js 具有两种形式的预渲染： **静态生成（Static Generation）** 和 **服务器端渲染（Server-side Rendering）**。这两种方式的不同之处在于为 page（页面）生成 HTML 页面的 **时机** 。

- **静态生成（推荐）**： HTML 是在 **构建时（build time）** 生成的，并重用于每个页面请求。要使页面使用“静态生成”，只需导出（export）页面组件或导出（export） `getStaticProps` 函数（如果需要还可以导出 `getStaticPaths` 函数）。对于可以在用户请求之前预先渲染的页面来说，这非常有用。你也可以将其与客户端渲染一起使用以便引入其他数据。
- **服务器端渲染**： HTML 是在 **每个页面请求** 时生成的。要设置某个页面使用服务器端渲染，请导出（export） `getServerSideProps` 函数。由于服务器端渲染会导致性能比“静态生成”慢，因此仅在绝对必要时才使用此功能。

重要的是，Next.js 允许你为每个页面 **选择** 预渲染的方式。你可以创建一个 “混合渲染” 的 Next.js 应用程序：对大多数页面使用“静态生成”，同时对其它页面使用“服务器端渲染”。

出于性能考虑，相对服务器端渲染，我们更 **推荐** 使用 **静态生成** 。 CDN 可以在没有额外配置的情况下缓存静态生成的页面以提高性能。但是，在某些情况下，服务器端渲染可能是唯一的选择。

你还可以将 **客户端渲染** 与静态生成或服务器端渲染一起使用。这意味着页面的某些部分可以完全由客户端 JavaScript 呈现。要了解更多信息，请查看 [数据获取](https://www.nextjs.cn/docs/basic-features/data-fetching#fetching-data-on-the-client-side) 章节的文档。

## 静态生成

### 生成不带数据的静态页面

在这种情况下，Next.js 只需在构建时为每个页面生成一个 HTML 文件即可。

### 需要获取数据的静态生成

某些页面需要获取外部数据以进行预渲染。有两种情况，一种或两种都可能适用。在每种情况下，你都可以使用 Next.js 所提供的以下函数：

1. 您的页面 **内容** 取决于外部数据：使用 `getStaticProps`。
2. 你的页面 **paths（路径）** 取决于外部数据：使用 `getStaticPaths` （通常还要同时使用 `getStaticProps`）。

#### 场景1：页面内容取决于外部数据

```jsx
function Blog({ posts }) {
  // Render posts...
}

// 此函数在构建时被调用
export async function getStaticProps() {
  // 调用外部 API 获取博文列表
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // 通过返回 { props: { posts } } 对象，Blog 组件
  // 在构建时将接收到 `posts` 参数
  return {
    props: {
      posts,
    },
  }
}

export default Blog
```

#### 场景2：页面路径取决于外部数据

Next.js 支持具有动态路由的 pages（页面）。例如，如果你创建了一个命名为 `pages/posts/[id].js` 的文件，那么就可以通过 `posts/1`、`posts/2` 等类似的路径进行访问。

```jsx
// 此函数在构建时被调用
export async function getStaticPaths() {
  // 调用外部 API 获取博文列表
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // 据博文列表生成所有需要预渲染的路径
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}
```

同样在 `pages/posts/[id].js` 中，你还需要export（导出） `getStaticProps` 以便可以获取 `id` 所对应的博客文章的数据并进行预渲染：

```jsx
function Post({ post }) {
  // Render post...
}

export async function getStaticPaths() {
  // ...
}

// 在构建时也会被调用
export async function getStaticProps({ params }) {
  // params 包含此片博文的 `id` 信息。
  // 如果路由是 /posts/1，那么 params.id 就是 1
  const res = await fetch(`https://.../posts/${params.id}`)
  const post = await res.json()

  // 通过 props 参数向页面传递博文的数据
  return { props: { post } }
}

export default Post
```

### 什么时候应该使用静态生成

建议尽可能使用 **静态生成** （带有或不带数据），因为你的所有 page（页面）都可以只构建一次并托管到 CDN 上，这比让服务器根据每个页面请求来渲染页面快得多。

还可以对多种类型的页面使用“静态生成”，包括：

- 营销页面
- 博客文章和个人简历
- 电商产品列表
- 帮助和文档

您应该问问自己：“我可以在用户请求之前预先渲染此页面吗？” 如果答案是肯定的，则应选择“静态生成”。

另一方面，如果你无法在用户请求之前预渲染页面，则“静态生成” **不是** 一个好主意。这也许是因为你的页面需要显示频繁更新的数据，并且页面内容会随着每个请求而变化。

在这种情况下，您可以执行以下任一操作：

- 将“静态生成”与 **客户端渲染** 一起使用：你可以跳过页面某些部分的预渲染，然后使用客户端 JavaScript 来填充它们。要了解有关此方法的更多信息，请查看 [获取数据](https://www.nextjs.cn/docs/basic-features/data-fetching#fetching-data-on-the-client-side) 章节的文档。
- 使用 **服务器端渲染**： Next.js 针对每个页面的请求进行预渲染。由于 CDN 无法缓存该页面，因此速度会较慢，但是预渲染的页面将始终是最新的。我们将在下面讨论这种方法。

## 服务器端渲染

> 也被称为 “SSR” 或 “动态渲染”。

如果 page（页面）使用的是 **服务器端渲染**，则会在 **每次页面请求时** 重新生成页面的 HTML 。

要对 page（页面）使用服务器端渲染，你需要 `export` 一个名为 `getServerSideProps` 的 `async` 函数。服务器将在每次页面请求时调用此函数。

例如，假设你的某个页面需要预渲染频繁更新的数据（从外部 API 获取）。你就可以编写 `getServerSideProps` 获取该数据并将其传递给 `Page` ，如下所示:

```jsx
export const getServerSideProps: GetServerSideProps = async ctx => {
  const headers = ctx.req.headers.cookie
    ? ({ cookie: ctx.req.headers.cookie } as AxiosRequestHeaders)
    : undefined
  const _id = ctx.query._id as string
  const props = await ssrService.DetailProps(_id, headers)
  if (props.props.error === 20002) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }
  return props
}
```

如你所见，`getServerSideProps` 类似于 `getStaticProps`，但两者的区别在于 `getServerSideProps` 在每次页面请求时都会运行，而在构建时不运行。

要了解有关 `getServerSideProps` 的工作原理的更多信息，请查看我们的 [获取数据文档](https://www.nextjs.cn/docs/basic-features/data-fetching#getserversideprops-server-side-rendering)

## 路由跳转与传参

next 提供了两种方式，分别是导航式路由 next/link 和 编程式 next/router

1. Link

   href 为必须属性，可传递对象

   ```js
   <Link href="/about?name=jackylin">
   
   <Link href={{ pathname: '/article', query: { type: active } }}>
   复制代码
   ```

2. 编程式导航 next/router

   和 react hooks 中的 useHistory 用法一样

   ```js
   import { useRouter } from 'next/router'
   const router = useRouter()
   //: 1
   router.push(`/article/${c.queueId}`)
   //: 2
   router.push({
   pathname: '/publish',
      query: {
        contentId: c.contentId,
        status: active
      }
   })
   ```

#### 路由参数获取

Next.js 只能通过 query 来传递参数，不能使用 params。
useRouter 或 getServerSideProps 方法内都可以拿到 query 参数

```js
import { useRouter } from 'next/router'
const { query } = useRouter()
query.cid //: 获取 cid 参数

这种动态路由的参数通过 query 可以获取到，在 getServerSideProps 方法内也可以通过 params 获取
router.push(`/article/${c.queueId}`)
```

## css

Next.js 支持 Css Module 和 Css-in-JS 这两种方式，二者自带样式隔离。

### 动态导入

Next.js 同样支持和 React 客户端一样的 ES2020 import() 语法来实现导入，在 React 单页面项目里面，Webpack 解析到该语法时会自动进行代码分割。在 Next.js 里面， 还可以使用`next/dynamic` 来动态导入组件，它们将在客户端懒加载。通过动态导入，对于一些不需要在服务端渲染的组件可以使用 dynamic 来处理。

```js
const BreadCrumb = dynamic(() => import('@/components/ui/BreadCrumb'))
```
