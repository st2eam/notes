---
title: ICMP
primaryCategory: 计算机/基础/网络/IP与寻址
categories:
  - path: 计算机/基础/网络/IP与寻址
    reason: 围绕ICMP解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# ICMP

## 定义

ICMP 用于报告 [[计算机/基础/网络/IP协议|IP]] 处理中的差错与状态，也提供查询功能，报文封装在 IP 数据报中。

## 工作原理

目的不可达、时间超过、回送请求与回答分别服务不同用途。ICMP 帮助诊断，不负责重传原数据，也不能保证所有错误都会得到报告；对部分报文不再生成差错，避免反馈风暴。

## 示例

PING 使用回送请求与回答；收到目的不可达可缩小故障范围，但没有回答不一定证明目标宕机。
