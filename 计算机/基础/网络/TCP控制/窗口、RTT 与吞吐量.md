---
title: 窗口、RTT 与吞吐量
primaryCategory: 计算机/基础/网络/TCP控制
categories:
  - path: 计算机/基础/网络/TCP控制
    reason: 围绕窗口、RTT 与吞吐量解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# 窗口、RTT 与吞吐量

## 定义

窗口限制的吞吐上限可近似表示为每 RTT 能推进的有效数据量。

## 工作原理

在持续传输且其他开销可忽略时，吞吐量受 $W/RTT$ 和瓶颈带宽共同限制。丢包、启动阶段与应用停顿会继续降低实际值。用往返带宽积估计窗口时，要统一 bit 和 byte 单位。

## 窗口限制示例

64 KB 窗口、100 ms RTT 的理想窗口上限为 640 KB/s，约 5.12 Mbit/s，远低于 100 Mbit/s 链路容量。
