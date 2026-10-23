---
title: RTS/CTS 与虚拟载波监听
primaryCategory: 计算机/基础/网络/无线与移动
categories:
  - path: 计算机/基础/网络/无线与移动
    reason: 围绕RTS/CTS 与虚拟载波监听解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# RTS/CTS 与虚拟载波监听

## 定义

RTS 请求发送，CTS 允许发送；虚拟载波监听通过帧中的持续时间信息，维护网络分配向量 NAV 来判断预约占用。

## 工作原理

听到相关控制帧的站点暂缓发送，即使它听不到后续数据发送方。RTS/CTS 可减轻[[计算机/基础/网络/无线与移动/隐蔽站问题|隐蔽站问题]]，但增加控制开销，常为可选机制，不能彻底消除所有冲突。

## 示例

丙听不到甲的 RTS，却听到 AP 返回给甲的 CTS，因此在预约期间保持静默。
