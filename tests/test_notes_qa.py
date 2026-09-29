import sys
from pathlib import Path
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "examples"))
from notes_qa import Chunk, load_chunks, render, search, terms


class NotesQaTests(unittest.TestCase):
    def setUp(self):
        self.chunks = [
            Chunk("AI/公开.md", "向量检索", 10, "余弦相似度用于比较向量方向。"),
            Chunk("AI/私有.md", "内部制度", 8, "内部制度只对授权用户开放。"),
        ]

    def test_chinese_terms_and_source(self):
        self.assertIn("余弦", terms("余弦相似度"))
        result = search("余弦相似度", self.chunks, {"AI/公开.md"})
        self.assertEqual(result[0].path, "AI/公开.md")
        self.assertIn("AI/公开.md:10", render(result))

    def test_permissions_filter_before_result(self):
        result = search("内部制度", self.chunks, {"AI/公开.md"})
        self.assertEqual(result, [])
        self.assertEqual(render(result), "没有找到足够证据。")

    def test_unmatched_question_does_not_invent_source(self):
        result = search("量子海豚协议", self.chunks, {"AI/公开.md"})
        self.assertEqual(result, [])

    def test_repository_chunks_are_public_ai_markdown(self):
        root = Path(__file__).resolve().parents[1]
        chunks = load_chunks(root)
        self.assertTrue(chunks)
        self.assertTrue(all(item.path.startswith("AI/") and item.path.endswith(".md") for item in chunks))
        allowed = {item.path for item in chunks}
        self.assertEqual(search("什么是 Embedding", chunks, allowed)[0].path, "AI/Embedding与向量数据库.md")
        self.assertEqual(search("量子海豚协议是什么", chunks, allowed), [])
        self.assertEqual(search("仓库里不存在的内部制度", chunks, allowed), [])
        self.assertFalse(any(item.heading == "练习" for item in chunks))


if __name__ == "__main__":
    unittest.main()
