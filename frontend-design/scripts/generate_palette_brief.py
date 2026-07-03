#!/usr/bin/env python3
"""Generate palette guidance from product palettes and color psychology.

Usage:
  python scripts/generate_palette_brief.py fintech crypto
  python scripts/generate_palette_brief.py healthcare --colors blue green
"""

from __future__ import annotations

import argparse
from _catalog import rank_csv, pick, md_bullet


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate color palette brief")
    parser.add_argument("query", nargs="+")
    parser.add_argument("--colors", nargs="*", default=[])
    args = parser.parse_args()
    query = " ".join(args.query)
    palette_rows = rank_csv("product-color-palettes.csv", query, 4)
    psychology_rows = []
    for color in args.colors or query.split():
        psychology_rows.extend(rank_csv("color-psychology.csv", color, 1))
    seen = set()
    psychology_rows = [row for row in psychology_rows if not (pick(row, "color") in seen or seen.add(pick(row, "color")))]
    print(f"# Palette Brief: {query}\n")
    if palette_rows:
        print("## Product Palette Candidates\n")
        for row in palette_rows:
            print(f"### {pick(row, 'Product Type')}")
            for label, key in [
                ("Primary", "Primary"), ("On primary", "On Primary"), ("Secondary", "Secondary"),
                ("On secondary", "On Secondary"), ("Accent", "Accent"), ("On accent", "On Accent"),
                ("Background", "Background"), ("Foreground", "Foreground"),
                ("Muted", "Muted"), ("Border", "Border"), ("Success", "Success"),
                ("Warning", "Warning"), ("Error", "Error"), ("Info", "Info"),
            ]:
                value = pick(row, key)
                if value:
                    print(md_bullet(label, value))
            print("")
    if psychology_rows:
        print("## Color Psychology\n")
        for row in psychology_rows:
            print(f"### {pick(row, 'color')}")
            print(md_bullet("Signals", pick(row, "signals")))
            print(md_bullet("Common fit", pick(row, "common_fit")))
            print(md_bullet("Caution", pick(row, "caution")))
            print(md_bullet("Pairings", pick(row, "pairings")))
            print("")
    print("## Rules\n")
    print("- Define semantic roles before painting components.")
    print("- Check contrast for primary text, muted text, borders, and focus rings.")
    print("- Reserve strong color for action, status, or brand memory.")
    print("- Do not rely on color alone for state or severity.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
