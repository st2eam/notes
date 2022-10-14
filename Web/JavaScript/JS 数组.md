## 数组和对象的区别

- 在 JavaScript 中，数组使用数字索引。

- 在 JavaScript 中，对象使用命名索引。

- 数组是特殊类型的对象，具有数字索引。
  
## 解构数组
  
### 基本语法如下

左侧的变量名和右侧数组中的元素一一对应

```js
let [a, b, c] = [1, 2, 3]
console.log(a)  // 1
console.log(b)  // 2
console.log(c)  // 3
```

### 可以给左边数组中的变量设置默认值

```js
let [a = 1, b = 2] = [5]
console.log(a)  // 5
console.log(b)  // 2
```

### 交换变量

```js
let a = 1
let b = 2
[a, b] = [b, a]
```

### 解构数组一个常用的场景是解析函数返回值

```js
function foo() {
  return [1, 2]
}

let [a, b] = foo()
console.log(a)  // 1
console.log(b)  // 2
```

### 剩余模式，将剩余部分的数组赋值给一个变量

```js
let [a, ...b] = [1, 2, 3]
console.log(a)  // 1
console.log(b)  // [2, 3]
```

## 数组属性和方法

> JavaScript 数组的力量隐藏在数组方法中。

### length

`length` 属性返回数组的长度（数组元素的数目）。

### foreach()

遍历数组元素

```js
var txt = "";
var numbers = [45, 4, 9, 16, 25];
numbers.forEach(myFunction);

function myFunction(value, index, array) {
  txt = txt + value + "<br>"; 
}
```

例子只用了 `value` 参数，这个例子可以改进为

```js
var txt = "";
var numbers = [45, 4, 9, 16, 25];
numbers.forEach(myFunction);

function myFunction(value) {
  txt = txt + value + "<br>"; 
}
```

### map()

- map() 方法通过对每个数组元素执行函数来创建新数组。

- map() 方法不会对没有值的数组元素执行函数。

- map() 方法不会更改原始数组。

返回一个由回调函数的返回值组成的新数组。

```js
let arr = [1, 2, 3]
let tpl = arr.map(item => `<span>${item}</span>`)
console.log(tpl)  // [ '<span>1</span>', '<span>2</span>', '<span>3</span>' ]
```

### filter()

`filter()` 方法创建一个包含符合条件的数组元素的新数组

```js
var numbers = [45, 4, 9, 16, 25];
var over18 = numbers.filter(myFunction);

function myFunction(value) {
  return value > 18;
}
```

### reduce()

- `reduce()` 方法在每个数组元素上运行函数，以生成（减少它）单个值。

- `reduce()` 方法在数组中从左到右工作。另请参阅 `reduceRight()`。

- `reduce()` 方法不会减少原始数组。
  从左到右为每个数组元素执行一次回调函数，并把上次回调函数的返回值放在一个暂存器中传给下次的回调函数，并返回最后一次回调函数的返回值。
  
  ```js
  [0, 1, 2, 3, 4].reduce((accumulator, currentValue, currentIndex, array) => {
  return accumulator + currentValue; }, initialValue );
  ```

**第一个参数： callback函数**

执行数组中每个值 (如果没有提供 initialValue则第一个值除外)的函数，包含四个参数：

- `accumulator`

累计器累计回调的返回值;
它是上一次调用回调时返回的累积值，或initialValue（见于下方）。

- `currentValue`

数组中正在处理的元素。

- `index` 可选

数组中正在处理的当前元素的索引。
如果提供了initialValue，则起始索引号为0，否则从索引1起始。

- `array` 可选

调用reduce()的原数组

**第二个参数： initialValue可选**

作为第一次调用 callback函数时的第一个参数的值。
如果没有提供初始值，则将使用数组中的第一个元素。 在没有初始值的空数组上调用
reduce 将报错。

回调函数第一次执行时，accumulator
和currentValue的取值有两种情况：如果调用reduce()时提供了initialValue，accumulator取值为initialValue，currentValue取数组中的第一个值；如果没有提供
initialValue，那么accumulator取数组中的第一个值，currentValue取数组中的第二个值。

#### 为了理解透举个栗子

1\. 无初始值

假如运行下段reduce()代码：

```js
[0, 1, 2, 3, 4].reduce(function(accumulator, currentValue, currentIndex, array){
    return accumulator + currentValue;
});
```

callback 被调用四次，每次调用的参数和返回值如下表：

| callback    | accumulator | currentValue | currentIndex | array           | return value |
| ----------- | ----------- | ------------ | ------------ | --------------- | ------------ |
| first call  | 0           | 1            | 1            | [0, 1, 2, 3, 4] | 1            |
| second call | 1           | 2            | 2            | [0, 1, 2, 3, 4] | 3            |
| third call  | 3           | 3            | 3            | [0, 1, 2, 3, 4] | 6            |
| fourth call | 6           | 4            | 4            | [0, 1, 2, 3, 4] | 10           |

由reduce返回的值将是最后一次回调返回值（10）。

2\. 添加初始值，这样子

提供一个初始值作为reduce()方法的第二个参数，以下是运行过程及结果：

```js
[0, 1, 2, 3, 4].reduce((accumulator, currentValue, currentIndex, array) => {
return accumulator + currentValue; }, 10 );// 提供初始值为 10
```

| callback    | accumulator | currentValue | currentIndex | array           | return value |
| ----------- | ----------- | ------------ | ------------ | --------------- | ------------ |
| first call  | 10          | 0            | 0            | [0, 1, 2, 3, 4] | 10           |
| second call | 10          | 1            | 1            | [0, 1, 2, 3, 4] | 11           |
| third call  | 11          | 2            | 2            | [0, 1, 2, 3, 4] | 13           |
| fourth call | 13          | 3            | 3            | [0, 1, 2, 3, 4] | 16           |
| fifth call  | 16          | 4            | 4            | [0, 1, 2, 3, 4] | 20           |

这种情况下reduce()返回的值是20。

### every()

`every()` 方法检查所有数组值是否符合条件。

### some()

`some()` 方法检查某些数组值是否符合条件。

### find()

`find()` 方法返回通过测试函数的第一个数组元素的值。

### findIndex()

`findIndex()`方法返回通过测试函数的第一个数组元素的索引。

### push()

向数组添加新元素的最佳方法是使用 push() 方法

### toString()

`toString()` 把数组转换为数组值（逗号分隔）的字符串

### join()

`join()` 方法也可将所有数组元素结合为一个字符串。它的行为类似 `toString()`，但是您还可以规定分隔符

### pop()

`pop()`方法从数组中删除最后一个元素,同时`pop()` 方法返回“被弹出”的值

### push()

push()方法（在数组结尾处）向数组添加一个新的元素，同时`push()` 方法返回新数组的长度

### shift()

`shift()`方法会删除首个数组元素，并把所有其他元素“位移”到更低的索引，同时`shift()` 方法返回被“位移出”的字符串

### unshift()

`unshift()`方法（在开头）向数组添加新元素，并“反向位移”旧元素，同时`unshift()` 方法返回新数组的长度

### splice()

`splice()` 方法可用于向数组添加新项

- 第一个参数定义了应添加新元素的位置（拼接）。

- 第二个参数定义应删除多少元素。

- 其余参数定义要添加的新元素。

- 同时`splice()` 方法返回一个包含已删除项的数组

- 通过聪明的参数设定，您可以使用 `splice()` 在数组中不留“空洞”的情况下移除元素

### concat()

`concat()`方法通过合并（连接）现有数组来创建并返回一个新数组

### slice()

`slice()` 方法用数组的某个片段切出新数组

`slice()` 方法创建新数组。它不会从源数组中删除任何元素。

```js
String.slice(start,end);
```

该方法会从开始参数选取元素，直到结束参数为止。

如果结束参数被省略，比如第一个例子，则 `slice()` 会切出数组的剩余部分。

### reverse()

`reverse()`方法反转数组中的元素。

## sort()

`sort()` 方法是最强大的数组方法之一。

### 数组排序

`sort()` 方法以字母顺序对数组进行排序

### 数字排序

默认地，`sort()` 函数按照字符串顺序对值进行排序。

我们通过一个**比值函数**来修正数字排序问题

```js
var points = [40, 100, 1, 5, 25, 10];
points.sort(function(a, b){return a - b}); 
```

使用相同的技巧对数组进行降序排序：

```js
var points = [40, 100, 1, 5, 25, 10];
points.sort(function(a, b){return b - a});
```

### 比值函数

当 `sort()` 函数比较两个值时，会将值发送到比较函数，并根据所返回的值（负、零或正值）对这些值进行排序。

### 以随机顺序排序数组

```js
var points = [40, 100, 1, 5, 25, 10];
points.sort(function(a, b){return 0.5 - Math.random()}); 
```

### Math.max()/min()

查找数组中的最大/小值

`Math.max.apply([1, 2, 3])` 等于 `Math.max(1, 2, 3)`。

`Math.min.apply([1, 2, 3])` 等于 `Math.min(1, 2, 3)`。

最快的解决方法是使用“自制”方法。

此函数遍历数组，用找到的最高值与每个值进行比较

```js
function findMax(arr) {
    var len = arr.length
    var max = -Infinity;
    while (len--) {
        if (arr[len] > max) {
            max = arr[len];
        }
    }
    return max;
}
```

### 排序对象数组

即使对象拥有不同数据类型的属性，sort() 方法仍可用于对数组进行排序。

```js
cars.sort(function(a, b){return a.year - b.year});
```
