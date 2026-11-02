---
title: TCP 首部与控制位
primaryCategory: 计算机/基础/网络/运输与可靠性
categories:
  - path: 计算机/基础/网络/运输与可靠性
    reason: 围绕TCP 首部与控制位解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# TCP 首部与控制位

## 定义

[[计算机/基础/网络/TCP|TCP]] 首部携带端口、序号、确认号、数据偏移、控制位、窗口、检验和及选项等信息。

## 工作原理

无选项时首部 20 字节；数据偏移表示首部长度，以 4 字节为单位。SYN 建立同步，ACK 表示确认字段有效，FIN 表示发送方向结束，RST 用于复位；PSH 不构成可供应用依赖的消息边界。

## 示例

一个报文段可同时带 FIN 和 ACK，既关闭自身发送方向，也确认对方已发送的数据。
