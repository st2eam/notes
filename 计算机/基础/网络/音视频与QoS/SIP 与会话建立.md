---
title: SIP 与会话建立
primaryCategory: 计算机/基础/网络/音视频与QoS
categories:
  - path: 计算机/基础/网络/音视频与QoS
    reason: 围绕SIP 与会话建立解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# SIP 与会话建立

## 定义

会话发起协议 SIP 用于寻找通信对方并建立、修改和结束会话。

## 工作原理

用户代理与代理、重定向等服务器处理信令，媒体可走另一条路径。会话建立成功不表示媒体路径必然畅通，SIP 也不自行保证 [[计算机/基础/网络/服务质量QoS|QoS]]。

## 示例

先通过 SIP 找到被叫并协商会话，再利用 [[计算机/基础/网络/RTP|RTP]] 等传送双方声音。
