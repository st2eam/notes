# 格式化上下文简介

格式化上下文的概念，其中有几种类型，包括

- 块格式化上下文 block formatting contexts
- 内联格式化上下文  inline formatting contexts
- 灵活格式化上下文 flex formatting  contexts

页面上的所有内容都是**格式化上下文 formatting context** 的一部分，或者是一个以特定方式显示的区域。**块格式上下文（BFC）**将根据块布局规则布局子元素，**灵活格式上下文 flex formatting context** 将其子元素布局为灵活项[flex items](https://developer.mozilla.org/zh-CN/docs/Glossary/Flex_Item)等。每个格式上下文在其上下文中都有特定的布局规则。

## Block formatting contexts 块格式化上下文

文档最外层元素使用块布局规则或称为**初始块格式上下文**。这意味着`<html>`元素块中的每个元素都是按照正常流程遵循块和内联布局规则进行布局的。参与 BFC 的元素使用 CSS 框模型概述的规则，该模型定义了元素的边距、边框和填充如何与同一上下文中的其他块交互。

**BFC是一个独立的布局环境，BFC内部的元素布局与外部互不影响**

### 如何触发BFC？

| 元素或属性 | 属性值                         |
| ---------- | ------------------------------ |
| 根元素     | /                              |
| 块元素     | overflow属性不为visible        |
| float      | left、right                    |
| position   | absolute、fixed、sticky        |
| overflow   | auto、scroll、hidden           |
| display    | inline-block、table-cell、flex |

### 参考文档

https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context
