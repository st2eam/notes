## CSS 2D 转换

CSS 转换（transforms）允许您移动、旋转、缩放和倾斜元素。

### 1.translate() 方法

translate() 方法从其当前位置移动元素（根据为 X 轴和 Y 轴指定的参数）。
![image](https://www.w3school.com.cn/i/css/transform_translate.gif)
下面的例子把```<div>``` 元素从其当前位置向右移动 50 个像素，并向下移动 100 个像素：

```
div {
  transform: translate(50px, 100px);
}
```

### 2.rotate() 方法

rotate() 方法根据给定的角度顺时针或逆时针旋转元素。
![image](https://www.w3school.com.cn/i/css/transform_rotate.gif)

下面的例子把``` <div>``` 元素顺时针旋转 20 度：

```
div {
  transform: rotate(20deg);
}
```

### 3.scale() 方法

scale() 方法增加或减少元素的大小（根据给定的宽度和高度参数）。

![image](https://www.w3school.com.cn/i/css/transform_scale.gif)

下面的例子把``` <div>``` 元素增大为其原始宽度的两倍和其原始高度的三倍：

```
div {
  transform: scale(2, 3);
}
```

下面的例子把``` <div>``` 元素减小为其原始宽度和高度的一半：

```
div {
  transform: scale(0.5, 0.5);
}
```

### 4.skewX() 方法

skewX() 方法使元素沿 X 轴倾斜给定角度。

下例把``` <div>``` 元素沿X轴倾斜 20 度：

```
div {
  transform: skewX(20deg);
}
```

### 5.skewY() 方法

skewY() 方法使元素沿 Y 轴倾斜给定角度。

下例把``` <div>``` 元素沿 Y 轴倾斜 20 度：

```
div {
  transform: skewY(20deg);
}
```

### 6.matrix() 方法

matrix() 方法把所有 2D 变换方法组合为一个。

![image](https://www.w3school.com.cn/i/css/transform_rotate.gif)

matrix() 方法可接受六个参数，其中包括数学函数，这些参数使您可以旋转、缩放、移动（平移）和倾斜元素。

参数如下：

```css
matrix(scaleX(),skewY(),skewX(),scaleY(),translateX(),translateY())
```

实例

```
div {
  transform: matrix(1, -0.3, 0, 1, 0, 0);
}
```

### CSS 3D 转换方法

通过 CSS transform 属性，您可以使用以下 3D 转换方法：

```css
translate3d(x,y,z)
translateX(x)
translateY(y)
translateZ(z)

scale3d(x,y,z)
scaleX(x)
scaleY(y)
scaleZ(z)

rotate3d(x,y,z,angle)
rotateX()
rotateY()
rotateZ()
```

