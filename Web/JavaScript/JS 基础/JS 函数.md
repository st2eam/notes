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

由于 JavaScript 数组没有 max() 方法，因此您可以应用 Math.max() 方法。

```js
Math.max.apply(null,[2,4,6],[1,3,5]); // 也会返回 6
```

### JavaScript 闭包

```js
var add = (function () {
    var counter = 0;
    return function () {return counter += 1;}
})();

add();
add();
add();// 计数器目前是 3 
```

- 变量 add 的赋值是自调用函数的返回值。

- 这个自调用函数只运行一次。它设置计数器为零（0），并返回函数表达式。

- 这样 add 成为了函数。最“精彩的”部分是它能够访问父作用域中的计数器。

- 这被称为闭包。它使函数拥有“私有”变量成为可能。

- 计数器被这个匿名函数的作用域保护，并且只能使用 add 函数来修改。

- 闭包指的是有权访问父作用域的函数，即使在父函数关闭之后。

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
