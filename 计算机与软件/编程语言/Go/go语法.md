---
originalPath: 计算机与软件/编程语言/Go/go语法.md
primaryCategory: 计算机与软件/编程语言/Go
categories:
  - path: 计算机与软件/编程语言/Go
    reason: 正文介绍Go 语法的语义、用法与实践注意点。
classificationStatus: confirmed
relations: []
tags: []
---
# Go 语法

源文件声明 package，导入依赖后定义函数。可执行入口为 main 包中的 main 函数。

## 变量与常量

var 可指定类型，无初值时采用零值。:= 仅用于函数内部，同一作用域中至少声明一个新变量。const 是编译期常量，不能用运行时结果初始化；iota 常用于连续枚举。

```go
package main
import "fmt"
func main() {
    var count int = 2
    name := "Go"
    const limit = 3
    for i := 0; i < limit; i++ {
        if i < count { fmt.Println(name, i) }
    }
}
```

## 流程控制

if 不要求条件圆括号，但花括号不能省略。if err := work(); err != nil 可以限制局部变量范围。switch 默认不会贯穿后续分支，通常无需 break；明确需要贯穿时才使用 fallthrough。

## for 与 range

for 统一表达计数、条件与无限循环。range 遍历切片得到索引和元素副本，遍历 map 得到键和值，遍历字符串得到字节偏移与 rune。

```go
values := []int{10, 20}
for i, value := range values {
    values[i] = value + 1
}
```

修改 value 不会直接改回切片。map 遍历顺序没有保证。Go 1.22 起，循环中声明的变量具有每次迭代独立语义；复用外部变量仍须谨慎，闭包捕获还应核对模块语言版本。

参见 [[计算机与软件/编程语言/Go/go函数|函数与闭包]]。参考：[Go Tour：流程控制](https://go.dev/tour/flowcontrol/1)、[Go 语言规范](https://go.dev/ref/spec)。
