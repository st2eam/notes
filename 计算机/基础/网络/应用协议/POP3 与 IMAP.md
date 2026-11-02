---
title: POP3 与 IMAP
primaryCategory: 计算机/基础/网络/应用协议
categories:
  - path: 计算机/基础/网络/应用协议
    reason: 围绕POP3 与 IMAP解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# POP3 与 IMAP

## 定义

POP3 侧重把邮箱中的邮件取到客户；IMAP 允许客户管理和同步服务器上的邮件及文件夹状态。

## 工作原理

读取与投递是不同任务，不能用 POP3 或 IMAP 代替 [[计算机/基础/网络/应用协议/SMTP|SMTP]] 的服务器间发送功能。POP3 是否保留副本可由配置影响，不能直接理解为取信必然删除。

## 示例

手机读过的邮件需要在电脑上同步为已读，IMAP 的服务器状态模型更贴合这一需求。
