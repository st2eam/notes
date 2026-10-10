---
originalPath: 计算机与软件/编程语言/Go/go旧配置迁移.md
primaryCategory: 计算机与软件/编程语言/Go
categories:
  - path: 计算机与软件/编程语言/Go
    reason: 正文介绍Go 旧配置迁移的语义、用法与实践注意点。
classificationStatus: confirmed
relations:
  - target: 计算机与软件/编程语言/Go/go调试.md
    type: subordinate
    status: inferred
    reason: dlv 相关旧配置项被提示废弃。
    evidence: dlv 相关旧配置项被提示废弃。
tags: []
---
# Go 旧配置迁移

真实痛点：dlv 相关旧配置项被提示废弃。没有原始提示与完整配置，不能确定所有受影响字段；迁移应逐项核实，不把所有 go.delveConfig 设置都当成废弃。

## 先建立配置清单

检查用户、工作区 settings.json 与 .vscode/launch.json，记录字段、当前值、来源及警告文本。核对 Cursor、Go 扩展、Go 和 dlv 版本，以及当前 debugAdapter。保留可回退副本，再逐项调整。

## 已确认的迁移边界

Go 扩展官方文档说明：dlvLoadConfig 是 legacy 适配器的变量加载配置，dlv-dap 不沿用这套会话级机制。因此不能仅把旧对象复制到新适配器配置，也不能假设 maxStringLen 的旧嵌套位置继续生效。

DAP 使用按需加载与自身参数。参数表列有顶层 maxStringLen、maxArrayValues，但安装版本是否支持及 Cursor 的转发行为待核实。go.delveConfig 仍包含部分默认调试设置，不能整体删掉来消除警告。

## 迁移步骤

1. 以扩展生成的最小 launch.json 为基线，明确 debugAdapter=dlv-dap。
2. 保留 type、request、mode、program 等必需语义，将被警告的旧字段逐项移除。
3. 使用 schema 自动补全确认新字段位置；无对应项时标记待核实，不猜测新名称。
4. 核对路径映射、环境变量和构建参数，避免配置看似正常但调试了错误程序。
5. 验证启动、断点、局部变量、长字符串和停止行为，再比较差异。

测试 CodeLens、手动 launch 和 attach 可能读取不同配置层，应分别确认。旧远程路径映射字段若有废弃提示，需要记录准确名称和版本后再制定转换规则，此处待核实。

[[计算机与软件/编程语言/Go/go断点变量截断|长变量截断]]是迁移后的重点验收项；连接问题见 [[计算机与软件/编程语言/Go/go反向DAP连接|反向 DAP 连接]]，基础见 [[计算机与软件/编程语言/Go/go调试|Go 调试]]。

参考：[Go 扩展设置与迁移说明](https://github.com/golang/vscode-go/blob/master/docs/debugging.md#settings)。
