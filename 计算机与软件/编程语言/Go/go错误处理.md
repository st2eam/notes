---
originalPath: 计算机与软件/编程语言/Go/go错误处理.md
primaryCategory: 计算机与软件/编程语言/Go
categories:
  - path: 计算机与软件/编程语言/Go
    reason: 正文介绍Go 错误处理的语义、用法与实践注意点。
classificationStatus: confirmed
relations: []
tags: []
---
# Go 错误处理

可预期失败通常通过 error 返回值表达。error 是包含 Error() string 方法的接口，成功直接返回 nil；调用者决定重试、转换或向上返回。

## 包装与识别

```go
data, err := os.ReadFile("config.json")
if err != nil { return fmt.Errorf("读取配置: %w", err) }
_ = data
```

片段位于返回 error 的函数中，需导入 os、fmt。%w 保留错误链，%v 仅格式化文本。errors.Is 判断链中是否匹配目标；errors.As 提取指定类型，不应依赖错误文字相等。

```go
var pathErr *os.PathError
if errors.As(err, &pathErr) { fmt.Println(pathErr.Path) }
if errors.Is(err, os.ErrNotExist) { fmt.Println("文件不存在") }
```

## 自定义错误

```go
type ValidationError struct { Field string }
func (e *ValidationError) Error() string {
    return "字段不合法: " + e.Field
}
```

需要暴露下层错误时实现 Unwrap() error。携带结构化字段有助于调用者分类处理。避免每层都记录同一错误。带类型的 nil 指针装入接口后，接口本身不等于 nil，成功路径应直接 return nil。

## panic 与 recover

panic 表示无法正常继续的异常，普通输入错误一般返回 error。recover 必须在同一 goroutine 中由延迟函数直接调用，父 goroutine 不能捕获子 goroutine 的 panic。边界层恢复后应返回明确失败并保留诊断，避免掩盖缺陷。

参见 [[计算机与软件/编程语言/Go/go函数|defer]]、[[计算机与软件/编程语言/Go/go接口|接口语义]]。参考：[errors 包](https://pkg.go.dev/errors)、[错误包装](https://go.dev/blog/go1.13-errors)。
