---
title: SIFS 与 DIFS
primaryCategory: 计算机/基础/网络/无线与移动
categories:
  - path: 计算机/基础/网络/无线与移动
    reason: 围绕SIFS 与 DIFS解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# SIFS 与 DIFS

## 定义

帧间间隔规定不同发送动作前应等待多久，SIFS 较短，DIFS 较长。

## 工作原理

ACK、CTS 等对当前交换直接相关的响应，通常可在 SIFS 后先发送，普通竞争者需等待更长间隔。通过等待差异保障一次交换连续进行。

## 示例

接收方在数据帧后用 SIFS 返回 ACK，其他站点尚未完成 DIFS，因而不能抢先发普通数据。
