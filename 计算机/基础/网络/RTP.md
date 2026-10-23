---
title: RTP
aliases:
  - 实时运输协议
primaryCategory: 计算机/基础/网络/音视频与QoS
categories:
  - path: 计算机/基础/网络/音视频与QoS
    reason: 围绕RTP解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# RTP

## 定义

实时运输协议 RTP 为媒体分组增加序号、时间戳和载荷类型等信息，通常运行在 [[计算机/基础/网络/UDP|UDP]] 之上。

## 工作原理

序号帮助识别丢失与乱序，时间戳表达采样时刻和播放关系，载荷类型说明相应编码解释。RTP 本身不预留带宽，也不保证按时或可靠到达。

## 相关概念

[[计算机/基础/网络/UDP|UDP]]、[[计算机/基础/网络/服务质量QoS|服务质量QoS]]。
