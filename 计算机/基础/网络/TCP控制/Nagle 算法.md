---
title: Nagle 算法
primaryCategory: 计算机/基础/网络/TCP控制
categories:
  - path: 计算机/基础/网络/TCP控制
    reason: 围绕Nagle 算法解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# Nagle 算法

## 定义

Nagle 算法通过合并小块写入，减少网络中的微小 [[计算机/基础/网络/TCP|TCP]] 报文段。

## 工作原理

典型规则允许先发一小段，在仍有未确认数据时暂存后续小数据，直到收到确认或积累到足够大小。它提高效率，但可能增加交互等待，需要结合应用目标选择。

## 示例

应用每次只写一个字符，合并多个字符可降低首部占比；要求极低发送延迟的应用则要评估其代价。
