---
originalPath: Web/JavaScript/Function/Function.prototype.apply().md
primaryCategory: 计算机与软件/编程语言/JavaScript
categories:
  - path: 计算机与软件/编程语言/JavaScript
    reason: >-
      核心学习对象为“Function.prototype.apply()”，正文依据：“Function 实例的 apply() 方法会以给定的
      this 值和作为数组（或类数组对象）提供的 arguments 调用该函数。
      thisArg”；据其实体与学习对象归入计算机与软件/编程语言/JavaScript。
classificationStatus: confirmed
relations: []
tags:
  - 实体/JavaScript
---
# Function.prototype.apply()

`Function` 实例的 `apply()` 方法会以给定的 `this` 值和作为数组（或类数组对象）提供的 `arguments` 调用该函数。

## 语法

```js
apply(thisArg)
apply(thisArg, argsArray)
```

## 参数

`thisArg`

调用 `func` 时提供的 `this` 值。如果函数不处于严格模式，则 `null` 和 `undefined` 会被替换为全局对象，原始值会被转换为对象。

`argsArray` 可选

一个类数组对象，用于指定调用 `func` 时的参数，或者如果不需要向函数提供参数，则为 `null` 或 `undefined`。

## 返回值

使用指定的 `this` 值和参数调用函数的结果。
