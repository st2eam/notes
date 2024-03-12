## JavaScript 箭头函数

ES6允许使用箭头 `=>` 来定义函数，例如：

```js
let func = num => num + 1
```

相当于

```js
let func = function(num) {
  return num + 1
}
```

可以看到，代码简洁了很多，如果箭头函数不需要参数或者需要多个参数，就使用一个圆括号代表参数部分

```js
let a = () => 5
// 相当于
let b = function() { return 5 }

let c = (num1, num2) => num1 + num2
// 相当于
let d = function(num1, num2) {
  return num1 + num2
}
```

如果箭头函数有多条语句，需要用大括号括起来，并且使用 `return` 语句返回

```js
let sum = (num1, num2) => {
  let num = num1 + num2
  return num
}
```

箭头函数也可以直接返回一个对象，但是因为大括号会被当成代码块来执行，所以外面要加上小括号

```js
let func = name => ({ name })
console.log(func('Frank'))  // { name: 'Frank' }
```

箭头函数最常用的应用场景是简化回调函数，例如

```js
let arr = [1, 2, 3, 4, 5]
let result = arr.map(item => item * 2)
```

等同于

```js
let arr = [1, 2, 3, 4, 5]
let result = arr.map(function(item) {
  return item * 2
})
```

### this 怎么办？

- 与常规函数相比，箭头函数对 this 的处理也有所不同。

- 简而言之，使用箭头函数没有对 this 的绑定。

- 在常规函数中，关键字 this 表示调用该函数的对象，可以是窗口、文档、按钮或其他任何东西。

- 对于箭头函数，this 关键字始终表示定义箭头函数的对象。

- 箭头函数没有自己的 `this`，而是引用外层的 `this`

```js
class Test {
  constructor() {
    this.num = 10
  }

  calcOne(arr) {
    // 这里的this指向的是calcOne所在的对象
    return arr.map(item => item * this.num)
  }

  calcTwo(arr) {
    let _this = this
    return arr.map(function(item) {
      // function的this发生变化，不能直接引用到外部的this
      return item * _this.num
    })
  }
}
let test = new Test()
let arr = [1, 2, 3]
console.log(test.calcOne(arr))
console.log(test.calcTwo(arr))
```

- 箭头函数不能当作构造函数，不可以使用 `new` 命令

- 箭头函数没有 `arguments`
