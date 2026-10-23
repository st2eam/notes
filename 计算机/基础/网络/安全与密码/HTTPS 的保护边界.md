---
title: HTTPS 的保护边界
primaryCategory: 计算机/基础/网络/安全与密码
categories:
  - path: 计算机/基础/网络/安全与密码
    reason: 围绕HTTPS 的保护边界解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# HTTPS 的保护边界

## 定义

HTTPS 是经安全信道保护的 [[计算机/基础/网络/HTTP|HTTP]] 通信。

## 工作原理

安全信道保护通信过程和对端身份验证，不替应用判断网页内容是否真实、交易是否合理，也不自动解决用户登录和业务授权。端点本身被控制后，传输加密不能保护其已解密数据。

## 示例

一个网站拥有对其域名有效的证书，并不意味着它发布的商品信息一定可靠。
