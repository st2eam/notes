---
title: IPsec
aliases:
  - IP层安全协议
primaryCategory: 计算机/基础/网络/安全与密码
categories:
  - path: 计算机/基础/网络/安全与密码
    reason: 围绕IPsec解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# IPsec

## 定义

IPsec 是在 [[计算机/基础/网络/IP协议|IP]] 层保护分组的协议体系，安全关联 SA 描述单方向通信使用的算法、密钥和其他安全参数。

## 工作原理

AH 提供相应的完整性、来源鉴别和抗重放能力，不提供加密；ESP 可提供机密性及相关完整性保护。双向保护通常需要两个方向的 SA，并通过密钥管理机制建立参数。

## 示例

分支与总部网关建立双向安全参数后，保护内部主机之间的 IP 通信，而无需每个应用自行实现同样的加密流程。

## 相关概念

[[计算机/基础/网络/VPN|VPN]]、[[计算机/基础/网络/IP协议|IP协议]]。
