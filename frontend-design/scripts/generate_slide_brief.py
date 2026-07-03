#!/usr/bin/env python3
"""Generate a slide/presentation or section-layout brief from slide data.

Usage:
  python scripts/generate_slide_brief.py "investor pitch traction"
  python scripts/generate_slide_brief.py "problem slide" --position 2 --total 10
"""

from __future__ import annotations

import argparse
import csv
import re
from pathlib import Path
from math import log

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"


def toks(text: str) -> list[str]:
    return re.findall(r"[a-zA-Z0-9_+-]+", text.lower())


def score(query: list[str], row: dict[str, str]) -> float:
    words = toks(" ".join(row.values()))
    if not words:
        return 0.0
    norm = 1 + log(len(words) + 1)
    return sum((words.count(q) + sum(0.2 for w in set(words) if q in w and q != w)) / norm for q in query)


def load(name: str) -> list[dict[str, str]]:
    with (DATA / name).open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def top(name: str, query: list[str]) -> dict[str, str] | None:
    ranked = sorted(((score(query, row), row) for row in load(name)), key=lambda item: item[0], reverse=True)
    return ranked[0][1] if ranked and ranked[0][0] > 0 else None


def val(row: dict[str, str] | None, *keys: str) -> str:
    if not row:
        return "—"
    for key in keys:
        if row.get(key):
            return row[key]
    return "—"


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate slide/section brief")
    parser.add_argument("query", nargs="+")
    parser.add_argument("--position", type=int)
    parser.add_argument("--total", type=int)
    args = parser.parse_args()
    query_text = " ".join(args.query)
    query = toks(query_text)
    strategy = top("slide-strategies.csv", query)
    layout = top("slide-layouts.csv", query)
    logic = top("slide-layout-logic.csv", query)
    copy = top("slide-copy.csv", query)
    color = top("slide-color-logic.csv", query)
    typography = top("slide-typography.csv", query)
    chart = top("slide-charts.csv", query)
    background = top("slide-backgrounds.csv", query)
    print(f"# Slide / Section Brief: {query_text}\n")
    if args.position and args.total:
        break_pattern = args.position in {max(1, args.total // 3), max(1, (args.total * 2) // 3)}
        print(f"- Position: {args.position}/{args.total}")
        print(f"- Pattern break candidate: {'yes' if break_pattern else 'no'}")
    print(f"- Strategy: {val(strategy, 'strategy_name')} — {val(strategy, 'goal')}")
    print(f"- Layout: {val(layout, 'layout_name')} — {val(layout, 'use_case')}")
    print(f"- Logic: {val(logic, 'layout_pattern')} / {val(logic, 'direction')} / visual weight {val(logic, 'visual_weight')}")
    print(f"- Copy formula: {val(copy, 'formula_name')} — {val(copy, 'example_template')}")
    print(f"- Color: bg {val(color, 'background')}, text {val(color, 'text_color')}, accent {val(color, 'accent_usage')}")
    print(f"- Typography: primary {val(typography, 'primary_size')}, secondary {val(typography, 'secondary_size')}, line-height {val(typography, 'line_height')}")
    print(f"- Chart if needed: {val(chart, 'chart_type')} — {val(chart, 'when_to_use')}")
    print(f"- Background: {val(background, 'image_category')} with {val(background, 'overlay_style')} overlay, text {val(background, 'text_placement')}")
    print("\n## Rules\n")
    print("- One idea per slide/viewport.")
    print("- Prefer direct labels and large readable type.")
    print("- Pattern breaks are useful around one-third and two-thirds of a long sequence.")
    print("- Charts need labels, not just visual shape.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
