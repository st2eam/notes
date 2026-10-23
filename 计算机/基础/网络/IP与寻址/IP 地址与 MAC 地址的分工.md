---
title: IP 地址与 MAC 地址的分工
primaryCategory: 计算机/基础/网络/IP与寻址
categories:
  - path: 计算机/基础/网络/IP与寻址
    reason: 围绕IP 地址与 MAC 地址的分工解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# IP 地址与 MAC 地址的分工

## 定义

[[计算机/基础/网络/IP协议|IP]] 地址支持跨网络的逻辑寻址，MAC 地址支持当前链路上的帧投递。

## 工作原理

普通路由转发中，源、目的 IP 地址一般保持，而每跨一段链路，链路首部重新构造；[[计算机/基础/网络/IP与寻址/TTL|TTL]] 和校验等字段也会变化。[[计算机/基础/网络/NAT|NAT]] 等机制可能改写 IP 地址，因此“永不变化”并不成立。

## 示例

主机发出的[[计算机/基础/网络/以太网帧|以太网帧]]目的 MAC 是默认网关的 MAC，IP 数据报目的地址仍是服务器。
