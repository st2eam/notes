---
title: HTTP 请求与响应
primaryCategory: 计算机/基础/网络/应用协议
categories:
  - path: 计算机/基础/网络/应用协议
    reason: 围绕HTTP 请求与响应解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# HTTP 请求与响应

## 定义

[[计算机/基础/网络/HTTP|HTTP]] 定义客户请求资源以及服务器返回状态与内容的应用层语义。

## 工作原理

以 HTTP/1.1 为例，请求含请求行、首部及可选实体，响应含状态行、首部及可选实体；空行分隔首部与消息体。GET、HEAD、POST 等方法说明请求目的，状态码说明结果类别。

## 示例

服务器返回 `200` 表示相应请求成功，`404` 表示未找到目标资源，`304` 可表示缓存内容无需重新传输。
