---
title: DHT 与 Chord
primaryCategory: 计算机/基础/网络/应用协议
categories:
  - path: 计算机/基础/网络/应用协议
    reason: 围绕DHT 与 Chord解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# DHT 与 Chord

## 定义

分布式散列表把资源键映射到负责保存相应索引的节点；Chord 用环形标识空间组织节点与键。

## 工作原理

键通常交给顺时针方向遇到的首个不小于其标识的节点负责，指针表加速查询。保存资源位置索引不代表保存资源文件本身；节点加入或退出时需要迁移索引并维护路由信息。

## 键的映射示例

环上节点为 4、10、20，键 8 由节点 10 负责索引，键 25 环绕后由节点 4 负责。
