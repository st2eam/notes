---
title: PING 与 Traceroute
primaryCategory: 计算机/基础/网络/IP与寻址
categories:
  - path: 计算机/基础/网络/IP与寻址
    reason: 围绕PING 与 Traceroute解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# PING 与 Traceroute

## 定义

PING 检查回送可达性与往返时间；Traceroute 利用递增的跳数限制发现中间节点。

## 工作原理

路径探测依赖 [[计算机/基础/网络/IP与寻址/ICMP|ICMP]] 等响应，不同实现可使用不同探测报文。节点过滤、限速和非对称路径会影响结果；某一跳不响应不代表后续一定不通。

## 示例

路径中间显示一次超时，但最后目标正常响应，应先考虑该节点不回答探测。
