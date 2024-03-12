## 函数声明

```js
function myFunction(a, b) {
     return a * b;
}

var myFunction = function (a, b) {return a * b};//匿名函数
```

### 自调用函数

- 函数表达式可以作为“自调用”。

- 自调用表达式是自动被调用（开始）的，在不进行调用的情况下。

- 函数表达式会自动执行，假如表达式后面跟着 ()。
  
  ```js
  (function () {
    console.log("Hello!!");      //我会调用我自己
  })();
  ```

### arguments 对象

JavaScript 函数有一个名为 `arguments` 对象的内置对象。

`arguments` 对象包含函数调用时使用的参数数组。

### Call()

`call()` 方法是预定义的 JavaScript 方法。

它可以用来调用所有者对象作为参数的方法。

通过 `call()`，您能够使用属于另一个对象的方法。

```js
var person = {
    fullName: function() {
        return this.firstName + " " + this.lastName;
    }
}
var person1 = {
    firstName:"Bill",
    lastName: "Gates",
}
var person2 = {
    firstName:"Steve",
    lastName: "Jobs",
}
person.fullName.call(person1);  // 将返回 "Bill Gates"
```

call() 方法可接受参数：

```js
var person = {
  fullName: function(city, country) {
    return this.firstName + " " + this.lastName + "," + city + "," + country;
  }
}
var person1 = {
  firstName:"Bill",
  lastName: "Gates"
}
person.fullName.call(person1, "Seattle", "USA");
```

### Apply

apply() 方法与 call() 方法非常相似

不同之处是：

- call() 方法分别接受参数。

- apply() 方法接受数组形式的参数。

- 如果要使用数组而不是参数列表，则 apply() 方法非常方便。

由于 JavaScript 数组没有 max() 方法，因此您可以应用 `Math.max()` 方法。

```js
Math.max.apply(null,[2,4,6],[1,3,5]); // 也会返回 6
```

### JavaScript 闭包

```js
var add = (() => {
  var counter = 0
  return () => {
    return (counter += 1)
  }
})()

console.log(add())
console.log(add())
console.log(add()) // 计数器目前是 3
```

- 变量 add 的赋值是自调用函数的返回值。

- 这个自调用函数只运行一次。它设置计数器为零（0），并返回函数表达式。

- 这样 add 成为了函数。最“精彩的”部分是它能够访问父作用域中的计数器。

- 这被称为闭包。它使函数拥有“私有”变量成为可能。

- 计数器被这个匿名函数的作用域保护，并且只能使用 add 函数来修改。

- 闭包指的是有权访问父作用域的函数，即使在父函数关闭之后。

#### 闭包的两大作用：保存/保护

（1）保护：划分一个独立的代码执行区域，在这个区域中有自己私有变量存储的空间，保护自己的私有变量不受外界干扰（操作自己的私有变量和外界没有关系）；

（2）保存：如果当前上下文不被释放【只要上下文中的某个东西被外部占用即可】，则存储的这些私有变量也不会被释放，可以供其下级上下文中调取使用，相当于把一些值保存起来了；

我们把函数执行形成私有上下文，来保护和保存私有变量机制称为`闭包`。

> 闭包是指有权访问另一个函数作用域中的变量的函数--《JavaScript高级程序设计》

**稍全面的回答**： 在js中变量的作用域属于函数作用域, 在函数执行完后,作用域就会被清理,内存也会随之被回收,但是由于闭包函数是建立在函数内部的子函数, 由于其可访问上级作用域,即使上级函数执行完, 作用域也不会随之销毁, 这时的子函数(也就是闭包),便拥有了访问上级作用域中变量的权限,即使上级函数执行完后作用域内的值也不会被销毁。

- **闭包的特性**：

  - 1、内部函数可以访问定义他们外部函数的参数和变量。(作用域链的向上查找，把外围的作用域中的变量值存储在内存中而不是在函数调用完毕后销毁)设计私有的方法和变量，避免全局变量的污染。

    1.1.闭包是密闭的容器，，类似于set、map容器，存储数据的

    1.2.闭包是一个对象，存放数据的格式为 key-value 形式

  - 2、函数嵌套函数

  - 3、本质是将函数内部和外部连接起来。优点是可以读取函数内部的变量，让这些变量的值始终保存在内存中，不会在函数被调用之后自动清除

- **闭包形成的条件**：

  1. 函数的嵌套
  2. 内部函数引用外部函数的局部变量，延长外部函数的变量生命周期

- **闭包的用途**：

  1. 模仿块级作用域
  2. 保护外部函数的变量 能够访问函数定义时所在的词法作用域(阻止其被回收)
  3. 封装私有化变量
  4. 创建模块

- **闭包应用场景**

  闭包的两个场景，闭包的两大作用：`保存/保护`。 在开发中, 其实我们随处可见闭包的身影, 大部分前端JavaScript 代码都是“事件驱动”的,即一个事件绑定的回调方法; 发送ajax请求成功|失败的回调;`setTimeout`的延时回调;或者一个函数内部返回另一个匿名函数,这些都是闭包的应用。

- **闭包的优点**：延长局部变量的生命周期

- **闭包缺点**：会导致函数的变量一直保存在内存中，过多的闭包可能会导致内存泄漏

### Function：length

Function 实例的 length 数据属性表示函数期望的参数数量。

```js
function func1() {}

function func2(a, b) {}

console.log(func1.length);
// Expected output: 0

console.log(func2.length);
// Expected output: 2

```

箭头函数

```js
console.log(Function.length); // 1

console.log((() => {}).length); // 0
console.log(((a) => {}).length); // 1
console.log(((a, b) => {}).length); // 2，依此类推

console.log(((...args) => {}).length);
// 0，剩余参数不计算在内

console.log(((a, b = 1, c) => {}).length);
// 1，只计算第一个具有默认值的参数之前的参数

```

### 参数通过值传递

函数调用中的参数（parameter）是函数的参数（argument）。

JavaScript 参数通过值传递：函数只知道值，而不是参数的位置。

如果函数改变了参数的值，它不会改变参数的原始值。

参数的改变在函数之外是不可见的。

### 对象是由引用传递的

在 JavaScript 中，对象引用是值。

正因如此，对象的行为就像它们通过引用来传递：

如果函数改变了对象属性，它也改变了原始值。

对象属性的改变在函数之外是可见的。
