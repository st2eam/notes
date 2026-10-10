---
originalPath: 计算机/编程语言/Go/go并发.md
primaryCategory: 计算机/编程语言/Go
categories:
  - path: 计算机/编程语言/Go
    reason: 正文介绍Go 并发的语义、用法与实践注意点。
  - path: 计算机/基础/并发与异步
    reason: 本笔记是并发与异步在 Go 中的具体应用。
classificationStatus: confirmed
relations:
  - target: 计算机/基础/并发与异步/index.md
    type: subordinate
    status: inferred
    reason: 本笔记是并发与异步在 Go 中的具体应用。
    evidence: 本笔记是并发与异步在 Go 中的具体应用。
  - target: 计算机/编程语言/Python/python多线程.md
    type: similar
    status: inferred
    reason: Python 多线程同样讨论共享数据和锁，但任务调度模型不同。
    evidence: Python 多线程同样讨论共享数据和锁，但任务调度模型不同。
tags: []
---
# Go 并发

并发描述多个任务推进，是否并行取决于调度与可用执行资源。goroutine 是运行时管理的任务，channel 用于通信和协调；二者不会自动消除数据竞争。

## goroutine 与等待

```go
var wg sync.WaitGroup
for i := 0; i < 3; i++ {
    wg.Add(1)
    go func(id int) {
        defer wg.Done()
        fmt.Println(id)
    }(i)
}
wg.Wait()
```

片段需导入 sync、fmt。Add 在启动任务前调用，Done 保证每条退出路径完成计数。main 返回后程序不会继续等待其他 goroutine。WaitGroup 管完成，不传递结果或错误。

## channel 与 select

无缓冲 channel 需要收发双方就绪，有缓冲 channel 在容量内可暂存。关闭通常由发送方负责；向已关闭 channel 发送会 panic，关闭后仍可读出缓冲数据，随后收到零值与 ok=false。nil channel 收发永久阻塞。

```go
select {
case value, ok := <-results:
    if ok { fmt.Println(value) }
case <-ctx.Done():
    return
}
```

select 等待可执行分支，多分支同时就绪时不保证业务优先级。default 会立即走通，放在循环中可能造成忙等。

## 共享状态与锁

sync.Mutex 保护临界区，所有访问应遵守同一锁约定，使用后不要复制锁。普通 map 的并发读写需同步。用 go test -race ./... 检测实际执行路径中的竞争，未报告不等于所有路径安全。

本笔记是 [[计算机/基础/并发与异步/index|并发与异步]] 在 Go 中的具体应用。[[计算机/编程语言/Python/python多线程|Python 多线程]]同样讨论共享数据和锁，但任务调度模型不同。超时与退出参见 [[计算机/编程语言/Go/go上下文控制|上下文控制]]。

参考：[Go Tour：并发](https://go.dev/tour/concurrency/1)、[sync 包](https://pkg.go.dev/sync)。
