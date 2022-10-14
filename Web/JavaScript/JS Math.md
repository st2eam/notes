### 令人误解的浮点

JavaScript 中的数字均保存为 64 位的浮点数（Floats）。

所有编程语言，包括 JavaScript，都存在处理浮点值的困难：

```js
var x = 0.1;
var y = 0.2;
var z = x + y;                      //0.30000000000000004
```

请使用乘除

```js
var x = 0.1;
var y = 0.2;
var z = (x * 10 + y *10) / 10;      //0.3
```

### Math.round()

`Math.round(x)` 的返回值是 x 四舍五入为最接近的整数

### Math.pow()

`Math.pow(x, y)` 的返回值是 x 的 y 次幂

### Math.sqrt()

`Math.sqrt(x)` 返回 x 的平方根

### Math.abs()

`Math.abs(x)` 返回 x 的绝对值

### Math.ceil()

`Math.ceil(x)` 的返回值是 x 上舍入最接近的整数

### Math.floor()

`Math.floor(x)` 的返回值是 x 下舍入最接近的整数

### Math.sin()/cos()/tan()

```js
Math.sin(90 * Math.PI / 180);     // 返回 1（90 度的正弦）
```

### Math.min()/max()

返回参数列表中最小/最大值

### Math.random()

`Math.random()` 返回介于 0（包括） 与 1（不包括） 之间的随机数

### Math.log()

`log()` 方法返回数字的自然对数（以 E 为底）

### 常量

```js
Math.E          // 返回欧拉指数（Euler's number）
Math.PI         // 返回圆周率（PI）
Math.SQRT2      // 返回 2 的平方根
Math.SQRT1_2    // 返回 1/2 的平方根
Math.LN2        // 返回 2 的自然对数
Math.LN10       // 返回 10 的自然对数
Math.LOG2E      // 返回以 2 为底的 e 的对数（约等于 1.414）
Math.LOG10E     // 返回以 10 为底的 e 的对数（约等于 0.434）
```

## 数字方法

### toExponential() 方法

`toExponential()` 返回字符串值，它包含已被四舍五入并使用指数计数法的数字,参数定义小数点后的字符数。

### toFixed() 方法

`toFixed()` 返回字符串值，它包含了指定位数小数的数字

### toPrecision() 方法

`toPrecision()` 返回字符串值，它包含了指定长度的数字

### parseInt() 方法

`parseInt()` 解析一段字符串并返回数值。允许空格。只返回首个数字

### parseFloat() 方法

`parseFloat()` 解析一段字符串并返回数值。允许空格。只返回首个数字

### 常量

```js
MAX_VALUE //返回 JavaScript 中可能的最大数字。
MIN_VALUE //返回 JavaScript 中可能的最小数字。
Number.POSITIVE_INFINITY//正无穷
Number.NEGATIVE_INFINITY//负无穷
Number.NaN//非数字
实例
```
