---
originalPath: 计算机/编程语言/Go/go反向DAP连接.md
primaryCategory: 计算机/编程语言/Go
categories:
  - path: 计算机/编程语言/Go
    reason: 正文介绍Go 反向 DAP 连接的语义、用法与实践注意点。
classificationStatus: confirmed
relations:
  - target: 计算机/编程语言/Go/go调试.md
    type: subordinate
    status: inferred
    reason: dlv 反向 DAP 连接超时，调试启动失败。
    evidence: dlv 反向 DAP 连接超时，调试启动失败。
tags: []
---
# Go 反向 DAP 连接

真实痛点：dlv 反向 DAP 连接超时，调试启动失败。缺少现场日志，尚不能确认是网络、终端启动、工具路径还是配置问题，以下排查项不是已验证的故障结论。

## 先确定连接方向

普通方式由 IDE 连接 dlv 监听端口。反向方式中 IDE 一侧等待连接，dlv dap --client-addr=主机:端口 主动拨入。--listen 与 --client-addr 的角色不同；日志中的实际命令和端口比猜测配置更可靠。

Delve 官方文档明确支持 --client-addr。是否由 Cursor 的 Go 扩展自动生成、何种 console 模式触发，以及具体等待时限，须对照现场扩展版本核实。

## 按阶段排查

1. 记录 go version、dlv version 和扩展版本，确认执行的是预期 dlv。
2. 检查调试终端是否启动，dlv 是否存活；启动失败可能表现为后续连接等待超时。
3. 查等待侧的监听地址与端口，确认拨入目标一致；区分 IPv4、IPv6、localhost 和具体回环地址。
4. 在 Windows 可用 Get-NetTCPConnection -State Listen 检查监听，结合进程 PID 确认不是其他程序占用。
5. 检查防火墙规则及容器、WSL、远程扩展宿主边界，回环地址只指当前网络环境。只验证所需规则，避免直接关闭防火墙。

主动端口探测可能消耗单次 DAP 会话，应与真实调试重试分开，探测后重新启动。

## launch.json 与隔离复现

debugAdapter 选择 dlv-dap；launch 的 mode 常为 debug、test 或 exec，attach 的 mode 为 local 或 remote。不要把 dlv-dap 填入 mode。先用本地最小 launch 验证，再恢复终端和远程配置。不要随意在 dlvFlags 中覆盖扩展管理的监听参数。

日志支持字段及 Cursor 控制台兼容性待核实。扩大超时只能作为观测手段，其配置名待核实，不能掩盖进程未启动。

参见 [[计算机/编程语言/Go/go调试|Go 调试]]。待补：原始错误、实际命令、监听 PID、连接方向及复现结果。

参考：[dlv dap 用法](https://github.com/go-delve/delve/blob/master/Documentation/usage/dlv_dap.md)、[Go 扩展反向连接实现](https://github.com/golang/vscode-go/blob/master/extension/src/goDebugFactory.ts)。
