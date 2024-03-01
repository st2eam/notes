## 类型

在 JavaScript 中

有 5 种不同的可以包含值的数据类型：

- string
- number
- boolean
- object
- function

有 6 种类型的对象：

- Object
- Date
- Array
- String
- Number
- Boolean

以及 2 种不能包含值的数据类型：

- null
- undefined

### constructor 属性

`constructor` 属性返回所有 JavaScript 变量的构造函数。

```js
"Bill".constructor                // 返回 function String()  {[native code]}
(3.14).constructor                // 返回 function Number()  {[native code]}
false.constructor                 // 返回 function Boolean() {[native code]}
[1,2,3,4].constructor             // 返回 function Array()   {[native code]}
{name:'Bill',age:19}.constructor  // 返回 function Object()  {[native code]}
new Date().constructor            // 返回 function Date()    {[native code]}
function () {}.constructor        // 返回 function Function(){[native code]}
```

## 类型转换

JavaScript 类型转换表

下表中列出了将不同 JavaScript 值转换为数字、字符串和布尔的结果：

|原始值| 转换为数字 |转换为字符串| 转换为逻辑|
|---|---|---|---|
|false |0 |"false" |false|
|true |1 |"true" |true|
|0| 0 |"0" |false|
|1 |1 |"1" |true|
|"0" |0 |"0" |true|
|"000" |0 |"000" |true|
|"1"| 1 |"1" |true|
|NaN| NaN |"NaN" |false|
|Infinity| Infinity |"Infinity" |true|
|-Infinity| -Infinity |"-Infinity" |true|
|"" |0 |"" |false|
|"20" |20 |"20" |true|
|"twenty"| NaN |"twenty" |true|
|[ ] |0 |"" |true|
|[20] |20 |"20" |true|
|[10,20] |NaN |"10,20" |true|
|["twenty"]| NaN |"twenty" |true|
|["ten","twenty"]| NaN |"ten,twenty" |true|
|`function(){}`| NaN |"`function(){}`" |true|
|{ }| NaN |"[object Object]" |true|
|null| 0 |"null" |false|
|undefined| NaN |"undefined" |false|
