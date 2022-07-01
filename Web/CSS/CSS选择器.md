## CSS选择器

### CSS 元素选择器

元素选择器根据元素名称来选择 HTML 元素。

```css
p {
  text-align: center;
  color: red;
}
```

### CSS id 选择器(#)

id 选择器使用 HTML 元素的 id 属性来选择特定元素。

```css
#para1 {
  text-align: center;
  color: red;
}
```

### CSS 类选择器(.)

类选择器选择有特定 class 属性的 HTML 元素。

```css
.center {
  text-align: center;
  color: red;
}
```

### CSS 通用选择器(*)

通用选择器（*）选择页面上的所有的 HTML 元素。

```css
* {
  text-align: center;
  color: blue;
}
```

### CSS 分组选择器

分组选择器选取所有具有相同样式定义的 HTML 元素。

```css
h1, 
h2,
p {
  text-align: center;
  color: red;
}
```

## CSS 组合器

### 后代选择器(空格)

后代选择器匹配属于指定元素后代的所有元素。

### 子选择器(>)

子选择器匹配属于指定元素子元素的所有元素。

### 相邻兄弟选择器(+)

相邻兄弟选择器匹配所有作为指定元素的相邻同级的元素。

兄弟（同级）元素必须具有相同的父元素，“相邻”的意思是“紧随其后”。

### 通用兄弟选择器(~)

通用兄弟选择器匹配属于指定元素的同级元素的所有元素。

## [CSS 伪类](https://www.w3school.com.cn/css/css_pseudo_classes.asp)

## [CSS 伪元素](https://www.w3school.com.cn/css/css_pseudo_elements.asp)

## CSS 特异性

#### 特异性层次

每个选择器在特异性层次结构中都有其位置。以下四种类别定义了选择器的特异性级别：

**行内样式** - 行内（内联）样式直接附加到要设置样式的元素。实例：```<h1 style="color: #ffffff;">```。

**ID** - ID 是页面元素的唯一标识符，例如 #navbar。

**类、属性和伪类** - 此类别包括 .classes、[attributes] 和伪类，例如：:hover、:focus 等。

**元素和伪元素** - 此类别包括元素名称和伪元素，比如 h1、div、:before 和 :after。

#### 如何计算特异性？

从 0 开始，为 style 属性添加 1000，为每个 ID 添加 100，为每个属性、类或伪类添加 10，为每个元素名称或伪元素添加 1。

##### 特异性规则 1：

在特异性相同的情况下：最新的规则很重要 - 如果将同一规则两次写入外部样式表，那么样式表中后面的规将更靠近要设置样式的元素，因此会被应用：

实例

```css
h1 {background-color: yellow;}
h1 {background-color: red;}/*应用*/
```

##### 特异性规则 2：

ID 选择器比属性选择器拥有更高的特异性 - 请看以下三行代码：

实例

```css
div#a {background-color: green;}/*应用*/
#a {background-color: yellow;}
div[id=a] {background-color: blue;}
```

##### 特异性规则 3：

上下文选择器比单一元素选择器更具体 - 嵌入式样式表更靠近要设置样式的元素。所以在以下情况下：

实例
来自外部 CSS 文件：

```css
#content h1 {background-color: red;}
```

在 HTML 文件中：

```html
<style>
#content h1 {
  background-color: yellow;
}
</style>
```

将适用后一条规则。

##### 特异性规则 4：

类选择器会击败任意数量的元素选择器 - 类选择器（诸如 .intro 会击败 h1、p、div 等）：

实例

```css
.intro {background-color: yellow;}/*应用*/
h1 {background-color: red;}
```

### [选择器参考手册](https://www.w3school.com.cn/cssref/css_selectors.asp)
