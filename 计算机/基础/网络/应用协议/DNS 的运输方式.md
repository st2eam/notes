---
title: DNS 的运输方式
primaryCategory: 计算机/基础/网络/应用协议
categories:
  - path: 计算机/基础/网络/应用协议
    reason: 围绕DNS 的运输方式解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# DNS 的运输方式

## 定义

[[计算机/基础/网络/域名系统DNS|DNS]] 查询与响应可以通过 [[计算机/基础/网络/UDP|UDP]] 或 [[计算机/基础/网络/TCP|TCP]] 运输，常用服务端口为 53。

## 工作原理

普通小型查询常用 UDP；当响应截断或进行相应区域传送等操作时会使用 TCP。不能把 DNS 记成“只使用 UDP”，也不能把 UDP 的报文长度与所有 DNS 扩展能力混为一谈。

## 示例

允许 UDP 53 而封锁 TCP 53，可能让一部分名称查询成功、另一部分失败。
