# 贡献指南

## 提交规范（Conventional Commits）

本仓库所有 git 提交遵循[约定式提交规范](https://github.com/conventional-commits/conventionalcommits.org)。

### 提交信息格式

```
<type>(<scope>): <subject>
```

- **type**：`feat` 新功能、`fix` 修复、`docs` 文档/笔记内容、`style` 格式调整（不影响逻辑）、`refactor` 重构、`perf` 性能优化、`test` 测试、`build` 构建、`ci` 持续集成、`chore` 杂项、`revert` 回滚
- **scope**（可选）：受影响的模块，如 `history`、`ai`、`vue`、`python`、`design-patterns`、`embed`
- **subject**：简洁描述，祈使语气；本仓库为中文笔记，可用中文描述，不以句号结尾

### 示例

- `docs(history): 补充中国近代史系列事件20篇并关联知识图谱`
- `fix: 修复 markdownlint 报错`
- `feat(embed): pin embed outline on desktop layouts`
- `chore: 移除误提交的构建临时文件`

### 使用模板

仓库根目录提供 `.gitmessage` 提交模板，执行 `git commit`（不带 `-m`）时自动载入。

### 提交前检查

- 确认 `git config user.name` 与 `user.email` 为仓库约定的提交身份。
- 提交信息与改动内容一致，避免将无关改动混入同一提交。
