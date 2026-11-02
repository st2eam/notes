---
title: 主动队列管理 AQM
primaryCategory: 计算机/基础/网络/TCP控制
categories:
  - path: 计算机/基础/网络/TCP控制
    reason: 围绕主动队列管理 AQM解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# 主动队列管理 AQM

## 定义

AQM 在缓存完全耗尽之前，根据拥塞征兆主动丢弃或标记部分分组，给端点提供提前反馈。

## 工作原理

RED 是一种历史性例子：根据平均队列长度及门限，以一定概率丢弃，避免只在满队列时成批丢失。AQM 是一类方法，不能将 RED 当作唯一实现或所有设备的默认配置。
