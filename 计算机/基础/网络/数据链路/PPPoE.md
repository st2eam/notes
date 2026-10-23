---
title: PPPoE
primaryCategory: 计算机/基础/网络/数据链路
categories:
  - path: 计算机/基础/网络/数据链路
    reason: 围绕PPPoE解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# PPPoE

## 定义

PPPoE 将 PPP 帧封装到以太网中，支持以太网接入环境下的 PPP 会话。

## 工作原理

发现过程寻找接入服务器并建立会话，会话阶段继续使用 PPP 的协商和鉴别能力。额外封装会消耗承载空间。

## 示例

家庭路由器使用账号建立 PPPoE 会话；在未扩大底层帧承载能力的常见配置中，[[计算机/基础/网络/IP协议|IP]] MTU 会由 1500 降到 1492 字节。
