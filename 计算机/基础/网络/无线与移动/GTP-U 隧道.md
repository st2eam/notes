---
title: GTP-U 隧道
primaryCategory: 计算机/基础/网络/无线与移动
categories:
  - path: 计算机/基础/网络/无线与移动
    reason: 围绕GTP-U 隧道解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# GTP-U 隧道

## 定义

GTP-U 在蜂窝承载网络中封装用户 [[计算机/基础/网络/IP协议|IP]] 分组，以隧道端点标识 TEID 区分相应承载上下文。

## 工作原理

内层保留用户与外部服务器的地址，外层使用 eNB、S-GW、P-GW 等隧道端点地址。接入位置变化时可更新隧道映射，不要求外部互联网随每次小区切换重新学习用户的物理位置。

## 示例

UE 保持业务 IP 关系，核心网改将下行分组送入通向新 eNB 的隧道。
