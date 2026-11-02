---
title: TTL
primaryCategory: 计算机/基础/网络/IP与寻址
categories:
  - path: 计算机/基础/网络/IP与寻址
    reason: 围绕TTL解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# TTL

## 定义

TTL 是 IPv4 数据报限制转发寿命的字段，在实际转发中用作跳数限制。

## 工作原理

路由器转发时递减 TTL，减至不可继续转发时丢弃，通常可返回 [[计算机/基础/网络/IP与寻址/ICMP|ICMP]] 超时报文，防止分组在路由环中无限循环。它不是供应用指定精确到达时间的时限。

## 示例

逐次把探测报文 TTL 设为 1、2、3，可以利用各跳的超时响应观察路径。
