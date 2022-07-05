## JavaScript 使用 32 位按位运算数

JavaScript 将数字存储为 64 位浮点数，但所有按位运算都以 32 位二进制数执行。

在执行位运算之前，JavaScript 将数字转换为 32 位有符号整数。

执行按位操作后，结果将转换回 64 位 JavaScript 数。

上面的例子使用 4 位无符号二进制数。所以 ~ 5 返回 10。

由于 JavaScript 使用 32 位有符号整数，JavaScript 将返回 -6。

00000000000000000000000000000101 (5)

11111111111111111111111111111010 (~5 = -6)

有符号整数使用最左边的位作为减号。

## JavaScript 位运算符

<table><tbody><tr><th>运算符</th><th>名称</th><th>描述</th></tr><tr><td>&</td><td>AND</td><td>如果两位都是 1 则设置每位为 1</td></tr><tr><td>|</td><td>OR</td><td>如果两位之一为 1 则设置每位为 1</td></tr><tr><td>^</td><td>XOR</td><td>如果两位只有一位为 1 则设置每位为 1</td></tr><tr><td>~</td><td>NOT</td><td>反转所有位</td></tr><tr><td><<</td><td>零填充左位移</td><td>通过从右推入零向左位移，并使最左边的位脱落。</td></tr><tr><td>>></td><td>有符号右位移</td><td>通过从左推入最左位的拷贝来向右位移，并使最右边的位脱落。</td></tr><tr><td>>>></td><td>零填充右位移</td><td>通过从左推入零来向右位移，并使最右边的位脱落。</td></tr></tbody></table>

### 把十进制转换为二进制

```js
function dec2bin(dec){
    return (dec >>> 0).toString(2);
}
```

### 把二进制转换为十进制

```js
function bin2dec(bin){
    return parseInt(bin, 2).toString(10);
}
```
