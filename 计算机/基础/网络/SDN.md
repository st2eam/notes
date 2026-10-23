---
title: SDN
aliases:
  - 软件定义网络
primaryCategory: 计算机/基础/网络/路由与互连
categories:
  - path: 计算机/基础/网络/路由与互连
    reason: 围绕SDN解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# SDN

## 定义

SDN 将数据转发与控制逻辑分离，用可编程控制层统一表达网络策略。

## 工作原理

逻辑集中不意味着只能部署一台控制器。

控制器通过南向接口管理转发设备，并向应用提供北向接口；数据层可按流表匹配多个字段并执行转发、丢弃或改写等动作。OpenFlow 是相关接口协议之一，不等于 SDN 全部。

## 相关概念

[[计算机/基础/网络/路由选择|路由选择]]。
