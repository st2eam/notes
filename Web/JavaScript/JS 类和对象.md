## JavaScript 类的语法

语法

```js
class ClassName {
  constructor() { ... }
}
```

实例

```js
class Man {
  constructor(name, year) {
    this.name = name;
    this.year = year;
  }
  age() {
    let date = new Date();
    return date.getFullYear() - this.year;
  }
}

let Joe = new Man("Joe", 2022);
```

### Constructor 方法

- 创建新对象时自动执行

- 用于初始化对象属性

- 如果未定义构造函数方法，JavaScript 会添加空的构造函数方法。

### 类继承

如需创建类继承，请使用 `extends` 关键字。

使用 `super()` 方法调用了父级的 `constructor` 方法。

继承对于代码可重用性很有用：在创建新类时重用现有类的属性和方法。

## JavaScript 对象

所有 JavaScript 值，除了原始值，都是对象。

### JavaScript 原始值

原始值指的是没有属性或方法的值。

原始数据类型指的是拥有原始值的数据。

JavaScript 定义了 5 种原始数据类型：

- string

- number

- boolean

- null

- undefined

原始值是一成不变的（它们是硬编码的，因此不能改变）。

假设 x = 3.14，您能够改变 x 的值。但是您无法改变 3.14 的值。

## JavaScript 对象访问

### 数据质量

使用 getter 和 setter 时，JavaScript 可以确保更好的数据质量。

```js
set lang(lang) {
    this.language = lang.toUpperCase();
}
get lang() {
    return this.language.toUpperCase();
}
```

#### 为什么使用 Getter 和 Setter？

- 它提供了更简洁的语法

- 它允许属性和方法的语法相同

- 它可以确保更好的数据质量

- 有利于后台工作

## JavaScript 对象构造

### 为对象添加属性

为已有的对象添加新属性很简单：

```js
my.age = 12;
```

### 为对象添加方法

为已有的对象添加新方法也很简单：

```js
my.name = function () {
    return this.firstName + " " + this.lastName;
};
```

#### ==但是==

### 为构造器添加属性

如需向构造器添加一个新属性或方法，您必须添加到构造器函数

#### ==但是==

### 原型继承

所有 JavaScript 对象都从原型继承属性和方法。

日期对象继承自 Date.prototype。数组对象继承自 Array.prototype。Person 对象继承自 Person.prototype。

Object.prototype 位于原型继承链的顶端：

日期对象、数组对象和 Person 对象都继承自 Object.prototype

### 使用 prototype 属性

`JavaScript prototype` 属性允许您为对象构造器添加新属性

```js
Person.prototype.age = 12;

Person.prototype.name = function() {
    return this.firstName + " " + this.lastName;
};
```

#### ==注意==

绝不要修改标准 JavaScript 对象的原型。

### 解构对象

基本语法如下：

```js
let object = { a: 1, b: 2, c: 3 }
let { a, b } = object

console.log(a)  // 1
console.log(b)  // 2
```

可以从一个对象中提取变量并赋值给和属性名不同的新变量名

```js
let object = { a: 1, b: 2, c: 3 }
let { a: aa, b: bb } = object

console.log(aa) // 1
console.log(bb) // 2
```

解构对象也可以指定默认值，例如：

```js
let object = { a: 5 }
let { a = 1, b = 2 } = object

console.log(a)  // 5
console.log(b)  // 2
```

解构对象也支持剩余模式，例如

```js
let { a, ...b } = { a: 1, b: 2, c: 3 }
console.log(a)  // 1
console.log(b)  // { b: 2, c: 3 }
```

解构对象的一个典型应用场景是从函数参数对象中提取数据，例如下面的代码，函数接收的参数是一个对象，如果不使用解构，需要专门去读取参数对象中的属性值

```js
function test(user) {
  console.log(user.id, user.name)
}

let user = {
  id: 1,
  name: 'test'
}

test(user)
```

如果我们使用解构对象，接可以直接将属性取出来

```js
function test({id, name}) {
  console.log(id, name)
}

let user = {
  id: 1,
  name: 'test'
}

test(user)
```
