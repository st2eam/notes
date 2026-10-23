---
title: 时分复用 TDM
primaryCategory: 计算机/基础/网络/信号与接入
categories:
  - path: 计算机/基础/网络/信号与接入
    reason: 围绕时分复用 TDM解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# 时分复用 TDM

## 定义

时分复用让不同用户按周期轮流占用固定时隙。

## 工作原理

用户共享整段频带，但在时间上分离，需要同步。固定时隙便于预测服务，空闲用户仍占有自己的时隙。

## 示例

每轮依次给甲、乙、丙发送机会，即使乙暂时无数据，乙的固定时隙也可能空过。
