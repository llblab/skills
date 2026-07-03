#!/usr/bin/env python3
"""Generate chart/data-visualization guidance.

Usage:
  python scripts/generate_chart_brief.py comparison revenue categories
  python scripts/generate_chart_brief.py realtime monitoring latency
"""

from __future__ import annotations

import argparse
from _catalog import rank_csv, pick, md_bullet


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate chart brief")
    parser.add_argument("query", nargs="+")
    parser.add_argument("-n", "--limit", type=int, default=3)
    args = parser.parse_args()
    query = " ".join(args.query)
    rows = rank_csv("chart-selection.csv", query, args.limit)
    slide_rows = rank_csv("slide-charts.csv", query, min(args.limit, 2))
    print(f"# Chart Brief: {query}\n")
    if rows:
        print("## Chart Candidates\n")
        for row in rows:
            print(f"### {pick(row, 'Best Chart Type')}")
            for label, key in [
                ("Data type", "Data Type"), ("Secondary", "Secondary Options"),
                ("Use when", "When to Use"), ("Avoid when", "When NOT to Use"),
                ("Volume", "Data Volume Threshold"), ("Color", "Color Guidance"),
                ("Accessibility", "Accessibility Grade"), ("Interaction", "Interaction Pattern"),
            ]:
                value = pick(row, key)
                if value:
                    print(md_bullet(label, value))
            print("")
    if slide_rows:
        print("## Presentation Chart Fit\n")
        for row in slide_rows:
            print(f"### {pick(row, 'chart_type')}")
            print(md_bullet("Best for", pick(row, "best_for")))
            print(md_bullet("Data type", pick(row, "data_type")))
            print(md_bullet("Use", pick(row, "when_to_use")))
            print(md_bullet("Avoid", pick(row, "when_to_avoid")))
            print(md_bullet("Max categories", pick(row, "max_categories")))
            print("")
    print("## Rules\n")
    print("- Start from the question the user must answer.")
    print("- Label important values directly where possible.")
    print("- Do not rely on color alone; use text, position, shape, or icons.")
    print("- Preserve truthful scales and label truncation/log scales explicitly.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
