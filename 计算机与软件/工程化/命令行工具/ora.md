---
originalPath: Web/库/ora.md
primaryCategory: 计算机与软件/工程化/命令行工具
categories:
  - path: 计算机与软件/工程化/命令行工具
    reason: 核心学习对象为“ora”，正文依据：“Elegant terminal spinner”；据其实体与学习对象归入计算机与软件/工程化/命令行工具。
classificationStatus: confirmed
relations: []
tags: []
---
# ora

> Elegant terminal spinner

<img src="https://raw.githubusercontent.com/sindresorhus/ora/HEAD/screenshot.svg" title="" alt="" data-align="center">

## Install

```shell
npm install ora
```

## Usage

```js
import ora from 'ora';

const spinner = ora('Loading unicorns').start();

setTimeout(() => {
    spinner.color = 'yellow';
    spinner.text = 'Loading rainbows';
}, 1000);
```
