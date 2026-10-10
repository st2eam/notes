---
originalPath: 计算机与软件/编程语言/Go/go测试.md
primaryCategory: 计算机与软件/编程语言/Go
categories:
  - path: 计算机与软件/编程语言/Go
    reason: 正文介绍Go 测试的语义、用法与实践注意点。
  - path: 计算机与软件/工程化/测试与持续集成
    reason: 测试与 CI 强调单元、集成和端到端验证层次；Go 测试是落实这些检查的工具。
classificationStatus: confirmed
relations:
  - target: 计算机与软件/工程化/测试与持续集成/测试与CI.md
    type: citation
    status: confirmed
    reason: 测试与 CI 强调单元、集成和端到端验证层次；Go 测试是落实这些检查的工具。
    evidence: 测试与 CI 强调单元、集成和端到端验证层次；Go 测试是落实这些检查的工具。
tags: []
---
# Go 测试

testing 包配合 go test 执行测试。测试文件以 _test.go 结尾，普通测试函数为 TestXxx(t *testing.T)。失败用 t.Error 或 t.Fatal 报告，后者终止当前测试 goroutine。

## 表驱动测试

下面是独立示例，可保存为 add_test.go 后在模块中运行 go test。

```go
package demo
import "testing"
func add(a, b int) int { return a + b }
func TestAdd(t *testing.T) {
    cases := []struct {
        name string
        a, b, want int
    }{
        {"正数", 1, 2, 3},
        {"负数", -2, 1, -1},
        {"零值", 0, 0, 0},
    }
    for _, tc := range cases {
        t.Run(tc.name, func(t *testing.T) {
            if got := add(tc.a, tc.b); got != tc.want {
                t.Fatalf("got %d, want %d", got, tc.want)
            }
        })
    }
}
```

## 命令与边界

运行 go test ./... 检查全部包，go test -run TestAdd -v 聚焦用例，go test -race ./... 检测执行到的竞争。-count=1 可禁用测试结果缓存。用例应覆盖异常输入和资源释放，不只是正常路径；并行测试避免共享全局可变状态。

## 基准测试

```go
func BenchmarkAdd(b *testing.B) {
    for i := 0; i < b.N; i++ { _ = add(i, 1) }
}
```

运行 go test -bench=. -benchmem，观察耗时与分配。上例可能被编译器优化，只说明基准函数结构；真实基准应消费结果，避免测到空循环。保持机器负载和输入一致，多次比较。

[[计算机与软件/工程化/测试与持续集成/测试与CI|测试与 CI]]强调单元、集成和端到端验证层次；Go 测试是落实这些检查的工具。热点诊断见 [[计算机与软件/编程语言/Go/go性能分析|性能分析]]。

参考：[testing 包](https://pkg.go.dev/testing)。
