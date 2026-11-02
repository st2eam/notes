---
title: 多播 MAC 映射
primaryCategory: 计算机/基础/网络/路由与互连
categories:
  - path: 计算机/基础/网络/路由与互连
    reason: 围绕多播 MAC 映射解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# 多播 MAC 映射

## 定义

IPv4 多播地址可映射到以太网多播 MAC 地址，以便在本地链路投递。

## 工作原理

以太网映射只使用 IPv4 组地址的一部分比特，多个 [[计算机/基础/网络/路由与互连/IP 多播|IP 多播]]组可能对应同一个 MAC 地址。网卡接受帧后，[[计算机/基础/网络/IP协议|IP]] 层仍须核对组地址，不能把 MAC 匹配视为组完全相同。

## 示例

主机可能在链路层接收与自己不同 IP 组但 MAC 相同的帧，随后由 IP 层过滤。
