## 盒模型

### CSS Box Sizing

CSS box-sizing 属性允许我们在元素的总宽度和高度中包括内边距（填充）和边框。

#### 假如不指定 CSS box-sizing 属性

默认情况下，元素的宽度和高度是这样计算的：

width + padding + border = 元素的实际宽度
height + padding + border = 元素的实际高度

![image](https://www.w3school.com.cn/i/css/boxmodel.gif)

#### 如果使用 CSS box-sizing 属性

box-sizing 属性允许我们在元素的总宽度和高度中包括内边距和边框。

如果在元素上设置了 box-sizing: border-box;，则宽度和高度会包括内边距和边框：

```css
* {
  box-sizing: border-box;
}
```

### CSS 内边距

CSS padding 属性用于在任何定义的边界内的元素内容周围生成空间。

### CSS 外边距

CSS margin 属性用于在任何定义的边框之外，为元素周围创建空间。

如果 margin 属性有四个值：

```
margin: 25px 50px 75px 100px;
```

上外边距是 25px  
右外边距是 50px  
下外边距是 75px  
左外边距是 100px  

### auto 值

您可以将 margin 属性设置为 auto，以使元素在其容器中水平居中。
