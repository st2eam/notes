---
title: TFTP
primaryCategory: 计算机/基础/网络/应用协议
categories:
  - path: 计算机/基础/网络/应用协议
    reason: 围绕TFTP解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# TFTP

## 定义

TFTP 是基于 [[计算机/基础/网络/UDP|UDP]] 的简单文件传送协议，按块发送并确认数据。

## 工作原理

功能较少，不提供 FTP 那样完整的会话能力，通过应用层的编号、确认与超时实现相应重传。常见初始服务端口为 UDP 69，后续传输使用选定的传输端点。

## 应用：设备启动与配置

设备从启动服务器取得小型配置文件，使用简单请求和数据块确认流程。
