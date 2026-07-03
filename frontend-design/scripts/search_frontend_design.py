#!/usr/bin/env python3
"""Search frontend-design references and CSV data with stdlib only.

Usage:
  python scripts/search_frontend_design.py dashboard
  python scripts/search_frontend_design.py "trust finance" --data-only
  python scripts/search_frontend_design.py motion --refs-only -n 8
"""

from __future__ import annotations

import argparse
import csv
import re
from pathlib import Path
from math import log
from _catalog import expand_query

ROOT = Path(__file__).resolve().parents[1]
REFS = ROOT / "references"
DATA = ROOT / "data"


def tokenize(text: str) -> list[str]:
    return re.findall(r"[a-zA-Z0-9_+-]+", text.lower())


def score(query: list[str], text: str) -> float:
    tokens = tokenize(text)
    if not tokens:
        return 0.0
    counts: dict[str, int] = {}
    for token in tokens:
        counts[token] = counts.get(token, 0) + 1
    value = 0.0
    length_norm = 1 + log(len(tokens) + 1)
    for term in query:
        value += counts.get(term, 0) / length_norm
        for token in counts:
            if term in token and term != token:
                value += 0.25 / length_norm
    return value


def iter_reference_chunks() -> list[dict[str, str]]:
    chunks: list[dict[str, str]] = []
    for path in sorted(REFS.glob("*.md")):
        text = path.read_text(encoding="utf-8")
        current_title = path.name
        current: list[str] = []
        for line in text.splitlines():
            if line.startswith("## ") and current:
                chunks.append({"source": str(path.relative_to(ROOT)), "title": current_title, "text": "\n".join(current).strip()})
                current = []
            if line.startswith("#"):
                current_title = line.lstrip("# ").strip() or current_title
            current.append(line)
        if current:
            chunks.append({"source": str(path.relative_to(ROOT)), "title": current_title, "text": "\n".join(current).strip()})
    return chunks


def format_row(row: dict[str, object]) -> str:
    parts: list[str] = []
    for key, value in row.items():
        if value is None:
            continue
        if isinstance(value, list):
            rendered = ", ".join(str(item) for item in value)
        else:
            rendered = str(value)
        parts.append(f"{key}: {rendered}")
    return " | ".join(parts)


def iter_data_rows() -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []
    for path in sorted(DATA.glob("*.csv")):
        with path.open(newline="", encoding="utf-8") as handle:
            for index, row in enumerate(csv.DictReader(handle), start=1):
                title = str(row.get("canonical") or row.get("style") or row.get("product_category") or row.get("Product Type") or row.get("Style Category") or row.get("Pattern Name") or f"row {index}")
                rows.append({"source": str(path.relative_to(ROOT)), "title": title, "text": format_row(row)})
    return rows


def main() -> int:
    parser = argparse.ArgumentParser(description="Search frontend-design skill references")
    parser.add_argument("query", nargs="+", help="Search terms")
    parser.add_argument("-n", "--limit", type=int, default=6)
    parser.add_argument("--refs-only", action="store_true")
    parser.add_argument("--data-only", action="store_true")
    args = parser.parse_args()
    query = expand_query(" ".join(args.query))
    docs: list[dict[str, str]] = []
    if not args.data_only:
        docs.extend(iter_reference_chunks())
    if not args.refs_only:
        docs.extend(iter_data_rows())
    ranked = sorted(((score(query, doc["text"] + " " + doc["title"]), doc) for doc in docs), key=lambda item: item[0], reverse=True)
    shown = 0
    for value, doc in ranked:
        if value <= 0:
            continue
        shown += 1
        excerpt = re.sub(r"\s+", " ", doc["text"]).strip()
        if len(excerpt) > 520:
            excerpt = excerpt[:517] + "..."
        print(f"## {doc['title']}\nSource: {doc['source']} | score={value:.3f}\n{excerpt}\n")
        if shown >= args.limit:
            break
    if shown == 0:
        print("No matches")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
