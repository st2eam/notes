### 对动画的浏览器支持

表格中的数字注明了完全支持该属性的首个浏览器版本。
![image.png](https://note.youdao.com/yws/public/resource/c99ad8ee8977e056429a6768b07877cb/WEBa129769ea214f31c03e74f35bf02810f/WEBRESOURCEa592c2ab119b801ea465a247eb1daa2d?ynotemdtimestamp=1656685835032)

### 什么是 CSS 动画？

动画使元素逐渐从一种样式变为另一种样式。

您可以随意更改任意数量的 CSS 属性。

如需使用 CSS 动画，您必须首先为动画指定一些关键帧。

关键帧包含元素在特定时间所拥有的样式。

### 动画和过渡的区别

1. 动画不需要事件触发，过渡需要。

2. 过渡只有一组（两个：开始-结束） 关键帧，动画可以设置多个。

### @keyframes 规则

如果您在 @keyframes 规则中指定了 CSS 样式，动画将在特定时间逐渐从当前样式更改为新样式。

要使动画生效，必须将动画绑定到某个元素。

实例(from-to)

```css
/* 动画代码 */
@keyframes example {
  from {background-color: red;}
  to {background-color: yellow;}
}

/* 向此元素应用动画效果 */
div {
  width: 100px;
  height: 100px;
  background-color: red;
  animation-name: example;
  animation-duration: 4s;
}
```

实例(n%)

```css
/* 动画代码 */
@keyframes example {
  0%   {background-color: red;}
  25%  {background-color: yellow;}
  50%  {background-color: blue;}
  100% {background-color: green;}
}

/* 应用动画的元素 */
div {
  width: 100px;
  height: 100px;
  background-color: red;
  animation-name: example;
  animation-duration: 4s;
}
```

### 延迟动画

`animation-delay` 属性规定动画开始的延迟时间。负值也是允许的。

### 设置动画应运行多少次

`animation-iteration-count` 属性指定动画应运行的次数。

使用值 "infinite" 使动画永远持续下去

### 反向或交替运行动画

`animation-direction` 属性指定是向前播放、向后播放还是交替播放动画。

animation-direction 属性可接受以下值：

- normal - 动画正常播放（向前）。默认值
- reverse - 动画以反方向播放（向后）
- alternate - 动画先向前播放，然后向后
- alternate-reverse - 动画先向后播放，然后向前

### 指定动画的速度曲线

`animation-timing-function` 属性规定动画的速度曲线。

animation-timing-function 属性可接受以下值：

- ease - 指定从慢速开始，然后加快，然后缓慢结束的动画（默认）
- linear - 规定从开始到结束的速度相同的动画
- ease-in - 规定慢速开始的动画
- ease-out - 规定慢速结束的动画
- ease-in-out - 指定开始和结束较慢的动画
- cubic-bezier(n,n,n,n) - 运行您在三次贝塞尔函数中定义自己的值
  
  ```css
  #div1 {animation-timing-function: linear;}
  #div2 {animation-timing-function: ease;}
  #div3 {animation-timing-function: ease-in;}
  #div4 {animation-timing-function: ease-out;}
  #div5 {animation-timing-function: ease-in-out;}
  ```

### 指定动画的填充模式

CSS 动画不会在第一个关键帧播放之前或在最后一个关键帧播放之后影响元素。animation-fill-mode 属性能够覆盖这种行为。

在不播放动画时（在开始之前，结束之后，或两者都结束时），animation-fill-mode 属性规定目标元素的样式。

animation-fill-mode 属性可接受以下值：

- `none` - 默认值。动画在执行之前或之后不会对元素应用任何样式。

- `forwards` - 元素将保留由最后一个关键帧设置的样式值（依赖 animation-direction 和 animation-iteration-count）。

- `backwards` - 元素将获取由第一个关键帧设置的样式值（取决于 animation-direction），并在动画延迟期间保留该值。

- `both` - 动画会同时遵循向前和向后的规则，从而在两个方向上扩展动画属性。
