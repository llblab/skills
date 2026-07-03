#!/usr/bin/env python3
"""Generate icon guidance from local icon style/library data.

Usage:
  python scripts/generate_icon_brief.py dashboard analytics
  python scripts/generate_icon_brief.py navigation arrows --style outlined
"""

from __future__ import annotations

import argparse
from _catalog import rank_csv, pick, md_bullet


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate icon brief")
    parser.add_argument("query", nargs="+")
    parser.add_argument("--style", default="")
    parser.add_argument("-n", "--limit", type=int, default=6)
    args = parser.parse_args()
    query = " ".join(args.query + ([args.style] if args.style else []))
    compact_styles = rank_csv("icon-styles.csv", query, 3)
    generation_styles = rank_csv("icon-generation-styles.csv", query, 3)
    icons = rank_csv("icon-library-map.csv", query, args.limit)
    print(f"# Icon Brief: {' '.join(args.query)}\n")
    if compact_styles or generation_styles:
        print("## Style Candidates\n")
        for row in compact_styles:
            print(f"### {pick(row, 'style')}")
            print(md_bullet("Best for", pick(row, "best_for")))
            print(md_bullet("Stroke", pick(row, "stroke")))
            print(md_bullet("Fill", pick(row, "fill")))
            print(md_bullet("Checks", pick(row, "checks")))
            print("")
        for row in generation_styles:
            name = pick(row, "name")
            if any(name.lower() == pick(existing, "style").lower() for existing in compact_styles):
                continue
            print(f"### {name}")
            print(md_bullet("Description", pick(row, "description")))
            print(md_bullet("Stroke", pick(row, "stroke_width")))
            print(md_bullet("Fill", pick(row, "fill")))
            print(md_bullet("Best for", pick(row, "best_for")))
            print(md_bullet("Keywords", pick(row, "keywords")))
            print("")
    if icons:
        print("## Icon Candidates\n")
        for row in icons:
            print(f"### {pick(row, 'Icon Name')}")
            print(md_bullet("Category", pick(row, "Category")))
            print(md_bullet("Keywords", pick(row, "Keywords")))
            print(md_bullet("Library", pick(row, "Library")))
            print(md_bullet("Usage", pick(row, "Usage")))
            print(md_bullet("Best for", pick(row, "Best For")))
            print("")
    print("## Rules\n")
    print("- Keep stroke width, corner style, fill mode, and metaphor family consistent.")
    print("- Use currentColor for inline SVG when possible.")
    print("- Test icons at 16px, 24px, and 48px.")
    print("- Functional icon-only controls need accessible names; decorative icons stay silent.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
