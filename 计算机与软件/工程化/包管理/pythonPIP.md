---
originalPath: Python/基础/pythonPIP.md
primaryCategory: 计算机与软件/工程化/包管理
categories:
  - path: 计算机与软件/工程化/包管理
    reason: >-
      核心学习对象为“pythonPIP”，正文依据：“PIP 是 Python
      包或模块的包管理器，pip之于python，就像npm之于node。pip与npm类似，也有对于python包的查找、下载、安装、卸载的功能。
      **注释：**如果您使用的是 Python 3.4 或更高版本，则默认情况下会包含 PIP。”；据其实体与学习对象归入计算机与软件/工程化/包管理。
classificationStatus: confirmed
relations:
  - target: 计算机与软件/工程化/包管理/使用 NPM 管理软件包.md
    type: similar
    label: 主题对照
    reason: 共同管理包的安装、依赖与版本；pip 和 npm 服务不同语言生态。
    evidence: "源笔记：PIP 是 Python 包或模块的包管理器，pip之于python，就像npm之于node。pip与npm类似，也有对于python包的查找、下载、安装、卸载的功能。 **注释：**如果您使用的是 Python 3.4 或更高版本，则默认情况下会包含 PIP。；目标笔记：npm（Node 包管理工具）是一个命令行工具，用于安装、创建和分享为 Node.js 编写的 JavaScript 代码包。在 npm 上有许多开放源码软件包，所以在项目启动之前，需要一些时间来探索，这样你就不会最后重新创建轮子来处理像日期或从 API 获取数据这样的事项。 Yarn\_是 npm 的一个替代选择。"
    status: inferred
tags: []
---
## 什么是 PIP？

PIP 是 Python 包或模块的包管理器，pip之于python，就像npm之于node。pip与npm类似，也有对于python包的查找、下载、安装、卸载的功能。

**注释：**如果您使用的是 Python 3.4 或更高版本，则默认情况下会包含 PIP。

## 查找包

在 https://pypi.org/，您可以找到更多的包。

## 导出当前环境包

```shell
pip freeze >requirements.txt
```

同时也可以把这个环境文件给别人，别人可以照着这个文件进行安装一个与你的环境一模一样的python编译环境变量安装另一个编译环境的[第三方库](https://so.csdn.net/so/search?q=第三方库&spm=1001.2101.3001.7020)：`pip install -r requirements.txt`

## 卸载所有的python包

```shell
pip uninstall -r modules.txt -y
```

