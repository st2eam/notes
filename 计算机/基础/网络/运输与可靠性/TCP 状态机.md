---
title: TCP 状态机
primaryCategory: 计算机/基础/网络/运输与可靠性
categories:
  - path: 计算机/基础/网络/运输与可靠性
    reason: 围绕TCP 状态机解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# TCP 状态机

## 定义

[[计算机/基础/网络/TCP|TCP]] 用状态与事件的组合约束连接管理，如 LISTEN、SYN-SENT、ESTABLISHED、FIN-WAIT、CLOSE-WAIT 等。

## 工作原理

相同控制位在不同状态下可能触发不同处理；状态机帮助处理超时、同时关闭和异常复位。CLOSE-WAIT 表示已收到对方 FIN，但本地应用尚未完成自身关闭。

## 示例

服务器持续积累 CLOSE-WAIT，应检查应用为何没有结束本地连接，而不能直接归因于对方未发送 FIN。
