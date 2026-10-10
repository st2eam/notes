---
originalPath: 计算机与软件/编程语言/Go/go上下文控制.md
primaryCategory: 计算机与软件/编程语言/Go
categories:
  - path: 计算机与软件/编程语言/Go
    reason: 正文介绍Go 上下文控制的语义、用法与实践注意点。
  - path: 计算机与软件/基础/并发与异步
    reason: 本笔记讨论并发与异步中的任务生命周期。
classificationStatus: confirmed
relations:
  - target: 计算机与软件/基础/并发与异步/index.md
    type: subordinate
    status: inferred
    reason: 本笔记讨论并发与异步中的任务生命周期。
    evidence: 本笔记讨论并发与异步中的任务生命周期。
  - target: 计算机与软件/编程语言/Go/go并发.md
    type: citation
    status: confirmed
    reason: context 为 Go 并发提供退出信号，不代替 WaitGroup 等待任务完成，也不负责保护共享状态。
    evidence: context 为 Go 并发提供退出信号，不代替 WaitGroup 等待任务完成，也不负责保护共享状态。
tags: []
---
# Go 上下文控制

context.Context 在调用链传递取消信号、截止时间和请求级信息。取消是协作信号，任务必须检查信号或调用支持 context 的 API 才会停止。

## 超时与取消

```go
ctx, cancel := context.WithTimeout(context.Background(), time.Second)
defer cancel()
select {
case <-ctx.Done():
    return ctx.Err()
case result := <-results:
    _ = result
    return nil
}
```

片段位于返回 error 的函数，需导入 context、time，results 为业务结果通道。即使提前成功也调用 cancel，以释放关联资源。WithCancel 提供主动取消，WithDeadline 指定绝对时间。

## 沿调用链传播

通常将 ctx 作为函数第一个参数：func load(ctx context.Context) error。入口创建上下文，下游基于父上下文派生；父取消会传递到子上下文，子取消不会反向取消父上下文。

HTTP 请求可用 http.NewRequestWithContext，数据库调用优先采用 QueryContext 等方法。不要在下游随意换成 Background，否则会丢失入口的取消信号。需要同步使用的 Context 可跨 goroutine 共享。

## 边界与常见误区

Done 通道关闭表明取消或超时，Err 区分 context.Canceled 与 context.DeadlineExceeded。WithValue 用于跨 API 的请求级信息，不用于替代函数必需参数；键宜使用自定义类型，避免碰撞。

本笔记讨论 [[计算机与软件/基础/并发与异步/index|并发与异步]] 中的任务生命周期。context 为 [[计算机与软件/编程语言/Go/go并发|Go 并发]] 提供退出信号，不代替 WaitGroup 等待任务完成，也不负责保护共享状态。服务退出时应取消、等待并释放资源。

参考：[context 包](https://pkg.go.dev/context)。
