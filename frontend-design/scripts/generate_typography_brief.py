#!/usr/bin/env python3
"""Generate typography pairing guidance.

Usage:
  python scripts/generate_typography_brief.py dashboard data
  python scripts/generate_typography_brief.py luxury editorial -n 4
"""

from __future__ import annotations

import argparse
from _catalog import rank_csv, pick, md_bullet


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate typography brief")
    parser.add_argument("query", nargs="+")
    parser.add_argument("-n", "--limit", type=int, default=4)
    args = parser.parse_args()
    query = " ".join(args.query)
    rows = rank_csv("typography-pairings.csv", query, args.limit)
    print(f"# Typography Brief: {query}\n")
    for row in rows:
        print(f"## {pick(row, 'Font Pairing Name')}")
        for label, key in [
            ("Category", "Category"), ("Heading", "Heading Font"), ("Body", "Body Font"),
            ("Mood", "Mood/Style Keywords"), ("Best for", "Best For"),
            ("Google Fonts", "Google Fonts URL"), ("CSS import", "CSS Import"),
            ("Tailwind config", "Tailwind Config"), ("Scale", "Type Scale"),
            ("Weights", "Recommended Weights"), ("Accessibility", "Accessibility Notes"),
        ]:
            value = pick(row, key)
            if value:
                print(md_bullet(label, value))
        print("")
    print("## Rules\n")
    print("- Body text starts at readable size before personality.")
    print("- Use tabular numerals for metrics, prices, timers, and tables.")
    print("- Control line length: prose around 65-75ch, mobile 35-60ch.")
    print("- If fonts are constrained, create character through scale, weight, rhythm, tracking, and contrast.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
