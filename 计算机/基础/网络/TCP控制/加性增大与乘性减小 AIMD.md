---
title: 加性增大与乘性减小 AIMD
primaryCategory: 计算机/基础/网络/TCP控制
categories:
  - path: 计算机/基础/网络/TCP控制
    reason: 围绕加性增大与乘性减小 AIMD解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# 加性增大与乘性减小 AIMD

## 定义

AIMD 用线性方式增加发送窗口，在出现拥塞反馈时按比例减小。

## 工作原理

缓慢探测、明显退让，在多个遵循类似规则的流之间形成反馈调节。公平性还受 RTT、算法、连接数量等影响，不能承诺所有应用天然获得完全相同速率。

## 示例

窗口逐步从 10 增到 20 [[计算机/基础/网络/运输与可靠性/MSS 与 TCP 分段|MSS]]，丢包后降到约 10 MSS，再重新增长。
