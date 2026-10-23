---
title: MIME
primaryCategory: 计算机/基础/网络/应用协议
categories:
  - path: 计算机/基础/网络/应用协议
    reason: 围绕MIME解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# MIME

## 定义

MIME 为邮件增加内容类型、字符集、多部分结构和传输编码等描述，使邮件能携带多媒体内容。

## 工作原理

它扩展邮件内容表示，不替代 [[计算机/基础/网络/应用协议/SMTP|SMTP]] 投递。Base64 等把二进制转换为便于传输的字符形式，但不是加密，也会增加体积。

## 示例

一封邮件可分为文字与图片两个部分，每部分声明自己的类型与编码方式。
