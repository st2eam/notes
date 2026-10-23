---
title: 重传计时器与 RTO
primaryCategory: 计算机/基础/网络/运输与可靠性
categories:
  - path: 计算机/基础/网络/运输与可靠性
    reason: 围绕重传计时器与 RTO解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# 重传计时器与 RTO

## 定义

RTO 是等待确认后触发重传的超时阈值，根据 RTT 估计及其变化调整。

## 工作原理

过短会产生无谓重传，过长会延迟丢失恢复。常用平滑 RTT 与偏差估计共同决定 RTO；重传会让确认对应哪次发送难以判断，因此 Karn 方法通常不采用存在重传歧义的 RTT 样本，超时后还会退避。
