---
originalPath: 计算机/编程语言/Go/go调试.md
primaryCategory: 计算机/编程语言/Go
categories:
  - path: 计算机/编程语言/Go
    reason: 正文介绍Go 调试的语义、用法与实践注意点。
  - path: 计算机/基础/计算机系统
    reason: 本笔记涉及计算机系统中的进程、执行栈与调试符号。
classificationStatus: confirmed
relations:
  - target: 计算机/基础/计算机系统/index.md
    type: subordinate
    status: inferred
    reason: 本笔记涉及计算机系统中的进程、执行栈与调试符号。
    evidence: 本笔记涉及计算机系统中的进程、执行栈与调试符号。
tags: []
---
# Go 调试

Delve（dlv）用于断点、单步、变量和调用栈检查。终端交互命令与 IDE 的 DAP 调试控制台并非完全相同，遇到命令不识别时先确认当前适配器和控制台类型。

## launch 与 attach

```sh
dlv debug .
dlv test .
go build -gcflags="all=-N -l" -o app.exe .
dlv exec ./app.exe
dlv attach 1234
```

debug 构建并启动程序，test 调试测试，exec 调试已有二进制，attach 附加到 PID。附加权限依系统与进程身份而定。预编译程序需保留调试符号；禁用优化可改善变量与源码对应。

## 常用交互命令

| 命令 | 用途 |
| --- | --- |
| break main.main | 函数断点 |
| break main.go:20 | 行断点 |
| breakpoints | 列出断点 |
| continue / c | 继续执行 |
| next / n | 单步越过 |
| step / s | 单步进入 |
| print / p 变量名 | 查看表达式 |
| locals / args | 查看局部变量或参数 |
| stack / goroutines | 查看栈或任务 |
| help | 查看当前版本命令 |

变量求值依赖选中的 goroutine 与栈帧。程序暂停会影响所有任务的时序，调试观察不能直接替代性能测量。

## IDE 入口

最小 launch.json 使用 type=go、request=launch、mode=debug、program=${workspaceFolder}，选择 debugAdapter=dlv-dap。attach 本地进程使用 request=attach、mode=local 和 processId。具体字段以安装的 Go 扩展 schema 为准，Cursor 兼容情况需现场核实。

本笔记涉及 [[计算机/基础/计算机系统/index|计算机系统]] 中的进程、执行栈与调试符号。具体痛点见 [[计算机/编程语言/Go/go断点变量截断|变量截断]]、[[计算机/编程语言/Go/go反向DAP连接|反向 DAP 连接]]和[[计算机/编程语言/Go/go旧配置迁移|旧配置迁移]]。

参考：[Delve CLI](https://github.com/go-delve/delve/blob/master/Documentation/cli/README.md)、[Go 扩展调试文档](https://github.com/golang/vscode-go/blob/master/docs/debugging.md)。
