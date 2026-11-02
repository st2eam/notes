---
title: BitTorrent 式分块交换
primaryCategory: 计算机/基础/网络/应用协议
categories:
  - path: 计算机/基础/网络/应用协议
    reason: 围绕BitTorrent 式分块交换解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# BitTorrent 式分块交换

## 定义

把文件切成块，从多个对等方并行获取，并向其他参与者提供已有块。

## 工作原理

参与者需要发现同伴、选择块并安排上传；稀缺块优先有助于保持资源多样性，交换策略可鼓励贡献。完整拥有文件的参与者可继续作为种子上传。

## 示例

甲先取得稀缺的第七块，再把它分享给其他人，而不是所有人都只争抢相同的热门块。
