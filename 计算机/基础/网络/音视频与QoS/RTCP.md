---
title: RTCP
primaryCategory: 计算机/基础/网络/音视频与QoS
categories:
  - path: 计算机/基础/网络/音视频与QoS
    reason: 围绕RTCP解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# RTCP

## 定义

实时运输控制协议 RTCP 与 [[计算机/基础/网络/RTP|RTP]] 配合，传送质量报告、参与者标识及同步所需控制信息。

## 工作原理

接收报告反映丢失和抖动等情况，发送报告可关联 RTP 时间与参考时间。它帮助应用调整和同步，但报告本身不强制网络提供[[计算机/基础/网络/服务质量QoS|服务质量]]。

## 示例

接收方报告丢包增加，发送应用据此考虑降低编码速率。
