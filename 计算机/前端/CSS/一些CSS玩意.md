---
originalPath: Web/CSS/一些CSS玩意.md
primaryCategory: 计算机/前端/CSS
categories:
  - path: 计算机/前端/CSS
    reason: 核心学习对象为“一些CSS玩意”，正文依据：“代码 隐藏就用transparent”；据其实体与学习对象归入计算机/前端/CSS。
classificationStatus: confirmed
relations: []
tags:
  - 实体/CSS
---
## 画一个三角形

<div style="
    width: 0;
    height: 0;
    border-top: 50px solid #00e0ff;
    border-left: 50px solid #a6fff2;
    border-right: 50px solid #74f9ff;
    border-bottom: 50px solid #e8ffe8;">
</div>

代码

```html
<div style="    
    width: 0;
    height: 0;
    border-top: 50px solid #00e0ff;
    border-left: 50px solid #a6fff2;
    border-right: 50px solid #74f9ff;
    border-bottom: 50px solid #e8ffe8;">
</div>
```

隐藏就用<code>transparent</code>

## 丝滑跳转

```css
html{
  scroll-behavior: smooth;
}
```
