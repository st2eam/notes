---
originalPath: 'Web/React/Next.js/Next,js 代理.md'
primaryCategory: 计算机与软件/前端/React
categories:
  - path: 计算机与软件/前端/React
    reason: >-
      核心学习对象为“Next,js 代理”，正文依据：“server.js
      package.json”；据其实体与学习对象归入计算机与软件/前端/React。
classificationStatus: confirmed
relations: []
tags:
  - 实体/React
---
 server.js

```ts
const httpProxy = require('http-proxy')
const http = require('http')
const next = require('next')

const isDev = process.env.APP_ENV !== 'production'

const app = next({
  dev: isDev
})
const handle = app.getRequestHandler()
const proxy = httpProxy.createProxyServer({
  changeOrigin: true
})

app
  .prepare()
  .then(() => {
    const server = http.createServer((req, res) => {
      if (req.url.startsWith('/api/')) {
        proxy.web(req, res, {
          target: process.env.API_SERVER
        })
      } else {
        handle(req, res)
      }
    })
    server.listen(process.env.PORT)
  })
  .catch(err => {
    console.trace(err)
  })
```

package.json

```json
  "scripts": {
    "dev": "node server.js",
      ···
  }
```
