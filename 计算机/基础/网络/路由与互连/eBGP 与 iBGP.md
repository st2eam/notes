---
title: eBGP 与 iBGP
primaryCategory: 计算机/基础/网络/路由与互连
categories:
  - path: 计算机/基础/网络/路由与互连
    reason: 围绕eBGP 与 iBGP解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# eBGP 与 iBGP

## 定义

eBGP 在不同 AS 的 [[计算机/基础/网络/BGP|BGP]] 对等体间交换路由；iBGP 在同一 AS 内传播 BGP 信息。

## 工作原理

iBGP 不等于 [[计算机/基础/网络/OSPF|OSPF]] 等内部路由协议：前者传播 BGP 前缀及属性，后者常负责让边界路由器和 BGP 下一跳在本 AS 内可达。两者需要协作。

## 示例

东侧边界通过 eBGP 学到外部前缀，再用 iBGP 告诉西侧边界，由内部路由保证能够走到相应出口。
