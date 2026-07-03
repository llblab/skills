#!/usr/bin/env python3
"""Lookup canonical frontend-design terminology.

Usage:
  python scripts/lookup_term.py neubrutalism
  python scripts/lookup_term.py "soft ui"
"""

from __future__ import annotations

import argparse
from _catalog import load_csv, rank_csv, pick, md_bullet


def main() -> int:
    parser = argparse.ArgumentParser(description="Lookup canonical design terminology")
    parser.add_argument("query", nargs="+")
    parser.add_argument("-n", "--limit", type=int, default=5)
    args = parser.parse_args()
    query = " ".join(args.query)
    query_l = query.lower()
    all_rows = load_csv("terminology.csv")
    exact = []
    for row in all_rows:
        names = [pick(row, "canonical"), *[item.strip() for item in pick(row, "aliases").split(";") if item.strip()]]
        if any(name.lower() == query_l for name in names):
            exact.append(row)
    rows = exact or rank_csv("terminology.csv", query, args.limit)
    if not rows:
        print("No matching term")
        return 1
    print(f"# Terminology Lookup: {query}\n")
    for row in rows:
        print(f"## {pick(row, 'canonical')}")
        print(md_bullet("Kind", pick(row, "kind")))
        print(md_bullet("Aliases", pick(row, "aliases")))
        print(md_bullet("Definition", pick(row, "definition")))
        print(md_bullet("Notes", pick(row, "notes")))
        print("")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
