### 方法中的 this

在对象方法中，this 指的是此方法的“拥有者”。

### 单独的 this

在单独使用时，拥有者是全局对象，因此 this 指的是全局对象。

在浏览器窗口中，全局对象是 [object Window]

### 函数中的 this（默认）

在 JavaScript 函数中，函数的拥有者默认绑定 this。

### 函数中的 this（严格模式）

JavaScript 严格模式不允许默认绑定。

因此，在函数中使用时，在严格模式下，this 是未定义的（undefined）。

### 事件处理程序中的 this

在 HTML 事件处理程序中，this 指的是接收此事件的 HTML 元素

```html
<button onclick="this.style.display='none'">
  点击来删除按钮
</button>
```

### 对象方法绑定

this 是 person 对象（person 对象是该函数的“拥有者”）

显式函数绑定
call() 和 apply() 方法是预定义的 JavaScript 方法。

它们都可以用于将另一个对象作为参数调用对象方法。

您可以在本教程后面阅读有关 call() 和 apply() 的更多内容。

在下面的例子中，当使用 person2 作为参数调用 person1.fullName 时，this 将引用 person2，即使它是 person1 的方法：

实例

```js
var person1 = {
  fullName: function() {
    return this.firstName + " " + this.lastName;
  }
}
var person2 = {
  firstName:"Bill",
  lastName: "Gates",
}
person1.fullName.call(person2);  // 会返回 "Bill Gates"
```
