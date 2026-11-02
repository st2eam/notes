---
title: 拥塞窗口 cwnd
primaryCategory: 计算机/基础/网络/TCP控制
categories:
  - path: 计算机/基础/网络/TCP控制
    reason: 围绕拥塞窗口 cwnd解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# 拥塞窗口 cwnd

## 定义

cwnd 是发送方根据拥塞反馈维护的发送限制，用于控制尚未被确认的数据量。

## 工作原理

通常以 $\min(rwnd,cwnd)$ 约束发送范围，实际可新发送的数据还要扣除在途未确认部分。窗口单位通常为字节；讲解算法时常用 [[计算机/基础/网络/运输与可靠性/MSS 与 TCP 分段|MSS]] 数量表示，必须声明单位。

## 示例：计算还可发送的数据

[[计算机/基础/网络/接收窗口|rwnd]] 为 32 KB、cwnd 为 12 KB、已有 8 KB 在途，则还可发送的数据约为 4 KB，而不是再发 12 KB。
