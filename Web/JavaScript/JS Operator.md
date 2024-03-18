# JS 表达式和运算符

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

## `??`

空合并运算符 (??) 是一个逻辑运算符，当其左侧操作数为空或未定义时返回其右侧操作数，否则返回其左侧操作数。

```ini
const foo = null ?? 'my school';
// 输出: "my school"

const baz = 0 ?? 42;
// 输出: 0
```

## 自增和自减

### `A++`
后置自增运算符。

### `A--`
后置自减运算符。

### `++A`
前置自增运算符。

### `--A`
前置自减运算符。

## 一元运算符

一元运算符只有一个操作数。

### `+num`
一元加运算符将操作转换为 Number 类型。

```js
const x = 1;
const y = -1;

console.log(+x);
// Expected output: 1

console.log(+y);
// Expected output: -1

console.log(+'');
// Expected output: 0

console.log(+true);
// Expected output: 1

console.log(+false);
// Expected output: 0

console.log(+'hello');
// Expected output: NaN
```

### `-num`
一元减运算符将操作转换为 Number 类型并取反。

```js
const x = 4;
const y = -x;

console.log(y);
// Expected output: -4

const a = '4';
const b = -a;

console.log(b);
// Expected output: -4

```

### `~bool`
按位非运算符。

### `!bool`
逻辑非运算符。


## 算术运算符

算术运算符以二个数值（字面量或变量）作为操作数，并返回单个数值。

### `+`
加法运算符。

### `-`
减法运算符。

### `/`
除法运算符。

### `*`
乘法运算符。

### `%`
取模运算符。

### `**`
求幂运算符。

## 关系运算符

比较运算符比较两个操作数并返回基于比较结果的布尔值。

### `in`
in 运算符用来判断对象是否拥有给定属性。

### `<`
小于运算符。

### `>`
大于运算符。

### `<=`
小于等于运算符。

### `>=`
大于等于运算符。

## 相等运算符
如果相等，操作符返回的是布尔类型的 true，否则是 false。

### `==`
相等运算符。

### `!=`
不等运算符。

### `===`
全等运算符。

### `!==`
非全等运算符。

## 位移运算符
在二进制的基础上对数字进行移动操作

### `<<`
按位左移运算符。

### `>>`
按位右移运算符。

### `>>>`
按位无符号右移运算符。

## 二进制位运算符
二进制运算符将它们的操作数作为 32 个二进制位（0 或 1）的集合，并返回标准的 JavaScript 数值。

### `&`
按位与（AND）。

### `|`
按位或（OR）。

### `^`
位异或（XOR）。

## 二元逻辑运算符
逻辑运算符典型的用法是用于布尔（逻辑）值运算，它们返回布尔值。

### `&&`
逻辑与。

### `||`
逻辑或。

### `??`
空值合并运算符，如果 ?? 前面是 null 或 undefined，取后面的默认值。

## 可选链运算符

### `?.`
如果引用是空值（null 或 undefined），可选链运算符将返回 undefined 而不是导致错误。

```js
obj.val?.prop
obj.val?.[expr]
obj.func?.(args)
```

## 条件（三元）运算符

### `(condition ? ifTrue : ifFalse)`
条件元素运算符把两个结果中其中一个符合运算逻辑的值返回。

## 赋值运算符
赋值运算符将右边的操作数的值分配给左边的操作数。

### `=`
赋值运算符。

### `*=`
赋值乘积。

### `**=`
求幂赋值。

### `/=`
赋值商。

### `%=`
赋值求余。

### `+=`
赋值求和。

### `-=`
赋值求差。

### `<<=`
左位移。

### `>>=`
右位移。

### `>>>=`
无符号右位移。

### `&=`
赋值与。

### `^=`
赋值按位异或。

### `|=`
赋值或。

### `&&=`
逻辑和赋值运算符。

### `||=`
逻辑或赋值运算符。

### `??=`
逻辑空赋值运算符。

```js
const a = { duration: 50 };

a.duration ??= 10;
console.log(a.duration);
// Expected output: 50

a.speed ??= 25;
console.log(a.speed);
// Expected output: 25
```

### `[a, b] = arr, { a, b } = obj`
解构赋值允许你使用类似于数组或对象字面量的语法将数组或对象的属性赋值给变量。

## 关键字

### `delete`
delete 运算符用来删除对象的属性。

### `void`
void 运算符表示表达式放弃返回值。

### `typeof`
typeof 运算符用来判断给定对象的类型。

### `instanceof`
instanceof 运算符判断一个对象是否是另一个对象的实例。

### `yield` 

yield 关键字用于暂停和恢复生成器函数。

## 逗号运算符

### 逗号操作符 `,`
逗号操作符允许在一个判断状态中有多个表达式去进行运算并且最后返回最后一个表达式的值。