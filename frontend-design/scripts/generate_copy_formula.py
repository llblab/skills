#!/usr/bin/env python3
"""Lookup persuasive UI/landing/presentation copy formulas.

Usage:
  python scripts/generate_copy_formula.py urgency
  python scripts/generate_copy_formula.py feature --limit 3
"""

from __future__ import annotations

import argparse
from _catalog import rank_csv, pick


def print_compact(rows: list[dict[str, str]]) -> None:
    for row in rows:
        print(f"## {pick(row, 'formula')}")
        print(f"Use for: {pick(row, 'use_for')}")
        print(f"Structure: {pick(row, 'structure')}")
        print(f"Template: {pick(row, 'template')}")
        print(f"Emotion: {pick(row, 'emotion')}\n")


def print_slide(rows: list[dict[str, str]]) -> None:
    for row in rows:
        print(f"## Slide: {pick(row, 'formula_name')}")
        print(f"Use case: {pick(row, 'use_case')}")
        print(f"Components: {pick(row, 'components')}")
        print(f"Template: {pick(row, 'example_template')}")
        print(f"Emotion: {pick(row, 'emotion_trigger')}")
        print(f"Slide type: {pick(row, 'slide_type')}\n")


def main() -> int:
    parser = argparse.ArgumentParser(description="Lookup copy formula")
    parser.add_argument("query", nargs="+")
    parser.add_argument("--limit", "-n", type=int, default=2)
    args = parser.parse_args()
    query = " ".join(args.query)
    compact = rank_csv("copy-formulas.csv", query, args.limit)
    slide = rank_csv("slide-copy.csv", query, args.limit)
    if not compact and not slide:
        print("No matching formula")
        return 1
    if compact:
        print("# UI / Landing Copy\n")
        print_compact(compact)
    if slide:
        print("# Presentation Copy\n")
        print_slide(slide)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
