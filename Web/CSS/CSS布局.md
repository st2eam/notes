## display 属性

display 属性规定是否/如何显示元素。

每个 HTML 元素都有一个默认的 display 值，具体取决于它的元素类型。大多数元素的默认 display 值为 block 或 inline。

#### 块级元素（block element）

块级元素总是从新行开始，并占据可用的全部宽度（尽可能向左和向右伸展）。

这个 ```<div>``` 元素属于块级元素。
块级元素的一些例子：

```html
<div>
<h1> - <h6>
<p>
<form>
<header>
<footer>
<section>
```

#### 行内元素（inline element）

内联元素不从新行开始，仅占用所需的宽度。

这是段落中的行内``` <span> ```元素。

行内元素的一些例子：

```
<span>
<a>
<img>
```

#### 覆盖默认的 Display 值

1.一个常见的例子是为实现水平菜单而生成行内的```<li>``` 元素：

实例

```css
li {
  display: inline;
}
```

2.将``` <span> ```元素显示为块元素：

实例

```css
span {
  display: block;
}
```

#### display: inline-block

与 display: inline 相比，主要区别在于 display: inline-block 允许在元素上设置宽度和高度。

同样，如果设置了 display: inline-block，将保留上下外边距/内边距，而 display: inline 则不会。

与 display: block 相比，主要区别在于 display：inline-block 在元素之后不添加换行符，因此该元素可以位于其他元素旁边。

### 隐藏元素 - display:none 还是 visibility:hidden？

1. 通过将 display 属性设置为 none 可以隐藏元素。该元素将被隐藏，并且页面将显示为好像该元素不在其中
2. visibility:hidden; 也可以隐藏元素。
   但是，该元素仍将占用与之前相同的空间。元素将被隐藏，但仍会影响布局：

## [position 属性](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position)

#### position: static

HTML 元素默认情况下的定位方式为 static（静态）。

静态定位的元素不受 top、bottom、left 和 right 属性的影响。

position: static; 的元素不会以任何特殊方式定位；它始终根据页面的正常流进行定位

#### position: relative

position: relative; 的元素相对于其正常位置进行定位。

设置相对定位的元素的 top、right、bottom 和 left 属性将导致其偏离其正常位置进行调整。不会对其余内容进行调整来适应元素留下的任何空间。

#### position: fixed

position: fixed; 的元素是相对于视口定位的，这意味着即使滚动页面，它也始终位于同一位置。 top、right、bottom 和 left 属性用于定位此元素。

固定定位的元素不会在页面中通常应放置的位置上留出空隙。

#### position: absolute

position: absolute; 的元素相对于最近的定位祖先元素进行定位（而不是相对于视口定位，如 fixed）。

然而，如果绝对定位的元素没有祖先，它将使用文档主体（body），并随页面滚动一起移动。

注意：“被定位的”元素是其位置除 static 以外的任何元素。

#### position: sticky

position: sticky; 的元素根据用户的滚动位置进行定位。

粘性元素根据滚动位置在相对（relative）和固定（fixed）之间切换。起先它会被相对定位，直到在视口中遇到给定的偏移位置为止 - 然后将其“粘贴”在适当的位置（比如 position:fixed）。

#### 重叠元素

在对元素进行定位时，它们可以与其他元素重叠。

z-index 属性指定元素的堆栈顺序（哪个元素应放置在其他元素的前面或后面）。

元素可以设置正或负的堆叠顺序：

## CSS Overflow

overflow 属性指定在元素的内容太大而无法放入指定区域时是剪裁内容还是添加滚动条。

overflow 属性可设置以下值：

- visible - 默认。溢出没有被剪裁。内容在元素框外渲染
- hidden - 溢出被剪裁，其余内容将不可见
- scroll - 溢出被剪裁，同时添加滚动条以查看其余内容
- auto - 与 scroll 类似，但仅在必要时添加滚动条

## float 属性

float 属性用于定位和格式化内容，例如让图像向左浮动到容器中的文本那里。

float 属性可以设置以下值之一：

left - 元素浮动到其容器的左侧
right - 元素浮动在其容器的右侧
none - 元素不会浮动（将显示在文本中刚出现的位置）。默认值。
inherit - 元素继承其父级的 float 值
最简单的用法是，float 属性可实现（报纸上）文字包围图片的效果。

## 水平和垂直对齐

### 居中对齐元素

要使块元素（例如 ```<div>``` ）水平居中，请使用```margin: auto;```

设置元素的宽度将防止其延伸到容器的边缘。

然后，元素将占用指定的宽度，剩余空间将在两个外边距之间平均分配

==注意==：如果未设置 width 属性（或将其设置为 100％），则居中对齐无效。

### 居中对齐文本

如果仅需在元素内居中文本，请使用 text-align: center;

### 居中对齐图像

如需居中图像，请将左右外边距设置为 auto，并将其设置为块元素：

```
img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 40%;
}
```

### 左和右对齐

#### 1. 使用 position

对齐元素的一种方法是使用 position: absolute

#### 2. 使用 float

对齐元素的另一种方法是使用 float 属性

如果一个元素比包含它的元素高，并且它是浮动的，它将溢出其容器。可以使用 clearfix hack 来解决此问题

[clearfix Hack](https://www.w3school.com.cn/tiy/t.asp?f=css_layout_clearfix)
我们可以向包含元素添加 overflow: auto;，来解决此问题

### 垂直对齐

#### 1. 使用 padding

```
.center {
  padding: 70px 0;
  border: 3px solid green;
  text-align: center;
}
```

#### 2. 使用 line-height

使用其值等于 height 属性值的 line-height 属性

```
.center {
  line-height: 200px;
  height: 200px;
  border: 3px solid green;
  text-align: center;
}

/* 如果有多行文本，请添加如下代码：*/
.center p {
  line-height: 1.5;
  display: inline-block;
  vertical-align: middle;
}
```

#### 3. 使用 position 和 transform

```
.center p {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

#### 4. 使用 Flexbox

您还可以使用 flexbox 将内容居中。请注意，IE10 以及更早的版本不支持 flexbox：

```
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  border: 3px solid green; 
}
```
