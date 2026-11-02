---
title: SMI 与 MIB
primaryCategory: 计算机/基础/网络/应用协议
categories:
  - path: 计算机/基础/网络/应用协议
    reason: 围绕SMI 与 MIB解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# SMI 与 MIB

## 定义

SMI 规定管理对象的命名、类型与编码规则；MIB 是被管对象的组织与定义集合。

## 工作原理

对象用层次化 OID 标识，不同对象代表接口状态、计数器等可管理信息。统一结构使管理软件能够解释代理提供的值，而非只得到一串无语义数字。

## 示例

管理者先知道某 OID 对应哪个接口的输入字节计数，再比较两次读数计算流量。
