---
title: HTTP 无状态
primaryCategory: 计算机/基础/网络/应用协议
categories:
  - path: 计算机/基础/网络/应用协议
    reason: 围绕HTTP 无状态解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# HTTP 无状态

## 定义

[[计算机/基础/网络/HTTP|HTTP]] 的请求语义本身不要求服务器在不同请求之间记住用户会话。

## 工作原理

无状态不等于每次都新建 [[计算机/基础/网络/TCP|TCP]] 连接，也不等于应用无法保存状态。会话可以借助 [[计算机/基础/网络/HTTP Cookie|Cookie]]、服务端记录等机制实现。

## 示例

浏览器后续请求携带会话标识，服务器据此找到用户购物车，而不是靠“上一次 TCP 连接”直接识别用户。
