---
title: 带通调制与 QAM
primaryCategory: 计算机/基础/网络/信号与接入
categories:
  - path: 计算机/基础/网络/信号与接入
    reason: 围绕带通调制与 QAM解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# 带通调制与 QAM

## 定义

带通调制通过改变载波的振幅、频率或相位来表达数据；QAM 同时利用振幅和相位形成多个符号状态。

## 工作原理

ASK、FSK、PSK 分别侧重振幅、频率和相位。高阶 QAM 每码元承载更多比特，但相邻状态距离更小，需要更好的信噪比。

## 示例

16QAM 理想每码元承载 4 bit，64QAM 承载 6 bit；信道变差时提高阶数可能反而增加误码。
