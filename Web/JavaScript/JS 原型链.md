## 构造函数创建对象

```js
function Person() {

}
var person = new Person();
person.name = 'Kevin';
console.log(person.name) // Kevin
```

## prototype

每个函数都有一个 prototype 属性

<img src="https://camo.githubusercontent.com/02789d6806b75d34b2017021f58efa3aa7a2ee6be8a0c05fb3293438884b9ec0/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6d717971696e6766656e672f426c6f672f496d616765732f70726f746f74797065312e706e67" title="" alt="构造函数和实例原型的关系图" data-align="center">

## __proto__

这是每一个JavaScript对象(除了 null )都具有的一个属性，叫`__proto__`，这个属性会指向该对象的原型。

```js
function Person() {

}
var person = new Person();
console.log(person.__proto__ === Person.prototype); // true
```

<img src="https://camo.githubusercontent.com/3dde335faa15d03ffe3b907f6e5c2b5f4d2183caa4c47ac7486794bc407f663c/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6d717971696e6766656e672f426c6f672f496d616765732f70726f746f74797065322e706e67" title="" alt="实例与实例原型的关系图" data-align="center">

## constructor

```js
function Person() {

}
console.log(Person === Person.prototype.constructor); // true
```

<img src="https://camo.githubusercontent.com/0aaf005afda83d4e2fdd2bbe523df228b567a091317a2154181771b2706ea2ef/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6d717971696e6766656e672f426c6f672f496d616765732f70726f746f74797065332e706e67" title="" alt="实例原型与构造函数的关系图" data-align="center">

## 实例与原型

当读取实例的属性时，如果找不到，就会查找与对象关联的原型中的属性，如果还查不到，就去找原型的原型，一直找到最顶层为止。

举个例子：

```js
function Person() {

}

Person.prototype.name = 'Kevin';

var person = new Person();

person.name = 'Daisy';
console.log(person.name) // Daisy

delete person.name;
console.log(person.name) // Kevin
```

![原型的原型关系图](https://camo.githubusercontent.com/ad0ee0e2594c1ac471bbb42321963c130f4fe1ef9ec70389c8ced54544d3fd6c/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6d717971696e6766656e672f426c6f672f496d616765732f70726f746f74797065342e706e67)

## 原型的原型

在前面，我们已经讲了原型也是一个对象，既然是对象，我们就可以用最原始的方式创建它，那就是：

```js
var obj = new Object();
obj.name = 'Kevin'
console.log(obj.name) // Kevin
```

其实原型对象就是通过 Object 构造函数生成的，结合之前所讲，实例的 __proto__ 指向构造函数的 prototype

![原型的原型关系图](https://camo.githubusercontent.com/ad0ee0e2594c1ac471bbb42321963c130f4fe1ef9ec70389c8ced54544d3fd6c/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6d717971696e6766656e672f426c6f672f496d616765732f70726f746f74797065342e706e67)

## 原型链

那 Object.prototype 的原型呢？

null，我们可以打印：

```js
console.log(Object.prototype.__proto__ === null) // true
```

引用阮一峰老师的 [《undefined与null的区别》](http://www.ruanyifeng.com/blog/2014/03/undefined-vs-null.html) 就是：

> null 表示“没有对象”，即该处不应该有值。

所以 Object.prototype.__proto__ 的值为 null 跟 Object.prototype 没有原型，其实表达了一个意思。

所以查找属性的时候查到 Object.prototype 就可以停止查找了。

<img src="https://camo.githubusercontent.com/9a69b0f03116884e80cf566f8542cf014a4dd043fce6ce030d615040461f4e5a/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6d717971696e6766656e672f426c6f672f496d616765732f70726f746f74797065352e706e67" title="" alt="原型链示意图" data-align="center">
