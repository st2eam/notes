## CSS 网格布局

CSS 网格布局模块（CSS Grid Layout Module）提供了带有行和列的基于网格的布局系统，它使网页设计变得更加容易，而无需使用浮动和定位。

### 网格元素

网格布局由一个父元素以及一个或多个子元素组成。

```html
<div class="grid-container">
  <div class="grid-item">1</div>
  <div class="grid-item">2</div>
  <div class="grid-item">3</div>
  <div class="grid-item">4</div>
  <div class="grid-item">5</div>
  <div class="grid-item">6</div>
  <div class="grid-item">7</div>
  <div class="grid-item">8</div>
  <div class="grid-item">9</div>
</div>
```

## 网格容器(Grid Container)属性

### Display 属性

当 HTML 元素的 `display` 属性设置为 `grid` 或 `inline-grid` 时，它就会成为网格容器。

`grid` ：生成一个块级网格

`inline-grid` ：生成一个内联网格

网格容器的所有直接子元素将自动成为网格项目。

### 行列间隙

`grid-column-gap` 属性设置列之间的间隙

`grid-row-gap` 属性设置行之间的间隙

`grid-gap` 属性是 `grid-row-gap` 和 `grid-column-gap` 属性的简写属性
![image](https://www.html.cn/newimg88/2018/12/dddgrid-gap.svg)

### 网格行（Grid Lines）

列之间的线称为列线（column lines）。

行之间的线称为行线（row lines）。

![image](https://www.w3school.com.cn/i/css/grid_lines.png)

```css
.item1 {
  grid-row-start: 1;
  grid-row-end: 3;
}
.item7 {
  grid-column-start: 2;
  grid-column-end: 4;
}
```

![qq截图20220326105110.png](https://note.youdao.com/yws/public/resource/c99ad8ee8977e056429a6768b07877cb/WEBd3069f5de83a56ce0eba78a8e5d2b1b3/WEBRESOURCE26caaa4efadc98a45732da98d4e1aa14?ynotemdtimestamp=1656685600918)

### grid-template-columns 属性

`grid-template-columns` 属性定义网格布局中的列数，并可定义每列的宽度。

该值是以空格分隔的列表，其中每个值定义相应列的长度。

如果您希望网格布局包含 4 列，请指定这 4 列的宽度；如果所有列都应当有相同的宽度，则设置为 "auto"。

```css
.grid-container {
  display: grid;
  grid-template-columns: auto auto auto auto;
}
```

### grid-template-rows 属性

`grid-template-rows` 属性定义每列的高度。

### grid-template-areas 属性

通过引用 `grid-area` 属性指定的 网格区域(Grid Area) 名称来定义网格模板。

一个点号（.）代表一个空单元格。这个语法本身可视作网格的可视化结构

none：不定义网格区域

```css
.item-a {
  grid-area: header;
}
.item-b {
  grid-area: main;
}
.item-c {
  grid-area: sidebar;
}
.item-d {
  grid-area: footer;
}

.container {
  grid-template-columns: 50px 50px 50px 50px;
  grid-template-rows: auto;
  grid-template-areas: 
    "header header header header"
    "main main . sidebar"
    "footer footer footer footer";
}
```

![image](https://www.html.cn/newimg88/2018/12/dddgrid-template-areas.svg)

### grid-template 属性

用于定义 `grid-template-rows` ，`grid-template-columns` ，`grid-template-areas` 简写属性。

```css
.container {
  grid-template:
    [row1-start] "header header header" 25px [row1-end]
    [row2-start] "footer footer footer" 25px [row2-end]
    / auto 50px auto;
}
```

等价于

```css
.container {
  grid-template-rows: [row1-start] 25px [row1-end row2-start] 25px [row2-end];
  grid-template-columns: auto 50px auto;
  grid-template-areas: 
    "header header header" 
    "footer footer footer";
}
```

### justify-items 属性

沿着 inline（行）轴线对齐网格项(grid items)

#### `start`：将网格项对齐到其单元格的左侧起始边缘（左侧对齐）

![image](https://www.html.cn/newimg88/2018/12/justify-items-start.svg)

#### `end`：将网格项对齐到其单元格的右侧结束边缘（右侧对齐）

![image](https://www.html.cn/newimg88/2018/12/justify-items-end.svg)

#### `center`：将网格项对齐到其单元格的水平中间位置（水平居中对齐）

![image](https://www.html.cn/newimg88/2018/12/justify-items-center.svg)

#### `stretch`：填满单元格的宽度（默认值）

![image](https://www.html.cn/newimg88/2018/12/justify-items-stretch.svg)

### align-items 属性

沿着 block（列）轴线对齐网格项(grid items)

#### `start`：将网格项对齐到其单元格的顶部起始边缘（顶部对齐）

![image](https://www.html.cn/newimg88/2018/12/align-items-start.svg)

#### `end`：将网格项对齐到其单元格的底部结束边缘（底部对齐）

![image](https://www.html.cn/newimg88/2018/12/align-items-end.svg)

#### `center`：将网格项对齐到其单元格的垂直中间位置（垂直居中对齐）

![image](https://www.html.cn/newimg88/2018/12/align-items-center.svg)

#### `stretch`：填满单元格的高度（默认值）

![image](https://www.html.cn/newimg88/2018/12/align-items-stretch.svg)

### place-items 属性

`place-items` 是设置 `align-items` 和 `justify-items` 的简写形式。

### justify-content 属性

`justify-content` 属性沿着 inline（行）轴线对齐网格格。

#### `start`：将网格对齐到 网格容器(grid container) 的左侧起始边缘（左侧对齐）

![image](https://www.html.cn/newimg88/2018/12/justify-content-start.svg)

#### `end`：将网格对齐到 网格容器 的右侧结束边缘（右侧对齐）

![image](https://www.html.cn/newimg88/2018/12/justify-content-end.svg)

#### `center`：将网格对齐到 网格容器 的水平中间位置（水平居中对齐）

![image](https://www.html.cn/newimg88/2018/12/justify-content-center.svg)

#### `stretch`：调整 网格项(grid items) 的宽度，允许该网格填充满整个 网格容器 的宽度

![image](https://www.html.cn/newimg88/2018/12/justify-content-stretch.svg)

#### `space-around`：在每个网格项之间放置一个均匀的空间，左右两端放置一半的空间

![image](https://www.html.cn/newimg88/2018/12/justify-content-space-around.svg)

#### `space-between`：在每个网格项之间放置一个均匀的空间，左右两端没有空间

![image](https://www.html.cn/newimg88/2018/12/justify-content-space-between.svg)

#### `space-evenly`：在每个网格项目之间放置一个均匀的空间，左右两端放置一个均匀的空间

![image](https://www.html.cn/newimg88/2018/12/justify-content-space-evenly.svg)

### align-content属性

`align-content`属性沿着 block（列）轴线对齐网格

#### `start`：将网格对齐到 网格容器(grid container) 的顶部起始边缘（顶部对齐）

![image](https://www.html.cn/newimg88/2018/12/align-content-start.svg)

#### `end`：将网格对齐到 网格容器 的底部结束边缘（底部对齐）

![image](https://www.html.cn/newimg88/2018/12/align-content-end.svg)

#### `center`：将网格对齐到 网格容器 的垂直中间位置（垂直居中对齐）

![image](https://www.html.cn/newimg88/2018/12/align-content-center.svg)

#### `stretch`：调整 网格项(grid items) 的高度，允许该网格填充满整个 网格容器 的高度

![image](https://www.html.cn/newimg88/2018/12/align-content-stretch.svg)

#### `space-around`：在每个网格项之间放置一个均匀的空间，上下两端放置一半的空间

![image](https://www.html.cn/newimg88/2018/12/align-content-space-around.svg)

#### `space-between`：在每个网格项之间放置一个均匀的空间，上下两端没有空间

![image](https://www.html.cn/newimg88/2018/12/align-content-space-between.svg)

#### `space-evenly`：在每个网格项目之间放置一个均匀的空间，上下两端放置一个均匀的空间

![image](https://www.html.cn/newimg88/2018/12/align-content-space-evenly.svg)

### place-content 属性

`place-content` 是设置 `align-content` 和 `justify-content` 的简写形式。

### grid-auto-columns / grid-auto-rows 属性

指定任何自动生成的网格轨道(grid tracks)（又名隐式网格轨道）的大小。当网格中的网格项多于单元格时，或者当网格项位于显式网格之外时，就会创建隐式轨道。

现在想象一下，你使用 grid-column 和 grid-row 来定位你的网格项，像这样：

```css
.item-a {
  grid-column: 1 / 2;
  grid-row: 2 / 3;
}
.item-b {
  grid-column: 5 / 6;
  grid-row: 2 / 3;
}
```

![image](https://www.html.cn/newimg88/2018/12/grid-auto-columns-rows-02.svg)

我们告诉 `.item-b` 从第 5 条列网格线开始到第 6 条列网格线结束，但我们从来没有定义过 第5 或 第6 列网格线。
因为我们引用的网格线不存在，所以创建宽度为 0 的隐式网格轨道以填补空缺。我们可以使用 `grid-auto-columns` 和 `grid-auto-rows` 来指定这些隐式轨道的大小：

```css
.container {
  grid-auto-columns: 60px;
}
```

![image](https://www.html.cn/newimg88/2018/12/grid-auto-columns-rows-03.svg)

### grid-auto-flow 属性

如果你有一些没有明确放置在网格上的网格项(grid items)，自动放置算法 会自动放置这些网格项。该属性控制自动布局算法如何工作。

`row`：告诉自动布局算法依次填充每行，根据需要添加新行 （默认）
`column`：告诉自动布局算法依次填入每列，根据需要添加新列
`dense`：告诉自动布局算法在稍后出现较小的网格项时，尝试填充网格中较早的空缺

注意 dense 只会更改网格项的可视顺序，并可能导致它们出现乱序，这对可访问性不利。

定义一个有 5 列和 2 行的网格，并将 grid-auto-flow 设置为 row（也就是默认值）

```css
.container {
  display: grid;
  grid-template-columns: 60px 60px 60px 60px 60px;
  grid-template-rows: 30px 30px;
  grid-auto-flow: row;
}

.item-a {
  grid-column: 1;
  grid-row: 1 / 3;
}
.item-e {
  grid-column: 5;
  grid-row: 1 / 3;
}
```

![image](https://www.html.cn/newimg88/2018/12/grid-auto-flow-01.svg)

如果我们把 grid-auto-flow 设成了 column ，那么 item-b，item-c，item-d 会沿着列向下排列

```css
.container {
  display: grid;
  grid-template-columns: 60px 60px 60px 60px 60px;
  grid-template-rows: 30px 30px;
  grid-auto-flow: column;
}
```

![image](https://www.html.cn/newimg88/2018/12/grid-auto-flow-02.svg)

### minmax函数

上面的例子我们设定了每一行的高度为100px，但有时候设置的固定宽度或高度可能会不够用，所以，我们希望可以将其设定为至少100像素，而且可以跟随内容来自动拓展尺寸来保证容纳所有内容。显而易见，你很难知道网页上某个元素的尺寸在不同情况下会变成多少，所以，我们有了 `minmax` 函数。

`minmax` 函数为一个行/列的尺寸设置了取值范围，比如设定 `minmax(100px, auto)`，那么尺寸就至少为100像素，并且如果内容尺寸大于100像素则会根据内容自动调整，这里试一下把 `grid-auto-rows` 属性设置为 `minmax` 函数，然后来看一下效果。

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(100px, auto);
  grid-gap: 20px;
}
```

如果所有网格内的内容均小于100像素，那么看起来不会有变化，但如果其中某一项放入很长的内容或者图片，你可以看到这个格子所在的那一行的高度编程能刚好容纳内容的高度了。注意我们修改的是 `grid-auto-rows`，因此只会作用于隐式网格，当然，这一属性也可以应用于显式网格。

### grid

在一个声明中设置所有以下属性的简写：

- grid-template-rows
- grid-template-columns
- grid-template-areas
- grid-auto-rows
- grid-auto-columns
- grid-auto-flow

## 子元素 网格项(Grid Items) 属性

### grid-column-start / grid-column-end / grid-row-start / grid-row-end

```css
.item-a {
  grid-column-start: 2;
  grid-column-end: five;
  grid-row-start: row1-start
  grid-row-end: 3;
}
```

![image](https://www.html.cn/newimg88/2018/12/grid-column-row-start-end-01.svg)

```css
.item-b {
  grid-column-start: 1;
  grid-column-end: span col4-start;
  grid-row-start: 2
  grid-row-end: span 2
}
```

![image](https://www.html.cn/newimg88/2018/12/grid-column-row-start-end-02.svg)

如果没有声明指定 grid-column-end / grid-row-end，默认情况下，该网格项将占据 1 个轨道。

项目可以相互重叠。您可以使用 z-index 来控制它们的重叠顺序。

### grid-column / grid-row 属性

分别为 grid-column-start + grid-column-end 和 grid-row-start + grid-row-end 的简写形式。

### grid-area 属性

#### 可以作为 网格容器 `grid-template-areas` 属性创建的模板进行引用

```css
.item-d {
  grid-area: header
}
```

#### 也可以作为`grid-row-start` + `grid-column-start` + `grid-row-end` + `grid-column-end` 属性的简写形式

```css
.item-d {
    grid-area: 1 / col4-start / last-line / 6
}
```

![image](https://www.html.cn/newimg88/2018/12/grid-area.svg)

### justify-self 属性

沿着 inline（行）轴线对齐网格项。

#### `start`：将网格项对齐到其单元格的左侧起始边缘（左侧对齐）

![image](https://www.html.cn/newimg88/2018/12/justify-self-start.svg)

#### `end`：将网格项对齐到其单元格的右侧结束边缘（右侧对齐）

![image](https://www.html.cn/newimg88/2018/12/justify-self-end.svg)

#### `center`：将网格项对齐到其单元格的水平中间位置（水平居中对齐）

![image](https://www.html.cn/newimg88/2018/12/justify-self-center.svg)

#### `stretch`：填满单元格的宽度（默认值）

![image](https://www.html.cn/newimg88/2018/12/justify-self-stretch.svg)

### align-self 属性

沿着 block（列）轴线对齐网格项(grid items)

#### `start`：将网格项对齐到其单元格的顶部起始边缘（顶部对齐）

![image](https://www.html.cn/newimg88/2018/12/align-self-start.svg)

#### `end`：将网格项对齐到其单元格的底部结束边缘（底部对齐）

![image](https://www.html.cn/newimg88/2018/12/justify-self-start.svg)

#### `center`：将网格项对齐到其单元格的垂直中间位置（垂直居中对齐）

![image](https://www.html.cn/newimg88/2018/12/justify-self-start.svg)

#### `stretch`：填满单元格的高度（默认值）

![image](https://www.html.cn/newimg88/2018/12/justify-self-start.svg)

### place-self 属性

`place-self` 是设置 `align-self` 和 `justify-self` 的简写形式。

`auto` – 布局模式的 “默认” 对齐方式。

第一个值设置 align-self 属性，第二个值设置 justify-self 属性。

如果省略第二个值，则将第一个值同时分配给这两个属性。

### 动画（Animation）

根据 CSS Grid 布局模块 Level 1 规范，有 5 个可应用动画的网格属性：

grid-gap， grid-row-gap，grid-column-gap 作为长度，百分比或 calc。

grid-template-columns，grid-template-rows 作为长度，百分比或calc的简单列表，只要列表中长度、百分比或calc组件的值不同即可。
