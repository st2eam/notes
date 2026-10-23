---
title: LTE 的 EPC 结构
primaryCategory: 计算机/基础/网络/无线与移动
categories:
  - path: 计算机/基础/网络/无线与移动
    reason: 围绕LTE 的 EPC 结构解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# LTE 的 EPC 结构

## 定义

LTE 用 E-UTRAN 无线接入网和 EPC 分组核心网连接用户设备 UE 与外部 [[计算机/基础/网络/IP协议|IP]] 网络。

## 工作原理

eNB 负责无线接入，S-GW 转发用户数据并支持移动性，P-GW 连接外部数据网络并承担地址等相关管理，MME 处理移动性与控制信令，HSS 保存用户相关信息。

控制信令与用户数据不走完全相同的处理路径。

## 示例

普通用户数据经 UE、eNB、S-GW、P-GW 到外部网络，而 MME 参与控制，不是每个业务数据报都必须经过的转发点。
