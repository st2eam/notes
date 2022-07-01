## 背景简写属性

在使用简写属性时，属性值的顺序为：

- background-color
- background-image
- background-repeat
- background-attachment
- background-position

## 1.background-color

## 2.background-image

#### CSS多重背景

CSS 允许您通过 background-image 属性为一个元素添加多幅背景图像。

不同的背景图像用逗号隔开，并且图像会彼此堆叠，其中的第一幅图像最靠近观看者。

下面的例子有两幅背景图像，第一幅图像是花朵（与底部和右侧对齐），第二幅图像是纸张背景（与左上角对齐）：

实例

```css
#example1 {
  background-image: url(flower.gif), url(paper.gif);
  background-position: right bottom, left top;
  background-repeat: no-repeat, repeat;
}
简写属性：
#example1 {
  background: url(flower.gif) right bottom no-repeat, url(paper.gif) left top repeat;
}
```

## 3.background-repeat

#### repeat-x/y

仅在水平方向重复

#### no-repeat

只显示一次背景图像

## 4.background-attachment

```background-attachment``` 属性指定背景图像是应该滚动还是固定的

#### fixed

指定应该固定背景图像

#### scroll

指定背景图像应随页面的其余部分一起滚动

## 5.background-position

#### 把背景图片放在右上角：

```css
background-position: right top;
```

## 6.background-size

可以通过长度、百分比或使用以下两个关键字之一来指定背景图像的大小：contain 或 cover。

```contain ```关键字将背景图像缩放为尽可能大的尺寸（但其宽度和高度都必须适合内容区域）。这样，取决于背景图像和背景定位区域的比例，可能存在一些未被背景图像覆盖的背景区域。

```

```cover ```关键字会缩放背景图像，以使内容区域完全被背景图像覆盖（其宽度和高度均等于或超过内容区域）。这样，背景图像的某些部分可能在背景定位区域中不可见。

## 7.background-origin

属性指定背景图像的位置。

该属性接受三个不同的值：

- border-box - 背景图片从边框的左上角开始
- padding-box -背景图像从内边距边缘的左上角开始（默认）
- content-box - 背景图片从内容的左上角开始

## 8.background-clip

属性指定背景的绘制区域。

该属性接受三个不同的值：

- border-box - 背景绘制到边框的外部边缘（默认）
- padding-box - 背景绘制到内边距的外边缘
- content-box - 在内容框中绘制背景
