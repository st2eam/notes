---
title: TLS
aliases:
  - 运输层安全协议
  - Transport Layer Security
primaryCategory: 计算机/基础/网络/安全与密码
categories:
  - path: 计算机/基础/网络/安全与密码
    reason: 围绕TLS解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# TLS

## 定义

TLS 在应用与可靠运输之间建立安全信道，握手负责身份鉴别、算法协商及密钥建立，记录协议保护后续数据。

## 工作原理

TLS 将安全连接分成两类工作：

- 握手：验证对端身份，协商算法并建立会话密钥。
- 记录保护：用派生的密钥保护后续数据的机密性与完整性。

服务器通常通过证书和相应的握手证明完成身份验证，业务数据再使用对称密钥保护。

不同 TLS 版本的密钥建立方式与记录格式存在差异。TLS 1.3 已移除静态 RSA 密钥传送，并使用 AEAD 保护记录，因此不能套用“客户用服务器 RSA 公钥加密主密钥”的旧式示意。

协议依据：[RFC 8446](https://www.rfc-editor.org/rfc/rfc8446.html)。

## 相关概念

[[计算机/基础/网络/数字证书|数字证书]]、[[计算机/基础/网络/TCP|TCP]]。

应用关系见[[计算机/基础/网络/HTTP|HTTP]]和[[计算机/基础/网络/认证与授权|认证与授权]]。
