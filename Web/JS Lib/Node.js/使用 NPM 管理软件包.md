## 使用 NPM 管理软件包

npm（Node 包管理工具）是一个命令行工具，用于安装、创建和分享为 Node.js 编写的 JavaScript 代码包。在 npm 上有许多开放源码软件包，所以在项目启动之前，需要一些时间来探索，这样你就不会最后重新创建轮子来处理像日期或从 API 获取数据这样的事项。

### npm 有很多功能

[Yarn](https://yarnpkg.com/en/) 是 npm 的一个替代选择。

npm 的工作方式大致如下：

- 架设一个中心化的代码仓库服务器（registry），用来存放共享的代码，官方的 npm 网站为 [https://www.npmjs.com/](https://www.npmjs.com/)，在国内我们通常会使用阿里的 npm 镜像，下载速度会更快，切换方式如下npm config set registry [https://registry.npmmirror.com](https://registry.npmmirror.com)
- 开源软件的作者将自己的代码封装成 npm 包（package），并且确定一个在 registry 中唯一的名字，如 react，然后将代码 publish 到 registry
- 其他开发者想要使用 react 这个包，在自己的项目中运行 npm i react ，npm 就会自动帮他们下载代码。
- 下载完成的代码会出现在项目根目录的 node_modules 目录
- 包也可以依赖 npm 上面其他的包，npm 在安装的时候会自动解析、安装这些依赖

### 安装所有依赖

```bash
npm install
```

它会在 node_modules 文件夹（如果尚不存在则会创建）中安装项目所需的所有东西。

安装单个软件包

也可以通过运行以下命令安装特定的软件包：

```bash
npm install <package-name>
```

通常会在此命令中看到更多标志：

- `--save`安装并添加条目到 package.json 文件的 dependencies。
- `--save-dev` 安装并添加条目到 package.json 文件的 devDependencies。

区别主要是，devDependencies 通常是开发的工具（例如测试的库），而 dependencies 则是与生产环境中的应用程序相关。

### 更新软件包

通过运行以下命令，更新也变得很容易：

```bash
npm update
```

npm 会检查所有软件包是否有满足版本限制的更新版本,当然也可以指定单个软件包进行更新。

### 删除依赖

如果我们想要删除一个已安装的依赖，如 react，只需要在 package.json 所在的目录执行命令

```bash
npm remove vue
```

如果要删除一个全局安装的模块，需要再加上 -g 的参数，如

```bash
npm remove typescript -g
```

### 运行任务

package.json 文件支持一种用于指定命令行任务（可通过使用以下方式运行）的格式：

```bash
npm run <task-name>
```

使用此特性运行 Webpack 是很常见的：

```json
{
  "scripts": {
      "watch": "webpack --watch --progress --colors --config webpack.conf.js",
      "dev": "webpack --progress --colors --config webpack.conf.js",
      "prod": "NODE_ENV=production webpack -p --config webpack.conf.js",
    },
}
```

因此可以运行如下，而不是输入那些容易忘记或输入错误的长命令：

```bash
npm run watch
npm run dev
npm run prod
```

### 如何使用 package.json

> ——所有 Node.js 项目或 npm 包的核心

`package.json` 文件是所有 Node.js 项目和 npm 包的枢纽， 和 HTML 文档中的 `<head>` 区域用来描述网页的配置信息（元数据）一样，它存储项目的相关信息。 它由单个 JSON 对象组成，并以键值对的形式存储项目信息， 且至少包含两个必填字段：“name”和“version”——但是最好提供有关项目的其他信息，这将对用户或者维护者有所帮助。

[package.json](http://nodejs.cn/learn/the-package-json-guide) 文件是项目的清单。 它可以做很多完全互不相关的事情。 例如，它是用于工具的配置中心。 它也是 npm 和 yarn 存储所有已安装软件包的名称和版本的地方。  

这里有很多东西：

- version 表明了当前的版本。
- name 设置了应用程序/软件包的名称。
- description 是应用程序/软件包的简短描述。
- main 设置了应用程序的入口点。
- private 如果设置为 true，则可以防止应用程序/软件包被意外地发布到 npm。
- scripts 定义了一组可以运行的 node 脚本。
- dependencies 设置了作为依赖安装的 npm 软件包的列表。
- devDependencies 设置了作为开发依赖安装的 npm 软件包的列表。
- engines 设置了此软件包/应用程序在哪个版本的 Node.js 上运行。
- browserslist 用于告知要支持哪些浏览器（及其版本）。

以上所有的这些属性都可被 npm 或其他工具使用。

#### 给 package.json 添加描述

无论项目计划是什么，都建议使用描述。 类似这样：

```json
"description": "A project that does something awesome",
```

#### 给 package.json 添加关键词

在 `keywords` 字段中可以使用相关的关键字描述项目。 下面是一个示例：

```json
"keywords": [ "descriptive", "related", "words" ],
```

正如你所见的，这个字段的结构是一个由双引号字符串组成的数组。

#### 给 package.json 添加许可证

`license` 字段将告知用户允许他们拿这个项目干什么。

开源项目常见的协议有 MIT 和 BSD 等。 许可证信息并不是必须的。 大多数国家的版权法会默认让你拥有自己创作的作品的所有权。 但是，明确说明用户可以做什么和不能做什么会是一个很好的做法。 这里有一个 license 字段的例子：

```json
"license": "MIT",
```

#### 给 package.json 添加版本号

`version` 是 package.json 文件中必填字段之一， 这个字段描述了当前项目的版本， 下面是一个示例：

```json
"version": "1.2.0",
```

#### 使用 npm 的外部包扩展项目

强大的依赖管理特性是使用包管理器的最大原因之一。 每当在新的计算机上开始一个项目时，无需手动，npm 会自动安装所有的依赖项。 但是 npm 如何准确地知道项目需要哪些依赖呢？ 来看看 package.json 文件中 `dependencies` 这一部分。  

在这部分，你的项目需要按照下面这种格式来存储依赖包：

```json
"dependencies": {
  "package-name": "version",
  "express": "4.14.0"
}
```

在 package.json 文件的依赖项中，npm 包的 `Versions` 遵循语义化版本（SemVer，Semantic Versioning），它是一种旨在使管理依赖项更加容易的软件版本控制的行业标准。 在 npm 上发布的库、框架或其它工具都应该使用语义化版本，以便让用户清晰地知道如果项目升级将带来哪些改变。  

在使用外部依赖项（大多数情况都是这样）进行软件开发时，了解语义化版本会很有用。 这些数字保存着项目的偶然发生的破坏性改变，不会让人对项目昨天还正常，今天却无法运行而百思不解。 根据官网，这是语义化版本的工作方式：

```json
"package": "MAJOR.MINOR.PATCH"
```

当做了不兼容的 API 修改，应该增加主版本号（MAJOR）； 当新增了向下兼容的新功能时，应该增加次版本号（MINOR）； 当修复了向下兼容的 bug 时，应该增加修订号（PATCH）。 这意味着修订号是用来修复错误的，次版本号则是添加了新功能，但它们都没有破坏之前的功能。 主版本号（MAJOR）是添加了不兼容早期版本的更改。

#### 用波浪号维持依赖项的最新修订号

如果想让项目各个部分保持相互兼容，锁定依赖包版本是一个行之有效的办法。 但是大多数情况下，我们并不希望错过依赖项的问题修复，因为它们通常包含重要的安全补丁，而且它们理论上也会兼容我们既有的代码。

可以在依赖项的版本号前加一个波浪号（`~`），以让 npm 依赖项更新到最新的修订版。 这里有一个允许升级到任何 1.3.x 的例子：

```json
"package": "~1.3.9"
```

#### 用（^）来使用依赖项的最新次要版本

和用波浪号来安装最新的修订版依赖一样，脱字符（`^`）也允许 npm 来安装功能更新。 它们的不同之处在于：脱字符允许次版本和修订版更新。  

现在项目中的 moment 依赖包的版本应该是“~2.10.2”，这意味着 npm 可以安装最新的 2.10.x 版的 moment， 如果使用脱字符（^）来替换版本号的前缀，那么 npm 可以将 moment 升级安装到任何 2.x.x 的版本。

```json
"package": "^1.3.8"
```

这会将依赖包更新到任意的 1.x.x 版本。
