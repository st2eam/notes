
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

## 安全访问深度嵌套的对象属性

```js
const userName = user.profile?.name ?? '匿名';
```
如果`user.profile`是`undefined`或`null`，它会短路并返回`undefined`，从而避免潜在的类型错误`TypeError`。

使用空值合并运算符 (`??`) 检查左侧是否为`null`或`undefined`，如果是，则使用默认值。

如果把`??`改为`||`，行为会稍微有些不同。`||`的左侧如果为假值，它将会返回右侧的值。JavaScript 中的假值包括`null`、`undefined`、`0`、`NaN`、`''`（空字符串）和`false`。这意味着`||`左边的值不仅仅是`null`或`undefined`，如果还是其他假值，那么都将返回右侧的值。

## 从数组中过滤出虚假值

Falsy值喜欢`0`，`undefined`，`null`，`false`，`""`，`''`可以很容易地通过以下方法省略

```js
const array = [3, 0, 6, 7, '', false];
array.filter(Boolean);
// 输出
(3) [3, 6, 7]
```

## 如何避免使用过多的if else 甚至 switch case

可以使用对象的方式来代替if else语句，这样可以更好的管理代码。

```js
  enum EType {
    TOP = 1,
    BOTTOM,
    LEFT,
    RIGHT
  }

  const LinkToWhere = {
    [EType.TOP]: '/top',
    [EType.BOTTOM]: '/bottom',
    [EType.LEFT]: '/left',
    [EType.RIGHT]: '/right'
  }

  console.log(LinkToWhere[type])
```

但是有个问题就是，如果对象的属性不是常量，那么它会每个属性都执行一次。

不过也有解决的办法，就是使用箭头函数：

```ts
  // 定义
  const searchByType = {
      [ESearchType.POST]: (params: ISearch) => searchPost(params),
      [ESearchType.IMAGE_POST]: (params: ISearch) => searchImgPost(params),
      [ESearchType.USER]: (params: ISearch) => searchUser(params)
    }
  // 调用
  searchByType[type](params)
```

## 生成1-n的数组

```ts
const range = Array.from({ length: 5 }, (_, i) => i + 1);

// 结果: range = [1, 2, 3, 4, 5]
```

## 生成打乱的1-10数组

```javascript
new Array(10)
.fill(0)
.map((_, index) => index + 1)
.sort(() => {
return 0.5 - Math.random()
})
```

## 提取扩展名

```ts
const fileName = 'example.png';

const getFileExtension = str => str.slice(((str.lastIndexOf(".") - 1) >>> 0) + 2);
```

## 切换元素的 class

```ts
const element = document.querySelector('.my-element');

const toggleClass = (el, className) => el.classList.toggle(className);

toggleClass(element, 'active');
```

`classList.toggle()`方法从一个元素的 class 列表中添加或移除某个 class。如果该 class 存在，则删除，否则添加。