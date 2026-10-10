---
originalPath: 计算机/编程语言/Go/go接口.md
primaryCategory: 计算机/编程语言/Go
categories:
  - path: 计算机/编程语言/Go
    reason: 正文介绍Go 接口的语义、用法与实践注意点。
classificationStatus: confirmed
relations: []
tags: []
---
# Go 接口

接口描述方法集合，类型具有所需方法就隐式实现，无需 implements。接口通常由使用者定义，范围越小越便于替换实现与测试。

## 定义与实现

```go
type Speaker interface { Speak() string }
type Person struct { Name string }
func (p Person) Speak() string { return p.Name }
var s Speaker = Person{Name: "小明"}
```

接口包含动态类型和动态值。值接收者方法属于 T 和 *T 的方法集；指针接收者方法一般仅属于 *T。调用的自动取址规则不能直接套到接口赋值，见 [[计算机/编程语言/Go/go结构体与方法|结构体与方法]]。

## 空接口与 nil

interface{} 不要求任何方法，any 是其别名，可持有任意类型。灵活性会减少编译期约束，能用具体结构体或小接口表达的数据不必都写为 any。

接口只有动态类型与值均为空才等于 nil。持有 nil 指针的接口仍不等于 nil，这是 [[计算机/编程语言/Go/go错误处理|错误处理]] 的常见陷阱。

## 类型断言

```go
var value any = "Go"
text, ok := value.(string)
if ok { fmt.Println(text) }
switch v := value.(type) {
case string: fmt.Println(len(v))
case int: fmt.Println(v + 1)
default: fmt.Println("未知类型")
}
```

示例需导入 fmt。单返回值断言失败会 panic，双返回值形式可检查；断言不是通用类型转换。接口抽象应服务于不同实现或真实能力边界，不必为每个结构体提前建立接口。

参考：[Go Tour：接口](https://go.dev/tour/methods/9)、[类型断言](https://go.dev/tour/methods/15)。
