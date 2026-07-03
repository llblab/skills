#!/usr/bin/env python3
"""Generate identity package / CIP deliverable guidance.

Usage:
  python scripts/generate_identity_brief.py "consulting startup business card signage"
"""

from __future__ import annotations

import argparse
from _catalog import rank_csv, pick, md_bullet


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate identity package brief")
    parser.add_argument("query", nargs="+")
    parser.add_argument("-n", "--limit", type=int, default=4)
    args = parser.parse_args()
    query = " ".join(args.query)
    deliverables = rank_csv("identity-deliverables.csv", query, args.limit)
    industries = rank_csv("identity-industries.csv", query, 2)
    styles = rank_csv("identity-styles.csv", query, 2)
    mockups = rank_csv("identity-mockup-contexts.csv", query, 2)
    print(f"# Identity Package Brief: {query}\n")
    if industries:
        print("## Industry Direction\n")
        for row in industries:
            print(f"### {pick(row, 'Industry')}")
            print(md_bullet("CIP style", pick(row, "CIP Style")))
            print(md_bullet("Primary colors", pick(row, "Primary Colors")))
            print(md_bullet("Typography", pick(row, "Typography")))
            print(md_bullet("Key deliverables", pick(row, "Key Deliverables")))
            print("")
    if styles:
        print("## Identity Styles\n")
        for row in styles:
            print(f"### {pick(row, 'Style Name')}")
            print(md_bullet("Description", pick(row, "Description")))
            print(md_bullet("Colors", pick(row, "Primary Colors")))
            print(md_bullet("Typography", pick(row, "Typography")))
            print(md_bullet("Materials", pick(row, "Materials")))
            print("")
    if deliverables:
        print("## Deliverables\n")
        for row in deliverables:
            print(f"### {pick(row, 'Deliverable')}")
            print(md_bullet("Category", pick(row, "Category")))
            print(md_bullet("Description", pick(row, "Description")))
            print(md_bullet("Dimensions", pick(row, "Dimensions")))
            print(md_bullet("Format", pick(row, "File Format")))
            print(md_bullet("Logo placement", pick(row, "Logo Placement")))
            print("")
    if mockups:
        print("## Mockup Contexts\n")
        for row in mockups:
            print(f"### {pick(row, 'Context Name')}")
            print(md_bullet("Scene", pick(row, "Scene Description")))
            print(md_bullet("Lighting", pick(row, "Lighting")))
            print(md_bullet("Environment", pick(row, "Environment")))
            print(md_bullet("Props", pick(row, "Props")))
            print("")
    print("## Handoff Rules\n")
    print("- Include logo variants, palette, typography, and usage rules.")
    print("- Specify dimensions, file formats, material/finish assumptions, and production constraints.")
    print("- Separate digital assets, print assets, source files, and exports.")
    print("- Keep naming and versioning stable for approvals.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
