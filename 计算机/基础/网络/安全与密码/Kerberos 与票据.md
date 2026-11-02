---
title: Kerberos 与票据
primaryCategory: 计算机/基础/网络/安全与密码
categories:
  - path: 计算机/基础/网络/安全与密码
    reason: 围绕Kerberos 与票据解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# Kerberos 与票据

## 定义

Kerberos 利用可信中心、票据和会话密钥，为客户访问服务提供鉴别。

## 工作原理

客户取得票据授予票据，再申请某服务的票据，并配合鉴别信息证明自己。服务票据由目标服务可解开的秘密保护，时间戳与有效期帮助限制重放，因此需要适当时钟同步。
