#!/usr/bin/env python3
"""Generate a targeted UX checklist from detailed UX/app-interface matrices.

Usage:
  python scripts/generate_ux_checklist.py forms mobile accessibility
  python scripts/generate_ux_checklist.py keyboard navigation --severity High
"""

from __future__ import annotations

import argparse
from _catalog import rank_csv, pick


def emit(rows: list[dict[str, str]], title: str, severity: str) -> None:
    filtered = []
    for row in rows:
        if severity and severity.lower() not in pick(row, "Severity").lower():
            continue
        filtered.append(row)
    if not filtered:
        return
    print(f"## {title}\n")
    for row in filtered:
        label = " / ".join(part for part in [pick(row, "Category"), pick(row, "Issue")] if part)
        print(f"- [ ] **{label}**")
        description = pick(row, "Description")
        do = pick(row, "Do")
        dont = pick(row, "Don't")
        severity_value = pick(row, "Severity")
        if description:
            print(f"  - Description: {description}")
        if do:
            print(f"  - Do: {do}")
        if dont:
            print(f"  - Don't: {dont}")
        if severity_value:
            print(f"  - Severity: {severity_value}")
    print("")


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate targeted UX checklist")
    parser.add_argument("query", nargs="+")
    parser.add_argument("--severity", default="", help="Filter by severity substring")
    parser.add_argument("-n", "--limit", type=int, default=12)
    args = parser.parse_args()
    query = " ".join(args.query)
    print(f"# UX Checklist: {query}\n")
    emit(rank_csv("ux-guidelines.csv", query, args.limit), "UX Guidelines", args.severity)
    emit(rank_csv("app-interface-guidelines.csv", query, max(4, args.limit // 2)), "App Interface Guidelines", args.severity)
    print("## Universal Floor\n")
    print("- [ ] Keyboard path works for the full flow.")
    print("- [ ] Focus is visible and logical.")
    print("- [ ] Contrast is checked for text, controls, borders, focus, and status.")
    print("- [ ] Mobile width has no accidental horizontal scroll.")
    print("- [ ] Loading, empty, error, disabled, and success states exist.")
    print("- [ ] Motion respects reduced-motion preferences.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
