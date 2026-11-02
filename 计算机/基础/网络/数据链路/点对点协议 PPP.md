---
title: 点对点协议 PPP
primaryCategory: 计算机/基础/网络/数据链路
categories:
  - path: 计算机/基础/网络/数据链路
    reason: 围绕点对点协议 PPP解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# 点对点协议 PPP

## 定义

PPP 是点对点链路上承载网络层分组的协议。

## 工作原理

PPP 用成帧规则和 FCS 完成封装与检错，以 LCP 建立、配置和检测链路，以 NCP 配置相应网络层协议。PPP 本身通常不提供序号确认、重传和流量控制；可按链路形式采用字节或比特填充。

## 示例

建立链路后配置 [[计算机/基础/网络/IP协议|IP]] 参数，再开始传送 IP 数据报；检错失败不意味着 PPP 自动可靠重传。
