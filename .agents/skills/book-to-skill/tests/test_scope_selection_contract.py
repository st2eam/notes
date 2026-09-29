"""Scope-selection contract documented by the book-to-skill skill."""

from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
SKILL = (ROOT / "SKILL.md").read_text(encoding="utf-8")
INSTALL = (ROOT / "docs" / "install.md").read_text(encoding="utf-8")


def test_scope_defaults_to_personal_without_a_mandatory_prompt():
    assert "preserve the established personal default" in SKILL
    assert "Do not ask a mandatory scope question" in SKILL
    assert "does not ask a mandatory scope question" in INSTALL


def test_explicit_project_scope_is_documented_as_opt_in():
    assert "BOOK_TO_SKILL_SCOPE=project" in SKILL
    assert "BOOK_TO_SKILL_SCOPE=project" in INSTALL
    assert "project-local/project output selects the project-local row" in SKILL
    assert "After:  BOOK_TO_SKILL_SCOPE=project" in INSTALL


def test_personal_destination_does_not_claim_approval_free_writes():
    assert "may still require host approval before writing" in SKILL
    assert "may require host approval to write inside the project" in INSTALL
    assert "no extra approval" not in SKILL
