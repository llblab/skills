#!/usr/bin/env python3
"""Generate a frontend banner/hero brief from local specs.

Usage:
  python scripts/generate_banner_brief.py linkedin personal_banner "Agent OS release"
  python scripts/generate_banner_brief.py website full_width_hero "Atmo Network"
"""

from __future__ import annotations

import argparse
import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPECS = ROOT / "data" / "banner-specs.csv"


def load() -> list[dict[str, str]]:
    with SPECS.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def find(surface: str, kind: str) -> dict[str, str] | None:
    s = surface.lower()
    k = kind.lower()
    for row in load():
        if s in row["surface"].lower() and (k in row["type"].lower() or k in row["surface"].lower()):
            return row
    for row in load():
        if s in row["surface"].lower():
            return row
    return None


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate banner/hero brief")
    parser.add_argument("surface")
    parser.add_argument("type")
    parser.add_argument("message", nargs="+")
    parser.add_argument("--style", default="")
    parser.add_argument("--cta", default="")
    args = parser.parse_args()
    row = find(args.surface, args.type)
    message = " ".join(args.message)
    if not row:
        print("No matching banner spec found")
        return 1
    print(f"# Banner Brief: {message}\n")
    print(f"- Surface: {row['surface']} / {row['type']}")
    print(f"- Size: {row['size']} ({row['aspect_ratio']})")
    print(f"- Safe zone: {row['safe_zone']}")
    print(f"- Notes: {row['notes']}")
    if args.style:
        print(f"- Art direction: {args.style}")
    if args.cta:
        print(f"- CTA: {args.cta}")
    print("\n## Design Rules\n")
    print("- One dominant message.")
    print("- One CTA when the banner is interactive or ad-like.")
    print("- Keep essential text inside the safe zone.")
    print("- Max two type families unless the concept requires more.")
    print("- Preserve legibility at target display size and thumbnail size.")
    print("- Treat platform crop as composition, not simple scaling.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
