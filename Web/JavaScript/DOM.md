# 文档对象模型（DOM）

> 通过 HTML DOM，JavaScript 能够访问和改变 HTML 文档的所有元素。

当网页被加载时，浏览器会创建页面的文档对象模型（Document Object Model）。

HTML DOM 模型被结构化为对象树：
![image](https://www.runoob.com/images/htmltree.gif)
通过这个对象模型，JavaScript 获得创建动态 HTML 的所有力量：

- JavaScript 能改变页面中的所有 HTML 元素
- JavaScript 能改变页面中的所有 HTML 属性
- JavaScript 能改变页面中的所有 CSS 样式
- JavaScript 能删除已有的 HTML 元素和属性
- JavaScript 能添加新的 HTML 元素和属性
- JavaScript 能对页面中所有已有的 HTML 事件作出反应
- JavaScript 能在页面中创建新的 HTML 事件

HTML DOM 方法是您能够（在 HTML 元素上）执行的动作。

HTML DOM 属性是您能够设置或改变的 HTML 元素的值。

## HTML DOM 方法

### 查找 HTML 元素

```js
document.getElementById(id)    //通过元素 id 来查找元素
document.getElementsByTagName(name)    //通过标签名来查找元素
document.getElementsByClassName(name) //通过类名来查找元素
```

### 改变HTML元素

```js
element.innerHTML = new html content    //改变元素的 inner HTML
element.attribute = new value    //改变 HTML 元素的属性值
element.setAttribute(attribute, value)    //改变 HTML 元素的属性值
element.style.property = new style    //改变 HTML 元素的样式
```

### 添加和删除元素

```js
document.createElement(element)    //创建 HTML 元素
document.removeChild(element)    //删除 HTML 元素
document.appendChild(element)    //添加 HTML 元素
document.replaceChild(element)    //替换 HTML 元素
document.write(text)    //写入 HTML 输出流
```

### 添加事件处理程序

```js
document.getElementById(id).onclick = function(){code}    //向 onclick 事件添加事件处理程序
```

### DOM 事件监听程序

```js
element.addEventListener(event, function, useCapture);
```

- 第一个参数是事件的类型（比如 "click" 或 "mousedown"）。

- 第二个参数是当事件发生时我们需要调用的函数。

- 第三个参数是布尔值，指定使用事件冒泡还是事件捕获。默认值是 false，将使用冒泡传播，如果该值设置为 true，则事件使用捕获传播。
  
  ### 查找 HTML 对象
  
  ```js
  document.anchors                //返回拥有 name 属性的所有 <a> 元素。    1
  document.applets                //返回所有 <applet> 元素（HTML5 不建议使用）    1
  document.baseURI                //返回文档的绝对基准 URI    3
  document.body                   //返回 <body> 元素    1
  document.cookie                 //返回文档的 cookie    1
  document.doctype                //返回文档的 doctype    3
  document.documentElement        //返回 <html> 元素    3
  document.documentMode           //返回浏览器使用的模式    3
  document.documentURI            //返回文档的 URI    3
  document.domain                 //返回文档服务器的域名    1
  document.domConfig              //废弃。返回 DOM 配置    3
  document.embeds                 //返回所有 <embed> 元素    3
  document.forms                  //返回所有 <form> 元素    1
  document.head                   //返回 <head> 元素    3
  document.images                 //返回所有 <img> 元素    1
  document.implementation         //返回 DOM 实现    3
  document.inputEncoding          //返回文档的编码（字符集）    3
  document.lastModified           //返回文档更新的日期和时间    3
  document.links                  //返回拥有 href 属性的所有 <area> 和 <a> 元素    1
  document.readyState             //返回文档的（加载）状态    3
  document.referrer               //返回引用的 URI（链接文档）    1
  document.scripts                //返回所有 <script> 元素    3
  document.strictErrorChecking    //返回是否强制执行错误检查    3
  document.title                  //返回 <title> 元素    1
  document.URL                    //返回文档的完整 URL    1
  ```

### DOM 元素（节点）

#### 创建新 HTML 元素（节点）

```js
var para = document.createElement("p");
var node = document.createTextNode("这是一个新段落。");
para.appendChild(node);
```

#### 创建新 HTML 元素 - insertBefore()

```js
<div id="div1">
<p id="p1">这是一个段落。</p>
<p id="p2">这是另一个段落。</p>
</div>

<script>
var para = document.createElement("p");
var node = document.createTextNode("这是新文本。");
para.appendChild(node);

var element = document.getElementById("div1");
var child = document.getElementById("p1");
element.insertBefore(para, child);
</script>
```

#### 删除已有 HTML 元素

```js
var child = document.getElementById(id);
child.class="marked">parentNode.removeChild(child);
```

#### 替换 HTML 元素

```js
parent.replaceChild(para, child);
```
