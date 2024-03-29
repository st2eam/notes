## 文字排版

元素中的文本是布置在元素的内容框中。以内容区域的左上角作为起点 (或者是右上角，是在 RTL 语言的情况下)，一直延续到行的结束部分。一旦达到行的尽头，它就会进到下一行，然后继续，再接着下一行，直到所有内容都放入了盒子中。文本内容表现地像一些内联元素，被布置到相邻的行上，除非到达了行的尽头，否则不会换行，或者你想强制地，手动地造成换行的话，你可以使用 `<br>` 元素。

### 颜色

`color` 属性设置选中元素的前景内容的颜色 (通常指文本，不过也包含一些其他东西，比如使用 `text-decoration` 属性设置的下划线。

### 字体种类

要在你的文本上设置一个不同的字体，你可以使用 font-family  属性，这个允许你为浏览器指定一个字体 (或者一个字体的列表)，然后浏览器可以将这种字体应用到选中的元素上。浏览器只会把在当前机器上可用的字体应用到当前正在访问的网站上；如果字体不可用，那么就会用浏览器默认的字体代替 default font. 下面是一个简单的例子：

```css
p {
  font-family: arial;
}
```

这段语句使所有在页面上的段落都采用 `arial` 字体，这个字体可在任何电脑上找到。

由于你无法保证你想在你的网页上使用的字体的可用性 (甚至一个网络字体可能由于某些原因而出错), 你可以提供一个字体栈 (font stack)，这样的话，浏览器就有多种字体可以选择了。只需包含一个font-family属性，其值由几个用逗号分离的字体名称组成。比如

```css
p {
  font-family: "Trebuchet MS", Verdana, sans-serif;
}
```

在这种情况下，浏览器从列表的第一个开始，然后查看在当前机器中，这个字体是否可用。如果可用，就把这个字体应用到选中的元素中。如果不可用，它就移到列表中的下一个字体，然后再检查。

### 字体大小

我们可以通过 `font-size` 属性设置字体大小，最常用的单位是

- **px**：像素，这是一个绝对单位，它导致了在任何情况下，页面上的文本所计算出来的像素值都是一样的。
- **em**：1em 等于我们设计的当前元素的父元素上设置的字体大小
- **rem**：这个单位的效果和 em 差不多，除了 1rem 等于 HTML 中的根元素的字体大小，而不是父元素。这可以让你更容易计算字体大小

元素的 `font-size` 属性是从该元素的父元素继承的。所以这一切都是从整个文档的根元素 — `<html>`开始，浏览器的 font-size 标准设置的值为 16px。

一个使用 `rem` 单位的示例，在移动端适配的时候会变得很有用

```css
html {
  font-size: 10px;
}

h1 {
  font-size: 2.6rem;
}

p {
  font-size: 1.4rem;
  color: red;
  font-family: Helvetica, Arial, sans-serif;
}
```

### 文字样式

- **font-style**：用来打开和关闭文本 italic (斜体)，一般只会用到下面的值

  - `italic`：如果当前字体的斜体版本可用，那么文本设置为斜体版本。

- **font-weight**：置文字的粗体大小

  - `normal`：普通
  - `bold`：加粗

- **text-decoration**：设置/取消字体上的文本装饰

  - `none`：取消已经存在的任何文本装饰
  - `underline`：文本下划线
  - `overline`：本上划线
  - `line-through`：穿过文本的线
  - `text-fill-color`: 设置文字内部填充颜色
  - `text-stroke-color`: 设置文字边界填充颜色
  - `text-stroke-width`: 设置文字边界宽度

- **text-align**：用来控制文本如何和它所在的内容盒子对齐。可用值如下，并且在与常规文字处理器应用程序中的工作方式几乎相同：

  - `left`：左对齐文本
  - `right`：右对齐文本
  - `center`：居中文字

- **line-height**：设置文本每行之间的高，可以接受大多数单位，不过也可以设置一个无单位的值，作为乘数，通常这种是比较好的做法。无单位的值乘以 `font-size` 来获得 `line-height`。当行与行之间拉开空间，正文文本通常看起来更好更容易阅读。推荐的行高大约是 1.5–2 (双倍间距) 所以要把我们的文本行高设置为字体高度的1.5倍，你可以使用这个:

  ```css
  p {
    line-height: 1.5;
  }
  ```

- **word-wrap**：语法：`word-wrap: normal|break-word`

  - normal：使用浏览器默认的换行

  - break-all：允许在单词内换行

- **text-overflow**：`text-overflow`设置或检索当当前行超过指定容器的边界时如何显示，属性有两个值选择：

  - clip：修剪文本
  - ellipsis：显示省略符号来代表被修剪的文本

- **text-shadow**：`text-shadow`可向文本应用阴影。能够规定水平阴影、垂直阴影、模糊距离，以及阴影的颜色

### 使用自定字体

在 @font-face 规则中：首先定义字体的名称（例如 myFirstFont），然后指向该字体文件。

提示：字体 URL 始终使用小写字母。大写字母可能会在 IE 中产生意外结果。

如需将字体用于 HTML 元素，请通过 font-family 属性引用字体名称（myFirstFont）：

实例

```css
@font-face {
  font-family: myFirstFont;
  src: url(sansation_light.woff);
}

div {
  font-family: myFirstFont;
}
```

### font-family多个属性

按顺序使用字体，如果没有第一种字体则使用第二种，以此类推

```css
font-family: zillaslab,palatino,"Palatino Linotype",serif;
```
