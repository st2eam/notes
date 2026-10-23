---
title: SNMP 操作与通知
primaryCategory: 计算机/基础/网络/应用协议
categories:
  - path: 计算机/基础/网络/应用协议
    reason: 围绕SNMP 操作与通知解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# SNMP 操作与通知

## 定义

SNMP 定义管理者和代理之间读取、修改管理对象及发送通知的协议操作。

## 工作原理

Get、GetNext、Set、Response、Trap 等服务不同任务；常见请求／响应使用 [[计算机/基础/网络/UDP|UDP]] 161，通知使用 UDP 162。

不同版本的安全机制有差异，不能把早期简单共同体字符串等同于完整身份保护。
