# 测试与 CI：让改动可以被验证

> 前置：Git 和 Python 基础。目标：为纯函数写测试，区分单元、集成与端到端测试，让关键检查在提交时自动运行。最后核对：2026-09-29。

AI 可以快速修改代码，但“生成了代码”不代表“需求已满足”。把验收条件转成可重复执行的检查，既帮助人审查，也帮助 Coding Agent 在失败后迭代。

## 三层检查

| 层次 | 检查什么 | 本站例子 |
|------|----------|----------|
| 单元测试 | 小函数的输入输出与边界 | 评测指标分母为零、LEFT JOIN 无匹配 |
| 集成测试 | 数据库、接口、权限如何协作 | 私有笔记不能被其他用户检索 |
| 端到端检查 | 用户路径是否可用 | 打开教程、操作实验台、查看引用 |

下面是**可运行的 Python 3 标准库示例**，保存为 test_access.py，运行 python3 -m unittest test_access.py：

~~~python
import unittest

def can_read(request_user, owner, is_public):
    return is_public or (request_user is not None and request_user == owner)

class AccessTests(unittest.TestCase):
    def test_owner_can_read_private_note(self):
        self.assertTrue(can_read(7, 7, False))

    def test_other_user_cannot_read_private_note(self):
        self.assertFalse(can_read(8, 7, False))

    def test_anonymous_can_read_public_note(self):
        self.assertTrue(can_read(None, 7, True))

if __name__ == "__main__":
    unittest.main()
~~~

CI（持续集成）在每次提交或合并请求中自动运行构建和测试。它应使用干净环境、固定依赖版本，失败时阻止合并并保留易读日志。日志记录任务 ID、步骤、耗时、错误类型；不要记录 API 密钥、完整私人笔记或敏感提示内容。

Agent 改代码时，先记录可观察的失败，再改动并运行相同检查。测试通过后仍要审查需求、权限和真实界面；测试只能证明它覆盖到的行为。

参见[前端测试总结](../Web/工程化/前端测试.md)、[Flask 测试覆盖](../Python/Flask/测试覆盖.md)和[AI 应用评测](../AI/应用评测.md)。参考：[Python unittest 文档](https://docs.python.org/3/library/unittest.html)、[GitHub Actions 文档](https://docs.github.com/en/actions)。
