---
title: RTSP
primaryCategory: 计算机/基础/网络/音视频与QoS
categories:
  - path: 计算机/基础/网络/音视频与QoS
    reason: 围绕RTSP解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# RTSP

## 定义

实时流式协议 RTSP 用来控制媒体会话，如建立、播放、暂停与结束。

## 工作原理

它承担播放控制，不直接等同于媒体数据运输。控制通道与媒体通道可以分离，暂停命令也不意味着改变所有媒体数据报的格式。

## 示例

播放器发送 PAUSE 请求，媒体服务调整发送状态，之后再以 PLAY 继续。
