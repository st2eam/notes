---
title: P2P 文件分发能力
primaryCategory: 计算机/基础/网络/应用协议
categories:
  - path: 计算机/基础/网络/应用协议
    reason: 围绕P2P 文件分发能力解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# P2P 文件分发能力

## 定义

P2P 文件分发把下载者的上传能力纳入总体分发资源。

## 工作原理

设文件大小为 $F$、接收者数为 $N$、源上传能力为 $u_s$、最慢下载能力为 $d_{min}$，客户—服务器分发时间下界为 $\max(NF/u_s,F/d_{min})$；理想 P2P 下界为 $\max(F/u_s,F/d_{min},NF/(u_s+\sum u_i))$。

下界不等于现实完成时间，还受调度和连接等约束。
