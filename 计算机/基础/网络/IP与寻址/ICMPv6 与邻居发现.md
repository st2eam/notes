---
title: ICMPv6 与邻居发现
primaryCategory: 计算机/基础/网络/IP与寻址
categories:
  - path: 计算机/基础/网络/IP与寻址
    reason: 围绕ICMPv6 与邻居发现解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# ICMPv6 与邻居发现

## 定义

ICMPv6 承担 [[计算机/基础/网络/IPv6|IPv6]] 差错报告、查询及邻居发现等重要控制功能。

## 工作原理

邻居发现使用请求和通告等报文进行链路地址解析、路由器发现及相关检查，取代 IPv4 中部分由 [[计算机/基础/网络/ARP|ARP]] 等机制承担的功能。不能把所有 ICMPv6 都视为可有可无的 PING 报文。
