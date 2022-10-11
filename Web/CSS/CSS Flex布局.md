## Flexbox 布局

> （也叫Flex布局，弹性盒子布局）模块

Flex 布局的主要思想是使父容器能够调节子元素的宽度/高度（和排列顺序），从而能够最好地填充可用空间（主要是为了适应所有类型的显示设备和屏幕尺寸）。flex布容器能够放大子元素使之尽可能填充可用空间，也可以收缩子元素使之不溢出。

### 基础知识和术语

如果 “常规”布局基于 block(块) 和 inline(内联) 流动方向，flex 布局则是基于 “flex-flow(弹性流动)” 方向。

![00-basic-terminology.png](https://note.youdao.com/yws/public/resource/c99ad8ee8977e056429a6768b07877cb/WEBdbb58316be8753200032fbd5f7d79fdd/WEBRESOURCE99e71354bf2f4ea5e691a08a7136331d?ynotemdtimestamp=1656685689905)

在flex布局中，flex 项（就是子元素）

1. 要么按照 main axis(主轴)（从 main-start 到 main-end ）排布
2. 要么按照cross axis(交叉轴) (从 cross-start 到cross-end)排布。

- **main axis**: flex 容器的主轴，flex 项沿着主轴排布，注意主轴不一定是水平的，主轴是水平还是垂直取决于 flex-direction 属性（见下文）。
- **main-start|main-end**: 分别表示主轴的开始位置和结束位置，flex 项在容器中会从 main-start 到 main-end 排布。
- **main size**: flex 项占据主轴的宽度或高度。flex 项的 main size 属性是要么是“宽度”，要么是“高度”，这取决于主轴方向。
- **cross axis**: 垂直于主轴的轴线称为交叉轴，其方向取决于主轴方向。
- **cross-start|cross-end**: 分别表示交叉轴的开始位置和结束位置。flex 项在交叉轴上的排布从 cross-start 开始位置到 cross-end 结束位置。
- **cross size**: flex 项占据交叉轴的宽度或高度。flex 项的 cross size 属性是要么是“宽度”，要么是“高度”，这取决于交叉轴方向。

### 父元素属性(flex container)

![image](https://www.html.cn/newimg88/2018/12/01-container.svg)

#### display

用来定义一个 flex 容器。如果设置为 flex 则容器呈现为块状元素，设置为inline-flex 则容器呈现为行内元素。它为所有直接子元素提供了 flex 上下文。

CSS 代码:

```css
.container {
  display: flex; /* or inline-flex */
}
```

请注意，CSS 列对 flex 容器没有影响。当然这是 Flexbox 布局的开始。

#### flex-direction

![image](https://www.html.cn/newimg88/2018/12/flex-direction.svg)

flex-direction 属性确立了主轴，从而定义了 flex 项在 flex 容器中的排布方向。
Flexbox 是单向布局，有些时候我们也称作一维布局。 可以将 flex 项视为主要沿着水平行或垂直列排布。

```css
.container {
  flex-direction: row | row-reverse | column | column-reverse;
}
```

#### flex-wrap

![image](https://www.html.cn/newimg88/2018/12/flex-wrap.svg)
默认情况下，flex 项会尽可能地尝试排在同一行上（行或列），通过设置 flex-wrap 来决定 flex 项是否允需要换行。

```css
.container{
  flex-wrap: nowrap | wrap | wrap-reverse;
}
```

- **nowrap (默认值)**: 所有的 flex 项都会在同一行上排布，也就是我们常说的单行，或不换行。
- **wrap**: flex 项将从上到下根据实际情况排布再多行上，也就是我们常说的多行，或会换行。
- **wrap-reverse**: flex 项将 从下到上 根据实际情况排布再多行上折行。

#### justify-content

![image](https://www.html.cn/newimg88/2018/12/justify-content.svg)

`justify-content`属性定义了flex 项沿主轴方向的对齐方式。
当一行中的所有 flex 项都是固定大小，或者是灵活大小但已经达到最大 main size 时，它可以帮助分配主轴上的剩余空间。当 flex 项溢出主轴的时候，它还可以用来控制flex 项的对齐方式。

```css
.container {
  justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly;
}
```

- **flex-start (默认值)** : flex 项从主轴的开始位置（main-start）开始排布。

- **flex-end** : flex 项从主轴的结束位置（main-end）开始排布

- **center**: flex 项沿主轴居中排布。

- **space-betwee**n: flex 项沿主轴均匀排布，即我们常说的沿主轴 两端对齐 ，第一个flex 项在主轴开始位置，最后一个flex 项在主轴结束位置。

- **space-around**: flex 项沿主轴均匀排布。要注意的是 flex 项看起来间隙是不均匀的，因为所有 flex 项两边的空间是相等的。第一项在容器边缘有一个单位的空间，但是在两个 flex 项之间有两个单位的间隙，因为每个 flex 项的两侧都有一个单位的间隙。

- **space-evenly**: 任何两个 flex 项之间的间距（以及到 flex 容器边缘的空间）相等。（注：该属性以前很少看到，原因是以前浏览器不支持，chrome 也是 60 版本之后才支持。延伸一下，align-content: space-evenly 也是这个逻辑，大家可以查看下面的demo。 ）

#### align-items

![image](https://www.html.cn/newimg88/2018/12/align-items.svg)

`align-items` 定义了 flex 项如何沿当前行在交叉轴上排布的默认行为。可以将其视为交叉轴（垂直于主轴）上的对齐方式。

```css
.container {
  align-items: flex-start | flex-end | center | baseline | stretch;
}
```

- **flex-start**: flex 项按照交叉轴的开始位置（cross-start）对齐。
- **flex-end**: flex 项按照交叉轴的结束位置（cross-end）对齐。
- **center**: flex 项以交叉轴为中心，居中对齐。
- **baseline**: flex 项按照他们的文字基线对齐。
- **stretch** (默认值) : 拉伸 flex 项以填充整个容器（这里特别要注意：如果 flex 项有尺寸属性（min-width / max-width / width / min-height / max-height / height），那么首先应用这些尺寸属性。

#### align-content

![image](https://www.html.cn/newimg88/2018/12/align-content.svg)

```css
.container {
  align-content: flex-start | flex-end | center | space-between | space-around | stretch;
}
```

- **flex-start**：多行在容器的开始位置排布
- **flex-end**：多行在容器的结束位置排布
- **center**：多行在容器的中间位置排布
- **space-between**：多行均匀分布；第一行分布在容器的开始位置，最后一行分布在容器的结束位置
- **space-around**: 多行均匀分布，并且每行的间距（包括离容器边缘的间距）相同；
- **strech** (默认值)：多行拉伸以填充满整个剩余空间

### flex 项属性 (flex items)

![image](https://www.html.cn/newimg88/2018/12/02-items.svg)

#### order

![image](https://www.html.cn/newimg88/2018/12/order.svg)

默认情况下，flex 项按源（HTML结构）顺序排布。但是，order 属性可以控制它们在 flex 容器中的显示顺序。

```css
.item {
  order: <integer>;  /* 默认值是 0 */
}
```

#### flex-grow

![image](https://www.html.cn/newimg88/2018/12/flex-grow.svg)

```css
.item {
  flex-grow: <number>; /* default 0 */
}
```

> 注，举个例子帮助你理解：
>
> 比如我们得 flex 容器中有 6 个 flex 项，每个 flex 项的 flex-grow 初始值都是 1。如果我们将每个 flex 项的 flex-grow 相加起来，总和为 6。因此 flex 容器的总宽度被平均分成了 6 份。每个 flex 项增长到填充容器可用空间的1/6。
>
> 当我们将第 3 个 flex 项的 flex-grow 设置为 2 时，flex 容器现在被分成了 7 等份，因为所有 flex-grow 属性是：1 + 1 + 2 + 1 + 1 + 1。第 3 个 flex 项占了整个容器空间的 2/7，其他的占了 1/7。
>
> 具体可以查看 [【Flex布局教程】更多关于Flexbox布局如何工作的 – 用大彩图和GIF动画解释](https://www.html.cn/archives/7236)中的 “属性 #2: Flex Grow（拉伸）”

#### flex-shrink

flex-shrink 定义了 flex 项的收缩的能力。（注：与 flex-grow 拉伸正好相反，flex-shrink 决定 flex 项允许收缩多少比例。）

CSS 代码:

```css
.item {
  flex-shrink: <number>; /* default 1 */
}
```

注：负值对于 flex-shrink 无效。

#### flex-basis

flex-basis 定义了在分配剩余空间之前 flex 项默认的大小。可以设置为某个长度值（e.g. 20%, 5rem,等）或者关键字。关键字 auto 意味着 flex 项会按照其本来的大小显示（暂时由 main-size 关键字完成，直到弃用）。关键字 content 意味着根据内容来确定大小——这个关键字到目前没有被很好地支持，所以测试起来比较困难，与content的类似的关键字还有max-content, min-content, fit-content。

CSS 代码:

```css
.item {
  flex-basis: <length> | auto; /* default auto */
}
```

如果设置为 0 , 则 flex 项内容周围的空隙不会根据 flex-grow 按比例分配，如果设置为 auto，则 flex 项周围额外的空袭会根据 flex-grow 按照比例分配，如下图：
![image](https://www.html.cn/newimg88/2017/12/rel-vs-abs-flex.svg)

#### flex

flex 是 flex-grow、flex-shrink、flex-basis 三个属性的缩写。其中第二个和第三个参数(flex-shrink 和 flex-basis)是可选的。默认值为0 1 auto。

CSS 代码:

```css
.item {
  flex: none | [ < 'flex-grow'> < 'flex-shrink'>? || < 'flex-basis'> ]
}
```

推荐使用缩写形式而不是单独地设置每一个属性，缩写形式中会更加智能地计算出相关值。

#### align-self

![image](https://www.html.cn/newimg88/2018/12/align-self.svg)

align-self 属性允许某个单独的 flex 项覆盖默认的对齐方式（或由 align-items 指定的对齐方式）。

具体的属性值得含义可以参考 align-items的解释。

CSS 代码:

```css
.item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

注：float,clear和vertical-align 对 flex 项没有任何作用。
