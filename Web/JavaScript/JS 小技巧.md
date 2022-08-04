## Rest & Spread 运算符

```javascript
function myFun(a,  b, ...manyMoreArgs) 
   return arguments.length;
}
myFun("one", "two", "three", "four", "five", "six");

// 输出: 6
```

&&

```javascript
const parts = ['shoulders', 'knees']; 
const lyrics = ['head', ...parts, 'and', 'toes']; 

lyrics;
// 输出: 
(5) ["head", "shoulders", "knees", "and", "toes"]
```

&&

```javascript
const arr = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 }
const { two, ...rest } = arr
console.log(rest)
//{ one: 1, three: 3, four: 4, five: 5, six: 6 }

const arr2 = ['one', 'two', 'three', 'four', 'five', 'six']
const [three, ...rest2] = arr2
console.log(rest2)
//[ 'two', 'three', 'four', 'five', 'six' ]
```

## 使用解构简单交换两值

```ini
let a = 5;
let b = 8;
[a,b] = [b,a]

[a,b]
// 输出
(2) [8, 5]
```

## 找出总和、最小值和最大值

我们应该利用`reduce`方法来快速找到基本的数学运算。

```js
const array  = [5,4,7,8,9,2];
```

- 和

```js
array.reduce((a,b) => a+b);
// 输出: 35
```

- 最大限度

```js
array.reduce((a,b) => a>b?a:b);
// 输出: 9
```

- 最小

```js
array.reduce((a,b) => a<b?a:b);
// 输出: 2
```

## 从数组中过滤出虚假值

Falsy值喜欢`0`，`undefined`，`null`，`false`，`""`，`''`可以很容易地通过以下方法省略

```js
const array = [3, 0, 6, 7, '', false];
array.filter(Boolean);
// 输出
(3) [3, 6, 7]
```

## 空合并算子

空合并运算符 (??) 是一个逻辑运算符，当其左侧操作数为空或未定义时返回其右侧操作数，否则返回其左侧操作数。

```ini
const foo = null ?? 'my school';
// 输出: "my school"

const baz = 0 ?? 42;
// 输出: 0
```
