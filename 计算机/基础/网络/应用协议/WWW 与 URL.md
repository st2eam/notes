---
title: WWW 与 URL
primaryCategory: 计算机/基础/网络/应用协议
categories:
  - path: 计算机/基础/网络/应用协议
    reason: 围绕WWW 与 URL解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# WWW 与 URL

## 定义

万维网以链接组织可访问资源；URL 描述资源的访问方案、主机、可选端口和路径等位置相关信息。

## 工作原理

WWW 是互联网应用之一，不等于整个互联网。域名解析取得主机地址后，还需依访问方案建立通信，并由路径标识具体资源。

## 示例

`https://www.example.com:443/docs?lang=zh#intro` 包含方案、主机、端口、路径、查询与片段；片段一般由客户端用于资源内部定位，不随普通 [[计算机/基础/网络/HTTP|HTTP]] 请求目标发送。
