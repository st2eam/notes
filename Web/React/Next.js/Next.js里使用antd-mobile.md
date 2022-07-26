## Next.js

在 Next.js 中使用 antd-mobile 需要做一些额外的配置。

首先，需要安装 next-transpile-modules 依赖：

```bash
$ npm install --save-dev next-transpile-modules
# or
$ yarn add -D next-transpile-modules
# or
$ pnpm add -D next-transpile-modules
```

然后在 next.config.js 中进行配置：

```js
/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['antd-mobile'])

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true
}

module.exports = withTM(nextConfig)
```


