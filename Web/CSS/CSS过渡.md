### 对过渡的浏览器支持

表格中的数字注明了完全支持该属性的首个浏览器版本。
![image.png](https://note.youdao.com/yws/public/resource/c99ad8ee8977e056429a6768b07877cb/WEB998c28b0c3a66578b0bf0cb93f3ee811/WEBRESOURCE12c08b35243363422d1da581b9bfd966?ynotemdtimestamp=1656685941051)
CSS 过渡允许您在给定的时间内平滑地改变属性值。

### 如何使用 CSS 过渡？

如需创建过渡效果，必须明确两件事：

- 您要添加效果的 CSS 属性
- 效果的持续时间

实例

```css
div {
  width: 100px;
  height: 100px;
  background: aqua;
  transition: width .3s, height .2s;
}

div:hover {
  width: 300px;
  height: 300px;
}
```

### 指定过渡的速度曲线

transition-timing-function 属性规定过渡效果的速度曲线。

transition-timing-function 属性可接受以下值：

- ease - 规定过渡效果，先缓慢地开始，然后加速，然后缓慢地结束（默认）
- linear - 规定从开始到结束具有相同速度的过渡效果
- ease-in -规定缓慢开始的过渡效果
- ease-out - 规定缓慢结束的过渡效果
- ease-in-out - 规定开始和结束较慢的过渡效果
- cubic-bezier(n,n,n,n) - 允许您在三次贝塞尔函数中定义自己的值
  
  ```css
  #div1 {transition-timing-function: linear;}
  #div2 {transition-timing-function: ease;}
  #div3 {transition-timing-function: ease-in;}
  #div4 {transition-timing-function: ease-out;}
  #div5 {transition-timing-function: ease-in-out;}
  ```

### 延迟过渡效果

transition-delay 属性规定过渡效果的延迟（以秒计）。

下例在启动之前有 1 秒的延迟：

```css
div {
  transition-delay: 1s;
}
```
