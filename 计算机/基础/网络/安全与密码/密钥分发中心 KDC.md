---
title: 密钥分发中心 KDC
primaryCategory: 计算机/基础/网络/安全与密码
categories:
  - path: 计算机/基础/网络/安全与密码
    reason: 围绕密钥分发中心 KDC解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# 密钥分发中心 KDC

## 定义

KDC 是受信任的中心，为通信双方分配或协助建立会话密钥。

## 工作原理

各实体分别与 KDC 保持长期共享秘密，减少两两预先分发密钥的负担；会话密钥通常限制用途和有效期。中心的安全性与可用性成为整个体系的重要依赖。
