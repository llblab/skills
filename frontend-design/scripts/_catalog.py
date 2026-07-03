#!/usr/bin/env python3
"""Shared stdlib helpers for frontend-design scripts."""

from __future__ import annotations

import csv
import re
from pathlib import Path
from math import log
from typing import Iterable

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
REFS = ROOT / "references"


def tokenize(text: str) -> list[str]:
    return re.findall(r"[a-zA-Z0-9_+-]+", text.lower())


def terminology_rows() -> list[dict[str, str]]:
    path = DATA / "terminology.csv"
    if not path.exists():
        return []
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def expand_query(text: str) -> list[str]:
    raw = text.lower()
    expanded = tokenize(raw)
    for row in terminology_rows():
        canonical = row.get("canonical", "")
        aliases = [item.strip() for item in row.get("aliases", "").split(";") if item.strip()]
        names = [canonical, *aliases]
        if any(name and name.lower() in raw for name in names):
            expanded.extend(tokenize(canonical))
            for alias in aliases:
                expanded.extend(tokenize(alias))
    return list(dict.fromkeys(expanded))


def stringify(value: object) -> str:
    if value is None:
        return ""
    if isinstance(value, list):
        return " ".join(stringify(item) for item in value)
    return str(value)


def row_text(row: dict[str, object]) -> str:
    return " ".join(stringify(value) for value in row.values())


def score(query: list[str], text: str) -> float:
    words = tokenize(text)
    if not words:
        return 0.0
    counts: dict[str, int] = {}
    for word in words:
        counts[word] = counts.get(word, 0) + 1
    norm = 1 + log(len(words) + 1)
    value = 0.0
    for term in query:
        value += counts.get(term, 0) / norm
        value += sum(0.2 / norm for word in counts if term in word and term != word)
    return value


def load_csv(name: str) -> list[dict[str, str]]:
    path = DATA / name
    if not path.exists():
        return []
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def rank_csv(name: str, query_text: str | Iterable[str], limit: int = 5) -> list[dict[str, str]]:
    query = expand_query(" ".join(query_text) if not isinstance(query_text, str) else query_text)
    ranked = sorted(((score(query, row_text(row)), row) for row in load_csv(name)), key=lambda item: item[0], reverse=True)
    return [row for value, row in ranked[:limit] if value > 0]


def pick(row: dict[str, str] | None, *keys: str) -> str:
    if not row:
        return ""
    for key in keys:
        value = row.get(key)
        if value:
            return value
    return ""


def md_bullet(label: str, value: str) -> str:
    return f"- **{label}:** {value}" if value else f"- **{label}:** —"


def print_rows(title: str, rows: list[dict[str, str]], fields: list[tuple[str, str]]) -> list[str]:
    lines: list[str] = []
    if rows:
        lines += [f"## {title}", ""]
        for row in rows:
            heading = pick(row, fields[0][1]) or title
            lines.append(f"### {heading}")
            for label, key in fields[1:]:
                lines.append(md_bullet(label, pick(row, key)))
            lines.append("")
    return lines
