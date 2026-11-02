---
title: BGP
aliases:
  - 边界网关协议
primaryCategory: 计算机/基础/网络/路由与互连
categories:
  - path: 计算机/基础/网络/路由与互连
    reason: 围绕BGP解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# BGP

## 定义

BGP 是自治系统之间交换网络前缀可达信息和路径属性的路由协议。

## 工作原理

通过 [[计算机/基础/网络/TCP|TCP]] 连接交换通告与撤销，结合 AS_PATH、NEXT_HOP 等属性和本地策略选择路径。

AS_PATH 有助于识别包含自身 AS 的路径，避免相应环路。BGP 追求符合策略的可用路由，不保证物理距离或时延最短。

## 示例

同样可达某前缀，网络可优先采用客户链路而不是付费上游，即使后者路径较短。

## 相关概念

[[计算机/基础/网络/路由选择|路由选择]]。
