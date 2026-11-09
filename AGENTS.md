# 仓库工作规范

## 会话开始前同步代码

- 每次会话开始，先运行 `git fetch` 检查当前仓库远端状态。
- 远端有新提交且本地工作区干净时，执行 `git pull --ff-only` 同步最新代码后再开始工作。
- 当前目录不是 Git 仓库或没有远端时，跳过同步，不视为错误。
- 工作区有修改、分支分叉、未设置上游、处于 detached HEAD 或同步失败时，保留现场并说明原因。不得自动 stash、reset、rebase 或创建合并提交。
- 当前由执行任务的助手在会话开始时执行上述检查。SessionStart Hook 尚未配置，不能假定已有自动同步机制。

## Git 提交身份

- 任何 Git 提交前，检查 `git config user.name` 和 `git config user.email`。
- 若与 `st2eam` / `379403404@qq.com` 不一致，先运行 `git config --local user.name "st2eam"` 和 `git config --local user.email "379403404@qq.com"`，再继续提交。
- 只设置当前仓库级配置，不修改 `--global` 配置。
- 检查必须针对实际提交的仓库，包括使用 `git -C` 或 `cd` 切换的仓库。不得使用环境变量、`git -c`、`--author` 等方式覆盖规定身份。
- 每次提交均由执行者完成上述检查，包括脚本、别名或其他工具发起的提交。PreToolUse Hook 尚未配置。
- 提交与推送需要当前任务授权；同步代码不构成提交或推送授权。

## NPM 源

- 配置 npm / yarn / pnpm 源时，只允许使用公共 registry：官方源 `https://registry.npmjs.org` 或国内镜像 `https://registry.npmmirror.com`。
- 任何输出（命令、日志、文档、聊天回复）不得包含私有/内网 registry 地址、认证 token 或相关敏感信息。
- 发现环境已配置私有源时，只提示“存在私有源配置”，不展示其地址与内容。
- 读取可能含敏感信息的配置或诊断日志时，先在本地捕获并脱敏，再输出安全摘要；不得直接打印完整配置、环境变量或原始失败日志。
- npm、yarn、pnpm 的配置文件、环境变量、命令行参数、scope 源及锁文件下载地址均需遵守以上限制。保留已符合要求的项目级公共源，不修改全局配置。

## 自动化状态

- 当前仅已落地文字规范，没有创建 Hook 脚本或项目级 `settings.json`，没有改动已有本地权限设置。
- 自动审批要求对创建持久 Git 自动化 Hook 另行明确授权。在授权并完成配置、验证之前，不得宣称自动同步或提交身份 Hook 已生效。
