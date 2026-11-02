---
title: 往返时间 RTT
primaryCategory: 计算机/基础/网络/体系与性能
categories:
  - path: 计算机/基础/网络/体系与性能
    reason: 围绕往返时间 RTT解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# 往返时间 RTT

## 定义

RTT 是从发出数据或探测报文，到收到相应返回信息所经历的时间。

## 工作原理

RTT 可包含双向传播、排队、处理及相应发送时间，不一定等于两倍单程[[计算机/基础/网络/体系与性能/传播时延|传播时延]]；路径不对称也会影响它。

## 示例

协议需要连续三次往返，而 RTT 为 80 ms，仅往返等待就约为 240 ms。
