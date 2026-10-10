---
originalPath: 计算机/编程语言/Go/go依赖管理.md
primaryCategory: 计算机/编程语言/Go
categories:
  - path: 计算机/编程语言/Go
    reason: 正文介绍Go 依赖管理的语义、用法与实践注意点。
  - path: 计算机/工程化/包管理
    reason: 这是包管理在 Go 中的实现。
classificationStatus: confirmed
relations:
  - target: 计算机/工程化/包管理/index.md
    type: subordinate
    status: inferred
    reason: 这是包管理在 Go 中的实现。
    evidence: 这是包管理在 Go 中的实现。
tags: []
---
# Go 依赖管理

模块是一组共同发布和版本化的包，以 go.mod 为入口；包是代码组织与导入单元，二者不是同一个概念。模块路径是包导入路径的前缀。

## 建立模块

```sh
go mod init example.com/hello
go run .
go build ./...
```

在项目根目录运行 init，模块路径应符合项目发布方式。go.mod 记录模块名、Go 语言版本及依赖要求；go.sum 保存下载内容的校验信息，通常随代码提交。它不是简单的完整版本锁文件。

## 常用命令

| 命令 | 作用 |
| --- | --- |
| go get example.com/lib@v1.2.3 | 增加或调整依赖版本 |
| go mod tidy | 补齐所需依赖并清理不再需要的项 |
| go mod download | 下载模块到缓存 |
| go list -m all | 查看构建使用的模块版本 |
| go mod graph | 查看模块依赖图 |
| go mod verify | 检查缓存内容是否被修改 |

安装可执行工具常用 go install 模块路径@版本；与修改当前模块依赖的 go get 区分。升级后检查 go.mod、go.sum 的差异并运行测试。

## 版本与工作区

Go 的模块版本选择采用最小版本选择规则，不是每次构建自动获取最新版本。主版本 v2 及以上通常需要模块路径的版本后缀。replace 便于本地替换，但开发机专有路径不宜成为共享构建前提。多模块协作可使用 go work，并确认 CI 使用相同工作区边界。

这是 [[计算机/工程化/包管理/index|包管理]] 在 Go 中的实现。依赖变更应结合 [[计算机/编程语言/Go/go测试|Go 测试]]验证，不仅确认能编译。

参考：[管理依赖](https://go.dev/doc/modules/managing-dependencies)、[模块参考](https://go.dev/ref/mod)。
