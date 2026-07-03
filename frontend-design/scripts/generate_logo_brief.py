#!/usr/bin/env python3
"""Generate logo/mark design guidance without invoking image generation.

Usage:
  python scripts/generate_logo_brief.py "eco fintech cooperative"
  python scripts/generate_logo_brief.py "luxury hotel" --name Atmo
"""

from __future__ import annotations

import argparse
from _catalog import rank_csv, pick, md_bullet


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate logo design brief")
    parser.add_argument("query", nargs="+")
    parser.add_argument("--name", default="")
    parser.add_argument("-n", "--limit", type=int, default=3)
    args = parser.parse_args()
    query = " ".join(args.query)
    styles = rank_csv("logo-styles.csv", query, args.limit)
    colors = rank_csv("logo-color-palettes.csv", query, args.limit)
    industries = rank_csv("logo-industries.csv", query, 2)
    print(f"# Logo Brief: {args.name or query}\n")
    if industries:
        print("## Industry Fit\n")
        for row in industries:
            print(f"### {pick(row, 'Industry')}")
            print(md_bullet("Recommended styles", pick(row, "Recommended Styles")))
            print(md_bullet("Primary colors", pick(row, "Primary Colors")))
            print(md_bullet("Typography", pick(row, "Typography")))
            print(md_bullet("Symbols", pick(row, "Common Symbols")))
            print(md_bullet("Mood", pick(row, "Mood")))
            print("")
    if styles:
        print("## Style Candidates\n")
        for row in styles:
            print(f"### {pick(row, 'Style Name')}")
            print(md_bullet("Category", pick(row, "Category")))
            print(md_bullet("Keywords", pick(row, "Keywords")))
            print(md_bullet("Colors", pick(row, "Primary Colors")))
            print(md_bullet("Typography", pick(row, "Typography")))
            print(md_bullet("Effects", pick(row, "Effects")))
            print(md_bullet("Best for", pick(row, "Best For")))
            print("")
    if colors:
        print("## Palette Candidates\n")
        for row in colors:
            print(f"### {pick(row, 'Palette Name')}")
            print(md_bullet("Category", pick(row, "Category")))
            print(md_bullet("Primary", pick(row, "Primary Hex")))
            print(md_bullet("Secondary", pick(row, "Secondary Hex")))
            print(md_bullet("Accent", pick(row, "Accent Hex")))
            print(md_bullet("Background", pick(row, "Background Hex")))
            print("")
    print("## Logo Requirements\n")
    print("- Works in one color and reversed color.")
    print("- Recognizable at favicon/app-icon size.")
    print("- Clear silhouette and simple geometry.")
    print("- Horizontal, stacked, icon-only, and monochrome variants considered.")
    print("- No tiny details, unlicensed type, distorted marks, or decoration that fails at small size.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
