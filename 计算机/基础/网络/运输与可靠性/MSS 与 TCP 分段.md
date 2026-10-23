---
title: MSS 与 TCP 分段
primaryCategory: 计算机/基础/网络/运输与可靠性
categories:
  - path: 计算机/基础/网络/运输与可靠性
    reason: 围绕MSS 与 TCP 分段解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# MSS 与 TCP 分段

## 定义

MSS 是一个 [[计算机/基础/网络/TCP|TCP]] 报文段中可承载的最大 TCP 数据长度，不包含 [[计算机/基础/网络/IP协议|IP]] 与 TCP 首部。

## 工作原理

连接时可通告 MSS，实际分段还受路径 MTU、选项和发送策略影响。TCP 分段由端点组织字节流，IPv4 分片处理整个 IP 数据报，二者层次和重组位置不同。

## 示例：计算 TCP 数据长度

MTU 为 1500、[[计算机/基础/网络/IP与寻址/IPv4 首部|IPv4 首部]] 20 字节、TCP 首部 20 字节且无其他开销时，可留 1460 字节 TCP 数据。
