## 字符串方法和属性

### 模板字符串

模板字符串是增强版的字符串，用反引号 (\`)来标识，它可当作普通字符串来使用，也可以用来定义多行文本，或者通过 `${}` 在字符串中嵌入变量或表达式。

通过使用模板字面量，您可以在字符串中同时使用单引号和双引号

模板字面量允许多行字符串

#### 变量替换

```js
let firstName = "John";
let lastName = "Doe";

let text = `Welcome ${firstName}, ${lastName}!`;
```

#### 表达式替换

```js
let price = 10;
let VAT = 0.25;

let total = `Total: ${(price * (1 + VAT)).toFixed(2)}`;
```

#### HTML 模板

```js
let tags = ["template literals", "javascript", "es6"];
​
let html = `<h2>${header}</h2><ul>`;
​
for (const x of tags) {
  html += `<li>${x}</li>`;
}
​
html += `</ul>`;
```

输出结果：

- template literals
- javascript
- es6
  
### length
  
  `length` 属性返回字符串的长度：
  
### indexOf()/lastIndexOf()
  
  `indexOf()` 方法返回字符串中指定文本首次出现的索引（位置）

`lastIndexOf()` 方法返回指定文本在字符串中最后一次出现的索引

如果未找到文本， indexOf() 和 lastIndexOf() 均返回 -1。

### search()

`search()` 方法搜索特定值的字符串，并返回匹配的位置

### slice()

`slice()`提取字符串的某个部分并在新字符串中返回被提取的部分。

- 该方法设置两个参数：起始索引（开始位置），终止索引（结束位置）。

- 如果省略第二个参数，则该方法将裁剪字符串的剩余部分

- 如果某个参数为负，则从字符串的结尾开始计数。

```js
let str = '0123456789'
console.log(str.slice(0, 3))  // '012'
console.log(str.slice(3, 6))  // '345'
console.log(str.slice(0, -3)) // '0123456'，表示从第0各字符提取到倒数第三个字符
console.log(str.slice(-3, -1))  // '78'
```

### substring()

该方法返回一个字符串在开始索引到结束索引之间的一个子集，或者从开始索引到字符串末尾的一个子集。

**语法**

**参数**

- `indexStart`：需要截取的第一个字符的索引，该索引位置的字符作为返回的字符串的首字母。
- `indexEnd`：可选参数，一个0到字符串长度之间的整数，以该数字为索引的字符串不包括在截取的字符串内。

**返回值**

  包括给定字符串的指定部分的新字符串

下面查看一些示例：

```js
let str = '0123456789'
console.log(str.substring(0, 3))  // '012'
console.log(str.substring(3, 6))  // '345'
console.log(str.substring(0, -3)) // 相当于 str.substring(0, 0)，输出为空字符串
```

### substr()

`substr()`类似于 `slice()`。

不同之处在于`substr()`第二个参数规定被提取部分的长度。

- 如果省略第二个参数，则该 `substr()` 将裁剪字符串的剩余部分。

- 如果首个参数为负，则从字符串的结尾计算位置。

- 第二个参数不能为负，因为它定义的是长度。

### replace()

`replace()`方法用另一个值替换在字符串中指定的值

- `replace()`方法不会改变调用它的字符串。它返回的是新字符串

- 默认地，`replace()` 只替换首个匹配。

- 默认地，`replace()` 对大小写敏感。

如需执行大小写不敏感的替换，请使用正则表达式 /i（大小写不敏感）

```js
str = "Please visit Microsoft!";
var n = str.replace(/MICROSOFT/i, "W3School");
```

如需替换所有匹配，请使用正则表达式的 g 标志（用于全局搜索）

```js
str = "Please visit Microsoft and Microsoft!";
var n = str.replace(/Microsoft/g, "W3School");
```

### replaceAll()

写正则增加了复杂度，现在新增的 `replaceAll()` 方法，可以一次性替换所有匹配

```js
'aabbcc'.replaceAll('b', '_') // 'aa__cc'
```

### 转换为大写和小写

通过 `toUpperCase()` 把字符串转换为大写

通过 `toLowerCase()` 把字符串转换为小写

### concat()

`concat()` 连接两个或多个字符串.

`concat()` 方法可用于代替加运算符。

### padStart、padEnd

这两个方法提供了字符串补全长度的功能，如果某个字符串不够指定的长度，会在头部或者尾部补全，`padStart` 用于头部补全，`padEnd` 用于尾部补全，这个在格式化字符串的时候非常有用，示例如下：

```js
'5'.padStart(5, '0')  // '00005'
'123'.padEnd(5) // '123  '，默认使用空格补全
'12345'.padStart(4) // '12345'，超出长度，不会变化
```

### trim()

`trim()` 方法删除字符串两端的空白符

```js
let str = '  abc  '
str.trim()  // 'abc'
str.trimStart() // 'abc  '
str.trimEnd() // '  abc'
```

### charAt()

`charAt()` 方法返回字符串中指定下标（位置）的字符串

相比于属性访问`[]`要更安全

如果找不到字符，[ ] 返回 undefined，而 charAt() 返回空字符串。

### charCodeAt()

`charCodeAt()` 方法返回字符串中指定索引的字符 unicode 编码

```js
var str = "HELLO WORLD";

str.charCodeAt(0);         // 返回 72
```

### split()

可以通过 `split()` 将字符串转换为数组

```js
  var str = "a,b,c,d,e,f";
  var arr = str.split(",");
  console.log(arr[2]);//c
```

### match()

`match()` 方法根据正则表达式在字符串中搜索匹配项，并将匹配项作为 `Array` 对象返回。

在字符串中搜索 "ain"：

```js
let text = "The rain in SPAIN stays mainly in the plain";
text.match(/ain/g)    // 返回数组 [ain,ain,ain]
```

对 "ain" 执行不区分大小写的全局搜索：

```js
let text = "The rain in SPAIN stays mainly in the plain";
text.match(/ain/gi)   // 返回数组 [ain,AIN,ain,ain]
```

### includes()

如果字符串包含指定值，`includes()` 方法返回 `true`。

```js
string.includes(searchvalue, start)//start可选。默认为 0. 开始搜索的位置。
```

### startsWith()

如果字符串以指定值开头，则 `startsWith()` 方法返回 `true`，否则返回 `false`

```js
string.startsWith(searchvalue, start)//start可选。默认为 0. 开始搜索的位置。
```

### endsWith()

如果字符串以指定值结尾，则 `endsWith()` 方法返回 `true`，否则返回 `false`

```js
string.endswith(searchvalue, length)//length可选。要搜索的长度。
```

检索以 "world" 结尾的字符串的前 11 个字符：

```js
let text = "Hello world, welcome to the universe.";
text.endsWith("world", 11)    // return true
```

### repeat

该方法返回一个新字符串，表示将原字符串重复 `n` 次，示例如下：

```js
'abc'.repeat(2) // 'abcabc'
```
