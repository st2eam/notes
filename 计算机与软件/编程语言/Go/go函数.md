---
originalPath: 计算机与软件/编程语言/Go/go函数.md
primaryCategory: 计算机与软件/编程语言/Go
categories:
  - path: 计算机与软件/编程语言/Go
    reason: 正文介绍Go 函数的语义、用法与实践注意点。
classificationStatus: confirmed
relations: []
tags: []
---
# Go 函数

函数声明指定参数和返回类型，参数按值传递。切片、map 和指针传参复制描述信息或地址，仍可能修改共享数据。导出名称以大写字母开头。

## 定义与多返回值

```go
func divide(a, b float64) (float64, error) {
    if b == 0 { return 0, fmt.Errorf("除数不能为零") }
    return a / b, nil
}
```

示例需导入 fmt。调用者检查 error，见 [[计算机与软件/编程语言/Go/go错误处理|错误处理]]。命名返回值可提高部分函数的表达力，较长函数中显式 return 更容易审查。func sum(xs ...int) int 接受可变参数，已有切片用 sum(values...) 展开。

## defer

defer 推迟调用到当前函数返回前，多个调用按后进先出执行。注册时求值参数，闭包则可在执行时读取捕获变量。

```go
func show() {
    n := 1
    defer fmt.Println(n) // 输出 1
    defer func() { fmt.Println(n) }() // 输出 2
    n = 2
}
```

打开文件成功后立即 defer Close 可以覆盖返回路径；关闭错误影响业务时还应处理。循环里的 defer 积累到整个函数结束，必要时拆分小函数。

## 闭包与函数值

函数可赋给变量、作为参数或返回值。闭包保留外部状态：

```go
func counter() func() int {
    n := 0
    return func() int { n++; return n }
}
```

同一实例共享 n，并发调用需要同步。defer 不会自动等待 goroutine；任务退出见 [[计算机与软件/编程语言/Go/go上下文控制|上下文控制]]。

参考：[Go Tour：闭包](https://go.dev/tour/moretypes/25)、[defer、panic 与 recover](https://go.dev/blog/defer-panic-and-recover)。
