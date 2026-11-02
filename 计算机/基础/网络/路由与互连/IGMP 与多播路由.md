---
title: IGMP 与多播路由
primaryCategory: 计算机/基础/网络/路由与互连
categories:
  - path: 计算机/基础/网络/路由与互连
    reason: 围绕IGMP 与多播路由解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# IGMP 与多播路由

## 定义

IGMP 管理 IPv4 主机与本地多播路由器之间的组成员关系；多播路由决定数据怎样跨网络到达这些组成员。

## 工作原理

IGMP 使路由器知道某接口方向是否还有组成员，并不提供全网分发路径。多播路由可利用生成树、反向路径转发、剪枝等抑制重复与无关分支。

## 示例

一个局域网最后一名观看者离开后，相应分支可停止接收该多播流。
