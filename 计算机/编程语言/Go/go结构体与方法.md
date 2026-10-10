---
originalPath: 计算机/编程语言/Go/go结构体与方法.md
primaryCategory: 计算机/编程语言/Go
categories:
  - path: 计算机/编程语言/Go
    reason: 正文介绍Go 结构体与方法的语义、用法与实践注意点。
classificationStatus: confirmed
relations: []
tags: []
---
# Go 结构体与方法

struct 将字段组合成值。大写字段名可被其他包访问，标签为 JSON 等库提供元信息，语言本身不会自动执行序列化。

## 定义与方法

```go
type User struct {
    Name string `json:"name"`
    Age int `json:"age"`
}
func (u User) Label() string { return u.Name }
func (u *User) Birthday() { u.Age++ }
```

值接收者获得副本，指针接收者可修改原对象。对可寻址变量 u，u.Birthday() 可自动取址，但 User 与 *User 的方法集不完全相同；接口赋值需单独检查。

## 接收者选择

需要修改状态、结构体较大或包含同步原语时一般采用指针接收者。小型不可变值可以用值接收者，同一类型的方法保持一致有助于阅读。复制包含切片、map 或指针的结构体仍会共享底层数据，并非深复制。

含 sync.Mutex 的结构体使用后不可复制，应通过指针传递。指针接收者不自动保证线程安全，共享状态见 [[计算机/编程语言/Go/go并发|Go 并发]]。

## 组合与嵌入

匿名嵌入可提升字段和方法的访问便利性，它是组合机制，不是传统类继承。优先用明确字段组织状态，用小接口定义能力边界。必需资源可通过构造函数初始化；可用零值的类型则能减少初始化负担。

当接口包含指针接收者方法时，通常由 *User 满足而非 User，见 [[计算机/编程语言/Go/go接口|Go 接口]]。

参考：[Go Tour：结构体](https://go.dev/tour/moretypes/2)、[方法接收者](https://go.dev/tour/methods/4)。
