"""Offline, extractive search over public Markdown notes. Python 3.10+."""

from __future__ import annotations

import argparse
from dataclasses import dataclass
import math
from pathlib import Path
import re
import time


@dataclass(frozen=True)
class Chunk:
    path: str
    heading: str
    line: int
    text: str


def terms(text: str) -> set[str]:
    parts = re.findall(r"[a-zA-Z][a-zA-Z0-9_-]*|[\u4e00-\u9fff]+", text.lower())
    found: set[str] = set()
    for part in parts:
        if re.fullmatch(r"[\u4e00-\u9fff]+", part):
            found.update(part[i:i + 2] for i in range(len(part) - 1))
        elif len(part) > 1:
            found.add(part)
    return found - {"什么", "么是", "如何", "怎么", "请问"}


def load_chunks(root: Path) -> list[Chunk]:
    """Load only the public AI notes in this repository, preserving source lines."""
    result: list[Chunk] = []
    for file in sorted((root / "AI").glob("*.md")):
        relative = file.relative_to(root).as_posix()
        heading = file.stem
        start = 1
        body: list[str] = []
        in_code = False
        in_exercise = False
        for number, line in enumerate(file.read_text(encoding="utf-8").splitlines(), 1):
            if line.startswith(("~~~", "```")):
                in_code = not in_code
                continue
            if in_code or line.startswith(("|", "- [", "> ")) or re.fullmatch(r"<\w+Lab\s*/>", line.strip()):
                continue
            if re.match(r"^#{2,6} 练习\s*$", line):
                if body:
                    result.append(Chunk(relative, heading, start, "\n".join(body).strip()))
                body = []
                in_exercise = True
                continue
            if in_exercise:
                continue
            if line.startswith("# "):
                if body:
                    result.append(Chunk(relative, heading, start, "\n".join(body).strip()))
                heading = line.lstrip("# ").strip()
                start = number + 1
                body = []
            elif line.startswith("## "):
                if body:
                    result.append(Chunk(relative, heading, start, "\n".join(body).strip()))
                heading = line.lstrip("# ").strip()
                start = number + 1
                body = []
            elif line.strip():
                if not body:
                    start = number
                body.append(line)
        if body:
            result.append(Chunk(relative, heading, start, "\n".join(body).strip()))
    return [item for item in result if terms(item.text)]


def search(question: str, chunks: list[Chunk], allowed_paths: set[str], limit: int = 3) -> list[Chunk]:
    query = terms(question)
    if not query or limit < 1:
        return []
    matches = []
    for item in chunks:
        if item.path not in allowed_paths:
            continue
        title_terms = terms(Path(item.path).stem + " " + item.heading)
        body_terms = terms(item.text)
        score = 4 * len(query & title_terms) + len(query & body_terms)
        overlap = len(query & (title_terms | body_terms))
        required = 1 if len(query) == 1 else max(2, math.ceil(len(query) * 0.4))
        if score and overlap >= required:
            matches.append((score, item))
    matches.sort(key=lambda entry: (-entry[0], entry[1].path, entry[1].line))
    return [item for _, item in matches[:limit]]


def render(results: list[Chunk]) -> str:
    if not results:
        return "没有找到足够证据。"
    lines = []
    for item in results:
        excerpt = re.sub(r"\s+", " ", item.text)[:220]
        lines.append(f"- {excerpt}\n  来源：{item.path}:{item.line}（{item.heading}）")
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser(description="检索公开 AI 笔记，返回原文摘录与来源")
    parser.add_argument("question", help="要搜索的问题")
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    start = time.perf_counter()
    chunks = load_chunks(root)
    allowed_paths = {item.path for item in chunks}  # 演示仓库中的 AI 笔记均公开。
    results = search(args.question, chunks, allowed_paths)
    print(render(results))
    print(f"检索耗时：{(time.perf_counter() - start) * 1000:.1f} ms")


if __name__ == "__main__":
    main()
