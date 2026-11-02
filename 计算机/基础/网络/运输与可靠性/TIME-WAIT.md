---
title: TIME-WAIT
primaryCategory: 计算机/基础/网络/运输与可靠性
categories:
  - path: 计算机/基础/网络/运输与可靠性
    reason: 围绕TIME-WAIT解释单一网络概念的定义、工作机制与适用条件。
classificationStatus: confirmed
relations: []
tags:
  - 计算机网络
---
# TIME-WAIT

## 定义

发送最终确认的一方通常在连接关闭前等待 2MSL，MSL 为报文最大生存时间。

## 工作原理

等待使对方最后 FIN 的重传仍能得到确认，并给旧连接的残留报文消失留出时间，降低新连接复用同一标识时的混淆。实际计时值取决于实现。
