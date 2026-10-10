---
originalPath: 计算机与软件/编程语言/Go/go数据类型.md
primaryCategory: 计算机与软件/编程语言/Go
categories:
  - path: 计算机与软件/编程语言/Go
    reason: 正文介绍Go 数据类型的语义、用法与实践注意点。
classificationStatus: confirmed
relations: []
tags: []
---
# Go 数据类型

基本类型有 bool、整数、浮点数、复数和 string。byte 是 uint8 别名，rune 是 int32 别名。int 位宽依平台而定，协议与持久化字段宜使用明确宽度。

## 数组与切片

数组长度属于类型，[3]int 与 [4]int 不同。切片保存底层数组的引用、长度和容量，赋值不会复制全部元素。

```go
a := [3]int{1, 2, 3}
s := a[:2]
s[0] = 9 // 同时改变 a[0]
s = append(s, 4)
copyOfS := append([]int(nil), s...)
_ = copyOfS
```

append 可能复用数组，也可能重新分配，必须接收返回值。make([]int, 2, 8) 创建长度 2、容量 8 的切片；nil 切片可 append，索引越界会 panic。

## map

键必须可比较，切片不能作为键。读取缺失键返回零值，用第二个返回值区分缺失和值为零。

```go
scores := map[string]int{"Go": 90}
v, ok := scores["Rust"]
_ = v
_ = ok
delete(scores, "Go")
```

nil map 可读取，直接写入会 panic。普通 map 的并发读写必须同步，见 [[计算机与软件/编程语言/Go/go并发|Go 并发]]。

## 字符串与指针

string 是不可变字节序列，不保证内容是合法 UTF-8。len 返回字节数，索引得到 byte，range 解码为 rune。中文处理中需区分字节、码点和可见字形，[]rune 也不是完整字形分割。

指针表示地址，零值为 nil；Go 不提供一般指针算术。结构化数据见 [[计算机与软件/编程语言/Go/go结构体与方法|结构体与方法]]。

参考：[Go Tour：更多类型](https://go.dev/tour/moretypes/1)、[字符串与 rune](https://go.dev/blog/strings)。
