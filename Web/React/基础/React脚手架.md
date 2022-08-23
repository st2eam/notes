## 使用create-react-app创建react应用

### react脚手架

- xxx脚手架: 用来帮助程序员快速创建一个基于xxx库的模板项目

- 包含了所有需要的配置（语法检查、jsx编译、devServer…）

- 下载好了所有相关的依赖

- 可以直接运行一个简单效果

- react提供了一个用于创建react项目的脚手架库: create-react-app

- 项目的整体技术架构为:  react + webpack + es6 + eslint

- 使用脚手架开发的项目的特点: 模块化, 组件化, 工程化

### 创建项目并启动

- 第一步，全局安装：`npm i -g create-react-app`

- 第二步，切换到想创项目的目录，使用命令：`npx create-react-app react-app --template typescript`

- 第三步，进入项目文件夹：`cd hello-react`

- 第四步，启动项目：`npm start`

#### Creating a TypeScript app[​](https://create-react-app.dev/docs/getting-started#creating-a-typescript-app "Direct link to heading")

You can start a new TypeScript app using templates. To use our provided TypeScript template, append `--template typescript` to the creation command.

```shell
npx create-react-app my-app --template typescript
```

If you already have a project and would like to add TypeScript, see our [Adding TypeScript](https://create-react-app.dev/docs/adding-typescript) documentation.

#### 添加代理

`create-react-app` 默认支持的代理功能比较简单，只需要在 `package.json` 中添加一个属性

```json
"proxy": "http://localhost:3000"
```

这样本地开发环境无法被响应的请求就会被代理到proxy的地址，用于访问我们后端的API接口。

### react脚手架项目结构

public ---- 静态资源文件夹

favicon.icon ------ 网站页签图标

index.html -------- 主页面

logo192.png ------- 192*192 logo图

logo512.png ------- 512*512 logo图

manifest.json ----- 应用加壳的配置文件

robots.txt -------- 爬虫协议文件

src ---- 源码文件夹

App.css -------- App组件的样式

App.js --------- App组件

App.test.js ---- 用于给App做测试

index.css ------ 样式

index.js ------- 入口文件

logo.svg ------- logo图

reportWebVitals.js  --- 页面性能分析文件(需要web-vitals库的支持)

setupTests.js  ---- 组件单元测试的文件(需要jest-dom库的支持)

#### 前端代码框架

```shell
    ├── public (存放浏览器标题favicon.ico、静态json数据)
    │
    ├── src (存放视图、工具类、image)
    │    ├── api (与服务端对接的接口函数定义。建议视图文件夹与api文件夹相同)
    │    │
    │    ├── assets (本地静态资源)
    │    │   ├── styles (全局样式)
    │    │   └── images (图片、svg等)
    │    │
    │    ├── components (存放公用全局组件)
    │    │
    │    │── controllers (MVC对应的controllers)
    │    │
    │    ├── i18n (存放框架国际化内容)
    │    │   ├── lang (框架内置国际化)
    │    │   └── pages (自定义国际化)
    │    │       ├── formI18n (表单)
    │    │       ├── home (首页)
    │    │       └── login (登录页)
    │    │
    │    ├── libs (库文件，library的缩写)
    │    │
    │    ├── layout (存放框架布局视图)
    │    │   ├── component (布局公用组件)
    │    │   ├── footer (页脚)
    │    │   ├── lockScreen (锁屏)
    │    │   ├── logo (logo)
    │    │   ├── main (主布局)
    │    │   ├── navBars (顶栏信息)
    │    │   │   ├── breadcrumb (面包屑、关闭全屏、菜单搜索、布局配置、用户信息、消息通知)
    │    │   │   └── tagsView (标签页)
    │    │   ├── navMenu (导航菜单)
    │    │   └── routerView (路由视图出口、外链、iframe内嵌)
    │    │
    │    ├── mock (存放模拟数据，非mock.js。用于城市多级联动)
    │    │
    │    ├── middlewares (存放中间件)
    │    │
    │    ├── models (MVC对应的models)
    │    │
    │    ├── router (存放路由信息)
    │    │
    │    ├── store (存放组件的状态vuex)
    │    │
    │    ├── utils (存放工具类函数)
    │    │
    │    └── views (存放页面视图,MVC对应的views)
    │
    ├── .env (全局默认配置文件，无论什么环境都会加载合并)
    ├── .env.development (开发环境的配置文件)
    ├── .env.production (生产环境的配置文件)
    ├── .eslintignore (eslint忽略配置)
    ├── .eslintrc.js (eslint配置)
    ├── .gitignore (git提交忽略配置)
    ├── .prettierrc.js (prettier代码格式化配置)
    ├── CHANGELOG.md (框架更新日志)
    ├── index.html (用户页面访问入口)
    ├── LICENSE (开源许可证)
    ├── package-lock.json (npm锁定安装时的包的版本号)
    ├── package.json (包的依赖管理配置文件)
    ├── plugins.d.ts (声明文件或模块的语法)
    ├── README.md (框架介绍文件)
    ├── shim.d.ts (声明文件或模块的语法)
    ├── source.d.ts (声明文件或模块的语法)
    ├── tsconfig.json (ts配置文件)
    └── vite.config.ts (vite配置文件)
```

### 功能界面的组件化编码流程（通用）

1. 拆分组件: 拆分界面,抽取组件

2. 实现静态组件: 使用组件实现静态页面效果

3. 实现动态组件
   
   1. 动态显示初始化数据
      
      1. 数据类型
      
      2. 数据名称
      
      3. 保存在哪个组件
   
   2. 交互(从绑定事件监听开始)
