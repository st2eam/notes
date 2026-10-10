---
originalPath: 计算机/编程语言/Go/go性能分析.md
primaryCategory: 计算机/编程语言/Go
categories:
  - path: 计算机/编程语言/Go
    reason: 正文介绍Go 性能分析的语义、用法与实践注意点。
  - path: 计算机/基础/计算机系统
    reason: 正文讨论 CPU 与内存采样和运行时执行追踪。
classificationStatus: confirmed
relations: []
tags: []
---
# Go 性能分析

先建立可重复的工作负载，再采集证据。pprof 用采样定位资源热点，trace 展示执行与调度事件；单次运行变慢不足以证明某函数需要优化。

## CPU 与内存

```sh
go test -run='^$' -bench=. -cpuprofile=cpu.out -memprofile=mem.out
go tool pprof cpu.out
go tool pprof -alloc_space mem.out
```

在 pprof 交互界面用 top 查看热点、list 函数名查看源码；go tool pprof -http=127.0.0.1:8080 cpu.out 可打开本地分析界面。CPU profile 反映采样期间 CPU 消耗，不直接说明等待时间。

内存分析区分 alloc_space（累计分配）与 inuse_space（采样时仍存活），对象数量也有相应指标。高分配量不一定是泄漏；需观察稳定负载下存活对象是否持续增长。保留对应二进制与源码版本，便于符号解析。

## 执行追踪

```sh
go test -trace=trace.out ./...
go tool trace trace.out
```

trace 用于观察 goroutine、阻塞、调度和垃圾回收事件。短窗口覆盖具体问题，避免长时间采集过多数据；多包执行时应按目标包采集并保留各自输出，避免覆盖。定位等待还可结合 goroutine、block 和 mutex profile，后两类需主动配置采样。

## 服务与验证

服务可通过 net/http/pprof 暴露诊断端点，也可用 runtime/pprof 写文件。诊断信息只在受控环境访问。优化前后使用相同输入比较吞吐、延迟和分配，确认没有改变正确性。

[[计算机/基础/计算机系统/index|计算机系统]]提供 CPU 与内存相关学习入口；本笔记关注 Go 的采样工具。基准见 [[计算机/编程语言/Go/go测试|Go 测试]]，并发热点见 [[计算机/编程语言/Go/go并发|Go 并发]]。

参考：[Go 诊断指南](https://go.dev/doc/diagnostics)、[pprof 包](https://pkg.go.dev/runtime/pprof)、[trace 包](https://pkg.go.dev/runtime/trace)。
