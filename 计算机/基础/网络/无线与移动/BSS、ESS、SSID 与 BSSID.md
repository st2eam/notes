---
title: BSS、ESS、SSID 与 BSSID
primaryCategory: 计算机/基础/网络/无线与移动
categories:
  - path: 计算机/基础/网络/无线与移动
    reason: 围绕BSS、ESS、SSID 与 BSSID解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# BSS、ESS、SSID 与 BSSID

## 定义

BSS 是基本服务集，ESS 由通过分布系统连接的多个基本服务集构成；SSID 是服务集名称，BSSID 标识具体基本服务集。

## 工作原理

同一 ESS 中多个 AP 可使用相同 SSID，但各自 BSSID 不同。看到相同网络名称，不代表连接的射频端点相同，也不能单凭名称证明网络身份。

## 示例

用户从会议室走到走廊时仍看到同一 SSID，连接却可能从 AP 甲的 BSSID 切换到 AP 乙。
