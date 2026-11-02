---
title: 统计时分复用 STDM
primaryCategory: 计算机/基础/网络/信号与接入
categories:
  - path: 计算机/基础/网络/信号与接入
    reason: 围绕统计时分复用 STDM解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# 统计时分复用 STDM

## 定义

统计时分复用按实际发送需求动态分配时隙。

## 工作原理

活跃用户共享输出资源，适合突发数据；需要缓冲与标识信息，瞬时总输入超过输出能力时会排队甚至丢失。

## 示例

十台终端并非始终同时发送，集中器可将当前有数据的终端排入输出时隙。
