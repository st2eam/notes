# Node.js Buffer

JavaScript 语言自身只有字符串数据类型，没有二进制数据类型。

但在处理像TCP流或文件流时，必须使用到二进制数据。因此在 Node.js中，定义了一个 Buffer 类，该类用来创建一个专门存放二进制数据的缓存区。

在 Node.js 中，Buffer 类是随 Node 内核一起发布的核心库。Buffer 库为 Node.js 带来了一种存储原始数据的方法，可以让 Node.js 处理二进制数据。原始数据存储在 Buffer 类的实例中。一个 Buffer 类似于一个整数数组，但它对应于 V8 堆内存之外的一块原始内存。

## Buffer 与字符编码

Buffer 实例一般用于表示编码字符的序列，比如 UTF-8 、 UCS2 、 Base64 、或十六进制编码的数据。 通过使用显式的字符编码，就可以在 Buffer 实例与普通的 JavaScript 字符串之间进行相互转换。

**Node.js 目前支持的字符编码包括：**

- **ascii** - 仅支持 7 位 ASCII 数据。如果设置去掉高位的话，这种编码是非常快的。

- **utf8** - 多字节编码的 Unicode 字符。许多网页和其他文档格式都使用 UTF-8 。

- **utf16le** - 2 或 4 个字节，小字节序编码的 Unicode 字符。支持代理对（U+10000 至 U+10FFFF）。

- **ucs2** - **utf16le** 的别名。

- **base64** - Base64 编码。

- **latin1** - 一种把 **Buffer** 编码成一字节编码的字符串的方式。

- **binary** - **latin1** 的别名。

- **hex** - 将每个字节编码为两个十六进制字符。

## 写入缓冲区

### 语法

写入 Node 缓冲区的语法如下所示：

`buf.write(string[, offset[, length]][, encoding])`

### 参数

参数描述如下：

- **string** - 写入缓冲区的字符串。

- **offset** - 缓冲区开始写入的索引值，默认为 0 。

- **length** - 写入的字节数，默认为 buffer.length

- **encoding** - 使用的编码。默认为 'utf8' 。

根据 encoding 的字符编码写入 string 到 buf 中的 offset 位置。 length 参数是写入的字节数。 如果 buf 没有足够的空间保存整个字符串，则只会写入 string 的一部分。 只部分解码的字符不会被写入。

### 返回值

返回实际写入的大小。如果 buffer 空间不足， 则只会写入部分字符串。

### 实例

```js
buf = Buffer.alloc(256);
len = buf.write("123456789");
console.log("写入字节数 : "+ len);
```

执行以上代码，输出结果为：

```js
写入字节数 : 9
```

---

## 从缓冲区读取数据

### 语法

读取 Node 缓冲区数据的语法如下所示：

`buf.toString([encoding[, start[, end]]])`

### 参数

参数描述如下：

- **encoding** - 使用的编码。默认为 'utf8' 。

- **start** - 指定开始读取的索引位置，默认为 0。

- **end** - 结束位置，默认为缓冲区的末尾。

### 返回值

解码缓冲区数据并使用指定的编码返回字符串。

### 实例

```js
buf = Buffer.alloc(26);
for (var i = 0 ; i < 26 ; i++) {
  buf[i] = i + 97;
}

console.log( buf.toString('ascii'));       // 输出: abcdefghijklmnopqrstuvwxyz
console.log( buf.toString('ascii',0,5));   //使用 'ascii' 编码, 并输出: abcde
console.log( buf.toString('utf8',0,5));    // 使用 'utf8' 编码, 并输出: abcde
console.log( buf.toString(undefined,0,5)); // 使用默认的 'utf8' 编码, 并输出: abcde
```

---

## 将 Buffer 转换为 JSON 对象

### 语法

将 Node Buffer 转换为 JSON 对象的函数语法格式如下：

`buf.toJSON()`  

当字符串化一个 Buffer 实例时，`JSON.stringify()`会隐式地调用该 toJSON()。

### 返回值

返回 JSON 对象。

### 实例

```js
const buf = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5]);
const json = JSON.stringify(buf);

// 输出: {"type":"Buffer","data":[1,2,3,4,5]}
console.log(json);

const copy = JSON.parse(json, (key, value) => {
  return value && value.type === "Buffer" ? Buffer.from(value.data) : value;
});

// 输出: <Buffer 01 02 03 04 05>
console.log(copy);
```

执行以上代码，输出结果为：

```bash
{"type":"Buffer","data":[1,2,3,4,5]}
<Buffer 01 02 03 04 05>
```

---

## 缓冲区合并

### 语法

Node 缓冲区合并的语法如下所示：

`Buffer.concat(list[, totalLength])`

### 参数

参数描述如下：

- **list** - 用于合并的 Buffer 对象数组列表。

- **totalLength** - 指定合并后Buffer对象的总长度。

### 返回值

返回一个多个成员合并的新 Buffer 对象。

### 实例

```js
var buffer1 = Buffer.from(('string'));
var buffer2 = Buffer.from(('123456'));
var buffer3 = Buffer.concat([buffer1,buffer2]);
console.log("buffer3:" + buffer3.toString());
```

执行以上代码，输出结果为：

```js
buffer3:string123456
```

---

## 缓冲区比较

### 语法

Node Buffer 比较的函数语法如下所示, 该方法在 Node.js v0.12.2 版本引入：

```js
buf.compare(otherBuffer);
```

### 参数

参数描述如下：

- **otherBuffer** - 与 **buf** 对象比较的另外一个 Buffer 对象。

### 返回值

返回-1,0,或1：

- -1表示`buf`比`otherBuffer`小

- 0表示相同

- 1则表示`buf`比`otherBuffer`大

### 实例

```js
var buffer1 = Buffer.from("ABCD");
var buffer2 = Buffer.from("1234");
var result = buffer1.compare(buffer2);

if (result < 0) {
  console.log(buffer1 + " 比 " + buffer2 + " 小");
} else if (result == 0) {
  console.log(buffer1 + " 与 " + buffer2 + " 相同");
} else {
  console.log(buffer1 + " 比 " + buffer2 + " 大");
}
```

执行以上代码，输出结果为：

```bash
ABCD 比 1234 大
```

---

## 拷贝缓冲区

### 语法

Node 缓冲区拷贝语法如下所示：

```js
buf.copy(targetBuffer[, targetStart[, sourceStart[, sourceEnd]]])
```

### 参数

参数描述如下：

- **targetBuffer** - 要拷贝的 Buffer 对象。

- **targetStart** - 数字, 可选, 默认: 0

- **sourceStart** - 数字, 可选, 默认: 0

- **sourceEnd** - 数字, 可选, 默认: buffer.length

### 返回值

没有返回值。

### 实例

```js
var buf1 = Buffer.from('abcdefghijkl');
var buf2 = Buffer.from('123456');

//将 buf2 插入到 buf1 指定位置上
buf2.copy(buf1, 2);

console.log(buf1.toString());
```

执行以上代码，输出结果为：

```bash
abRUNOOBijkl
```

---

## 缓冲区裁剪

Node 缓冲区裁剪语法如下所示：

```js
buf.slice([start[, end]])
```

### 参数

参数描述如下：

- **start** - 数字, 可选, 默认: 0

- **end** - 数字, 可选, 默认: buffer.length

### 返回值

返回一个新的缓冲区，它和旧缓冲区指向同一块内存，但是从索引 start 到 end 的位置剪切。

### 实例

```js
var buffer1 = Buffer.from('123456');
// 剪切缓冲区
var buffer2 = buffer1.slice(0,2);
console.log("buffer2 content: " + buffer2.toString());
```

执行以上代码，输出结果为：

```bash
buffer2 content: ru
```

---

## 缓冲区长度

### 语法

Node 缓冲区长度计算语法如下所示：

`buf.length;`

### 返回值

返回 Buffer 对象所占据的内存长度。

### 实例

```js
var buffer = Buffer.from("中文");
// 缓冲区长度
console.log(buffer);
console.log("buffer length: " + buffer.length);
```

执行以上代码，输出结果为：

```js
<Buffer e4 b8 ad e6 96 87>
buffer length: 6
```
