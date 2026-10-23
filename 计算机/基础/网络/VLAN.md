---
title: VLAN
aliases:
  - 虚拟局域网
primaryCategory: 计算机/基础/网络/数据链路
categories:
  - path: 计算机/基础/网络/数据链路
    reason: 围绕VLAN解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# VLAN

## 定义

VLAN 在物理交换网络上按逻辑划分独立的广播域。

## 工作原理

接入口归属相应 VLAN，承载多个 VLAN 的链路可通过 IEEE 802.1Q 标记区分。标记包含 VLAN 标识等信息；不同 VLAN 之间通常需要三层转发，VLAN 本身不提供加密。

## 应用：隔离部门网络

财务和访客电脑接在同一台交换机上，但划入不同 VLAN 后，彼此的广播不直接互通。

## 相关概念

[[计算机/基础/网络/以太网帧|以太网帧]]。
